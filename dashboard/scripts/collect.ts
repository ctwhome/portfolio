import { initializeBackend, refreshAll } from "../src/backend"

initializeBackend()

const result = await refreshAll({ force: true })
console.log(JSON.stringify(result, null, 2))
