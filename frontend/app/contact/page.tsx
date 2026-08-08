import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ContactPage() {
  return (
    <div className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="24/7 Global Support"
          title="Contact CRYPTICX Support"
          subtitle="Get in touch with our engineering and support team for custom service requests."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          <GlassCard className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Support Channels</h3>
            
            <div className="flex items-start gap-3 text-slate-300 text-sm">
              <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Email Us</p>
                <p className="text-xs text-slate-400">support@crypticx.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-300 text-sm">
              <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Direct Line</p>
                <p className="text-xs text-slate-400">+880 1700-000000</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-slate-300 text-sm">
              <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Headquarters</p>
                <p className="text-xs text-slate-400">Dhaka, Bangladesh</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2">
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Your Email</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="Custom Web Development Enquiry"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Message</label>
                <textarea
                  rows={5}
                  placeholder="Describe your project requirements..."
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </GlassCard>

        </div>
      </div>
    </div>
  );
}
