"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
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
  PlusIcon,
  PresentationIcon,
  TrashIcon,
  EditIcon,
  CalendarIcon,
  Loader2Icon,
  SparklesIcon,
  FileTextIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Presentation {
  id: string;
  title: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
  slideCount: number;
}

interface FormData {
  prompt: string;
  theme: string;
  slideCount: number;
}

const THEMES = [
  { value: "modern", label: "Modern", description: "Clean and contemporary design" },
  { value: "classic", label: "Classic", description: "Traditional and professional look" },
  { value: "minimal", label: "Minimal", description: "Simple and focused design" },
  { value: "creative", label: "Creative", description: "Bold and artistic style" },
  { value: "professional", label: "Professional", description: "Corporate and formal design" },
];

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    prompt: "",
    theme: "modern",
    slideCount: 5,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [presentationToDelete, setPresentationToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch presentations
  const fetchPresentations = async () => {
    try {
      const response = await fetch("/api/presentations");
      if (!response.ok) {
        throw new Error("Failed to fetch presentations");
      }
      const data = await response.json();
      setPresentations(data.presentations || []);
      setError(null);
    } catch (err) {
      setError("Failed to load presentations. Please try again.");
      console.error("Error fetching presentations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchPresentations();
    }
  }, [session]);

  // Handle form submission
  const handleGeneratePresentation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.prompt.trim()) {
      setError("Please enter a description for your presentation");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStatus("Initializing AI generation...");
    setError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      setGenerationStatus("Connecting to AI service...");

      const response = await fetch("/api/presentations/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationStatus("Finalizing presentation...");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate presentation");
      }

      const result = await response.json();

      // Reset form
      setFormData({
        prompt: "",
        theme: "modern",
        slideCount: 5,
      });

      // Refresh presentations list
      await fetchPresentations();

      // Navigate to the new presentation
      router.push(`/presentations/${result.presentationId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate presentation. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStatus("");
    }
  };

  // Handle delete presentation
  const handleDeletePresentation = async () => {
    if (!presentationToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/presentations/${presentationToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete presentation");
      }

      await fetchPresentations();
      setDeleteDialogOpen(false);
      setPresentationToDelete(null);
    } catch (err) {
      setError("Failed to delete presentation. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isPending) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Alert>
              <AlertDescription>
                Please sign in to access your presentations.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Presentation Builder</h1>
              <p className="text-muted-foreground">
                Create stunning presentations with the power of AI
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <SparklesIcon className="h-3 w-3" />
                Powered by Gemini AI
              </Badge>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Create New Presentation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Create New Presentation
                </CardTitle>
                <CardDescription>
                  Describe what you want to present and let AI create it for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGeneratePresentation} className="space-y-4">
                  <div>
                    <label htmlFor="prompt" className="text-sm font-medium mb-2 block">
                      What do you want to present about?
                    </label>
                    <Textarea
                      id="prompt"
                      placeholder="e.g., A presentation about sustainable energy solutions for businesses..."
                      value={formData.prompt}
                      onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                      disabled={isGenerating}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="theme" className="text-sm font-medium mb-2 block">
                        Theme
                      </label>
                      <Select
                        value={formData.theme}
                        onValueChange={(value) => setFormData({ ...formData, theme: value })}
                        disabled={isGenerating}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          {THEMES.map((theme) => (
                            <SelectItem key={theme.value} value={theme.value}>
                              <div>
                                <div className="font-medium">{theme.label}</div>
                                <div className="text-sm text-muted-foreground">
                                  {theme.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="slideCount" className="text-sm font-medium mb-2 block">
                        Number of Slides
                      </label>
                      <Select
                        value={formData.slideCount.toString()}
                        onValueChange={(value) => setFormData({ ...formData, slideCount: parseInt(value) })}
                        disabled={isGenerating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 5, 7, 10, 15, 20].map((count) => (
                            <SelectItem key={count} value={count.toString()}>
                              {count} slides
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        {generationStatus}
                      </div>
                      <Progress value={generationProgress} className="w-full" />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isGenerating || !formData.prompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="mr-2 h-4 w-4" />
                        Generate Presentation
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Presentations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PresentationIcon className="h-5 w-5" />
                  Your Presentations
                </CardTitle>
                <CardDescription>
                  Access and manage your existing presentations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : presentations.length === 0 ? (
                  <div className="text-center py-8">
                    <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">No presentations yet</p>
                    <p className="text-sm text-muted-foreground">
                      Create your first AI-powered presentation using the form
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {presentations.map((presentation) => (
                      <div
                        key={presentation.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{presentation.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {presentation.slideCount} slides
                            </Badge>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              {formatDistanceToNow(new Date(presentation.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/presentations/${presentation.id}`)}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPresentationToDelete(presentation.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Presentation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this presentation? This action cannot be undone.
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