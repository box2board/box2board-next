const TORONTO_TZ = 'America/Toronto';

export function getTorontoDateString(date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TORONTO_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

export function formatTorontoTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TORONTO_TZ,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatTorontoDateTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TORONTO_TZ,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
