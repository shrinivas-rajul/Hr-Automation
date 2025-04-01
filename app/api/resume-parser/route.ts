import { NextResponse } from "next/server"
import { writeFile, unlink, access } from "fs/promises"
import { exec } from "child_process"
import { promisify } from "util"
import { join } from "path"
import { tmpdir } from "os"

const execAsync = promisify(exec)

export async function POST(request: Request) {
  let tempFilePath = ""
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Extract filename and check extension
    const fileName = file.name || "";
    const isValidExtension = fileName.toLowerCase().endsWith(".pdf") || 
                            fileName.toLowerCase().endsWith(".doc") || 
                            fileName.toLowerCase().endsWith(".docx");
    
    if (!isValidExtension) {
      return NextResponse.json({ 
        error: "Invalid file type. Please upload a PDF, DOC, or DOCX file."
      }, { status: 400 });
    }

    // Convert file to buffer and save temporarily
    const buffer = Buffer.from(await file.arrayBuffer())
    tempFilePath = join(tmpdir(), `resume-${Date.now()}.pdf`)
    await writeFile(tempFilePath, buffer)

    try {
      // Run Python script to parse resume
      const scriptPath = join(process.cwd(), "scripts", "resume_parser.py")
      const { stdout, stderr } = await execAsync(`python ${scriptPath} ${tempFilePath}`)

      if (stderr) {
        console.error("Python script error:", stderr)
        // Rather than failing, we'll fall back to minimal parsing
        return fallbackParsing(file.name || "");
      }

      // Parse the JSON output from Python script
      try {
        const parsedData = JSON.parse(stdout)
        return NextResponse.json(parsedData)
      } catch (jsonError) {
        console.error("Failed to parse Python script output:", jsonError)
        return fallbackParsing(file.name || "");
      }
    } catch (pythonError) {
      console.error("Failed to run Python script:", pythonError)
      // Fall back to minimal parsing if Python fails
      return fallbackParsing(file.name || "");
    }
  } catch (error) {
    console.error("Error parsing resume:", error)
    return NextResponse.json(
      { error: "Failed to parse resume", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  } finally {
    // Clean up temporary file if it exists
    if (tempFilePath) {
      try {
        // Check if file exists before trying to delete
        await access(tempFilePath)
        await unlink(tempFilePath)
      } catch (cleanupError) {
        // Ignore errors if file doesn't exist or can't be deleted
        // This is expected in some cases and not critical
      }
    }
  }
}

// Fallback function to extract minimal information when parsing fails
function fallbackParsing(filename: string) {
  // Try to extract a name from the filename
  let name = "";
  if (filename) {
    // Remove file extension and replace underscores/hyphens with spaces
    name = filename.replace(/\.(pdf|doc|docx)$/i, "")
                   .replace(/[_-]/g, " ")
                   .trim();
    
    // Convert to title case
    name = name.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }
  
  return NextResponse.json({
    name: name || "",
    email: "",
    phone: "",
    skills: [],
    experience: "",
    matchScore: 0,
    note: "Automatic parsing failed. Please fill in your details manually."
  });
}

