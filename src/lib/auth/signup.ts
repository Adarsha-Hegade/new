import { supabase } from '../supabase';
import { SignupData, AuthResponse, AuthError } from './types';
import { toast } from 'react-hot-toast';

export async function signUp(data: SignupData): Promise<AuthResponse> {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    // Then create the user profile
    const { data: userData, error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: data.email,
        username: data.username,
        name: data.name,
        phone_number: data.phoneNumber,
        role: 'admin' // First user is always admin
      }])
      .select()
      .single();

    if (profileError) throw profileError;

    return {
      user: { ...authData.user, ...userData },
      session: authData.session
    };
  } catch (error: any) {
    const authError = new Error(error.message || 'Failed to create account') as AuthError;
    authError.originalError = error;
    throw authError;
  }
}