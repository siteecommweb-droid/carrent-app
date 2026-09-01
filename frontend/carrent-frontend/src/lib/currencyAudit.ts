export function logCurrencyChange(
  currency: string
) {
  try {
    const existing = JSON.parse(
      localStorage.getItem(
        "currency_audit_history"
      ) || "[]"
    );

    existing.push({
      currency,

      timestamp:
        new Date().toISOString(),

      timezone:
        Intl.DateTimeFormat()
          .resolvedOptions()
          .timeZone,

      locale:
        navigator.language,

      userAgent:
        navigator.userAgent,
    });

    localStorage.setItem(
      "currency_audit_history",
      JSON.stringify(existing)
    );
  } catch (err) {
    console.error(
      "Currency audit error:",
      err
    );
  }
}