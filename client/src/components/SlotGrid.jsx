const styles = {
  available:
    "border-stone-200 bg-white text-stone-800 hover:border-stone-900 cursor-pointer",
  selected: "border-stone-900 bg-stone-900 text-white cursor-pointer",
  booked: "border-transparent bg-stone-100 text-stone-400 line-through cursor-not-allowed",
  past: "border-transparent bg-stone-50 text-stone-300 cursor-not-allowed",
};

export default function SlotGrid({ slots, loading, selectedTime, onSelect }) {
  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className="rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] ring-1 ring-stone-200/70">
      <div className="mb-6 flex items-baseline justify-between border-b border-stone-100 pb-4">
        <h2 className="font-serif text-3xl font-medium text-stone-900">Available hours</h2>
        {!loading && slots.length > 0 && (
          <span className="text-xs tracking-wide text-stone-500">
            {availableCount} of {slots.length} open
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-stone-500">Loading…</p>
      ) : slots.length === 0 ? (
        <p className="text-sm text-stone-500">No hours to show.</p>
      ) : (
        <>
          {availableCount === 0 && (
            <p className="mb-6 text-sm text-stone-500">
              This day is fully reserved. Please choose another date.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {slots.map((slot) => {
              const key =
                slot.time === selectedTime ? "selected" : slot.available ? "available" : slot.status;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => onSelect(slot.time)}
                  title={
                    slot.available
                      ? `Reserve ${slot.time}`
                      : slot.status === "booked"
                        ? "Already reserved"
                        : "This time has passed"
                  }
                  className={`rounded-full border px-4 py-3 text-sm font-medium tracking-wide transition duration-200 ${styles[key]}`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-8 flex flex-wrap gap-6 text-xs text-stone-500">
        <Legend className="border border-stone-300 bg-white" label="Available" />
        <Legend className="bg-stone-900" label="Selected" />
        <Legend className="bg-stone-200" label="Reserved" />
      </div>
    </div>
  );
}

function Legend({ className, label }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}
