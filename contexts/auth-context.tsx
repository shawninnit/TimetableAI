"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, role: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = (email: string, role: string) => {
    console.log("[v0] AuthContext: Logging in user", { email, role })
    setUser({ email, role })
    setIsAuthenticated(true)
  }

  const logout = () => {
    console.log("[v0] AuthContext: Logging out user")
    setUser(null)
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
