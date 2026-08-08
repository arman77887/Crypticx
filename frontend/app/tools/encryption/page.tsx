import React from "react";
import { ToolIframeContainer } from "@/components/tools/ToolIframeContainer";
import { EXTERNAL_TOOLS } from "@/lib/constants";

export default function EncryptionToolPage() {
  return (
    <ToolIframeContainer
      title="Encryption Utility Tool"
      description="Integrated cryptographic text encryption and decryption engine."
      srcUrl={EXTERNAL_TOOLS.ENCRYPT_TOOL}
    />
  );
}
