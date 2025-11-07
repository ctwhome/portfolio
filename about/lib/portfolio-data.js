import { decompressFromEncodedURIComponent } from 'lz-string'
import defaultProfile from '../content/profile.json'
import defaultSkills from '../content/skills.json'
import defaultProjects from '../content/projects.json'

/**
 * Get default portfolio data from JSON files
 */
export function getDefaultData() {
  return {
    profile: defaultProfile,
    skills: defaultSkills.skills,
    projects: defaultProjects.projects,
  }
}

/**
 * Parse and decompress portfolio data from URL parameter
 * @param {string} compressedData - LZ-compressed and URI-encoded data
 * @returns {object|null} Parsed data or null if invalid
 */
export function parseUrlData(compressedData) {
  if (!compressedData) return null

  try {
    const decompressed = decompressFromEncodedURIComponent(compressedData)
    if (!decompressed) return null

    const parsed = JSON.parse(decompressed)
    return parsed
  } catch (error) {
    console.error('Error parsing URL data:', error)
    return null
  }
}

/**
 * Merge URL data with defaults (URL data takes precedence)
 * @param {object} defaultData - Default portfolio data
 * @param {object} urlData - Data from URL parameter
 * @returns {object} Merged data
 */
export function mergeData(defaultData, urlData) {
  if (!urlData) return defaultData

  return {
    profile: { ...defaultData.profile, ...urlData.profile },
    skills: urlData.skills || defaultData.skills,
    projects: urlData.projects || defaultData.projects,
  }
}

/**
 * Get portfolio data with URL parameter override
 * @param {string} compressedData - LZ-compressed URL data (optional)
 * @returns {object} Complete portfolio data
 */
export function getPortfolioData(compressedData) {
  const defaultData = getDefaultData()
  const urlData = parseUrlData(compressedData)
  return mergeData(defaultData, urlData)
}
