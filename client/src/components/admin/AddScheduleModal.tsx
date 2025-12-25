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

interface AddScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const movies = [
  "Avengers End Game",
  "Zootopia 2",
  "Dune: Part Two",
  "Oppenheimer",
  "Interstellar",
  "Into the Spider-Verse",
  "Moana 2",
  "Wicked",
];

const cinemas = [
  "Movio Kelapa Gading",
  "Movio Grand Indonesia",
  "Movio Central Park",
  "Movio Gandaria City",
  "Movio Pondok Indah",
  "Movio Senayan City",
];

const studios = ["1", "2", "3", "4", "5", "IMAX", "Dolby Atmos", "Premium"];

const AddScheduleModal = ({ open, onOpenChange }: AddScheduleModalProps) => {
  const [movie, setMovie] = useState("");
  const [cinema, setCinema] = useState("");
  const [studio, setStudio] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    console.log({
      movie,
      cinema,
      studio,
      date,
      time,
      price,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-6" showCloseButton>
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
                <Select value={movie} onValueChange={setMovie}>
                  <SelectTrigger className="w-full border border-border h-auto! py-3 px-4 gap-3 cursor-pointer">
                    <SelectValue placeholder="Avengers End Game" />
                    <ChevronDown className="size-4 ml-auto opacity-50" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies.map((m) => (
                      <SelectItem
                        key={m}
                        value={m.toLowerCase().replaceAll(" ", "-")}
                      >
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Cinema</Label>
                  <Select value={cinema} onValueChange={setCinema}>
                    <SelectTrigger className="w-full border border-border h-auto! py-3 px-4 gap-3 cursor-pointer">
                      <SelectValue placeholder="Movio Kelapa Gading" />
                      <ChevronDown className="size-4 ml-auto opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      {cinemas.map((c) => (
                        <SelectItem
                          key={c}
                          value={c.toLowerCase().replaceAll(" ", "-")}
                        >
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Studio</Label>
                  <Select value={studio} onValueChange={setStudio}>
                    <SelectTrigger className="w-full border border-border h-auto! py-3 px-4 gap-3 cursor-pointer">
                      <SelectValue placeholder="IMAX" />
                      <ChevronDown className="size-4 ml-auto opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      {studios.map((s) => (
                        <SelectItem key={s} value={s.toLowerCase()}>
                          {s}
                        </SelectItem>
                      ))}
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
                      const formatted = raw.replace(
                        /\B(?=(\d{3})+(?!\d))/g,
                        "."
                      );
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
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleModal;
