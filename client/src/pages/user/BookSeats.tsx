import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Clock,
  Film,
  MapPin,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { MoviePoster } from "@/assets/images";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";

const movie = {
  title: "Zootopia 2",
  poster: MoviePoster,
  duration: "2h 30m",
  genre: "Fantasy",
  rating: "PG-13",
  description:
    "Now working together as established detectives, Judy and Nick face their most complex case yet when a mysterious reptile named Gary (a venomous viper) arrives in Zootopia",
};

const locations = [
  { id: "1", name: "Movio Central Park" },
  { id: "2", name: "Movio Grand Mall" },
  { id: "3", name: "Movio Riverside" },
];

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      day: d.getDate(),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      full: d.toISOString().split("T")[0],
    });
  }
  return dates;
};

const dates = generateDates();

const timeSlots = [
  "09.00 - 11.30",
  "11.45 - 14.15",
  "14.30 - 17.00",
  "17.15 - 19.45",
  "20.00 - 22.30",
  "22.45 - 01.15",
  "06.30 - 09.00",
];

const rows = ["A", "B", "C", "D", "E", "F"] as const;
const seatsPerRow = 20;
const TICKET_PRICE = 70000;

const soldSeats = new Set([
  "A-3",
  "A-4",
  "B-5",
  "B-6",
  "C-2",
  "D-10",
  "D-11",
  "E-12",
]);

const onHoldSeats = new Set(["D-12", "D-13", "E-10", "E-11"]);

const BookSeats = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const [selectedDate, setSelectedDate] = useState(dates[4].full);
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [selectedTime, setSelectedTime] = useState(timeSlots[2]);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [expandedOverview, setExpandedOverview] = useState(false);

  const isLong = movie.description.length > 50;

  const paragraphClass = expandedOverview
    ? "text-sm leading-relaxed text-muted-foreground max-h-[1000px] transition-[max-height] duration-300 ease-in-out"
    : "text-sm leading-relaxed text-muted-foreground overflow-hidden line-clamp-3 max-h-[4.5rem] transition-[max-height] duration-300 ease-in-out";

  const toggleSeat = (key: string) => {
    if (soldSeats.has(key) || onHoldSeats.has(key)) return;
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const total = selectedSeats.size * TICKET_PRICE;

  const getSeatClass = (key: string) => {
    if (soldSeats.has(key)) return "bg-[#1E293B] cursor-not-allowed";
    if (onHoldSeats.has(key)) return "bg-[#F59E0B] cursor-not-allowed";
    if (selectedSeats.has(key)) return "bg-[#3B82F6] cursor-pointer";
    return "bg-[#334155] hover:bg-slate-500 cursor-pointer";
  };

  return (
    <div className="flex bg-background text-foreground flex-1 min-w-0">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-6 border-r border-border bg-card px-6 py-8">
        <h1 className="text-2xl font-bold">Seat Booking</h1>

        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to movie list
        </Link>

        <div className="overflow-hidden rounded-xl">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-auto w-4/5 object-cover"
          />
        </div>

        {/* Movie Info */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">{movie.title}</h2>
          <div className="relative max-w-full">
            <p className={paragraphClass}>{movie.description}</p>
            {!expandedOverview && isLong && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent" />
            )}
          </div>

          {isLong && (
            <button
              type="button"
              onClick={() => setExpandedOverview((s) => !s)}
              className="cursor-pointer mt-1 flex items-center gap-1 text-sm font-semibold text-primary"
              aria-expanded={expandedOverview}
            >
              {expandedOverview ? "READ LESS" : "READ MORE"}
              {expandedOverview ? (
                <ChevronUp className="h-4 w-4 text-primary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-primary" />
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {movie.duration}
          </span>
          <span className="flex items-center gap-1">
            <Film className="h-4 w-4" /> {movie.genre}
          </span>
        </div>
        <span className="w-fit rounded-sm bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
          {movie.rating}
        </span>
      </aside>

      <main className="min-w-0 flex flex-1 flex-col gap-4 px-6 py-8 lg:px-12">
        <div className="w-full max-w-full flex gap-2 overflow-x-auto p-6 py-4 rounded-md bg-card border border-border">
          {dates.map((d) => {
            const isSelected = selectedDate === d.full;
            return (
              <button
                key={d.full}
                onClick={() => setSelectedDate(d.full)}
                className={`cursor-pointer flex shrink-0 flex-col items-center rounded-lg px-6 py-2 gap-0.5 text-sm transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted"
                }`}
              >
                <span
                  className={`text-sm leading-snug ${
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {d.month}
                </span>
                <span
                  className={`text-2xl leading-normal font-bold ${
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {d.day}
                </span>
                <span
                  className={`text-sm leading-snug ${
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {d.weekday}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-start gap-4">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="cursor-pointer px-4 py-4 gap-8 h-full! bg-card">
              <div className="flex flex-col gap-2 items-start text-left">
                <span className="text-base font-bold text-foreground">
                  Where?
                </span>
                <span className="flex items-center gap-1 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <SelectValue />
                </span>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-foreground" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2">
            {timeSlots.map((t, idx) => {
              const isSelected =
                selectedTime === t && idx === timeSlots.indexOf(selectedTime);
              const key = `${t}-${idx}`;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedTime(t)}
                  className={`cursor-pointer rounded-md border px-4 py-2 text-sm transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <div className="py-4 flex flex-col items-center bg-card border border-border rounded-md">
          <div className="relative -mr-8 mb-4 w-full max-w-4xl border border-border bg-muted py-2 text-center text-sm text-muted-foreground">
            <span className="relative z-10">Screen</span>

            <div className="pointer-events-none absolute -bottom-3 -left-7 size-10 bg-card border-t border-border rotate-62" />
            <div className="pointer-events-none absolute -bottom-3 -right-7 size-10 bg-card border-t border-border -rotate-62" />
          </div>

          <div className="flex flex-col gap-5">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-2">
                <span className="w-6 text-center text-sm font-semibold text-muted-foreground">
                  {row}
                </span>
                <div className="flex gap-2">
                  {Array.from({ length: seatsPerRow }, (_, i) => {
                    const col = i + 1;
                    const key = `${row}-${col}`;
                    const gapAfter = col === 4 || col === 16;
                    return (
                      <div key={key} className="flex items-center">
                        <button
                          onClick={() => toggleSeat(key)}
                          className={`size-8 rounded-sm text-xs transition-colors ${getSeatClass(
                            key
                          )}`}
                          aria-label={`Seat ${row}${col}`}
                        />
                        {gapAfter && <div className="w-12" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="w-6" />
            <div className="flex gap-2 text-xs text-muted-foreground">
              {Array.from({ length: seatsPerRow }, (_, i) => {
                const col = i + 1;
                const gapAfter = col === 4 || col === 16;
                return (
                  <div key={col} className="flex items-center">
                    <span className="flex size-8 items-center justify-center">
                      {col}
                    </span>
                    {gapAfter && <div className="w-12" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend + Checkout */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          {/* Legend */}
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm bg-slate-700" /> Available
            </span>
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm bg-slate-600" /> Sold
            </span>
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm bg-primary" /> Selected
            </span>
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm bg-amber-500" /> On Hold
            </span>
          </div>

          {/* Total + Checkout */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-lg font-bold">
                Total: Rp {total.toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedSeats.size} x Rp{TICKET_PRICE.toLocaleString("id-ID")}
              </span>
            </div>
            <Link to={`/checkout/${movieId}`}>
              <Button className="rounded-md px-12 py-3">Checkout</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookSeats;
