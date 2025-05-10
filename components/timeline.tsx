"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchTimelineData } from "@/lib/api"
import type { TimelineEntry } from "@/lib/types"

export default function Timeline() {
  const [date, setDate] = useState(new Date())
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<TimelineEntry | null>(null)
  const [view, setView] = useState<"day" | "hour">("day")

  useEffect(() => {
    const loadTimelineData = async () => {
      setLoading(true)
      try {
        const data = await fetchTimelineData(date, view)
        setEntries(data)
      } catch (error) {
        console.error("Failed to load timeline data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTimelineData()
  }, [date, view])

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(date)
    if (view === "day") {
      direction === "prev" ? newDate.setDate(newDate.getDate() - 1) : newDate.setDate(newDate.getDate() + 1)
    } else {
      direction === "prev" ? newDate.setHours(newDate.getHours() - 1) : newDate.setHours(newDate.getHours() + 1)
    }
    setDate(newDate)
  }

  const handleEntryClick = (entry: TimelineEntry) => {
    setSelectedEntry(entry)
  }

  const formatDateHeader = () => {
    if (view === "day") {
      return format(date, "EEEE, MMMM d, yyyy")
    } else {
      return format(date, "h:mm a - MMMM d, yyyy")
    }
  }

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1fr_350px]">
      <div className="flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatDateHeader()}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate("next")}
              disabled={new Date().getTime() < date.getTime()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Select value={view} onValueChange={(value) => setView(value as "day" | "hour")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="hour">Hour View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto rounded-md border">
          {loading ? (
            <div className="space-y-4 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="aspect-video h-24 rounded-md" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length > 0 ? (
            <div className="space-y-6 p-4">
              {entries.map((group) => (
                <div key={group.timestamp} className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {format(new Date(group.timestamp), "h:mm a")}
                    {group.appName && ` - ${group.appName}`}
                    {group.windowTitle && ` - ${group.windowTitle}`}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {group.screenshots.map((screenshot, index) => (
                      <div
                        key={index}
                        className="group relative cursor-pointer overflow-hidden rounded-md border bg-muted/40"
                        onClick={() => handleEntryClick(group)}
                      >
                        <img
                          src={screenshot.url || "/placeholder.svg"}
                          alt={`Screenshot at ${format(new Date(group.timestamp), "h:mm:ss a")}`}
                          className="aspect-video h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <span className="text-xs text-white">{format(new Date(group.timestamp), "h:mm:ss a")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <p className="text-muted-foreground">No captures found for this time period.</p>
              <p className="text-sm text-muted-foreground">Try selecting a different date or time range.</p>
            </div>
          )}
        </div>
      </div>

      {selectedEntry && (
        <Card className="h-full overflow-hidden">
          <CardContent className="p-0">
            <div className="flex h-full flex-col">
              <div className="border-b p-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">
                      {format(new Date(selectedEntry.timestamp), "h:mm:ss a, MMMM d, yyyy")}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedEntry(null)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedEntry.appName && (
                    <p className="text-sm text-muted-foreground">Application: {selectedEntry.appName}</p>
                  )}
                  {selectedEntry.windowTitle && (
                    <p className="text-sm text-muted-foreground">Window: {selectedEntry.windowTitle}</p>
                  )}
                  {selectedEntry.url && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>URL:</span>
                      <a
                        href={selectedEntry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {selectedEntry.url.length > 30 ? `${selectedEntry.url.substring(0, 30)}...` : selectedEntry.url}
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
                      src={selectedEntry.screenshots[0]?.url || "/placeholder.svg?height=720&width=1280"}
                      alt={`Screenshot at ${format(new Date(selectedEntry.timestamp), "h:mm:ss a")}`}
                      className="w-full object-contain"
                    />
                  </div>

                  {selectedEntry.textContent && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Extracted Text</h4>
                      <div className="max-h-40 overflow-y-auto rounded-md border bg-muted/40 p-3 text-sm">
                        <pre className="whitespace-pre-wrap font-sans">{selectedEntry.textContent}</pre>
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
