import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { Plus, Upload, X, Calendar, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Textarea,
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
import { useAddMovie } from "@/hooks/movie_admin";
import type { MovieGenre, MovieStatus } from "@/types/movie";

type DisplayStatus = "Now Showing" | "Coming Soon";

interface AddMovieModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const genres: { label: string; value: MovieGenre }[] = [
  { label: "Action", value: "ACTION" },
  { label: "Animation", value: "ANIMATION" },
  { label: "Comedy", value: "COMEDY" },
  { label: "Drama", value: "DRAMA" },
  { label: "Fantasy", value: "FANTASY" },
  { label: "Horror", value: "HORROR" },
  { label: "Romance", value: "ROMANCE" },
  { label: "Sci-Fi", value: "SCI_FI" },
  { label: "Thriller", value: "THRILLER" },
  { label: "Documentary", value: "DOCUMENTARY" },
];

const statuses: { label: DisplayStatus; value: MovieStatus }[] = [
  { label: "Now Showing", value: "NOW_SHOWING" },
  { label: "Coming Soon", value: "COMING_SOON" },
];

const AddMovieModal = ({ open, onOpenChange }: AddMovieModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<MovieGenre | "">("");
  const [status, setStatus] = useState<MovieStatus | "">("");
  const [rating, setRating] = useState("");
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMovieMutation = useAddMovie();

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setReleaseDate("");
    setDuration("");
    setSelectedGenre("");
    setStatus("");
    setRating("");
    setPosterPreview(null);
    setPosterUrl("");
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        resetForm();
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetForm]
  );

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a .png or .jpg file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must not exceed 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPosterPreview(reader.result as string);
    reader.onerror = (err) => {
      console.error("FileReader error:", err);
      setPosterPreview(null);
      alert("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0] ?? null;
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      handleFile(file);
    },
    [handleFile]
  );

  const handleRemovePoster = useCallback(() => {
    setPosterPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !releaseDate || !duration || !selectedGenre || !status || !rating) {
      alert("Please fill in all required fields");
      return;
    }

    const finalPosterUrl = posterUrl;

    try {
      await addMovieMutation.mutateAsync({
        title,
        description,
        releaseDate: new Date(releaseDate).toISOString(),
        durationMinutes: parseInt(duration, 10),
        genre: selectedGenre,
        posterUrl: finalPosterUrl,
        rating,
        status,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add movie:", error);
      alert("Failed to add movie. Please try again.");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl p-6" showCloseButton>
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Movie</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 mt-4">
          <Card className="bg-transparent pt-0 border border-border rounded-md">
            <CardHeader className="bg-card pt-4 pb-2 rounded-t-md">
              <CardTitle className="text-base">General Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="movie-title">Movie Title</Label>
                <Input
                  id="movie-title"
                  placeholder="Avengers End Game"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="movie-desc">Description</Label>
                <Textarea
                  id="movie-desc"
                  placeholder="Avengers End Game adalah..."
                  className="min-h-[100px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="release-date">Release Date</Label>
                  <div className="relative">
                    <Input
                      id="release-date"
                      type="date"
                      placeholder="18/11/2025"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className="pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <div className="relative">
                    <Input
                      id="duration"
                      inputMode="numeric"
                      placeholder="160m"
                      value={duration}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setDuration(raw);
                      }}
                      className={duration ? "pr-8" : ""}
                    />
                    {duration && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-foreground pointer-events-none select-none">
                        m
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Genre</Label>
                  <Select value={selectedGenre} onValueChange={(val) => setSelectedGenre(val as MovieGenre)}>
                    <SelectTrigger className="w-full border border-border h-auto! py-3 px-4 gap-3 cursor-pointer">
                      <SelectValue placeholder="Select genre" />
                      <ChevronDown className="size-4 ml-auto opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(val) => setStatus(val as MovieStatus)}>
                    <SelectTrigger className="w-full border border-border h-auto! py-3 px-4 gap-3 cursor-pointer">
                      <SelectValue placeholder="Select status" />
                      <ChevronDown className="size-4 ml-auto opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    placeholder="PG-13, R, etc."
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="poster-url">Poster URL (optional)</Label>
                  <Input
                    id="poster-url"
                    placeholder="https://example.com/poster.jpg"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-transparent pt-0 border border-border rounded-md">
            <CardHeader className="bg-card pt-4 pb-2 rounded-t-md">
              <CardTitle className="text-base">Media</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
              {posterPreview ? (
                <div className="relative w-full">
                  <img
                    src={posterPreview}
                    alt="Poster preview"
                    className="w-full max-h-60 object-contain rounded-md border border-border"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePoster}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                >
                  <Upload className="size-16 text-foreground mb-2" />
                  <p className="text-sm font-medium">Upload Poster</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    File must be .png or .jpg and not exceed 2MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileSelect}
              />

              <Button
                type="button"
                className="gap-2 px-12! py-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="size-4" />
                Select From Device
              </Button>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-6 flex gap-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Movie</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMovieModal;
