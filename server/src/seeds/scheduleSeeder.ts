import { prisma } from "../lib/prisma.js";
import { MovieStatus } from "@prisma/client";

async function main() {
  console.log("Starting schedule seeding...");

  const movies = await prisma.movie.findMany({
    where: { status: MovieStatus.NOW_SHOWING },
  });

  if (movies.length === 0) {
    console.log(
      "No NOW_SHOWING movies found. Please run the main seeder first."
    );
    return;
  }

  const studios = await prisma.studio.findMany();
  if (studios.length === 0) {
    console.log("No studios found. Please run the main seeder first.");
    return;
  }

  const startDate = new Date("2025-12-27");
  const endDate = new Date("2026-01-31");

  const timeSlots = ["10:00", "13:00", "16:00", "19:00", "21:30"];
  const price = 70000;

  let createdCount = 0;

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    console.log(`Seeding for ${dateStr}...`);

    for (const studio of studios) {
      const movie = movies[Math.floor(Math.random() * movies.length)];
      if (!movie) continue;

      for (const slot of timeSlots) {
        const parts = slot.split(":").map(Number);
        const hours = parts[0];
        const minutes = parts[1];

        if (hours === undefined || minutes === undefined) continue;

        const startTime = new Date(d);
        startTime.setHours(hours, minutes, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + movie.durationMinutes);

        const existing = await prisma.schedule.findFirst({
          where: {
            studioId: studio.studioId,
            startTime: startTime,
          },
        });

        if (!existing) {
          await prisma.schedule.create({
            data: {
              movieId: movie.movieId,
              studioId: studio.studioId,
              date: new Date(dateStr || ""),
              startTime,
              endTime,
              price,
            },
          });
          createdCount++;
        }
      }
    }
  }

  console.log(`Seeding completed. Created ${createdCount} new schedules.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
