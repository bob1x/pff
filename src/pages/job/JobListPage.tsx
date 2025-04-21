// src/pages/JobListPage.tsx
import { useState } from "react";
import { useJobList } from "@/hooks/useJobList";

export default function JobListPage() {
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    experience_level: "",
    search: "",
  });

  const [page, setPage] = useState(1);

  const { jobs, count, loading, error } = useJobList(filters, page);

  const jobsPerPage = 10; // match with backend PAGE_SIZE
  const totalPages = Math.ceil(count / jobsPerPage);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>

      {/* Filter Inputs */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by title"
          value={filters.search}
          onChange={(e) => {
            setFilters({ ...filters, search: e.target.value });
            setPage(1); // reset page on filter
          }}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => {
            setFilters({ ...filters, category: e.target.value });
            setPage(1);
          }}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => {
            setFilters({ ...filters, location: e.target.value });
            setPage(1);
          }}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Experience Level"
          value={filters.experience_level}
          onChange={(e) => {
            setFilters({ ...filters, experience_level: e.target.value });
            setPage(1);
          }}
          className="border rounded p-2"
        />
      </div>

      {/* Results */}
      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">
              {job.category} • {job.location} • {job.experience_level}
            </p>
            <p className="mt-2 text-gray-800">
              {job.full_description.slice(0, 150)}...
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
