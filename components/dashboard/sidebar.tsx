"use client"

import type React from "react"
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  FileText,
  LogOut,
  ChevronDown,
  BarChart,
  Calendar,
  MessageSquare,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@clerk/nextjs"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  submenu?: { title: string; href: string }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Candidates",
    href: "/dashboard/candidates",
    icon: Users,
    submenu: [
      { title: "All Candidates", href: "/dashboard/candidates" },
      { title: "Shortlisted", href: "/dashboard/shortlisted" },
      { title: "Interviews", href: "/dashboard/interviews" },
    ],
  },
  {
    title: "Positions",
    href: "/dashboard/positions",
    icon: Briefcase,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Guidelines",
    href: "/dashboard/guidelines",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Check if the current path is in a submenu and open that submenu
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.submenu && item.submenu.some((subItem) => pathname === subItem.href)) {
        setOpenSubmenu(item.title)
      }
    })
  }, [pathname])

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const sidebarVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary p-1 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <span className="font-bold text-xl">HRMS</span>
        </Link>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>{user?.firstName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="font-medium truncate">{user?.fullName || "HR Manager"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.primaryEmailAddress?.emailAddress || "hr@example.com"}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        className="flex-1 overflow-y-auto py-4 px-3"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        <nav className="space-y-1">
          {navItems.map((item) => (
            <div key={item.href} className="mb-1">
              {item.submenu ? (
                <div>
                  <motion.button
                    variants={itemVariants}
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                      pathname.startsWith(item.href.split("/").slice(0, 3).join("/"))
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted",
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSubmenu === item.title ? "transform rotate-180" : "",
                      )}
                    />
                  </motion.button>

                  {openSubmenu === item.title && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 mt-1 space-y-1"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                            pathname === subItem.href
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-muted text-muted-foreground",
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current mr-3" />
                          {subItem.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.div variants={itemVariants}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                      pathname === item.href ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted",
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.title}</span>
                  </Link>
                </motion.div>
              )}
            </div>
          ))}
        </nav>
      </motion.div>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}

