import Link from "next/link";
import { notFound } from "next/navigation";

import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";

const steps = [
  { slug: "verkenning", title: "Verkenning" },
  { slug: "realisatie", title: "Realisatie" },
  { slug: "testen-en-redactie", title: "Testen & redactie" },
  { slug: "go-live", title: "Go-live" },
  { slug: "onderhoud", title: "Onderhoud" },
  { slug: "optimalisatie", title: "Optimalisatie" },
];

export function generateStaticParams() {
  return steps.map((step) => ({ stap: step.slug }));
}

export default async function WebdesignStepPage({
  params,
}: {
  params: Promise<{ stap: string }>;
}) {
  const { stap } = await params;
  const step = steps.find((item) => item.slug === stap);

  if (!step) {
    notFound();
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title={step.title.toUpperCase()}
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />

      <main className="mx-auto max-w-5xl p-6 lg:p-10">
        <section
          className="w-full rounded-xl border-[3px] bg-white p-8 shadow-xl md:p-12"
          style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[hsl(142.1_76.2%_36.3%)]">
            Webdesign werkwijze
          </p>
          <h1
            className="mb-6 text-4xl font-bold tracking-tight md:text-6xl"
            style={{ color: "hsl(144.9 80.4% 10%)" }}
          >
            {step.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
            Deze pagina is aangemaakt als aparte stap binnen de webdesign-werkwijze. Hier kan later de volledige uitleg voor {step.title.toLowerCase()} worden aangevuld.
          </p>
          <Link
            href="/webdesign#werkwijze"
            className="mt-8 inline-flex rounded-full border-[3px] border-[hsl(144.9_80.4%_10%)] px-5 py-3 font-semibold text-[hsl(144.9_80.4%_10%)] transition-colors hover:bg-[hsl(141_78.9%_85.1%)]"
          >
            Terug naar werkwijze
          </Link>
        </section>
      </main>

      <StickyFooter />
    </div>
  );
}
