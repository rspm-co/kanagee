export async function saveTicketInterest(endpoint, record, request = fetch) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await request(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(record),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Registration failed');
    const result = await response.json();
    if (result?.ok !== true) throw new Error('Registration not confirmed');
  } finally {
    clearTimeout(timeout);
  }
}
