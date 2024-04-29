export const slugFromPath = (path) => path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null

export const readEnv = (id, defaultValue = "") => {
  if (import.meta.env[id] !== undefined) {
    return import.meta.env[id]
  }
  return defaultValue
}

export const getOS = () => {
}

export const subString = (input, from, to) => {
  return input.slice(input.indexOf(from) + from.length, input.lastIndexOf(to))
}

export const timeago = (timestamp, locale = "en") => {
}

export const formattedDate = (date) => {
  return new Date(date).toLocaleDateString("en-UK", { dateStyle: "medium" })
}

export const slugify = (str) => {
}