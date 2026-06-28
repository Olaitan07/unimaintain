import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests, useCategories } from '../hooks/useApi';
import { LoadingSkeleton, EmptyState } from '../components/UI';

export function RequestsPage() {
  const { user } = useAuth();
  const { data: categories = [] } = useCategories();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const { data, isLoading } = useRequests({
    search: search || undefined,
    status: status || undefined,
    categoryId: categoryId || undefined,
    limit: 50
  });

  const requests = data?.items ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        {user?.role === 'OFFICER' ? 'My Assigned Requests' : 'All Requests'}
      </h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : requests.length === 0 ? (
        <EmptyState title="No requests found" description="Try adjusting your filters" />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Priority</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Submitted By</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Assigned To</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req: any) => (
                <tr key={req.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link to={`/requests/${req.id}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      {req.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{req.category?.name ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      req.status === 'COMPLETED'  ? 'bg-green-100 text-green-700'  :
                      req.status === 'IN_PROGRESS'? 'bg-blue-100 text-blue-700'   :
                      req.status === 'ASSIGNED'   ? 'bg-yellow-100 text-yellow-700':
                                                    'bg-gray-100 text-gray-700'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{req.priority}</td>
                  <td className="px-6 py-4 text-slate-600">{req.createdBy?.name ?? '-'}</td>
                  <td className="px-6 py-4 text-slate-600">{req.assignedTo?.name ?? '-'}</td>
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
