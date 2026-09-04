import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Websitebouwer Lieshout",
  description:
    "Contact met websitebouwer Code Lieshout in Lieshout. Mail pim@code-lieshout.nl of bel 06-12419980. Reactie binnen één werkdag.",
  alternates: {
    canonical: "https://code-lieshout.nl/contact",
    types: {
      "text/markdown": "https://code-lieshout.nl/contact.md",
    },
  },
  openGraph: {
    title: "Contact — Websitebouwer Lieshout",
    description:
      "Direct contact met Pim van Lieshout — mail of bel. Reactie binnen één werkdag.",
    url: "https://code-lieshout.nl/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Websitebouwer Lieshout",
    description:
      "Mail of bel direct met Pim van Lieshout. Reactie binnen één werkdag.",
    images: ["/og-image.png"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
