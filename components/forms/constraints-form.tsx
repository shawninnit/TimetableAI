"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface Constraints {
  maxClassesPerDay: number
  maxClassesPerWeek: number
  minBreakBetweenClasses: number
  allowBackToBackClasses: boolean
  preferMorningSlots: boolean
  avoidFridayAfternoon: boolean
  lunchBreakDuration: number
  workingDaysPerWeek: number
  startTime: string
  endTime: string
}

export function ConstraintsForm() {
  const [constraints, setConstraints] = useState<Constraints>({
    maxClassesPerDay: 6,
    maxClassesPerWeek: 30,
    minBreakBetweenClasses: 10,
    allowBackToBackClasses: true,
    preferMorningSlots: false,
    avoidFridayAfternoon: true,
    lunchBreakDuration: 60,
    workingDaysPerWeek: 5,
    startTime: "09:00",
    endTime: "17:00",
  })
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem("constraints")
    if (saved) {
      setConstraints(JSON.parse(saved))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("constraints", JSON.stringify(constraints))
    toast({
      title: "Success",
      description: "Constraints saved successfully",
    })
  }

  const handleReset = () => {
    const defaultConstraints: Constraints = {
      maxClassesPerDay: 6,
      maxClassesPerWeek: 30,
      minBreakBetweenClasses: 10,
      allowBackToBackClasses: true,
      preferMorningSlots: false,
      avoidFridayAfternoon: true,
      lunchBreakDuration: 60,
      workingDaysPerWeek: 5,
      startTime: "09:00",
      endTime: "17:00",
    }
    setConstraints(defaultConstraints)
    localStorage.setItem("constraints", JSON.stringify(defaultConstraints))
    toast({
      title: "Reset Complete",
      description: "Constraints reset to default values",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Constraints */}
        <Card>
          <CardHeader>
            <CardTitle>Time Constraints</CardTitle>
            <CardDescription>Configure daily and weekly time limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxClassesPerDay">Maximum Classes Per Day</Label>
              <Input
                id="maxClassesPerDay"
                type="number"
                value={constraints.maxClassesPerDay}
                onChange={(e) =>
                  setConstraints({ ...constraints, maxClassesPerDay: Number.parseInt(e.target.value) || 6 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxClassesPerWeek">Maximum Classes Per Week</Label>
              <Input
                id="maxClassesPerWeek"
                type="number"
                value={constraints.maxClassesPerWeek}
                onChange={(e) =>
                  setConstraints({ ...constraints, maxClassesPerWeek: Number.parseInt(e.target.value) || 30 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minBreak">Minimum Break Between Classes (minutes)</Label>
              <Input
                id="minBreak"
                type="number"
                value={constraints.minBreakBetweenClasses}
                onChange={(e) =>
                  setConstraints({ ...constraints, minBreakBetweenClasses: Number.parseInt(e.target.value) || 10 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lunchBreak">Lunch Break Duration (minutes)</Label>
              <Input
                id="lunchBreak"
                type="number"
                value={constraints.lunchBreakDuration}
                onChange={(e) =>
                  setConstraints({ ...constraints, lunchBreakDuration: Number.parseInt(e.target.value) || 60 })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
            <CardDescription>Set institutional working hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workingDays">Working Days Per Week</Label>
              <Input
                id="workingDays"
                type="number"
                min="5"
                max="6"
                value={constraints.workingDaysPerWeek}
                onChange={(e) =>
                  setConstraints({ ...constraints, workingDaysPerWeek: Number.parseInt(e.target.value) || 5 })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={constraints.startTime}
                onChange={(e) => setConstraints({ ...constraints, startTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={constraints.endTime}
                onChange={(e) => setConstraints({ ...constraints, endTime: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduling Preferences</CardTitle>
          <CardDescription>Configure optimization preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="backToBack">Allow Back-to-Back Classes</Label>
              <p className="text-sm text-muted">Allow consecutive classes without breaks</p>
            </div>
            <Switch
              id="backToBack"
              checked={constraints.allowBackToBackClasses}
              onCheckedChange={(checked) => setConstraints({ ...constraints, allowBackToBackClasses: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="morningSlots">Prefer Morning Slots</Label>
              <p className="text-sm text-muted">Prioritize morning time slots when possible</p>
            </div>
            <Switch
              id="morningSlots"
              checked={constraints.preferMorningSlots}
              onCheckedChange={(checked) => setConstraints({ ...constraints, preferMorningSlots: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="fridayAfternoon">Avoid Friday Afternoon</Label>
              <p className="text-sm text-muted">Minimize classes on Friday afternoons</p>
            </div>
            <Switch
              id="fridayAfternoon"
              checked={constraints.avoidFridayAfternoon}
              onCheckedChange={(checked) => setConstraints({ ...constraints, avoidFridayAfternoon: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1">
          Save Constraints
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}
