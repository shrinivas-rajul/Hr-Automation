"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Briefcase, CheckCircle, TrendingUp, Clock, Calendar } from "lucide-react"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { TopCandidates } from "@/components/dashboard/top-candidates"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })

  const contentRef = useRef(null)
  const contentInView = useInView(contentRef, { once: true, amount: 0.1 })

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your recruitment activities and candidate pipeline.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          <Link href="/dashboard/positions">
            <Button variant="outline" className="h-9">
              <Briefcase className="mr-2 h-4 w-4" />
              Manage Positions
            </Button>
          </Link>
          <Link href="/dashboard/shortlisted">
            <Button className="h-9">
              <Users className="mr-2 h-4 w-4" />
              View Candidates
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        ref={statsRef}
        variants={statsVariants}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={fadeInUp}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">245</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-xs text-green-500">+12% from last month</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
              <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">32</div>
              <div className="flex items-center pt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-xs text-green-500">+4% from last month</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
              <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground pt-1">2 new positions this month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
              <CardTitle className="text-sm font-medium">Upcoming Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center pt-1">
                <Clock className="h-4 w-4 text-amber-500 mr-1" />
                <p className="text-xs text-amber-500">3 scheduled for today</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 20 }}
        animate={contentInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="recent">Recent Applications</TabsTrigger>
            <TabsTrigger value="top">Top Candidates</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="space-y-4">
            <RecentApplications />
          </TabsContent>
          <TabsContent value="top" className="space-y-4">
            <TopCandidates />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

