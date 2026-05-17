'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getJobById, updateJobStatus, deleteJob } from '../../../lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext'

const STATUSES = ['Open', 'In Progress', 'Closed'];

const STATUS_COLORS: Record<string, string> = {
  Open: 'bg-green-100 text-green-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-gray-100 text-gray-500',
};

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  contactName: string;
  contactEmail: string;
  createdAt: string;
}

export default function JobDetailPage() {
  const { isAuthenticated } = useAuth()
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id as string);
        setJob(data.data);
        setSelectedStatus(data.data.status);
      } catch {
        setError('Job not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleStatusUpdate = async () => {
  if (!job || selectedStatus === job.status) return
  setUpdating(true)
  try {
    const data = await updateJobStatus(job._id, selectedStatus)
    setJob(data.data)
    toast.success(`Status updated to "${selectedStatus}"!`)
  } catch {
    toast.error('Failed to update status.')
  } finally {
    setUpdating(false)
  }
};

  const handleDelete = async () => {
  if (!job) return
  if (!confirm('Are you sure you want to delete this job?')) return
  setDeleting(true)
  try {
    await deleteJob(job._id)
    toast.success('Job deleted!')
    router.push('/')
  } catch {
    toast.error('Failed to delete job.')
    setDeleting(false)
  }
};

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 text-lg">Loading job...</div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error || 'Job not found.'}</p>
        <a href="/" className="text-blue-600 underline">
          Back to Jobs
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <a href="/" className="text-blue-600 text-sm hover:underline">
        ← Back to Jobs
      </a>

      {/* Header */}
      <div className="mt-4 mb-6 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[job.status]}`}
        >
          {job.status}
        </span>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
        {/* Description */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase mb-1">
            Description
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{job.description}</p>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-1">
              Category
            </h2>
            <span className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full">
              {job.category || '—'}
            </span>
          </div>
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-1">
              Location
            </h2>
            <p className="text-gray-700 text-sm">📍 {job.location || '—'}</p>
          </div>
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-1">
              Contact Name
            </h2>
            <p className="text-gray-700 text-sm">{job.contactName || '—'}</p>
          </div>
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-1">
              Contact Email
            </h2>
            <p className="text-gray-700 text-sm">{job.contactEmail || '—'}</p>
          </div>
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-1">
              Posted On
            </h2>
            <p className="text-gray-700 text-sm">
              {new Date(job.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Status Update */}
        {isAuthenticated && (
  <div>
    <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">
      Update Status
    </h2>
    <div className="flex gap-3">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <button
        onClick={handleStatusUpdate}
        disabled={updating || selectedStatus === job.status}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-40"
      >
        {updating ? 'Saving...' : 'Update'}
      </button>
    </div>
  </div>
)}

{isAuthenticated && (
  <button
    onClick={handleDelete}
    disabled={deleting}
    className="w-full border border-red-300 text-red-500 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition disabled:opacity-40"
  >
    {deleting ? 'Deleting...' : 'Delete This Job'}
  </button>
)}
      </div>
    </div>
  );
}