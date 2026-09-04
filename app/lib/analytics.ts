// GA4 event tracking utility

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

// Outbound link click
export function trackOutboundClick(url: string, label: string) {
  trackEvent("outbound_click", {
    link_url: url,
    link_label: label,
  });
}

// Email click (handoff E1: eventnaam email_click)
export function trackEmailClick(email: string) {
  trackEvent("email_link_clicked", {
    email_address: email,
  });
  trackEvent("email_click", {
    email_address: email,
  });
}

// Phone click
export function trackPhoneClick(phone: string) {
  trackEvent("phone_link_clicked", {
    phone_number: phone,
  });
}

// CTA click
export function trackCTAClick(label: string, location: string) {
  trackEvent("cta_clicked", {
    cta_label: label,
    cta_location: location,
  });
}

// Lead: mailto/tel/CTA met conversie-intentie (handoff E1: generate_lead).
// Er is geen formulier op de site; mailto- en tel-kliks zijn het conversiepad.
export function trackGenerateLead(source: string, detail?: string) {
  trackEvent("generate_lead", {
    lead_source: source,
    ...(detail ? { lead_detail: detail } : {}),
  });
}

// Agent-ready scan afgerond op de resultaatpagina (handoff E1: scan-complete)
export function trackScanComplete(domain: string, issueCount: number) {
  trackEvent("scan_complete", {
    scanned_domain: domain,
    issue_count: issueCount,
  });
  trackEvent("generate_lead", {
    lead_source: "agent-ready-scan",
    lead_detail: domain,
  });
}
