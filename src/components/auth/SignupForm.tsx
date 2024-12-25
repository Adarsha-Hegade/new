import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { setCredentials } from '../../store/slices/authSlice';
import { signUp } from '../../lib/auth/signup';
import FormInput from '../common/FormInput';
import useForm from '../../hooks/useForm';

export default function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { values, handleChange, errors, isValid } = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phoneNumber: ''
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.username) errors.username = 'Username is required';
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (!values.name) errors.name = 'Name is required';
      if (!values.phoneNumber) errors.phoneNumber = 'Phone number is required';
      return errors;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;

    setIsLoading(true);
    try {
      const { user, session } = await signUp({
        email: values.email,
        password: values.password,
        username: values.username,
        name: values.name,
        phoneNumber: values.phoneNumber
      });

      if (session) {
        dispatch(setCredentials({ 
          user,
          token: session.access_token 
        }));
        toast.success('Account created successfully');
        navigate('/admin');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="Username"
        id="username"
        name="username"
        type="text"
        value={values.username}
        onChange={handleChange}
        error={errors.username}
        disabled={isLoading}
        required
      />

      <FormInput
        label="Email"
        id="email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        disabled={isLoading}
        required
      />

      <FormInput
        label="Password"
        id="password"
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        disabled={isLoading}
        required
      />

      <FormInput
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        disabled={isLoading}
        required
      />

      <FormInput
        label="Full Name"
        id="name"
        name="name"
        type="text"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
        disabled={isLoading}
        required
      />

      <FormInput
        label="Phone Number"
        id="phoneNumber"
        name="phoneNumber"
        type="tel"
        value={values.phoneNumber}
        onChange={handleChange}
        error={errors.phoneNumber}
        disabled={isLoading}
        required
      />

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}