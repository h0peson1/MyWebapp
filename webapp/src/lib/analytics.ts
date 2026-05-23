export async function trackEvent(name: string, metadata?: Record<string, unknown>) {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, metadata }),
    });
  } catch {
    // Swallow analytics transport errors to avoid impacting UX.
  }
}
