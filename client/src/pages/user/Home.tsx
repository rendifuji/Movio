import { MovieBanner } from "@/assets/images";
import { Star } from "lucide-react";
import { Button, CategoryPicker } from "@/components";
import { Link } from "react-router";

const featuredMovie = {
  title: "Zootopia 2",
  badge: "Now Showing",
  duration: "2h 04m",
  genre: "Fantasy",
  rating: "PG-13",
  image: MovieBanner,
};

const nowShowing = [
  {
    title: "Now You See Me",
    rating: "4.5",
    image: MovieBanner,
  },
  {
    title: "Zootopia 2",
    rating: "4.5",
    image: MovieBanner,
  },
  {
    title: "Now You See Me",
    rating: "4.5",
    image: MovieBanner,
  },
  {
    title: "Zootopia 2",
    rating: "4.5",
    image: MovieBanner,
  },
  {
    title: "Now You See Me",
    rating: "4.5",
    image: MovieBanner,
  },
  {
    title: "Zootopia 2",
    rating: "4.5",
    image: MovieBanner,
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-[#030b1b] text-white">
      <section className="relative w-full min-h-[60vh] flex items-end justify-start">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${featuredMovie.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#030b1b]/30 to-[#030b1b]" />
        <div className="relative z-10 flex h-full max-w-6xl flex-col justify-between gap-6 py-10 sm:px-30">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-blue-300">
              {featuredMovie.badge}
            </p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              {featuredMovie.title}
            </h1>
            <p className="mt-2 max-w-3xl text-lg text-slate-100">
              The city is buzzing with new stories. Join Judy &amp; Nick in
              their newest adventure full of mystery, laughs, and heart.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
            {[
              featuredMovie.duration,
              featuredMovie.genre,
              featuredMovie.rating,
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
              to="/movie/2"
              aria-label={`View details for ${featuredMovie.title}`}
            >
              <Button className="rounded-md px-12 py-3 bg-transparent border border-primary! text-foreground hover:bg-muted">
                View Details
              </Button>
            </Link>
            <Button className="w-fit px-12">Book Now</Button>
          </div>
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
          <CategoryPicker />
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-white">
            What&apos;s playing tonight
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {nowShowing.map((movie) => (
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

export default Home;
