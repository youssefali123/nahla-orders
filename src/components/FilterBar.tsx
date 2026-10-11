import type { DisplayFilter } from "@/lib/catalog";

/**
 * Horizontal chip bar for display filters. Starts with an "الكل" chip;
 * filters the already-loaded list client-side (zero reads per tap).
 */
export function FilterBar({
  filters,
  selected,
  onSelect,
}: {
  filters: DisplayFilter[];
  selected: string | null;
  onSelect: (filterId: string | null) => void;
}) {
  const chip = (isActive: boolean) =>
    `inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-all active:scale-95 ${
      isActive
        ? "bg-primary text-primary-foreground shadow-soft"
        : "border border-border bg-card text-foreground shadow-soft hover:border-primary"
    }`;

  return (
    <div
      role="group"
      aria-label="فلاتر العرض"
      className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-1"
    >
      <button type="button" onClick={() => onSelect(null)} aria-pressed={selected === null} className={chip(selected === null)}>
        الكل
      </button>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onSelect(filter.id)}
          aria-pressed={selected === filter.id}
          className={chip(selected === filter.id)}
        >
          {selected === filter.id && (
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
          )}
          {filter.name}
        </button>
      ))}
    </div>
  );
}
