const summaryContainer = document.querySelector("#summary-cards")
const topicContainer = document.querySelector("#topic-list")
const articleContainer = document.querySelector("#article-list")
const subscriptionContainer = document.querySelector("#subscription-list")
const citySelect = document.querySelector("#city-select")
const granularitySelect = document.querySelector("#granularity-select")
const topicForm = document.querySelector("#topic-form")
const topicNameInput = document.querySelector("#topic-name")
const topicQueryInput = document.querySelector("#topic-query")
const topicFeedUrlInput = document.querySelector("#topic-feed-url")
const topicNotesInput = document.querySelector("#topic-notes")
const subscriptionForm = document.querySelector("#subscription-form")
const refreshButton = document.querySelector("#refresh-button")
const refreshStatus = document.querySelector("#refresh-status")
const refreshMeta = document.querySelector("#refresh-meta")
const articleTopicFilter = document.querySelector("#article-topic-filter")
const housingCaption = document.querySelector("#housing-caption")

let housingChart

function formatCurrency(amount, currency = "EUR", maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-NL", {
    style: "currency",
    currency,
    maximumFractionDigits
  }).format(amount)
}

function formatDateTime(dateString) {
  if (!dateString) return "Never"
  return new Date(dateString).toLocaleString("en-NL", {
    dateStyle: "medium",
    timeStyle: "short"
  })
}

async function getJson(path) {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Request failed for ${path}`)
  }
  return response.json()
}

async function postJson(path, payload = {}) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Request failed for ${path}`)
  }

  return response.json()
}

function renderSummary(cards) {
  summaryContainer.innerHTML = cards.map((card) => `
    <article class="panel p-5">
      <p class="eyebrow">${card.label}</p>
      <div class="mt-4 flex items-end justify-between gap-3">
        <p class="text-3xl font-semibold text-neutral">${card.value}</p>
      </div>
      <p class="mt-3 text-sm leading-6 text-neutral">${card.detail}</p>
    </article>
  `).join("")
}

function renderRefreshMeta(meta) {
  const housing = meta.refresh.housing || {}
  const topics = meta.refresh.topics || {}

  refreshStatus.textContent = `Housing: ${housing.status || "idle"} | Topics: ${topics.status || "idle"}`
  refreshMeta.innerHTML = `
    <div class="rounded-2xl border border-base-300 bg-base-100 p-3">
      <p class="eyebrow">Housing</p>
      <p class="mt-2">${formatDateTime(housing.last_success_at)}</p>
      <p class="mt-1 text-sm">${housing.message || "No refresh yet."}</p>
    </div>
    <div class="rounded-2xl border border-base-300 bg-base-100 p-3">
      <p class="eyebrow">Topics</p>
      <p class="mt-2">${formatDateTime(topics.last_success_at)}</p>
      <p class="mt-1 text-sm">${topics.message || "No refresh yet."}</p>
    </div>
  `
}

function populateArticleFilter(topics) {
  const currentValue = articleTopicFilter.value
  articleTopicFilter.innerHTML = [
    `<option value="">All topics</option>`,
    ...topics.map((topic) => `<option value="${topic.id}">${topic.name}</option>`)
  ].join("")
  articleTopicFilter.value = currentValue
}

function renderTopics(topics) {
  populateArticleFilter(topics)

  if (topics.length === 0) {
    topicContainer.innerHTML = `
      <div class="rounded-[1.5rem] border border-dashed border-base-300 bg-base-100 p-6 text-sm text-neutral">
        No tracked topics yet. Add one above and the server will fetch its feed immediately.
      </div>
    `
    return
  }

  topicContainer.innerHTML = topics.map((topic) => `
    <article class="rounded-[1.5rem] border border-base-300 bg-base-100 p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-neutral">${topic.name}</h3>
          <p class="mt-1 text-sm text-neutral">${topic.query}</p>
        </div>
        <span class="badge badge-outline">${topic.article_count} articles</span>
      </div>
      <p class="mt-3 text-sm leading-6 text-neutral">${topic.notes || "No notes yet."}</p>
      <div class="mt-4 grid gap-2 text-sm text-neutral">
        <p><strong>Last collected:</strong> ${formatDateTime(topic.last_collected_at)}</p>
        <p><strong>Source:</strong> ${topic.feed_url || "Google News RSS query feed"}</p>
        <p><strong>Status:</strong> ${topic.last_error || "OK"}</p>
      </div>
    </article>
  `).join("")
}

