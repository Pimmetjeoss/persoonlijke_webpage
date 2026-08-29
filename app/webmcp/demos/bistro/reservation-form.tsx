"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./bistro.module.css";

/** De naam waaronder dit formulier bij een agent bekendstaat. Hij staat op
    het <form> als `toolname` en wordt hier alleen nog gebruikt om het
    `toolactivated`-event van andere tools te onderscheiden. */
export const TOOL_NAME = "book_table_le_prikkel_bistro";

type FieldName = "name" | "phone" | "date" | "time" | "guests" | "seating";

/** Eén bron voor de foutteksten: ze staan zichtbaar onder het veld én gaan
    als resultaat terug naar de agent, zodat die zijn invoer kan corrigeren. */
const ERROR_MESSAGES: Record<FieldName, string> = {
  name: "Vul een geldige naam in (minimaal 2 tekens).",
  phone: "Vul een geldig telefoonnummer in (minimaal 10 cijfers).",
  date: "Kies een datum vandaag of later.",
  time: "Kies een geldige tijd.",
  guests: "Kies een geldig aantal gasten.",
  seating: "Kies een geldige voorkeursplek.",
};

type ValidationError = { field: FieldName; value: string; message: string };

type Confirmation = {
  name: string;
  dateLabel: string;
  time: string;
  guestsLabel: string;
  seatingLabel: string;
};

