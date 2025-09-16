"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

export function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeDemo, setActiveDemo] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      const elements = document.querySelectorAll(".scroll-reveal")
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        const elementVisible = 150

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("revealed")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const demoSteps = [
    { title: "Input Data", description: "Add subjects, faculty, and constraints", icon: "📝" },
    { title: "AI Processing", description: "Our algorithm optimizes your schedule", icon: "🤖" },
    { title: "Perfect Timetable", description: "Get conflict-free, optimized results", icon: "✅" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div
            className={`flex items-center space-x-2 transition-all duration-700 ${isVisible ? "animate-slide-in-left" : "opacity-0"}`}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse-glow">
              <span className="text-primary-foreground text-lg">📅</span>
            </div>
            <span className="text-xl font-bold text-foreground">TimetableAI</span>
          </div>
          <nav
            className={`hidden md:flex items-center space-x-6 transition-all duration-700 delay-200 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              Features
            </Link>
            <Link
              href="#tech-stack"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              Tech Stack
            </Link>
            <Link
              href="#testimonials"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              Testimonials
            </Link>
            <Link
              href="#demo"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              Demo
            </Link>
            <Link
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
            >
              Contact
            </Link>
          </nav>
          <Link
            href="/login"
            className={`transition-all duration-700 delay-300 ${isVisible ? "animate-slide-in-right" : "opacity-0"}`}
          >
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-16 h-16 bg-accent/10 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge
            className={`mb-2 bg-accent/10 text-accent-foreground border border-accent/20 transition-all duration-700 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <span className="mr-1">🎓</span>
            Assam Downtown University • SIH Hackathon 2025
          </Badge>
          <Badge
            className={`mb-4 bg-primary text-primary-foreground border-0 transition-all duration-700 delay-100 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <span className="mr-1">⚡</span>
            AI-Powered Scheduling
          </Badge>
          <h1
            className={`text-4xl md:text-6xl font-bold text-balance mb-6 text-foreground transition-all duration-700 delay-200 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            Transform Your Timetable Management with{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intelligent Solutions
            </span>
          </h1>
          <p
            className={`text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto transition-all duration-700 delay-300 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            Streamline your higher education scheduling with our AI-powered optimization system. Reduce conflicts,
            maximize resource utilization, and save countless hours of manual planning.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-400 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <Link href="/login">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                Start Free Trial
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted bg-transparent transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">🎥</span>
              Watch Demo
            </Button>
          </div>

          <div
            className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center transition-all duration-700 delay-500 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <div className="group cursor-pointer">
              <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                95%
              </div>
              <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Conflict Reduction
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                80%
              </div>
              <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Time Saved
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                Institutions Trust Us
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="py-20 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4 text-foreground">See How It Works</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Watch our AI-powered system create perfect timetables in three simple steps.
            </p>
          </div>

          <div className="max-w-4xl mx-auto scroll-reveal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {demoSteps.map((step, index) => (
                <div
                  key={index}
                  className={`text-center p-6 rounded-lg transition-all duration-500 cursor-pointer ${
                    activeDemo === index
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-card hover:bg-card/80 hover:scale-102"
                  }`}
                  onClick={() => setActiveDemo(index)}
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p
                    className={`text-sm ${activeDemo === index ? "text-primary-foreground/90" : "text-muted-foreground"}`}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Interactive Demo Visualization */}
            <div className="bg-card rounded-lg p-8 shadow-lg">
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div className="text-center font-semibold text-card-foreground">Time</div>
                <div className="text-center font-semibold text-card-foreground">Mon</div>
                <div className="text-center font-semibold text-card-foreground">Tue</div>
                <div className="text-center font-semibold text-card-foreground">Wed</div>
                <div className="text-center font-semibold text-card-foreground">Thu</div>
                <div className="text-center font-semibold text-card-foreground">Fri</div>
                <div className="text-center font-semibold text-card-foreground">Sat</div>
              </div>
              {["9:00", "10:00", "11:00", "12:00", "1:00"].map((time, timeIndex) => (
                <div key={time} className="grid grid-cols-7 gap-2 mb-2">
                  <div className="text-center py-2 text-sm text-muted-foreground">{time}</div>
                  {[...Array(6)].map((_, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`p-2 rounded text-xs text-center transition-all duration-500 ${
                        (timeIndex + dayIndex) % 3 === activeDemo
                          ? "bg-primary text-primary-foreground transform scale-105"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {(timeIndex + dayIndex) % 3 === activeDemo ? "CS101" : ""}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4 text-foreground">
              Everything You Need for Perfect Scheduling
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Our comprehensive platform handles every aspect of timetable management, from data input to final
              approval.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle className="text-card-foreground">Automated Scheduling</CardTitle>
                <CardDescription className="text-muted-foreground">
                  AI-powered algorithms automatically generate optimal timetables considering all constraints and
                  preferences.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors duration-300">
                  <span className="text-2xl">👥</span>
                </div>
                <CardTitle className="text-card-foreground">Resource Management</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Comprehensive management of classrooms, faculty, subjects, and student batches in one unified system.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle className="text-card-foreground">Analytics Dashboard</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Real-time insights into resource utilization, conflict analysis, and scheduling efficiency metrics.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <span className="text-2xl">✅</span>
                </div>
                <CardTitle className="text-card-foreground">Approval Workflow</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Structured review process with role-based access for administrators, faculty, and review authorities.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors duration-300">
                  <span className="text-2xl">🛡️</span>
                </div>
                <CardTitle className="text-card-foreground">Conflict Detection</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Advanced algorithms detect and resolve scheduling conflicts before they impact your operations.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle className="text-card-foreground">Export & Integration</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Export timetables in multiple formats (PDF, Excel) and integrate with existing university systems.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4 text-foreground">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Our timetable optimization system leverages cutting-edge technologies to deliver exceptional performance,
              scalability, and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Frontend Technologies */}
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-500/20 transition-colors duration-300">
                  <span className="text-3xl">⚛️</span>
                </div>
                <CardTitle className="text-card-foreground text-lg">React 18</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Modern UI library with hooks, concurrent features, and server components
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors duration-300">
                  <span className="text-3xl text-gray-900 dark:text-white font-bold">▲</span>
                </div>
                <CardTitle className="text-card-foreground text-lg">Next.js 14</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Full-stack framework with App Router, server actions, and optimized performance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-300">
                  <span className="text-2xl text-blue-900 dark:text-blue-100 font-bold">TS</span>
                </div>
                <CardTitle className="text-card-foreground text-lg">TypeScript</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Type-safe development with enhanced IDE support and error prevention
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-cyan-500/20 transition-colors duration-300">
                  <span className="text-3xl">🎨</span>
                </div>
                <CardTitle className="text-card-foreground text-lg">Tailwind CSS</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Utility-first CSS framework for rapid UI development and consistent design
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Backend & Database */}
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-green-500/20 transition-colors duration-300">
                  <span className="text-3xl">🟢</span>
                </div>
                <CardTitle className="text-card-foreground text-lg">Node.js</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Server-side JavaScript runtime for scalable backend operations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-orange-500/20 transition-colors duration-300">
                  <span className="text-3xl">🗄️</span>
                </div>
                <CardTitle className="text-card-foreground text-lg">Local Storage</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Client-side data persistence for user preferences and session management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-500/20 transition-colors duration-300">
                  <span className="text-3xl">🤖</span>
                </div>
                <CardTitle className="text-card-foreground text-lg">AI Algorithms</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  Custom optimization algorithms for intelligent timetable generation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Development Tools */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-border hover:shadow-lg transition-all duration-300 hover:scale-102 scroll-reveal">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <span className="text-2xl">🛠️</span>
                  Development Tools
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Modern development environment and tooling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-card-foreground">ESLint & Prettier</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-card-foreground">Git Version Control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-card-foreground">VS Code Integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-card-foreground">Hot Module Reload</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Features */}
            <Card className="bg-gradient-to-br from-secondary/5 to-primary/5 border-border hover:shadow-lg transition-all duration-300 hover:scale-102 scroll-reveal">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Performance Features
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Optimized for speed and user experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    <span className="text-card-foreground">Server Components</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    <span className="text-card-foreground">Code Splitting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    <span className="text-card-foreground">Image Optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    <span className="text-card-foreground">Lazy Loading</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Highlight */}
          <div className="mt-12 text-center scroll-reveal">
            <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 border-border max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-card-foreground text-2xl flex items-center justify-center gap-2">
                  <span className="text-3xl">🏗️</span>
                  Modern Architecture
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Built with scalability, maintainability, and performance in mind
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🎯</div>
                    <h4 className="font-semibold text-card-foreground mb-1">Component-Based</h4>
                    <p className="text-sm text-muted-foreground">Modular, reusable UI components</p>
                  </div>
                  <div className="group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🔄</div>
                    <h4 className="font-semibold text-card-foreground mb-1">Responsive Design</h4>
                    <p className="text-sm text-muted-foreground">Mobile-first, adaptive layouts</p>
                  </div>
                  <div className="group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">🛡️</div>
                    <h4 className="font-semibold text-card-foreground mb-1">Type Safety</h4>
                    <p className="text-sm text-muted-foreground">End-to-end TypeScript coverage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4 text-foreground">
              Trusted by Leading Institutions
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              See how universities worldwide are transforming their scheduling processes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <CardDescription className="text-card-foreground">
                  "TimetableAI reduced our scheduling conflicts by 95% and saved our administrative team 20 hours per
                  week. The automated optimization is incredible."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">DR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">Dr. Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">Academic Director, Stanford University</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <CardDescription className="text-card-foreground">
                  "The intuitive interface and powerful analytics have revolutionized how we manage our course
                  scheduling. Faculty satisfaction has increased significantly."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <span className="text-secondary font-semibold">MP</span>
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">Prof. Michael Chen</div>
                    <div className="text-sm text-muted-foreground">Registrar, MIT</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 scroll-reveal">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-lg">
                      ⭐
                    </span>
                  ))}
                </div>
                <CardDescription className="text-card-foreground">
                  "Implementation was seamless, and the support team was exceptional. We saw immediate improvements in
                  resource utilization and student satisfaction."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-semibold">LW</span>
                  </div>
                  <div>
                    <div className="font-semibold text-card-foreground">Dr. Lisa Wang</div>
                    <div className="text-sm text-muted-foreground">VP Academic Affairs, UC Berkeley</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10 scroll-reveal">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-balance mb-6 text-foreground">
            Ready to Transform Your Scheduling?
          </h2>
          <p className="text-xl text-muted-foreground text-pretty mb-8">
            Join hundreds of institutions already using TimetableAI to optimize their academic scheduling. Start your
            free trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                Start Free Trial
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted bg-transparent transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">📞</span>
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-lg">📅</span>
                </div>
                <span className="text-xl font-bold text-foreground">TimetableAI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Intelligent timetable optimization for higher education institutions worldwide.
              </p>
              <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/10">
                <p className="text-sm text-accent-foreground font-medium">🎓 Academic Project</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Developed by 7th semester students of Assam Downtown University
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#tech-stack" className="hover:text-foreground transition-colors">
                    Tech Stack
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8">
            <div className="text-center mb-4">
              <h4 className="font-semibold text-foreground mb-2">Development Team</h4>
              <p className="text-sm text-muted-foreground mb-3">7th Semester Students • Assam Downtown University</p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="hover:text-foreground transition-colors">Ankit Kumar</span>
                <span className="hover:text-foreground transition-colors">Dwip Sahajee</span>
                <span className="hover:text-foreground transition-colors">Amandeep Paul</span>
                <span className="hover:text-foreground transition-colors">Anjali Kumari</span>
                <span className="hover:text-foreground transition-colors">Soumaditya Kashyap</span>
                <span className="hover:text-foreground transition-colors">Asadul Islam</span>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>&copy; 2025 TimetableAI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
