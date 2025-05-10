"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Calendar, Settings, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Timeline from "@/components/timeline"
import SearchResults from "@/components/search-results"
import CaptureControls from "@/components/capture-controls"
import { useToast } from "@/hooks/use-toast"
import { useCapture } from "@/hooks/use-capture"
import { useSearch } from "@/hooks/use-search"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("timeline")
  const [isCapturing, setIsCapturing] = useState(true)
  const { toast } = useToast()
  const { captureStatus, toggleCapture, captureManually } = useCapture()
  const { results, loading, search } = useSearch()

  useEffect(() => {
    setIsCapturing(captureStatus === "active")
  }, [captureStatus])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      search(searchQuery)
      setActiveTab("search")
    }
  }

  const handleManualCapture = async () => {
    try {
      await captureManually()
      toast({
        title: "Manual capture successful",
        description: "The current screen has been captured and added to your history.",
      })
    } catch (error) {
      toast({
        title: "Capture failed",
        description: "There was an error capturing the screen.",
        variant: "destructive",
      })
    }
  }

  const handleToggleCapture = async () => {
    try {
      await toggleCapture()
      toast({
        title: isCapturing ? "Capture paused" : "Capture resumed",
        description: isCapturing
          ? "Automatic screen capture has been paused."
          : "Automatic screen capture has been resumed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle capture status.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 font-semibold">
            <Eye className="h-5 w-5" />
            <span>Eidon</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search your history..."
                className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleManualCapture}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Capture now</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Capture current screen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => (window.location.href = "/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => (window.location.href = "/exclusions")}>
                  Manage Exclusions
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => (window.location.href = "/storage")}>
                  Storage Management
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="container h-full py-4">
          <div className="grid h-full grid-rows-[auto_1fr] gap-4">
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="timeline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Timeline
                    </TabsTrigger>
                    <TabsTrigger value="search">
                      <Search className="mr-2 h-4 w-4" />
                      Search Results
                    </TabsTrigger>
                  </TabsList>

                  <CaptureControls isCapturing={isCapturing} onToggleCapture={handleToggleCapture} />
                </div>

                <TabsContent value="timeline" className="h-full">
                  <Timeline />
                </TabsContent>

                <TabsContent value="search" className="h-full">
                  <SearchResults results={results} loading={loading} query={searchQuery} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-2">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isCapturing ? "default" : "outline"}>{isCapturing ? "Capturing" : "Paused"}</Badge>
            <span className="text-xs text-muted-foreground">Last capture: 2 minutes ago</span>
          </div>
          <div className="text-xs text-muted-foreground">Storage: 2.4 GB used</div>
        </div>
      </footer>
    </div>
  )
}
