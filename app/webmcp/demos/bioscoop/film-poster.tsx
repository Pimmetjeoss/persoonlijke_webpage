import type { Film, Genre } from "./films";
import styles from "./bioscoop.module.css";

const GENRE_CLASS: Record<Genre, string> = {
  action: styles.posterAction,
  comedy: styles.posterComedy,
  horror: styles.posterHorror,
  drama: styles.posterDrama,
  "sci-fi": styles.posterScifi,
  thriller: styles.posterThriller,
};

const GENRE_LABEL: Record<Genre, string> = {
  action: "Action",
  comedy: "Comedy",
  horror: "Horror",
  drama: "Drama",
  "sci-fi": "Sciencefiction",
  thriller: "Thriller",
};

/** Een lokale filmposter die altijd uit hetzelfde Film-object wordt opgebouwd
 *  als de kaart- en detailtitel. De externe voorbeelddata koppelde 62 films
 *  aan slechts 44 afbeeldingen en schoof meerdere herkenbare posters door;
 *  door de titel hier zelf te zetten kan die koppeling niet meer breken. */
export function FilmPoster({ film, detail = false }: { film: Film; detail?: boolean }) {
  const variant = Number.parseInt(film.id, 10) % 6;

  return (
    <span
      className={`${styles.posterArt} ${GENRE_CLASS[film.genre]} ${
        styles[`posterVariant${variant}`]
      } ${detail ? styles.posterArtDetail : ""}`}
      aria-label={`Poster van ${film.title}`}
      role="img"
    >
      <span className={styles.posterGrid} aria-hidden="true" />
      <span className={styles.posterOrb} aria-hidden="true" />
      <span className={styles.posterSlash} aria-hidden="true" />
      <span className={styles.posterStudio}>Een CinePrikkel-film</span>
      <span className={styles.posterArtTitle}>{film.title}</span>
      <span className={styles.posterArtFooter}>
        <span>{GENRE_LABEL[film.genre]}</span>
        <span>CP · {film.id}</span>
      </span>
    </span>
  );
}
