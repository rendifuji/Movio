/*
  Warnings:

  - Added the required column `genre` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MovieGenre" AS ENUM ('ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'ROMANCE', 'SCI_FI', 'THRILLER', 'ANIMATION', 'FANTASY', 'DOCUMENTARY');

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "genre" "MovieGenre" NOT NULL,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
