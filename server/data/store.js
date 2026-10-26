import { randomUUID } from "node:crypto";

export const resources = [
  { id: "table-5", name: "Table 5", type: "Table" },
  { id: "room-a", name: "Meeting Room A", type: "Room" },
  { id: "consultation", name: "Consultation", type: "Appointment Type" },
];

export const schedule = {
  openTime: "09:00",
  closeTime: "17:00",
  slotMinutes: 60,
};

export const bookings = [];

export function createBooking({ resource, date, time, name, email }) {
  const booking = {
    id: randomUUID(),
    resource,
    date,
    time,
    name,
    email,
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  return booking;
}