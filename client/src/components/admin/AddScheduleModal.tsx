import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components";
import { useMovies } from "@/hooks/movie/useMovies";
import { useCinemas } from "@/hooks/cinema/useCinemas";
import { useQuery } from "@tanstack/react-query";
import { studioService } from "@/services/studio";

interface AddScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    movieId: string;
    cinemaId: string;
    studioId: string;
    date: string;
    startTime: string;
    price: number;
  }) => void;
  isSubmitting: boolean;
}

interface FormContentProps {
  onSubmit: AddScheduleModalProps["onSubmit"];
  onCancel: () => void;
  isSubmitting: boolean;
}

const FormContent = ({
  onSubmit,
  onCancel,
  isSubmitting,
}: FormContentProps) => {
  const [movieId, setMovieId] = useState("");
  const [cinemaId, setCinemaId] = useState("");
  const [studioId, setStudioId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");

  const { movies, isLoading: moviesLoading } = useMovies({ limit: 100 });
  const { cinemas, isLoading: cinemasLoading } = useCinemas({ limit: 100 });

  const { data: studiosData, isLoading: studiosLoading } = useQuery({
    queryKey: ["studios", cinemaId],
    queryFn: () => studioService.getStudios({ cinemaId, limit: 100 }),
    enabled: !!cinemaId,
  });

  const studios = studiosData?.data?.data ?? [];

  const handleCinemaChange = (value: string) => {
    setCinemaId(value);
    setStudioId("");
  };

  const handleSubmit = () => {
    if (!movieId || !cinemaId || !studioId || !date || !time || !price) {
      return;
    }

    const priceNumber = parseInt(price.replace(/\./g, ""), 10);
    const startTime = `${date}T${time}:00.000Z`;

    onSubmit({
      movieId,
      cinemaId,
      studioId,
      date,
      startTime,
      price: priceNumber,
    });
  };

  const isFormValid = movieId && cinemaId && studioId && date && time && price;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Add New Schedule</DialogTitle>
      </DialogHeader>

      <div className="mt-4">
        <Card className="bg-transparent pt-0 border border-border">
          <CardHeader className="bg-card pt-4 pb-2 rounded-t-xl">
            <CardTitle className="text-base">Schedule Info</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Movie</Label>
              <Select value={movieId} onValueChange={setMovieId}>
                <SelectTrigger className="w-full border border-border h-auto! py-3 px-4 gap-3 cursor-pointer">
                  <SelectValue placeholder="Select a movie" />
                  <ChevronDown className="size-4 ml-auto opacity-50" />
                </SelectTrigger>
                <SelectContent>
                  {moviesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    movies.map((m) => (
                      <SelectItem key={m.movieId} value={m.movieId}>
                        {m.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Cinema</Label>
                <Select value={cinemaId} onValueChange={handleCinemaChange}>
                  <SelectTrigger className="w-full border border-border h-auto! py-3 px-4 gap-3 cursor-pointer">
                    <SelectValue placeholder="Select a cinema" />
                    <ChevronDown className="size-4 ml-auto opacity-50" />
                  </SelectTrigger>
                  <SelectContent>
                    {cinemasLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      cinemas.map((c) => (
                        <SelectItem key={c.cinemaId} value={c.cinemaId}>
                          {c.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Studio</Label>
                <Select
                  value={studioId}
                  onValueChange={setStudioId}
                  disabled={!cinemaId}
                >
                  <SelectTrigger className="w-full border border-border h-auto! py-3 px-4 gap-3 cursor-pointer">
                    <SelectValue
                      placeholder={
                        cinemaId ? "Select a studio" : "Select cinema first"
                      }
                    />
                    <ChevronDown className="size-4 ml-auto opacity-50" />
                  </SelectTrigger>
                  <SelectContent>
                    {studiosLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : studios.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No studios available
                      </SelectItem>
                    ) : (
                      studios.map((s) => (
                        <SelectItem key={s.studioId} value={s.studioId}>
                          {s.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="schedule-date">Date</Label>
                <div className="relative">
                  <Input
                    id="schedule-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="schedule-time">Start Time</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="schedule-price">Price</Label>
              <div className="relative max-w-[50%]">
                {price && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground pointer-events-none select-none">
                    Rp
                  </span>
                )}
                <Input
                  id="schedule-price"
                  inputMode="numeric"
                  placeholder="Rp 50.000"
                  value={price}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    setPrice(formatted);
                  }}
                  className={price ? "pl-9" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogFooter className="mt-6 flex gap-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Schedule"}
        </Button>
      </DialogFooter>
    </>
  );
};

const AddScheduleModal = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: AddScheduleModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-6" showCloseButton>
        {/* Key resets form state when modal opens */}
        {open && (
          <FormContent
            key="form"
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleModal;
