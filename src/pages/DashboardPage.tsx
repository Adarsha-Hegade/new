import React from 'react';
import TaskList from '../components/dashboard/TaskList';
import DashboardStats from '../components/dashboard/DashboardStats';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function DashboardPage() {
  const navigate = useNavigate();
  const tasks = useSelector((state: RootState) => state.tasks.items);

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's an overview of your tasks.
        </p>
      </div>

      <DashboardStats />

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Active Tasks</h2>
        <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
      </div>
    </div>
  );
}