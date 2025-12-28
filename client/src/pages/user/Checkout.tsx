import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Clock,
  Film,
  Calendar,
  MapPin,
  Ticket,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { CountdownTimer } from "@/components";
import { useSeatLockContext } from "@/contexts";
import { formatDuration, formatGenre, formatTimeRange } from "@/lib/formatters";
import { transactionService } from "@/services/transaction";
import { isAxiosError } from "axios";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    lockData,
    formattedCountdown,
    countdown,
    clearLocks,
    setNavigatingToCheckout,
  } = useSeatLockContext();

  const handleBack = () => {
    setNavigatingToCheckout(true);
    navigate(`/book/${lockData?.movieId}`, { replace: true });
  };

  const handleCheckout = async () => {
    if (!lockData || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await transactionService.checkout({
        scheduleId: lockData.scheduleId,
        seatLabels: lockData.seats,
      });

      if (response.data.success) {
        const ticketId = response.data.data.tickets[0]?.ticketId;
        await clearLocks();
        navigate(`/ticket/${ticketId}`, { replace: true });
      }
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to complete checkout. Please try again.");
      }
      setIsProcessing(false);
    }
  };

  if (!lockData) {
    navigate("/", { replace: true });
    return (
      <div className="w-full flex-1 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (countdown !== null && countdown <= 0) {
    navigate("/", { replace: true });
    return null;
  }

  const totalPrice = lockData.seats.length * lockData.price;
  const isExpiringSoon = countdown !== null && countdown < 60;

  return (
    <div className="w-full flex-1 bg-background px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg border border-border/50 bg-card/50"
            onClick={handleBack}
          >
            <ArrowLeft className="size-5" />
          </Button>

          {formattedCountdown && (
            <div
              className={`flex items-center gap-2 ${
                isExpiringSoon ? "text-red-500" : ""
              }`}
            >
              {isExpiringSoon && <AlertTriangle className="size-4" />}
              <CountdownTimer formattedTime={formattedCountdown} />
            </div>
          )}
        </div>

        <Card className="mx-auto max-w-4xl border-border/40 bg-card/80 px-6 py-8 shadow-xl md:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            <div className="shrink-0">
              <div className="overflow-hidden rounded-3xl border border-white/5 shadow-lg">
                <img
                  src={lockData.moviePoster}
                  alt={lockData.movieTitle}
                  className="h-80 w-[220px] object-cover"
                />
              </div>

              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Calendar className="size-4" />
                  <span>
                    {formatDate(lockData.date)} |{" "}
                    {formatTimeRange(
                      lockData.startTime,
                      lockData.movieDuration
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="size-4" />
                  <span>
                    {lockData.cinemaName} - {lockData.studioName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h1 className="mb-5 text-4xl font-semibold text-foreground">
                {lockData.movieTitle}
              </h1>

              <div className="mb-7 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{formatDuration(lockData.movieDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="size-4" />
                  <span>{formatGenre(lockData.movieGenre)}</span>
                </div>
                <span className="rounded-md border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  {lockData.movieRating}
                </span>
              </div>

              <div className="mb-4 text-sm text-muted-foreground">
                {lockData.seats.length} Seats -{" "}
                {lockData.seats.sort().join(", ")}
              </div>

              <div className="mb-6 flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Price/Seat</span>
                <div className="flex-1 border-t border-dashed border-border/40" />
                <span className="font-medium text-foreground">
                  Rp {formatCurrency(lockData.price)}
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
                    Rp {formatCurrency(totalPrice)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Tax Included
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  className="w-fit! rounded-lg py-2 px-6 text-base font-semibold"
                  onClick={handleCheckout}
                  disabled={isExpiringSoon || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Processing...
                    </>
                  ) : isExpiringSoon ? (
                    "Time Running Out"
                  ) : (
                    "Checkout"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {isExpiringSoon && (
          <div className="mt-4 text-center text-red-500 text-sm">
            <AlertTriangle className="inline size-4 mr-1" />
            Your reservation is about to expire! Please complete checkout or
            select seats again.
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
