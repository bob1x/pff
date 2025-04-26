"use client";

import  { JSX, useEffect } from "react";
import { useSetDefaultScale } from "./hooks";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { usePDF } from "@react-pdf/renderer";

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

  // Show a clear error message (string) rather than raw Error object
 if (instance.error) {
   return (
     <div className="p-4 text-red-500">
       Error generating PDF: {String(instance.error)}
     </div>
   );
 }

  return (
    <div className="sticky bottom-0 left-0 right-0 flex h-[var(--resume-control-bar-height)] items-center justify-between px-[var(--resume-padding)] text-gray-600">
      {/* Zoom + Autoscale controls */}
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

      {/* Download link: only when URL is ready */}
      {instance.loading ? (
        <span className="italic text-sm">Generating PDF…</span>
      ) : instance.url ? (
        <a
          href={instance.url}
          download={fileName}
          className="ml-1 flex items-center gap-1 rounded-md border border-gray-300 px-3 py-0.5 hover:bg-gray-100 lg:ml-8"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          <span className="whitespace-nowrap">Download Resume</span>
        </a>
      ) : (
        <span className="text-sm text-gray-500">PDF not ready yet</span>
      )}
    </div>
  );
};

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
