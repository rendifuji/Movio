import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Clock,
  Film,
  Calendar,
  MapPin,
  Ticket,
} from "lucide-react";
import { Zootopia } from "@/assets/images";

//Hardcode
const mockCheckoutData = {
  movie: {
    id: "1",
    title: "Zootopia 2",
    poster: Zootopia,
    duration: "2h 30m",
    genre: "Fantasy",
    rating: "PG-13",
  },
  schedule: {
    date: "7 December 2025",
    time: "09:00",
    cinema: "Movio Central Park",
  },
  selectedSeats: ["D10", "D11", "D12"],
  pricePerSeat: 40000,
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
    .format(amount)
    .replace(",", ".");
};

const Checkout = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const { movie, schedule, selectedSeats, pricePerSeat } = mockCheckoutData;
  const totalPrice = selectedSeats.length * pricePerSeat;

  const handleCheckout = () => {
    console.log("Processing checkout for movie:", movieId);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <Button
          variant="ghost"
          size="icon"
          className="mb-8 rounded-lg border border-border/50 bg-card/50 "
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-5" />
        </Button>

        <Card className="mx-auto max-w-4xl border-border/40 bg-card/80 px-6 py-8 shadow-xl md:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            <div className="shrink-0">
              <div className="overflow-hidden rounded-3xl border border-white/5 shadow-lg">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-80 w-55 object-cover"
                />
              </div>

              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Calendar className="size-4" />
                  <span>
                    {schedule.date} | {schedule.time}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4" />
                  <span>{schedule.cinema}</span>
                </div>
              </div>
            </div>

            <div className="flex-1">

              <h1 className="mb-5 text-4xl font-semibold text-foreground">
                {movie.title}
              </h1>

              <div className="mb-7 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="size-4" />
                  <span>{movie.genre}</span>
                </div>
                <span className="rounded-md border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  {movie.rating}
                </span>
              </div>

              <div className="mb-4 text-sm text-muted-foreground">
                {selectedSeats.length} Seats - {selectedSeats.join(", ")}
              </div>

              <div className="mb-6 flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Price/Seat</span>
                <div className="flex-1 border-t border-dashed border-border/40" />
                <span className="font-medium text-foreground">
                  Rp{formatCurrency(pricePerSeat)}
                </span>
              </div>

              <div className="mb-6 h-px bg-border/30" />

              <div className="mb-10 flex items-start justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Ticket className="size-4 text-primary" />
                  <span>TOTAL</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold text-primary">
                    Rp{formatCurrency(totalPrice)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Tax Included
                  </span>
                </div>
              </div>

              <Button
                className="w-full rounded-lg py-5 text-base font-semibold md:ml-auto md:flex md:w-auto md:min-w-42.5"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
    </div>
  );
};

export default Checkout;
