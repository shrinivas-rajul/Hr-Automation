"use client"

import { useState, memo, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Edit, Plus, Search, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

// Define typed interface for a Position
interface Position {
  id: string
  title: string
  department: string
  location: string
  type: string
  status: string
  description: string
  requirements: string
  applications: any[] // Type for applications count
  postedDate: string
  createdAt: string
  updatedAt: string
}

// Add a type for API error responses
interface ApiErrorResponse {
  error?: string;
  message?: string;
  details?: string;
}

// Memoized table row component for better performance
const PositionRow = memo(
  ({
    position,
    onToggleStatus,
    onEdit,
  }: {
    position: Position
    onToggleStatus: (id: string, status: string) => void
    onEdit: (position: Position) => void
  }) => (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="hover:bg-muted/50"
    >
      <TableCell className="font-medium">{position.title}</TableCell>
      <TableCell>{position.department}</TableCell>
      <TableCell>{position.location}</TableCell>
      <TableCell>{position.type}</TableCell>
      <TableCell>
        <Badge
          className={cn(
            position.status === "Open"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          )}
        >
          {position.status}
        </Badge>
      </TableCell>
      <TableCell>{position.applications ? position.applications.length : 0}</TableCell>
      <TableCell>
        {formatDate(position.postedDate)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(position)}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit position</span>
          </Button>
          <Button
            variant={position.status === "Open" ? "destructive" : "outline"}
            size="sm"
            onClick={() => onToggleStatus(position.id, position.status)}
          >
            {position.status === "Open" ? "Close" : "Reopen"}
          </Button>
        </div>
      </TableCell>
    </motion.tr>
  ),
)

PositionRow.displayName = "PositionRow"

export function PositionsManager() {
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingPosition, setIsAddingPosition] = useState(false)
  const [isEditingPosition, setIsEditingPosition] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [newPosition, setNewPosition] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
  })

  // Fetch positions from API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/positions')
        
        if (!response.ok) {
          throw new Error('Failed to fetch positions')
        }
        
        const data = await response.json()
        setPositions(data)
      } catch (error) {
        console.error("Error fetching positions:", error)
        toast({
          title: "Error",
          description: "Failed to load positions. Please try again later.",
          variant: "destructive",
        })
        // Set empty array to avoid undefined errors
        setPositions([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPositions()
  }, [])

  const addPosition = async () => {
    // Validation
    if (!newPosition.title || !newPosition.department || !newPosition.location || 
        !newPosition.description || !newPosition.requirements) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      console.log("Submitting new position:", newPosition)
      
      // Try to initialize the user first to ensure we have a user record
      console.log("Initializing user record...")
      const initResponse = await fetch('/api/init-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!initResponse.ok) {
        console.warn("User initialization failed, but proceeding with position creation")
      } else {
        console.log("User initialization successful or already exists")
      }
      
      // Call the API to create a new position
      const response = await fetch('/api/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPosition),
      })
      
      // Get response details for better error handling
      const responseText = await response.text()
      console.log("API Response status:", response.status)
      console.log("API Response text:", responseText)
      
      let responseData: Position | ApiErrorResponse | null = null
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse JSON response:", e)
      }
      
      if (!response.ok) {
        // Get detailed error message
        const errorMessage = (responseData as ApiErrorResponse)?.error || 
                            (responseData as ApiErrorResponse)?.message || 
                            'Failed to create position'
        const errorDetails = (responseData as ApiErrorResponse)?.details || ''
        throw new Error(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`)
      }
      
      // Update local state with the data from API response
      if (responseData) {
        setPositions([...positions, responseData as Position])
      }
      setIsAddingPosition(false)
      
      // Reset form
      setNewPosition({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        description: "",
        requirements: "",
      })
      
      toast({
        title: "Success",
        description: "Position created successfully",
      })
    } catch (error) {
      console.error("Error creating position:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create position. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const editPosition = async () => {
    if (!currentPosition) return

    try {
      setIsSubmitting(true)
      console.log("Updating position:", currentPosition.id, {
        title: currentPosition.title,
        department: currentPosition.department,
        location: currentPosition.location,
        type: currentPosition.type,
        description: currentPosition.description,
        requirements: currentPosition.requirements,
      })
      
      // Try to initialize the user first to ensure we have a user record
      console.log("Initializing user record...")
      const initResponse = await fetch('/api/init-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!initResponse.ok) {
        console.warn("User initialization failed, but proceeding with position update")
      } else {
        console.log("User initialization successful or already exists")
      }
      
      // Call API to update the position
      const response = await fetch(`/api/positions/${currentPosition.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: currentPosition.title,
          department: currentPosition.department,
          location: currentPosition.location,
          type: currentPosition.type,
          description: currentPosition.description,
          requirements: currentPosition.requirements,
        }),
      })
      
      // Get response details for better error handling
      const responseText = await response.text()
      console.log("API Response status:", response.status)
      console.log("API Response text:", responseText)
      
      let responseData: Position | ApiErrorResponse | null = null
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        console.error("Failed to parse JSON response:", e)
      }
      
      if (!response.ok) {
        // Get detailed error message
        const errorMessage = (responseData as ApiErrorResponse)?.error || 
                            (responseData as ApiErrorResponse)?.message || 
                            'Failed to update position'
        const errorDetails = (responseData as ApiErrorResponse)?.details || ''
        throw new Error(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`)
      }
      
      // Update local state with the data from API response
      if (responseData) {
        setPositions(positions.map(pos => pos.id === (responseData as Position).id ? (responseData as Position) : pos))
      }
      setIsEditingPosition(false)
      setCurrentPosition(null)
      
      toast({
        title: "Success",
        description: "Position updated successfully",
      })
    } catch (error) {
      console.error("Error updating position:", error)
      toast({
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to update position. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePositionStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "Open" ? "Closed" : "Open"
      
      // Call API to update position status
      const response = await fetch(`/api/positions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update position status')
      }
      
      const updatedPosition = await response.json()
      
      // Update local state
      setPositions(positions.map(position => 
        position.id === updatedPosition.id ? updatedPosition : position
      ))
      
      toast({
        title: "Success",
        description: `Position ${newStatus === "Open" ? "reopened" : "closed"} successfully`,
      })
    } catch (error) {
      console.error("Error updating position status:", error)
      toast({
        title: "Error",
        description: "Failed to update position status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (position: Position) => {
    setCurrentPosition(position)
    setIsEditingPosition(true)
  }

  // Filter positions based on search term and status
  const filteredPositions = useMemo(() => {
    return positions.filter((position) => {
      const matchesSearch =
        position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || position.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [positions, searchTerm, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage)
  const paginatedPositions = filteredPositions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading positions...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAddingPosition} onOpenChange={setIsAddingPosition}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Position
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Position</DialogTitle>
                <DialogDescription>Create a new job position for your organization.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={newPosition.title}
                      onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newPosition.department}
                      onChange={(e) => setNewPosition({ ...newPosition, department: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newPosition.location}
                      onChange={(e) => setNewPosition({ ...newPosition, location: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Job Type</Label>
                    <Select
                      value={newPosition.type}
                      onValueChange={(value) => setNewPosition({ ...newPosition, type: value })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={newPosition.description}
                    onChange={(e) => setNewPosition({ ...newPosition, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    rows={4}
                    value={newPosition.requirements}
                    onChange={(e) => setNewPosition({ ...newPosition, requirements: e.target.value })}
                    placeholder="Enter requirements separated by new lines"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingPosition(false)}>
                  Cancel
                </Button>
                <Button onClick={addPosition} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Position'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applicants</TableHead>
              <TableHead>Posted Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPositions.length > 0 ? (
              paginatedPositions.map((position) => (
                <PositionRow
                  key={position.id}
                  position={position}
                  onToggleStatus={togglePositionStatus}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No positions found.
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

      {/* Edit Position Dialog */}
      <Dialog open={isEditingPosition} onOpenChange={setIsEditingPosition}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Position</DialogTitle>
            <DialogDescription>Update the job position details.</DialogDescription>
          </DialogHeader>
          {currentPosition && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Job Title</Label>
                  <Input
                    id="edit-title"
                    value={currentPosition.title}
                    onChange={(e) => setCurrentPosition({ ...currentPosition, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    value={currentPosition.department}
                    onChange={(e) => setCurrentPosition({ ...currentPosition, department: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={currentPosition.location}
                    onChange={(e) => setCurrentPosition({ ...currentPosition, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Job Type</Label>
                  <Select
                    value={currentPosition.type}
                    onValueChange={(value) => setCurrentPosition({ ...currentPosition, type: value })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Job Description</Label>
                <Textarea
                  id="edit-description"
                  rows={4}
                  value={currentPosition.description}
                  onChange={(e) => setCurrentPosition({ ...currentPosition, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-requirements">Requirements</Label>
                <Textarea
                  id="edit-requirements"
                  rows={4}
                  value={currentPosition.requirements}
                  onChange={(e) => setCurrentPosition({ ...currentPosition, requirements: e.target.value })}
                  placeholder="Enter requirements separated by new lines"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingPosition(false)}>
              Cancel
            </Button>
            <Button onClick={editPosition} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

