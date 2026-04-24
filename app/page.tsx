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
        <h1>Pim Lieshout — Webontwikkelaar & AI Specialist | Code Lieshout</h1>
        <p>
          Code Lieshout bouwt moderne websites, slimme web-applicaties en AI-gedreven oplossingen 
          voor bedrijven in Nederland. Gespecialiseerd in Next.js, React en AI-agents.
        </p>
        <ul>
          <li>Webontwikkeling op maat</li>
          <li>AI-agents en automatisering</li>
          <li>Next.js en React applicaties</li>
          <li>SEO-geoptimaliseerde websites</li>
          <li>Maatwerk software voor MKB</li>
        </ul>
      </div>
      <Home />
    </>
  );
}
