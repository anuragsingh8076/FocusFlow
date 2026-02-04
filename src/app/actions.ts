'use server';

import { 
  suggestTaskPrioritization, 
  TaskPrioritizationInput 
} from "@/ai/flows/task-prioritization";

export async function getPrioritizedTasks(tasks: TaskPrioritizationInput) {
  if (tasks.length === 0) {
    return { success: true, data: [] };
  }
  
  try {
    const prioritizedTasks = await suggestTaskPrioritization(tasks);
    return { success: true, data: prioritizedTasks };
  } catch (error) {
    console.error("Error in AI task prioritization:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: `Failed to prioritize tasks with AI. ${errorMessage}` };
  }
}
