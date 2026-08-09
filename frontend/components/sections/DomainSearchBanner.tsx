"use client";

import React, { useState } from "react";
import { CheckCircle2, Globe, Search, XCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

type SearchState = "idle" | "checking" | "available" | "taken" | "error";

export const DomainSearchBanner: React.FC = () => {
  const { t } = useTranslation();

  const [domainQuery, setDomainQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [message, setMessage] = useState("");

  const normalizeDomain = (value: string) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "");
  };

  const isValidDomain = (domain: string) => {
    return /^(?=.{1,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(
      domain
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const domain = normalizeDomain(domainQuery);

    if (!domain) {
      setSearchState("error");
      setMessage("Please enter a domain name.");
      return;
    }

    if (!isValidDomain(domain)) {
      setSearchState("error");
      setMessage("Please enter a valid domain, for example: crypticx.com");
      return;
    }

    setDomainQuery(domain);
    setSearchState("checking");
    setMessage("Checking domain availability...");

    /*
     * Backend domain availability API is not configured yet.
     *
     * This UI is intentionally prepared for the real registrar API.
     * We do NOT falsely report a domain as available.
     */
    setTimeout(() => {
      setSearchState("error");
      setMessage(
        "Real-time availability checking is not connected yet. Registrar API configuration is required."
      );
    }, 700);
  };

  return (
    <section className="border-y border-slate-800 bg-slate-950 py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl sm:p-10">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
              <Globe className="h-4 w-4" />
              <span>DOMAIN REGISTRATION</span>
            </div>

            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {t("domains.title")}
            </h2>

            <p className="mx-auto mb-7 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              {t("domains.sub")}
            </p>

            <form
              onSubmit={handleSearch}
              className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  type="text"
                  value={domainQuery}
                  onChange={(e) => {
                    setDomainQuery(e.target.value);
                    if (searchState !== "idle") {
                      setSearchState("idle");
                      setMessage("");
                    }
                  }}
                  placeholder={t("domains.search.placeholder")}
                  autoComplete="off"
                  spellCheck={false}
                  className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <button
                type="submit"
                disabled={searchState === "checking"}
                className="h-12 rounded-xl bg-blue-600 px-7 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-70"
              >
                {searchState === "checking" ? "Checking..." : t("domains.search.button")}
              </button>
            </form>

            {/* Result */}
            {searchState !== "idle" && (
              <div
                className={`mx-auto mt-5 max-w-2xl rounded-xl border px-4 py-4 text-left ${
                  searchState === "available"
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : searchState === "taken"
                    ? "border-red-500/30 bg-red-500/10"
                    : searchState === "checking"
                    ? "border-blue-500/30 bg-blue-500/10"
                    : "border-amber-500/30 bg-amber-500/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  {searchState === "available" ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  ) : searchState === "taken" ? (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                  ) : (
                    <Globe className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                  )}

                  <div>
                    <p className="font-semibold text-white">
                      {domainQuery}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TLD pricing */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-slate-400">
              <span>
                .com <strong className="text-white">৳1,200</strong>
              </span>
              <span>
                .net <strong className="text-white">৳1,400</strong>
              </span>
              <span>
                .org <strong className="text-white">৳1,500</strong>
              </span>
              <span>
                .xyz <strong className="text-white">৳350</strong>
              </span>
              <span>
                .bd <strong className="text-white">৳3,500</strong>
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
