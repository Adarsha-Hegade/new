import { useState, useCallback } from 'react';

interface UseFormProps<T> {
  initialValues: T;
  validate: (values: T) => Record<string, string>;
}

export default function useForm<T extends Record<string, any>>({ 
  initialValues, 
  validate 
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const validateForm = useCallback((formValues: T) => {
    const validationErrors = validate(formValues);
    const valid = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    setIsValid(valid);
    return valid;
  }, [validate]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    validateForm(newValues);
  }, [values, validateForm]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsValid(false);
  }, [initialValues]);

  return {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
    setValues
  };
}