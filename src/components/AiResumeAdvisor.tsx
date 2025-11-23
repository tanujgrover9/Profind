import React, { useMemo } from "react";
import type { Job, ParsedResume } from "../types";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  job: Job;
  resume: ParsedResume | null;
}

type MatchLevel = "Low" | "Medium" | "High";

interface MatchResult {
  score: number;
  level: MatchLevel;
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  suggestions: string[];
  tailoredSummary: string;
}

const KNOWN_SKILL_KEYWORDS = [
  "react",
  "reactjs",
  "typescript",
  "javascript",
  "node",
  "node.js",
  "next.js",
  "nextjs",
  "tailwind",
  "redux",
  "html",
  "css",
  "rest",
  "api",
  "graphql",
  "aws",
  "docker",
  "jest",
  "testing",
  "python",
  "java",
];

function normalizeSkill(raw: string): string {
  return raw.toLowerCase().trim();
}

function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  KNOWN_SKILL_KEYWORDS.forEach((kw) => {
    if (lower.includes(kw)) {
      found.add(kw);
    }
  });

  return Array.from(found);
}

// Helper type to allow optional raw text from backend in future
type ResumeWithRaw = ParsedResume & {
  rawText?: string;
  text?: string;
};

function titleCaseSkill(skill: string): string {
  if (!skill) return skill;
  const lower = skill.toLowerCase();
  if (lower === "reactjs" || lower === "react") return "React.js";
  if (lower === "nextjs" || lower === "next") return "Next.js";
  if (lower === "node.js" || lower === "node") return "Node.js";

  return skill
    .split(/[\s_/]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function computeMatch(job: Job, resume: ParsedResume | null): MatchResult | null {
  if (!resume) return null;

  const extended = resume as ResumeWithRaw;

  // ---- Collect skills from the job ----
  const jobSkills = new Set<string>();

  (job.skills ?? []).forEach((s) => jobSkills.add(normalizeSkill(s)));
  (job.requiredSkills ?? []).forEach((s) => jobSkills.add(normalizeSkill(s)));
  (job.niceToHaveSkills ?? []).forEach((s) => jobSkills.add(normalizeSkill(s)));

  if (job.description) {
    extractSkillsFromText(job.description).forEach((s) =>
      jobSkills.add(normalizeSkill(s))
    );
  }

  // ---- Collect skills from the resume ----
  const resumeSkillSet = new Set<string>();

  const resumeSkillsArray = Array.isArray(extended.skills)
    ? extended.skills
    : [];

  resumeSkillsArray.forEach((s) => resumeSkillSet.add(normalizeSkill(s)));

  const rawText = extended.rawText ?? extended.text ?? "";
  if (rawText) {
    extractSkillsFromText(rawText).forEach((s) =>
      resumeSkillSet.add(normalizeSkill(s))
    );
  }

  const jobSkillList = Array.from(jobSkills);
  if (jobSkillList.length === 0) {
    return {
      score: 60,
      level: "Medium",
      matchedSkills: [],
      missingSkills: [],
      extraSkills: [],
      suggestions: [
        "This job description does not list many specific skills. Focus on tailoring your summary and experience to the role title.",
      ],
      tailoredSummary: "",
    };
  }

  // ---- Compare skills ----
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const extraSkills: string[] = [];

  jobSkillList.forEach((skill) => {
    if (resumeSkillSet.has(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  resumeSkillSet.forEach((skill) => {
    if (!jobSkills.has(skill)) {
      extraSkills.push(skill);
    }
  });

  // ---- Score & match level ----
  const coverage = matchedSkills.length / jobSkillList.length;
  const missingPenalty = missingSkills.length * 3;
  let score = Math.round(60 + coverage * 35 - missingPenalty);
  score = Math.max(5, Math.min(98, score));

  let level: MatchLevel = "Low";
  if (score >= 75) level = "High";
  else if (score >= 55) level = "Medium";

  // ---- Suggestions ----
  const suggestions: string[] = [];

  if (missingSkills.length) {
    const humanMissing = missingSkills.map(titleCaseSkill);
    suggestions.push(
      `These skills appear in the job description but not clearly in your resume: ${humanMissing.join(
        ", "
      )}. Add them to your skills section or summary if you actually have experience with them.`
    );

    const topForHeadline = humanMissing.slice(0, 3).join(", ");
    if (topForHeadline) {
      suggestions.push(
        `You can update your resume summary line to something like: "Frontend engineer with hands-on experience in ${topForHeadline}."`
      );
    }
  }

  if (matchedSkills.length) {
    const humanMatched = matchedSkills.map(titleCaseSkill);
    suggestions.push(
      `Your resume already matches these key skills from the job: ${humanMatched.join(
        ", "
      )}. Make sure they are visible in the top 1/3 of your resume (summary + key skills).`
    );
  }

  suggestions.push(
    "Customize your resume headline to match the job title and mention 2–3 core skills (for example: 'React + TypeScript Frontend Engineer')."
  );

  suggestions.push(
    "Use bullet points that include action verbs plus metrics (e.g. 'Improved page load speed by 35% by optimizing React components and API calls')."
  );

  const jobTitle = job.title || "this role";
  const companyName = job.company?.name || "the company";

  const tailoredSummary = `Frontend engineer with hands-on experience in modern JavaScript and UI development, applying for a ${jobTitle} role at ${companyName}. Strong focus on building responsive, accessible, and high-performance interfaces using tools like React, TypeScript and REST APIs. Comfortable collaborating with product and backend teams, writing clean reusable components, and improving UX with data-driven iterations.`;

  return {
    score,
    level,
    matchedSkills,
    missingSkills,
    extraSkills,
    suggestions,
    tailoredSummary,
  };
};

export const AiResumeAdvisor: React.FC<Props> = ({ job, resume }) => {
  const match = useMemo(() => computeMatch(job, resume), [job, resume]);

  if (!job) return null;

  return (
    <div
      className="
        mt-4
        rounded-2xl
        bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950
        border border-indigo-500/30
        text-slate-50
        p-4 sm:p-5
        shadow-[0_18px_45px_rgba(15,23,42,0.6)]
        relative overflow-hidden
      "
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-16 -right-10 w-40 h-40 bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 w-40 h-40 bg-purple-500/15 blur-3xl" />

      {/* header */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/70 border border-slate-700 px-2.5 py-1 mb-2">
            <Sparkles size={13} className="text-indigo-300" />
            <span className="text-[10px] font-semibold tracking-wide uppercase">
              AI Resume Match
            </span>
          </div>
          <h3 className="text-sm sm:text-[15px] font-semibold leading-snug">
            See how well your resume fits this role
          </h3>
          <p className="text-[11px] text-slate-300 mt-1 max-w-md">
            We compare your skills with the job description and highlight what to add or
            emphasize so your resume is more aligned.
          </p>
        </div>

        {/* score pill */}
        {match && (
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border border-slate-700 bg-slate-900/70 flex items-center justify-center">
                <span className="text-lg font-semibold">{match.score}</span>
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">
                ATS score
              </span>
            </div>
            <span
              className={
                "mt-4 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border " +
                (match.level === "High"
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40"
                  : match.level === "Medium"
                  ? "bg-amber-500/15 text-amber-200 border-amber-400/40"
                  : "bg-rose-500/15 text-rose-200 border-rose-400/40")
              }
            >
              {match.level} match
            </span>
          </div>
        )}
      </div>

      {/* progress bar */}
      {match && (
        <div className="relative mt-4">
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={
                "h-full rounded-full transition-all " +
                (match.level === "High"
                  ? "bg-gradient-to-r from-emerald-400 to-lime-300"
                  : match.level === "Medium"
                  ? "bg-gradient-to-r from-amber-400 to-yellow-300"
                  : "bg-gradient-to-r from-rose-400 to-pink-300")
              }
              style={{ width: `${match.score}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-slate-400">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      )}

      {/* no resume yet */}
      {!resume && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-900/70 px-3 py-3 text-xs text-slate-200">
          <AlertCircle size={14} className="text-indigo-300 mt-0.5" />
          <div>
            <p className="font-semibold">Upload your resume to unlock this panel</p>
            <p className="mt-1 text-[11px] text-slate-300">
              Use the <span className="font-semibold">Resume Assistant</span> on the left to
              upload a PDF/DOCX. We’ll auto-detect your skills and show missing skills for this job.
            </p>
          </div>
        </div>
      )}

      {/* main content when resume is present */}
      {resume && match && (
        <div className="mt-5 relative space-y-4">
          {/* Skills overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
            <div>
              <p className="text-slate-300 mb-1 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-300" />
                Matched skills
              </p>
              {match.matchedSkills.length ? (
                <div className="flex flex-wrap gap-1">
                  {match.matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-200 border border-emerald-400/30"
                    >
                      {titleCaseSkill(s)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  No obvious overlaps. You may need to highlight more relevant tools.
                </p>
              )}
            </div>

            <div>
              <p className="text-slate-300 mb-1">Missing skills in your resume</p>
              {match.missingSkills.length ? (
                <div className="flex flex-wrap gap-1">
                  {match.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5  bg-rose-500/10 text-rose-200 border border-rose-400/40"
                    >
                      {titleCaseSkill(s)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  Great! You already cover most of the skills listed.
                </p>
              )}
            </div>

            <div>
              <p className="text-slate-300 mb-1">Extra skills you bring</p>
              {match.extraSkills.length ? (
                <div className="flex flex-wrap gap-1">
                  {match.extraSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5  bg-sky-500/10 text-sky-200 border border-sky-400/40"
                    >
                      {titleCaseSkill(s)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  Consider adding more tools / libraries you’re comfortable with.
                </p>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className="text-[11px] space-y-1.5">
            <p className="text-slate-300 font-medium">Improvement tips</p>
            <ul className="list-disc list-inside space-y-1">
              {match.suggestions.map((tip, idx) => (
                <li key={idx} className="text-slate-200">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Tailored summary block */}
          <div className="text-[11px] space-y-1.5">
            <p className="text-slate-300 font-medium">
              Tailored summary you can paste into your resume
            </p>
            <p className="text-slate-100 bg-slate-900/70 border border-slate-700 rounded-lg p-3 leading-relaxed">
              {match.tailoredSummary}
            </p>
            <p className="text-[10px] text-slate-400">
              Adjust the numbers, tech stack, and responsibilities so it matches your actual
              experience before using it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
