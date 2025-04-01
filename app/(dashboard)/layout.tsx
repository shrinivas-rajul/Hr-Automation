"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { UserButton } from "@clerk/nextjs"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex-1 p-6">
      <Skeleton className="h-8 w-64 mb-6" />
      <Skeleton className="h-32 w-full mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId, isLoaded } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // If the user is not authenticated, redirect to the sign-in page
  if (isLoaded && !userId) {
    redirect("/sign-in")
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-y-0 left-0 z-20 ${isMobile ? "w-64" : "w-64"}`}
          >
            <DashboardSidebar />
            {isMobile && (
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 lg:hidden" onClick={toggleSidebar}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <motion.div
        layout
        className={`flex-1 flex flex-col ${isSidebarOpen ? (isMobile ? "ml-0" : "ml-64") : "ml-0"}`}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 flex items-center justify-between px-6">
          <div className="flex items-center">
            {!isMobile || !isSidebarOpen ? (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
                <Menu className="h-5 w-5" />
              </Button>
            ) : null}
            <h1 className="text-xl font-semibold">HR Management System</h1>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="cursor-pointer py-3">
                      <div>
                        <p className="font-medium">New application received</p>
                        <p className="text-sm text-muted-foreground">John Doe applied for Frontend Developer</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
        </main>
      </motion.div>
    </div>
  )
}

