"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowRight, Lock, Server, Cpu } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-hero-pattern overflow-hidden pt-12 pb-20">
      
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md animate-pulse-glow">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>{t("hero.badge")}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
          {t("hero.title")}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
          {t("hero.sub")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <span>{t("hero.cta.explore")}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all hover:text-white"
          >
            {t("hero.cta.started")}
          </Link>
        </div>

        {/* Platform Metric Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-800/80 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-slate-300">
            <Lock className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium">AES-256 Utility Encryption</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-slate-300">
            <Server className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-medium">99.9% Cloud Uptime</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-slate-300">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">FastAPI & PostgreSQL Backend</span>
          </div>
        </div>

      </div>
    </section>
  );
};
