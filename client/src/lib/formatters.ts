export const formatDuration = (minutes?: number) => {
  if (minutes === undefined || minutes === null) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
};

export const formatGenre = (genre?: string) => {
  if (!genre) return "";
  return genre
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(":", ".");
};

export const formatTimeRange = (
  startTimeStr?: string,
  durationMinutes?: number
) => {
  if (!startTimeStr || durationMinutes === undefined) return "";

  const start = new Date(startTimeStr);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  const format = (date: Date) =>
    date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(":", ".");

  return `${format(start)} - ${format(end)}`;
};

export const formatPrice = (amount: number = 0) => {
  return `Rp${amount.toLocaleString("id-ID")}`;
};

export const formatStatus = (status?: string) => {
  const map: Record<string, { label: string; style: string }> = {
    SUCCESS: { label: "Paid", style: "bg-green-600 text-white" },
    PENDING: { label: "Pending", style: "bg-amber-500 text-white" },
    FAILED: { label: "Failed", style: "bg-red-600 text-white" },
  };
  return (
    map[status ?? ""] || {
      label: status ?? "Unknown",
      style: "bg-gray-500 text-white",
    }
  );
};
