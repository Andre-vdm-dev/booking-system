export default function DatePicker({ value, min, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-medium tracking-[0.2em] text-stone-500 uppercase">
        Date
      </span>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className="w-full border-0 border-b border-stone-300 bg-transparent px-0 py-2 text-lg text-stone-900 focus:border-stone-900 focus:ring-0 focus:outline-none"
      />
    </label>
  );
}
