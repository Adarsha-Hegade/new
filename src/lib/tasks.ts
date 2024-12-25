import { supabase } from './supabase';
import type { Task, TaskSubmission } from '../types';

export async function submitTask(taskId: string, content: string): Promise<void> {
  const { error: submissionError } = await supabase
    .from('task_submissions')
    .upsert({
      task_id: taskId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      content,
      submitted_at: new Date().toISOString(),
    });

  if (submissionError) throw submissionError;

  const { error: taskError } = await supabase
    .from('tasks')
    .update({ status: 'completed' })
    .eq('id', taskId);

  if (taskError) throw taskError;
}

export async function autoSaveTask(
  taskId: string, 
  content: string
): Promise<void> {
  const { error } = await supabase
    .from('task_submissions')
    .upsert({
      task_id: taskId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      content,
      auto_saved_at: new Date().toISOString(),
    });

  if (error) throw error;
}

export async function scoreTask(
  taskId: string, 
  score: number
): Promise<void> {
  if (score < 0 || score > 100) {
    throw new Error('Score must be between 0 and 100');
  }

  const { error } = await supabase
    .from('tasks')
    .update({ 
      score,
      status: 'scored',
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId);

  if (error) throw error;
}