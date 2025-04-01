"use client";

import { useState, memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

// Mock data - would come from your database in production
const mockCandidates = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "Frontend Developer",
    matchScore: 92,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    experience: "5 years",
  },
  {
    id: 2,
    name: "Maria Garcia",
    position: "UX Designer",
    matchScore: 89,
    skills: ["Figma", "User Research", "Prototyping", "UI Design"],
    experience: "4 years",
  },
  {
    id: 3,
    name: "James Wilson",
    position: "Backend Engineer",
    matchScore: 87,
    skills: ["Node.js", "PostgreSQL", "Express", "API Design"],
    experience: "6 years",
  },
  {
    id: 4,
    name: "Sophia Lee",
    position: "Frontend Developer",
    matchScore: 85,
    skills: ["React", "JavaScript", "CSS", "HTML"],
    experience: "3 years",
  },
  {
    id: 5,
    name: "Daniel Brown",
    position: "Backend Engineer",
    matchScore: 83,
    skills: ["Python", "Django", "SQL", "Docker"],
    experience: "4 years",
  },
];

// Memoized table row component for better performance
const CandidateRow = memo(
  ({
    candidate,
    isSelected,
    onToggleSelect,
  }: {
    candidate: (typeof mockCandidates)[0];
    isSelected: boolean;
    onToggleSelect: (id: number) => void;
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
        />
      </TableCell>
      <TableCell className="font-medium">{candidate.name}</TableCell>
      <TableCell>{candidate.position}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Progress
            value={candidate.matchScore}
            className={`w-20 h-2 ${
              candidate.matchScore >= 90
                ? "[&>div]:bg-green-500"
                : candidate.matchScore >= 80
                ? "[&>div]:bg-blue-500"
                : "[&>div]:bg-amber-500"
            }`}
          />
          <span
            className={
              candidate.matchScore >= 90
                ? "text-green-500"
                : candidate.matchScore >= 80
                ? "text-blue-500"
                : "text-amber-500"
            }
          >
            {candidate.matchScore}%
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {candidate.skills.map((skill, index) => (
            <span
              key={index}
              className="text-xs bg-muted px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell>{candidate.experience}</TableCell>
    </motion.tr>
  )
);

CandidateRow.displayName = "CandidateRow";

export function TopCandidates() {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isScheduling, setIsScheduling] = useState(false);
  const itemsPerPage = 5;

  const toggleCandidate = (id: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(id)
        ? prev.filter((candidateId) => candidateId !== id)
        : [...prev, id]
    );
  };

  const toggleAllCandidates = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(filteredCandidates.map((c) => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const scheduleInterviews = () => {
    setIsScheduling(true);
  };

  // Filter candidates based on search term and position
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesPosition =
      positionFilter === "all" || candidate.position === positionFilter;

    return matchesSearch && matchesPosition;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique positions for filter
  const positions = Array.from(new Set(candidates.map((c) => c.position)));

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
                <Button onClick={scheduleInterviews}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interviews
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule Interviews</DialogTitle>
                  <DialogDescription>
                    Schedule interviews for {selectedCandidates.length} selected
                    candidates.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>Interview scheduling functionality would go here.</p>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsScheduling(false)}>Close</Button>
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
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {positions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
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
                    paginatedCandidates.every((c) =>
                      selectedCandidates.includes(c.id)
                    )
                  }
                  onCheckedChange={toggleAllCandidates}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Experience</TableHead>
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
                <TableCell colSpan={6} className="h-24 text-center">
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
