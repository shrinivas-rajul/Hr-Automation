import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, Building } from "lucide-react"
import prisma from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

// Fetch job from database
async function getJob(id: string) {
  try {
    // First try to get job from the jobs table
    const job = await prisma.job.findUnique({
      where: { id }
    });

    if (job) {
      return {
        id: job.id,
        title: job.title,
        department: "Engineering", // Default
        location: job.location,
        type: job.type,
        description: job.description,
        requirements: job.requirements.split('\n').filter(Boolean),
        responsibilities: [
          "Develop and maintain user interfaces for our web applications",
          "Collaborate with designers, product managers, and backend developers",
          "Implement new features and improve existing ones",
          "Ensure the performance, quality, and responsiveness of applications",
          "Identify and fix bugs and performance bottlenecks",
        ],
        benefits: [
          "Competitive salary and equity",
          "Health, dental, and vision insurance",
          "Flexible work hours and remote work options",
          "Professional development budget",
        ],
        postedDate: job.createdAt.toISOString().split('T')[0],
        company: job.company,
      };
    }

    // If not found in jobs, try positions table
    const position = await prisma.position.findUnique({
      where: { id }
    });

    if (position) {
      return {
        id: position.id,
        title: position.title,
        department: position.department,
        location: position.location,
        type: position.type,
        description: position.description,
        requirements: position.requirements.split('\n').filter(Boolean),
        responsibilities: [
          "Develop and maintain user interfaces for our web applications",
          "Collaborate with designers, product managers, and backend developers",
          "Implement new features and improve existing ones",
          "Ensure the performance, quality, and responsiveness of applications",
          "Identify and fix bugs and performance bottlenecks",
        ],
        benefits: [
          "Competitive salary and equity",
          "Health, dental, and vision insurance",
          "Flexible work hours and remote work options",
          "Professional development budget",
        ],
        postedDate: position.postedDate.toISOString().split('T')[0],
        company: "Our Company", // Default since positions don't have company
      };
    }

    // If not found in either table, return null
    return null;
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
}

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const job = await getJob(resolvedParams.id);
  
  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Link href="/jobs" className="inline-flex items-center text-sm mb-6 hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all jobs
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <CardTitle className="text-3xl">{job.title}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {job.department}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {job.type}
                  </Badge>
                </div>
              </CardDescription>
            </div>
            <Link href={`/jobs/${job.id}/apply`}>
              <Button size="lg">Apply Now</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Job Description</h3>
            <p>{job.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Responsibilities</h3>
            <ul className="list-disc pl-5 space-y-1">
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Requirements</h3>
            <ul className="list-disc pl-5 space-y-1">
              {job.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Benefits</h3>
            <ul className="list-disc pl-5 space-y-1">
              {job.benefits.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t pt-6">
          <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
            Posted: {formatDate(job.postedDate)}
          </p>
          <Link href={`/jobs/${job.id}/apply`}>
            <Button>Apply for this Position</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

