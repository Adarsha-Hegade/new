import { supabase } from '../supabase';

export async function checkAdminExists(): Promise<boolean> {
  try {
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
    
    return count ? count > 0 : false;
  } catch (error) {
    console.error('Failed to check admin status:', error);
    return false;
  }
}