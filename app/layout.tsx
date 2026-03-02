import type { Metadata } from "next";
import Script from "next/script";
import {
  Geist_Mono,
  Fjalla_One,
  Homemade_Apple
} from "next/font/google";
import "./globals.css";
import { TransitionProvider } from "./components/transition_provider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fjallaOne = Fjalla_One({
  variable: "--font-fjalla-one",
  subsets: ["latin"],
  weight: "400",
});

const homemadeApple = Homemade_Apple({
  variable: "--font-homemade-apple",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://code-lieshout.nl"),
  title: {
    default: "Code Lieshout — Portfolio van Pim",
    template: "%s | Code Lieshout",
  },
  description:
    "Persoonlijk portfolio van Pim Lieshout. Developer, AI-enthousiasteling en bouwer van digitale producten. Ontdek projecten, AI-agents en blogposts over de nieuwste tech-ontwikkelingen.",
  alternates: {
    canonical: "https://code-lieshout.nl",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://code-lieshout.nl",
    siteName: "Code Lieshout",
    title: "Code Lieshout — Portfolio van Pim",
    description:
      "Persoonlijk portfolio van Pim Lieshout. Developer, AI-enthousiasteling en bouwer van digitale producten.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Code Lieshout — Portfolio van Pim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Lieshout — Portfolio van Pim",
    description:
      "Persoonlijk portfolio van Pim Lieshout. Developer, AI-enthousiasteling en bouwer van digitale producten.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "Pim Lieshout", url: "https://code-lieshout.nl" }],
  creator: "Pim Lieshout",
  publisher: "Code Lieshout",
  keywords: [
    "Pim Lieshout",
    "Code Lieshout",
    "developer portfolio",
    "AI agents",
    "Next.js",
    "full-stack developer",
    "AI nieuws",
    "tech blog",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
            data-enabled="true"
          />
        )}
      </head>
      <body
        className={`${geistMono.variable} ${fjallaOne.variable} ${homemadeApple.variable} antialiased`}
      >
        <TransitionProvider
          colors={[
            'hsl(141, 78.9%, 85.1%)',
            'hsl(142.1, 76.2%, 36.3%)',
            'hsl(144.9, 80.4%, 10%)'
          ]}
          duration={3}
          stagger={0.6}
          direction="up"
        >
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
