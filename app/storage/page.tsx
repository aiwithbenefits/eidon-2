"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Trash, Archive, Eye, HardDrive, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface StorageData {
  totalSize: number
  usedSize: number
  hotStorageSize: number
  coldStorageSize: number
  databaseSize: number
  captureCount: number
  oldestCapture: string
  newestCapture: string
}

interface ArchiveData {
  id: string
  date: string
  size: number
  captureCount: number
  compressed: boolean
}

export default function StoragePage() {
  const { toast } = useToast()
  const [storageData, setStorageData] = useState<StorageData>({
    totalSize: 10 * 1024 * 1024 * 1024, // 10 GB
    usedSize: 2.4 * 1024 * 1024 * 1024, // 2.4 GB
    hotStorageSize: 0.8 * 1024 * 1024 * 1024, // 800 MB
    coldStorageSize: 1.5 * 1024 * 1024 * 1024, // 1.5 GB
    databaseSize: 0.1 * 1024 * 1024 * 1024, // 100 MB
    captureCount: 12547,
    oldestCapture: "2023-01-15T09:24:15Z",
    newestCapture: "2023-04-10T16:42:08Z",
  })

  const [archives, setArchives] = useState<ArchiveData[]>([
    {
      id: "1",
      date: "2023-04",
      size: 0.5 * 1024 * 1024 * 1024, // 500 MB
      captureCount: 3245,
      compressed: true,
    },
    {
      id: "2",
      date: "2023-03",
      size: 0.6 * 1024 * 1024 * 1024, // 600 MB
      captureCount: 3812,
      compressed: true,
    },
    {
      id: "3",
      date: "2023-02",
      size: 0.4 * 1024 * 1024 * 1024, // 400 MB
      captureCount: 2890,
      compressed: true,
    },
    {
      id: "4",
      date: "2023-01",
      size: 0.3 * 1024 * 1024 * 1024, // 300 MB
      captureCount: 2600,
      compressed: false,
    },
  ])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleCompressArchive = (id: string) => {
    setArchives(archives.map((archive) => (archive.id === id ? { ...archive, compressed: true } : archive)))

    toast({
      title: "Archive compressed",
      description: "The archive has been compressed successfully.",
    })
  }

  const handleDeleteArchive = (id: string) => {
    const archiveToDelete = archives.find((archive) => archive.id === id)

    if (archiveToDelete) {
      setArchives(archives.filter((archive) => archive.id !== id))

      // Update storage data
      setStorageData({
        ...storageData,
        usedSize: storageData.usedSize - archiveToDelete.size,
        coldStorageSize: storageData.coldStorageSize - archiveToDelete.size,
        captureCount: storageData.captureCount - archiveToDelete.captureCount,
      })

      toast({
        title: "Archive deleted",
        description: `Archive for ${archiveToDelete.date} has been deleted.`,
      })
    }
  }

  const handleRunCleanup = () => {
    toast({
      title: "Cleanup started",
      description: "Storage cleanup process has been initiated.",
    })

    // Simulate cleanup
    setTimeout(() => {
      toast({
        title: "Cleanup completed",
        description: "Storage cleanup process has completed successfully.",
      })

      // Update storage data
      setStorageData({
        ...storageData,
        usedSize: storageData.usedSize * 0.8, // Reduce by 20%
        hotStorageSize: storageData.hotStorageSize * 0.7, // Reduce by 30%
      })
    }, 2000)
  }

  const usedPercentage = (storageData.usedSize / storageData.totalSize) * 100

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2 font-semibold">
              <Eye className="h-5 w-5" />
              <span>Storage Management</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRunCleanup}>
              Run Cleanup
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatBytes(storageData.usedSize)}</div>
                  <p className="text-xs text-muted-foreground">of {formatBytes(storageData.totalSize)} allocated</p>
                  <div className="mt-4 space-y-2">
                    <Progress value={usedPercentage} />
                    <p className="text-xs text-muted-foreground">{usedPercentage.toFixed(1)}% used</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Captures</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{storageData.captureCount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">screenshots stored</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Oldest Capture</CardTitle>
                  <Archive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{format(new Date(storageData.oldestCapture), "MMM d, yyyy")}</div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(storageData.oldestCapture), "h:mm a")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Latest Capture</CardTitle>
                  <Archive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{format(new Date(storageData.newestCapture), "MMM d, yyyy")}</div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(storageData.newestCapture), "h:mm a")}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Storage Overview</TabsTrigger>
                <TabsTrigger value="archives">Archives</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Distribution</CardTitle>
                    <CardDescription>How your storage is currently being used</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary" />
                            <span>Hot Storage (Recent Screenshots)</span>
                          </div>
                          <span className="font-medium">{formatBytes(storageData.hotStorageSize)}</span>
                        </div>
                        <Progress
                          value={(storageData.hotStorageSize / storageData.usedSize) * 100}
                          className="h-2 bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          Recent, uncompressed screenshots for quick access
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <span>Cold Storage (Archived Screenshots)</span>
                          </div>
                          <span className="font-medium">{formatBytes(storageData.coldStorageSize)}</span>
                        </div>
                        <Progress
                          value={(storageData.coldStorageSize / storageData.usedSize) * 100}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-blue-500"
                        />
                        <p className="text-xs text-muted-foreground">Older, compressed screenshots organized by date</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <span>Database (Metadata & Text)</span>
                          </div>
                          <span className="font-medium">{formatBytes(storageData.databaseSize)}</span>
                        </div>
                        <Progress
                          value={(storageData.databaseSize / storageData.usedSize) * 100}
                          className="h-2 bg-muted"
                          indicatorClassName="bg-green-500"
                        />
                        <p className="text-xs text-muted-foreground">
                          SQLite database containing metadata, OCR text, and search indices
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Storage Optimization</CardTitle>
                      <CardDescription>Actions to manage your storage usage</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={handleRunCleanup}>
                          <Trash className="h-4 w-4" />
                          Run Storage Cleanup
                        </Button>
                        <p className="text-xs text-muted-foreground">Remove temporary files and optimize database</p>
                      </div>

                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <Archive className="h-4 w-4" />
                          Compress All Archives
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Compress all uncompressed archives to save space
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Button variant="destructive" className="w-full justify-start gap-2">
                          <Trash className="h-4 w-4" />
                          Delete All Data
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Permanently delete all captured data (cannot be undone)
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Storage Tips</CardTitle>
                      <CardDescription>Recommendations to optimize your storage</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-md bg-muted/40 p-3">
                        <h4 className="font-medium">Increase Similarity Threshold</h4>
                        <p className="text-sm text-muted-foreground">
                          Your current similarity threshold is 90%. Increasing this to 95% could reduce storage usage by
                          skipping more similar screenshots.
                        </p>
                      </div>

                      <div className="rounded-md bg-muted/40 p-3">
                        <h4 className="font-medium">Reduce Retention Period</h4>
                        <p className="text-sm text-muted-foreground">
                          Consider reducing your retention period from 90 days to 60 days to automatically clean up
                          older data.
                        </p>
                      </div>

                      <div className="rounded-md bg-muted/40 p-3">
                        <h4 className="font-medium">Add More Exclusions</h4>
                        <p className="text-sm text-muted-foreground">
                          Add exclusion rules for applications or websites you use frequently but don't need to capture.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="archives" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Archive Management</CardTitle>
                    <CardDescription>Manage your archived screenshots by date</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Screenshots</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {archives.map((archive) => (
                            <TableRow key={archive.id}>
                              <TableCell className="font-medium">
                                {format(new Date(archive.date), "MMMM yyyy")}
                              </TableCell>
                              <TableCell>{formatBytes(archive.size)}</TableCell>
                              <TableCell>{archive.captureCount.toLocaleString()}</TableCell>
                              <TableCell>
                                {archive.compressed ? (
                                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Archive className="h-3 w-3" />
                                    Compressed
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-sm text-amber-500">
                                    <HardDrive className="h-3 w-3" />
                                    Uncompressed
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {!archive.compressed && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleCompressArchive(archive.id)}
                                    >
                                      <Archive className="mr-2 h-3 w-3" />
                                      Compress
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteArchive(archive.id)}>
                                    <Trash className="mr-2 h-3 w-3 text-destructive" />
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
