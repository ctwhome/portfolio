import { existsSync } from "node:fs"
import {
  DB_PATH,
  PORT,
  STATIC_DIR,
  addInterestTopic,
  addSubscription,
  archiveSubscription,
  collectTopicArticles,
  getDashboardPayload,
  getHousingPayload,
  getInterestArticles,
  getInterestTopics,
  getSubscriptions,
  initializeBackend,
  refreshAll
} from "./src/backend"

function parseBasicAuth(request: Request) {
  const header = request.headers.get("authorization")
  if (!header || !header.startsWith("Basic ")) return null

  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8")
    const [username, password] = decoded.split(":")
    return { username, password }
  } catch {
    return null
  }
}

function requireAuth(request: Request) {
  const username = process.env.DASHBOARD_USERNAME
  const password = process.env.DASHBOARD_PASSWORD
  if (!username || !password) return null

  const credentials = parseBasicAuth(request)
  if (credentials?.username === username && credentials.password === password) {
    return null
  }

  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Personal Dashboard"'
    }
  })
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  })
}

initializeBackend()
void refreshAll({ force: false })

setInterval(() => {
  void refreshAll({ force: false })
}, 15 * 60 * 1000)

const server = Bun.serve({
  port: PORT,
  async fetch(request) {
    const authResponse = requireAuth(request)
    if (authResponse) return authResponse

    const url = new URL(request.url)

    if (url.pathname === "/api/dashboard" && request.method === "GET") {
      return json(await getDashboardPayload())
    }

    if (url.pathname === "/api/housing" && request.method === "GET") {
      const city = url.searchParams.get("city") || "Amsterdam"
      const granularity = url.searchParams.get("granularity") || "quarter"
      return json(await getHousingPayload(city, granularity))
    }

    if (url.pathname === "/api/topics" && request.method === "GET") {
      return json({ topics: getInterestTopics() })
    }

    if (url.pathname === "/api/topics" && request.method === "POST") {
      try {
        const payload = await request.json()
        const topic = addInterestTopic(payload)
        await collectTopicArticles({ force: true, topicId: topic.id })
        return json({ topic }, 201)
      } catch (error) {
        return json({ error: error instanceof Error ? error.message : "Invalid payload" }, 400)
      }
    }

    if (url.pathname === "/api/articles" && request.method === "GET") {
      const topicId = url.searchParams.get("topicId")
      return json({ articles: await getInterestArticles(topicId ? Number(topicId) : null) })
    }

    if (url.pathname === "/api/subscriptions" && request.method === "GET") {
      return json({ subscriptions: getSubscriptions() })
    }

    if (url.pathname === "/api/subscriptions" && request.method === "POST") {
      try {
        const payload = await request.json()
        const subscription = addSubscription(payload)
        return json({ subscription }, 201)
      } catch (error) {
        return json({ error: error instanceof Error ? error.message : "Invalid payload" }, 400)
      }
    }

    if (/^\/api\/subscriptions\/\d+\/archive$/.test(url.pathname) && request.method === "POST") {
      const id = Number(url.pathname.split("/")[3])
      archiveSubscription(id)
      return json({ ok: true })
    }

    if (url.pathname === "/api/refresh" && request.method === "POST") {
      const payload = await request.json().catch(() => ({}))
      return json(await refreshAll({
        force: payload?.force === true,
        module: payload?.module || "all"
      }))
    }

    if (url.pathname.startsWith("/api/")) {
      return json({ error: "Not found" }, 404)
    }

    let path = url.pathname === "/" ? "/index.html" : url.pathname
    if (path.includes("..")) {
      return new Response("Forbidden", { status: 403 })
    }

    const filePath = `${STATIC_DIR}${path}`
    if (existsSync(filePath)) {
      return new Response(Bun.file(filePath))
    }

    return new Response("Not found", { status: 404 })
  }
})

console.log(`Dashboard running at http://localhost:${server.port}`)
console.log(`SQLite database: ${DB_PATH}`)
