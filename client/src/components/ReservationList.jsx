import { useState } from "react";

export default function ReservationList({ bookings, resourceName, date, onCancel }) {
  const [cancellingId, setCancellingId] = useState(null);

  async function handleCancel(booking) {
    if (!window.confirm(`Cancel ${booking.name}'s reservation at ${booking.time}?`)) return;
    setCancellingId(booking.id);
    await onCancel(booking.id);
    setCancellingId(null);
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] ring-1 ring-stone-200/70">
      <h2 className="font-serif text-3xl font-medium text-stone-900">Reservations</h2>
      <p className="mt-1 mb-6 text-xs tracking-wide text-stone-500">
        {resourceName} · {date}
      </p>

      {bookings.length === 0 ? (
        <p className="border-t border-stone-100 pt-6 text-sm text-stone-500">
          No reservations for this day yet.
        </p>
      ) : (
        <ul className="divide-y divide-stone-100 border-t border-stone-100">
          {bookings.map((b) => (
            <li key={b.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="font-serif text-xl text-stone-900">{b.time}</p>
                <p className="truncate text-sm text-stone-700">{b.name}</p>
                <p className="truncate text-xs text-stone-500">{b.email}</p>
              </div>
              <button
                onClick={() => handleCancel(b)}
                disabled={cancellingId === b.id}
                className="shrink-0 text-xs font-medium tracking-wide text-stone-500 underline-offset-4 hover:text-red-700 hover:underline disabled:opacity-50"
              >
                {cancellingId === b.id ? "Cancelling…" : "Cancel"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
