import { Button } from "@/components";
import type { MovieGenre } from "@/types/movie";

const genres: { label: string; value: MovieGenre | null }[] = [
  { label: "All", value: null },
  { label: "Action", value: "ACTION" },
  { label: "Comedy", value: "COMEDY" },
  { label: "Horror", value: "HORROR" },
  { label: "Romance", value: "ROMANCE" },
  { label: "Sci-Fi", value: "SCI_FI" },
  { label: "Thriller", value: "THRILLER" },
  { label: "Animation", value: "ANIMATION" },
];

interface CategoryPickerProps {
  selectedGenre: MovieGenre | null;
  onGenreChange: (genre: MovieGenre | null) => void;
}

const CategoryPicker = ({
  selectedGenre,
  onGenreChange,
}: CategoryPickerProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {genres.map((genre) => {
        const isSelected = genre.value === selectedGenre;

        return (
          <Button
            key={genre.label}
            type="button"
            onClick={() => onGenreChange(genre.value)}
            aria-pressed={isSelected}
            className={
              "rounded-full px-5 py-2 text-sm font-medium transition focus:outline-none " +
              (isSelected
                ? "bg-primary text-primary-foreground border border-transparent"
                : "bg-transparent border border-border text-white hover:border-white hover:bg-white/5")
            }
          >
            {genre.label}
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryPicker;
