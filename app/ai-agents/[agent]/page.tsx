import { notFound } from "next/navigation";

import { AgentDetailClient } from "./detail-page-client";

const agentDetails = [
  { slug: "shopify-agent", title: "SHOPIFY AGENT", label: "Shopify Agent" },
  { slug: "seo-agent", title: "SEO AGENT", label: "SEO Agent" },
  { slug: "bol-com-agent", title: "BOL.COM AGENT", label: "BOL.COM Agent" },
  { slug: "dataset-agent", title: "DATASET AGENT", label: "Dataset Agent" },
  { slug: "google-workspace-agent", title: "GOOGLE WORKSPACE AGENT", label: "Google Workspace Agent" },
  { slug: "second-brain-agent", title: "SECOND BRAIN AGENT", label: "Second Brain Agent" },
  { slug: "lead-agent", title: "LEAD AGENT", label: "Lead Agent" },
  { slug: "cli-agent", title: "CLI AGENT", label: "CLI Agent" },
  { slug: "website-builder-agent", title: "WEBSITE BUILDER AGENT", label: "Website Builder Agent" },
] as const;

export function generateStaticParams() {
  return agentDetails.map((agent) => ({ agent: agent.slug }));
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ agent: string }>;
}) {
  const { agent: slug } = await params;
  const agent = agentDetails.find((item) => item.slug === slug);

  if (!agent) {
    notFound();
  }

  return <AgentDetailClient title={agent.title} label={agent.label} />;
}
