import Home from '@/app/components/achtergrondfrontpage';

export const dynamic = 'force-dynamic';

const CORE_LINKS = [
  { href: '/jouw-website', label: 'Website laten maken' },
  { href: '/ai-agents', label: 'AI-agents voor het MKB' },
  { href: '/agent-ready', label: 'Gratis agent-ready scan' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'Over Pim van Lieshout' },
  { href: '/contact', label: 'Contact' },
];

export default function Page() {
  return (
    <>
      {/* Citeerbaar antwoordblok (C3) + contexte links (B4) — SSR, schermlezer-toegankelijk */}
      <div className="sr-only">
        <h1>Code Lieshout — Webdesign Bureau & AI Specialist in Lieshout</h1>
        <h2>Wat doet Code Lieshout?</h2>
        <p>
          Code Lieshout is het webdesign bureau van Pim van Lieshout in Lieshout
          (Noord-Brabant) voor Nederlandse MKB-bedrijven. Je kunt er een moderne
          website op maat laten bouwen — van ontwerp tot livegang, inclusief
          basis-SEO — en er AI-agents laten ontwikkelen die e-mail, planning,
          data-analyse en klantcontact deels uit handen nemen. Elke website wordt
          bovendien agent-ready opgeleverd, zodat AI-assistenten zoals ChatGPT,
          Claude en Perplexity de inhoud correct kunnen lezen en citeren. Werken
          met Code Lieshout betekent direct contact met de bouwer zelf, een vaste
          projectprijs vooraf en reactie binnen één werkdag. Vrijblijvend
          kennismaken kan via de contactpagina.
        </p>
        <ul>
          {CORE_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <Home />
    </>
  );
}
