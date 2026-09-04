"use client";

import { useEffect } from "react";
import { trackScanComplete } from "@/app/lib/analytics";

/** Vuurt eenmalig scan_complete (+ generate_lead) bij weergave van een scanresultaat. */
export function ScanCompleteTracker({
  domain,
  issueCount,
}: {
  domain: string;
  issueCount: number;
}) {
  useEffect(() => {
    trackScanComplete(domain, issueCount);
  }, [domain, issueCount]);
  return null;
}
