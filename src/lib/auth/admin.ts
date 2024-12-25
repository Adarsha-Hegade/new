import { supabase } from '../supabase';

export async function checkAdminExists(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .maybeSingle();
      
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Failed to check admin status:', error);
    return false;
  }
}