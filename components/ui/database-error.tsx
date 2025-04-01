"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { useState } from "react"

interface DatabaseErrorProps {
  message?: string
  retryAction?: () => void
  showRetry?: boolean
}

export function DatabaseError({
  message = "We're having trouble connecting to the database. This might be a temporary issue.",
  retryAction,
  showRetry = true
}: DatabaseErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    if (!retryAction) return
    
    setIsRetrying(true)
    try {
      await retryAction()
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Database Connection Error</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{message}</p>
        <ul className="mt-2 ml-5 list-disc text-sm opacity-80">
          <li>The database server might be temporarily unavailable</li>
          <li>There might be network connectivity issues</li>
          <li>The database connection information might be incorrect</li>
        </ul>
        {showRetry && retryAction && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry} 
            disabled={isRetrying}
            className="mt-3 border-destructive/30 hover:bg-destructive/20"
          >
            {isRetrying ? (
              <>
                <RefreshCcw className="h-3 w-3 mr-2 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCcw className="h-3 w-3 mr-2" />
                Retry Connection
              </>
            )}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
} 