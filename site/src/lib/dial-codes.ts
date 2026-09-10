/**
 * Country dialling codes for the inquiry form.
 *
 * `digits` is the number of *national* digits a valid subscriber number has,
 * excluding the country code and any trunk prefix. It is what lets the form say
 * "a Ugandan number has 9 digits after +256" instead of accepting anything with
 * roughly the right shape.
 *
 * Uganda leads because that is where the building is; the rest follow the
 * markets the proposal names — East Africa and the main diaspora destinations —
 * then everything else alphabetically. Ranges cover countries with more than one
 * valid length.
 */

export interface DialCode {
  iso: string;
  name: string;
  dial: string;
  /** Valid national number lengths, excluding the dial code. */
  digits: readonly number[];
  /** Shown as the input placeholder — a real, correctly shaped example. */
  example: string;
}

export const DIAL_CODES: readonly DialCode[] = [
  { iso: "UG", name: "Uganda", dial: "+256", digits: [9], example: "772 123 456" },
  { iso: "KE", name: "Kenya", dial: "+254", digits: [9], example: "712 345 678" },
  { iso: "TZ", name: "Tanzania", dial: "+255", digits: [9], example: "712 345 678" },
  { iso: "RW", name: "Rwanda", dial: "+250", digits: [9], example: "788 123 456" },
  { iso: "BI", name: "Burundi", dial: "+257", digits: [8], example: "79 123 456" },
  { iso: "SS", name: "South Sudan", dial: "+211", digits: [9], example: "977 123 456" },
  { iso: "ET", name: "Ethiopia", dial: "+251", digits: [9], example: "911 234 567" },
  { iso: "GB", name: "United Kingdom", dial: "+44", digits: [10], example: "7400 123456" },
  { iso: "US", name: "United States", dial: "+1", digits: [10], example: "202 555 0143" },
  { iso: "CA", name: "Canada", dial: "+1", digits: [10], example: "416 555 0143" },
  { iso: "AE", name: "United Arab Emirates", dial: "+971", digits: [9], example: "50 123 4567" },
  { iso: "ZA", name: "South Africa", dial: "+27", digits: [9], example: "82 123 4567" },
  { iso: "NG", name: "Nigeria", dial: "+234", digits: [10], example: "802 123 4567" },
  { iso: "IN", name: "India", dial: "+91", digits: [10], example: "98765 43210" },
  { iso: "CN", name: "China", dial: "+86", digits: [11], example: "131 2345 6789" },
  { iso: "AU", name: "Australia", dial: "+61", digits: [9], example: "412 345 678" },
  { iso: "BE", name: "Belgium", dial: "+32", digits: [8, 9], example: "470 12 34 56" },
  { iso: "DE", name: "Germany", dial: "+49", digits: [10, 11], example: "1512 3456789" },
  { iso: "DK", name: "Denmark", dial: "+45", digits: [8], example: "32 12 34 56" },
  { iso: "EG", name: "Egypt", dial: "+20", digits: [10], example: "100 123 4567" },
  { iso: "ES", name: "Spain", dial: "+34", digits: [9], example: "612 34 56 78" },
  { iso: "FR", name: "France", dial: "+33", digits: [9], example: "6 12 34 56 78" },
  { iso: "IE", name: "Ireland", dial: "+353", digits: [9], example: "85 123 4567" },
  { iso: "IT", name: "Italy", dial: "+39", digits: [9, 10], example: "312 345 6789" },
  { iso: "NL", name: "Netherlands", dial: "+31", digits: [9], example: "6 12345678" },
  { iso: "NO", name: "Norway", dial: "+47", digits: [8], example: "406 12 345" },
  { iso: "QA", name: "Qatar", dial: "+974", digits: [8], example: "3312 3456" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966", digits: [9], example: "51 234 5678" },
  { iso: "SE", name: "Sweden", dial: "+46", digits: [7, 8, 9], example: "70 123 45 67" },
  { iso: "CH", name: "Switzerland", dial: "+41", digits: [9], example: "78 123 45 67" },
  { iso: "TR", name: "Turkey", dial: "+90", digits: [10], example: "532 123 4567" },
] as const;

export const DEFAULT_DIAL_ISO = "UG";

export function findDialCode(iso: string): DialCode | undefined {
  return DIAL_CODES.find((entry) => entry.iso === iso);
}

/**
 * Longest-match lookup of the country for an E.164 number.
 *
 * Longest first matters: `+1` would otherwise shadow nothing, but `+250`
 * (Rwanda) must not be matched by a hypothetical `+25`. Ambiguous codes such as
 * +1 resolve to whichever entry is listed first, which is only used to
 * pre-select the dropdown — the stored number is unaffected.
 */
export function dialCodeForNumber(e164: string): DialCode | undefined {
  const candidates = [...DIAL_CODES].sort(
    (a, b) => b.dial.length - a.dial.length,
  );
  return candidates.find((entry) => e164.startsWith(entry.dial));
}

export interface PhoneCheck {
  ok: boolean;
  /** Full E.164 number, digits only after the plus. */
  e164: string;
  error?: string;
}

/**
 * Validates a national number against its country's expected length.
 *
 * A leading trunk zero is dropped rather than rejected: people write their own
 * number the way they dial it at home ("0772…"), and refusing that is a worse
 * experience than understanding it.
 */
export function checkPhone(iso: string, national: string): PhoneCheck {
  const country = findDialCode(iso);
  if (!country) {
    return { ok: false, e164: "", error: "Choose a country code." };
  }

  const digits = national.replace(/\D/g, "").replace(/^0+/, "");

  if (!digits) {
    return { ok: false, e164: "", error: "Enter your phone number." };
  }

  const e164 = `${country.dial}${digits}`;

  if (!country.digits.includes(digits.length)) {
    const expected =
      country.digits.length === 1
        ? `${country.digits[0]} digits`
        : `${country.digits.slice(0, -1).join(", ")} or ${country.digits.at(-1)} digits`;
    return {
      ok: false,
      e164,
      error: `A ${country.name} number has ${expected} after ${country.dial}. You entered ${digits.length}.`,
    };
  }

  return { ok: true, e164 };
}

/** Splits a stored E.164 number back into a country and a national part. */
export function splitPhone(e164: string): { iso: string; national: string } {
  const country = dialCodeForNumber(e164);
  if (!country) return { iso: DEFAULT_DIAL_ISO, national: e164 };
  return { iso: country.iso, national: e164.slice(country.dial.length) };
}
