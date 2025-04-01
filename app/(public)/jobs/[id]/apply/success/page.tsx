"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle, ArrowRight, Home, Search } from "lucide-react"

export default function ApplicationSuccessPage() {
  return (
    <div className="bg-muted/30 min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="border-none shadow-lg text-center">
          <CardHeader>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: 0.2,
              }}
              className="mx-auto bg-primary/10 p-5 rounded-full w-24 h-24 flex items-center justify-center mb-4"
            >
              <CheckCircle className="h-12 w-12 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl">Application Submitted!</CardTitle>
            <CardDescription className="text-base">Your application has been successfully submitted.</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ol className="text-sm text-muted-foreground text-left space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </span>
                    <span>Our HR team will review your application</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>You'll receive an email confirmation shortly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </span>
                    <span>If your profile matches our requirements, we'll contact you for an interview</span>
                  </li>
                </ol>
              </div>
              <p className="text-muted-foreground mb-4">
                Thank you for applying. Our HR team will review your application and get back to you soon.
              </p>
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/jobs">
                <Button className="w-full sm:w-auto">
                  <Search className="mr-2 h-4 w-4" />
                  Browse More Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

