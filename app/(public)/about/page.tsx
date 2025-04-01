"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileSearch, Users, Calendar, BarChart4, CheckCircle, ArrowRight, Award, Globe, Target } from "lucide-react"

export default function AboutPage() {
  const missionRef = useRef(null)
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 })

  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 })

  const teamRef = useRef(null)
  const teamInView = useInView(teamRef, { once: true, amount: 0.3 })

  const features = [
    {
      icon: FileSearch,
      title: "AI Resume Parsing",
      description:
        "Our system automatically extracts relevant information from resumes, saving HR teams hours of manual data entry.",
    },
    {
      icon: Users,
      title: "Candidate Matching",
      description:
        "Using advanced algorithms, we match candidates to job descriptions based on skills, experience, and other relevant factors.",
    },
    {
      icon: Calendar,
      title: "Interview Scheduling",
      description: "Streamline the interview process with automated scheduling that integrates with Google Calendar.",
    },
    {
      icon: BarChart4,
      title: "Analytics Dashboard",
      description: "Get a complete overview of your recruitment pipeline with our intuitive dashboard.",
    },
  ]

  const team = [
    {
      name: "Sonu Gupta",
      role: "CEO & Founder",
      bio: "15+ years in HR technology, passionate about transforming recruitment processes.",
      image: "./sonu_gupta.jpeg",
    },
    {
      name: "Sagar Janjoted",
      role: "CTO",
      bio: "Expert in AI and machine learning with a focus on natural language processing.",
      image: "/placeholder.svg?height=300&width=300&text=MJ",
    },
    {
      name: "Aditri Mukharjee",
      role: "Head of Product",
      bio: "Former HR director with a deep understanding of recruitment challenges.",
      image: "/placeholder.svg?height=300&width=300&text=SW",
    },
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary to-primary-foreground/5 text-primary-foreground py-20">
        <div className="absolute inset-0 bg-grid-white/10 bg-[length:20px_20px] [mask-image:radial-gradient(white,transparent_85%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl font-bold mb-6">About HRMS</h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Our AI-Powered HR Management System is designed to streamline the entire recruitment process, from job
              posting to interview scheduling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20" ref={missionRef}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary-foreground/20 rounded-lg blur-lg opacity-50"></div>
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img
                    src="/placeholder.svg?height=600&width=800&text=Our+Mission"
                    alt="Our Mission"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={missionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Mission</h2>
                </div>

                <p className="text-muted-foreground">
                  We believe that recruitment should be efficient, fair, and data-driven. Our mission is to provide HR
                  teams with the tools they need to make better hiring decisions while reducing the administrative
                  burden of the recruitment process.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Efficiency</h3>
                      <p className="text-sm text-muted-foreground">
                        Automate repetitive tasks to save time and resources
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Fairness</h3>
                      <p className="text-sm text-muted-foreground">
                        Reduce bias in the hiring process with data-driven decisions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Innovation</h3>
                      <p className="text-sm text-muted-foreground">
                        Continuously improve our platform with the latest AI technologies
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground">
              Our HR Management System is packed with features to help you streamline your recruitment process.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-background rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Our Technology</h2>
                </div>

                <p className="text-muted-foreground">
                  We use cutting-edge technology to power our HRMS platform, ensuring reliability, security, and
                  performance.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Next.js</h3>
                    <p className="text-sm text-muted-foreground">For a fast, responsive user interface</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">MongoDB</h3>
                    <p className="text-sm text-muted-foreground">For secure, scalable data storage</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Clerk</h3>
                    <p className="text-sm text-muted-foreground">For seamless authentication</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Google APIs</h3>
                    <p className="text-sm text-muted-foreground">For email and calendar functionality</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-foreground/20 to-primary/20 rounded-lg blur-lg opacity-50"></div>
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img
                    src="/placeholder.svg?height=600&width=800&text=Our+Technology"
                    alt="Our Technology"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/50" ref={teamRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground">Meet the talented individuals behind our HR Management System.</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-background rounded-lg overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

