"use client"

import { useRef } from "react";
import {
  FileTextIcon,
  LayersIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

import { SectionCard } from "./components/section-card";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";
import { Accordion05, FAQItem } from "./components/accordion-05";
import { TimelineContent } from "@/app/portfolio/components/timeline-animation";

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

function BentoDemo() {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="BLOG"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        {/* Sectie Cards */}
        <TimelineContent
          animationNum={1}
          timelineRef={pageRef}
          once={true}
        >
          <div className="mt-16 space-y-8">
            <SectionCard
              id="simpel-uitgelegd"
              title="Simpel uitgelegd"
              description="Complexe concepten begrijpelijk gemaakt voor iedereen."
              Icon={PersonIcon}
            />
            <SectionCard
              id="faq"
              title="FAQ"
              description="Antwoord op de meeste vragen omtrent dit onderwerp."
              Icon={FileTextIcon}
            >
              <Accordion05 items={faqItems} />
            </SectionCard>
            <SectionCard
              id="visueel"
              title="Visueel materiaal"
              description="Om het nog simpeler te maken!"
              Icon={VideoIcon}
            />
            <SectionCard
              id="stack"
              title="Stack met"
              description="Werkt goed samen met deze andere mogelijkheden."
              Icon={LayersIcon}
            />
            <SectionCard
              id="in-detail"
              title="In detail"
              description="Technische uitleg voor wie meer wil weten en wat te vertellen wil hebben bij het koffieautomaat."
              Icon={MagnifyingGlassIcon}
            />
          </div>
        </TimelineContent>

        {/* Extra ruimte voor scroll testen */}
        <div className="h-[200vh]" />
      </div>
      <StickyFooter />
    </div>
  );
}

export default BentoDemo;
