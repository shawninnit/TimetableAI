"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    console.log("[v0] AuthGuard: Checking authentication...")
    console.log("[v0] AuthGuard: Auth state:", { isAuthenticated, user })

    if (!isAuthenticated || !user) {
      console.log("[v0] AuthGuard: Not authenticated, redirecting to login")
      router.push("/login")
      setIsLoading(false)
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      console.log("[v0] AuthGuard: Role not allowed, redirecting to unauthorized")
      router.push("/unauthorized")
      setIsLoading(false)
      return
    }

    console.log("[v0] AuthGuard: Authentication successful")
    setIsLoading(false)
  }, [router, allowedRoles, isAuthenticated, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
