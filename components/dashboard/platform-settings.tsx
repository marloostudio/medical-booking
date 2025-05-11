"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { Save, Globe, Clock, Calendar, Bell } from "lucide-react"

type PlatformSettingsType = {
  language: string
  timeZone: string
  dateFormat: string
  timeFormat: string
  firstDayOfWeek: number
  enableSmsReminders: boolean
  enableEmailReminders: boolean
  defaultReminderTime: number
  currencySymbol: string
  clinicId: string
}

const DEFAULT_SETTINGS: PlatformSettingsType = {
  language: "en",
  timeZone: "America/New_York",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  firstDayOfWeek: 0, // Sunday
  enableSmsReminders: true,
  enableEmailReminders: true,
  defaultReminderTime: 24, // hours
  currencySymbol: "$",
  clinicId: "demo-clinic-123", // Temporary for development
}

const TIME_ZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
]

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
]

const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
]

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
]

export function PlatformSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<PlatformSettingsType>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const clinicId = DEFAULT_SETTINGS.clinicId // In a real app, get this from auth context
      const settingsDoc = await getDoc(doc(db, "clinics", clinicId, "settings", "platform"))

      if (settingsDoc.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...(settingsDoc.data() as PlatformSettingsType) })
      } else {
        // If no settings exist yet, use defaults
        setSettings(DEFAULT_SETTINGS)
      }
    } catch (err) {
      console.error("Error fetching platform settings:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load platform settings. Using defaults.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectChange = (field: keyof PlatformSettingsType, value: string | number) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const handleSwitchChange = (field: keyof PlatformSettingsType, checked: boolean) => {
    setSettings({
      ...settings,
      [field]: checked,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setSettings({
      ...settings,
      [name]: type === "number" ? Number.parseInt(value, 10) : value,
    })
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const clinicId = settings.clinicId
      await setDoc(doc(db, "clinics", clinicId, "settings", "platform"), {
        ...settings,
        updatedAt: new Date(),
      })

      toast({
        title: "Settings saved",
        description: "Platform settings have been updated successfully.",
      })
    } catch (err) {
      console.error("Error saving platform settings:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save platform settings. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="date-time">Date & Time</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Language
                </Label>
                <Select value={settings.language} onValueChange={(value) => handleSelectChange("language", value)}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">This setting affects the language used throughout the platform.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currencySymbol">Currency Symbol</Label>
                <Input
                  id="currencySymbol"
                  name="currencySymbol"
                  value={settings.currencySymbol}
                  onChange={handleInputChange}
                  className="w-20"
                  maxLength={3}
                />
                <p className="text-sm text-gray-500">This symbol will be used for all prices and payments.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="date-time" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Date & Time Settings</CardTitle>
              <CardDescription>Configure how dates and times are displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeZone" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Time Zone
                </Label>
                <Select value={settings.timeZone} onValueChange={(value) => handleSelectChange("timeZone", value)}>
                  <SelectTrigger id="timeZone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_ZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Format
                </Label>
                <Select value={settings.dateFormat} onValueChange={(value) => handleSelectChange("dateFormat", value)}>
                  <SelectTrigger id="dateFormat">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="12h"
                      name="timeFormat"
                      value="12h"
                      checked={settings.timeFormat === "12h"}
                      onChange={() => handleSelectChange("timeFormat", "12h")}
                      className="form-radio h-4 w-4"
                    />
                    <Label htmlFor="12h">12-hour (1:30 PM)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="24h"
                      name="timeFormat"
                      value="24h"
                      checked={settings.timeFormat === "24h"}
                      onChange={() => handleSelectChange("timeFormat", "24h")}
                      className="form-radio h-4 w-4"
                    />
                    <Label htmlFor="24h">24-hour (13:30)</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstDayOfWeek" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  First Day of Week
                </Label>
                <Select
                  value={settings.firstDayOfWeek.toString()}
                  onValueChange={(value) => handleSelectChange("firstDayOfWeek", Number.parseInt(value, 10))}
                >
                  <SelectTrigger id="firstDayOfWeek">
                    <SelectValue placeholder="Select first day of week" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how reminders and notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableSmsReminders" className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    SMS Reminders
                  </Label>
                  <Switch
                    id="enableSmsReminders"
                    checked={settings.enableSmsReminders}
                    onCheckedChange={(checked) => handleSwitchChange("enableSmsReminders", checked)}
                  />
                </div>
                <p className="text-sm text-gray-500">Enable SMS text message reminders for appointments.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableEmailReminders" className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Email Reminders
                  </Label>
                  <Switch
                    id="enableEmailReminders"
                    checked={settings.enableEmailReminders}
                    onCheckedChange={(checked) => handleSwitchChange("enableEmailReminders", checked)}
                  />
                </div>
                <p className="text-sm text-gray-500">Enable email reminders for appointments.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultReminderTime">Default Reminder Time (hours before appointment)</Label>
                <Input
                  id="defaultReminderTime"
                  name="defaultReminderTime"
                  type="number"
                  min="1"
                  max="72"
                  value={settings.defaultReminderTime}
                  onChange={handleInputChange}
                  className="w-20"
                />
                <p className="text-sm text-gray-500">
                  How many hours before an appointment should reminders be sent by default.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={saving || loading}>
          {saving ? (
            "Saving..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
