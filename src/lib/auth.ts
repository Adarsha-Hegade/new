import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

export async function signUp(data: {
  email: string;
  password: string;
  username: string;
  name: string;
  phoneNumber: string;
}) {
  try {
    // Check if this is the first user
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    const isAdmin = count === 0;

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    // Insert into users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: data.email,
        username: data.username,
        name: data.name,
        phone_number: data.phoneNumber,
        role: isAdmin ? 'admin' : 'user'
      }]);

    if (profileError) throw profileError;

    return { 
      user: authData.user,
      session: authData.session 
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
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

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