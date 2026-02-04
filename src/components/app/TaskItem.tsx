"use client"

import type { Task, TaskCategory } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BookOpen, Briefcase, User, Trash2, Info } from "lucide-react"

interface TaskItemProps {
  task: Task
  onToggleComplete: (id: string) => void
  onDeleteTask: (id: string) => void
}

const categoryInfo: Record<
  TaskCategory,
  { icon: React.ElementType; className: string }
> = {
  Work: {
    icon: Briefcase,
    className: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  },
  Study: {
    icon: BookOpen,
    className: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  },
  Personal: {
    icon: User,
    className: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  },
}

export function TaskItem({
  task,
  onToggleComplete,
  onDeleteTask,
}: TaskItemProps) {
  const CategoryIcon = categoryInfo[task.category].icon
  const categoryClass = categoryInfo[task.category].className

  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border p-3 pr-2 transition-all duration-300 ease-in-out group",
          task.completed ? "bg-muted/50" : "bg-card hover:bg-muted/50"
        )}
      >
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          aria-label={`Mark task '${task.title}' as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            "flex-grow text-sm font-medium transition-colors",
            task.completed ? "text-muted-foreground line-through" : "text-card-foreground"
          )}
        >
          {task.title}
        </label>
        
        {task.aiReason && (
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">AI Suggestion: {task.aiReason}</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        <Badge variant="outline" className={cn("hidden sm:inline-flex items-center gap-1.5", categoryClass)}>
          <CategoryIcon className="h-3.5 w-3.5" />
          {task.category}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDeleteTask(task.id)}
          aria-label={`Delete task '${task.title}'`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TooltipProvider>
  )
}
