import { useState } from "react";
import { MovieBanner } from "@/assets/images";
import { Button, CategoryPicker } from "@/components";
import { Link } from "react-router";
import { useMovies } from "@/hooks/movie";
import { formatDuration, formatGenre } from "@/lib/formatters";
import type { Movie, MovieGenre } from "@/types/movie";

const Home = () => {
  const [selectedGenre, setSelectedGenre] = useState<MovieGenre | null>(null);

  const { movies, isLoading } = useMovies({
    status: "NOW_SHOWING",
    ...(selectedGenre && { genre: selectedGenre }),
  });

  const featuredMovie: Movie | undefined = movies[0];

  return (
    <div className="w-full min-h-screen bg-[#030b1b] text-white">
      <section className="relative w-full min-h-[60vh] flex items-end justify-start">
        <div
          className="absolute inset-0"
          style={{
            ...(featuredMovie?.posterUrl
              ? { backgroundImage: `url(${featuredMovie.posterUrl})` }
              : { backgroundColor: "rgba(3,11,27,0.6)" }),
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030b1b]/30 to-[#030b1b]" />
        <div className="relative z-10 flex h-full max-w-6xl flex-col justify-between gap-6 py-10 sm:px-30">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 w-24 bg-slate-700 rounded mb-3" />
              <div className="h-12 w-64 bg-slate-700 rounded mb-2" />
              <div className="h-6 w-96 bg-slate-700 rounded" />
            </div>
          ) : featuredMovie ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-blue-300">
                  Now Showing
                </p>
                <h1 className="mt-3 text-4xl font-bold md:text-5xl">
                  {featuredMovie.title}
                </h1>
                <p
                  className="mt-2 max-w-3xl text-lg text-slate-100"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {featuredMovie.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
                {[
                  formatDuration(featuredMovie.durationMinutes),
                  formatGenre(featuredMovie.genre),
                  `${featuredMovie.rating}`,
                ].map((meta) => (
                  <span
                    key={meta}
                    className="rounded-full border border-white/30 px-3 py-1"
                  >
                    {meta}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/movie/${featuredMovie.movieId}`}
                  aria-label={`View details for ${featuredMovie.title}`}
                >
                  <Button className="rounded-md px-12 py-3 bg-transparent border border-primary! text-foreground hover:bg-muted">
                    View Details
                  </Button>
                </Link>
                <Link to={`/book/${featuredMovie.movieId}`}>
                  <Button className="w-fit px-12">Book Now</Button>
                </Link>
              </div>
            </>
          ) : (
            <div>
              <p className="text-lg text-slate-400">No movies available</p>
            </div>
          )}
        </div>
      </section>

      <div className="flex w-full flex-col gap-6 px-30 py-8">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-slate-100">
              Categories
            </h2>
            <p className="text-sm text-slate-400">Explore by genre</p>
          </div>
          <CategoryPicker
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-white">
            What&apos;s playing tonight
          </h3>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse flex flex-col gap-4 rounded-xl bg-card border border-border"
                >
                  <div className="h-80 w-full bg-slate-700 rounded-t-xl" />
                  <div className="px-6 mb-6">
                    <div className="h-6 w-3/4 bg-slate-700 rounded mb-2" />
                    <div className="h-5 w-1/4 bg-slate-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {movies.map((movie) => (
                <Link
                  key={movie.movieId}
                  to={`/movie/${movie.movieId}`}
                  className="cursor-pointer flex flex-col gap-4 rounded-xl bg-card border border-border shadow-[0_20px_40px_rgba(2,6,23,0.65)] transition hover:scale-[1.02]"
                >
                  <div className="h-80 w-full overflow-hidden rounded-t-xl">
                    <img
                      src={movie.posterUrl || MovieBanner}
                      alt={movie.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex mb-6 flex-col justify-between px-6 text-xl text-card-foreground">
                    <span>{movie.title}</span>
                    <span className="flex items-center text-lg text-primary">
                      {movie.rating}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No movies currently showing</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
