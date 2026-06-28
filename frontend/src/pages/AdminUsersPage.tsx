import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useUsers, useUpdateUserRole } from '../hooks/useApi';
import { LoadingSkeleton, EmptyState } from '../components/UI';
import { UserRole } from '../context/AuthContext';

export function AdminUsersPage() {
  const { data: users, isLoading } = useUsers();
  const updateRoleMutation = useUpdateUserRole();
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>({});

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateRoleMutation.mutateAsync({ id: userId, role: newRole });
      setSelectedRoles((prev) => ({ ...prev, [userId]: newRole }));
      toast.success('User role updated');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to update role');
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (!users?.length) return <EmptyState title="No users found" />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">User Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={selectedRoles[user.id] || user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className="px-3 py-1 border border-slate-200 rounded text-sm"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="STAFF">Staff</option>
                    <option value="OFFICER">Officer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