const dateFormatter = new Intl.DateTimeFormat("nl-NL", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

/** Le Prikkel Bistro — reserveringsformulier.
 *
 *  De velden zijn bewust ongecontroleerd (defaultValue, geen state). Een
 *  agent vult ze namelijk rechtstreeks op de DOM in via `element.value`;
 *  met controlled inputs zou React die waarden bij de volgende render weer
 *  overschrijven. Alleen de foutmeldingen en de bevestiging lopen via state.
 */
export function ReservationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [invalidFields, setInvalidFields] = useState<FieldName[]>([]);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  /** Vandaag als yyyy-mm-dd, in de tijdzone van de bezoeker. Dit gebeurt in
      een effect en niet in de JSX, omdat de server een andere dag kan zien
      dan de browser en de hydration dan niet zou matchen. */
  useEffect(() => {
    const now = new Date();
    const today = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
    formRef.current?.querySelector("#date")?.setAttribute("min", today);
  }, []);

  const field = (id: FieldName) =>
    formRef.current!.elements.namedItem(id) as HTMLInputElement | HTMLSelectElement;

  /** Valideert het formulier en zet meteen de foutstijlen. Geeft de fouten
      ook terug, zodat de aanroeper niet op een re-render hoeft te wachten. */
  const validate = useCallback((): ValidationError[] => {
    if (!formRef.current) return [];

    const problems: ValidationError[] = [];
    const check = (id: FieldName, isValid: boolean) => {
      if (!isValid) {
        problems.push({ field: id, value: field(id).value, message: ERROR_MESSAGES[id] });
      }
    };

    check("name", field("name").value.trim().length >= 2);
    check("phone", field("phone").value.replace(/\D/g, "").length >= 10);

    const dateValue = field("date").value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    check("date", dateValue !== "" && new Date(dateValue) >= today);

    check("time", field("time").value !== "");
    check("guests", (field("guests") as HTMLSelectElement).selectedIndex !== -1);
    check("seating", (field("seating") as HTMLSelectElement).selectedIndex !== -1);

    setInvalidFields(problems.map((problem) => problem.field));
    return problems;
  }, []);

  /** Bouwt de bevestiging op uit de huidige formulierwaarden. */
  const buildConfirmation = (): Confirmation => {
    const selectedLabel = (id: "guests" | "seating") =>
      (field(id) as HTMLSelectElement).selectedOptions[0]?.textContent ?? "";

    return {
      name: field("name").value,
      dateLabel: dateFormatter.format(new Date(field("date").value)),
      time: field("time").value,
      guestsLabel: selectedLabel("guests"),
      seatingLabel: selectedLabel("seating"),
    };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Heeft een agent dit formulier verzonden, dan hangt `respondWith` aan het
    // native event en verwacht hij daar het resultaat op terug.
    const { respondWith } = event.nativeEvent as SubmitEvent;

    const problems = validate();
    if (problems.length) {
      // Terug naar de agent: precies wat er mis is, per veld.
      respondWith?.(problems);
      return;
    }

    const details = buildConfirmation();
    setConfirmation(details);
    dialogRef.current?.showModal();

    respondWith?.(
      `Reservering bevestigd voor ${details.name} op ${details.dateLabel} om ` +
        `${details.time}. ${details.guestsLabel}, ${details.seatingLabel}.`
    );
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    formRef.current?.reset();
    setInvalidFields([]);
    setConfirmation(null);
  };

  /** Zodra een agent het formulier heeft ingevuld: meteen valideren, zodat
      fouten al zichtbaar zijn op het moment dat de bezoeker moet bevestigen. */
  useEffect(() => {
    const onToolActivated = (event: Event) => {
      if ((event as Event & { toolName?: string }).toolName !== TOOL_NAME) return;
      validate();
    };
    window.addEventListener("toolactivated", onToolActivated);
    return () => window.removeEventListener("toolactivated", onToolActivated);
  }, [validate]);

  /** Klik buiten de dialoog sluit hem, net als in het origineel. */
  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const outside =
      event.clientY < rect.top ||
      event.clientY > rect.bottom ||
      event.clientX < rect.left ||
      event.clientX > rect.right;
    if (outside) closeDialog();
  };

  const fieldClass = (id: FieldName) => (invalidFields.includes(id) ? "invalid" : undefined);
  const errorClass = (id: FieldName) =>
    invalidFields.includes(id) ? `${styles.errorMsg} ${styles.errorMsgVisible}` : styles.errorMsg;

  return (
    <>
      <main className={styles.bookingContainer}>
        <h2>Le Prikkel Bistro</h2>
        <span className={styles.subtitle}>Tafelreserveringen</span>

        <form
          ref={formRef}
          id="reservationForm"
          className={styles.form}
          onSubmit={handleSubmit}
          toolname={TOOL_NAME}
          tooldescription="Start een reserveringsaanvraag bij Le Prikkel Bistro. Verwacht de gegevens van de gast, het tijdstip en de voorkeursplek."
          noValidate
        >
          <div className={styles.formGroup}>
            <label htmlFor="name">Volledige naam</label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              placeholder="bijv. Jan Jansen"
              required
              minLength={2}
              className={fieldClass("name")}
              toolparamdescription="Volledige naam van de gast (minimaal 2 tekens)"
            />
            <span className={errorClass("name")}>{ERROR_MESSAGES.name}</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Telefoonnummer</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              required
              className={fieldClass("phone")}
              toolparamdescription="Telefoonnummer van de gast (minimaal 10 cijfers)"
            />
            <span className={errorClass("phone")}>{ERROR_MESSAGES.phone}</span>
          </div>

          <div className={`${styles.formGroup} ${styles.row}`}>
            <div className={styles.col}>
              <label htmlFor="date">Datum</label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className={fieldClass("date")}
                toolparamdescription="Datum van de reservering. Moet vandaag of later zijn."
              />
              <span className={errorClass("date")}>{ERROR_MESSAGES.date}</span>
            </div>
            <div className={styles.col}>
              <label htmlFor="time">Tijd</label>
              <input
                type="time"
                id="time"
                name="time"
                required
                className={fieldClass("time")}
                toolparamdescription="Tijdstip van de reservering"
              />
              <span className={errorClass("time")}>{ERROR_MESSAGES.time}</span>
            </div>
          </div>

          <div className={`${styles.formGroup} ${styles.row}`}>
            <div className={styles.col}>
              <label htmlFor="guests">Gasten</label>
              <select
                id="guests"
                name="guests"
                required
                defaultValue="2"
                className={fieldClass("guests")}
                toolparamdescription="Aantal gasten. Een tekstwaarde van '1' tot en met '5', of '6' voor gezelschappen van 6 of meer."
              >
                <option value="1">1 persoon</option>
                <option value="2">2 personen</option>
                <option value="3">3 personen</option>
                <option value="4">4 personen</option>
                <option value="5">5 personen</option>
                <option value="6">6 personen of meer</option>
              </select>
              <span className={errorClass("guests")}>{ERROR_MESSAGES.guests}</span>
            </div>
            <div className={styles.col}>
              <label htmlFor="seating">Voorkeursplek</label>
              <select
                id="seating"
                name="seating"
                className={fieldClass("seating")}
                toolparamdescription="Gewenste plek in het restaurant"
              >
                <option value="Restaurantzaal">Restaurantzaal</option>
                <option value="Terras">Terras (buiten)</option>
                <option value="Privehoek">Privéhoek</option>
                <option value="Bar">Aan de bar</option>
              </select>
              <span className={errorClass("seating")}>{ERROR_MESSAGES.seating}</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="requests">Bijzonderheden</label>
            <textarea
              id="requests"
              name="requests"
              rows={2}
              placeholder="Allergieën, jubileum, kinderstoel..."
              toolparamdescription="Bijzonderheden (allergieën, gelegenheid, enzovoort)"
            />
          </div>

          <button type="submit" className={styles.submitBtn} id="submitBtn">
            Reservering aanvragen
          </button>
        </form>
      </main>

      <dialog ref={dialogRef} className={styles.dialog} onClick={handleDialogClick}>
        <h3 className={styles.modalTitle}>Reservering ontvangen</h3>
        <p className={styles.modalSubtitle}>Bon appétit!</p>

        <div className={styles.modalDetails}>
          {confirmation && (
            <>
              Hallo <strong>{confirmation.name}</strong>,
              <br /> We verwelkomen je graag op:
              <br />
              <br /> <strong>{confirmation.dateLabel}</strong> om{" "}
              <strong>{confirmation.time}</strong>
              <br /> Voor <strong>{confirmation.guestsLabel}</strong> &bull;{" "}
              {confirmation.seatingLabel}
            </>
          )}
        </div>

        <button type="button" className={styles.closeModalBtn} onClick={closeDialog}>
          Venster sluiten
        </button>
      </dialog>
    </>
  );
}
