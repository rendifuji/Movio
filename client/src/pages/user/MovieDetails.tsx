import { useState } from "react";
import {
  Calendar,
  Clock,
  Film,
  Ticket,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components";
import { Link, useParams } from "react-router";
import { useMovie, useMovies } from "@/hooks/movie";

import { formatDuration, formatGenre, formatDate } from "@/lib/formatters";

const MovieDetails = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { movie, isLoading } = useMovie(movieId);
  const { movies: otherMovies } = useMovies({
    status: "NOW_SHOWING",
    limit: 4,
  });
  const [expanded, setExpanded] = useState(false);

  const filteredOtherMovies = otherMovies.filter((m) => m.movieId !== movieId);

  const description = movie?.description || "";
  const isLong = description.length > 220;

  const paragraphClass = expanded
    ? "text-base leading-relaxed text-slate-200 max-h-[1000px] transition-[max-height] duration-500 ease-in-out"
    : "text-base leading-relaxed text-slate-200 overflow-hidden line-clamp-3 max-h-[4.5rem] transition-[max-height] duration-300 ease-in-out";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030b1b] text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-64 bg-slate-700 rounded" />
          <div className="h-6 w-48 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#030b1b] text-white flex items-center justify-center">
        <p className="text-lg text-slate-400">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030b1b] text-white">
      <section className="relative w-full min-h-[50vh]">
        <div
          className="absolute inset-0"
          style={{
            ...(movie.posterUrl
              ? { backgroundImage: `url(${movie.posterUrl})` }
              : { backgroundColor: "rgba(3,11,27,0.6)" }),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030b1b]/40 to-[#030b1b]" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 sm:flex-row sm:items-center sm:px-10">
          <div className="shrink-0 w-80 overflow-hidden rounded-xl shadow-lg">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-700 flex items-center justify-center text-slate-400">
                No Poster
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <h1 className="text-4xl font-bold md:text-5xl">{movie.title}</h1>

            <div className="flex flex-col">
              <div className="relative max-w-2xl">
                <p className={paragraphClass}>{description}</p>
                {!expanded && isLong && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10" />
                )}
              </div>

              {isLong && (
                <button
                  type="button"
                  onClick={() => setExpanded((s) => !s)}
                  className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-foreground mt-2"
                  aria-expanded={expanded}
                >
                  {expanded ? "READ LESS" : "READ MORE"}
                  {expanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {formatDate(movie.releaseDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />{" "}
                {formatDuration(movie.durationMinutes)}
              </span>
              <span className="flex items-center gap-1">
                <Film className="h-4 w-4" /> {formatGenre(movie.genre)}
              </span>
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {movie.rating}
              </span>
            </div>

            <Link to={`/book/${movieId}`} className="mt-4">
              <Button className="flex items-center gap-2 px-12! py-3 shadow-neon">
                <Ticket className="h-4 w-4" /> Order Ticket
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {filteredOtherMovies.length > 0 && (
        <div className="flex w-full flex-col gap-6 px-30 py-16">
          <section className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-white">Other Movies</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredOtherMovies.slice(0, 4).map((m) => (
                <Link
                  key={m.movieId}
                  to={`/movie/${m.movieId}`}
                  className="cursor-pointer flex flex-col gap-4 rounded-xl bg-card border border-border shadow-[0_20px_40px_rgba(2,6,23,0.65)] transition hover:scale-[1.02]"
                >
                  <div className="h-80 w-full overflow-hidden rounded-t-xl">
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex mb-6 flex-col justify-between px-6 text-xl text-card-foreground">
                    <span>{m.title}</span>
                    <span className="flex items-center text-lg text-primary">
                      {m.rating}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
