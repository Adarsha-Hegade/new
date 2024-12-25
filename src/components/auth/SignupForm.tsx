import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { setCredentials } from '../../store/slices/authSlice';
import useForm from '../../hooks/useForm';
import { validateSignupForm } from '../../utils/validation';
import { signUp } from '../../lib/auth';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';

export default function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { values, handleChange, errors, isValid } = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phoneNumber: ''
    },
    validate: validateSignupForm
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const { user, isAdmin } = await signUp({
        email: values.email,
        password: values.password,
        username: values.username,
        name: values.name,
        phoneNumber: values.phoneNumber
      });

      dispatch(setCredentials({ 
        user: {
          ...user,
          role: isAdmin ? 'admin' : 'user'
        }, 
        token: user.session?.access_token 
      }));

      toast.success('Account created successfully');
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
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
        />
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Create Account
      </button>
    </form>
  );
}