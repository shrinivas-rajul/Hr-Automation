"use client"

import { useState, memo, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock, Download, Mail, Video, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { cn, formatDate } from "@/lib/utils"

// Mock data - would come from your database in production
const mockShortlisted = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "Frontend Developer",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    status: "Shortlisted",
  },
  {
    id: 2,
    name: "Maria Garcia",
    position: "UX Designer",
    email: "maria.garcia@example.com",
    phone: "+1 (555) 234-5678",
    status: "Interview Scheduled",
    interviewDate: "2023-11-05T14:00:00",
  },
  {
    id: 3,
    name: "James Wilson",
    position: "Backend Engineer",
    email: "james.wilson@example.com",
    phone: "+1 (555) 345-6789",
    status: "Shortlisted",
  },
  {
    id: 4,
    name: "Sophia Lee",
    position: "Frontend Developer",
    email: "sophia.lee@example.com",
    phone: "+1 (555) 456-7890",
    status: "Shortlisted",
  },
  {
    id: 5,
    name: "Daniel Brown",
    position: "Backend Engineer",
    email: "daniel.brown@example.com",
    phone: "+1 (555) 567-8901",
    status: "Interview Scheduled",
    interviewDate: "2023-11-07T10:30:00",
  },
]

// Memoized table row component for better performance
const CandidateRow = memo(
  ({
    candidate,
    isSelected,
    onToggleSelect,
  }: {
    candidate: (typeof mockShortlisted)[0]
    isSelected: boolean
    onToggleSelect: (id: number) => void
  }) => (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="hover:bg-muted/50"
    >
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(candidate.id)}
          disabled={candidate.status === "Interview Scheduled"}
        />
      </TableCell>
      <TableCell className="font-medium">{candidate.name}</TableCell>
      <TableCell>{candidate.position}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm">{candidate.email}</span>
          <span className="text-sm text-muted-foreground">{candidate.phone}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={cn(
            candidate.status === "Shortlisted"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          )}
        >
          {candidate.status}
        </Badge>
      </TableCell>
      <TableCell>
        {candidate.interviewDate 
          ? format(new Date(candidate.interviewDate), "PPP 'at' p") 
          : "Not scheduled"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download resume</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Mail className="h-4 w-4" />
            <span className="sr-only">Send email</span>
          </Button>
          {candidate.interviewDate && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-4 w-4" />
              <span className="sr-only">Join interview</span>
            </Button>
          )}
        </div>
      </TableCell>
    </motion.tr>
  ),
)

CandidateRow.displayName = "CandidateRow"

export function ShortlistedCandidates() {
  const [candidates, setCandidates] = useState(mockShortlisted)
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("10:00")
  const [isScheduling, setIsScheduling] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const toggleCandidate = (id: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((candidateId) => candidateId !== id) : [...prev, id],
    )
  }

  const toggleAllCandidates = (checked: boolean) => {
    if (checked) {
      const selectableCandidates = filteredCandidates.filter((c) => c.status !== "Interview Scheduled").map((c) => c.id)
      setSelectedCandidates(selectableCandidates)
    } else {
      setSelectedCandidates([])
    }
  }

  const scheduleInterviews = () => {
    // In a real app, this would call an API to schedule interviews
    // and send emails via the Gmail API

    // For now, we'll just update our local state
    const updatedCandidates = candidates.map((candidate) => {
      if (selectedCandidates.includes(candidate.id)) {
        const interviewDateTime = new Date(date!)
        const [hours, minutes] = time.split(":").map(Number)
        interviewDateTime.setHours(hours, minutes)

        return {
          ...candidate,
          status: "Interview Scheduled",
          interviewDate: interviewDateTime.toISOString(),
        }
      }
      return candidate
    })

    setCandidates(updatedCandidates)
    setSelectedCandidates([])
    setIsScheduling(false)
  }

  // Filter candidates based on search term and status
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || candidate.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [candidates, searchTerm, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage)
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {selectedCandidates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center p-3 bg-muted rounded-md"
          >
            <span>{selectedCandidates.length} candidates selected</span>
            <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interviews
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Interviews</DialogTitle>
                  <DialogDescription>Set a date and time for interviews with selected candidates.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={scheduleInterviews}>Schedule and Send Invites</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Shortlisted">Shortlisted</SelectItem>
              <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedCandidates.length > 0 &&
                    paginatedCandidates
                      .filter((c) => c.status !== "Interview Scheduled")
                      .every((c) => selectedCandidates.includes(c.id))
                  }
                  onCheckedChange={toggleAllCandidates}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Interview Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCandidates.length > 0 ? (
              paginatedCandidates.map((candidate) => (
                <CandidateRow
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={selectedCandidates.includes(candidate.id)}
                  onToggleSelect={toggleCandidate}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No candidates found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

