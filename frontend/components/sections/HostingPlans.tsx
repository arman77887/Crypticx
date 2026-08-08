"use client";

import React from "react";
import { Server, Check } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionHeader } from "../ui/SectionHeader";
import { DEFAULT_HOSTING_PLANS } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n/context";

export const HostingPlans: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Cloud Infrastructure"
          title={t("hosting.title")}
          subtitle={t("hosting.sub")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEFAULT_HOSTING_PLANS.map((plan) => (
            <GlassCard
              key={plan.id}
              className={`flex flex-col justify-between ${
                plan.isPopular ? "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]" : ""
              }`}
            >
              <div>
                {plan.isPopular && (
                  <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-wider uppercase text-blue-300 bg-blue-600/30 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Server className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                </div>

                <div className="my-6">
                  <span className="text-3xl font-black text-white">৳{plan.priceBDTMonthly}</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>

                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{plan.storage}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{plan.bandwidth}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{plan.domainsAllowed}</span>
                  </li>
                </ul>
              </div>

              <button className="w-full py-2.5 rounded-lg font-semibold bg-slate-800 hover:bg-blue-600 text-white transition-colors">
                Select Hosting
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
