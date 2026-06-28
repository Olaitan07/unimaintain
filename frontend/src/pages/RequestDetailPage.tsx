import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useRequestDetail, useUpdateRequestStatus, useAssignOfficer, useUsers } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { LoadingSkeleton, EmptyState } from '../components/UI';

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: request, isLoading } = useRequestDetail(id!);
  const { data: users } = useUsers();
  const updateStatusMutation = useUpdateRequestStatus();
  const assignMutation = useAssignOfficer();
  const [newStatus, setNewStatus] = useState('');
  const [comment, setComment] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');

  if (isLoading) return <LoadingSkeleton />;
  if (!request) return <EmptyState title="Request not found" />;

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({ id: id!, status: newStatus, comment });
      toast.success('Status updated');
      setNewStatus('');
      setComment('');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to update status');
    }
  };

  const handleAssignOfficer = async () => {
    if (!selectedOfficer) {
      toast.error('Please select an officer');
      return;
    }

    try {
      await assignMutation.mutateAsync({ id: id!, officerId: selectedOfficer });
      toast.success('Officer assigned');
      setSelectedOfficer('');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to assign officer');
    }
  };

  const officers = users?.filter((u: any) => u.role === 'OFFICER') || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700 mb-4">
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8 border-b border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{request.title}</h1>
              <p className="text-slate-600 mt-2">{request.category?.name}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              request.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
              request.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
              request.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {request.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <p className="text-slate-600 text-sm">Priority</p>
              <p className="font-semibold">{request.priority}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm">Location</p>
              <p className="font-semibold">{request.location}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm">Created by</p>
              <p className="font-semibold">{request.createdBy?.name}</p>
            </div>
            <div>
              <p className="text-slate-600 text-sm">Date</p>
              <p className="font-semibold">{new Date(request.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
          <p className="text-slate-600">{request.description}</p>
          {request.imageUrl && (
            <img src={request.imageUrl} alt="Request" className="mt-4 h-64 object-cover rounded-lg" />
          )}
        </div>

        {request.assignedTo && (
          <div className="p-8 border-b border-slate-200 bg-blue-50">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Assigned Officer</h2>
            <p className="text-slate-600">{request.assignedTo.name}</p>
          </div>
        )}

        {request.statusLogs?.length > 0 && (
          <div className="p-8 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Status Timeline</h2>
            <div className="space-y-4">
              {request.statusLogs.map((log: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    {index < request.statusLogs.length - 1 && (
                      <div className="w-0.5 h-12 bg-slate-200 mt-2"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {log.oldStatus} → {log.newStatus}
                    </p>
                    <p className="text-sm text-slate-600">by {log.changedBy?.name}</p>
                    {log.comment && <p className="text-slate-600 mt-1">{log.comment}</p>}
                    <p className="text-xs text-slate-500 mt-1">{new Date(log.changedAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(user?.role === 'ADMIN' || user?.role === 'OFFICER') && (
          <div className="p-8 bg-slate-50 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Update Status</h2>
              <div className="space-y-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="">Select new status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a note (optional)"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                />
                <button
                  onClick={handleStatusUpdate}
                  disabled={updateStatusMutation.isPending}
                  className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Update Status
                </button>
              </div>
            </div>

            {user?.role === 'ADMIN' && (
              <div className="pt-6 border-t border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Assign Officer</h2>
                <div className="space-y-3">
                  <select
                    value={selectedOfficer}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="">Select officer</option>
                    {officers.map((officer: any) => (
                      <option key={officer.id} value={officer.id}>
                        {officer.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignOfficer}
                    disabled={assignMutation.isPending}
                    className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Assign Officer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
