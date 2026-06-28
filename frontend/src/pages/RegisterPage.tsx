import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRegister } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { registerSchema, RegisterInput } from '../schemas/validation';

export function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema)
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const registerMutation = useRegister();

  const onSubmit = async (data: RegisterInput) => {
    try {
      const result = await registerMutation.mutateAsync(data);
      login(result.token, result.user);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Create Account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                {...register('name')}
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || registerMutation.isPending}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || registerMutation.isPending ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
