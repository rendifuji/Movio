import { prisma } from "../lib/prisma.js";
import { UserRole, MovieStatus, MovieGenre } from "@prisma/client";
import bcrypt from "bcrypt";

// TMDB API Configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY || "YOUR_TMDB_API_KEY_HERE";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Map TMDB genre IDs to our MovieGenre enum
const genreMap: Record<number, MovieGenre> = {
	28: MovieGenre.ACTION, // Action
	12: MovieGenre.ACTION, // Adventure -> Action
	16: MovieGenre.ANIMATION, // Animation
	35: MovieGenre.COMEDY, // Comedy
	80: MovieGenre.THRILLER, // Crime -> Thriller
	99: MovieGenre.DOCUMENTARY, // Documentary
	18: MovieGenre.DRAMA, // Drama
	10751: MovieGenre.COMEDY, // Family -> Comedy
	14: MovieGenre.FANTASY, // Fantasy
	36: MovieGenre.DRAMA, // History -> Drama
	27: MovieGenre.HORROR, // Horror
	10402: MovieGenre.DRAMA, // Music -> Drama
	9648: MovieGenre.THRILLER, // Mystery -> Thriller
	10749: MovieGenre.ROMANCE, // Romance
	878: MovieGenre.SCI_FI, // Science Fiction
	10770: MovieGenre.DRAMA, // TV Movie -> Drama
	53: MovieGenre.THRILLER, // Thriller
	10752: MovieGenre.ACTION, // War -> Action
	37: MovieGenre.ACTION, // Western -> Action
};

// Rating mapping based on vote_average
function mapRating(voteAverage: number): string {
	if (voteAverage >= 8) return "PG-13";
	if (voteAverage >= 7) return "PG-13";
	if (voteAverage >= 6) return "PG";
	if (voteAverage >= 5) return "PG";
	return "G";
}

// Fetch movies from TMDB API
async function fetchTMDBMovies(endpoint: string, pages: number = 2) {
	const allMovies: any[] = [];

	for (let page = 1; page <= pages; page++) {
		try {
			const response = await fetch(
				`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
			);
			const data = await response.json();
			if (data.results) {
				allMovies.push(...data.results);
			}
		} catch (error) {
			console.error(`Error fetching page ${page}:`, error);
		}
	}

	return allMovies;
}

// Fetch movie details including runtime
async function fetchMovieDetails(movieId: number) {
	try {
		const response = await fetch(
			`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
		);
		return await response.json();
	} catch (error) {
		console.error(`Error fetching movie details for ${movieId}:`, error);
		return null;
	}
}

async function main() {
	console.log("Starting seeding with TMDB data...");
	console.log("Clearing existing data...");
	await prisma.studio.deleteMany();
	await prisma.cinema.deleteMany();
	await prisma.movie.deleteMany();

	// Seed Cinemas
	console.log("Seeding cinemas...");
	const cinemas = await Promise.all([
		prisma.cinema.create({
			data: { name: "CGV Grand Indonesia", city: "Jakarta" },
		}),
		prisma.cinema.create({
			data: { name: "CGV Pacific Place", city: "Jakarta" },
		}),
		prisma.cinema.create({
			data: { name: "XXI Plaza Senayan", city: "Jakarta" },
		}),
		prisma.cinema.create({
			data: { name: "CGV Paris Van Java", city: "Bandung" },
		}),
		prisma.cinema.create({
			data: { name: "XXI Trans Studio Mall", city: "Bandung" },
		}),
		prisma.cinema.create({
			data: { name: "CGV Tunjungan Plaza", city: "Surabaya" },
		}),
		prisma.cinema.create({
			data: { name: "XXI Pakuwon Mall", city: "Surabaya" },
		}),
		prisma.cinema.create({
			data: { name: "CGV Summarecon Mall", city: "Bekasi" },
		}),
	]);

	console.log(`Created ${cinemas.length} cinemas`);

	// Seed Studios
	console.log("Seeding studios...");
	const studios: any[] = [];

	for (const cinema of cinemas) {
		const studioCount = Math.floor(Math.random() * 3) + 4; // 4-6 studios per cinema
		for (let i = 1; i <= studioCount; i++) {
			const studio = await prisma.studio.create({
				data: {
					cinemaId: cinema.cinemaId,
					name: `Studio ${i}`,
					capacity: Math.floor(Math.random() * 100) + 80, // 80-180 seats
				},
			});
			studios.push(studio);
		}
	}

	console.log(`Created ${studios.length} studios`);

	// Fetch movies from TMDB
	console.log("Fetching movies from TMDB...");

	// Fetch now playing movies
	const nowPlayingMovies = await fetchTMDBMovies("/movie/now_playing", 2);
	console.log(`Fetched ${nowPlayingMovies.length} now playing movies`);

	// Fetch upcoming movies
	const upcomingMovies = await fetchTMDBMovies("/movie/upcoming", 2);
	console.log(`Fetched ${upcomingMovies.length} upcoming movies`);
	// Process and insert movies
	console.log("Processing and inserting movies...");
	const movies: any[] = [];

	// Process NOW_SHOWING movies (take first 15)
	for (const tmdbMovie of nowPlayingMovies.slice(0, 15)) {
		if (!tmdbMovie.poster_path || !tmdbMovie.overview) continue;

		const details = await fetchMovieDetails(tmdbMovie.id);
		const runtime = details?.runtime || 120;

		const genreId = tmdbMovie.genre_ids?.[0] || 28;
		const genre = genreMap[genreId] || MovieGenre.ACTION;

		try {
			const movie = await prisma.movie.create({
				data: {
					title: tmdbMovie.title,
					description:
						tmdbMovie.overview.length > 1000
							? tmdbMovie.overview.substring(0, 997) + "..."
							: tmdbMovie.overview,
					releaseDate: new Date(tmdbMovie.release_date),
					durationMinutes: runtime,
					genre: genre,
					posterUrl: `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}`,
					rating: mapRating(tmdbMovie.vote_average),
					status: MovieStatus.NOW_SHOWING,
				},
			});
			movies.push(movie);
		} catch (error) {
			console.error(`Error inserting movie ${tmdbMovie.title}:`, error);
		}

		// Add small delay to avoid rate limiting
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	// Process COMING_SOON movies (take first 10)
	for (const tmdbMovie of upcomingMovies.slice(0, 10)) {
		if (!tmdbMovie.poster_path || !tmdbMovie.overview) continue;

		// Check if movie already exists
		const existingMovie = movies.find((m) => m.title === tmdbMovie.title);
		if (existingMovie) continue;

		const details = await fetchMovieDetails(tmdbMovie.id);
		const runtime = details?.runtime || 120;

		const genreId = tmdbMovie.genre_ids?.[0] || 28;
		const genre = genreMap[genreId] || MovieGenre.ACTION;

		try {
			const movie = await prisma.movie.create({
				data: {
					title: tmdbMovie.title,
					description:
						tmdbMovie.overview.length > 1000
							? tmdbMovie.overview.substring(0, 997) + "..."
							: tmdbMovie.overview,
					releaseDate: new Date(tmdbMovie.release_date),
					durationMinutes: runtime,
					genre: genre,
					posterUrl: `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}`,
					rating: mapRating(tmdbMovie.vote_average),
					status: MovieStatus.COMING_SOON,
				},
			});
			movies.push(movie);
		} catch (error) {
			console.error(`Error inserting movie ${tmdbMovie.title}:`, error);
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
	}

    console.log(`Created ${movies.length} movies`);
    console.log("Seeding completed.");
}

main()
	.catch((e) => {
		console.error("Seeding failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
