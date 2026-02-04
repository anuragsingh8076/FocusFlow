"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Task } from '@/lib/types';
import { getPrioritizedTasks } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from 'lucide-react';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';

export default function FocusFlowApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    try {
      const storedTasks = localStorage.getItem('focusflow-tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem('focusflow-tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage", error);
      }
    }
  }, [tasks, isClient]);
  
  const handleAddTask = (title: string, category: Task['category']) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      category,
      completed: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };
  
  const handlePrioritize = async () => {
    if (tasks.filter(t => !t.completed).length < 2) {
       toast({
        title: "Not enough tasks",
        description: "You need at least two incomplete tasks to prioritize.",
      });
      return;
    }
    setIsPrioritizing(true);
    const incompleteTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    const tasksToPrioritize = incompleteTasks.map(({ title, category }) => ({ title, category }));
    
    const result = await getPrioritizedTasks(tasksToPrioritize);

    if (result.success && result.data) {
      const priorityMap = new Map(result.data.map(p => [p.title, { priority: p.priority, reason: p.reason }]));
      
      const sortedIncompleteTasks = [...incompleteTasks]
        .map(task => {
          const aiData = priorityMap.get(task.title);
          return aiData ? { ...task, aiReason: aiData.reason } : task;
        })
        .sort((a, b) => {
          const priorityA = priorityMap.get(a.title)?.priority ?? Infinity;
          const priorityB = priorityMap.get(b.title)?.priority ?? Infinity;
          return priorityA - priorityB;
        });

      setTasks([...sortedIncompleteTasks, ...completedTasks]);
      toast({
        title: "Tasks Prioritized!",
        description: "Your incomplete tasks have been reordered by AI.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "AI Prioritization Error",
        description: result.error || "An unknown error occurred.",
      });
    }
    setIsPrioritizing(false);
  };

  const { completedCount, totalCount } = useMemo(() => {
    return {
      completedCount: tasks.filter(t => t.completed).length,
      totalCount: tasks.length
    }
  }, [tasks]);

  if (!isClient) {
    return <Card className="w-full max-w-2xl animate-pulse"><div className="h-[600px]"></div></Card>;
  }

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Today's Plan</CardTitle>
        <CardDescription>Your daily focus planner to get things done.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TaskForm onAddTask={handleAddTask} />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">Your Tasks</h2>
              {totalCount > 0 && (
                 <p className="text-sm text-muted-foreground">
                  {completedCount} of {totalCount} completed.
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handlePrioritize} disabled={isPrioritizing}>
              {isPrioritizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Prioritize with AI
            </Button>
          </div>
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </CardContent>
    </Card>
  );
}
