"use client";

import React, { useState } from "react";
import { Globe, Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

export const DomainSearchBanner: React.FC = () => {
  const { t } = useTranslation();
  const [domainQuery, setDomainQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainQuery) return;
    alert(`Domain search functionality configured. Domain query: ${domainQuery}`);
  };

  return (
    <section className="py-16 bg-slate-900 border-y border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-4">
          <Globe className="w-4 h-4" />
          <span>Domain Registrar Ready</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-2">{t("domains.title")}</h2>
        <p className="text-slate-400 mb-8">{t("domains.sub")}</p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={domainQuery}
              onChange={(e) => setDomainQuery(e.target.value)}
              placeholder={t("domains.search.placeholder")}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all whitespace-nowrap"
          >
            {t("domains.search.button")}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-slate-400 font-medium">
          <span>.com <strong className="text-white">৳1,200</strong></span>
          <span>.net <strong className="text-white">৳1,400</strong></span>
          <span>.org <strong className="text-white">৳1,500</strong></span>
          <span>.xyz <strong className="text-white">৳350</strong></span>
          <span>.bd <strong className="text-white">৳3,500</strong></span>
        </div>
      </div>
    </section>
  );
};
