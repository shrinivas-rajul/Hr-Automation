"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { User, Mail, Building, Phone, Bell, Upload } from "lucide-react"

export function SettingsForm() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    title: "HR Manager",
    department: "Human Resources",
    bio: "Experienced HR professional with a passion for finding the right talent for the right roles.",
    phone: "+1 (555) 123-4567",
    avatar: "",
  })

  const [notifications, setNotifications] = useState({
    newApplications: true,
    interviewReminders: true,
    positionUpdates: false,
    weeklyReports: true,
    emailDigest: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, this would call an API to update the profile
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    }, 1000)
  }

  const updateNotifications = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, this would call an API to update notification settings
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      })
    }, 1000)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload this file to your server
    // For now, we'll just create a local URL
    const reader = new FileReader()
    reader.onload = () => {
      setProfile({ ...profile, avatar: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and how it appears across the system.</CardDescription>
            </CardHeader>
            <form onSubmit={updateProfile}>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Upload className="h-4 w-4" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click on the avatar to upload a new profile picture. JPG, GIF or PNG. Max size 1MB.
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={handleAvatarClick}>
                      Upload New Image
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      Job Title
                    </Label>
                    <Input
                      id="title"
                      value={profile.title}
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      Department
                    </Label>
                    <Input
                      id="department"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell us about yourself"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </TabsContent>

      <TabsContent value="notifications">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications from the system.</CardDescription>
            </CardHeader>
            <form onSubmit={updateNotifications}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="newApplications" className="font-medium">
                          New Applications
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive notifications when new candidates apply</p>
                    </div>
                    <Switch
                      id="newApplications"
                      checked={notifications.newApplications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, newApplications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="interviewReminders" className="font-medium">
                          Interview Reminders
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">Get reminders before scheduled interviews</p>
                    </div>
                    <Switch
                      id="interviewReminders"
                      checked={notifications.interviewReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, interviewReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="positionUpdates" className="font-medium">
                          Position Updates
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">Notifications when job positions are updated</p>
                    </div>
                    <Switch
                      id="positionUpdates"
                      checked={notifications.positionUpdates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, positionUpdates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="weeklyReports" className="font-medium">
                          Weekly Reports
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">Receive weekly recruitment activity reports</p>
                    </div>
                    <Switch
                      id="weeklyReports"
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="emailDigest" className="font-medium">
                          Email Digest
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Daily digest of all activities instead of individual emails
                      </p>
                    </div>
                    <Switch
                      id="emailDigest"
                      checked={notifications.emailDigest}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailDigest: checked })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset to Defaults</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </TabsContent>
    </Tabs>
  )
}

