export function convertCurrencyIfNeeded(
    amount: number,
    originalCurrency: 'USD' | 'VES',
    targetCurrency: 'USD' | 'VES'
    ): number {
    const tasaUsdVes = 100;

    if (originalCurrency === targetCurrency) return amount;

    if (originalCurrency === 'USD' && targetCurrency === 'VES') {
        return amount * tasaUsdVes;
    }

    if (originalCurrency === 'VES' && targetCurrency === 'USD') {
        return amount / tasaUsdVes;
    }

    return amount;
}

export function formatLocalizedCurrency(
    amount: number,
    locale: string,
    ): string {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}
