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
import { AddScheduleModal, DeleteScheduleModal } from "@/components/admin";
import {
  useAdminSchedules,
  useCreateSchedule,
  useDeleteSchedule,
} from "@/hooks/schedule";
import { useCinemas } from "@/hooks/cinema/useCinemas";
import { formatDate, formatTime } from "@/lib/formatters";
import type { Schedule } from "@/types/schedule";

const formatPrice = (price: number) => {
  return `Rp${price.toLocaleString("id-ID")}`;
};

const Schedules = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("time-asc");
  const [filterCinema, setFilterCinema] = useState<string>("");
  const [filterStudio, setFilterStudio] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const { schedules, isLoading } = useAdminSchedules({
    search: search || undefined,
    sortBy: sortBy || undefined,
    cinemaName:
      filterCinema && filterCinema !== "all" ? filterCinema : undefined,
    studioName:
      filterStudio && filterStudio !== "all" ? filterStudio : undefined,
    date: today, 
  });

  const { cinemas } = useCinemas({ limit: 100 });
  const createSchedule = useCreateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      return s.price >= priceRange[0] && s.price <= priceRange[1];
    });
  }, [schedules, priceRange]);

  const uniqueStudios = useMemo(() => {
    const studios = new Set<string>();
    schedules.forEach((s) => {
      if (s.studioName) {
        studios.add(s.studioName);
      }
    });
    return Array.from(studios).sort();
  }, [schedules]);

  const columnHelper = createColumnHelper<Schedule>();

  const columns = [
    columnHelper.display({
      id: "date",
      header: "Date",
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <span className="text-muted-foreground">
            {formatDate(schedule.date)}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "time",
      header: "Time",
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <span>
            <span className="font-semibold">
              {formatTime(schedule.startTime)}
            </span>
            {schedule.endTime && (
              <span className="text-muted-foreground">
                {" "}
                - {formatTime(schedule.endTime)}
              </span>
            )}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "movie",
      header: "Movie",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.movieTitle || "—"}</span>
      ),
    }),
    columnHelper.display({
      id: "location",
      header: "Location",
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <span className="text-muted-foreground">
            {schedule.cinemaName} • {schedule.studioName}
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
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => {
            setScheduleToDelete(row.original);
            setDeleteModalOpen(true);
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredSchedules,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleCreateSchedule = async (data: {
    movieId: string;
    cinemaId: string;
    studioId: string;
    date: string;
    startTime: string;
    price: number;
  }) => {
    try {
      await createSchedule.mutateAsync(data);
      setAddModalOpen(false);
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return;
    try {
      await deleteSchedule.mutateAsync(scheduleToDelete.scheduleId);
      setDeleteModalOpen(false);
      setScheduleToDelete(null);
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

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
              <SelectItem value="date-asc">Date (Earliest)</SelectItem>
              <SelectItem value="date-desc">Date (Latest)</SelectItem>
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
                  <Label>Cinema</Label>
                  <Select value={filterCinema} onValueChange={setFilterCinema}>
                    <SelectTrigger className="w-full border border-border py-3 h-auto! px-4 gap-16 cursor-pointer">
                      <SelectValue placeholder="Select cinema" />
                      <ChevronDown className="size-4 ml-auto opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cinemas</SelectItem>
                      {cinemas.map((c) => (
                        <SelectItem key={c.cinemaId} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
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
                      {uniqueStudios.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
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
                      setFilterCinema("");
                      setFilterStudio("");
                      setPriceRange([0, 200000]);
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

      <AddScheduleModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleCreateSchedule}
        isSubmitting={createSchedule.isPending}
      />

      <DeleteScheduleModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteSchedule}
        isDeleting={deleteSchedule.isPending}
        scheduleName={
          scheduleToDelete
            ? `${scheduleToDelete.movieTitle || "Unknown"} - ${formatDate(
                scheduleToDelete.date
              )} ${formatTime(scheduleToDelete.startTime)}`
            : ""
        }
      />

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
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  Loading schedules...
                </td>
              </tr>
            ) : filteredSchedules.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No schedules found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedules;
