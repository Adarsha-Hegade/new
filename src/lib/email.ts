import { supabase } from './supabase';

export async function sendTaskNotification(userId: string, taskId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', userId)
    .single();

  const { data: task } = await supabase
    .from('tasks')
    .select('title')
    .eq('id', taskId)
    .single();

  if (!user || !task) return;

  // In a real application, you would integrate with an email service
  // For now, we'll just log the notification
  console.log(`Email notification to ${user.email}:`, {
    subject: `New Task Assigned: ${task.title}`,
    body: `Hello ${user.name}, you have been assigned a new task: ${task.title}`
  });
}