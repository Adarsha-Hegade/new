import React from 'react';
import { useSelector } from 'react-redux';
import { Users, FileText, CheckCircle } from 'lucide-react';
import type { RootState } from '../../../store';

export default function AdminOverview() {
  const tasks = useSelector((state: RootState) => state.tasks.items);
  const users = useSelector((state: RootState) => state.users?.items || []);

  const stats = [
    {
      name: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Tasks',
      value: tasks.filter(t => t.status !== 'completed' && t.status !== 'scored').length,
      icon: FileText,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Completed Tasks',
      value: tasks.filter(t => t.status === 'completed' || t.status === 'scored').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}