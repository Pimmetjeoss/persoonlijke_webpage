import Home from '@/app/components/achtergrondfrontpage';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      {/* SEO content — server-side rendered, visueel verborgen */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
        }}
      >
        <h1>Code Lieshout — Webdesign Bureau & AI Specialist in Lieshout</h1>
        <p>
          Code Lieshout is een webdesign bureau in Lieshout (Noord-Brabant). Pim van Lieshout bouwt
          moderne websites, slimme web-applicaties en AI-gedreven oplossingen voor MKB-bedrijven in
          Nederland. Gespecialiseerd in Next.js, React en AI-agents — een websitebouwer en
          webdesigner uit Lieshout die ook landelijk werkt.
        </p>
        <ul>
          <li>Webdesign bureau Lieshout — websites op maat</li>
          <li>Websitebouwer voor MKB in Lieshout, Eindhoven en Helmond</li>
          <li>AI-agents en workflow automatisering</li>
          <li>Next.js en React web-applicaties</li>
          <li>SEO-geoptimaliseerde websites en agent-ready content</li>
          <li>Webdesigner Lieshout met focus op procesoptimalisatie</li>
        </ul>
      </div>
      <Home />
    </>
  );
}
