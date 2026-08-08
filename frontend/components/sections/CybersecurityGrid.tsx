"use client";

import React from "react";
import { ShieldCheck, Lock, AlertTriangle, Bug, FileSearch, CheckCircle2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionHeader } from "../ui/SectionHeader";
import { useTranslation } from "@/lib/i18n/context";

export const CybersecurityGrid: React.FC = () => {
  const { t } = useTranslation();

  const securityServices = [
    { id: "cs-1", titleKey: "cyber.audit", icon: ShieldCheck, desc: "Comprehensive authorized security auditing of web platforms and cloud infrastructure." },
    { id: "cs-2", titleKey: "cyber.websec", icon: Lock, desc: "Hardening web application firewall rules, SSL/TLS stack, and headers." },
    { id: "cs-3", titleKey: "cyber.vuln", icon: Bug, desc: "Authorized penetration testing and vulnerability identification." },
    { id: "cs-4", titleKey: "cyber.malware", icon: AlertTriangle, desc: "Immediate removal of unauthorized web shell scripts, backdoors, and malware." },
    { id: "cs-5", titleKey: "cyber.consult", icon: FileSearch, desc: "Strategic cybersecurity consultation and infrastructure planning." },
  ];

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Lawful Security Operations"
          title={t("cyber.title")}
          subtitle={t("cyber.sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {securityServices.map((cs) => {
            const Icon = cs.icon;
            return (
              <GlassCard key={cs.id} className="hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t(cs.titleKey)}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {cs.desc}
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lawful & Authorized Only</span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Legal & Compliance Banner */}
        <div className="max-w-4xl mx-auto p-4 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
          <p>{t("cyber.disclaimer")}</p>
        </div>
      </div>
    </section>
  );
};
