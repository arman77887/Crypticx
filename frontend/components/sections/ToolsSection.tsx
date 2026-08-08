"use client";

import React from "react";
import Link from "next/link";
import { Lock, Code2, ExternalLink } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionHeader } from "../ui/SectionHeader";
import { useTranslation } from "@/lib/i18n/context";

export const ToolsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Utility Suite"
          title={t("tools.title")}
          subtitle={t("tools.sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Encryption Tool Card */}
          <GlassCard className="flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t("tools.encrypt.title")}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {t("tools.encrypt.desc")}
              </p>
            </div>
            <Link
              href="/tools/encryption"
              className="inline-flex items-center gap-2 font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>{t("tools.open")}</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </GlassCard>

          {/* Encode / Decode Card */}
          <GlassCard className="flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t("tools.encode.title")}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {t("tools.encode.desc")}
              </p>
            </div>
            <Link
              href="/tools/encode-decode"
              className="inline-flex items-center gap-2 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>{t("tools.open")}</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </GlassCard>

        </div>
      </div>
    </section>
  );
};
