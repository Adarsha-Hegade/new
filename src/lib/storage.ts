import { supabase } from './supabase';

export async function uploadDocument(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function getDocumentUrl(path: string): Promise<string> {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(path);
    
  return data.publicUrl;
}