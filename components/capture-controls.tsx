"use client"

import { useState } from "react"
import { Play, Pause, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface CaptureControlsProps {
  isCapturing: boolean
  onToggleCapture: () => void
}

export default function CaptureControls({ isCapturing, onToggleCapture }: CaptureControlsProps) {
  const [captureInterval, setCaptureInterval] = useState(30)
  const [idleThreshold, setIdleThreshold] = useState(120)
  const [similarityThreshold, setSimilarityThreshold] = useState(0.9)
  const [settings, setSettings] = useState({
    pauseWhenIdle: true,
    skipSimilarScreens: true,
    preventSelfCapture: true,
  })

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    })
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={isCapturing ? "default" : "outline"} size="sm" onClick={onToggleCapture} className="gap-1">
              {isCapturing ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Resume</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isCapturing ? "Pause automatic capture" : "Resume automatic capture"}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Capture Settings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <h4 className="font-medium">Capture Settings</h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="capture-interval">Capture Interval</Label>
                <span className="text-sm text-muted-foreground">{captureInterval} seconds</span>
              </div>
              <Slider
                id="capture-interval"
                min={5}
                max={300}
                step={5}
                value={[captureInterval]}
                onValueChange={(value) => setCaptureInterval(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="idle-threshold">Idle Threshold</Label>
                <span className="text-sm text-muted-foreground">{idleThreshold} seconds</span>
              </div>
              <Slider
                id="idle-threshold"
                min={30}
                max={600}
                step={30}
                value={[idleThreshold]}
                onValueChange={(value) => setIdleThreshold(value[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="similarity-threshold">Similarity Threshold</Label>
                <span className="text-sm text-muted-foreground">{similarityThreshold * 100}%</span>
              </div>
              <Slider
                id="similarity-threshold"
                min={0.5}
                max={1}
                step={0.01}
                value={[similarityThreshold]}
                onValueChange={(value) => setSimilarityThreshold(value[0])}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pause-when-idle"
                  checked={settings.pauseWhenIdle}
                  onCheckedChange={() => handleSettingChange("pauseWhenIdle")}
                />
                <Label htmlFor="pause-when-idle">Pause when idle</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="skip-similar"
                  checked={settings.skipSimilarScreens}
                  onCheckedChange={() => handleSettingChange("skipSimilarScreens")}
                />
                <Label htmlFor="skip-similar">Skip similar screens</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="prevent-self"
                  checked={settings.preventSelfCapture}
                  onCheckedChange={() => handleSettingChange("preventSelfCapture")}
                />
                <Label htmlFor="prevent-self">Prevent self-capture</Label>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
