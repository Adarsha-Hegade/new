import { supabase } from '../lib/supabase';
import { database } from '../lib/database';
import { toast } from 'react-hot-toast';

export class AuthError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  async checkAdminExists() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'admin')
        .single();
      
      if (error && error.code !== 'PGRST116') { // Not found error is ok
        throw new AuthError('Failed to check admin status', error);
      }
      
      return !!data;
    } catch (error: any) {
      console.error('Auth error:', error);
      return false;
    }
  },

  async signUp(data: {
    email: string;
    password: string;
    username: string;
    name: string;
    phoneNumber: string;
  }) {
    try {
      // First check if admin exists
      const adminExists = await this.checkAdminExists();
      if (adminExists) {
        throw new AuthError('Admin already exists. Please sign in instead.');
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw new AuthError('Failed to create auth user', authError);
      if (!authData.user) throw new AuthError('No user data returned');

      // Create user profile
      const profile = await database.createUser({
        id: authData.user.id,
        email: data.email,
        username: data.username,
        name: data.name,
        phone_number: data.phoneNumber,
        role: 'admin' // First user is always admin
      });

      return {
        user: { ...authData.user, ...profile },
        session: authData.session
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw new AuthError('Invalid credentials', error);

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw new AuthError('Failed to get user profile', profileError);

      return {
        user: { ...data.user, ...profile },
        session: data.session
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message);
      throw error;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new AuthError('Failed to sign out', error);
  }
};