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

interface Faculty {
  id: string
  name: string
  email: string
  department: string
  designation: string
  expertise: string[]
  maxHoursPerWeek: number
  avgLeavesPerMonth: number
}

export function FacultyForm() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    expertise: "",
    maxHoursPerWeek: "",
    avgLeavesPerMonth: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem("faculty")
    if (saved) {
      setFaculty(JSON.parse(saved))
    }
  }, [])

  const saveToStorage = (data: Faculty[]) => {
    localStorage.setItem("faculty", JSON.stringify(data))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.department || !formData.designation) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const facultyMember: Faculty = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      department: formData.department,
      designation: formData.designation,
      expertise: formData.expertise
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
      maxHoursPerWeek: Number.parseInt(formData.maxHoursPerWeek) || 20,
      avgLeavesPerMonth: Number.parseInt(formData.avgLeavesPerMonth) || 2,
    }

    let updatedFaculty: Faculty[]
    if (editingId) {
      updatedFaculty = faculty.map((f) => (f.id === editingId ? facultyMember : f))
      toast({
        title: "Success",
        description: "Faculty member updated successfully",
      })
    } else {
      updatedFaculty = [...faculty, facultyMember]
      toast({
        title: "Success",
        description: "Faculty member added successfully",
      })
    }

    setFaculty(updatedFaculty)
    saveToStorage(updatedFaculty)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      department: "",
      designation: "",
      expertise: "",
      maxHoursPerWeek: "",
      avgLeavesPerMonth: "",
    })
    setEditingId(null)
  }

  const handleEdit = (facultyMember: Faculty) => {
    setFormData({
      name: facultyMember.name,
      email: facultyMember.email,
      department: facultyMember.department,
      designation: facultyMember.designation,
      expertise: facultyMember.expertise.join(", "),
      maxHoursPerWeek: facultyMember.maxHoursPerWeek.toString(),
      avgLeavesPerMonth: facultyMember.avgLeavesPerMonth.toString(),
    })
    setEditingId(facultyMember.id)
  }

  const handleDelete = (id: string) => {
    const updatedFaculty = faculty.filter((f) => f.id !== id)
    setFaculty(updatedFaculty)
    saveToStorage(updatedFaculty)
    toast({
      title: "Success",
      description: "Faculty member deleted successfully",
    })
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Dr. John Smith"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.smith@university.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          <Label htmlFor="designation">Designation *</Label>
          <Select
            value={formData.designation}
            onValueChange={(value) => setFormData({ ...formData, designation: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Associate Professor">Associate Professor</SelectItem>
              <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
              <SelectItem value="Lecturer">Lecturer</SelectItem>
              <SelectItem value="Guest Faculty">Guest Faculty</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expertise">Expertise (comma-separated)</Label>
          <Input
            id="expertise"
            placeholder="e.g., Data Structures, Algorithms, AI"
            value={formData.expertise}
            onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxHours">Max Hours/Week</Label>
          <Input
            id="maxHours"
            type="number"
            placeholder="20"
            value={formData.maxHoursPerWeek}
            onChange={(e) => setFormData({ ...formData, maxHoursPerWeek: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avgLeaves">Avg Leaves/Month</Label>
          <Input
            id="avgLeaves"
            type="number"
            placeholder="2"
            value={formData.avgLeavesPerMonth}
            onChange={(e) => setFormData({ ...formData, avgLeavesPerMonth: e.target.value })}
          />
        </div>

        <div className="flex items-end gap-2 md:col-span-2 lg:col-span-1">
          <Button type="submit" className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            {editingId ? "Update" : "Add"} Faculty
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Table */}
      {faculty.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Max Hours</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faculty.map((facultyMember) => (
                <TableRow key={facultyMember.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{facultyMember.name}</div>
                      <div className="text-sm text-muted">{facultyMember.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{facultyMember.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{facultyMember.designation}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {facultyMember.expertise.slice(0, 2).map((exp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                      {facultyMember.expertise.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{facultyMember.expertise.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{facultyMember.maxHoursPerWeek}h/week</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(facultyMember)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(facultyMember.id)}>
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
