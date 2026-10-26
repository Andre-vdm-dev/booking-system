import { useEffect, useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatDate(date) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookingForm({ resourceName, date, time, onSubmit, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function validate() {
    const next = {};
    if (name.trim().length < 2) next.name = "Please enter your name (at least 2 characters).";
    if (!emailPattern.test(email.trim())) next.email = "Please enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim() });
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] font-medium tracking-[0.25em] text-amber-700 uppercase">
          {resourceName}
        </p>
        <h2 className="mt-2 font-serif text-4xl font-medium text-stone-900">{time}</h2>
        <p className="mt-1 text-sm text-stone-500">{formatDate(date)}</p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          <Field label="Full name" error={errors.name}>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass(errors.name)}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(errors.email)}
            />
          </Field>

          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
          )}

          <div className="flex items-center justify-end gap-6 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-stone-500 hover:text-stone-900"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-stone-900 px-7 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-stone-700 disabled:opacity-60"
            >
              {submitting ? "Reserving…" : "Confirm reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-medium tracking-[0.2em] text-stone-500 uppercase">
        {label}
      </span>
      {children}
      {error && <span className="mt-2 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function inputClass(hasError) {
  return `w-full border-0 border-b bg-transparent px-0 py-2 text-base text-stone-900 focus:ring-0 focus:outline-none ${
    hasError ? "border-red-400" : "border-stone-300 focus:border-stone-900"
  }`;
}
