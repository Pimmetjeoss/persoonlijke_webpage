"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { FILMS, GENRE_FILTERS, STEDEN, type Film } from "./films";
import styles from "./bioscoop.module.css";
import type { WebMcpToolDefinition } from "../webmcp";

/** Zoveel dagen vooruit staan er voorstellingen in de agenda. */
const DAGEN_VOORUIT = 14;

/** yyyy-mm-dd in de tijdzone van de bezoeker. `toISOString()` zou hier de
    verkeerde dag geven voor iedereen ten oosten van Greenwich. */
function isoDatum(datum: Date) {
  return [
    datum.getFullYear(),
    String(datum.getMonth() + 1).padStart(2, "0"),
    String(datum.getDate()).padStart(2, "0"),
  ].join("-");
}

const dagKort = new Intl.DateTimeFormat("nl-NL", { weekday: "short" });
const maandKort = new Intl.DateTimeFormat("nl-NL", { month: "short" });
const datumLang = new Intl.DateTimeFormat("nl-NL", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** "2026-08-29" naar een Date op middernacht lokaal. Zonder de tijd erachter
    leest de browser de string als UTC en schuift de dag een stap op. */
const alsDatum = (iso: string) => new Date(`${iso}T00:00:00`);

const filmById = new Map(FILMS.map((film) => [film.id, film]));

/* --- Vandaag ------------------------------------------------------------
   De klok van de bezoeker is een waarde van buiten React, en de server heeft
   hem niet: daar staat een andere dag dan in de browser, en dat zou de
   hydration laten mismatchen. Vandaar useSyncExternalStore met een lege
   server-momentopname — pas na hydration staat de echte datum er. */

const nooitWijzigen = () => () => {};
const leesVandaag = () => isoDatum(new Date());
const geenDatum = () => "";

function useVandaag() {
  return useSyncExternalStore(nooitWijzigen, leesVandaag, geenDatum);
}

/* --- De polyfill --------------------------------------------------------
   `document.modelContext` komt van het script dat met `afterInteractive`
   geladen wordt; dat is er nog niet als de effecten hier voor het eerst
   draaien, en het kondigt zichzelf niet aan. Dus even pollen. Een browser
   met WebMCP ingebouwd heeft hem meteen en start geen interval. */

function abonneerOpModelContext(bijWijziging: () => void) {
  if (document.modelContext) return () => {};

  const interval = setInterval(() => {
    if (!document.modelContext) return;
    clearInterval(interval);
    bijWijziging();
  }, 100);
  // Na tien seconden komt hij niet meer; de pagina werkt zonder ook prima.
  const opgeven = setTimeout(() => clearInterval(interval), 10_000);

  return () => {
    clearInterval(interval);
    clearTimeout(opgeven);
  };
}

const leesModelContext = () => document.modelContext ?? null;
const geenModelContext = () => null;

function useModelContext() {
  return useSyncExternalStore(abonneerOpModelContext, leesModelContext, geenModelContext);
}

/* --- De staat in de URL -------------------------------------------------
   Stad, genre en de geopende film staan in de URL en nergens anders. Dat
   scheelt niet alleen een tweede bron van waarheid — het maakt de pagina ook
   deelbaar, en de terug-knop van de browser doet vanzelf wat je verwacht.

   `history.pushState` laat geen popstate los, dus stuurt `navigeer` er zelf
   een seintje achteraan waar de abonnee op luistert. */

const URL_EVENT = "cineprikkel:urlchange";

type Staat = {
  stad: string;
  genre: string;
  filmId: string | null;
};

/** Parse van "?stad=Oss&genre=horror#film/105". */
function leesStaatUit(zoekEnHash: string): Staat {
  const [zoek, hash = ""] = zoekEnHash.split("#");
  const params = new URLSearchParams(zoek);
  const stad = params.get("stad") ?? "";
  const genre = params.get("genre") ?? "all";
  const filmId = hash.startsWith("film/") ? hash.slice("film/".length) : null;

  return {
    // Onzin in de URL negeren we stil: dan is er gewoon geen filter.
    stad: (STEDEN as readonly string[]).includes(stad) ? stad : "",
    genre: GENRE_FILTERS.some((filter) => filter.value === genre) ? genre : "all",
    filmId: filmId && filmById.has(filmId) ? filmId : null,
  };
}

function schrijfStaat(staat: Staat) {
  const url = new URL(window.location.href);
  if (staat.stad) url.searchParams.set("stad", staat.stad);
  else url.searchParams.delete("stad");
  if (staat.genre !== "all") url.searchParams.set("genre", staat.genre);
  else url.searchParams.delete("genre");
  url.hash = staat.filmId ? `film/${staat.filmId}` : "";
  return url.pathname + url.search + url.hash;
}

function abonneerOpUrl(bijWijziging: () => void) {
  window.addEventListener("popstate", bijWijziging);
  window.addEventListener("hashchange", bijWijziging);
  window.addEventListener(URL_EVENT, bijWijziging);
  return () => {
    window.removeEventListener("popstate", bijWijziging);
    window.removeEventListener("hashchange", bijWijziging);
    window.removeEventListener(URL_EVENT, bijWijziging);
  };
}

/** Eén string, zodat React hem met Object.is kan vergelijken. */
const leesUrl = () => window.location.search + window.location.hash;
const geenUrl = () => "";

function useUrlStaat(): Staat {
  const rauw = useSyncExternalStore(abonneerOpUrl, leesUrl, geenUrl);
  return useMemo(() => leesStaatUit(rauw), [rauw]);
}

/** CinePrikkel — Nederlandse kloon van de ticket-booking-demo van Google
 *  Chrome Labs (Apache-2.0).
 *
 *  Net als de bistro-demo is deze demo *imperatief*: de pagina meldt drie
 *  functies aan met `document.modelContext.registerTool`. Dat is de route
 *  die ChatGPTs ingebouwde browser momenteel als Site tools ondersteunt.
 *
 *  De tools draaien op precies dezelfde functies als de knoppen op het
 *  scherm. Er is dus geen tweede implementatie voor de agent: wat de
 *  bezoeker klikt en wat de agent aanroept komt op hetzelfde uit.
 */
export function CinePrikkel() {
  const vandaag = useVandaag();
  const staat = useUrlStaat();
  const modelContext = useModelContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [stadKeuze, setStadKeuze] = useState("");
  /** De aangeklikte speeldag. Bewust niet in de URL: hij hoort bij het
      bladeren op de detailpagina, niet bij waar je bent. */
  const [datum, setDatum] = useState("");
  const [checkout, setCheckout] = useState<{ datum: string; tijd: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meld = useCallback((tekst: string) => {
    setToast(tekst);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  /** De veertien dagen waarop geboekt kan worden. Voor de hydration is
      `vandaag` nog leeg; dan is de lijst dat ook. */
  const dagen = useMemo(() => {
    if (!vandaag) return [];
    const eerste = alsDatum(vandaag);
    return Array.from({ length: DAGEN_VOORUIT }, (_, i) => {
      const dag = new Date(eerste);
      dag.setDate(eerste.getDate() + i);
      return isoDatum(dag);
    });
  }, [vandaag]);

  /** Eén ingang voor elke navigatie: knop op het scherm én tool lopen hier
      langs. Wat er niet meegegeven wordt, blijft staan. */
  const navigeer = useCallback(
    (patch: Partial<Staat>) => {
      const huidig = leesStaatUit(leesUrl());
      const volgende = { ...huidig, ...patch };

      // Een film die niet in de gekozen stad draait kan niet openstaan. Dat
      // gebeurt als de stad wisselt terwijl de detailpagina open is — door de
      // bezoeker of door een agent.
      if (volgende.filmId) {
        const film = filmById.get(volgende.filmId);
        if (film && volgende.stad && !film.locations.includes(volgende.stad)) {
          meld(`${film.title} draait niet in ${volgende.stad}.`);
          volgende.filmId = null;
        }
      }

      // Van film gewisseld of teruggegaan? Dan is de vorige bestelling niet
      // meer van toepassing.
      if (volgende.filmId !== huidig.filmId) setCheckout(null);

      const doel = schrijfStaat(volgende);
      if (doel === window.location.pathname + leesUrl()) return;
      window.history.pushState(null, "", doel);
      window.dispatchEvent(new Event(URL_EVENT));
    },
    [meld]
  );

  const startBestelling = useCallback(
    (dag: string, tijd: string) => {
      setDatum(dag);
      setCheckout({ datum: dag, tijd });
      meld(`Bestelling gestart voor ${datumLang.format(alsDatum(dag))} om ${tijd} uur.`);
    },
    [meld]
  );

  const zichtbareFilms = useMemo(
    () =>
      FILMS.filter(
        (film) =>
          (staat.genre === "all" || film.genre === staat.genre) &&
          (!staat.stad || film.locations.includes(staat.stad))
      ),
    [staat.genre, staat.stad]
  );

  // Een film die in de URL staat maar niet in de gekozen stad draait, tonen
  // we niet: dan blijft het overzicht staan.
  const gekozenFilm = useMemo(() => {
    const film = staat.filmId ? filmById.get(staat.filmId) : undefined;
    if (!film) return null;
    if (staat.stad && !film.locations.includes(staat.stad)) return null;
    return film;
  }, [staat.filmId, staat.stad]);

  /* --- De WebMCP-tools ---------------------------------------------------
     Drie functies, aangemeld zodra de polyfill er is én de dagen bekend zijn
     (die staan in de omschrijvingen). De AbortController haalt ze er weer af
     als het effect opruimt; zonder dat zou een tweede aanmelding met dezelfde
     naam gooien — bijvoorbeeld bij een remount in React StrictMode. */
  useEffect(() => {
    if (!modelContext || dagen.length === 0) return;

    const eersteDag = dagen[0];
    const laatsteDag = dagen[dagen.length - 1];
    const controller = new AbortController();

    const tools: WebMcpToolDefinition[] = [
      {
        name: "update_location",
        description:
          "Zet de stad waarvoor het filmaanbod getoond wordt. Alleen deze steden bestaan: " +
          `${STEDEN.join(", ")}.`,
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              enum: [...STEDEN],
              description: "De stad, exact zoals hij in de lijst staat (bijvoorbeeld 'Oss').",
            },
          },
          required: ["city"],
          additionalProperties: false,
        },
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
        execute: ({ city }: { city: string }) => {
          if (!(STEDEN as readonly string[]).includes(city)) {
            return {
              status: "error",
              message: `Onbekende stad (${city}). Kies uit: ${STEDEN.join(", ")}.`,
            };
          }
          navigeer({ stad: city });
          const aantal = FILMS.filter((film) => film.locations.includes(city)).length;
          return {
            status: "success",
            message: `Locatie staat nu op ${city}. Daar draaien ${aantal} films.`,
          };
        },
      },
      {
        name: "query_content",
        description:
          "Filtert het aanbod op genre en geeft de gevonden films terug, met hun id, de " +
          "steden waar ze draaien en de speeltijden in 24-uursnotatie. Houdt rekening met " +
          "de stad die op dat moment gekozen is.",
        inputSchema: {
          type: "object",
          properties: {
            genre: {
              type: "string",
              enum: GENRE_FILTERS.map((filter) => filter.value),
              description:
                "Het genre, Engelstalig: action, comedy, horror, drama, sci-fi of thriller. " +
                "Gebruik 'all' om het filter weg te halen.",
            },
          },
          required: ["genre"],
          additionalProperties: false,
        },
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
        execute: ({ genre }: { genre: string }) => {
          const gekozen = genre.trim().toLowerCase();
          if (!GENRE_FILTERS.some((filter) => filter.value === gekozen)) {
            return {
              status: "error",
              message: `Onbekend genre (${genre}).`,
            };
          }
          navigeer({ genre: gekozen, filmId: null });

          // De stad uit de URL en niet uit een closure: die is altijd actueel,
          // ook als een eerdere tool-aanroep hem net veranderd heeft.
          const stad = leesStaatUit(leesUrl()).stad;
          const gevonden = FILMS.filter(
            (film) =>
              (gekozen === "all" || film.genre === gekozen) &&
              (!stad || film.locations.includes(stad))
          ).map((film) => ({
            id: film.id,
            title: film.title,
            genre: film.genre,
            locations: film.locations,
            showtimes: film.showtimes,
          }));

          return { status: "success", city: stad || null, results: gevonden };
        },
      },
      {
        name: "select_showtime",
        description:
          "Kiest een film met een datum en een speeltijd, opent de detailpagina en zet de " +
          "bestelling klaar. De bezoeker rekent zelf af.",
        inputSchema: {
          type: "object",
          properties: {
            movie_id: {
              type: "string",
              description: "Het id van de film, zoals query_content dat teruggeeft.",
            },
            date: {
              type: "string",
              description: `De datum als jjjj-mm-dd, van ${eersteDag} tot en met ${laatsteDag}.`,
              pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            },
            time: {
              type: "string",
              description:
                "De begintijd in 24-uursnotatie, bijvoorbeeld '20:00' of '09:30'. " +
                "Geen AM of PM.",
              pattern: "^([01][0-9]|2[0-3]):[0-5][0-9]$",
            },
            tickets: {
              type: "number",
              description: "Aantal kaartjes.",
              default: 1,
            },
          },
          required: ["movie_id", "date", "time"],
          additionalProperties: false,
        },
        annotations: {
          readOnlyHint: false,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
        execute: ({
          movie_id,
          date,
          time,
        }: {
          movie_id: string;
          date: string;
          time: string;
        }) => {
          const film = filmById.get(movie_id);
          if (!film) return { status: "error", message: `Onbekend film-id (${movie_id}).` };

          const stad = leesStaatUit(leesUrl()).stad;
          if (stad && !film.locations.includes(stad)) {
            return {
              status: "error",
              message: `${film.title} draait niet in ${stad}, wel in ${film.locations.join(", ")}.`,
            };
          }
          if (!dagen.includes(date)) {
            return {
              status: "error",
              message: `Er zijn alleen voorstellingen van ${eersteDag} tot en met ${laatsteDag}.`,
            };
          }
          if (!film.showtimes.includes(time)) {
            return {
              status: "error",
              message: `${film.title} draait niet om ${time}. Wel om: ${film.showtimes.join(", ")}.`,
            };
          }

          navigeer({ filmId: movie_id });
          startBestelling(date, time);
          return {
            status: "success",
            message:
              `Voorstelling van ${film.title} op ${date} om ${time} uur klaargezet. ` +
              "De bezoeker kan nu afrekenen.",
          };
        },
      },
    ];

    // Implementaties mogen synchroon of async registreren; de pagina blijft
    // zonder toolregistratie ook handmatig werken.
    for (const tool of tools) {
      Promise.resolve(modelContext.registerTool(tool, { signal: controller.signal })).catch(() => {});
    }

    return () => controller.abort();
  }, [modelContext, dagen, navigeer, startBestelling]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>
          Cine<span className={styles.logoAccent}>Prikkel</span>
        </h1>
        <button
          type="button"
          className={styles.locationBtn}
          onClick={() => {
            setStadKeuze(staat.stad);
            setModalOpen(true);
          }}
        >
          <span>{staat.stad || "Kies een locatie"}</span>
          <span aria-hidden className={styles.chevron}>
            ▾
          </span>
        </button>
      </header>

      <main className={styles.main}>
        {gekozenFilm ? (
          <FilmDetail
            film={gekozenFilm}
            dagen={dagen}
            datum={datum}
            checkout={checkout}
            onTerug={() => navigeer({ filmId: null })}
            onDatum={setDatum}
            onTijd={startBestelling}
          />
        ) : (
          <>
            <div className={styles.genres}>
              {GENRE_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  className={`${styles.genreBtn} ${
                    staat.genre === filter.value ? styles.genreBtnActief : ""
                  }`}
                  onClick={() => navigeer({ genre: filter.value })}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <h2 className={styles.sectionTitle}>
              Nu te zien <span className={styles.count}>({zichtbareFilms.length})</span>
            </h2>

            {zichtbareFilms.length === 0 ? (
              <p className={styles.leeg}>
                Geen films gevonden{staat.stad ? ` in ${staat.stad}` : ""}.
              </p>
            ) : (
              <div className={styles.grid}>
                {zichtbareFilms.map((film) => (
                  <button
                    key={film.id}
                    type="button"
                    className={styles.card}
                    onClick={() => navigeer({ filmId: film.id })}
                  >
                    <span className={styles.posterWrap}>
                      <Image
                        src={film.poster}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1100px) 25vw, 180px"
                        className={styles.poster}
                      />
                    </span>
                    <span className={styles.cardBody}>
                      <span className={styles.cardTitle}>{film.title}</span>
                      <span className={styles.cardGenre}>{film.genre}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {modalOpen && (
        <div
          className={styles.overlay}
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Kies je locatie">
            <h3 className={styles.modalTitle}>Kies je locatie</h3>
            <p className={styles.modalHint}>Je ziet dan alleen films die daar draaien.</p>

            <select
              className={styles.select}
              value={stadKeuze}
              onChange={(event) => setStadKeuze(event.target.value)}
            >
              <option value="" disabled>
                Kies een stad...
              </option>
              {STEDEN.map((stad) => (
                <option key={stad} value={stad}>
                  {stad}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={styles.primaryBtn}
              disabled={!stadKeuze}
              onClick={() => {
                navigeer({ stad: stadKeuze });
                setModalOpen(false);
              }}
            >
              Locatie bijwerken
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => {
                setStadKeuze("");
                navigeer({ stad: "" });
                setModalOpen(false);
              }}
            >
              Locatie wissen (alles tonen)
            </button>
            <button type="button" className={styles.ghostBtn} onClick={() => setModalOpen(false)}>
              Sluiten
            </button>
          </div>
        </div>
      )}

      <div className={`${styles.toast} ${toast ? styles.toastZichtbaar : ""}`} aria-live="polite">
        {toast}
      </div>
    </div>
  );
}

/** De detailpagina van één film: poster, speeldagen, speeltijden en — zodra
    er een tijd gekozen is — het bestelblok. */
function FilmDetail({
  film,
  dagen,
  datum,
  checkout,
  onTerug,
  onDatum,
  onTijd,
}: {
  film: Film;
  dagen: string[];
  datum: string;
  checkout: { datum: string; tijd: string } | null;
  onTerug: () => void;
  onDatum: (datum: string) => void;
  onTijd: (datum: string, tijd: string) => void;
}) {
  // Voor de hydration is `dagen` nog leeg; dan valt de datumkiezer weg en
  // blijft de rest staan.
  const actieveDatum = dagen.includes(datum) ? datum : (dagen[0] ?? "");

  return (
    <div>
      <button type="button" className={styles.backBtn} onClick={onTerug}>
        ← Terug naar films
      </button>

      <div className={styles.detail}>
        <div className={styles.detailPosterWrap}>
          <Image
            src={film.poster}
            alt={`Poster van ${film.title}`}
            fill
            sizes="(max-width: 768px) 90vw, 280px"
            className={styles.poster}
          />
        </div>

        <div className={styles.detailBody}>
          <h2 className={styles.detailTitle}>{film.title}</h2>
          <p className={styles.detailGenre}>{film.genre}</p>
          <p className={styles.detailLocaties}>Draait in: {film.locations.join(", ")}</p>

          <h3 className={styles.subTitle}>Beschikbare voorstellingen</h3>

          <div className={styles.datums}>
            {dagen.map((dag) => {
              const datumObj = alsDatum(dag);
              return (
                <button
                  key={dag}
                  type="button"
                  className={`${styles.datumBtn} ${
                    dag === actieveDatum ? styles.datumBtnActief : ""
                  }`}
                  onClick={() => onDatum(dag)}
                >
                  <span className={styles.datumDag}>
                    {dagKort.format(datumObj).replace(".", "")}
                  </span>
                  <span className={styles.datumNr}>{datumObj.getDate()}</span>
                  <span className={styles.datumMaand}>
                    {maandKort.format(datumObj).replace(".", "")}
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.tijden}>
            {film.showtimes.map((tijd) => (
              <button
                key={tijd}
                type="button"
                className={`${styles.tijdBtn} ${
                  checkout?.datum === actieveDatum && checkout.tijd === tijd
                    ? styles.tijdBtnActief
                    : ""
                }`}
                onClick={() => onTijd(actieveDatum, tijd)}
                disabled={!actieveDatum}
              >
                {tijd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {checkout && (
        <div className={styles.checkout}>
          <h4 className={styles.checkoutTitle}>Bestelling gestart</h4>
          <p>
            Je hebt gekozen voor{" "}
            <strong>{datumLang.format(alsDatum(checkout.datum))}</strong> om{" "}
            <strong>{checkout.tijd} uur</strong>.
          </p>
          <button type="button" className={styles.payBtn}>
            Doorgaan naar betalen (namaak)
          </button>
        </div>
      )}
    </div>
  );
}
