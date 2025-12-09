"use client"

import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "./components/bento-grid";
import StickyHeader from "@/app/components/sticky-header";
import { StickyFooter } from "@/app/components/sticky-footer";

const features = [
  {
    Icon: InputIcon,
    name: "Simpel uitgelegd",
    description: "Complexe concepten begrijpelijk gemaakt voor iedereen.",
    href: "/",
    cta: "Lees meer",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    hoverColor: "hsl(141 78.9% 85.1%)",
  },
  {
    Icon: FileTextIcon,
    name: "FAQ",
    description: "Antwoord op de meeste vragen omtrent dit onderwerp.",
    href: "/",
    cta: "Bekijk FAQ",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    hoverColor: "hsl(141.7 76.6% 73.1%)",
  },
  {
    Icon: GlobeIcon,
    name: "Visueel materiaal",
    description: "Om het nog simpeler te maken!",
    href: "/",
    cta: "Bekijk",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    hoverColor: "hsl(141.9 69.2% 58%)",
  },
  {
    Icon: BellIcon,
    name: "Stack met",
    description: "Werkt goed samen met deze andere mogelijkheden.",
    href: "/",
    cta: "Bekijk stack",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    hoverColor: "hsl(142.1 76.2% 36.3%)",
  },
  {
    Icon: CalendarIcon,
    name: "In detail",
    description: "Technische uitleg voor wie meer wil weten en wat te vertellen wil hebben bij het koffieautomaat.",
    href: "/",
    cta: "Verdiep je",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    hoverColor: "hsl(142.1 70.6% 45.3%)",
  },
];

function BentoDemo() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "hsl(140.6 84.2% 92.5%)" }}
    >
      <StickyHeader
        title="TEST"
        backgroundColor="hsl(140.6 84.2% 92.5%)"
        hoverColor="hsl(141 78.9% 85.1%)"
        startExpanded={true}
      />
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
        <BentoGrid className="lg:grid-rows-3 mt-10">
          {features.map((feature) => (
            <BentoCard key={feature.name + "-2"} {...feature} />
          ))}
        </BentoGrid>
        <BentoGrid className="lg:grid-rows-3 mt-10">
          {features.map((feature) => (
            <BentoCard key={feature.name + "-3"} {...feature} />
          ))}
        </BentoGrid>
      </div>
      <StickyFooter />
    </div>
  );
}

export default BentoDemo;