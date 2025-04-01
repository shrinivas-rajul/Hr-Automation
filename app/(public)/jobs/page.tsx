"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import JobListings from "@/components/job-listings"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Briefcase, MapPin } from "lucide-react"

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [department, setDepartment] = useState("")
  const [location, setLocation] = useState("")

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="bg-gradient-to-b from-primary to-primary/5 text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Browse our current job openings and find your next career opportunity
            </p>
          </motion.div>

         <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="bg-background rounded-lg shadow-lg p-6 max-w-4xl mx-auto -mb-12 relative z-10"
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Search Input */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 text-foreground placeholder:text-muted-foreground"
      />
    </div>

    {/* Department Dropdown */}
    <div className="relative">
      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger className="w-full text-foreground">
          <div className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Department" className="text-foreground" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-foreground bg-background">
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="product">Product</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Location Dropdown */}
    <div className="relative">
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-full text-foreground">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Location" className="text-foreground" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-foreground bg-background">
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="remote">Remote</SelectItem>
          <SelectItem value="new-york">New York, NY</SelectItem>
          <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
          <SelectItem value="london">London, UK</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>

  {/* Search Button */}
  <div className="mt-4 flex justify-center md:justify-end">
    <Button className="w-full md:w-auto">Search Jobs</Button>
  </div>
</motion.div>

        </div>
      </div>

      <div className="container mx-auto py-20 px-4">
        <div className="mb-12 pt-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <h2 className="text-2xl font-bold mb-2">Available Positions</h2>
            <p className="text-muted-foreground">
              Showing all open positions. Use the filters above to narrow your search.
            </p>
          </motion.div>
        </div>

        <JobListings />
      </div>
    </div>
  )
}

