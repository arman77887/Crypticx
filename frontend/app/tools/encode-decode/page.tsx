import React from "react";
import { ToolIframeContainer } from "@/components/tools/ToolIframeContainer";
import { EXTERNAL_TOOLS } from "@/lib/constants";

export default function EncodeDecodeToolPage() {
  return (
    <ToolIframeContainer
      title="Encode / Decode Utility Tool"
      description="Integrated utility tool for fast data format conversion and encoding."
      srcUrl={EXTERNAL_TOOLS.ENCODE_DECODE_TOOL}
    />
  );
}
