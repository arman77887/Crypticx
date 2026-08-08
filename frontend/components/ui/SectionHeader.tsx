import React from "react";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = "center",
}) => {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center max-w-3xl mx-auto" : "text-left"}`}>
      {badge && (
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
