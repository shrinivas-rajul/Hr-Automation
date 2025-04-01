import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <div className="container mx-auto p-4">
        <Link href="/" className="inline-flex items-center text-sm mb-6 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <SignIn
          appearance={{
            elements: {
              card: "shadow-lg",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
            },
          }}
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  )
}

