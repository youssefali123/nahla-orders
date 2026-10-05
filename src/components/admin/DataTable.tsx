import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function SearchInput({ value, onChange, placeholder = "بحث..." }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative min-w-0 flex-1 sm:max-w-xs">
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 rounded-xl pr-10"
      />
    </div>
  );
}

export function StatusBadge({ active, activeLabel = "مفعل", inactiveLabel = "معطل" }: { active: boolean; activeLabel?: string; inactiveLabel?: string }) {
  return (
    <Badge variant={active ? "default" : "secondary"} className="gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-primary-foreground" : "bg-muted-foreground"}`} aria-hidden />
      {active ? activeLabel : inactiveLabel}
    </Badge>
  );
}

export type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

/** Desktop table + automatic mobile card fallback. */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  rowKey,
  renderMobileCard,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey?: (row: T) => string;
  renderMobileCard?: (row: T) => ReactNode;
  empty?: ReactNode;
}) {
  if (rows.length === 0 && empty) return <>{empty}</>;
  const keyOf = rowKey ?? ((row: T) => row.id);
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={`text-start ${col.className ?? ""}`}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={keyOf(row)}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={`text-start ${col.className ?? ""}`}>
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {renderMobileCard && (
        <div className="space-y-3 md:hidden">
          {rows.map((row) => (
            <div key={keyOf(row)} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              {renderMobileCard(row)}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-4" aria-busy="true" aria-label="جاري التحميل">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            {Array.from({ length: Math.max(cols - 2, 0) }).map((_, j) => (
              <Skeleton key={j} className="hidden h-8 w-20 sm:block" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-soft">
      <p className="text-4xl" aria-hidden>
        🐝
      </p>
      <p className="mt-3 font-extrabold">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = "حصل خطأ، حاول تاني.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-soft" role="alert">
      <p className="text-4xl" aria-hidden>
        🐝
      </p>
      <p className="mt-3 font-bold">{message}</p>
      {onRetry && (
        <Button type="button" onClick={onRetry} className="mt-4 h-12 rounded-xl px-6 font-bold">
          حاول تاني
        </Button>
      )}
    </div>
  );
}
