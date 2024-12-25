import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocumentViewer from '../components/dataEntry/DocumentViewer';
import Editor from '../components/dataEntry/Editor';
import TaskHeader from '../components/dataEntry/TaskHeader';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { toast } from 'react-hot-toast';

export default function DataEntryPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const task = useSelector((state: RootState) => 
    state.tasks.items.find(t => t.id === taskId)
  );
  const [content, setContent] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      handleAutoSave();
    }, 120000); // Auto-save every 2 minutes

    return () => clearInterval(interval);
  }, [content]);

  const handleAutoSave = async () => {
    if (!content) return;
    
    try {
      await saveContent(content);
      toast.success('Progress auto-saved');
    } catch (error) {
      toast.error('Failed to auto-save');
    }
  };

  const handleSubmit = async () => {
    if (!content) {
      toast.error('Please enter some content before submitting');
      return;
    }

    try {
      await submitTask(content);
      toast.success('Task submitted successfully');
    } catch (error) {
      toast.error('Failed to submit task');
    }
  };

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <TaskHeader task={task} onSubmit={handleSubmit} />
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <DocumentViewer documentUrl={task.documentUrl} />
        <Editor
          content={content}
          onChange={setContent}
          onAutoSave={handleAutoSave}
        />
      </div>
    </div>
  );
}

// These would typically be API calls
const saveContent = async (content: string) => {
  // Implementation for saving content
};

const submitTask = async (content: string) => {
  // Implementation for submitting task
};