// src/hooks/useJobList.ts
import { useEffect, useState } from "react";
import jobApi, { Job, JobQueryParams } from "@/apis/jobApi";

export function useJobList(filters: JobQueryParams = {}, page = 1) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const { results, count } = await jobApi.getPaginated({ ...filters, page });
                setJobs(results);
                setCount(count);
            } catch (err) {
                console.error(err);
                setError("Failed to load jobs");
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [filters, page]);

    return { jobs, count, loading, error };
}
