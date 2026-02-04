"use client"

import type { Task } from "@/lib/types"
import { TaskItem } from "./TaskItem"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onDeleteTask: (id: string) => void
}

export function TaskList({
  tasks,
  onToggleComplete,
  onDeleteTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/50 p-12 text-center h-60">
        <h3 className="text-lg font-medium text-muted-foreground">No tasks yet!</h3>
        <p className="text-sm text-muted-foreground">Add a task above to get started.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-96 pr-4">
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
