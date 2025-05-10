export interface Screenshot {
  id: string
  url: string
  timestamp: string
}

export interface TimelineEntry {
  id: string
  timestamp: string
  appName?: string
  windowTitle?: string
  url?: string
  textContent?: string
  screenshots: Screenshot[]
}

export interface SearchResult {
  id: string
  timestamp: string
  appName?: string
  windowTitle?: string
  url?: string
  textContent?: string
  screenshotUrl: string
  matchScore: number
  matchDetails?: {
    terms: string[]
  }
}

export interface CaptureStatus {
  status: "active" | "paused" | "error"
  lastCapture: string
  captureCount: number
  error?: string
}
