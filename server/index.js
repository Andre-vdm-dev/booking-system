import express from "express";
import cors from "cors";
import { resources, schedule, bookings, createBooking } from "./data/store.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

function isValidTime(value) {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const toHHMM = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

function generateSlotTimes() {
  const times = [];
  const open = toMinutes(schedule.openTime);
  const close = toMinutes(schedule.closeTime);
  for (let t = open; t + schedule.slotMinutes <= close; t += schedule.slotMinutes) {
    times.push(toHHMM(t));
  }
  return times;
}

function todayString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

function isInPast(date, time) {
  const today = todayString();
  if (date < today) return true;
  if (date > today) return false;
  const now = new Date();
  return toMinutes(time) <= now.getHours() * 60 + now.getMinutes();
}

const findResource = (id) => resources.find((r) => r.id === id);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", bookings: bookings.length });
});

app.get("/api/resources", (req, res) => {
  res.json(resources);
});

app.get("/api/slots", (req, res) => {
  const { resource, date } = req.query;

  if (!resource || !date) {
    return res.status(400).json({ error: "Query parameters 'resource' and 'date' are required." });
  }
  if (!findResource(resource)) {
    return res.status(404).json({ error: `Resource '${resource}' does not exist.` });
  }
  if (!isValidDate(date)) {
    return res.status(400).json({ error: "Date must be a valid date in YYYY-MM-DD format." });
  }

  const booked = new Set(
    bookings.filter((b) => b.resource === resource && b.date === date).map((b) => b.time)
  );

  const slots = generateSlotTimes().map((time) => {
    let status = "available";
    if (booked.has(time)) status = "booked";
    else if (isInPast(date, time)) status = "past";
    return { time, available: status === "available", status };
  });

  res.json({ resource, date, slots });
});

app.post("/api/bookings", (req, res) => {
  const { resource, date, time } = req.body ?? {};
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";

  const errors = [];
  if (!findResource(resource)) errors.push("A valid resource is required.");
  if (!isValidDate(date)) errors.push("Date must be a valid date in YYYY-MM-DD format.");
  if (!isValidTime(time)) errors.push("Time must be in HH:mm format.");
  else if (!generateSlotTimes().includes(time)) errors.push("Time is not one of the available slots.");
  if (name.length < 2) errors.push("Name must be at least 2 characters.");
  if (!isValidEmail(email)) errors.push("A valid email address is required.");

  if (errors.length) return res.status(400).json({ error: errors.join(" "), errors });

  if (isInPast(date, time)) {
    return res.status(400).json({ error: "You cannot book a time slot in the past." });
  }

  const conflict = bookings.find(
    (b) => b.resource === resource && b.date === date && b.time === time
  );
  if (conflict) {
    return res
      .status(409)
      .json({ error: `${findResource(resource).name} is already booked at ${time} on ${date}.` });
  }

  const booking = createBooking({ resource, date, time, name, email });
  res.status(201).json(booking);
});

app.get("/api/bookings/:date/:resource", (req, res) => {
  const { date, resource } = req.params;

  if (!isValidDate(date)) {
    return res.status(400).json({ error: "Date must be a valid date in YYYY-MM-DD format." });
  }
  if (!findResource(resource)) {
    return res.status(404).json({ error: `Resource '${resource}' does not exist.` });
  }

  const result = bookings
    .filter((b) => b.date === date && b.resource === resource)
    .sort((a, b) => a.time.localeCompare(b.time));

  res.json(result);
});

app.delete("/api/bookings/:id", (req, res) => {
  const index = bookings.findIndex((b) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Booking not found." });
  }
  const [removed] = bookings.splice(index, 1);
  res.json({ message: "Booking cancelled.", booking: removed });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`Booking API running on http://localhost:${PORT}`);
});