import type { Metadata } from "next";
import fs from "node:fs/promises";
import path from "node:path";
import SeoDashboardClient from "./seo-dashboard-client";
import type { SeoDashboardData } from "@/lib/seo-dashboard-types";

export const metadata: Metadata = {
  title: "SEO Analytics Dashboard",
  description: "Interactief Google Search Console en GA4 organic analytics dashboard voor Code Lieshout.",
  robots: {
    index: false,
    follow: false,
  },
};

async function loadDashboardData(): Promise<SeoDashboardData> {
  const file = path.join(process.cwd(), "public", "data", "seo-dashboard", "dashboard.json");
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as SeoDashboardData;
}

export default async function SeoDashboardPage() {
  const data = await loadDashboardData();
  return <SeoDashboardClient initialData={data} />;
}
