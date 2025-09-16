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
import { Building } from "lucide-react" // Declared the Building variable

interface Classroom {
  id: string
  name: string
  type: "lecture" | "lab" | "seminar"
  capacity: number
  department: string
  equipment: string[]
}

export function ClassroomForm() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [formData, setFormData] = useState({
    name: "",
    type: "lecture" as const,
    capacity: "",
    department: "",
    equipment: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load existing data from localStorage
    const saved = localStorage.getItem("classrooms")
    if (saved) {
      setClassrooms(JSON.parse(saved))
    }
  }, [])

  const saveToStorage = (data: Classroom[]) => {
    localStorage.setItem("classrooms", JSON.stringify(data))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.capacity || !formData.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const classroom: Classroom = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      capacity: Number.parseInt(formData.capacity),
      department: formData.department,
      equipment: formData.equipment
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean),
    }

    let updatedClassrooms: Classroom[]
    if (editingId) {
      updatedClassrooms = classrooms.map((c) => (c.id === editingId ? classroom : c))
      toast({
        title: "Success",
        description: "Classroom updated successfully",
      })
    } else {
      updatedClassrooms = [...classrooms, classroom]
      toast({
        title: "Success",
        description: "Classroom added successfully",
      })
    }

    setClassrooms(updatedClassrooms)
    saveToStorage(updatedClassrooms)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "lecture",
      capacity: "",
      department: "",
      equipment: "",
    })
    setEditingId(null)
  }

  const handleEdit = (classroom: Classroom) => {
    setFormData({
      name: classroom.name,
      type: classroom.type,
      capacity: classroom.capacity.toString(),
      department: classroom.department,
      equipment: classroom.equipment.join(", "),
    })
    setEditingId(classroom.id)
  }

  const handleDelete = (id: string) => {
    const updatedClassrooms = classrooms.filter((c) => c.id !== id)
    setClassrooms(updatedClassrooms)
    saveToStorage(updatedClassrooms)
    toast({
      title: "Success",
      description: "Classroom deleted successfully",
    })
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Room Name *</Label>
          <Input
            id="name"
            placeholder="e.g., LH-101, Lab-CS-01"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Room Type *</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lecture">Lecture Hall</SelectItem>
              <SelectItem value="lab">Laboratory</SelectItem>
              <SelectItem value="seminar">Seminar Room</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            type="number"
            placeholder="e.g., 60"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
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
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="equipment">Equipment (comma-separated)</Label>
          <Input
            id="equipment"
            placeholder="e.g., Projector, Whiteboard, AC"
            value={formData.equipment}
            onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button type="submit" className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            {editingId ? "Update" : "Add"} Classroom
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Table */}
      {classrooms.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classrooms.map((classroom) => (
                <TableRow key={classroom.id}>
                  <TableCell className="font-medium">{classroom.name}</TableCell>
                  <TableCell>
                    <Badge variant={classroom.type === "lab" ? "secondary" : "outline"}>{classroom.type}</Badge>
                  </TableCell>
                  <TableCell>{classroom.capacity}</TableCell>
                  <TableCell>{classroom.department}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {classroom.equipment.slice(0, 2).map((eq, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {eq}
                        </Badge>
                      ))}
                      {classroom.equipment.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{classroom.equipment.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(classroom)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(classroom.id)}>
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

      {classrooms.length === 0 && (
        <div className="text-center py-8 text-muted">
          <Building className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>No classrooms added yet. Add your first classroom above.</p>
        </div>
      )}
    </div>
  )
}
