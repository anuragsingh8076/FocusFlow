'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting task prioritization based on task categories.
 *
 * It exports:
 * - `suggestTaskPrioritization`: The main function to call for suggesting task prioritization.
 * - `TaskPrioritizationInput`: The input type for the suggestTaskPrioritization function.
 * - `TaskPrioritizationOutput`: The output type for the suggestTaskPrioritization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskCategorySchema = z.enum(['Study', 'Work', 'Personal']);

const TaskPrioritizationInputSchema = z.array(
  z.object({
    id: z.string().describe('The unique identifier for the task.'),
    title: z.string(),
    category: TaskCategorySchema,
  })
);
export type TaskPrioritizationInput = z.infer<typeof TaskPrioritizationInputSchema>;

const TaskPrioritizationOutputSchema = z.array(
  z.object({
    id: z.string().describe('The unique identifier for the task.'),
    title: z.string(),
    category: TaskCategorySchema,
    priority: z.number().describe('The suggested priority of the task. Lower number means higher priority.'),
    reason: z.string().describe('The reason for the assigned priority.'),
  })
);
export type TaskPrioritizationOutput = z.infer<typeof TaskPrioritizationOutputSchema>;

export async function suggestTaskPrioritization(
  input: TaskPrioritizationInput
): Promise<TaskPrioritizationOutput> {
  return taskPrioritizationFlow(input);
}

const taskPrioritizationPrompt = ai.definePrompt({
  name: 'taskPrioritizationPrompt',
  input: {schema: TaskPrioritizationInputSchema},
  output: {schema: TaskPrioritizationOutputSchema},
  prompt: `You are a helpful assistant designed to suggest a task prioritization based on the category of the tasks.

Given the following list of tasks with their IDs, titles and categories, suggest a priority (lower number = higher priority) and a short reason for the priority for each task.

It is crucial that you return the same ID for each task as provided in the input.

Prioritize 'Work' tasks higher during business hours, 'Study' tasks during study hours, and consider 'Personal' tasks based on urgency.

Tasks:
{{#each this}}
- ID: {{{id}}}, Title: {{{title}}}, Category: {{{category}}}
{{/each}}`,
});

const taskPrioritizationFlow = ai.defineFlow(
  {
    name: 'taskPrioritizationFlow',
    inputSchema: TaskPrioritizationInputSchema,
    outputSchema: TaskPrioritizationOutputSchema,
  },
  async input => {
    const {output} = await taskPrioritizationPrompt(input);
    return output!;
  }
);
