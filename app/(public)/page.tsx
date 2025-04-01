"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import JobListings from "@/components/job-listings"
import { Users, FileSearch, Calendar, BarChart4, ArrowRight } from "lucide-react"

export default function Home() {
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })

  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, amount: 0.2 })

  const features = [
    {
      icon: FileSearch,
      title: "AI Resume Parsing",
      description: "Our AI automatically extracts key information from resumes, saving hours of manual data entry.",
    },
    {
      icon: Users,
      title: "Candidate Matching",
      description: "Match candidates to job descriptions based on skills, experience, and other relevant factors.",
    },
    {
      icon: Calendar,
      title: "Interview Scheduling",
      description: "Streamline the interview process with automated scheduling that integrates with Google Calendar.",
    },
    {
      icon: BarChart4,
      title: "Analytics Dashboard",
      description: "Get insights into your recruitment process with comprehensive analytics and reporting.",
    },
  ]

  const stats = [
    { value: "85%", label: "Time Saved in Resume Screening" },
    { value: "3x", label: "Faster Hiring Process" },
    { value: "95%", label: "Client Satisfaction" },
    { value: "60%", label: "Reduction in Hiring Costs" },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary to-primary-foreground/5 dark:from-primary/80 dark:to-background">
        <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px] [mask-image:radial-gradient(white,transparent_85%)]"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 dark:from-white dark:to-gray-300">
                AI-Powered HR Management System
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
                Streamline your recruitment process with our intelligent HR platform. From resume parsing to interview
                scheduling, we've got you covered.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link href="/jobs">
                <Button size="lg" className="rounded-full">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-primary-foreground/5"></div>
              <img
                src="/project01.png"
                alt="HR Dashboard Preview"
                className="w-full h-auto relative z-10 opacity-90 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                <p className="text-white text-lg font-medium">Powerful dashboard for HR professionals</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our HR Management System is packed with features to help you streamline your recruitment process.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground" ref={statsRef}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Featured Job Openings</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our current job opportunities and find your next career move.
              </p>
            </motion.div>
          </div>

          <JobListings featured={true} />

          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/jobs">
                <Button variant="outline" size="lg" className="rounded-full">
                  View All Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from HR professionals who have transformed their recruitment process with our platform.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i - 1) * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-lg p-6 shadow-sm border border-border"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <img
                      src={`/placeholder.svg?height=60&width=60&text=${i}`}
                      alt={`Client ${i}`}
                      className="rounded-full w-12 h-12 object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">Client Name {i}</h4>
                    <p className="text-sm text-muted-foreground">HR Director, Company {i}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "This HR Management System has completely transformed our recruitment process. We've reduced our
                  time-to-hire by 60% and improved the quality of our candidates."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-yellow-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-foreground/30 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Recruitment Process?</h2>
              <p className="text-xl mb-8 text-primary-foreground/90">
                Join thousands of companies that have streamlined their hiring with our AI-powered HR Management System.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/sign-up">
                  <Button size="lg" variant="outline" className="rounded-full bg-white text-primary hover:bg-white/90">
                    Get Started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="rounded-full bg-primary-foreground/10 backdrop-blur-sm border-white/20 hover:bg-primary-foreground/20"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

