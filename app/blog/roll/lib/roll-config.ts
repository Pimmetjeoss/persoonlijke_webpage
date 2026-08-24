/**
 * Vaste maten en natuurkundige constanten van de papierrol.
 *
 * De belangrijkste relatie: één volledige omwenteling van de rol legt precies
 * één atlas neer. Daardoor sluit de kaart op de rol naadloos aan op de kaart
 * die op de vloer geprint wordt — zonder drift, oneindig lang.
 */

/** Breedte van de papierstrook in wereldeenheden. */
export const RIBBON_WIDTH = 1.5

/** Buitenstraal van de rol. */
export const ROLL_RADIUS = 1.75

/** Straal van de kartonnen kern. */
export const INNER_RADIUS = ROLL_RADIUS * 0.52

/** Afstand tussen twee bemonsterde punten van het afgelegde pad. */
export const PATH_STEP = 0.12

/** Maximaal aantal bewaarde padpunten (bepaalt hoe lang het spoor is). */
export const MAX_POINTS = 760

/** Aantal segmenten in de krul die van de rol af komt. */
export const CURL_SEGMENTS = 16

/** Hoeveel radialen papier zichtbaar om de rol gekruld zit. */
export const CURL_MAX = 0.85

/** Totale segmentbudget van het ribbon-mesh. */
export const MAX_SEGMENTS = MAX_POINTS + CURL_SEGMENTS + 2

/** Veerconstante van de bewegingssolver. */
export const SPRING = 16.0

/** Demping van de bewegingssolver. */
export const DAMPING = 5.4

/** Maximale snelheid van de rol. */
export const MAX_SPEED = 9.0

/** Achtergrond- en vloerkleur van de scène (het pale green van de site). */
export const SCENE_BACKGROUND = 0xdcfce7

/** Vloerkleur, net iets dieper dan de achtergrond. */
export const FLOOR_COLOR = 0xd3f5de

/** Zelfde vloerkleur als GLSL-literal, voor het uitvloeien van de staart. */
export const FLOOR_RGB_GLSL = "vec3(0.827, 0.961, 0.871)"

/** Lengte van één kaart op de strook, afgeleid van de omtrek. */
export function cardLength(cardCount: number): number {
  return (2 * Math.PI * ROLL_RADIUS) / cardCount
}
