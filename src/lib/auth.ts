import { supabase } from './supabase';

export async function isFirstUser(): Promise<boolean> {
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
    
  return count === 0;
}

export async function signUp(data: {
  email: string;
  password: string;
  username: string;
  name: string;
  phoneNumber: string;
}) {
  const isAdmin = await isFirstUser();
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) throw authError;

  const { error: profileError } = await supabase.from('users').insert([{
    id: authData.user?.id,
    email: data.email,
    username: data.username,
    name: data.name,
    phone_number: data.phoneNumber,
    role: isAdmin ? 'admin' : 'user'
  }]);

  if (profileError) throw profileError;

  return { user: authData.user, isAdmin };
}