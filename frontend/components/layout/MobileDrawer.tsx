"use client";

import React from "react";
import Link from "next/link";
import { X, Shield } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, links }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl z-10">
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-extrabold text-white">CRYPTICX</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="text-base font-medium text-slate-300 hover:text-blue-400 transition-colors py-2 border-b border-slate-800/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col gap-3">
          <Link
            href="/login"
            onClick={onClose}
            className="w-full text-center py-2.5 text-slate-300 hover:text-white font-semibold rounded-lg border border-slate-700"
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="w-full text-center py-2.5 text-white font-semibold bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/30"
          >
            {t("nav.register")}
          </Link>
        </div>
      </div>
    </div>
  );
};
