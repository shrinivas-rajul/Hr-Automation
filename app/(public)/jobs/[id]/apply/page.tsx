"use client"

import type React from "react"
import { use } from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "@/components/file-uploader"
import { ResumePreview } from "@/components/resume-preview"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, FileText, User, Mail, Phone, Briefcase, CheckCircle } from "lucide-react"

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [step, setStep] = useState(1)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resumeUrl, setResumeUrl] = useState("")
  const [parsedData, setParsedData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    candidateId: "",
    resumeUrl: "",
    coverLetter: "",
    matchScore: 0,
  })

  const handleResumeUpload = async (file: File) => {
    try {
      // Upload to Cloudinary through our API
      const formData = new FormData()
      formData.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || "Failed to upload file")
      }

      const uploadData = await uploadResponse.json()
      console.log("Upload response:", uploadData)
      setResumeUrl(uploadData.secure_url)

      // Parse resume data
      const parseFormData = new FormData()
      parseFormData.append("file", file)

      const parseResponse = await fetch("/api/resume-parser", {
        method: "POST",
        body: parseFormData,
      })

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json()
        throw new Error(errorData.error || "Failed to parse resume")
      }

      const data = await parseResponse.json()
      console.log("Parse response:", data)
      
      // Validate parsed data
      if (!data.name || !data.email) {
        toast({
          title: "Warning",
          description: "Some information could not be extracted from your resume. Please review and update the information below.",
          variant: "default",
        })
      }

      // Update form data
      const updatedData = {
        ...parsedData,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || "",
        experience: data.experience || "",
        candidateId: data.candidateId,
        resumeUrl: uploadData.secure_url,
        matchScore: data.matchScore || 0,
      }

      console.log("Updated form data:", updatedData)
      setParsedData(updatedData)
      setResumeUploaded(true)
      toast({
        title: "Resume uploaded successfully",
        description: "We've extracted your information. Please review and make any necessary changes.",
        variant: "default",
      })
      setStep(2)
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload or parse resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Enhanced validation
      if (!parsedData.name.trim()) {
        throw new Error("Please enter your name")
      }
      
      if (!parsedData.email.trim()) {
        throw new Error("Please enter your email")
      }
      
      if (!parsedData.resumeUrl) {
        throw new Error("Please upload your resume")
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(parsedData.email.trim())) {
        throw new Error("Please enter a valid email address")
      }

      // Log the job ID for debugging
      console.log("Job ID from params:", resolvedParams.id)

      // Prepare the data for submission
      const applicationData = {
        jobId: resolvedParams.id,
        resumeUrl: parsedData.resumeUrl,
        coverLetter: parsedData.coverLetter || "",
        name: parsedData.name.trim(),
        email: parsedData.email.trim(),
        phone: parsedData.phone ? parsedData.phone.trim() : "",
        skills: parsedData.skills.split(",").map(s => s.trim()).filter(Boolean),
        experience: parsedData.experience ? parsedData.experience.trim() : "",
        matchScore: parsedData.matchScore || 0,
      }

      console.log("Submitting application data:", applicationData)

      // Submit application
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      })

      const data = await response.json()
      console.log("Response status:", response.status)
      console.log("Response data:", data)

      if (!response.ok) {
        console.error("Application submission error:", { status: response.status, data })
        
        // Handle specific error cases
        if (response.status === 404) {
          toast({
            title: "Job Not Found",
            description: "The job you're applying to no longer exists or has been removed.",
            variant: "destructive",
          })
          return
        } else if (response.status === 400) {
          toast({
            title: "Invalid Data",
            description: data.error || "Please check your application data and try again.",
            variant: "destructive",
          })
          return
        } else {
          toast({
            title: "Error",
            description: data.error || data.details || "There was a problem submitting your application. Please try again.",
            variant: "destructive",
          })
          return
        }
      }

      // Success
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully! We'll review your application and get back to you soon.",
        variant: "default",
      })

      // Redirect to success page
      router.push(`/jobs/${resolvedParams.id}/apply/success`)
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem submitting your application.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setParsedData((prev) => ({ ...prev, [name]: value }))
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="bg-muted/30 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href={`/jobs/${resolvedParams.id}`}
            className="inline-flex items-center text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to job details
          </Link>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Apply for Position</CardTitle>
              <CardDescription>Complete the application process to apply for this position.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                      <div
                        className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
                      >
                        <FileText className="h-5 w-5" />
                      </div>
                      <span className="ml-2 font-medium">Resume</span>
                    </div>
                    <div
                      className={`flex-1 border-t-2 mx-4 ${step >= 2 ? "border-primary" : "border-muted-foreground"}`}
                    ></div>
                    <div className={`flex items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                      <div
                        className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}
                      >
                        <User className="h-5 w-5" />
                      </div>
                      <span className="ml-2 font-medium">Review</span>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs value={`step-${step}`} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="step-1" disabled={step !== 1} onClick={() => setStep(1)}>
                    Upload Resume
                  </TabsTrigger>
                  <TabsTrigger value="step-2" disabled={!resumeUploaded} onClick={() => resumeUploaded && setStep(2)}>
                    Review Information
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <TabsContent value="step-1" className="py-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="bg-muted/50 rounded-lg p-6 border border-border">
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-primary" />
                            Upload Your Resume
                          </h3>
                          <p className="text-muted-foreground mb-6">
                            Please upload your resume. We'll automatically extract your information to make the
                            application process easier. We support PDF and Word documents.
                          </p>
                          <FileUploader onFileUpload={handleResumeUpload} />
                        </div>

                        <div className="flex justify-between items-center pt-4">
                          <Link href={`/jobs/${resolvedParams.id}`}>
                            <Button variant="outline">
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                          </Link>
                          <Button onClick={() => resumeUploaded && setStep(2)} disabled={!resumeUploaded}>
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    </TabsContent>
                  )}

                  {step === 2 && (
                    <TabsContent value="step-2" className="py-6">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium">Resume Preview</h3>
                            {resumeUrl && <ResumePreview resumeUrl={resumeUrl} candidateName={parsedData.name} />}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="name" className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                                Full Name
                              </Label>
                              <Input
                                id="name"
                                name="name"
                                value={parsedData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Your full name"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email" className="flex items-center">
                                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                Email
                              </Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={parsedData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="your.email@example.com"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                              Phone
                            </Label>
                            <Input 
                              id="phone" 
                              name="phone" 
                              value={parsedData.phone} 
                              onChange={handleInputChange}
                              placeholder="Your phone number"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="skills" className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                              Skills
                            </Label>
                            <Textarea
                              id="skills"
                              name="skills"
                              value={parsedData.skills}
                              onChange={handleInputChange}
                              required
                              placeholder="Your skills (comma-separated)"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="experience" className="flex items-center">
                              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                              Experience
                            </Label>
                            <Textarea
                              id="experience"
                              name="experience"
                              value={parsedData.experience}
                              onChange={handleInputChange}
                              required
                              rows={4}
                              placeholder="Your work experience"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="coverLetter" className="flex items-center">
                              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                              Cover Letter (Optional)
                            </Label>
                            <Textarea
                              id="coverLetter"
                              name="coverLetter"
                              value={parsedData.coverLetter}
                              onChange={handleInputChange}
                              placeholder="Tell us why you're interested in this position and why you'd be a good fit."
                              rows={6}
                            />
                          </div>

                          <div className="flex justify-between items-center pt-4">
                            <Button type="button" variant="outline" onClick={() => setStep(1)}>
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  Submit Application
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </form>
                      </motion.div>
                    </TabsContent>
                  )}
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

