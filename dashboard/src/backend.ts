import { Database } from "bun:sqlite"

export const DB_PATH = process.env.DB_PATH || "./dashboard.sqlite"
export const PORT = Number(process.env.PORT || 3000)
export const STATIC_DIR = "./public"

const db = new Database(DB_PATH, { create: true, strict: true })

const HOUSING_REFRESH_MINUTES = Number(process.env.HOUSING_REFRESH_MINUTES || 12 * 60)
const TOPIC_REFRESH_MINUTES = Number(process.env.TOPIC_REFRESH_MINUTES || 60)
const MAX_TOPIC_ITEMS = Number(process.env.TOPIC_ITEM_LIMIT || 10)

const CITY_CONFIG = [
  { city: "Amsterdam", regionKey: "GM0363", regionTitle: "Amsterdam" },
  { city: "Rotterdam", regionKey: "GM0599", regionTitle: "Rotterdam" },
  { city: "Utrecht", regionKey: "GM0344", regionTitle: "Utrecht (municipality)" }
] as const

const GOOGLE_NEWS_PARAMS = "hl=en-US&gl=US&ceid=US:en"

let refreshPromise: Promise<unknown> | null = null

function nowIso() {
  return new Date().toISOString()
}

function ensureColumn(table: string, column: string, definition: string) {
  const columns = db.query(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>
  if (!columns.some((entry) => entry.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${definition}`)
  }
}

function tableExists(table: string) {
  const row = db.query(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table' AND name = ?
  `).get(table)
  return Boolean(row)
}

function parsePeriodKey(periodKey: string) {
  const yearMatch = /^(\d{4})JJ00$/.exec(periodKey)
  if (yearMatch) {
    return {
      label: yearMatch[1],
      granularity: "year",
      sortOrder: Number(`${yearMatch[1]}00`)
    }
  }

  const quarterMatch = /^(\d{4})KW0(\d)$/.exec(periodKey)
  if (quarterMatch) {
    return {
      label: `${quarterMatch[1]}-Q${quarterMatch[2]}`,
      granularity: "quarter",
      sortOrder: Number(`${quarterMatch[1]}0${quarterMatch[2]}`)
    }
  }

  return {
    label: periodKey,
    granularity: "unknown",
    sortOrder: Number(periodKey.replace(/\D/g, "").padEnd(6, "0"))
  }
}

function buildTopicFeedUrl(query: string, feedUrl?: string | null) {
  if (feedUrl?.trim()) return feedUrl.trim()
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&${GOOGLE_NEWS_PARAMS}`
}

function stripTags(input: string) {
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function decodeXml(input: string) {
  return input
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function extractTag(block: string, tagName: string) {
  const match = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i").exec(block)
  return match ? decodeXml(match[1]).trim() : ""
}

function normalizeArticleTitle(title: string) {
  return title.replace(/\s+-\s+[^-]+$/, "").trim()
}

function sanitizeUrl(raw: string) {
  try {
    const url = new URL(raw.trim())
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString()
    }
  } catch {
    return ""
  }
  return ""
}

function parseGoogleNewsRss(xml: string) {
  const matches = xml.match(/<item>[\s\S]*?<\/item>/g) || []
  return matches.map((block) => {
    const title = normalizeArticleTitle(extractTag(block, "title"))
    const url = sanitizeUrl(extractTag(block, "link"))
    const source = extractTag(block, "source") || "Google News"
    const publishedAt = extractTag(block, "pubDate")
    const description = stripTags(decodeXml(extractTag(block, "description")))
    const guid = extractTag(block, "guid") || url
    return { title, url, source, publishedAt, description, guid }
  }).filter((item) => item.title && item.url)
}

function monthsBetween(startedAt: string, endedAt = new Date()) {
  const start = new Date(startedAt)
  if (Number.isNaN(start.getTime()) || start > endedAt) return 0

  let months = (endedAt.getFullYear() - start.getFullYear()) * 12 + (endedAt.getMonth() - start.getMonth())
  if (endedAt.getDate() < start.getDate()) months -= 1
  return Math.max(months, 0)
}

function addInterval(date: Date, interval: string) {
  const copy = new Date(date)
  if (interval === "monthly") copy.setMonth(copy.getMonth() + 1)
  else if (interval === "quarterly") copy.setMonth(copy.getMonth() + 3)
  else if (interval === "yearly") copy.setFullYear(copy.getFullYear() + 1)
  else copy.setMonth(copy.getMonth() + 1)
  return copy
}

function countCharges(startedAt: string, interval: string, endedAt = new Date()) {
  const start = new Date(startedAt)
  if (Number.isNaN(start.getTime()) || start > endedAt) return 0

  let count = 0
  let cursor = start
  while (cursor <= endedAt) {
    count += 1
    cursor = addInterval(cursor, interval)
  }
  return count
}

function intervalLabel(interval: string) {
  if (interval === "yearly") return "year"
  if (interval === "quarterly") return "quarter"
  return "month"
}

function monthlyEquivalent(priceCents: number, interval: string) {
  if (interval === "yearly") return priceCents / 12
  if (interval === "quarterly") return priceCents / 3
  return priceCents
}

function getRefreshRow(module: string) {
  return db.query(`
    SELECT module, last_success_at, last_attempt_at, status, message
    FROM refresh_state
    WHERE module = ?
  `).get(module) as null | {
    module: string
    last_success_at: string | null
    last_attempt_at: string | null
    status: string | null
    message: string | null
  }
}

function setRefreshState(module: string, status: string, message = "", success = false) {
  const timestamp = nowIso()
  db.query(`
    INSERT INTO refresh_state (module, last_success_at, last_attempt_at, status, message)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(module) DO UPDATE SET
      last_success_at = excluded.last_success_at,
      last_attempt_at = excluded.last_attempt_at,
      status = excluded.status,
      message = excluded.message
  `).run(
    module,
    success ? timestamp : getRefreshRow(module)?.last_success_at || null,
    timestamp,
    status,
    message
  )
}

function isModuleStale(module: string, minutes: number) {
  const row = getRefreshRow(module)
  if (!row?.last_success_at) return true
  const lastSuccess = new Date(row.last_success_at)
  if (Number.isNaN(lastSuccess.getTime())) return true
  return Date.now() - lastSuccess.getTime() > minutes * 60 * 1000
}

export function initializeBackend() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS housing_market_series (
      city TEXT NOT NULL,
      region_key TEXT NOT NULL,
      region_title TEXT NOT NULL,
      period_key TEXT NOT NULL,
      period_label TEXT NOT NULL,
      granularity TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      price_index REAL,
      yoy_change_pct REAL,
      dwellings_sold INTEGER,
      average_purchase_price_eur REAL,
      total_purchase_value_million REAL,
      source_table TEXT NOT NULL,
      fetched_at TEXT NOT NULL,
      PRIMARY KEY (city, period_key)
    );

    CREATE TABLE IF NOT EXISTS interest_topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      query TEXT NOT NULL,
      notes TEXT,
      feed_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      last_collected_at TEXT,
      last_error TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS interest_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      guid TEXT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      source TEXT NOT NULL,
      summary TEXT,
      published_at TEXT NOT NULL,
      relevance_score REAL NOT NULL DEFAULT 0,
      FOREIGN KEY (topic_id) REFERENCES interest_topics(id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      interval TEXT NOT NULL,
      started_at TEXT NOT NULL,
      notes TEXT,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS refresh_state (
      module TEXT PRIMARY KEY,
      last_success_at TEXT,
      last_attempt_at TEXT,
      status TEXT,
      message TEXT
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_interest_articles_topic_url
    ON interest_articles (topic_id, url);
  `)

  ensureColumn("interest_topics", "feed_url", "feed_url TEXT")
  ensureColumn("interest_topics", "is_active", "is_active INTEGER NOT NULL DEFAULT 1")
  ensureColumn("interest_topics", "last_collected_at", "last_collected_at TEXT")
  ensureColumn("interest_topics", "last_error", "last_error TEXT")
  ensureColumn("interest_articles", "guid", "guid TEXT")
  ensureColumn("interest_articles", "summary", "summary TEXT")

  db.query(`DELETE FROM interest_articles WHERE url LIKE 'https://example.com/%'`).run()
  if (tableExists("housing_series")) {
    db.query(`DELETE FROM housing_series WHERE source = 'seed'`).run()
  }
}

export async function collectHousingData(options: { force?: boolean } = {}) {
  if (!options.force && !isModuleStale("housing", HOUSING_REFRESH_MINUTES)) {
    return { module: "housing", status: "skipped", message: "Housing data is fresh." }
  }

  setRefreshState("housing", "running", "Refreshing official CBS housing data.")

  const filter = CITY_CONFIG.map((entry) => `Regions eq '${entry.regionKey}'`).join(" or ")
  const params = new URLSearchParams({
    $filter: `(${filter})`,
    $top: "2000"
  })
  const url = `https://opendata.cbs.nl/ODataApi/OData/85792ENG/TypedDataSet?${params.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Personal-Signal-Desk/1.0"
      }
    })
    if (!response.ok) {
      throw new Error(`Housing request failed with ${response.status}`)
    }

    const payload = await response.json() as {
      value: Array<{
        Regions: string
        Periods: string
        PriceIndexPurchasePrices_1: number | null
        ChangesComparedToOneYearEarlier_3: number | null
        NumberOfDwellingsSold_4: number | null
        AveragePurchasePrice_7: number | null
        TotalValuePurchasePrices_8: number | null
      }>
    }

    const regionMap = new Map(CITY_CONFIG.map((entry) => [entry.regionKey, entry]))
    const fetchedAt = nowIso()

    const insert = db.query(`
      INSERT INTO housing_market_series (
        city,
        region_key,
        region_title,
        period_key,
        period_label,
        granularity,
        sort_order,
        price_index,
        yoy_change_pct,
        dwellings_sold,
        average_purchase_price_eur,
        total_purchase_value_million,
        source_table,
        fetched_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(city, period_key) DO UPDATE SET
        region_key = excluded.region_key,
        region_title = excluded.region_title,
        period_label = excluded.period_label,
        granularity = excluded.granularity,
        sort_order = excluded.sort_order,
        price_index = excluded.price_index,
        yoy_change_pct = excluded.yoy_change_pct,
        dwellings_sold = excluded.dwellings_sold,
        average_purchase_price_eur = excluded.average_purchase_price_eur,
        total_purchase_value_million = excluded.total_purchase_value_million,
        source_table = excluded.source_table,
        fetched_at = excluded.fetched_at
    `)

    db.transaction(() => {
      for (const row of payload.value) {
        const city = regionMap.get(row.Regions)
        if (!city) continue
        const period = parsePeriodKey(row.Periods)
        insert.run(
          city.city,
          city.regionKey,
          city.regionTitle,
          row.Periods,
          period.label,
          period.granularity,
          period.sortOrder,
          row.PriceIndexPurchasePrices_1,
          row.ChangesComparedToOneYearEarlier_3,
          row.NumberOfDwellingsSold_4,
          row.AveragePurchasePrice_7,
          row.TotalValuePurchasePrices_8,
          "85792ENG",
          fetchedAt
        )
      }
    })()

    setRefreshState("housing", "ok", `Stored ${payload.value.length} rows from CBS.`, true)
    return { module: "housing", status: "ok", rows: payload.value.length }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Housing refresh failed"
    setRefreshState("housing", "error", message)
    return { module: "housing", status: "error", message }
  }
}

export function addInterestTopic(input: {
  name?: string
  query?: string
  notes?: string
  feed_url?: string
}) {
  const name = input.name?.trim() || ""
  const query = input.query?.trim() || ""
  const notes = input.notes?.trim() || ""
  const feedUrl = input.feed_url?.trim() || null

  if (!name || !query) {
    throw new Error("Name and query are required")
  }

  db.query(`
    INSERT INTO interest_topics (name, query, notes, feed_url)
    VALUES (?, ?, ?, ?)
  `).run(name, query, notes, feedUrl)

  return db.query(`
    SELECT id, name, query, notes, feed_url, is_active, last_collected_at, last_error, created_at
    FROM interest_topics
    ORDER BY id DESC
    LIMIT 1
  `).get() as {
    id: number
    name: string
    query: string
    notes: string
    feed_url: string | null
    is_active: number
    last_collected_at: string | null
    last_error: string | null
    created_at: string
  }
}

export function getInterestTopics() {
  return db.query(`
    SELECT
      t.id,
      t.name,
      t.query,
      t.notes,
      t.feed_url,
      t.is_active,
      t.last_collected_at,
      t.last_error,
      COUNT(a.id) AS article_count,
      MAX(a.published_at) AS latest_article_at
    FROM interest_topics t
    LEFT JOIN interest_articles a ON a.topic_id = t.id
    WHERE t.is_active = 1
    GROUP BY t.id
    ORDER BY COALESCE(t.last_collected_at, t.created_at) DESC, t.name ASC
  `).all()
}

async function collectTopic(topic: {
  id: number
  name: string
  query: string
  feed_url: string | null
}) {
  const feedUrl = buildTopicFeedUrl(topic.query, topic.feed_url)
  const response = await fetch(feedUrl, {
    headers: {
      "User-Agent": "Personal-Signal-Desk/1.0"
    }
  })

  if (!response.ok) {
    throw new Error(`Topic feed request failed with ${response.status}`)
  }

  const xml = await response.text()
  const items = parseGoogleNewsRss(xml).slice(0, MAX_TOPIC_ITEMS)
  const now = nowIso()

  const insertArticle = db.query(`
    INSERT INTO interest_articles (topic_id, guid, title, url, source, summary, published_at, relevance_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(topic_id, url) DO UPDATE SET
      guid = excluded.guid,
      title = excluded.title,
      source = excluded.source,
      summary = excluded.summary,
      published_at = excluded.published_at,
      relevance_score = excluded.relevance_score
  `)

  db.transaction(() => {
    for (const item of items) {
      const relevanceScore = Math.max(0.35, 1 - items.indexOf(item) * 0.06)
      insertArticle.run(
        topic.id,
        item.guid,
        item.title,
        item.url,
        item.source,
        item.description,
        new Date(item.publishedAt || now).toISOString(),
        Number(relevanceScore.toFixed(2))
      )
    }

    db.query(`
      UPDATE interest_topics
      SET last_collected_at = ?, last_error = NULL
      WHERE id = ?
    `).run(now, topic.id)
  })()

  return items.length
}

export async function collectTopicArticles(options: { force?: boolean, topicId?: number } = {}) {
  if (!options.force && !isModuleStale("topics", TOPIC_REFRESH_MINUTES) && !options.topicId) {
    return { module: "topics", status: "skipped", message: "Topic feeds are fresh." }
  }

  setRefreshState("topics", "running", "Refreshing topic feeds.")

  const topicRows = db.query(`
    SELECT id, name, query, feed_url, last_collected_at
    FROM interest_topics
    WHERE is_active = 1
    ${options.topicId ? "AND id = ?" : ""}
    ORDER BY id ASC
  `).all(...(options.topicId ? [options.topicId] : [])) as Array<{
    id: number
    name: string
    query: string
    feed_url: string | null
    last_collected_at: string | null
  }>

  if (topicRows.length === 0) {
    setRefreshState("topics", "ok", "No active topics yet.", true)
    return { module: "topics", status: "ok", topics: 0, articles: 0 }
  }

  let collectedTopics = 0
  let collectedArticles = 0
  const errors: string[] = []

  for (const topic of topicRows) {
    const lastCollectedAt = topic.last_collected_at ? new Date(topic.last_collected_at) : null
    const stillFresh = lastCollectedAt && (Date.now() - lastCollectedAt.getTime()) < TOPIC_REFRESH_MINUTES * 60 * 1000
    if (!options.force && !options.topicId && stillFresh) {
      continue
    }

    try {
      collectedArticles += await collectTopic(topic)
      collectedTopics += 1
    } catch (error) {
      const message = error instanceof Error ? error.message : "Topic refresh failed"
      errors.push(`${topic.name}: ${message}`)
      db.query(`
        UPDATE interest_topics
        SET last_error = ?
        WHERE id = ?
      `).run(message, topic.id)
    }
  }

  db.query(`
    DELETE FROM interest_articles
    WHERE published_at < datetime('now', '-45 days')
  `).run()

  if (errors.length > 0 && collectedTopics === 0) {
    setRefreshState("topics", "error", errors.join(" | "))
    return { module: "topics", status: "error", message: errors.join(" | ") }
  }

  setRefreshState("topics", "ok", `Collected ${collectedArticles} articles across ${collectedTopics} topics.`, true)
  return { module: "topics", status: "ok", topics: collectedTopics, articles: collectedArticles, errors }
}

export function addSubscription(input: {
  name?: string
  category?: string
  price_eur?: number | string
  currency?: string
  interval?: string
  started_at?: string
  notes?: string
}) {
  const name = input.name?.trim() || ""
  const category = input.category?.trim() || "General"
  const interval = input.interval?.trim() || "monthly"
  const startedAt = input.started_at?.trim() || new Date().toISOString().slice(0, 10)
  const notes = input.notes?.trim() || ""
  const currency = (input.currency?.trim() || "EUR").toUpperCase()
  const priceEur = Number(input.price_eur)

  if (!name) throw new Error("Subscription name is required")
  if (!Number.isFinite(priceEur) || priceEur <= 0) throw new Error("Subscription price must be a positive number")
  if (!["monthly", "quarterly", "yearly"].includes(interval)) throw new Error("Unsupported billing interval")
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startedAt)) throw new Error("Start date must be YYYY-MM-DD")

  db.query(`
    INSERT INTO subscriptions (name, category, price_cents, currency, interval, started_at, notes, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `).run(
    name,
    category,
    Math.round(priceEur * 100),
    currency,
    interval,
    startedAt,
    notes
  )

  return db.query(`
    SELECT id, name, category, price_cents, currency, interval, started_at, notes, active
    FROM subscriptions
    ORDER BY id DESC
    LIMIT 1
  `).get()
}

export function archiveSubscription(id: number) {
  db.query(`
    UPDATE subscriptions
    SET active = 0
    WHERE id = ?
  `).run(id)
}

export function getSubscriptions() {
  const rows = db.query(`
    SELECT
      id,
      name,
      category,
      price_cents,
      currency,
      interval,
      started_at,
      notes,
      active
    FROM subscriptions
    WHERE active = 1
    ORDER BY price_cents DESC, name ASC
  `).all() as Array<{
    id: number
    name: string
    category: string
    price_cents: number
    currency: string
    interval: string
    started_at: string
    notes: string | null
    active: number
  }>

  return rows.map((row) => {
    const chargeCount = countCharges(row.started_at, row.interval)
    const totalSpentCents = chargeCount * row.price_cents
    return {
      ...row,
      billing_label: `per ${intervalLabel(row.interval)}`,
      months_active: Number(monthsBetween(row.started_at).toFixed(1)),
      monthly_equivalent_eur: Number((monthlyEquivalent(row.price_cents, row.interval) / 100).toFixed(2)),
      total_spent_eur: Number((totalSpentCents / 100).toFixed(2)),
      charge_count: chargeCount
    }
  })
}

function getRefreshSummary() {
  const rows = db.query(`
    SELECT module, last_success_at, last_attempt_at, status, message
    FROM refresh_state
    ORDER BY module ASC
  `).all()

  return Object.fromEntries(
    rows.map((row: any) => [row.module, row])
  )
}

export async function getInterestArticles(topicId: number | null) {
  const count = db.query(`SELECT COUNT(*) AS count FROM interest_articles`).get() as { count: number }
  if (count.count === 0) {
    await collectTopicArticles({ force: true })
  }

  const params = topicId ? [topicId] : []
  return db.query(`
    SELECT
      a.id,
      a.title,
      a.url,
      a.source,
      a.summary,
      a.published_at,
      a.relevance_score,
      t.name AS topic_name
    FROM interest_articles a
    JOIN interest_topics t ON t.id = a.topic_id
    ${topicId ? "WHERE t.id = ?" : ""}
    ORDER BY a.published_at DESC, a.relevance_score DESC
    LIMIT 24
  `).all(...params)
}

async function ensureHousingLoaded(city: string) {
  const row = db.query(`
    SELECT COUNT(*) AS count
    FROM housing_market_series
    WHERE city = ?
  `).get(city) as { count: number }

  if (row.count === 0) {
    await collectHousingData({ force: true })
  }
}

export async function getHousingPayload(city = "Amsterdam", granularity = "quarter") {
  await ensureHousingLoaded(city)

  const series = db.query(`
    SELECT
      city,
      period_key,
      period_label,
      granularity,
      price_index,
      yoy_change_pct,
      dwellings_sold,
      average_purchase_price_eur,
      total_purchase_value_million,
      fetched_at
    FROM housing_market_series
    WHERE city = ?
      AND granularity = ?
    ORDER BY sort_order ASC
  `).all(city, granularity)

  const latestQuarter = db.query(`
    SELECT
      period_label,
      price_index,
      yoy_change_pct,
      dwellings_sold,
      average_purchase_price_eur
    FROM housing_market_series
    WHERE city = ?
      AND granularity = 'quarter'
    ORDER BY sort_order DESC
    LIMIT 1
  `).get(city)

  const latestYear = db.query(`
    SELECT
      period_label,
      price_index,
      average_purchase_price_eur
    FROM housing_market_series
    WHERE city = ?
      AND granularity = 'year'
    ORDER BY sort_order DESC
    LIMIT 1
  `).get(city)

  return {
    city,
    granularity,
    series,
    latest_quarter: latestQuarter,
    latest_year: latestYear
  }
}

export async function getDashboardPayload() {
  await ensureHousingLoaded("Amsterdam")

  const housing = await getHousingPayload("Amsterdam", "quarter")
  const latestHousing = housing.latest_quarter as null | {
    period_label: string
    price_index: number | null
    yoy_change_pct: number | null
    average_purchase_price_eur: number | null
    dwellings_sold: number | null
  }

  const topics = getInterestTopics()
  const subscriptions = getSubscriptions()
  const monthlySpend = subscriptions.reduce((sum, entry) => sum + entry.monthly_equivalent_eur, 0)
  const totalSpent = subscriptions.reduce((sum, entry) => sum + entry.total_spent_eur, 0)

  return {
    cards: [
      {
        label: "Amsterdam avg purchase price",
        value: latestHousing?.average_purchase_price_eur
          ? new Intl.NumberFormat("en-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(latestHousing.average_purchase_price_eur)
          : "Waiting for data",
        detail: latestHousing
          ? `${latestHousing.period_label} | ${latestHousing.dwellings_sold ?? 0} dwellings sold`
          : "Official CBS quarterly data"
      },
      {
        label: "Amsterdam price index",
        value: latestHousing?.price_index ? latestHousing.price_index.toFixed(1) : "n/a",
        detail: latestHousing?.yoy_change_pct != null
          ? `${latestHousing.yoy_change_pct.toFixed(1)}% vs one year earlier`
          : "No year-on-year comparison yet"
      },
      {
        label: "Tracked interests",
        value: String(topics.length),
        detail: `${topics.filter((topic: any) => topic.last_error).length} feeds with recent errors`
      },
      {
        label: "Subscription load",
        value: new Intl.NumberFormat("en-NL", { style: "currency", currency: "EUR" }).format(monthlySpend),
        detail: `${new Intl.NumberFormat("en-NL", { style: "currency", currency: "EUR" }).format(totalSpent)} spent since start dates`
      }
    ],
    meta: {
      refresh: getRefreshSummary(),
      available_cities: CITY_CONFIG.map((entry) => entry.city)
    }
  }
}

export async function refreshAll(options: { force?: boolean, module?: string } = {}) {
  const task = async () => {
    if (options.module === "housing") {
      return { results: [await collectHousingData(options)] }
    }

    if (options.module === "topics") {
      return { results: [await collectTopicArticles(options)] }
    }

    const results = await Promise.all([
      collectHousingData(options),
      collectTopicArticles(options)
    ])
    return { results }
  }

  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = task().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}
