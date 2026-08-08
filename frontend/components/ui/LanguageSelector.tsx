"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageCode } from "@/types";

const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "zh", label: "中文" },
];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="relative inline-flex items-center gap-2 bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 transition-colors">
      <Globe className="w-4 h-4 text-blue-400" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        className="bg-transparent text-slate-200 outline-none cursor-pointer pr-1"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
