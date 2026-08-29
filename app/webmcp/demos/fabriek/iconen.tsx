/* iconen.tsx — de tekeningen van PrikkelFabriek.

   Zelf getekend, want het origineel (bandarra.me/apps/webmcp-factory) staat
   niet onder een licentie die overnemen toestaat. Dat kwam goed uit: die
   iconen zijn grijs-bruin, en deze pagina houdt zich aan de groenschaal uit
   kleuren.txt.

   Twee materialen moeten uit elkaar te houden zijn met één blik op een tegel
   van 48 pixels. IJzer is daarom bleekgroen en koper warm bruin-oranje —
   koper is de enige kleur die buiten de schaal valt, en dat is precies
   waarom het werkt. De vorm doet de rest: erts is een brok, een plaat is een
   plak, een spoel is gewikkeld draad.

   Vaste kleuren en geen `currentColor`: elk icoon heeft meerdere vlakken en
   moet er in de tegel, in de machinekaart en in de kop hetzelfde uitzien. */

import type { ItemId } from "./fabriek";

const STEEN = "#14532d";
const STEEN_LICHT = "#166534";
const STEEN_RAND = "#22c55e";
const IJZER = "#86efac";
const IJZER_LICHT = "#dcfce7";
const IJZER_DONKER = "#4ade80";
const KOPER = "#c2703b";
const KOPER_LICHT = "#e5a06a";
const KOPER_DONKER = "#8f4f28";
/** Alleen voor het vuur in de oven: warmte leest niet als groen. */
const GLOED = "#e08a48";
/** De gaten in het tandwiel en de tunnelmond: dezelfde kleur als het
    donkerste paginavlak, zodat ze als schaduw lezen op elke ondergrond. */
const DIEPTE = "#052e16";

type IcoonProps = { className?: string };

/* --- Items ------------------------------------------------------------- */

/** Erts: een brok steen met twee aders erin. IJzer en koper delen de brok
    en verschillen alleen in de aders — zo lezen ze meteen als familie. */
function Erts({ ader, aderLicht, className }: IcoonProps & { ader: string; aderLicht: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
      <polygon points="9,38 5,26 11,13 23,7 35,10 43,19 40,33 31,42 17,42" fill={STEEN} />
      <polygon points="11,13 23,7 31,14 18,22" fill={STEEN_LICHT} />
      <polygon points="20,16 30,14 32,25 22,27" fill={ader} />
      <polygon points="26,29 34,27 32,37 24,36" fill={aderLicht} />
      <polygon points="13,17 18,13 21,17 16,21" fill={STEEN_RAND} opacity="0.5" />
    </svg>
  );
}

export const IJzerertsIcoon = ({ className }: IcoonProps) => (
  <Erts ader={IJZER} aderLicht={IJZER_LICHT} className={className} />
);

export const KopererstIcoon = ({ className }: IcoonProps) => (
  <Erts ader={KOPER} aderLicht={KOPER_LICHT} className={className} />
);

/** Plaat: een plak in isometrie — bovenvlak, linkerkant, rechterkant. */
function Plaat({
  boven,
  links,
  rechts,
  className,
}: IcoonProps & { boven: string; links: string; rechts: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
      <polygon points="24,10 43,19 24,28 5,19" fill={boven} />
      <polygon points="5,19 24,28 24,36 5,27" fill={links} />
      <polygon points="43,19 24,28 24,36 43,27" fill={rechts} />
    </svg>
  );
}

export const IJzerplaatIcoon = ({ className }: IcoonProps) => (
  <Plaat boven={IJZER_LICHT} links={STEEN_LICHT} rechts={IJZER} className={className} />
);

export const KoperplaatIcoon = ({ className }: IcoonProps) => (
  <Plaat boven={KOPER_LICHT} links={KOPER_DONKER} rechts={KOPER} className={className} />
);

/** Tandwiel: acht tanden als gedraaide balkjes onder een ronde naaf. De
    balkjes staan met opzet ónder de cirkel in de tekenvolgorde, zodat alleen
    hun uiteinden uitsteken. */
