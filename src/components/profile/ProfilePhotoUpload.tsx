import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface ProfilePhotoUploadProps {
  userId: string;
  currentPhotoUrl?: string;
  onUploadComplete: (url: string) => void;
}

export default function ProfilePhotoUpload({ 
  userId, 
  currentPhotoUrl,
  onUploadComplete 
}: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Delete old photo if exists
      if (currentPhotoUrl) {
        const oldFileName = currentPhotoUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      onUploadComplete(publicUrl);
      toast.success('Profile photo updated');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100">
        {currentPhotoUrl ? (
          <img
            src={currentPhotoUrl}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Camera className="h-8 w-8 text-gray-400" />
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <label
        htmlFor="photo-upload"
        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50"
      >
        <Camera className="h-4 w-4 text-gray-600" />
        <input
          id="photo-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}