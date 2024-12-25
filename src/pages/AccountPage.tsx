import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { formatDistanceToNow } from 'date-fns';

export default function AccountPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const tasks = useSelector((state: RootState) => state.tasks.items);

  const completedTasks = tasks.filter(task => 
    task.status === 'completed' || task.status === 'scored'
  );

  const getScoreColor = (score: number) => {
    if (score <= 25) return 'text-red-900';
    if (score <= 50) return 'text-red-600';
    if (score <= 65) return 'text-orange-500';
    if (score <= 75) return 'text-yellow-500';
    if (score <= 85) return 'text-yellow-300';
    if (score <= 95) return 'text-green-400';
    return 'text-green-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Account Information
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.phoneNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.role}</dd>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Task History</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {completedTasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(new Date(task.updatedAt))} ago
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {task.score ? (
                      <span className={getScoreColor(task.score)}>
                        {task.score}/100
                      </span>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}