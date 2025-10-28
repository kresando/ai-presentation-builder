"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ArrowLeftIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  Loader2Icon,
  PresentationIcon,
  CalendarIcon,
  FileTextIcon,
  SettingsIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Slide {
  id: string;
  order: number;
  type: string;
  title: string;
  content: {
    text?: string;
    bulletPoints?: string[];
    image?: string;
    layout?: string;
    speakerNotes?: string;
  };
  createdAt: string;
}

interface Presentation {
  id: string;
  title: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
}

const THEMES = [
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "minimal", label: "Minimal" },
  { value: "creative", label: "Creative" },
  { value: "professional", label: "Professional" },
];

export default function PresentationPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const presentationId = params.id as string;

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingTheme, setEditingTheme] = useState("");
  const [editingSlides, setEditingSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch presentation data
  const fetchPresentation = async () => {
    try {
      const response = await fetch(`/api/presentations/${presentationId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Presentation not found");
        } else if (response.status === 401) {
          setError("Access denied");
        } else {
          throw new Error("Failed to fetch presentation");
        }
        return;
      }
      const data = await response.json();
      setPresentation(data.presentation);
      setEditingTitle(data.presentation.title);
      setEditingTheme(data.presentation.theme);
      setEditingSlides(data.presentation.slides);
      setError(null);
    } catch (err) {
      setError("Failed to load presentation. Please try again.");
      console.error("Error fetching presentation:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user && presentationId) {
      fetchPresentation();
    }
  }, [session, presentationId]);

  // Handle carousel navigation
  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on("select", () => {
      setCurrentSlideIndex(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Save presentation changes
  const handleSave = async () => {
    if (!presentation) return;

    setSaving(true);
    try {
      // Update presentation metadata
      const updateResponse = await fetch(`/api/presentations/${presentationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingTitle.trim(),
          theme: editingTheme,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update presentation");
      }

      // Update presentation state
      setPresentation({
        ...presentation,
        title: editingTitle.trim(),
        theme: editingTheme,
        updatedAt: new Date().toISOString(),
      });

      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (!presentation) return;
    setEditingTitle(presentation.title);
    setEditingTheme(presentation.theme);
    setEditingSlides(presentation.slides);
    setIsEditing(false);
  };

  // Delete presentation
  const handleDeletePresentation = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/presentations/${presentationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete presentation");
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Failed to delete presentation. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Update slide content
  const updateSlideContent = (slideIndex: number, field: string, value: any) => {
    const updatedSlides = [...editingSlides];
    if (field === "title") {
      updatedSlides[slideIndex].title = value;
    } else if (field.startsWith("content.")) {
      const contentField = field.replace("content.", "");
      updatedSlides[slideIndex].content = {
        ...updatedSlides[slideIndex].content,
        [contentField]: value,
      };
    }
    setEditingSlides(updatedSlides);
  };

  // Render slide content based on type
  const renderSlideContent = (slide: Slide, isEditMode: boolean = false) => {
    const { title, content, type } = slide;

    if (isEditMode) {
      return (
        <div className="space-y-4">
          <Input
            value={slide.title}
            onChange={(e) => {
              const slideIndex = editingSlides.findIndex(s => s.id === slide.id);
              if (slideIndex !== -1) {
                updateSlideContent(slideIndex, "title", e.target.value);
              }
            }}
            className="text-2xl font-bold text-center"
            placeholder="Slide title"
          />
          {type === "bullet-points" && (
            <div className="space-y-2">
              {(content.bulletPoints || [""]).map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-lg">•</span>
                  <Input
                    value={point}
                    onChange={(e) => {
                      const slideIndex = editingSlides.findIndex(s => s.id === slide.id);
                      if (slideIndex !== -1) {
                        const newBulletPoints = [...(content.bulletPoints || [])];
                        newBulletPoints[index] = e.target.value;
                        updateSlideContent(slideIndex, "content.bulletPoints", newBulletPoints);
                      }
                    }}
                    placeholder="Bullet point"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const slideIndex = editingSlides.findIndex(s => s.id === slide.id);
                  if (slideIndex !== -1) {
                    const newBulletPoints = [...(content.bulletPoints || []), ""];
                    updateSlideContent(slideIndex, "content.bulletPoints", newBulletPoints);
                  }
                }}
              >
                Add Bullet Point
              </Button>
            </div>
          )}
          {type === "content" && (
            <Textarea
              value={content.text || ""}
              onChange={(e) => {
                const slideIndex = editingSlides.findIndex(s => s.id === slide.id);
                if (slideIndex !== -1) {
                  updateSlideContent(slideIndex, "content.text", e.target.value);
                }
              }}
              placeholder="Slide content"
              rows={8}
              className="resize-none"
            />
          )}
        </div>
      );
    }

    // View mode
    return (
      <div className="h-full flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        {type === "bullet-points" && content.bulletPoints && (
          <div className="space-y-4">
            {content.bulletPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-xl mt-1">•</span>
                <p className="text-lg">{point}</p>
              </div>
            ))}
          </div>
        )}
        {type === "content" && content.text && (
          <p className="text-lg leading-relaxed">{content.text}</p>
        )}
        {type === "title" && (
          <div className="text-center">
            <p className="text-xl text-muted-foreground">
              {content.text || "Welcome to this presentation"}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-96 w-full max-w-4xl mx-auto rounded-lg" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertDescription>
            Please sign in to access this presentation.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error && !presentation) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <Loader2Icon className="mx-auto h-8 w-8 animate-spin mb-4" />
          <p>Loading presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="text-xl font-semibold"
                  placeholder="Presentation title"
                />
                <Select value={editingTheme} onValueChange={setEditingTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {THEMES.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold">{presentation.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{presentation.theme}</Badge>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {formatDistanceToNow(new Date(presentation.createdAt), { addSuffix: true })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileTextIcon className="h-3 w-3" />
                    {presentation.slides.length} slides
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
              >
                {saving ? (
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <SaveIcon className="h-4 w-4 mr-2" />
                )}
                Save
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={saving}
                size="sm"
              >
                <XIcon className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                size="sm"
              >
                <EditIcon className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                size="sm"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Presentation Content */}
      <div className="space-y-6">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="min-h-[500px] flex items-center justify-center">
              {presentation.slides.length > 0 ? (
                <Carousel
                  className="w-full"
                  setApi={setCarouselApi}
                  orientation="horizontal"
                >
                  <CarouselContent>
                    {editingSlides.map((slide, index) => (
                      <CarouselItem key={slide.id} className="basis-full">
                        <div className="p-8 min-h-[400px] flex items-center justify-center">
                          <div className="w-full max-w-3xl">
                            {renderSlideContent(slide, isEditing)}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {presentation.slides.length > 1 && (
                    <>
                      <CarouselPrevious />
                      <CarouselNext />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="text-center">
                  <PresentationIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No slides in this presentation</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Slide Navigation */}
        {presentation.slides.length > 1 && (
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              {presentation.slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlideIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              Slide {currentSlideIndex + 1} of {presentation.slides.length}
            </span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Presentation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{presentation.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePresentation}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}