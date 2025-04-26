// src/hooks/useJobListPageLogic.ts
import { useState, useMemo } from "react";
import { useJobList, type JobQueryParams } from "@/hooks/jobs/useJobHook";

export function useJobListPageLogic() {
  const [filters, setFilters] = useState<JobQueryParams>({
    category: "",
    location: "",
    experience_level: "",
    search: "",
  });
  const [page, setPage] = useState(1);

  const { jobs, count, loading, error } = useJobList(filters, page);
  const totalPages = useMemo(() => Math.ceil(count / 10), [count]);

  const handleFilterChange = (field: keyof JobQueryParams, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value.trim() }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      location: "",
      experience_level: "",
      search: "",
    });
    setPage(1);
  };

  return {
    filters,
    page,
    jobs,
    loading,
    error,
    totalPages,
    handleFilterChange,
    resetFilters,
    setPage,
  };
}
