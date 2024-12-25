import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { addTask } from '../../../store/slices/taskSlice';
import { api } from '../../../lib/api';
import useForm from '../../../hooks/useForm';
import TaskUpload from './TaskUpload';

export default function TaskForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [documentUrl, setDocumentUrl] = useState('');

  const { values, handleChange, errors, isValid } = useForm({
    initialValues: {
      title: '',
      description: '',
      deadline: '',
      priority: 'medium',
      points: 0,
      assignedTo: '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.title) errors.title = 'Title is required';
      if (!values.description) errors.description = 'Description is required';
      if (!values.deadline) errors.deadline = 'Deadline is required';
      if (!values.points) errors.points = 'Points are required';
      if (!values.assignedTo) errors.assignedTo = 'Please assign this task to a user';
      if (!documentUrl) errors.document = 'Please upload a document';
      return errors;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !documentUrl) return;

    try {
      const task = await api.tasks.create({
        ...values,
        documentUrl,
        status: 'pending',
      });
      
      dispatch(addTask(task));
      toast.success('Task created successfully');
      navigate('/admin/tasks');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* ... existing form JSX ... */}
      
      <div className="col-span-6">
        <label className="block text-sm font-medium text-gray-700">
          Document Upload
        </label>
        <TaskUpload onUploadComplete={setDocumentUrl} />
        {errors.document && (
          <p className="mt-1 text-sm text-red-600">{errors.document}</p>
        )}
      </div>
      
      {/* ... rest of the form ... */}
    </div>
  );
}