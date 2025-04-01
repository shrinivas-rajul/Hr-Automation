import { TestAuth } from "@/components/test-auth"

export default function TestAuthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Authentication Test</h2>
        <p className="text-muted-foreground">Test your Clerk authentication and database user records.</p>
      </div>
      
      <div className="mt-8">
        <TestAuth />
      </div>
    </div>
  )
} 