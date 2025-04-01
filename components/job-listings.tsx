"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { MapPin, Clock, Building, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"

interface Job {
  id: string
  title: string
  department?: string
  location: string
  type: string
  description: string
  requirements: string[]
  postedDate: string
  company?: string
}

interface JobListingsProps {
  featured?: boolean
}

export default function JobListings({ featured = false }: JobListingsProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch from your jobs API
        const response = await fetch('/api/jobs')
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }
        
        const data = await response.json()
        
        // Process the data to ensure consistent format
        const processedJobs = data.map((job: any) => ({
          id: job.id,
          title: job.title,
          department: job.department || "General",
          location: job.location || "Remote",
          type: job.type || "Full-time",
          description: job.description,
          requirements: Array.isArray(job.requirements) 
            ? job.requirements 
            : typeof job.requirements === 'string'
              ? job.requirements.split('\n').filter(Boolean)
              : ["No specific requirements listed"],
          postedDate: job.postedDate || job.createdAt,
          company: job.company || "Our Company"
        }))
        
        // If featured is true, only show first few jobs
        setJobs(featured ? processedJobs.slice(0, 2) : processedJobs)
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError('Failed to load jobs. Please try again later.')
        
        // Set empty array to avoid undefined errors
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchJobs()
  }, [featured])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(featured ? 2 : 6)].map((_, index) => (
          <Card key={index} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
        <p className="text-destructive font-medium">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  // No jobs found
  if (jobs.length === 0) {
    return (
      <div className="text-center p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No job listings found</h3>
        <p className="text-muted-foreground mb-4">
          There are currently no open positions available.
        </p>
        <Link href="/jobs">
          <Button>View All Positions</Button>
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {jobs.map((job) => (
        <motion.div key={job.id} variants={item}>
          <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{job.title}</CardTitle>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{job.type}</Badge>
              </div>
              <CardDescription className="flex flex-wrap gap-2 mt-2">
                <span className="flex items-center text-xs">
                  <Building className="h-3 w-3 mr-1" />
                  {job.department}
                </span>
                <span className="flex items-center text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job.location}
                </span>
                <span className="flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(job.postedDate).toLocaleDateString()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="mb-4 text-muted-foreground">{job.description}</p>
              <div className="space-y-2">
                <p className="font-medium text-sm">Requirements:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {req}
                    </li>
                  ))}
                  {job.requirements.length > 3 && (
                    <li className="text-sm text-muted-foreground">
                      <Link href={`/jobs/${job.id}`} className="text-primary hover:underline">
                        View more requirements...
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Posted: {formatDate(job.postedDate)}
              </p>
              <Link href={`/jobs/${job.id}`}>
                <Button className="group">
                  View Job
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

