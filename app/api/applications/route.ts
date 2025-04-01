import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// Helper function to retry a database operation with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is a connection issue that might be resolved by retrying
      if (
        error instanceof PrismaClientKnownRequestError && 
        (error.code === 'P1001' || error.code === 'P1002' || error.code === 'P1008' || error.code === 'P1017')
      ) {
        console.log(`Database operation failed (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Exponential backoff
        delay *= 2;
      } else {
        // For other errors, don't retry
        throw error;
      }
    }
  }
  
  // If we've exhausted all retries, throw the last error
  throw lastError;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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

    // Ensure skills is an array
    const skillsArray = Array.isArray(skills) ? skills : [skills]

    try {
      // Check if the job exists first
      const job = await prisma.job.findUnique({
        where: { id: jobId }
      });

      // If job not found, check positions table (alternative job table)
      if (!job) {
        const position = await prisma.position.findUnique({
          where: { id: jobId }
        });

        if (!position) {
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
            phone,
            resumeUrl,
            skills: skillsArray,
            experience,
          },
          create: {
            name,
            email,
            phone: phone || "",
            resumeUrl,
            skills: skillsArray,
            experience: experience || "",
          },
        })
      );

      console.log("Created/Updated candidate:", candidate)

      // Then create the application with retry logic
      const application = await withRetry(() => 
        prisma.application.create({
          data: {
            jobId,
            candidateId: candidate.id,
            resumeUrl,
            coverLetter: coverLetter || "",
            name,
            email,
            phone: phone || "",
            skills: skillsArray,
            experience: experience || "",
            matchScore: matchScore || 0,
            userId,
            status: "PENDING",
          },
        })
      );

      console.log("Created application:", application)
      return NextResponse.json(application)
    } catch (dbError) {
      console.error("Database operation error:", dbError)
      
      // Provide more informative error messages for specific database errors
      if (dbError instanceof PrismaClientKnownRequestError) {
        // Handle foreign key constraint violation
        if (dbError.code === 'P2003') {
          const fieldName = dbError.meta?.field_name as string | undefined;
          if (fieldName && fieldName.includes('jobId')) {
            return NextResponse.json(
              { 
                error: "Invalid job reference", 
                details: "The job you're applying to doesn't exist or has been removed." 
              },
              { status: 404 } 
            );
          } else if (fieldName && fieldName.includes('userId')) {
            return NextResponse.json(
              { 
                error: "User reference error", 
                details: "There was a problem with your user account. Please try logging out and back in." 
              },
              { status: 400 } 
            );
          }
        }
        
        // Handle connection errors
        if (dbError.code === 'P1001') {
          return NextResponse.json(
            { 
              error: "Database connection failed", 
              details: "Unable to connect to the database. Please try again later or contact support." 
            },
            { status: 503 } // Service Unavailable
          )
        }
      }
      
      return NextResponse.json(
        { error: "Database operation failed", details: dbError instanceof Error ? dbError.message : "Unknown database error" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json(
      { error: "Failed to create application", details: error instanceof Error ? error.message : "Unknown error" },
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
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P1001') {
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