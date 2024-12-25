import { supabase } from './supabase';
import { PostgrestError } from '@supabase/supabase-js';

export class DatabaseError extends Error {
  constructor(
    message: string,
    public originalError?: PostgrestError | Error
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export const database = {
  async countUsers() {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) throw new DatabaseError('Failed to count users', error);
      return count || 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async countAdmins() {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (error) throw new DatabaseError('Failed to count admins', error);
      return count || 0;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },

  async createUser(userData: {
    id: string;
    email: string;
    username: string;
    name: string;
    phone_number: string;
    role: 'admin' | 'user';
  }) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw new DatabaseError('Failed to create user', error);
      return data;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
};