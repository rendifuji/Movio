import { cn } from "@/lib/utils";
import type { SeatStatusType } from "@/types/seat";

interface SeatGridProps {
  rows: string[];
  seatsPerRow: number;
  getSeatStatus: (seatLabel: string) => SeatStatusType;
  onSeatClick: (seatLabel: string) => void;
  isLocking?: boolean;
  disabled?: boolean;
}

const seatStatusStyles: Record<SeatStatusType, string> = {
  available: "bg-[#334155] hover:bg-slate-500 cursor-pointer",
  booked: "bg-[#1E293B] cursor-not-allowed opacity-50",
  locked: "bg-[#F59E0B] cursor-not-allowed",
  selected:
    "bg-[#3B82F6] cursor-pointer ring-2 ring-blue-400 ring-offset-1 ring-offset-background",
};

export const SeatGrid = ({
  rows,
  seatsPerRow,
  getSeatStatus,
  onSeatClick,
  isLocking = false,
  disabled = false,
}: SeatGridProps) => {
  const handleSeatClick = (seatLabel: string) => {
    if (disabled || isLocking) return;
    const status = getSeatStatus(seatLabel);
    if (status === "booked" || status === "locked") return;
    onSeatClick(seatLabel);
  };

  const getGapAfter = (col: number) => {
    if (seatsPerRow <= 10) return false;
    const leftGap = Math.floor(seatsPerRow * 0.2);
    const rightGap = Math.floor(seatsPerRow * 0.8);
    return col === leftGap || col === rightGap;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8 w-full max-w-4xl">
        <div className="border border-border bg-muted py-2 text-center text-sm text-muted-foreground">
          <span className="relative z-10">Screen</span>
        </div>
        <div className="pointer-events-none absolute -bottom-3 -left-7 size-10 bg-card border-t border-border rotate-[62deg]" />
        <div className="pointer-events-none absolute -bottom-3 -right-7 size-10 bg-card border-t border-border -rotate-[62deg]" />
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <span className="w-6 text-center text-sm font-semibold text-muted-foreground">
              {row}
            </span>

            <div className="flex gap-1.5">
              {Array.from({ length: seatsPerRow }, (_, i) => {
                const col = i + 1;
                const seatLabel = `${row}${col}`;
                const status = getSeatStatus(seatLabel);
                const gapAfter = getGapAfter(col);

                return (
                  <div key={seatLabel} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleSeatClick(seatLabel)}
                      disabled={
                        disabled ||
                        isLocking ||
                        status === "booked" ||
                        status === "locked"
                      }
                      className={cn(
                        "size-8 rounded-sm text-xs font-medium transition-all duration-200",
                        seatStatusStyles[status],
                        isLocking && "opacity-50 cursor-wait"
                      )}
                      aria-label={`Seat ${seatLabel} - ${status}`}
                      title={`${seatLabel} - ${status}`}
                    >
                      {col}
                    </button>
                    {gapAfter && <div className="w-8" />}
                  </div>
                );
              })}
            </div>

            <span className="w-6 text-center text-sm font-semibold text-muted-foreground">
              {row}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="w-6" />
        <div className="flex gap-1.5 text-xs text-muted-foreground">
          {Array.from({ length: seatsPerRow }, (_, i) => {
            const col = i + 1;
            const gapAfter = getGapAfter(col);
            return (
              <div key={col} className="flex items-center">
                <span className="flex size-8 items-center justify-center">
                  {col}
                </span>
                {gapAfter && <div className="w-8" />}
              </div>
            );
          })}
        </div>
        <span className="w-6" />
      </div>
    </div>
  );
};

export const SeatLegend = () => {
  const legends = [
    { color: "bg-[#334155]", label: "Available" },
    { color: "bg-[#1E293B] opacity-50", label: "Booked" },
    { color: "bg-[#3B82F6]", label: "Selected" },
    { color: "bg-[#F59E0B]", label: "Locked (Others)" },
  ];

  return (
    <div className="flex flex-wrap gap-6 text-sm">
      {legends.map(({ color, label }) => (
        <span key={label} className="flex items-center gap-2">
          <span className={cn("h-4 w-4 rounded-sm", color)} />
          {label}
        </span>
      ))}
    </div>
  );
};

export default SeatGrid;
