"use client"

import { useState } from "react"
import { fetchSearchResults } from "@/lib/api"
import type { SearchResult } from "@/lib/types"

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState<string>("")

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      setLastQuery("")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setLastQuery(query)

      const searchResults = await fetchSearchResults(query)
      setResults(searchResults)
    } catch (err) {
      setError("Failed to perform search")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
    setLastQuery("")
  }

  return {
    results,
    loading,
    error,
    lastQuery,
    search,
    clearResults,
  }
}
