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

interface Batch {
  id: string
  name: string
  department: string
  program: string
  semester: number
  strength: number
  level: "UG" | "PG"
  section?: string
}

export function BatchForm() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    program: "",
    semester: "",
    strength: "",
    level: "UG" as const,
    section: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem("batches")
    if (saved) {
      setBatches(JSON.parse(saved))
    }
  }, [])

  const saveToStorage = (data: Batch[]) => {
    localStorage.setItem("batches", JSON.stringify(data))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.department || !formData.program || !formData.semester || !formData.strength) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const batch: Batch = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      department: formData.department,
      program: formData.program,
      semester: Number.parseInt(formData.semester),
      strength: Number.parseInt(formData.strength),
      level: formData.level,
      section: formData.section || undefined,
    }

    let updatedBatches: Batch[]
    if (editingId) {
      updatedBatches = batches.map((b) => (b.id === editingId ? batch : b))
      toast({
        title: "Success",
        description: "Batch updated successfully",
      })
    } else {
      updatedBatches = [...batches, batch]
      toast({
        title: "Success",
        description: "Batch added successfully",
      })
    }

    setBatches(updatedBatches)
    saveToStorage(updatedBatches)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      department: "",
      program: "",
      semester: "",
      strength: "",
      level: "UG",
      section: "",
    })
    setEditingId(null)
  }

  const handleEdit = (batch: Batch) => {
    setFormData({
      name: batch.name,
      department: batch.department,
      program: batch.program,
      semester: batch.semester.toString(),
      strength: batch.strength.toString(),
      level: batch.level,
      section: batch.section || "",
    })
    setEditingId(batch.id)
  }

  const handleDelete = (id: string) => {
    const updatedBatches = batches.filter((b) => b.id !== id)
    setBatches(updatedBatches)
    saveToStorage(updatedBatches)
    toast({
      title: "Success",
      description: "Batch deleted successfully",
    })
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Batch Name *</Label>
          <Input
            id="name"
            placeholder="e.g., CS-2024-A"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <Label htmlFor="program">Program *</Label>
          <Input
            id="program"
            placeholder="e.g., B.Tech, M.Tech, BCA"
            value={formData.program}
            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="semester">Current Semester *</Label>
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
          <Label htmlFor="strength">Batch Strength *</Label>
          <Input
            id="strength"
            type="number"
            placeholder="e.g., 60"
            value={formData.strength}
            onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
          />
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
          <Label htmlFor="section">Section (Optional)</Label>
          <Input
            id="section"
            placeholder="e.g., A, B, C"
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
          />
        </div>

        <div className="flex items-end gap-2 md:col-span-2 lg:col-span-1">
          <Button type="submit" className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            {editingId ? "Update" : "Add"} Batch
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Table */}
      {batches.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{batch.name}</div>
                      {batch.section && <div className="text-sm text-muted">Section {batch.section}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{batch.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {batch.level} - {batch.program}
                    </Badge>
                  </TableCell>
                  <TableCell>Semester {batch.semester}</TableCell>
                  <TableCell>{batch.strength} students</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(batch)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(batch.id)}>
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
