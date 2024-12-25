import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { setCredentials } from '../../store/slices/authSlice';
import useForm from '../../hooks/useForm';
import { signUp } from '../../lib/auth';
import FormInput from '../common/FormInput';

export default function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  
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
      const { user, isAdmin, session } = await signUp({
        email: values.email,
        password: values.password,
        username: values.username,
        name: values.name,
        phoneNumber: values.phoneNumber
      });

      if (session) {
        dispatch(setCredentials({ 
          user: {
            ...user,
            role: isAdmin ? 'admin' : 'user',
            name: values.name,
            phoneNumber: values.phoneNumber,
            username: values.username
          },
          token: session.access_token
        }));

        toast.success('Account created successfully');
        navigate(isAdmin ? '/admin' : '/dashboard');
      } else {
        toast.success('Please check your email to verify your account');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormInput
          id="username"
          name="username"
          type="text"
          label="Username"
          value={values.username}
          onChange={handleChange}
          error={errors.username}
          required
          disabled={isLoading}
        />

        <FormInput
          id="name"
          name="name"
          type="text"
          label="Full Name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          required
          disabled={isLoading}
        />
      </div>

      <FormInput
        id="email"
        name="email"
        type="email"
        label="Email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        required
        disabled={isLoading}
      />

      <FormInput
        id="phoneNumber"
        name="phoneNumber"
        type="tel"
        label="Phone Number"
        value={values.phoneNumber}
        onChange={handleChange}
        error={errors.phoneNumber}
        required
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
          disabled={isLoading}
        />

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}