function renderArticles(articles) {
  if (articles.length === 0) {
    articleContainer.innerHTML = `
      <div class="rounded-[1.5rem] border border-dashed border-base-300 bg-base-100 p-6 text-sm text-neutral">
        No collected articles yet. Add a topic or run a refresh.
      </div>
    `
    return
  }

  articleContainer.innerHTML = articles.map((article) => `
    <a class="block rounded-[1.5rem] border border-base-300 bg-base-100 p-4 transition hover:-translate-y-0.5 hover:border-primary" href="${article.url}" target="_blank" rel="noreferrer">
      <div class="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
        <span>${article.topic_name}</span>
        <span>${new Date(article.published_at).toLocaleDateString("en-NL")}</span>
      </div>
      <h3 class="mt-3 text-lg font-semibold text-neutral">${article.title}</h3>
      <p class="mt-2 text-sm text-neutral">${article.source} | relevance ${Math.round(article.relevance_score * 100)}%</p>
      <p class="mt-3 text-sm leading-6 text-neutral">${article.summary || "No summary available."}</p>
    </a>
  `).join("")
}

function renderSubscriptions(subscriptions) {
  if (subscriptions.length === 0) {
    subscriptionContainer.innerHTML = `
      <div class="rounded-[1.5rem] border border-dashed border-base-300 bg-base-100 p-6 text-sm text-neutral">
        No subscriptions yet. Add the first one above.
      </div>
    `
    return
  }

  subscriptionContainer.innerHTML = subscriptions.map((subscription) => `
    <article class="rounded-[1.5rem] border border-base-300 bg-base-100 p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-neutral">${subscription.name}</h3>
          <p class="mt-1 text-sm text-neutral">${subscription.category}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="badge badge-primary badge-outline">${formatCurrency(subscription.price_cents / 100, subscription.currency)}</span>
          <button class="btn btn-ghost btn-sm" data-archive-subscription="${subscription.id}">Archive</button>
        </div>
      </div>
      <div class="mt-4 grid gap-3 md:grid-cols-3 text-sm text-neutral">
        <div>
          <p class="eyebrow">Billing</p>
          <p class="mt-1 normal-case tracking-normal">${subscription.billing_label}</p>
        </div>
        <div>
          <p class="eyebrow">Monthly equivalent</p>
          <p class="mt-1 normal-case tracking-normal">${formatCurrency(subscription.monthly_equivalent_eur, subscription.currency)}</p>
        </div>
        <div>
          <p class="eyebrow">Total spent</p>
          <p class="mt-1 normal-case tracking-normal">${formatCurrency(subscription.total_spent_eur, subscription.currency)}</p>
        </div>
      </div>
      <div class="mt-4 grid gap-3 md:grid-cols-2 text-sm text-neutral">
        <p><strong>Started:</strong> ${subscription.started_at}</p>
        <p><strong>Age:</strong> ${subscription.months_active} months</p>
      </div>
      <p class="mt-3 text-sm leading-6 text-neutral">${subscription.notes || "No notes."}</p>
    </article>
  `).join("")
}

function renderHousingChart(data) {
  const labels = data.series.map((point) => point.period_label)
  const priceSeries = data.series.map((point) => point.average_purchase_price_eur)
  const soldSeries = data.series.map((point) => point.dwellings_sold)
  const indexSeries = data.series.map((point) => point.price_index)
  const context = document.querySelector("#housing-chart")

  if (housingChart) housingChart.destroy()

  housingChart = new Chart(context, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `${data.city} average purchase price`,
          data: priceSeries,
          borderColor: "#cf7448",
          backgroundColor: "rgba(207, 116, 72, 0.18)",
          yAxisID: "price",
          tension: 0.25,
          fill: true
        },
        {
          label: `${data.city} dwellings sold`,
          data: soldSeries,
          borderColor: "#46635b",
          backgroundColor: "rgba(70, 99, 91, 0.12)",
          yAxisID: "sold",
          tension: 0.22
        },
        {
          label: `${data.city} price index`,
          data: indexSeries,
          borderColor: "#17212b",
          backgroundColor: "rgba(23, 33, 43, 0.1)",
          yAxisID: "index",
          hidden: data.granularity === "quarter"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      scales: {
        price: {
          type: "linear",
          position: "left",
          ticks: {
            callback: (value) => `EUR ${Number(value).toLocaleString("en-US")}`
          }
        },
        sold: {
          type: "linear",
          position: "right",
          grid: {
            drawOnChartArea: false
          }
        },
        index: {
          type: "linear",
          position: "right",
          display: false
        }
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true
          }
        }
      }
    }
  })

  const latestQuarter = data.latest_quarter
  const latestYear = data.latest_year
  housingCaption.innerHTML = `
    <strong>${data.city}</strong> latest quarter: ${latestQuarter ? `${latestQuarter.period_label}, ${formatCurrency(latestQuarter.average_purchase_price_eur || 0, "EUR", 0)}, ${latestQuarter.dwellings_sold || 0} sold, ${latestQuarter.yoy_change_pct?.toFixed?.(1) ?? "n/a"}% YoY` : "No quarter yet."}
    <br />
    Latest year: ${latestYear ? `${latestYear.period_label}, ${formatCurrency(latestYear.average_purchase_price_eur || 0, "EUR", 0)}, index ${latestYear.price_index?.toFixed?.(1) ?? "n/a"}` : "No year yet."}
  `
}

