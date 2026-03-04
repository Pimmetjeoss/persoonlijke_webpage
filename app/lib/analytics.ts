// GA4 event tracking utility

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
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

// Email click
export function trackEmailClick(email: string) {
  trackEvent("email_link_clicked", {
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
