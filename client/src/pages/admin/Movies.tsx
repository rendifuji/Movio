import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ListFilter,
  Search,
} from "lucide-react";
import { MoviePoster } from "@/assets/images";
import {
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Label,
  Slider,
} from "@/components";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddMovieModal } from "@/components/admin";

type MovieStatus = "Now Showing" | "Coming Soon" | "End";

type Movie = {
  id: string;
  title: string;
  poster: string;
  genres: string[];
  duration: string;
  status: MovieStatus;
  rating: number;
};

const movies: Movie[] = [
  {
    id: "1",
    title: "Zootopia 2",
    poster: MoviePoster,
    genres: ["Fantasy", "Adventure", "Animation"],
    duration: "2h 15m",
    status: "Now Showing",
    rating: 9.2,
  },
  {
    id: "2",
    title: "Dune: Part Two",
    poster: MoviePoster,
    genres: ["Sci-Fi", "Action", "Adventure"],
    duration: "2h 46m",
    status: "Now Showing",
    rating: 8.9,
  },
  {
    id: "3",
    title: "Oppenheimer",
    poster: MoviePoster,
    genres: ["Drama", "History", "Biography"],
    duration: "3h 0m",
    status: "End",
    rating: 8.7,
  },
  {
    id: "4",
    title: "The Grand Budapest Hotel",
    poster: MoviePoster,
    genres: ["Comedy", "Drama"],
    duration: "1h 39m",
    status: "End",
    rating: 8.1,
  },
  {
    id: "5",
    title: "Interstellar",
    poster: MoviePoster,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    duration: "2h 49m",
    status: "Now Showing",
    rating: 8.6,
  },
  {
    id: "6",
    title: "Avengers: Endgame",
    poster: MoviePoster,
    genres: ["Action", "Adventure", "Sci-Fi"],
    duration: "3h 1m",
    status: "End",
    rating: 8.4,
  },
  {
    id: "7",
    title: "Into the Spider-Verse",
    poster: MoviePoster,
    genres: ["Animation", "Action", "Adventure"],
    duration: "1h 57m",
    status: "Now Showing",
    rating: 8.4,
  },
  {
    id: "8",
    title: "The Lighthouse",
    poster: MoviePoster,
    genres: ["Horror", "Drama", "Fantasy"],
    duration: "1h 49m",
    status: "Coming Soon",
    rating: 7.4,
  },
  {
    id: "9",
    title: "Moana 2",
    poster: MoviePoster,
    genres: ["Animation", "Adventure", "Comedy", "Family"],
    duration: "1h 40m",
    status: "Coming Soon",
    rating: 7.8,
  },
  {
    id: "10",
    title: "Wicked",
    poster: MoviePoster,
    genres: ["Fantasy", "Musical", "Romance"],
    duration: "2h 40m",
    status: "Coming Soon",
    rating: 8.0,
  },
];

const columnHelper = createColumnHelper<Movie>();

const GenreBadges = ({ genres }: { genres: string[] }) => {
  const maxVisible = 2;
  const visible = genres.slice(0, maxVisible);
  const hidden = genres.slice(maxVisible);

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((g) => (
        <Badge
          key={g}
          variant="outline"
          className="text-xs font-normal text-muted-foreground"
        >
          {g}
        </Badge>
      ))}
      {hidden.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="cursor-default text-xs font-normal text-muted-foreground"
              >
                {hidden.length} More...
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{hidden.join(", ")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: MovieStatus }) => {
  const styles: Record<MovieStatus, string> = {
    "Now Showing": "bg-green-600 text-white",
    "Coming Soon": "bg-amber-500 text-white",
    End: "bg-red-600 text-white",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const columns = [
  columnHelper.display({
    id: "movie",
    header: "Movie",
    cell: ({ row }) => {
      const movie = row.original;
      return (
        <div className="flex items-center gap-4">
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-16 w-12 rounded-md object-cover"
          />
          <div className="flex flex-col gap-1">
            <span className="font-medium">{movie.title}</span>
            <GenreBadges genres={movie.genres} />
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("duration", {
    header: "Duration",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("rating", {
    header: "Rating",
    cell: (info) => info.getValue().toFixed(1),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }),
];

const Movies = () => {
  const data = useMemo(() => movies, []);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterGenre, setFilterGenre] = useState<string>("");
  const [ratingRange, setRatingRange] = useState<number[]>([0, 10]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((m) => {
      const q = search.trim().toLowerCase();
      const searchOk = !q || m.title.toLowerCase().includes(q);
      const statusOk =
        !filterStatus ||
        filterStatus === "all" ||
        m.status.toLowerCase().replaceAll(" ", "-") === filterStatus;
      const genreOk =
        !filterGenre ||
        filterGenre === "all" ||
        m.genres.some((g) => g.toLowerCase() === filterGenre);
      const ratingOk = m.rating >= ratingRange[0] && m.rating <= ratingRange[1];

      return searchOk && statusOk && genreOk && ratingOk;
    });
  }, [data, search, filterStatus, filterGenre, ratingRange]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Movie Library</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex w-[260px] items-center gap-3 rounded-md border border-border bg-transparent px-4 py-3 text-sm text-muted-foreground">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              aria-label="Search movies"
              placeholder="Search movie"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border border-border py-3 h-auto! px-4 gap-16 cursor-pointer w-fit">
              <SelectValue placeholder="Sort By" />
              <ChevronDown className="size-4 ml-auto opacity-50" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
              <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
              <SelectItem value="duration-asc">Duration (Short)</SelectItem>
              <SelectItem value="duration-desc">Duration (Long)</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="px-4! gap-16 text-muted-foreground"
              >
                Filter
                <ListFilter className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="flex flex-col gap-4">
                <h4 className="font-medium">Filters</h4>

                <div className="flex flex-col gap-3">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full border border-border py-3 h-auto! px-4 gap-16 cursor-pointer">
                      <SelectValue placeholder="Select status" />
                      <ChevronDown className="size-4 ml-auto opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="now-showing">Now Showing</SelectItem>
                      <SelectItem value="coming-soon">Coming Soon</SelectItem>
                      <SelectItem value="end">End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Genre</Label>
                  <Select value={filterGenre} onValueChange={setFilterGenre}>
                    <SelectTrigger className="w-full border border-border py-3 h-auto! px-4 gap-16 cursor-pointer">
                      <SelectValue placeholder="Select genre" />
                      <ChevronDown className="size-4 ml-auto opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="animation">Animation</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="horror">Horror</SelectItem>
                      <SelectItem value="sci-fi">Sci-Fi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Rating Range</Label>
                  <Slider
                    value={ratingRange}
                    onValueChange={setRatingRange}
                    min={0}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{ratingRange[0].toFixed(1)}</span>
                    <span>{ratingRange[1].toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setFilterStatus("");
                      setFilterGenre("");
                      setRatingRange([0, 10]);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setFiltersOpen(false);
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          className="gap-2 px-10! py-3!"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus className="size-6" />
          Add Movie
        </Button>
      </div>

      <AddMovieModal open={addModalOpen} onOpenChange={setAddModalOpen} />

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left font-medium text -foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Movies;
