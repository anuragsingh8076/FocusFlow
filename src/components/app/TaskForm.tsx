"use client"

import { useState } from "react"
import type { TaskCategory } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"

interface TaskFormProps {
  onAddTask: (title: string, category: TaskCategory) => void
}

const categories: TaskCategory[] = ["Work", "Study", "Personal"]

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<TaskCategory>("Work")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask(title.trim(), category)
      setTitle("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <Input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-grow"
        aria-label="New task title"
      />
      <Select value={category} onValueChange={(value: TaskCategory) => setCategory(value)}>
        <SelectTrigger className="w-full sm:w-[120px]" aria-label="Task category">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </form>
  )
}
