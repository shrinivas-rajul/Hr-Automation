"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, AlertTriangle, Loader2 } from "lucide-react"

export function TestAuth() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initSuccess, setInitSuccess] = useState<string | null>(null)
  
  const testUserRecord = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setTestResult(null)
      setInitSuccess(null)
      
      if (!isSignedIn || !user) {
        setError("You must be signed in to test user record")
        return
      }
      
      const clerkId = user.id
      console.log("Testing with Clerk ID:", clerkId)
      
      // Test user record in database
      const response = await fetch('/api/test-user-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clerkId }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setTestResult(JSON.stringify(data, null, 2))
      } else {
        setError(data.error || "Failed to test user record")
        setTestResult(JSON.stringify(data, null, 2))
      }
    } catch (error) {
      console.error("Error testing user record:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }
  
  const initializeUser = async () => {
    try {
      setIsInitializing(true)
      setError(null)
      setInitSuccess(null)
      setTestResult(null)
      
      if (!isSignedIn || !user) {
        setError("You must be signed in to initialize user record")
        return
      }
      
      // Initialize user record in database
      const response = await fetch('/api/init-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setInitSuccess(data.message || "User initialized successfully")
        setTestResult(JSON.stringify(data, null, 2))
      } else {
        setError(data.error || "Failed to initialize user record")
        setTestResult(JSON.stringify(data, null, 2))
      }
    } catch (error) {
      console.error("Error initializing user record:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsInitializing(false)
    }
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Auth & User Record Test</CardTitle>
        <CardDescription>
          Test if your Clerk authentication and database user record are working properly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Clerk Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Status: {isLoaded ? (isSignedIn ? "Signed In" : "Not Signed In") : "Loading..."}
            </p>
            {isSignedIn && user && (
              <div className="mt-2 text-sm">
                <p>User ID: {user.id}</p>
                <p>Name: {user.fullName}</p>
                <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
              </div>
            )}
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {initSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{initSuccess}</AlertDescription>
            </Alert>
          )}
          
          {testResult && (
            <div className="p-3 bg-slate-50 text-slate-800 border border-slate-200 rounded-md text-sm">
              <p className="font-medium">API Response:</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs">{testResult}</pre>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={testUserRecord} 
          disabled={!isSignedIn || isLoading}
          variant="secondary"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : "Test User Record"}
        </Button>
        
        <Button 
          onClick={initializeUser} 
          disabled={!isSignedIn || isInitializing}
          className="w-full"
        >
          {isInitializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : "Initialize User"}
        </Button>
      </CardFooter>
    </Card>
  )
} 