"use client";

import React from "react";
import Link from "next/link";
import { Shield, Github, Twitter, Linkedin, Facebook, Send, MessageSquare } from "lucide-react";
import { DEFAULT_SOCIAL_LINKS } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n/context";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const renderSocialIcon = (name: string) => {
    switch (name) {
      case "Github": return <Github className="w-5 h-5" />;
      case "Twitter": return <Twitter className="w-5 h-5" />;
      case "Linkedin": return <Linkedin className="w-5 h-5" />;
      case "Facebook": return <Facebook className="w-5 h-5" />;
      case "Send": return <Send className="w-5 h-5" />;
      case "MessageSquare": return <MessageSquare className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">CRYPTICX</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              Enterprise digital services marketplace, domain registration, cloud hosting, and lawful cybersecurity platform. Built for security, speed, and reliability.
            </p>
            <div className="flex items-center gap-3">
              {DEFAULT_SOCIAL_LINKS.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-colors"
                  aria-label={link.platform}
                >
                  {renderSocialIcon(link.iconName)}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">Services</Link></li>
              <li><Link href="/marketplace" className="hover:text-blue-400 transition-colors">Marketplace</Link></li>
              <li><Link href="/hosting" className="hover:text-blue-400 transition-colors">Cloud Hosting</Link></li>
              <li><Link href="/domains" className="hover:text-blue-400 transition-colors">Domains</Link></li>
              <li><Link href="/cybersecurity" className="hover:text-blue-400 transition-colors">Cybersecurity</Link></li>
            </ul>
          </div>

          {/* Navigation Column 2 */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Tools & Utilities
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/tools/encryption" className="hover:text-blue-400 transition-colors">Encryption Tool</Link></li>
              <li><Link href="/tools/encode-decode" className="hover:text-blue-400 transition-colors">Encode / Decode Tool</Link></li>
              <li><Link href="/tools" className="hover:text-blue-400 transition-colors">All Utilities</Link></li>
            </ul>
          </div>

          {/* Navigation Column 3 */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition-colors">User Portal</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CRYPTICX. {t("footer.rights")}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-400">Lawful Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
