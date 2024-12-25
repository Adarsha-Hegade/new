import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import type { Task } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface TaskHeaderProps {
  task: Task;
  onSubmit: () => void;
}

export default function TaskHeader({ task, onSubmit }: TaskHeaderProps) {
  return (
    <div className="bg-white border-b px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{task.title}</h1>
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Due {formatDistanceToNow(new Date(task.deadline))}
            </span>
            <span className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {task.points} points
            </span>
          </div>
        </div>

        <button
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Task
        </button>
      </div>
    </div>
  );
}