async function loadDashboard() {
  const dashboard = await getJson("/api/dashboard")
  renderSummary(dashboard.cards)
  renderRefreshMeta(dashboard.meta)
}

async function loadHousing() {
  const data = await getJson(`/api/housing?city=${encodeURIComponent(citySelect.value)}&granularity=${encodeURIComponent(granularitySelect.value)}`)
  renderHousingChart(data)
}

async function loadTopics() {
  const data = await getJson("/api/topics")
  renderTopics(data.topics)
}

async function loadArticles() {
  const topicId = articleTopicFilter.value
  const path = topicId ? `/api/articles?topicId=${encodeURIComponent(topicId)}` : "/api/articles"
  const data = await getJson(path)
  renderArticles(data.articles)
}

async function loadSubscriptions() {
  const data = await getJson("/api/subscriptions")
  renderSubscriptions(data.subscriptions)
}

async function refreshAllViews() {
  await Promise.all([
    loadDashboard(),
    loadTopics(),
    loadArticles(),
    loadSubscriptions(),
    loadHousing()
  ])
}

citySelect.addEventListener("change", () => {
  void loadHousing()
})

granularitySelect.addEventListener("change", () => {
  void loadHousing()
})

articleTopicFilter.addEventListener("change", () => {
  void loadArticles()
})

refreshButton.addEventListener("click", async () => {
  refreshButton.disabled = true
  refreshButton.textContent = "Refreshing..."

  try {
    await postJson("/api/refresh", { force: true })
    await refreshAllViews()
  } catch (error) {
    alert(error.message)
  } finally {
    refreshButton.disabled = false
    refreshButton.textContent = "Refresh now"
  }
})

topicForm.addEventListener("submit", async (event) => {
  event.preventDefault()

  const submitButton = topicForm.querySelector("button[type='submit']")
  submitButton.disabled = true
  submitButton.textContent = "Adding..."

  try {
    await postJson("/api/topics", {
      name: topicNameInput.value,
      query: topicQueryInput.value,
      feed_url: topicFeedUrlInput.value,
      notes: topicNotesInput.value
    })

    topicForm.reset()
    await Promise.all([loadTopics(), loadArticles(), loadDashboard()])
  } catch (error) {
    alert(error.message)
  } finally {
    submitButton.disabled = false
    submitButton.textContent = "Add topic"
  }
})

subscriptionForm.addEventListener("submit", async (event) => {
  event.preventDefault()

  const submitButton = subscriptionForm.querySelector("button[type='submit']")
  const payload = {
    name: document.querySelector("#subscription-name").value,
    category: document.querySelector("#subscription-category").value,
    price_eur: document.querySelector("#subscription-price").value,
    interval: document.querySelector("#subscription-interval").value,
    started_at: document.querySelector("#subscription-started").value,
    notes: document.querySelector("#subscription-notes").value
  }

  submitButton.disabled = true
  submitButton.textContent = "Adding..."

  try {
    await postJson("/api/subscriptions", payload)
    subscriptionForm.reset()
    document.querySelector("#subscription-started").value = new Date().toISOString().slice(0, 10)
    await Promise.all([loadSubscriptions(), loadDashboard()])
  } catch (error) {
    alert(error.message)
  } finally {
    submitButton.disabled = false
    submitButton.textContent = "Add subscription"
  }
})

subscriptionContainer.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-archive-subscription]")
  if (!button) return

  const id = button.getAttribute("data-archive-subscription")
  button.disabled = true

  try {
    await postJson(`/api/subscriptions/${id}/archive`)
    await Promise.all([loadSubscriptions(), loadDashboard()])
  } catch (error) {
    alert(error.message)
    button.disabled = false
  }
})

async function bootstrap() {
  document.querySelector("#subscription-started").value = new Date().toISOString().slice(0, 10)
  await refreshAllViews()
}

bootstrap().catch((error) => {
  console.error(error)
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="fixed bottom-4 right-4 rounded-full bg-error px-5 py-3 text-sm font-semibold text-white shadow-lg">Failed to load dashboard data.</div>`
  )
})
