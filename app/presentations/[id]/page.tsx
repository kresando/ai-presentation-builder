"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
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
  ArrowLeftIcon,
  Loader2Icon,
  SettingsIcon,
  EyeIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  DownloadIcon,
  ShareIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { EditorLayout } from "@/components/editor/EditorLayout";
import { Slide } from "@/db/schema/presentations";

interface Presentation {
  id: string;
  title: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
}

export default function PresentationPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const presentationId = params.id as string;

  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
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

  // Export presentation
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/presentations/${presentationId}/export`);
      if (!response.ok) {
        throw new Error("Failed to export presentation");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presentation?.title || 'presentation'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Failed to export presentation. Please try again.");
    }
  };

  // Share presentation
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: presentation?.title || 'Presentation',
          text: 'Check out my presentation',
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // Show success message
      }
    } catch (err) {
      console.error('Error sharing presentation:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="mx-auto h-8 w-8 animate-spin mb-4" />
          <p>Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
            Please sign in to access this presentation.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error && !presentation) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex items-center gap-4 p-6 border-b">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="mx-auto h-8 w-8 animate-spin mb-4" />
          <p>Loading presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Header Bar */}
      <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{presentation.title}</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Badge variant="outline">{presentation.theme}</Badge>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(presentation.createdAt), { addSuffix: true })}</span>
              <span>•</span>
              <span>{presentation.slides.length} slides</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <EditIcon className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <EyeIcon className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Editor */}
      <div className="flex-1">
        <EditorLayout
          presentationId={presentationId}
          initialSlides={presentation.slides}
        />
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