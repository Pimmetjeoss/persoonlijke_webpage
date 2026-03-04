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

const schemaMarkup = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://code-lieshout.nl/#business",
      "name": "Code Lieshout",
      "url": "https://code-lieshout.nl",
      "logo": {
        "@type": "ImageObject",
        "url": "https://code-lieshout.nl/cactus_laptop_transparent.png",
        "caption": "Code Lieshout — Cactus Knight logo"
      },
      "image": "https://code-lieshout.nl/cactus_laptop_transparent.png",
      "description": "Code Lieshout biedt AI-automatiseringsoplossingen voor Nederlandse bedrijven. Van chatbots en AI agents tot workflow-optimalisatie en AI consultancy.",
      "founder": { "@id": "https://code-lieshout.nl/#pim" },
      "email": "pim@code-lieshout.nl",
      "telephone": "+31612419980",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NL"
      },
      "areaServed": { "@type": "Country", "name": "Nederland" },
      "sameAs": [
        "https://www.linkedin.com/in/pim-van-lieshout",
        "https://www.youtube.com/@PimvanLieshout"
      ],
      "knowsAbout": ["Kunstmatige intelligentie", "AI automatisering", "Chatbot ontwikkeling", "Workflow optimalisatie", "Machine learning"],
      "priceRange": "€€",
      "currenciesAccepted": "EUR",
      "inLanguage": "nl-NL",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "AI Diensten",
        "itemListElement": [
          {"@type": "Offer", "itemOffered": {"@id": "https://code-lieshout.nl/#service-chatbot"}},
          {"@type": "Offer", "itemOffered": {"@id": "https://code-lieshout.nl/#service-automatisering"}},
          {"@type": "Offer", "itemOffered": {"@id": "https://code-lieshout.nl/#service-agents"}},
          {"@type": "Offer", "itemOffered": {"@id": "https://code-lieshout.nl/#service-consultancy"}}
        ]
      }
    },
    {
      "@type": "Person",
      "@id": "https://code-lieshout.nl/#pim",
      "name": "Pim van Lieshout",
      "url": "https://code-lieshout.nl/about-me",
      "email": "pim@code-lieshout.nl",
      "telephone": "+31612419980",
      "jobTitle": "AI Automatisering Specialist",
      "worksFor": { "@id": "https://code-lieshout.nl/#business" },
      "knowsAbout": ["AI automatisering", "Chatbot oplossingen", "Next.js", "AI agents", "Workflow optimalisatie", "Machine learning"],
      "sameAs": [
        "https://www.linkedin.com/in/pim-van-lieshout",
        "https://www.youtube.com/@PimvanLieshout",
        "https://github.com/Pimmetjeoss"
      ],
      "nationality": { "@type": "Country", "name": "Nederland" },
      "inLanguage": "nl-NL"
    },
    {
      "@type": "WebSite",
      "@id": "https://code-lieshout.nl/#website",
      "url": "https://code-lieshout.nl",
      "name": "Code Lieshout",
      "description": "Portfolio en dienstenaanbod van Pim van Lieshout — AI automatisering voor Nederlandse bedrijven.",
      "publisher": { "@id": "https://code-lieshout.nl/#business" },
      "inLanguage": "nl-NL"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3L0DZPDJY7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            // Consent Mode v2: standaard alles uit tot toestemming
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              ad_storage: 'denied',
              wait_for_update: 500
            });
            // Herstel consent als al eerder gegeven
            const consent = localStorage.getItem('cookie-consent');
            if (consent === 'granted') {
              gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied' });
            }
            gtag('js', new Date());
            gtag('config', 'G-3L0DZPDJY7');
          `}
        </Script>
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