export const TandwielIcoon = ({ className }: IcoonProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
    <g fill={IJZER}>
      {[0, 45, 90, 135].map((hoek) => (
        <rect key={hoek} x="21" y="4" width="6" height="40" rx="1.5" transform={`rotate(${hoek} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="14" />
    </g>
    <circle cx="24" cy="24" r="13" fill="none" stroke={IJZER_LICHT} strokeWidth="1.5" opacity="0.7" />
    <circle cx="24" cy="24" r="5.5" fill={DIEPTE} />
  </svg>
);

/** Spoel: koperdraad gewikkeld om een kern. */
export const KoperspoelIcoon = ({ className }: IcoonProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
    <line x1="7" y1="24" x2="41" y2="24" stroke={STEEN_LICHT} strokeWidth="6" strokeLinecap="round" />
    {[14, 21, 28, 35].map((x) => (
      <ellipse key={x} cx={x} cy="24" rx="3.4" ry="10" fill="none" stroke={KOPER} strokeWidth="3.4" />
    ))}
    <ellipse cx="14" cy="24" rx="3.4" ry="10" fill="none" stroke={KOPER_LICHT} strokeWidth="2" />
  </svg>
);

/** Elektromotor: een romp met koelribben, een koperen band en een as. */
export const ElektromotorIcoon = ({ className }: IcoonProps) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
    <rect x="7" y="17" width="5" height="14" rx="2" fill={STEEN_LICHT} />
    <rect x="11" y="13" width="25" height="22" rx="4" fill={IJZER} />
    {[16, 20, 24, 28].map((x) => (
      <line key={x} x1={x} y1="15" x2={x} y2="33" stroke={STEEN_LICHT} strokeWidth="1.6" opacity="0.55" />
    ))}
    <rect x="30" y="13" width="6" height="22" rx="2" fill={KOPER} />
    <rect x="30" y="19" width="6" height="3" fill={KOPER_LICHT} />
    <rect x="35" y="21" width="8" height="6" rx="3" fill={IJZER_DONKER} />
  </svg>
);

/* --- Machines -----------------------------------------------------------
   Groter kader (64) dan de items, want ze staan op een kaart en niet op een
   tegel. */

/** Mijn: een berg met een tunnelmond en twee brokken ervoor. */
function Mijn({ ader, className }: IcoonProps & { ader: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <polygon points="2,52 20,18 31,34 42,12 62,52" fill={STEEN} />
      <polygon points="20,18 26,28 14,28" fill={STEEN_LICHT} />
      <polygon points="42,12 50,26 34,26" fill={STEEN_LICHT} />
      <path d="M22 52 a10 10 0 0 1 20 0 z" fill={DIEPTE} />
      <rect x="30" y="40" width="4" height="12" fill={ader} opacity="0.85" />
      <rect x="6" y="52" width="52" height="4" rx="2" fill={STEEN_RAND} opacity="0.6" />
      <circle cx="14" cy="47" r="3.5" fill={ader} />
      <circle cx="52" cy="45" r="2.8" fill={ader} />
    </svg>
  );
}

export const IJzermijnIcoon = ({ className }: IcoonProps) => (
  <Mijn ader={IJZER} className={className} />
);

export const KopermijnIcoon = ({ className }: IcoonProps) => (
  <Mijn ader={KOPER_LICHT} className={className} />
);

/** Oven: een kast met een schoorsteen en een gloeiende mond. */
export const OvenIcoon = ({ className }: IcoonProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
    <rect x="40" y="6" width="11" height="18" rx="2" fill={STEEN_LICHT} />
    <rect x="38" y="4" width="15" height="5" rx="2" fill={STEEN_RAND} opacity="0.7" />
    <rect x="10" y="20" width="44" height="34" rx="4" fill={STEEN} />
    <rect x="10" y="20" width="44" height="6" rx="3" fill={STEEN_LICHT} />
    <path d="M22 47 h20 v-9 a10 10 0 0 0 -20 0 z" fill={GLOED} />
    <path d="M27 47 h10 v-6 a5 5 0 0 0 -10 0 z" fill={KOPER_LICHT} />
    <rect x="6" y="52" width="52" height="6" rx="3" fill={STEEN_LICHT} />
  </svg>
);

/** Smederij: een aambeeld. */
export const SmederijIcoon = ({ className }: IcoonProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
    <path d="M8 20 h48 l-6 8 h-6 l-2 5 h-4 l4 14 h-24 l4 -14 h-4 l-2 -5 h-6 z" fill={IJZER} />
    <path d="M8 20 h48 l-3 4 h-42 z" fill={IJZER_LICHT} />
    <rect x="18" y="47" width="28" height="8" rx="2" fill={STEEN_LICHT} />
    <rect x="14" y="55" width="36" height="4" rx="2" fill={STEEN} />
  </svg>
);

/** Assemblage: een robotarm met een grijper. */
export const AssemblageIcoon = ({ className }: IcoonProps) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
    <rect x="12" y="50" width="30" height="8" rx="3" fill={STEEN_LICHT} />
    <rect x="22" y="28" width="9" height="24" rx="4" fill={IJZER} />
    <rect x="26" y="18" width="26" height="9" rx="4" fill={IJZER} transform="rotate(-18 26 22)" />
    <circle cx="26.5" cy="29" r="5" fill={KOPER} />
    <circle cx="26.5" cy="29" r="2" fill={DIEPTE} />
    <rect x="44" y="9" width="4" height="8" rx="2" fill={IJZER_DONKER} transform="rotate(-18 46 13)" />
    <rect x="50" y="11" width="4" height="8" rx="2" fill={IJZER_DONKER} transform="rotate(-18 52 15)" />
  </svg>
);

/* --- Koppeling ----------------------------------------------------------
   Eén plek waar een item-id aan zijn tekening hangt, zodat het voorraadpaneel
   alleen nog hoeft op te zoeken. De machines staan in prikkelfabriek.tsx bij
   hun kaartgegevens. */

export const ITEM_ICOON: Record<ItemId, (props: IcoonProps) => React.JSX.Element> = {
  iron_ore: IJzerertsIcoon,
  copper_ore: KopererstIcoon,
  iron_plate: IJzerplaatIcoon,
  iron_gear: TandwielIcoon,
  copper_plate: KoperplaatIcoon,
  copper_coil: KoperspoelIcoon,
  electric_motor: ElektromotorIcoon,
};
