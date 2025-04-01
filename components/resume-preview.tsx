"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface ResumePreviewProps {
  resumeUrl: string
  candidateName: string
}

export function ResumePreview({ resumeUrl, candidateName }: ResumePreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Preview resume</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Resume Preview - {candidateName}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <iframe
            src={resumeUrl}
            className="w-full h-full min-h-[60vh]"
            title={`Resume of ${candidateName}`}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 