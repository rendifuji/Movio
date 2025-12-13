import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Plus, Trash2, ChevronDown, ListFilter, Search } from "lucide-react";
import {
  Button,
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
import { AddScheduleModal } from "@/components/admin";

type Schedule = {
  id: string;
  startTime: string;
  endTime: string;
  movie: string;
  cinema: string;
  studio: string;
  price: number;
};

const schedules: Schedule[] = [
  {
    id: "1",
    startTime: "09:30",
    endTime: "11:45",
    movie: "Zootopia 2",
    cinema: "Central Park",
    studio: "Studio 1",
    price: 45000,
  },
  {
    id: "2",
    startTime: "10:15",
    endTime: "12:30",
    movie: "The Lighthouse",
    cinema: "Grand Indonesia",
    studio: "Studio 2",
    price: 60000,
  },
  {
    id: "3",
    startTime: "12:10",
    endTime: "14:25",
    movie: "Into the Spider-Verse",
    cinema: "Plaza Senayan",
    studio: "Studio 3",
    price: 55000,
  },
  {
    id: "4",
    startTime: "13:40",
    endTime: "16:10",
    movie: "Dune: Part Two",
    cinema: "Central Park",
    studio: "IMAX",
    price: 90000,
  },
  {
    id: "5",
    startTime: "14:30",
    endTime: "17:00",
    movie: "Zootopia 2",
    cinema: "Grand Indonesia",
    studio: "Studio 1",
    price: 50000,
  },
  {
    id: "6",
    startTime: "15:20",
    endTime: "17:35",
    movie: "Interstellar",
    cinema: "Plaza Senayan",
    studio: "Studio 2",
    price: 65000,
  },
  {
    id: "7",
    startTime: "17:10",
    endTime: "19:25",
    movie: "The Grand Budapest Hotel",
    cinema: "Central Park",
    studio: "Studio 3",
    price: 55000,
  },
  {
    id: "8",
    startTime: "18:00",
    endTime: "20:30",
    movie: "Avengers: Endgame",
    cinema: "Grand Indonesia",
    studio: "IMAX",
    price: 95000,
  },
  {
    id: "9",
    startTime: "19:40",
    endTime: "22:10",
    movie: "Oppenheimer",
    cinema: "Plaza Senayan",
    studio: "Studio 1",
    price: 80000,
  },
  {
    id: "10",
    startTime: "21:15",
    endTime: "23:30",
    movie: "Zootopia 2",
    cinema: "Central Park",
    studio: "Studio 2",
    price: 60000,
  },
];

const columnHelper = createColumnHelper<Schedule>();

const formatPrice = (price: number) => {
  return `Rp${price.toLocaleString("id-ID")}`;
};

const columns = [
  columnHelper.display({
    id: "time",
    header: "Time",
    cell: ({ row }) => {
      const schedule = row.original;
      return (
        <span>
          <span className="font-semibold">{schedule.startTime}</span>
          <span className="text-muted-foreground"> - {schedule.endTime}</span>
        </span>
      );
    },
  }),
  columnHelper.accessor("movie", {
    header: "Movie",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.display({
    id: "location",
    header: "Location",
    cell: ({ row }) => {
      const schedule = row.original;
      return (
        <span className="text-muted-foreground">
          {schedule.cinema} • {schedule.studio}
        </span>
      );
    },
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => formatPrice(info.getValue()),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    ),
  }),
];

const Schedules = () => {
  const data = useMemo(() => schedules, []);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterStudio, setFilterStudio] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter((s) => {
      const q = search.trim().toLowerCase();
      const searchOk = !q || s.movie.toLowerCase().includes(q);
      const locationKey = s.cinema.toLowerCase().replaceAll(" ", "-");
      const studioKey = s.studio.toLowerCase().replaceAll(" ", "-");

      const locationOk =
        !filterLocation ||
        filterLocation === "all" ||
        locationKey === filterLocation;
      const studioOk =
        !filterStudio || filterStudio === "all" || studioKey === filterStudio;
      const priceOk = s.price >= priceRange[0] && s.price <= priceRange[1];

      return searchOk && locationOk && studioOk && priceOk;
    });
  }, [data, search, filterLocation, filterStudio, priceRange]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Movie Schedules</h1>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex w-[260px] items-center gap-3 rounded-md border border-border bg-transparent px-4 py-3 text-sm text-muted-foreground">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              aria-label="Search schedules"
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
              <SelectItem value="time-asc">Time (Earliest)</SelectItem>
              <SelectItem value="time-desc">Time (Latest)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="movie">Movie Name</SelectItem>
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
                  <Label>Location</Label>
                  <Select
                    value={filterLocation}
                    onValueChange={setFilterLocation}
                  >
                    <SelectTrigger className="w-full border border-border py-3 h-auto! px-4 gap-16 cursor-pointer">
                      <SelectValue placeholder="Select location" />
                      <ChevronDown className="size-4 ml-auto opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="central-park">Central Park</SelectItem>
                      <SelectItem value="grand-indonesia">
                        Grand Indonesia
                      </SelectItem>
                      <SelectItem value="plaza-senayan">
                        Plaza Senayan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Studio</Label>
                  <Select value={filterStudio} onValueChange={setFilterStudio}>
                    <SelectTrigger className="w-full border border-border py-3 h-auto! px-4 gap-16 cursor-pointer">
                      <SelectValue placeholder="Select studio" />
                      <ChevronDown className="size-4 ml-auto opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Studios</SelectItem>
                      <SelectItem value="studio-1">Studio 1</SelectItem>
                      <SelectItem value="studio-2">Studio 2</SelectItem>
                      <SelectItem value="studio-3">Studio 3</SelectItem>
                      <SelectItem value="imax">IMAX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Price Range</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={200000}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setFilterLocation("");
                      setFilterStudio("");
                      setPriceRange([0, 100000]);
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
          Create Schedule
        </Button>
      </div>

      <AddScheduleModal open={addModalOpen} onOpenChange={setAddModalOpen} />

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

export default Schedules;
