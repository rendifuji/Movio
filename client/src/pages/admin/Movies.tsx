import { useState } from "react";
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
import { AddMovieModal, EditMovieModal } from "@/components/admin";
import { useMovies } from "@/hooks/movie/useMovies";
import { useDeleteMovie } from "@/hooks/movie_admin";
import type { Movie, MovieStatus as ApiMovieStatus, MovieGenre } from "@/types/movie";

type DisplayStatus = "Now Showing" | "Coming Soon";

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const mapStatus = (status: ApiMovieStatus): DisplayStatus => {
  return status === "NOW_SHOWING" ? "Now Showing" : "Coming Soon";
};

const formatGenre = (genre: MovieGenre): string => {
  return genre
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
};

const columnHelper = createColumnHelper<Movie>();

const GenreBadge = ({ genre }: { genre: MovieGenre }) => {
  return (
    <Badge
      variant="outline"
      className="text-xs font-normal text-muted-foreground"
    >
      {formatGenre(genre)}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: DisplayStatus }) => {
  const styles: Record<DisplayStatus, string> = {
    "Now Showing": "bg-green-600 text-white",
    "Coming Soon": "bg-amber-500 text-white",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const createColumns = (onEdit: (movie: Movie) => void, onDelete: (id: string) => void) => [
  columnHelper.display({
    id: "movie",
    header: "Movie",
    cell: ({ row }) => {
      const movie = row.original;
      return (
        <div className="flex items-center gap-4">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-16 w-12 rounded-md object-cover"
          />
          <div className="flex flex-col gap-1">
            <span className="font-medium">{movie.title}</span>
            <GenreBadge genre={movie.genre} />
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("durationMinutes", {
    header: "Duration",
    cell: (info) => formatDuration(info.getValue()),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={mapStatus(info.getValue())} />,
  }),
  columnHelper.accessor("rating", {
    header: "Rating",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(row.original.movieId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }),
];

const Movies = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterGenre, setFilterGenre] = useState<string>("");
  const [ratingRange, setRatingRange] = useState<number[]>([0, 10]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Fetch movies from API with filters
  const { movies, isLoading, error } = useMovies({
    search: search || undefined,
    sortBy: sortBy || undefined,
    status: filterStatus && filterStatus !== "all"
      ? (filterStatus === "now-showing" ? "NOW_SHOWING" : "COMING_SOON")
      : undefined,
    genre: filterGenre && filterGenre !== "all"
      ? (filterGenre.toUpperCase().replace("-", "_") as MovieGenre)
      : undefined,
  });

  const deleteMutation = useDeleteMovie();

  const handleDelete = (movieId: string) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      deleteMutation.mutate(movieId);
    }
  };

  const handleEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setEditModalOpen(true);
  };

  const columns = createColumns(handleEdit, handleDelete);

  const table = useReactTable({
    data: movies,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Movie Library</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex w-65 items-center gap-3 rounded-md border border-border bg-transparent px-4 py-3 text-sm text-muted-foreground">
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
      <EditMovieModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
        movie={selectedMovie} 
      />

      {isLoading && <p className="text-muted-foreground">Loading movies...</p>}
      {error && <p className="text-destructive">Error loading movies</p>}

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left font-medium text-foreground"
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
