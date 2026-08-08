import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glowOnHover = true,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6 transition-all duration-300 relative overflow-hidden",
          glowOnHover && "hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:-translate-y-1",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
