export type TaskCategory = 'Study' | 'Work' | 'Personal';

export type Task = {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  aiReason?: string;
};
