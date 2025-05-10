"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Trash, FolderOpen, Shield, Database, Eye, Clock, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [captureSettings, setCaptureSettings] = useState({
    captureInterval: 30,
    idleThreshold: 120,
    similarityThreshold: 0.9,
    pauseWhenIdle: true,
    skipSimilarScreens: true,
    preventSelfCapture: true,
    captureOnStartup: true,
  })

  const [storageSettings, setStorageSettings] = useState({
    storagePath: "~/Library/Application Support/Eidon",
    maxStorageSize: 10,
    compressionLevel: 3,
    retentionPeriod: 90,
    archiveOlderThan: 7,
  })

  const [privacySettings, setPrivacySettings] = useState({
    excludedApps: ["System Preferences", "1Password", "Terminal"],
    excludedTitles: ["Bank", "Password", "Private"],
    excludedUrls: ["bank", "account", "password"],
  })

  const [searchSettings, setSearchSettings] = useState({
    searchMethod: "semantic",
    maxResults: 50,
    includeScreenshots: true,
    includeText: true,
    includeMetadata: true,
  })

  const handleSaveSettings = () => {
    // In a real app, this would save to disk
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    })
  }

  const handleResetSettings = () => {
    // In a real app, this would reset to defaults
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to defaults.",
    })
  }

  const handleStoragePathChange = () => {
    // In a real app, this would open a folder picker
    toast({
      title: "Storage path",
      description: "Select a folder to store Eidon data.",
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2 font-semibold">
              <Eye className="h-5 w-5" />
              <span>Eidon Settings</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleResetSettings}>
              Reset
            </Button>
            <Button size="sm" onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <Tabs defaultValue="capture" className="space-y-4">
            <TabsList>
              <TabsTrigger value="capture">
                <Clock className="mr-2 h-4 w-4" />
                Capture
              </TabsTrigger>
              <TabsTrigger value="storage">
                <Database className="mr-2 h-4 w-4" />
                Storage
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="mr-2 h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="search">
                <Search className="mr-2 h-4 w-4" />
                Search
              </TabsTrigger>
            </TabsList>

            <TabsContent value="capture" className="space-y-4">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium">Capture Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure how Eidon captures your screen activity.</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="capture-interval">Capture Interval</Label>
                      <span className="text-sm text-muted-foreground">{captureSettings.captureInterval} seconds</span>
                    </div>
                    <Slider
                      id="capture-interval"
                      min={5}
                      max={300}
                      step={5}
                      value={[captureSettings.captureInterval]}
                      onValueChange={(value) => setCaptureSettings({ ...captureSettings, captureInterval: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground">How frequently Eidon will capture your screen.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="idle-threshold">Idle Threshold</Label>
                      <span className="text-sm text-muted-foreground">{captureSettings.idleThreshold} seconds</span>
                    </div>
                    <Slider
                      id="idle-threshold"
                      min={30}
                      max={600}
                      step={30}
                      value={[captureSettings.idleThreshold]}
                      onValueChange={(value) => setCaptureSettings({ ...captureSettings, idleThreshold: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Time without input before considering the system idle.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="similarity-threshold">Similarity Threshold</Label>
                      <span className="text-sm text-muted-foreground">
                        {captureSettings.similarityThreshold * 100}%
                      </span>
                    </div>
                    <Slider
                      id="similarity-threshold"
                      min={0.5}
                      max={1}
                      step={0.01}
                      value={[captureSettings.similarityThreshold]}
                      onValueChange={(value) =>
                        setCaptureSettings({ ...captureSettings, similarityThreshold: value[0] })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      How similar consecutive screenshots need to be to skip capture.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pause-when-idle">Pause When Idle</Label>
                      <p className="text-xs text-muted-foreground">Stop capturing when no user activity is detected.</p>
                    </div>
                    <Switch
                      id="pause-when-idle"
                      checked={captureSettings.pauseWhenIdle}
                      onCheckedChange={(checked) => setCaptureSettings({ ...captureSettings, pauseWhenIdle: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="skip-similar">Skip Similar Screens</Label>
                      <p className="text-xs text-muted-foreground">
                        Don't capture if the screen hasn't changed significantly.
                      </p>
                    </div>
                    <Switch
                      id="skip-similar"
                      checked={captureSettings.skipSimilarScreens}
                      onCheckedChange={(checked) =>
                        setCaptureSettings({ ...captureSettings, skipSimilarScreens: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prevent-self">Prevent Self-Capture</Label>
                      <p className="text-xs text-muted-foreground">Don't capture when viewing Eidon itself.</p>
                    </div>
                    <Switch
                      id="prevent-self"
                      checked={captureSettings.preventSelfCapture}
                      onCheckedChange={(checked) =>
                        setCaptureSettings({ ...captureSettings, preventSelfCapture: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="capture-startup">Capture on Startup</Label>
                      <p className="text-xs text-muted-foreground">
                        Start capturing automatically when Eidon launches.
                      </p>
                    </div>
                    <Switch
                      id="capture-startup"
                      checked={captureSettings.captureOnStartup}
                      onCheckedChange={(checked) =>
                        setCaptureSettings({ ...captureSettings, captureOnStartup: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="storage" className="space-y-4">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium">Storage Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure how Eidon stores and manages captured data.</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-1.5">
                      <Label htmlFor="storage-path">Storage Location</Label>
                      <Input id="storage-path" value={storageSettings.storagePath} readOnly />
                      <p className="text-xs text-muted-foreground">
                        Where Eidon stores all captured data and the database.
                      </p>
                    </div>
                    <Button variant="outline" size="icon" className="mt-6" onClick={handleStoragePathChange}>
                      <FolderOpen className="h-4 w-4" />
                      <span className="sr-only">Choose folder</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-storage">Maximum Storage Size</Label>
                      <span className="text-sm text-muted-foreground">{storageSettings.maxStorageSize} GB</span>
                    </div>
                    <Slider
                      id="max-storage"
                      min={1}
                      max={100}
                      step={1}
                      value={[storageSettings.maxStorageSize]}
                      onValueChange={(value) => setStorageSettings({ ...storageSettings, maxStorageSize: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum disk space Eidon will use before cleaning up old data.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compression-level">Compression Level</Label>
                      <span className="text-sm text-muted-foreground">Level {storageSettings.compressionLevel}</span>
                    </div>
                    <Slider
                      id="compression-level"
                      min={1}
                      max={5}
                      step={1}
                      value={[storageSettings.compressionLevel]}
                      onValueChange={(value) => setStorageSettings({ ...storageSettings, compressionLevel: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Higher levels save more space but use more CPU when archiving.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="retention-period">Data Retention Period</Label>
                    <Select
                      value={storageSettings.retentionPeriod.toString()}
                      onValueChange={(value) =>
                        setStorageSettings({ ...storageSettings, retentionPeriod: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger id="retention-period">
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="0">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How long to keep captured data before automatic deletion.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="archive-older">Archive Screenshots Older Than</Label>
                    <Select
                      value={storageSettings.archiveOlderThan.toString()}
                      onValueChange={(value) =>
                        setStorageSettings({ ...storageSettings, archiveOlderThan: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger id="archive-older">
                        <SelectValue placeholder="Select archive threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      When to move screenshots from "hot" storage to compressed archives.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button variant="destructive" className="gap-2">
                    <Trash className="h-4 w-4" />
                    Clear All Data
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This will permanently delete all captured screenshots and data.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  <p className="text-sm text-muted-foreground">Control what Eidon captures and what remains private.</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="excluded-apps">Excluded Applications</Label>
                    <div className="flex flex-wrap gap-2">
                      {privacySettings.excludedApps.map((app, index) => (
                        <div
                          key={index}
                          className="flex items-center rounded-full border bg-muted/40 px-3 py-1 text-sm"
                        >
                          {app}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => {
                              const newApps = [...privacySettings.excludedApps]
                              newApps.splice(index, 1)
                              setPrivacySettings({ ...privacySettings, excludedApps: newApps })
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newApp = prompt("Enter application name to exclude:")
                          if (newApp && !privacySettings.excludedApps.includes(newApp)) {
                            setPrivacySettings({
                              ...privacySettings,
                              excludedApps: [...privacySettings.excludedApps, newApp],
                            })
                          }
                        }}
                      >
                        Add Application
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Eidon will not capture screenshots from these applications.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excluded-titles">Excluded Window Titles</Label>
                    <div className="flex flex-wrap gap-2">
                      {privacySettings.excludedTitles.map((title, index) => (
                        <div
                          key={index}
                          className="flex items-center rounded-full border bg-muted/40 px-3 py-1 text-sm"
                        >
                          {title}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => {
                              const newTitles = [...privacySettings.excludedTitles]
                              newTitles.splice(index, 1)
                              setPrivacySettings({ ...privacySettings, excludedTitles: newTitles })
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newTitle = prompt("Enter window title keyword to exclude:")
                          if (newTitle && !privacySettings.excludedTitles.includes(newTitle)) {
                            setPrivacySettings({
                              ...privacySettings,
                              excludedTitles: [...privacySettings.excludedTitles, newTitle],
                            })
                          }
                        }}
                      >
                        Add Title Keyword
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Eidon will not capture windows with these words in their titles.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excluded-urls">Excluded URLs</Label>
                    <div className="flex flex-wrap gap-2">
                      {privacySettings.excludedUrls.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center rounded-full border bg-muted/40 px-3 py-1 text-sm"
                        >
                          {url}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => {
                              const newUrls = [...privacySettings.excludedUrls]
                              newUrls.splice(index, 1)
                              setPrivacySettings({ ...privacySettings, excludedUrls: newUrls })
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newUrl = prompt("Enter URL keyword to exclude:")
                          if (newUrl && !privacySettings.excludedUrls.includes(newUrl)) {
                            setPrivacySettings({
                              ...privacySettings,
                              excludedUrls: [...privacySettings.excludedUrls, newUrl],
                            })
                          }
                        }}
                      >
                        Add URL Keyword
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Eidon will not capture browser pages with these words in their URLs.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="search" className="space-y-4">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium">Search Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how Eidon searches through your captured history.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search-method">Search Method</Label>
                    <Select
                      value={searchSettings.searchMethod}
                      onValueChange={(value) => setSearchSettings({ ...searchSettings, searchMethod: value })}
                    >
                      <SelectTrigger id="search-method">
                        <SelectValue placeholder="Select search method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semantic">Semantic Search (Natural Language)</SelectItem>
                        <SelectItem value="keyword">Keyword Search</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Both Methods)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Semantic search finds conceptually related content even if keywords don't match exactly.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-results">Maximum Results</Label>
                      <span className="text-sm text-muted-foreground">{searchSettings.maxResults} results</span>
                    </div>
                    <Slider
                      id="max-results"
                      min={10}
                      max={200}
                      step={10}
                      value={[searchSettings.maxResults]}
                      onValueChange={(value) => setSearchSettings({ ...searchSettings, maxResults: value[0] })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum number of results to return for each search.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="include-screenshots">Include Screenshots</Label>
                      <p className="text-xs text-muted-foreground">Include screenshot images in search results.</p>
                    </div>
                    <Switch
                      id="include-screenshots"
                      checked={searchSettings.includeScreenshots}
                      onCheckedChange={(checked) =>
                        setSearchSettings({ ...searchSettings, includeScreenshots: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="include-text">Include Text Content</Label>
                      <p className="text-xs text-muted-foreground">Include extracted text in search results.</p>
                    </div>
                    <Switch
                      id="include-text"
                      checked={searchSettings.includeText}
                      onCheckedChange={(checked) => setSearchSettings({ ...searchSettings, includeText: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="include-metadata">Include Metadata</Label>
                      <p className="text-xs text-muted-foreground">
                        Include app names, window titles, and URLs in search results.
                      </p>
                    </div>
                    <Switch
                      id="include-metadata"
                      checked={searchSettings.includeMetadata}
                      onCheckedChange={(checked) => setSearchSettings({ ...searchSettings, includeMetadata: checked })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
