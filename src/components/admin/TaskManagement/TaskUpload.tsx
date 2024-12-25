import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { api } from '../../../lib/api';
import { toast } from 'react-hot-toast';

interface TaskUploadProps {
  onUploadComplete: (url: string) => void;
}

export default function TaskUpload({ onUploadComplete }: TaskUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const url = await api.storage.uploadDocument(file);
      onUploadComplete(url);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
            <span>Upload a file</span>
            <input
              type="file"
              className="sr-only"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PDF up to 10MB</p>
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}