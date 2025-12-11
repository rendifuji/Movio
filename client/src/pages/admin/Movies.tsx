import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { MoviePoster } from "@/assets/images";
import { Button, Badge } from "@/components";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    genres: ["Fantasy", "Adventure"],
    duration: "2h 15m",
    status: "Now Showing",
    rating: 9.2,
  },
  {
    id: "2",
    title: "Zootopia 2",
    poster: MoviePoster,
    genres: ["Fantasy", "Adventure", "Animation"],
    duration: "2h 15m",
    status: "Now Showing",
    rating: 9.2,
  },
  {
    id: "3",
    title: "Zootopia 2",
    poster: MoviePoster,
    genres: ["Fantasy", "Adventure", "Animation", "Comedy"],
    duration: "2h 15m",
    status: "Now Showing",
    rating: 9.2,
  },
  {
    id: "4",
    title: "Zootopia 2",
    poster: MoviePoster,
    genres: ["Fantasy", "Adventure", "Animation", "Comedy", "Family"],
    duration: "2h 15m",
    status: "Now Showing",
    rating: 9.2,
  },
  {
    id: "5",
    title: "Zootopia 2",
    poster: MoviePoster,
    genres: ["Fantasy", "Adventure", "Animation", "Comedy", "Family"],
    duration: "2h 15m",
    status: "Coming Soon",
    rating: 9.2,
  },
  {
    id: "6",
    title: "Zootopia 2",
    poster: MoviePoster,
    genres: ["Fantasy", "Adventure", "Animation", "Comedy", "Family"],
    duration: "2h 15m",
    status: "End",
    rating: 9.2,
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movie Library</h1>
        <Button className="gap-2 px-10! py-3!">
          <Plus className="size-6" />
          Add Movie
        </Button>
      </div>

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
