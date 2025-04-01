"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Check, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    setError(null)

    if (!selectedFile) return

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF or Word document")
      return
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setFile(selectedFile)
  }

  const handleUpload = () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          onFileUpload(file)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={triggerFileInput}
      >
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx" />
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Upload your resume</h3>
        <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to browse</p>
        <p className="text-xs text-muted-foreground">Supports PDF, DOC, DOCX (Max 5MB)</p>
      </div>

      {file && (
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            {!uploading && progress < 100 && <Button onClick={handleUpload}>Upload</Button>}
            {progress === 100 && <Check className="h-5 w-5 text-green-500" />}
          </div>

          {uploading && (
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-right mt-1">{progress}%</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 p-3 rounded-lg flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}

