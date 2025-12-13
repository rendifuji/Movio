import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { Plus, Upload, X, Calendar, ChevronDown, Check } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Badge,
} from "@/components";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

type MovieStatus = "Now Showing" | "Coming Soon" | "End";

interface AddMovieModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Musical",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

const statuses: MovieStatus[] = ["Now Showing", "Coming Soon", "End"];

const AddMovieModal = ({ open, onOpenChange }: AddMovieModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genrePopoverOpen, setGenrePopoverOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setPosterFile(file);
    const reader = new FileReader();
    reader.onload = () => setPosterPreview(reader.result as string);
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
    setPosterFile(null);
    setPosterPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleToggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleRemoveGenre = (genre: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genre));
  };

  const handleSubmit = () => {
    console.log({
      title,
      description,
      releaseDate,
      duration,
      genres: selectedGenres,
      status,
      posterFile,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <Popover
                    open={genrePopoverOpen}
                    onOpenChange={setGenrePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={genrePopoverOpen}
                        className="w-full justify-between border border-border h-auto min-h-[46px] py-2 px-3 cursor-pointer"
                      >
                        {selectedGenres.length > 0 ? (
                          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-[calc(100%-24px)]">
                            {selectedGenres.map((genre) => (
                              <Badge
                                key={genre}
                                variant="secondary"
                                className="text-xs gap-1 shrink-0"
                              >
                                {genre}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveGenre(genre);
                                  }}
                                  className="ml-0.5 rounded-full outline-none hover:bg-muted"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Select genres
                          </span>
                        )}
                        <ChevronDown className="size-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search genres..." />
                        <CommandList>
                          <CommandEmpty>No genre found.</CommandEmpty>
                          <CommandGroup>
                            {genres.map((genre) => {
                              const isSelected = selectedGenres.includes(genre);
                              return (
                                <CommandItem
                                  key={genre}
                                  value={genre}
                                  onSelect={() => handleToggleGenre(genre)}
                                >
                                  <div
                                    className={cn(
                                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                      isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "opacity-50 [&_svg]:invisible"
                                    )}
                                  >
                                    <Check className="h-3 w-3" />
                                  </div>
                                  {genre}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full border border-border h-auto! py-3 px-4 gap-3 cursor-pointer">
                      <SelectValue placeholder="Now Showing" />
                      <ChevronDown className="size-4 ml-auto opacity-50" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem
                          key={s}
                          value={s.toLowerCase().replaceAll(" ", "-")}
                        >
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
