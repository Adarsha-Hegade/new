import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormInput({ 
  label, 
  error, 
  id, 
  className = '', 
  ...props 
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}