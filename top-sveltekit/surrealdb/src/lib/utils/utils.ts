export const slugFromPath = (path) => path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null

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