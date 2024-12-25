import { supabase } from './supabase';
import { toast } from 'react-hot-toast';
import { database } from './database';

export async function signUp(data: {
  email: string;
  password: string;
  username: string;
  name: string;
  phoneNumber: string;
}) {
  try {
    // Check if any users exist
    const userCount = await database.countUsers();
    const isAdmin = userCount === 0;

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          name: data.name,
          role: isAdmin ? 'admin' : 'user'
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    // Create user profile
    const userData = await database.createUser({
      id: authData.user.id,
      email: data.email,
      username: data.username,
      name: data.name,
      phone_number: data.phoneNumber,
      role: isAdmin ? 'admin' : 'user'
    });

    return {
      user: {
        ...authData.user,
        ...userData
      },
      session: authData.session,
      isAdmin
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    toast.error(error.message || 'Failed to sign up');
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      user: { ...data.user, ...profile },
      session: data.session
    };
  } catch (error: any) {
    console.error('Sign in error:', error);
    toast.error('Invalid email or password');
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error('Sign out error:', error);
    toast.error('Failed to sign out');
    throw error;
  }
}

export async function checkAdminExists() {
  try {
    const adminCount = await database.countAdmins();
    return adminCount > 0;
  } catch (error: any) {
    console.error('Check admin error:', error);
    return false;
  }
}