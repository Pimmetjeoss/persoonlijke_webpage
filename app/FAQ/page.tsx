"use client"

import { FileTextIcon } from "@radix-ui/react-icons";
import { SectionCard } from "./components/section-card";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { Accordion05, FAQItem } from "./components/accordion-05";

const faqItems: FAQItem[] = [
  {
    id: "1",
    title: "Placeholder vraag 1?",
    content: "Dit is een placeholder antwoord. Vul hier later de echte content in.",
  },
  {
    id: "2",
    title: "Placeholder vraag 2?",
    content: "Dit is een placeholder antwoord. Vul hier later de echte content in.",
  },
  {
    id: "3",
    title: "Placeholder vraag 3?",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "4",
    title: "Placeholder vraag 4?",
    content: "Dit is een placeholder antwoord. Vul hier later de echte content in.",
  },
  {
    id: "5",
    title: "Placeholder vraag 5?",
    content: "Dit is een placeholder antwoord. Vul hier later de echte content in.",
  },
  {
    id: "6",
    title: "Placeholder vraag 6?",
    content: "Dit is een placeholder antwoord. Vul hier later de echte content in.",
  },
  {
    id: "7",
    title: "Placeholder vraag 7?",
    content: "Dit is een placeholder antwoord. Vul hier later de echte content in.",
  },
  {
    id: "8",
    title: "Placeholder vraag 8?",
    content: "Dit is een placeholder antwoord. Vul hier later de echte content in.",
  },
];

function FAQPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="FAQ"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        <div className="space-y-8">
          <SectionCard
            id="faq"
            title="FAQ"
            description="Antwoord op de meeste vragen omtrent dit onderwerp."
            Icon={FileTextIcon}
          >
            <Accordion05 items={faqItems} />
          </SectionCard>

          <SectionCard
            id="faq-2"
            title="FAQ"
            description="Antwoord op de meeste vragen omtrent dit onderwerp."
            Icon={FileTextIcon}
          >
            <Accordion05 items={faqItems} />
          </SectionCard>

          <SectionCard
            id="faq-3"
            title="FAQ"
            description="Antwoord op de meeste vragen omtrent dit onderwerp."
            Icon={FileTextIcon}
          >
            <Accordion05 items={faqItems} />
          </SectionCard>
        </div>

        {/* Extra ruimte voor scroll testen */}
        <div className="h-[200vh]" />
      </div>
      <StickyFooter />
    </div>
  );
}

export default FAQPage;