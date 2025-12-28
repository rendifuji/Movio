import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  formattedTime: string | null;
  className?: string;
}

export const CountdownTimer = ({
  formattedTime,
  className,
}: CountdownTimerProps) => {
  if (!formattedTime) return null;

  const [minutes] = formattedTime.split(":").map(Number);
  const isUrgent = minutes < 2;
  const isWarning = minutes < 5 && minutes >= 2;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
        isUrgent && "bg-red-500/20 text-red-400 animate-pulse",
        isWarning && "bg-amber-500/20 text-amber-400",
        !isUrgent && !isWarning && "bg-primary/20 text-primary",
        className
      )}
    >
      <Clock className="h-4 w-4" />
      <span>Time remaining: {formattedTime}</span>
    </div>
  );
};

export default CountdownTimer;
