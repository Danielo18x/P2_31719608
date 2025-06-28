/*export function formatLocalizedDate(dateStr: string, locale: string): string {
    const date = new Date(dateStr);

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: locale === 'en' || locale === 'en-US',
    };

    return new Intl.DateTimeFormat(locale, options).format(date);
}*/

function fixUtcDateOnly(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // Evitas conversión UTC→local
}

export function formatLocalizedDate(dateStr: string, locale: string): string {
    const date = fixUtcDateOnly(dateStr);

    if (isNaN(date.getTime())) return 'Fecha inválida'; // Esto evita reventar

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    };

    return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatLocalizedDate2(dateStr: string, locale: string): string {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return 'Fecha inválida'; // Esto evita reventar

    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: locale === 'en' || locale === 'en-US',
    };

    return new Intl.DateTimeFormat(locale, options).format(date);
}





