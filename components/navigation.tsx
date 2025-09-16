"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Calendar, Settings, Users, FileText, BarChart3, LogOut, Menu, X, CheckSquare } from "lucide-react"

interface NavigationProps {
  userRole: string
}

export function Navigation({ userRole }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()

  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail") || "")
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  const getNavigationItems = () => {
    const baseItems = [{ icon: Calendar, label: "Dashboard", href: `/${userRole}/dashboard` }]

    switch (userRole) {
      case "admin":
        return [
          ...baseItems,
          { icon: Settings, label: "Data Input", href: "/admin/data-input" },
          { icon: BarChart3, label: "Generate Timetable", href: "/admin/generate" },
          { icon: Users, label: "User Management", href: "/admin/users" },
          { icon: FileText, label: "Reports", href: "/admin/reports" },
        ]
      case "faculty":
        return [
          ...baseItems,
          { icon: Calendar, label: "My Schedule", href: "/faculty/schedule" },
          { icon: Settings, label: "Availability", href: "/faculty/availability" },
        ]
      case "reviewer":
        return [
          ...baseItems,
          { icon: CheckSquare, label: "Review Timetables", href: "/reviewer/review" },
          { icon: BarChart3, label: "Analytics", href: "/reviewer/analytics" },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground">Timetable System</h2>
            <p className="text-sm text-muted capitalize">{userRole}</p>
            <p className="text-xs text-muted truncate">{userEmail}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    onClick={() => {
                      router.push(item.href)
                      setIsOpen(false)
                    }}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
