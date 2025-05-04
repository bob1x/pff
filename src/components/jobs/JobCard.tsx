import { Link } from "react-router-dom";
import type { Job }  from "@/hooks/jobs/useJobHook";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3 mt-1">
            {job.category} • {job.location} • {job.experience_level}
          </p>
          <p className="text-gray-700 text-sm mb-4">
            {job.job_description.slice(0, 200)}...
          </p>
        </div>
        <div className="mt-auto pt-2">
          <Link
            to={`/jobs/${job.id}/apply`}
            className="inline-block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Apply
          </Link>
        </div>
      </div>
    </div>
  );
}
