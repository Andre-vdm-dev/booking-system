async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const getResources = () => request("/api/resources");

export const getSlots = (resource, date) =>
  request(`/api/slots?resource=${encodeURIComponent(resource)}&date=${encodeURIComponent(date)}`);

export const createBooking = (booking) =>
  request("/api/bookings", { method: "POST", body: JSON.stringify(booking) });

export const getBookings = (date, resource) =>
  request(`/api/bookings/${encodeURIComponent(date)}/${encodeURIComponent(resource)}`);

export const cancelBooking = (id) =>
  request(`/api/bookings/${encodeURIComponent(id)}`, { method: "DELETE" });
