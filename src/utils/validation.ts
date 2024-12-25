export const validateSignupForm = (values: Record<string, string>) => {
  const errors: Record<string, string> = {};

  // Username validation
  if (!values.username) {
    errors.username = 'Username is required';
  } else if (values.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  // Email validation
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }

  // Password validation
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
    errors.password = 'Password must contain uppercase, lowercase and numbers';
  }

  // Confirm password validation
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Name validation
  if (!values.name) {
    errors.name = 'Name is required';
  }

  // Phone number validation
  if (!values.phoneNumber) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^\+?[\d\s-]+$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Invalid phone number format';
  }

  return errors;
};