"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AdminDashboard() {
  const router = useRouter()

  const stats = [
    {
      title: "Total Classrooms",
      value: "24",
      description: "Including labs and lecture halls",
      icon: "🏢", // Using emoji instead of lucide icon
      color: "text-chart-1",
    },
    {
      title: "Faculty Members",
      value: "156",
      description: "Across all departments",
      icon: "👥", // Using emoji instead of lucide icon
      color: "text-chart-2",
    },
    {
      title: "Student Batches",
      value: "48",
      description: "UG and PG programs",
      icon: "📚", // Using emoji instead of lucide icon
      color: "text-chart-3",
    },
    {
      title: "Weekly Classes",
      value: "892",
      description: "Total scheduled classes",
      icon: "⏰", // Using emoji instead of lucide icon
      color: "text-chart-4",
    },
  ]

  const recentActivities = [
    {
      title: "Timetable Generated",
      description: "Computer Science Department - Semester 5",
      time: "2 hours ago",
      status: "success",
      icon: "✅", // Using emoji instead of lucide icon
    },
    {
      title: "Review Pending",
      description: "Mathematics Department - Semester 3",
      time: "4 hours ago",
      status: "warning",
      icon: "⚠️", // Using emoji instead of lucide icon
    },
    {
      title: "Data Updated",
      description: "New faculty member added to Physics",
      time: "1 day ago",
      status: "info",
      icon: "📈", // Using emoji instead of lucide icon
    },
  ]

  const quickActions = [
    {
      title: "Input Data",
      description: "Add classrooms, faculty, and subjects",
      action: () => router.push("/admin/data-input"),
      color: "bg-primary text-primary-foreground",
    },
    {
      title: "Generate Timetable",
      description: "Create optimized schedules",
      action: () => router.push("/admin/generate"),
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Review Status",
      description: "Check pending approvals",
      action: () => router.push("/admin/review-status"),
      color: "bg-accent text-accent-foreground",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your institution's timetable system</p>
        </div>
        <Button onClick={() => router.push("/admin/generate")}>
          📅 {/* Using emoji instead of lucide icon */}
          Generate New Timetable
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <span className={`text-lg ${stat.color}`}>{stat.icon}</span> {/* Using emoji instead of lucide icon */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Card key={action.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className={action.color} onClick={action.action} size="sm">
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates and system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    activity.status === "success"
                      ? "bg-green-100 text-green-600"
                      : activity.status === "warning"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <span className="text-sm">{activity.icon}</span> {/* Using emoji instead of lucide icon */}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
