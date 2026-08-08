"use client";

import React from "react";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { SectionHeader } from "../ui/SectionHeader";
import { DEFAULT_MARKETPLACE_PRODUCTS } from "@/lib/constants";

export const MarketplaceGrid: React.FC = () => {
  return (
    <section className="py-20 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Digital Storefront"
          title="Featured Marketplace Products"
          subtitle="Explore ready-to-deploy websites, dashboard templates, and specialized digital assets."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEFAULT_MARKETPLACE_PRODUCTS.map((prod) => (
            <GlassCard key={prod.id} className="p-0 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full bg-slate-800">
                  <Image
                    src={prod.imageUrl}
                    alt={prod.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-blue-400 border border-slate-800">
                    {prod.category}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{prod.rating}</span>
                    <span className="text-slate-500 font-normal">({prod.salesCount} sales)</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-3 line-clamp-2">
                    {prod.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prod.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80">
                <span className="text-lg font-black text-white">৳{prod.priceBDT.toLocaleString()}</span>
                <button className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};
