"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClassroomForm } from "@/components/forms/classroom-form"
import { FacultyForm } from "@/components/forms/faculty-form"
import { SubjectForm } from "@/components/forms/subject-form"
import { BatchForm } from "@/components/forms/batch-form"
import { ConstraintsForm } from "@/components/forms/constraints-form"
import { DataSummary } from "@/components/data-summary"
import { Building, Users, BookOpen, GraduationCap, Settings, BarChart3 } from "lucide-react"

export function DataInputDashboard() {
  const [activeTab, setActiveTab] = useState("classrooms")

  const tabs = [
    {
      id: "classrooms",
      label: "Classrooms",
      icon: Building,
      description: "Manage classrooms and labs",
      component: ClassroomForm,
    },
    {
      id: "faculty",
      label: "Faculty",
      icon: Users,
      description: "Add faculty members and their details",
      component: FacultyForm,
    },
    {
      id: "subjects",
      label: "Subjects",
      icon: BookOpen,
      description: "Configure subjects and courses",
      component: SubjectForm,
    },
    {
      id: "batches",
      label: "Batches",
      icon: GraduationCap,
      description: "Set up student batches",
      component: BatchForm,
    },
    {
      id: "constraints",
      label: "Constraints",
      icon: Settings,
      description: "Define scheduling constraints",
      component: ConstraintsForm,
    },
    {
      id: "summary",
      label: "Summary",
      icon: BarChart3,
      description: "Review all entered data",
      component: DataSummary,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Input Dashboard</h1>
        <p className="text-muted">Configure all parameters for timetable generation</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </CardTitle>
                <CardDescription>{tab.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <tab.component />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
