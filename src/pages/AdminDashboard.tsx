import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Users, FileText, LayoutDashboard } from 'lucide-react';
import UserManagement from '../components/admin/UserManagement';
import TaskManagement from '../components/admin/TaskManagement';
import AdminOverview from '../components/admin/AdminOverview';

export default function AdminDashboard() {
  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Tasks', href: '/admin/tasks', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-lg font-semibold">Admin Dashboard</span>
            </div>
            <nav className="flex-1 px-2 mt-5 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="users/*" element={<UserManagement />} />
            <Route path="tasks/*" element={<TaskManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}