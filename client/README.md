# Full-Stack Booking & Reservation System

A booking and reservation app where users choose a resource and date, see the available time slots, book a slot with their name and email, and manage existing reservations.

Melsoft Academy – Software Developer – Working with APIs

## Tech Stack

| Part | Technology |
|---|---|
| Front-end | React (Vite) |
| Styling | Tailwind CSS |
| Back-end | Node.js / Express |
| Data storage | In-memory array |

## Features

- **Resource Selector** – choose between Table 5, Meeting Room A and Consultation
- **Date Picker** – select the date to book (past dates are blocked)
- **Availability View** – time slots shown as clickable buttons; booked and past slots are disabled
- **Booking Form** – pop-up form to enter name and email after choosing a slot
- **Reservation List** – shows bookings for the selected resource and date, with a cancel option
- **Validation** – on both the client and the server for names, emails, dates and times
- **Conflict detection** – the same resource cannot be booked twice at the same date and time

## Project Structure

```
booking-system/
├── client/                 React + Tailwind front-end
│   └── src/
│       ├── components/
│       │   ├── BookingForm.jsx
│       │   ├── DatePicker.jsx
│       │   ├── ReservationList.jsx
│       │   ├── ResourceSelector.jsx
│       │   └── SlotGrid.jsx
│       ├── api.js
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
└── server/                 Express API
    ├── data/
    │   └── store.js
    └── index.js
```

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/slots?resource=:resource&date=:date` | Returns the time slots for a resource and date, with their availability |
| POST | `/api/bookings` | Creates a new reservation after validation and conflict detection |
| GET | `/api/bookings/:date/:resource` | Returns all reservations for a date and resource |
| DELETE | `/api/bookings/:id` | Cancels a reservation by its ID |

### Example booking request

```json
POST /api/bookings
{
  "resource": "table-5",
  "date": "2026-10-27",
  "time": "10:00",
  "name": "Andre",
  "email": "andre@example.com"
}
```

### Response codes

| Code | Meaning |
|---|---|
| 201 | Booking created |
| 400 | Invalid input (missing fields, bad date or time format, invalid email, past time slot) |
| 404 | Resource or booking not found |
| 409 | Time slot already booked |

## Getting Started

### Requirements
- Node.js 18 or newer

### 1. Start the server
```bash
cd server
npm install
npm run dev
```
The API runs on http://localhost:4000

### 2. Start the client
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
The app runs on http://localhost:5173

Both must be running at the same time.

## Notes

- Bookings are stored in memory, so they are cleared whenever the server restarts.
- Time slots run from 09:00 to 17:00 in one-hour blocks.

## Author

Andre van der Merwe – [Andre-vdm-dev](https://github.com/Andre-vdm-dev)