"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Subject {
  id: string
  name: string
  code: string
  department: string
  semester: number
  credits: number
  type: "theory" | "practical" | "tutorial"
  level: "UG" | "PG"
  category: "compulsory" | "elective"
  hoursPerWeek: number
}

export function SubjectForm() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    semester: "",
    credits: "",
    type: "theory" as const,
    level: "UG" as const,
    category: "compulsory" as const,
    hoursPerWeek: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem("subjects")
    if (saved) {
      setSubjects(JSON.parse(saved))
    }
  }, [])

  const saveToStorage = (data: Subject[]) => {
    localStorage.setItem("subjects", JSON.stringify(data))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.code || !formData.department || !formData.semester) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const subject: Subject = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      code: formData.code,
      department: formData.department,
      semester: Number.parseInt(formData.semester),
      credits: Number.parseInt(formData.credits) || 3,
      type: formData.type,
      level: formData.level,
      category: formData.category,
      hoursPerWeek: Number.parseInt(formData.hoursPerWeek) || 3,
    }

    let updatedSubjects: Subject[]
    if (editingId) {
      updatedSubjects = subjects.map((s) => (s.id === editingId ? subject : s))
      toast({
        title: "Success",
        description: "Subject updated successfully",
      })
    } else {
      updatedSubjects = [...subjects, subject]
      toast({
        title: "Success",
        description: "Subject added successfully",
      })
    }

    setSubjects(updatedSubjects)
    saveToStorage(updatedSubjects)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      department: "",
      semester: "",
      credits: "",
      type: "theory",
      level: "UG",
      category: "compulsory",
      hoursPerWeek: "",
    })
    setEditingId(null)
  }

  const handleEdit = (subject: Subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      department: subject.department,
      semester: subject.semester.toString(),
      credits: subject.credits.toString(),
      type: subject.type,
      level: subject.level,
      category: subject.category,
      hoursPerWeek: subject.hoursPerWeek.toString(),
    })
    setEditingId(subject.id)
  }

  const handleDelete = (id: string) => {
    const updatedSubjects = subjects.filter((s) => s.id !== id)
    setSubjects(updatedSubjects)
    saveToStorage(updatedSubjects)
    toast({
      title: "Success",
      description: "Subject deleted successfully",
    })
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Subject Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Data Structures"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Subject Code *</Label>
          <Input
            id="code"
            placeholder="e.g., CS301"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Information Technology">Information Technology</SelectItem>
              <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
              <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
              <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
              <SelectItem value="Chemical Engineering">Chemical Engineering</SelectItem>
              <SelectItem value="Biotechnology">Biotechnology</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Management Studies">Management Studies</SelectItem>
              <SelectItem value="Humanities">Humanities</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="semester">Semester *</Label>
          <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <SelectItem key={sem} value={sem.toString()}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="credits">Credits</Label>
          <Input
            id="credits"
            type="number"
            placeholder="3"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="theory">Theory</SelectItem>
              <SelectItem value="practical">Practical</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select value={formData.level} onValueChange={(value: any) => setFormData({ ...formData, level: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UG">Undergraduate</SelectItem>
              <SelectItem value="PG">Postgraduate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: any) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compulsory">Compulsory</SelectItem>
              <SelectItem value="elective">Elective</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hoursPerWeek">Hours/Week</Label>
          <Input
            id="hoursPerWeek"
            type="number"
            placeholder="3"
            value={formData.hoursPerWeek}
            onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
          />
        </div>

        <div className="flex items-end gap-2 md:col-span-2 lg:col-span-1">
          <Button type="submit" className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            {editingId ? "Update" : "Add"} Subject
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Table */}
      {subjects.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Hours/Week</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-sm text-muted">{subject.code}</div>
                    </div>
                  </TableCell>
                  <TableCell>{subject.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {subject.level} Sem {subject.semester}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={subject.type === "practical" ? "secondary" : "outline"}>{subject.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={subject.category === "compulsory" ? "default" : "secondary"}>
                      {subject.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{subject.hoursPerWeek}h</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(subject)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(subject.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
