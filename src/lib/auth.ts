import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

export async function isFirstUser(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count === 0;
  } catch (error) {
    console.error('Error checking first user:', error);
    return false;
  }
}

export async function signUp(data: {
  email: string;
  password: string;
  username: string;
  name: string;
  phoneNumber: string;
}) {
  try {
    // Check if this is the first user
    const isAdmin = await isFirstUser();

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          name: data.name,
          phone_number: data.phoneNumber,
          role: isAdmin ? 'admin' : 'user'
        }
      }
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

    if (profileError) {
      // If profile creation fails, clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return { 
      user: {
        ...authData.user,
        name: data.name,
        username: data.username,
        phoneNumber: data.phoneNumber,
        role: isAdmin ? 'admin' : 'user'
      },
      isAdmin,
      session: authData.session 
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    if (error.message.includes('already registered')) {
      throw new Error('An account with this email already exists');
    }
    throw new Error(error.message || 'Failed to sign up');
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}