import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import SignupForm from '../components/auth/SignupForm';
import { checkAdminExists } from '../lib/auth/admin';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function SignupPage() {
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const exists = await checkAdminExists();
        setAdminExists(exists);
      } catch (err) {
        setError('Failed to check admin status');
        setAdminExists(false);
      }
    };
    checkAdmin();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:text-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (adminExists === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (adminExists) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Admin Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          This will be the administrator account for the system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}