import { useState } from "react";
import { MovieBanner, MoviePoster, Person } from "@/assets/images";
import {
  Calendar,
  Clock,
  Film,
  Star,
  Ticket,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Avatar, AvatarImage, Button } from "@/components";
import { Link, useParams } from "react-router";

const movie = {
  title: "Zootopia 2",
  releaseDate: "5 December 2025",
  duration: "2h 30m",
  genre: "Fantasy",
  rating: "PG-13",
  poster: MoviePoster,
  backdrop: MovieBanner,
  description:
    "Months after the events that reshaped Zootopia, Officer Judy Hopps and Nick Wilde have settled into an uneasy partnership. When a string of disappearances and a shadowy syndicate begin to unsettle the city, Judy and Nick must navigate old rivalries, new alliances, and a metropolis still learning to trust across species lines. As secrets surface and the stakes escalate, the pair uncover a conspiracy that could change Zootopia forever—if they can't outsmart the past.",
};

const actors = [
  { name: "Derry R.", image: Person },
  { name: "Rendi F.", image: Person },
  { name: "Heinrich", image: Person },
];

const similarMovies = [
  { title: "Zootopia 2", rating: "4.5", image: MovieBanner },
  { title: "Zootopia 2", rating: "4.5", image: MovieBanner },
  { title: "Zootopia 2", rating: "4.5", image: MovieBanner },
  { title: "Zootopia 2", rating: "4.5", image: MovieBanner },
];

const MovieDetails = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [expanded, setExpanded] = useState(false);
  const isLong = movie.description.length > 220;

  const paragraphClass = expanded
    ? "text-base leading-relaxed text-slate-200 max-h-[1000px] transition-[max-height] duration-500 ease-in-out"
    : "text-base leading-relaxed text-slate-200 overflow-hidden line-clamp-3 max-h-[4.5rem] transition-[max-height] duration-300 ease-in-out";

  return (
    <div className="min-h-screen bg-[#030b1b] text-white">
      <section className="relative w-full min-h-[50vh]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${movie.backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030b1b]/40 to-[#030b1b]" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 sm:flex-row sm:items-start sm:px-10">
          <div className="shrink-0 w-80 overflow-hidden rounded-xl shadow-lg">
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <h1 className="text-4xl font-bold md:text-5xl">{movie.title}</h1>

            <div className="flex flex-col">
              <div className="relative max-w-2xl">
                <p className={paragraphClass}>{movie.description}</p>
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
                <Calendar className="h-4 w-4" /> {movie.releaseDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {movie.duration}
              </span>
              <span className="flex items-center gap-1">
                <Film className="h-4 w-4" /> {movie.genre}
              </span>
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {movie.rating}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <p className="text-sm font-semibold text-slate-100">Actors</p>
              <div className="flex items-center gap-4">
                {actors.slice(0, 4).map((actor) => (
                  <div
                    key={actor.name}
                    className="flex flex-col items-center gap-1 text-xs text-slate-300"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={actor.image} alt={actor.name} />
                    </Avatar>
                    <span>{actor.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link to={`/book/${movieId}`} className="mt-4">
              <Button className="flex items-center gap-2 px-12! py-3 shadow-neon">
                <Ticket className="h-4 w-4" /> Order Ticket
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="flex w-full flex-col gap-6 px-30 py-16">
        <section className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-white">Similar Movies</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similarMovies.map((movie) => (
              <article
                key={`${movie.title}-${movie.image}`}
                className="cursor-pointer flex flex-col gap-4 rounded-xl bg-card border border-border shadow-[0_20px_40px_rgba(2,6,23,0.65)]"
              >
                <div className="h-80 w-full overflow-hidden rounded-t-xl">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex mb-6 flex-col justify-between px-6 text-xl text-card-foreground">
                  <span>{movie.title}</span>
                  <span className="flex items-center text-lg text-primary">
                    <Star
                      className="inline-block mr-1 text-amber-500"
                      fill="currentColor"
                    />{" "}
                    {movie.rating}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;
