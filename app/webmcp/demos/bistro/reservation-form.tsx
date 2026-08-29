"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./bistro.module.css";
import type { WebMcpToolDefinition } from "../webmcp";

/** De naam waaronder de voorbereidende reserveringsactie bij een agent
    bekendstaat. De bezoeker verstuurt de aanvraag daarna zelf. */
export const TOOL_NAME = "prepare_table_reservation";

type FieldName = "name" | "phone" | "date" | "time" | "guests" | "seating";
type FormFieldName = FieldName | "requests";

type ReservationInput = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seating: "restaurant" | "terrace" | "private" | "bar";
  requests?: string;
};

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

/* `document.modelContext` is in ChatGPT native meteen beschikbaar. De
   polyfill van deze demo wordt na hydration geladen, dus daarop wachten we
   kort als de browser zelf nog geen WebMCP heeft. */
function subscribeToModelContext(onChange: () => void) {
  if (document.modelContext) return () => {};

  const interval = setInterval(() => {
    if (!document.modelContext) return;
    clearInterval(interval);
    onChange();
  }, 100);
  const timeout = setTimeout(() => clearInterval(interval), 10_000);

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
}

const readModelContext = () => document.modelContext ?? null;
const readServerModelContext = () => null;

function useModelContext() {
  return useSyncExternalStore(subscribeToModelContext, readModelContext, readServerModelContext);
}

/** Le Prikkel Bistro — reserveringsformulier.
 *
 *  De velden zijn bewust ongecontroleerd (defaultValue, geen state). Een
 *  agent vult ze namelijk rechtstreeks op de DOM in via `element.value`;
 *  met controlled inputs zou React die waarden bij de volgende render weer
 *  overschrijven. Alleen de foutmeldingen en de bevestiging lopen via state.
 */
export function ReservationForm() {
  const modelContext = useModelContext();
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

  const field = useCallback(
    (id: FormFieldName) =>
      formRef.current!.elements.namedItem(id) as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement,
    []
  );

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
    const reservationDate = new Date(`${dateValue}T00:00:00`);
    check(
      "date",
      dateValue !== "" && !Number.isNaN(reservationDate.getTime()) && reservationDate >= today
    );

    check("time", field("time").value !== "");
    check("guests", (field("guests") as HTMLSelectElement).selectedIndex !== -1);
    check("seating", (field("seating") as HTMLSelectElement).selectedIndex !== -1);

    setInvalidFields(problems.map((problem) => problem.field));
    return problems;
  }, [field]);

  /** Bouwt de bevestiging op uit de huidige formulierwaarden. */
  const buildConfirmation = useCallback((): Confirmation => {
    const selectedLabel = (id: "guests" | "seating") =>
      (field(id) as HTMLSelectElement).selectedOptions[0]?.textContent ?? "";

    return {
      name: field("name").value,
      dateLabel: dateFormatter.format(new Date(`${field("date").value}T00:00:00`)),
      time: field("time").value,
      guestsLabel: selectedLabel("guests"),
      seatingLabel: selectedLabel("seating"),
    };
  }, [field]);

  /** De WebMCP-tool gebruikt dezelfde DOM en validatie als de bezoeker. Hij
      vult de aanvraag in, maar verstuurt hem bewust niet: de bezoeker houdt
      de laatste klik op "Reservering aanvragen" zelf. */
  const prepareReservation = useCallback(
    (input: ReservationInput) => {
      if (!formRef.current) {
        return { status: "error", message: "Het reserveringsformulier is nog niet beschikbaar." };
      }

      const values: Record<FormFieldName, string> = {
        name: typeof input.name === "string" ? input.name.trim() : "",
        phone: typeof input.phone === "string" ? input.phone.trim() : "",
        date: typeof input.date === "string" ? input.date : "",
        time: typeof input.time === "string" ? input.time : "",
        guests: String(input.guests ?? ""),
        seating: typeof input.seating === "string" ? input.seating : "",
        requests: typeof input.requests === "string" ? input.requests.trim() : "",
      };

      for (const [name, value] of Object.entries(values) as [FormFieldName, string][]) {
        const element = field(name);
        element.value = value;
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
      }

      const problems = validate();
      if (problems.length > 0) {
        return { status: "error", errors: problems };
      }

      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      formRef.current.querySelector<HTMLButtonElement>("#submitBtn")?.focus();

      return {
        status: "ready_for_confirmation",
        message:
          "De reserveringsaanvraag is ingevuld en gevalideerd. De bezoeker moet nog op Reservering aanvragen klikken.",
        reservation: {
          name: values.name,
          phone: values.phone,
          date: values.date,
          time: values.time,
          guests: input.guests,
          seating: values.seating,
          requests: values.requests || null,
        },
      };
    },
    [field, validate]
  );

  useEffect(() => {
    if (!modelContext) return;

    const controller = new AbortController();
    const tool: WebMcpToolDefinition = {
      name: TOOL_NAME,
      description:
        "Vult een reserveringsaanvraag bij Le Prikkel Bistro in en valideert alle gegevens. " +
        "De aanvraag wordt nog niet verstuurd: de bezoeker controleert hem en klikt zelf op Reservering aanvragen.",
      inputSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 2,
            description: "Volledige naam van de gast.",
          },
          phone: {
            type: "string",
            description: "Telefoonnummer van de gast, met minimaal 10 cijfers.",
          },
          date: {
            type: "string",
            pattern: "^\\d{4}-\\d{2}-\\d{2}$",
            description: "Datum in YYYY-MM-DD-formaat; vandaag of later.",
          },
          time: {
            type: "string",
            pattern: "^([01]\\d|2[0-3]):[0-5]\\d$",
            description: "Tijd in 24-uursnotatie HH:MM.",
          },
          guests: {
            type: "integer",
            minimum: 1,
            maximum: 6,
            description: "Aantal gasten; 6 betekent zes personen of meer.",
          },
          seating: {
            type: "string",
            enum: ["restaurant", "terrace", "private", "bar"],
            description: "Gewenste plek: restaurant, terrace, private of bar.",
          },
          requests: {
            type: "string",
            maxLength: 1000,
            description: "Optionele bijzonderheden, zoals allergieën of een kinderstoel.",
          },
        },
        required: ["name", "phone", "date", "time", "guests", "seating"],
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
      execute: prepareReservation,
    };

    Promise.resolve(modelContext.registerTool(tool, { signal: controller.signal })).catch(() => {});
    return () => controller.abort();
  }, [modelContext, prepareReservation]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const problems = validate();
    if (problems.length) {
      return;
    }

    const details = buildConfirmation();
    setConfirmation(details);
    dialogRef.current?.showModal();

  };

  const closeDialog = () => {
    dialogRef.current?.close();
    formRef.current?.reset();
    setInvalidFields([]);
    setConfirmation(null);
  };

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
              >
                <option value="restaurant">Restaurantzaal</option>
                <option value="terrace">Terras (buiten)</option>
                <option value="private">Privéhoek</option>
                <option value="bar">Aan de bar</option>
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
