"use client"

import { useState, useEffect } from "react"
import { getCaptureStatus, toggleCaptureStatus, captureManually } from "@/lib/api"

export function useCapture() {
  const [captureStatus, setCaptureStatus] = useState<"active" | "paused" | "error">("active")
  const [lastCapture, setLastCapture] = useState<string | null>(null)
  const [captureCount, setCaptureCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true)
        const status = await getCaptureStatus()
        setCaptureStatus(status.status)
        setLastCapture(status.lastCapture)
        setCaptureCount(status.captureCount)
        setError(status.error || null)
      } catch (err) {
        setCaptureStatus("error")
        setError("Failed to fetch capture status")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()

    // Poll for status updates
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const toggleCapture = async () => {
    try {
      const newActive = captureStatus === "paused"
      const status = await toggleCaptureStatus(newActive)
      setCaptureStatus(status.status)
      setLastCapture(status.lastCapture)
      setCaptureCount(status.captureCount)
      setError(status.error || null)
      return status.status
    } catch (err) {
      setError("Failed to toggle capture status")
      console.error(err)
      throw err
    }
  }

  const manualCapture = async () => {
    try {
      await captureManually()
      // Update status after manual capture
      const status = await getCaptureStatus()
      setCaptureStatus(status.status)
      setLastCapture(status.lastCapture)
      setCaptureCount(status.captureCount)
    } catch (err) {
      setError("Failed to capture manually")
      console.error(err)
      throw err
    }
  }

  return {
    captureStatus,
    lastCapture,
    captureCount,
    error,
    loading,
    toggleCapture,
    captureManually: manualCapture,
  }
}
