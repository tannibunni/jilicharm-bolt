import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { saveUserEmail } from '../../services/apiService';
import { useAppContext } from '../../contexts/AppContext';

interface EmailFormProps {
  onSuccess?: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSuccess }) => {
  const { setUserEmail } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<{ email: string }>();
  
  const onSubmit = async (data: { email: string }) => {
    setIsSubmitting(true);
    try {
      await saveUserEmail(data.email);
      setUserEmail(data.email);
      setSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="text-center">
        <p className="text-accent-800 font-medium">Thank you! Your detailed report will arrive shortly.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Your email address"
            className={`w-full px-4 py-3 rounded-lg bg-white border ${
              errors.email ? 'border-red-300' : 'border-primary-200'
            } focus:outline-none focus:ring-2 focus:ring-accent-800/20 placeholder-accent-400 text-accent-800`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent-800 hover:bg-accent-700 text-primary-50 font-medium py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-accent-400"
        >
          {isSubmitting ? 'Sending...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default EmailForm;