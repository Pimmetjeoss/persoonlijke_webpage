/**
 * Het kaartformaat van de papierrol. Voorheen stond dit in data/projects.ts;
 * de rol wordt nu gevuld met blogposts via lib/blog-projects.ts.
 */

/** De visuele opzet van een kaart. Bepaalt hoe de kaart getekend wordt. */
export type ProjectLayout =
  | "hero" // groot kleurvlak met cirkel — sterke opener
  | "shot" // grote schermafbeelding bovenaan, titel eronder
  | "type" // typografische kaart, groot woordmerk
  | "grid" // raster van zes kleine studies
  | "device" // laptop/telefoon-mock op een gekleurde band
  | "quote" // rustige kaart met een klantcitaat
  | "closing" // donkere afsluiter

export interface Project {
  /** Stabiele id, ook gebruikt als React key. */
  id: string
  /** Kopregel, wordt in hoofdletters getoond. */
  client: string
  /** Korte omschrijving. */
  title: string
  /** Eén regel context. */
  description: string
  /** Jaartal, klein weergegeven. */
  year: string
  /** Type kaart, klein in de voet. */
  discipline: string
  /** Accentkleur van de kaart (hex). */
  accent: string
  /** Tekenopzet van de kaart. */
  layout: ProjectLayout
  /**
   * Waar de kaart naartoe linkt bij klikken.
   * Interne route (`/blog/...`) of externe URL (`https://...`).
   * Laat leeg als de kaart niet klikbaar moet zijn.
   */
  href?: string
  /** Optionele schermafbeelding in /public. */
  image?: string
}
