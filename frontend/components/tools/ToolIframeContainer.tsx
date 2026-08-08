"use client";

import React, { useState } from "react";
import { ExternalLink, ShieldAlert, RefreshCw } from "lucide-react";

interface ToolIframeContainerProps {
  title: string;
  description: string;
  srcUrl: string;
}

export const ToolIframeContainer: React.FC<ToolIframeContainerProps> = ({
  title,
  description,
  srcUrl,
}) => {
  const [iframeKey, setIframeKey] = useState(0);

  const reloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-black text-white">{title}</h1>
          <p className="text-slate-400 text-sm mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reloadIframe}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Tool</span>
          </button>
          <a
            href={srcUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30"
          >
            <span>Open Direct</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Sandbox Frame */}
      <div className="relative w-full h-[750px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <iframe
          key={iframeKey}
          src={srcUrl}
          title={title}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
        />
      </div>

      {/* Security Disclaimer */}
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0" />
        <span>Running in an isolated frontend client container. No payload data is sent to external servers.</span>
      </div>

    </div>
  );
};
