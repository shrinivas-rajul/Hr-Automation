import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import { Prisma } from "@prisma/client"
import { auth } from "@clerk/nextjs/server"

// Helper function to retry a database operation with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.error(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt === maxRetries) break;
      
      // Exponential backoff
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Helper function to check database connection
async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection error", details: "Unable to connect to the database. Please try again later." },
        { status: 503 }
      );
    }

    const body = await request.json()
    console.log("Received application data:", body)

    const {
      jobId,
      resumeUrl,
      coverLetter,
      name,
      email,
      phone,
      skills,
      experience,
      matchScore,
    } = body

    // Validate required fields
    if (!jobId || !resumeUrl || !name || !email) {
      console.error("Missing required fields:", { jobId, resumeUrl, name, email })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Log job ID for debugging
    console.log("Looking up job with ID:", jobId)

    // Ensure skills is an array
    const skillsArray = Array.isArray(skills) ? skills : [skills]

    try {
      // Check if the job exists first
      const job = await withRetry(() => 
        prisma.job.findUnique({
          where: { id: jobId }
        })
      );

      console.log("Job lookup result:", job)

      // If job not found, check positions table (alternative job table)
      if (!job) {
        console.log("Job not found in jobs table, checking positions...")
        const position = await withRetry(() =>
          prisma.position.findUnique({
            where: { id: jobId }
          })
        );

        console.log("Position lookup result:", position)

        if (!position) {
          console.error("Job not found in either table. Job ID:", jobId)
          return NextResponse.json(
            { error: "Job not found", details: "The job you're applying to doesn't exist or has been removed." },
            { status: 404 }
          );
        }
      }
      
      // First, create or update the candidate with retry logic
      const candidate = await withRetry(() => 
        prisma.candidate.upsert({
          where: {
            email: email,
          },
          update: {
            name,
            phone: phone || undefined,
            skills: skillsArray,
            experience: experience || undefined,
            updatedAt: new Date(),
          },
          create: {
            email,
            name,
            phone: phone || undefined,
            skills: skillsArray,
            experience: experience || undefined,
          },
        })
      );

      console.log("Candidate created/updated:", candidate)

      // Try to get the authenticated user's ID if available
      let userId: string | undefined = undefined;
      try {
        const authResult = await auth();
        if (authResult?.userId) {
          // Find the corresponding user in our database
          const dbUser = await prisma.user.findUnique({
            where: { clerkId: authResult.userId }
          });
          if (dbUser) {
            userId = dbUser.id;
          }
        }
      } catch (authError) {
        console.log("No authenticated user, creating application without user ID");
      }

      // Create or get system user for unauthenticated applications
      if (!userId) {
        const systemUser = await prisma.user.upsert({
          where: { email: "system@example.com" },
          update: {},
          create: {
            email: "system@example.com",
            name: "System User",
            clerkId: "system",
          },
        });
        userId = systemUser.id;
      }

      // Create the application with proper relations
      const applicationData = {
        jobId,
        candidateId: candidate.id,
        userId,
        resumeUrl,
        coverLetter: coverLetter || null,
        status: "PENDING",
        matchScore: matchScore || 0,
        email,
        name,
        skills: skillsArray,
        experience: experience || null
      };

      console.log("Creating application with data:", applicationData);

      const application = await withRetry(() =>
        prisma.application.create({
          data: applicationData
        })
      );

      console.log("Application created:", application)

      return NextResponse.json(
        { message: "Application submitted successfully", applicationId: application.id },
        { status: 201 }
      )
    } catch (error) {
      console.error("Database operation error:", error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors
        if (error.code === "P2003") {
          return NextResponse.json(
            { error: "Invalid job ID", details: "The job you're applying to doesn't exist." },
            { status: 400 }
          )
        }
        if (error.code === "P1001") {
          return NextResponse.json(
            { error: "Database connection error", details: "Please try again later." },
            { status: 503 }
          )
        }
      }
      throw error // Re-throw other errors
    }
  } catch (error) {
    console.error("Application submission error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")

    // Build the query based on whether jobId is provided
    const query = {
      where: {
        userId,
        ...(jobId ? { jobId } : {}),
      },
      include: {
        job: true,
        candidate: true,
      },
      orderBy: {
        createdAt: "desc" as const,
      },
    }

    // Use retry logic for database query
    const applications = await withRetry(() => prisma.application.findMany(query));

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    
    // Provide a more informative error message for connection issues
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P1001') {
      return NextResponse.json(
        { 
          error: "Database connection failed", 
          details: "Unable to connect to the database. Please try again later or contact support." 
        },
        { status: 503 } // Service Unavailable
      )
    }
    
    return NextResponse.json(
      { error: "Failed to fetch applications", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 