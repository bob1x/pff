"use client";

import { JSX, useEffect, useState } from "react";
import { useSetDefaultScale } from "./hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";
// import resumeApi from "@/apis/resumeApi";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../lib/redux/hooks";
import { selectResume } from "../../../lib/redux/resumeSlice";
import API from "@/apis/client";
import { ParsedResumeData,applyToJob } from "@/apis/resumeApi";

export const ResumeControlBarCSR = ({
  scale,
  setScale,
  documentSize,
  document: pdfDocument,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: JSX.Element;
  fileName: string;
}) => {
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document: pdfDocument });

  // Regenerate PDF whenever the document prop changes
  useEffect(() => {
    update(pdfDocument);
  }, [update, pdfDocument]);

  const { id: parsedId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const jobId = Number(searchParams.get("jobId"));
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const reduxResume = useAppSelector(selectResume);

  const transformedResume: ParsedResumeData = {
    name: reduxResume.profile.name,
    contact: {
      email: reduxResume.profile.email || "",
      phone: reduxResume.profile.phone || "",
    },
    summary: reduxResume.profile.summary || "",
    skills: reduxResume.skills.descriptions.join(", "),
    experience: reduxResume.workExperiences.map((exp) => ({
      company: `${exp.company || "Untitled"}`,
      title: `${exp.jobTitle || "Untitled"}`,
      date: exp.date || "N/A",
      description: exp.descriptions,
    })),
    education: reduxResume.educations.map((e) => ({
      school: e.school,
      degree: e.degree,
      date: e.date,
      additional_info: e.descriptions,
    })),
    projects: reduxResume.projects.map((proj) => ({
      title: proj.project || "Untitled",
      description: proj.descriptions,
    })),
  };

  const handleConfirm = async () => {
    if (!parsedId || isNaN(jobId)) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Trigger scoring
      await API.post(
        `/resumes/ResumeConfirmation/${parsedId}/confirm/${jobId}/`,
        transformedResume
      );

      // Create JobApplication with the *same* user-modified resume
      await applyToJob(jobId, parseInt(parsedId), transformedResume);

      navigate(`/application-success/${parsedId}`);
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (instance.error) {
    return (
      <div className="p-4 text-red-500">
        Error generating PDF: {String(instance.error)}
      </div>
    );
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-between px-[var(--resume-padding)] text-gray-600">
      <div className="flex items-center gap-2">
        <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(Number(e.target.value));
          }}
        />
        <div className="w-10">{`${Math.round(scale * 100)}%`}</div>
        <label className="hidden items-center gap-1 lg:flex">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={scaleOnResize}
            onChange={() => setScaleOnResize((p) => !p)}
          />
          <span>Autoscale</span>
        </label>
      </div>

      <div className="flex items-center gap-4">
        {instance.loading ? (
          <span className="italic text-sm">Generating PDF…</span>
        ) : instance.url ? (
          <a
            href={instance.url}
            download={fileName}
            className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span className="whitespace-nowrap">Download Resume</span>
          </a>
        ) : (
          <span className="text-sm text-gray-500">PDF not ready yet</span>
        )}

        <button
          onClick={handleConfirm}
          disabled={submitting || instance.loading}
          className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Confirm & Apply"}
        </button>
      </div>

      {submitError && <p className="text-red-500 mt-1">{submitError}</p>}
    </div>
  );
};

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
