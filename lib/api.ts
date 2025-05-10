import type { TimelineEntry, SearchResult, CaptureStatus } from "@/lib/types"

// Mock data for timeline
const generateMockTimelineData = (date: Date, view: "day" | "hour"): TimelineEntry[] => {
  const entries: TimelineEntry[] = []
  const baseDate = new Date(date)

  // Reset time to start of day or keep current hour based on view
  if (view === "day") {
    baseDate.setHours(9, 0, 0, 0)
  } else {
    baseDate.setMinutes(0, 0, 0)
  }

  // Generate entries
  const entryCount = view === "day" ? 8 : 4
  const timeIncrement = view === "day" ? 60 : 15 // minutes

  const apps = [
    { name: "Safari", titles: ["GitHub - Home", "Google Search", "YouTube"], url: true },
    { name: "VS Code", titles: ["project.js - MyProject", "index.html - Website", "styles.css - Website"], url: false },
    { name: "Slack", titles: ["General", "Random", "Team Channel"], url: false },
    { name: "Mail", titles: ["Inbox", "Sent Items", "Drafts"], url: false },
  ]

  for (let i = 0; i < entryCount; i++) {
    const timestamp = new Date(baseDate)
    timestamp.setMinutes(timestamp.getMinutes() + i * timeIncrement)

    // Don't generate future entries
    if (timestamp > new Date()) continue

    const appIndex = Math.floor(Math.random() * apps.length)
    const app = apps[appIndex]
    const titleIndex = Math.floor(Math.random() * app.titles.length)

    const screenshotCount = Math.floor(Math.random() * 3) + 1
    const screenshots = Array.from({ length: screenshotCount }).map((_, index) => ({
      id: `screenshot-${i}-${index}`,
      url: `/placeholder.svg?height=720&width=1280`,
      timestamp: timestamp.toISOString(),
    }))

    entries.push({
      id: `entry-${i}`,
      timestamp: timestamp.toISOString(),
      appName: app.name,
      windowTitle: app.titles[titleIndex],
      url: app.url
        ? `https://example.com/${app.titles[titleIndex]
            .toLowerCase()
            .replace(/\s-\s.*$/, "")
            .replace(/\s+/g, "-")}`
        : undefined,
      textContent:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.",
      screenshots,
    })
  }

  return entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

// Mock data for search results
const generateMockSearchResults = (query: string): SearchResult[] => {
  const results: SearchResult[] = []
  const resultCount = Math.floor(Math.random() * 10) + 5

  const now = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  const apps = [
    { name: "Safari", titles: ["GitHub - Home", "Google Search", "YouTube"], url: true },
    { name: "VS Code", titles: ["project.js - MyProject", "index.html - Website", "styles.css - Website"], url: false },
    { name: "Slack", titles: ["General", "Random", "Team Channel"], url: false },
    { name: "Mail", titles: ["Inbox", "Sent Items", "Drafts"], url: false },
  ]

  for (let i = 0; i < resultCount; i++) {
    const timestamp = new Date(oneMonthAgo.getTime() + Math.random() * (now.getTime() - oneMonthAgo.getTime()))

    const appIndex = Math.floor(Math.random() * apps.length)
    const app = apps[appIndex]
    const titleIndex = Math.floor(Math.random() * app.titles.length)

    const matchScore = 0.5 + Math.random() * 0.5 // Between 0.5 and 1.0

    results.push({
      id: `result-${i}`,
      timestamp: timestamp.toISOString(),
      appName: app.name,
      windowTitle: app.titles[titleIndex],
      url: app.url
        ? `https://example.com/${app.titles[titleIndex]
            .toLowerCase()
            .replace(/\s-\s.*$/, "")
            .replace(/\s+/g, "-")}`
        : undefined,
      textContent: `This is a sample text that contains the search query "${query}" and some other content to demonstrate the search functionality.`,
      screenshotUrl: `/placeholder.svg?height=720&width=1280`,
      matchScore,
      matchDetails: {
        terms: query.split(" "),
      },
    })
  }

  return results.sort((a, b) => b.matchScore - a.matchScore)
}

// Fetch timeline data
export const fetchTimelineData = async (date: Date, view: "day" | "hour"): Promise<TimelineEntry[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockTimelineData(date, view))
    }, 500)
  })
}

// Fetch search results
export const fetchSearchResults = async (query: string): Promise<SearchResult[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockSearchResults(query))
    }, 800)
  })
}

// Get capture status
export const getCaptureStatus = async (): Promise<CaptureStatus> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "active",
        lastCapture: new Date().toISOString(),
        captureCount: 12547,
      })
    }, 300)
  })
}

// Toggle capture status
export const toggleCaptureStatus = async (active: boolean): Promise<CaptureStatus> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: active ? "active" : "paused",
        lastCapture: new Date().toISOString(),
        captureCount: 12547,
      })
    }, 300)
  })
}

// Capture manually
export const captureManually = async (): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}
