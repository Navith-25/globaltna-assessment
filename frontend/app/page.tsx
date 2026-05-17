'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAllJobs, deleteJob } from '../lib/api'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery', 'Other']
const STATUSES = ['All', 'Open', 'In Progress', 'Closed']

const STATUS_COLORS: Record<string, string> = {
  Open: 'bg-green-100 text-green-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-gray-100 text-gray-500',
}

interface Job {
  _id: string
  title: string
  description: string
  category: string
  location: string
  status: string
  contactName: string
  contactEmail: string
  createdAt: string
}

function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded-full w-16" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="flex gap-2">
        <div className="h-5 bg-gray-200 rounded-full w-16" />
        <div className="h-5 bg-gray-200 rounded w-20" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-gray-50">
        <div className="h-9 bg-gray-200 rounded-lg flex-1" />
        <div className="h-9 bg-gray-200 rounded-lg w-16" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const { isAuthenticated } = useAuth()

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const filters: Record<string, string> = {}
      if (category !== 'All') filters.category = category
      if (status !== 'All') filters.status = status
      if (search.trim()) filters.search = search.trim()
      const data = await getAllJobs(filters)
      setJobs(data.data)
    } catch {
      toast.error('Failed to load jobs. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [category, status, search])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await deleteJob(id)
      setJobs((prev) => prev.filter((j) => j._id !== id))
      toast.success('Job deleted successfully!')
    } catch {
      toast.error('Failed to delete job.')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Service Requests</h1>
        <p className="text-gray-500">Browse open jobs or post a new service request.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="text-sm text-gray-400 self-center">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* Job Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No jobs found.{' '}
          <Link href="/jobs/new" className="text-blue-600 underline">
            Post one!
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-gray-800 text-base leading-snug">
                  {job.title}
                </h2>
                <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${STATUS_COLORS[job.status]}`}>
                  {job.status}
                </span>
              </div>

              <p className="text-gray-500 text-sm line-clamp-2">{job.description}</p>

              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                {job.category && (
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                    {job.category}
                  </span>
                )}
                {job.location && <span>📍 {job.location}</span>}
                <span className="ml-auto">
                  {new Date(job.createdAt).toLocaleDateString('en-GB')}
                </span>
              </div>

              <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
                <Link
                  href={`/jobs/${job._id}`}
                  className="flex-1 text-center bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
                {isAuthenticated && (
                <button
                  onClick={() => handleDelete(job._id, job.title)}
                  className="px-3 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
                >
                    Delete
                </button>
              )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}