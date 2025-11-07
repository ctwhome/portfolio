import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { getPortfolioData } from '../lib/portfolio-data'

/**
 * Custom hook to get portfolio data
 * Checks URL query params for compressed data, falls back to defaults
 * @returns {object} Portfolio data with profile, skills, and projects
 */
export function usePortfolioData() {
  const router = useRouter()
  const { data } = router.query

  return useMemo(() => {
    return getPortfolioData(data)
  }, [data])
}
