"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ResumePreview } from "@/components/resume-preview"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { cn, formatDate } from "@/lib/utils"

interface Application {
  id: string
  candidateId: string
  resumeUrl: string
  status: string
  matchScore: number
  createdAt: string
  candidate: {
    name: string
    email: string
    phone: string
    skills: string
    experience: string
  }
  position: {
    title: string
    department: string
  }
}

export function ApplicationsDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("matchScore")

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, sortBy])

  const fetchApplications = async () => {
    try {
      const response = await fetch(`/api/applications?status=${statusFilter}&sortBy=${sortBy}`)
      if (!response.ok) {
        throw new Error("Failed to fetch applications")
      }
      const data = await response.json()
      setApplications(data)
    } catch (error) {
      console.error("Error fetching applications:", error)
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      toast({
        title: "Success",
        description: "Application status updated successfully",
      })

      fetchApplications()
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      })
    }
  }

  const filteredApplications = applications.filter((app) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      app.candidate.name.toLowerCase().includes(searchLower) ||
      app.candidate.email.toLowerCase().includes(searchLower) ||
      app.position.title.toLowerCase().includes(searchLower)
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "reviewed":
        return "bg-blue-500"
      case "shortlisted":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return <div>Loading applications...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications Dashboard</h2>
        <div className="flex gap-4">
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matchScore">Match Score</SelectItem>
              <SelectItem value="createdAt">Date Applied</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{application.candidate.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {application.candidate.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{application.position.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {application.position.department}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{application.matchScore}%</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(application.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <ResumePreview
                      resumeUrl={application.resumeUrl}
                      candidateName={application.candidate.name}
                    />
                    <Select
                      value={application.status}
                      onValueChange={(value) =>
                        handleStatusChange(application.id, value)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 