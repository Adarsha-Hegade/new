import React, { useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  taskId: string;
  content: string;
  onChange: (content: string) => void;
}

export default function Editor({ taskId, content, onChange }: EditorProps) {
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  const handleAutoSave = useCallback(async () => {
    try {
      await api.submissions.save({
        taskId,
        content,
        autoSavedAt: new Date().toISOString(),
      });
      setLastSaved(new Date());
    } catch (error) {
      toast.error('Failed to auto-save');
    }
  }, [content, taskId]);

  useEffect(() => {
    const interval = setInterval(handleAutoSave, 120000); // Auto-save every 2 minutes
    return () => clearInterval(interval);
  }, [handleAutoSave]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['clean'],
    ],
  };

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        className="flex-1"
      />
      <div className="p-4 border-t text-sm text-gray-500">
        Auto-saving enabled • {lastSaved 
          ? `Last saved ${formatDistanceToNow(lastSaved)} ago`
          : 'Not saved yet'
        }
      </div>
    </div>
  );
}