"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  fetchLeaderboard,
  Application,
  PaginatedApplications,
} from "@/apis/HR/applicationApi";

interface SectionCardsProps {
  jobId: number;
}

export function SectionCards({ jobId }: SectionCardsProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const perPage = 10;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchLeaderboard(jobId, page)
      .then((data: PaginatedApplications) => {
        setApplications(data.results);
        setCount(data.count);
      })
      .catch(() => setError("Failed to load leaderboard."))
      .finally(() => setLoading(false));
  }, [jobId, page]);

  const totalPages = Math.ceil(count / perPage);

  if (loading)
    return <div className="p-4 text-center">Loading leaderboard…</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (applications.length === 0)
    return (
      <div className="p-4 text-center">No candidates have applied yet.</div>
    );

  return (
    <div className="space-y-4 p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead>Education</TableHead>
            <TableHead>Applied At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app, idx) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium">
                {(page - 1) * perPage + idx + 1}
              </TableCell>
              <TableCell>{app.applicant}</TableCell>
              <TableCell>{app.job_title}</TableCell>
              <TableCell>{app.total_score}</TableCell>
              <TableCell>{app.experience_score}</TableCell>
              <TableCell>{app.skills_score}</TableCell>
              <TableCell>{app.projects_score}</TableCell>
              <TableCell>{app.education_score}</TableCell>
              <TableCell>{new Date(app.applied_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center items-center space-x-4">
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
