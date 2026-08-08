import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ToolsSection } from "@/components/sections/ToolsSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { CybersecurityGrid } from "@/components/sections/CybersecurityGrid";
import { MarketplaceGrid } from "@/components/sections/MarketplaceGrid";
import { HostingPlans } from "@/components/sections/HostingPlans";
import { DomainSearchBanner } from "@/components/sections/DomainSearchBanner";
import { FounderSection } from "@/components/sections/FounderSection";

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <ToolsSection />
      <ServicesGrid />
      <DomainSearchBanner />
      <MarketplaceGrid />
      <CybersecurityGrid />
      <HostingPlans />
      <FounderSection />
    </div>
  );
}
