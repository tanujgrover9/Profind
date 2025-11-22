import React from "react";
import { motion } from "framer-motion";
import type { ParsedResume } from "../types";
import { UploadCloud, Sparkles } from "lucide-react";

interface Props {
  resume: ParsedResume | null;
  onResumeChange: (resume: ParsedResume | null) => void;
}

export const ResumeAssistant: React.FC<Props> = ({ resume, onResumeChange }) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // mock parsing
    const simulated: ParsedResume = {
      name: "Your Name",
      totalExperienceYears: 2,
      skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind"],
      preferredLocations: ["Remote", "Bengaluru", "Noida"],
      inferredExperienceLevel: "1–3 years",
    };

    onResumeChange(simulated);
    alert(`✅ Mock parsed resume from "${file.name}"`);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        relative p-6 rounded-2xl 
        bg-white/20 backdrop-blur-2xl 
        border border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        overflow-hidden
      "
    >
      {/* 🔵 AI Glow Ring */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-indigo-400/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-16 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl"></div>

      {/* ⚡ AI Chip Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="
          absolute top-4 right-4 
          px-3 py-1.5 rounded-full
          bg-gradient-to-r from-indigo-600 to-purple-600 
          text-white text-[10px] font-semibold 
          shadow-lg flex items-center gap-1
        "
      >
        <Sparkles size={12} /> AI Enabled
      </motion.div>

      {/* HEADER */}
      <h2 className="text-sm font-bold text-slate-900 mb-1 tracking-wide flex items-center gap-1">
        <Sparkles size={14} className="text-indigo-600" />
        Resume Assistant
      </h2>

      <p className="text-[11px] text-slate-600 mb-4 leading-relaxed">
        Let AI extract your skills, experience, and preferred roles for better job matches.
      </p>

      {/* Upload Box */}
      <motion.label
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="
          relative z-10 cursor-pointer
          flex items-center justify-center gap-2 
          w-full py-3 rounded-xl 
          border border-slate-300 
          bg-white/70 
          hover:bg-white
          hover:border-indigo-400 
          hover:shadow-[0_0_18px_rgba(99,102,241,0.25)]
          transition
        "
      >
        <UploadCloud size={18} className="text-indigo-600" />
        <span className="text-[12px] font-medium text-slate-700">
          Upload Resume (PDF / DOCX)
        </span>
        <input type="file" className="hidden" onChange={handleUpload} />
      </motion.label>

      {/* AI Parsed Output */}
      {resume && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="
            mt-6 p-5 rounded-xl 
            bg-white/60 border border-slate-200 
            shadow-sm relative
          "
        >
          {/* AI Scanning Effect */}
          <div className="relative mb-4 h-[4px] bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ["-30%", "120%"] }}
              transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            />
          </div>

          <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
            <Sparkles size={12} className="text-indigo-600" />
            AI-Parsed Summary
          </p>

          {/* Experience */}
          <p className="text-[11px] text-slate-600 mb-2">
            Experience:{" "}
            <span className="font-semibold text-slate-900">
              {resume.totalExperienceYears} yrs
            </span>{" "}
            · {resume.inferredExperienceLevel}
          </p>

          {/* Skills */}
          <p className="text-[11px] text-slate-600 mb-1">Skills Identified:</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {resume.skills.map((s) => (
              <span
                key={s}
                className="
                  px-2 py-0.5 rounded-full 
                  bg-indigo-50 border border-indigo-100 
                  text-[10px] text-indigo-700
                "
              >
                {s}
              </span>
            ))}
          </div>

          {/* Preferred Locations */}
          <p className="text-[11px] text-slate-600 mb-1">Preferred Locations:</p>
          <div className="flex flex-wrap gap-1">
            {resume.preferredLocations.map((loc) => (
              <span
                key={loc}
                className="
                  px-2 py-0.5 rounded-full 
                  bg-slate-50 border border-slate-200 
                  text-[10px] text-slate-700
                "
              >
                {loc}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};
