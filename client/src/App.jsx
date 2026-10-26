import { useCallback, useEffect, useState } from "react";
import * as api from "./api.js";
import ResourceSelector from "./components/ResourceSelector.jsx";
import DatePicker from "./components/DatePicker.jsx";
import SlotGrid from "./components/SlotGrid.jsx";
import BookingForm from "./components/BookingForm.jsx";
import ReservationList from "./components/ReservationList.jsx";

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function App() {
  const [resources, setResources] = useState([]);
  const [resource, setResource] = useState("");
  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api
      .getResources()
      .then((list) => {
        setResources(list);
        if (list.length) setResource(list[0].id);
      })
      .catch(() => setError("Can't reach the server. Is it running on port 4000?"));
  }, []);

  const refresh = useCallback(async () => {
    if (!resource || !date) return;
    setLoading(true);
    setError("");
    try {
      const [slotData, bookingData] = await Promise.all([
        api.getSlots(resource, date),
        api.getBookings(date, resource),
      ]);
      setSlots(slotData.slots);
      setBookings(bookingData);
    } catch (err) {
      setError(err.message);
      setSlots([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [resource, date]);

  useEffect(() => {
    setSelectedTime(null);
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  async function handleBook({ name, email }) {
    const booking = await api.createBooking({ resource, date, time: selectedTime, name, email });
    setSelectedTime(null);
    setNotice(`Your reservation at ${booking.time} is confirmed, ${booking.name}.`);
    await refresh();
  }

  async function handleCancel(id) {
    try {
      await api.cancelBooking(id);
      setNotice("The reservation has been cancelled.");
    } catch (err) {
      setError(err.message);
    }
    await refresh();
  }

  const resourceName = resources.find((r) => r.id === resource)?.name ?? "";

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl items-end justify-between px-6 py-10">
          <div>
            <p className="text-[11px] font-medium tracking-[0.25em] text-amber-700 uppercase">
              Reservations
            </p>
            <h1 className="mt-2 font-serif text-5xl font-medium text-stone-900">Reserve your time</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-500">
              Select a space and a date, choose an available hour, and we will hold it for you.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-3">
        <section className="space-y-8 lg:col-span-2">
          <div className="grid gap-6 rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] ring-1 ring-stone-200/70 sm:grid-cols-2">
            <ResourceSelector resources={resources} value={resource} onChange={setResource} />
            <DatePicker value={date} min={today()} onChange={setDate} />
          </div>

          {notice && (
            <div className="rounded-xl border border-stone-200 bg-white px-5 py-4 text-sm text-stone-700">
              <span className="mr-2 text-amber-700">✓</span>
              {notice}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50/60 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <SlotGrid
            slots={slots}
            loading={loading}
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
          />
        </section>

        <aside className="lg:col-span-1">
          <ReservationList
            bookings={bookings}
            resourceName={resourceName}
            date={date}
            onCancel={handleCancel}
          />
        </aside>
      </main>

      {selectedTime && (
        <BookingForm
          resourceName={resourceName}
          date={date}
          time={selectedTime}
          onSubmit={handleBook}
          onClose={() => setSelectedTime(null)}
        />
      )}
    </div>
  );
}
