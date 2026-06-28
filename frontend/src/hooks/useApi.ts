import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/client';
import { UserRole, AuthUser } from '../context/AuthContext';

// Auth API
export function useLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axiosInstance.post('/auth/login', data);
      return response.data.data;
    }
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const response = await axiosInstance.post('/auth/register', data);
      return response.data.data;
    }
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await axiosInstance.get('/auth/me');
      return response.data.data as { user: AuthUser };
    },
    staleTime: 1000 * 60 * 5
  });
}

// Requests API
export function useRequests(filters?: { search?: string; status?: string; categoryId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['requests', filters],
    queryFn: async () => {
      const response = await axiosInstance.get('/requests', { params: filters });
      return response.data.data;
    }
  });
}

export function useRequestDetail(id: string) {
  return useQuery({
    queryKey: ['requests', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/requests/${id}`);
      return response.data.data;
    },
    enabled: !!id
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post('/requests', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    }
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, comment }: { id: string; status: string; comment?: string }) => {
      const response = await axiosInstance.patch(`/requests/${id}`, { status, comment });
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['requests', variables.id] });
    }
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/requests/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    }
  });
}

// Admin API
export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/users');
      return response.data.data as AuthUser[];
    }
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole }) => {
      const response = await axiosInstance.patch(`/admin/users/${id}`, { role });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    }
  });
}

export function useAssignOfficer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, officerId }: { id: string; officerId: string }) => {
      const response = await axiosInstance.post(`/admin/requests/${id}/assign`, { officerId });
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['requests', variables.id] });
    }
  });
}

export function useReports() {
  return useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: async () => {
      const response = await axiosInstance.get('/admin/reports');
      return response.data.data;
    }
  });
}
