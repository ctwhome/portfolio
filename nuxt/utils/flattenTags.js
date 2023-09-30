
export default function (tags) {
  const mergedTags = []
  tags.map(article => mergedTags.push(article.tags))
  // Flatten array and remove duplicates
  return [...new Set(mergedTags.flat())]
}
