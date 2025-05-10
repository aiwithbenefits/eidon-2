"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ExternalLink, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { SearchResult } from "@/lib/types"

interface SearchResultsProps {
  results: SearchResult[]
  loading: boolean
  query: string
}

export default function SearchResults({ results, loading, query }: SearchResultsProps) {
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    apps: [] as string[],
    sortBy: "relevance",
  })
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const uniqueApps = [...new Set(results.map((result) => result.appName))].filter(Boolean)

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result)
  }

  const applyFilter = () => {
    const newFilters = []
    if (filters.dateFrom) newFilters.push(`From: ${filters.dateFrom}`)
    if (filters.dateTo) newFilters.push(`To: ${filters.dateTo}`)
    if (filters.apps.length) newFilters.push(`Apps: ${filters.apps.length} selected`)
    if (filters.sortBy !== "relevance") newFilters.push(`Sort: ${filters.sortBy}`)

    setActiveFilters(newFilters)
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))

    if (filter.startsWith("From:")) setFilters({ ...filters, dateFrom: "" })
    if (filter.startsWith("To:")) setFilters({ ...filters, dateTo: "" })
    if (filter.startsWith("Apps:")) setFilters({ ...filters, apps: [] })
    if (filter.startsWith("Sort:")) setFilters({ ...filters, sortBy: "relevance" })
  }

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1fr_350px]">
      <div className="flex flex-col">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-medium">{loading ? "Searching..." : `Results for "${query}"`}</h2>
            <p className="text-sm text-muted-foreground">
              {loading ? "Please wait..." : `${results.length} results found`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {filter}
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => removeFilter(filter)}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove filter</span>
                </Button>
              </Badge>
            ))}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Results</h4>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Date Range</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="date-from" className="text-xs">
                          From
                        </Label>
                        <Input
                          id="date-from"
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="date-to" className="text-xs">
                          To
                        </Label>
                        <Input
                          id="date-to"
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Applications</h5>
                    <div className="max-h-32 space-y-2 overflow-y-auto">
                      {uniqueApps.map((app) => (
                        <div key={app} className="flex items-center space-x-2">
                          <Checkbox
                            id={`app-${app}`}
                            checked={filters.apps.includes(app)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters({ ...filters, apps: [...filters.apps, app] })
                              } else {
                                setFilters({
                                  ...filters,
                                  apps: filters.apps.filter((a) => a !== app),
                                })
                              }
                            }}
                          />
                          <Label htmlFor={`app-${app}`} className="text-sm">
                            {app}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Sort By</h5>
                    <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button size="sm" onClick={applyFilter}>
                    Apply Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-md border">
          {loading ? (
            <div className="space-y-4 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-24 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="group cursor-pointer p-4 hover:bg-muted/40"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {result.appName && <Badge variant="outline">{result.appName}</Badge>}
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(result.timestamp), "MMM d, yyyy h:mm a")}
                        </span>
                      </div>

                      {result.matchScore && (
                        <Badge variant="secondary" className="bg-primary/10">
                          {Math.round(result.matchScore * 100)}% match
                        </Badge>
                      )}
                    </div>

                    {result.windowTitle && <h3 className="font-medium">{result.windowTitle}</h3>}

                    {result.url && (
                      <div className="flex items-center gap-1 text-sm">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {result.url.length > 50 ? `${result.url.substring(0, 50)}...` : result.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="overflow-hidden rounded-md border bg-muted/40">
                        <img
                          src={result.screenshotUrl || "/placeholder.svg"}
                          alt={`Screenshot at ${format(new Date(result.timestamp), "h:mm:ss a")}`}
                          className="aspect-video w-full object-cover"
                        />
                      </div>

                      {result.textContent && (
                        <div className="max-h-24 overflow-hidden rounded-md border bg-muted/40 p-2 text-sm">
                          <p className="line-clamp-4">{result.textContent}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <p className="text-muted-foreground">No results found for "{query}"</p>
              <p className="text-sm text-muted-foreground">Try a different search term or adjust your filters.</p>
            </div>
          )}
        </div>
      </div>

      {selectedResult && (
        <Card className="h-full overflow-hidden">
          <CardContent className="p-0">
            <div className="flex h-full flex-col">
              <div className="border-b p-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      {format(new Date(selectedResult.timestamp), "h:mm:ss a, MMMM d, yyyy")}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedResult(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedResult.appName && (
                    <p className="text-sm text-muted-foreground">Application: {selectedResult.appName}</p>
                  )}
                  {selectedResult.windowTitle && (
                    <p className="text-sm text-muted-foreground">Window: {selectedResult.windowTitle}</p>
                  )}
                  {selectedResult.url && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>URL:</span>
                      <a
                        href={selectedResult.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {selectedResult.url.length > 30
                          ? `${selectedResult.url.substring(0, 30)}...`
                          : selectedResult.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-md border">
                    <img
                      src={selectedResult.screenshotUrl || "/placeholder.svg"}
                      alt={`Screenshot at ${format(new Date(selectedResult.timestamp), "h:mm:ss a")}`}
                      className="w-full object-contain"
                    />
                  </div>

                  {selectedResult.textContent && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Extracted Text</h4>
                      <div className="max-h-40 overflow-y-auto rounded-md border bg-muted/40 p-3 text-sm">
                        <pre className="whitespace-pre-wrap font-sans">{selectedResult.textContent}</pre>
                      </div>
                    </div>
                  )}

                  {selectedResult.matchDetails && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Match Details</h4>
                      <div className="rounded-md border bg-muted/40 p-3 text-sm">
                        <p>
                          <span className="font-medium">Match score:</span>{" "}
                          {Math.round(selectedResult.matchScore * 100)}%
                        </p>
                        <p>
                          <span className="font-medium">Matched terms:</span>{" "}
                          {selectedResult.matchDetails.terms.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
