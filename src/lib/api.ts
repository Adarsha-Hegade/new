import { supabase } from './supabase';
import type { Task, TaskSubmission } from '../types';

export const api = {
  tasks: {
    async create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async update(id: string, updates: Partial<Task>) {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getAll() {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  },

  submissions: {
    async save(submission: Partial<TaskSubmission>) {
      const { data, error } = await supabase
        .from('task_submissions')
        .upsert([submission])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },

    async getByTaskId(taskId: string) {
      const { data, error } = await supabase
        .from('task_submissions')
        .select('*')
        .eq('task_id', taskId)
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  storage: {
    async uploadDocument(file: File) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);
      
      return publicUrl;
    }
  }
};