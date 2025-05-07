import { JobDetails } from "@/components/jobs/JobDetails";
import { ResumeUploadForm } from "@/components/jobs/ResumeUploadForm";
import { useApplyJob } from "@/hooks/jobs/useApplyJob";
import { Spinner } from "@/components/ui/Spinner";

export default function ApplyJobPage() {
  const {
    job,
    loadingJob,
    jobError,
    fullNameState,
    emailState,
    fileState,
    uploading,
    uploadError,
    handleUpload,
  } = useApplyJob();

  if (loadingJob) return <Spinner />;
  if (jobError || !job)
    return (
      <p className="text-center text-red-500">{jobError ?? "Not found"}</p>
    );

  /* ─ Render ─ */
  return (
    <div className="max-w-3xl mx-auto p-6">
      <JobDetails job={job} />
      <ResumeUploadForm
        fullName={fullNameState[0]}
        setFullName={fullNameState[1]}
        email={emailState[0]}
        setEmail={emailState[1]}
        file={fileState[0]}
        onFileChange={fileState[1]}
        uploading={uploading}
        uploadError={uploadError}
        onUpload={handleUpload}
      />
    </div>
  );
}
