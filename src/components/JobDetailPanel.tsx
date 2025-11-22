import React from "react";
import type { Job, ParsedResume } from "../types";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { AiResumeAdvisor } from "./AiResumeAdvisor";

interface Props {
  job: Job | null;
  savedJobs: Job[];
  onToggleSave: (job: Job) => void;
  resume: ParsedResume | null;
}

export const JobDetailPanel: React.FC<Props> = ({
  job,
  savedJobs,
  onToggleSave,
  resume,
}) => {
  if (!job) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-xs text-slate-500 h-fit flex items-center justify-center">
        Select a job to view details.
      </div>
    );
  }

  const isSaved = !!savedJobs.find((j) => j.id === job.id);

  const handleApplyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    if (!resume) {
      e.preventDefault();
      alert(
        "Upload your resume in the Resume Assistant panel to get AI-based resume improvements and an ATS match score before applying."
      );
    }
  };

  return (
    <section
      className="
        bg-white rounded-xl shadow-md border border-slate-100 
        px-6 py-5 max-h-[950px] overflow-y-auto custom-scroll
      "
    >
      {/* ⭐ AI Advisor Section */}
      <div className="mb-6">
        <AiResumeAdvisor job={job} resume={resume} />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-start gap-6 mb-6">
        {/* LEFT TEXT */}
        <div className="flex-1 min-w-0">
          <h2 className="text-[15px] font-bold text-slate-900 mb-0.5 leading-tight">
            {job.title}
          </h2>

          <p className="text-[12px] text-slate-600 font-medium mb-0.5">
            {job.company.name} • {job.location}
          </p>

          <p className="text-[11px] text-slate-500">
            {job.jobType} • {job.workMode} • {job.experienceLevel}
          </p>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* SAVE BUTTON */}
          <button
            onClick={() => onToggleSave(job)}
            className="
              text-[11px] flex items-center gap-1 px-3 py-1.5 
              rounded-md border border-slate-300 
              hover:border-indigo-400 hover:bg-indigo-50 
              transition min-w-[72px] justify-center
            "
          >
            {isSaved ? (
              <>
                <BookmarkCheck size={12} /> Saved
              </>
            ) : (
              <>
                <Bookmark size={12} /> Save
              </>
            )}
          </button>

          {/* APPLY BUTTON */}
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleApplyClick}
            className="
              text-[11px] flex items-center gap-1 px-3 py-1.5 
              rounded-md bg-indigo-600 text-white 
              hover:bg-indigo-500 transition shadow-sm
              min-w-[72px] justify-center
            "
          >
            Apply <ExternalLink size={12} />
          </a>

          {!resume && (
            <p className="text-[10px] text-slate-500 text-right max-w-[155px] leading-tight">
              Upload your resume to get AI match score & improvement tips before
              applying.
            </p>
          )}
        </div>
      </div>

      {/* DATE */}
      <div className="text-[11px] text-slate-500 mb-4">
        Posted{" "}
        {new Date(job.postedAt).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>

      {/* SALARY */}
      {job.salaryMin && (
        <div className="text-[12px] text-slate-700 font-medium mb-5">
          💰 Salary: {job.currency} {job.salaryMin.toLocaleString()} –{" "}
          {job.salaryMax?.toLocaleString()}
        </div>
      )}

      {/* JOB DESCRIPTION */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
          Job Description
        </h3>
        <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </section>

      {/* RESPONSIBILITIES */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
          Key Responsibilities
        </h3>
        <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-1 leading-relaxed">
          {job.responsibilities.map((r, idx) => (
            <li key={idx}>{r}</li>
          ))}
        </ul>
      </section>

      {/* REQUIRED SKILLS */}
      <section className="mb-6">
        <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
          Required Skills
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {job.requiredSkills.map((s) => (
            <span
              key={s}
              className="
                px-2 py-0.5 rounded-full bg-slate-50 
                border border-slate-200 text-[10px] text-slate-700
              "
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* NICE TO HAVE */}
      {job.niceToHaveSkills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
            Nice To Have
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.niceToHaveSkills.map((s) => (
              <span
                key={s}
                className="
                  px-2 py-0.5 rounded-full bg-emerald-50 
                  border border-emerald-200 text-[10px] text-emerald-700
                "
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* SIMILAR JOBS */}
      <section className="pt-4 border-t border-slate-200">
        <h3 className="text-xs font-semibold text-slate-900 mb-1.5">
          Similar Jobs
        </h3>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          In a later version, you can show 3–5 similar roles here based on matching
          skills, job title, or company.
        </p>
      </section>
    </section>
  );
};
