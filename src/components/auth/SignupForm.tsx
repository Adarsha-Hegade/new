import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { setCredentials } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
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
      const { user, session } = await authService.signUp({
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
        toast.success('Admin account created successfully');
        navigate('/admin');
      }
    } catch (error: any) {
      // Error is already handled by authService
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form inputs remain the same */}
    </form>
  );
}