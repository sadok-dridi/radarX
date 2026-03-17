export function formatRelativeTime(input: string | Date | null | undefined) {
  if (!input) {
    return "Unknown";
  }

  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  const diffMs = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["week", 1000 * 60 * 60 * 24 * 7],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
  ];

  for (const [unit, unitMs] of units) {
    if (Math.abs(diffMs) >= unitMs) {
      return rtf.format(Math.round(diffMs / unitMs), unit);
    }
  }

  return rtf.format(Math.round(diffMs / 1000), "second");
}

export function formatDateTime(input: string | Date | null | undefined) {
  if (!input) {
    return "Unknown";
  }

  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
