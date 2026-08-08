"use client";

import React from "react";
import { Code, FileCheck, Award, TrendingUp, Headphones, Layers, ArrowRight } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionHeader } from "../ui/SectionHeader";
import { DEFAULT_SERVICES } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n/context";

export const ServicesGrid: React.FC = () => {
  const { t } = useTranslation();

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return <Code className="w-6 h-6" />;
      case "FileCheck": return <FileCheck className="w-6 h-6" />;
      case "Award": return <Award className="w-6 h-6" />;
      case "TrendingUp": return <TrendingUp className="w-6 h-6" />;
      case "Headphones": return <Headphones className="w-6 h-6" />;
      default: return <Layers className="w-6 h-6" />;
    }
  };

  return (
    <section className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Digital Marketplace"
          title={t("services.title")}
          subtitle={t("services.sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEFAULT_SERVICES.map((service) => (
            <GlassCard key={service.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    {renderIcon(service.iconName)}
                  </div>
                  {service.popular && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Popular
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t(service.titleKey)}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {t(service.descKey)}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Starting at</span>
                  <span className="text-lg font-black text-white">৳{service.priceBDT.toLocaleString()}</span>
                </div>
                <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
