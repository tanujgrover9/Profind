// src/components/Footer.tsx
import React from "react";
import { Linkedin, Github, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-16 bg-white/60 backdrop-blur-xl border-t border-black">
      {/* Decorative gradient glow */}
      <div className="absolute inset-x-0 -top-12 h-20 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="ProFind logo"
              className="h-12 w-auto object-contain  backdrop-blur-md p-2  "
            />
          </div>

          <p className="text-[14px] text-slate-700 mt-3 leading-relaxed">
            AI-powered job search designed to match you with the right
            opportunities faster and smarter.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-slate-800 font-semibold mb-3 text-[15px]">
            Quick Links
          </p>
          <div className="flex flex-col gap-2 text-[14px] text-slate-600">
            <a className="hover:text-indigo-600 transition" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-indigo-600 transition" href="#">
              Terms of Service
            </a>
            <a className="hover:text-indigo-600 transition" href="#">
              Help & Support
            </a>
          </div>
        </div>

        {/* Social */}
        <div>
          <p className="text-slate-800 font-semibold mb-3 text-[15px]">
            Connect With Us
          </p>
          <div className="flex gap-4">
            <a className="p-3 rounded-xl bg-white/50 backdrop-blur-md shadow hover:shadow-md hover:bg-indigo-50 transition">
              <Linkedin size={18} className="text-indigo-600" />
            </a>
            <a className="p-3 rounded-xl bg-white/50 backdrop-blur-md shadow hover:shadow-md hover:bg-indigo-50 transition">
              <Github size={18} className="text-indigo-600" />
            </a>
            <a
              href="mailto:contact@jobfinder.ai"
              className="p-3 rounded-xl bg-white/50 backdrop-blur-md shadow hover:shadow-md hover:bg-indigo-50 transition"
            >
              <Mail size={18} className="text-indigo-600" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="text-[12px] text-slate-700 text-center py-4 border-t border-white/30 bg-gradient-to-r from-indigo-50/60 to-purple-50/60">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">ProFind AI</span>. All rights
        reserved.
      </div>
    </footer>
  );
};
