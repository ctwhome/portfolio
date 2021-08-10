export default function (tags) {
  const mergedTags = []
  tags.map(article => mergedTags.push(article.tags))
  // Flatten array and remove duplicates
  return mergedTags.reduce((a, b) => b.map((e, i) => a[i] instanceof Object ? a[i] : e), [])
}
