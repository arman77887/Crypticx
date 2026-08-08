"use client";

import React from "react";
import Image from "next/image";
import { Shield, Award, CheckCircle2 } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionHeader } from "../ui/SectionHeader";
import { DEFAULT_FOUNDER_PROFILE } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n/context";

export const FounderSection: React.FC = () => {
  const { t } = useTranslation();
  const founder = DEFAULT_FOUNDER_PROFILE;

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Leadership & Expertise"
          title={t("about.title")}
          subtitle={t("about.sub")}
        />

        <GlassCard className="max-w-4xl mx-auto p-8 sm:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 border-blue-500/30 shrink-0">
              <Image
                src={founder.imageUrl}
                alt={founder.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-3">
                <Award className="w-4 h-4" />
                <span>{founder.experienceYears}+ Years Engineering Experience</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{founder.name}</h3>
              <p className="text-sm font-medium text-slate-400 mb-4">{founder.role}</p>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {t(founder.bioKey)}
              </p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {founder.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
