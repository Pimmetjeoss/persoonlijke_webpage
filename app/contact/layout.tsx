import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Direct Contact met Pim van Lieshout",
  description:
    "Direct contact met Code Lieshout. Mail naar pim@code-lieshout.nl, bel 06-12419980, of vind ons op LinkedIn, YouTube en Instagram. Reactie binnen één werkdag.",
  alternates: {
    canonical: "https://code-lieshout.nl/contact",
  },
  openGraph: {
    title: "Contact Code Lieshout",
    description:
      "Direct contact met Pim van Lieshout — mail, telefoon, of social. Reactie binnen één werkdag.",
    url: "https://code-lieshout.nl/contact",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
