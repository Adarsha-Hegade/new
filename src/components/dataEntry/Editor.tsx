import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onAutoSave: () => void;
}

export default function Editor({ content, onChange, onAutoSave }: EditorProps) {
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
        Auto-saving enabled • Last saved 2 minutes ago
      </div>
    </div>
  );
}