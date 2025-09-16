"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const demoCredentials = [
    {
      role: "admin",
      email: "admin@university.edu",
      password: "admin123",
      title: "Administrator",
      description: "Full access to all features",
    },
    {
      role: "faculty",
      email: "faculty@university.edu",
      password: "faculty123",
      title: "Faculty Member",
      description: "View schedules and notifications",
    },
    {
      role: "reviewer",
      email: "reviewer@university.edu",
      password: "reviewer123",
      title: "Review Authority",
      description: "Review and approve timetables",
    },
  ]

  const fillDemoCredentials = (demo: (typeof demoCredentials)[0]) => {
    setEmail(demo.email)
    setPassword(demo.password)
    setRole(demo.role)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Form submitted with:", { email, password, role })
    setIsLoading(true)

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Logging in with auth context")
    login(email, role)

    // Redirect based on role
    let redirectPath = "/dashboard"
    switch (role) {
      case "admin":
        redirectPath = "/admin/dashboard"
        break
      case "faculty":
        redirectPath = "/faculty/dashboard"
        break
      case "reviewer":
        redirectPath = "/reviewer/dashboard"
        break
    }

    console.log("[v0] Redirecting to:", redirectPath)
    router.push(redirectPath)

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Demo Credentials</CardTitle>
          <CardDescription className="text-xs">Click any button below to auto-fill login credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {demoCredentials.map((demo) => (
            <Button
              key={demo.role}
              variant="outline"
              size="sm"
              className="w-full justify-start text-left h-auto p-3 bg-transparent"
              onClick={() => fillDemoCredentials(demo)}
              type="button"
            >
              <div className="flex flex-col items-start">
                <div className="font-medium text-sm">{demo.title}</div>
                <div className="text-xs text-muted-foreground">{demo.email}</div>
                <div className="text-xs text-muted-foreground">{demo.description}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={setRole} required>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="faculty">Faculty Member</SelectItem>
              <SelectItem value="reviewer">Review Authority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !email || !password || !role}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  )
}
