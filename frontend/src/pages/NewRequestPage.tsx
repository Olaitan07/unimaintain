import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCreateRequest, useRequests } from '../hooks/useApi';
import { createRequestSchema, CreateRequestInput } from '../schemas/validation';

const CATEGORIES = [
  { id: '1', name: 'Electrical' },
  { id: '2', name: 'Plumbing' },
  { id: '3', name: 'Cleaning' },
  { id: '4', name: 'Heating' },
  { id: '5', name: 'Furniture' }
];

export function NewRequestPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<CreateRequestInput>({
    resolver: zodResolver(createRequestSchema)
  });

  const navigate = useNavigate();
  const createMutation = useCreateRequest();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const file = watch('title') ? true : false;

  const onSubmit = async (data: CreateRequestInput) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('categoryId', data.categoryId);
      formData.append('priority', data.priority);
      formData.append('location', data.location);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('image', fileInput.files[0]);
      }

      await createMutation.mutateAsync(formData);
      toast.success('Request created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create request');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Create New Request</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <input
              {...register('title')}
              type="text"
              placeholder="Describe the issue..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              {...register('categoryId')}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Provide details about the issue..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <input
              {...register('location')}
              type="text"
              placeholder="e.g., Building A, Room 205"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <select
              {...register('priority')}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg"
            />
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="mt-4 h-48 object-cover rounded-lg" />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || createMutation.isPending ? 'Creating...' : 'Create Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
