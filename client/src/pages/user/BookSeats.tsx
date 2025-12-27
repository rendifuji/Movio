import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Clock,
  Film,
  MapPin,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  CountdownTimer,
} from "@/components";
import { useMovie } from "@/hooks/movie/useMovie";
import { useSchedules } from "@/hooks/schedule/useSchedules";
import { useSeats } from "@/hooks/seat/useSeats";
import { useCinemas } from "@/hooks/cinema/useCinemas";
import { useSeatLockContext } from "@/contexts";
import { formatDuration, formatGenre, formatTimeRange } from "@/lib/formatters";
import type { AuthUser } from "@/types/auth";

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
const TICKET_PRICE = 70000;

const getUser = (): AuthUser | null => {
  const stored = localStorage.getItem("authUser");
  return stored ? JSON.parse(stored) : null;
};

const BookSeats = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const user = getUser();
  const {
    lockData,
    isNavigatingToCheckout,
    setLockData,
    setNavigatingToCheckout,
  } = useSeatLockContext();

  const isReturningFromCheckout =
    isNavigatingToCheckout && lockData !== null && lockData.movieId === movieId;

  const initialDate = isReturningFromCheckout ? lockData.date : dates[0].full;

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
  const [expandedOverview, setExpandedOverview] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { movie, isLoading: movieLoading } = useMovie(movieId);
  const { cinemas: allCinemas, isLoading: cinemasLoading } = useCinemas({
    limit: 100,
  });
  const { schedules, isLoading: schedulesLoading } = useSchedules({
    movieId,
    date: selectedDate,
  });
  if (
    !initialized &&
    !schedulesLoading &&
    isReturningFromCheckout &&
    schedules.length > 0
  ) {
    const targetSchedule = schedules.find(
      (s) => s.scheduleId === lockData.scheduleId
    );
    if (targetSchedule) {
      setSelectedLocation(targetSchedule.cinemaId);
      setSelectedScheduleId(lockData.scheduleId);
    }
    setNavigatingToCheckout(false);
    setInitialized(true);
  }

  // Filter schedules by selected cinema
  const filteredSchedules = selectedLocation
    ? schedules.filter((s) => s.cinemaId === selectedLocation)
    : [];

  const currentScheduleId =
    selectedScheduleId &&
    filteredSchedules.some((s) => s.scheduleId === selectedScheduleId)
      ? selectedScheduleId
      : filteredSchedules[0]?.scheduleId ?? null;

  const {
    selectedSeats,
    totalSeats,
    isLoading: seatsLoading,
    isLocking,
    formattedCountdown,
    toggleSeat,
    getSeatStatus,
    getEarliestLockedAt,
  } = useSeats({
    scheduleId: currentScheduleId || "",
    userId: user?.id || "",
  });

  if (movieLoading || schedulesLoading || cinemasLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!movie) return <div>Movie not found</div>;

  const isLong = movie.description.length > 150;
  const paragraphClass = expandedOverview
    ? "text-sm leading-relaxed text-muted-foreground max-h-[1000px] transition-[max-height] duration-300 ease-in-out"
    : "text-sm leading-relaxed text-muted-foreground overflow-hidden line-clamp-3 max-h-[4.5rem] transition-[max-height] duration-300 ease-in-out";

  const total = selectedSeats.length * TICKET_PRICE;

  const getSeatClass = (status: string) => {
    if (status === "booked") return "bg-[#1E293B] cursor-not-allowed";
    if (status === "locked") return "bg-[#F59E0B] cursor-not-allowed";
    if (status === "selected") return "bg-[#3B82F6] cursor-pointer";
    return "bg-[#334155] hover:bg-slate-500 cursor-pointer";
  };

  const seatsPerRow = 20;
  const rowCount = Math.ceil((totalSeats || 0) / seatsPerRow);
  const rows = Array.from({ length: rowCount }, (_, i) =>
    String.fromCharCode(65 + i)
  );

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
            src={movie.posterUrl}
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
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-card to-transparent" />
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
            <Clock className="h-4 w-4" />{" "}
            {formatDuration(movie.durationMinutes)}
          </span>
          <span className="flex items-center gap-1">
            <Film className="h-4 w-4" /> {formatGenre(movie.genre)}
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
                onClick={() => {
                  setSelectedDate(d.full);
                  setSelectedScheduleId(null);
                }}
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
          <Select
            value={selectedLocation}
            onValueChange={(v) => {
              setSelectedLocation(v);
              setSelectedScheduleId(null);
            }}
          >
            <SelectTrigger className="cursor-pointer px-4 py-4 gap-8 h-full! bg-card">
              <div className="flex flex-col gap-2 items-start text-left">
                <span className="text-base font-bold text-foreground">
                  Where?
                </span>
                <span className="flex items-center gap-1 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <SelectValue placeholder="Select Cinema" />
                </span>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-foreground" />
            </SelectTrigger>
            <SelectContent>
              {allCinemas.map((loc) => (
                <SelectItem key={loc.cinemaId} value={loc.cinemaId}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2">
            {filteredSchedules.map((s) => {
              const isSelected = currentScheduleId === s.scheduleId;
              return (
                <button
                  key={s.scheduleId}
                  onClick={() => setSelectedScheduleId(s.scheduleId)}
                  className={`cursor-pointer rounded-md border px-4 py-2 text-sm transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  {formatTimeRange(s.startTime, movie.durationMinutes)}
                  {s.studioName && (
                    <span className="ml-2 text-xs opacity-70">
                      ({s.studioName})
                    </span>
                  )}
                </button>
              );
            })}
            {filteredSchedules.length === 0 && (
              <div className="text-sm text-muted-foreground py-2">
                No schedules available
              </div>
            )}
          </div>
        </div>

        {formattedCountdown && (
          <div className="flex justify-center">
            <CountdownTimer formattedTime={formattedCountdown} />
          </div>
        )}

        <div className="py-4 flex flex-col items-center bg-card border border-border rounded-md">
          <div className="relative -mr-8 mb-4 w-full max-w-4xl border border-border bg-muted py-2 text-center text-sm text-muted-foreground">
            <span className="relative z-10">Screen</span>

            <div className="pointer-events-none absolute -bottom-3 -left-7 size-10 bg-card border-t border-border rotate-62" />
            <div className="pointer-events-none absolute -bottom-3 -right-7 size-10 bg-card border-t border-border -rotate-62" />
          </div>

          {seatsLoading ? (
            <div className="py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
            </div>
          ) : currentScheduleId ? (
            <div className="flex flex-col gap-5">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-6 text-center text-sm font-semibold text-muted-foreground">
                    {row}
                  </span>
                  <div className="flex gap-2">
                    {Array.from({ length: seatsPerRow }, (_, i) => {
                      const col = i + 1;
                      const key = `${row}${col}`;
                      const gapAfter = col === 4 || col === 16;
                      const status = getSeatStatus(key);
                      return (
                        <div key={key} className="flex items-center">
                          <button
                            disabled={
                              isLocking ||
                              status === "booked" ||
                              status === "locked" ||
                              !user
                            }
                            onClick={() => toggleSeat(key)}
                            className={`size-8 rounded-sm text-xs transition-colors ${getSeatClass(
                              status
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
          ) : (
            <div className="py-12 text-muted-foreground">
              Please select a schedule
            </div>
          )}

          {currentScheduleId && (
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
          )}

          {!user && currentScheduleId && (
            <div className="mt-4 text-center text-amber-500 text-sm">
              Please{" "}
              <Link to="/login" className="underline">
                login
              </Link>{" "}
              to select seats
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm bg-slate-700" /> Available
            </span>
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm bg-[#1E293B]" /> Sold
            </span>
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm bg-[#3B82F6]" /> Selected
            </span>
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-sm bg-[#F59E0B]" /> On Hold
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-lg font-bold">
                Total: Rp {total.toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedSeats.length} x Rp{" "}
                {TICKET_PRICE.toLocaleString("id-ID")}
              </span>
            </div>
            <Button
              className="rounded-md px-12 py-3"
              disabled={selectedSeats.length === 0}
              onClick={() => {
                if (selectedSeats.length === 0 || !currentScheduleId) return;

                const currentSchedule = filteredSchedules.find(
                  (s) => s.scheduleId === currentScheduleId
                );
                const cinema = allCinemas.find(
                  (c) => c.cinemaId === selectedLocation
                );

                setLockData({
                  scheduleId: currentScheduleId,
                  movieId: movie.movieId,
                  movieTitle: movie.title,
                  moviePoster: movie.posterUrl,
                  movieDuration: movie.durationMinutes,
                  movieGenre: movie.genre,
                  movieRating: movie.rating,
                  cinemaName: cinema?.name || "",
                  studioName: currentSchedule?.studioName || "",
                  date: selectedDate,
                  startTime: currentSchedule?.startTime || "",
                  seats: selectedSeats,
                  lockedAt: getEarliestLockedAt() || Date.now(),
                  price: TICKET_PRICE,
                });

                setNavigatingToCheckout(true);
                navigate(`/checkout/${movieId}`);
              }}
            >
              Checkout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookSeats;
