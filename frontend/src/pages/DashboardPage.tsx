import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests, useReports } from '../hooks/useApi';
import { LoadingSkeleton, EmptyState } from '../components/UI';

export function DashboardPage() {
  const { user } = useAuth();
  const { data: requests, isLoading: requestsLoading } = useRequests({ limit: 10 });
  const { data: reports } = useReports(user?.role === 'ADMIN');

  if (!user) return null;

  if (user.role === 'STUDENT') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Requests</h1>
          <Link
            to="/requests/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            New Request
          </Link>
        </div>

        {requestsLoading ? (
          <LoadingSkeleton />
        ) : !requests?.items?.length ? (
          <EmptyState title="No requests yet" description="Create your first maintenance request" />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Priority</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.items.map((req: any) => (
                  <tr key={req.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link to={`/requests/${req.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                        {req.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        req.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{req.priority}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(req.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (user.role === 'OFFICER') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Assigned Requests</h1>

        {requestsLoading ? (
          <LoadingSkeleton />
        ) : !requests?.items?.length ? (
          <EmptyState title="No assigned requests" description="You have no requests assigned to you yet" />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Priority</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Location</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.items.map((req: any) => (
                  <tr key={req.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link to={`/requests/${req.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                        {req.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{req.category?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                        req.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{req.priority}</td>
                    <td className="px-6 py-4 text-slate-600">{req.location}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(req.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (user.role === 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard</h1>

        {reports && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Requests', value: reports.status?.reduce((sum: number, s: any) => sum + s.count, 0) || 0 },
              { label: 'Pending', value: reports.status?.find((s: any) => s.status === 'PENDING')?.count || 0 },
              { label: 'In Progress', value: reports.status?.find((s: any) => s.status === 'IN_PROGRESS')?.count || 0 },
              { label: 'Completed', value: reports.status?.find((s: any) => s.status === 'COMPLETED')?.count || 0 }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <p className="text-slate-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <h2 className="px-6 py-4 font-semibold text-lg border-b border-slate-200">All Requests</h2>
          {requestsLoading ? (
            <LoadingSkeleton />
          ) : !requests?.items?.length ? (
            <EmptyState title="No requests" />
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {requests.items.map((req: any) => (
                  <tr key={req.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link to={`/requests/${req.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                        {req.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{req.status}</td>
                    <td className="px-6 py-4">{req.assignedTo?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>
      <p className="text-slate-600">Welcome, {user.name}</p>
    </div>
  );
}
