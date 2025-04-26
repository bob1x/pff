import { useJobListPageLogic } from "@/hooks/jobs/usejobList";
import { FilterSection } from "@/components/jobs/FilterSection";
import { JobCard } from "@/components/jobs/JobCard";
import { Pagination } from "@/components/jobs/Pagination";

export default function JobListPage() {
  const {
    filters,
    page,
    jobs,
    loading,
    error,
    totalPages,
    handleFilterChange,
    resetFilters,
    setPage,
  } = useJobListPageLogic();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Explore Job Opportunities
      </h1>

      <FilterSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {loading && <p className="text-center">Loading jobs…</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
