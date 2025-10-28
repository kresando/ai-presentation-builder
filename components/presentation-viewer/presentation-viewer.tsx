"use client";

import React, { useState, useEffect } from "react";
import { SlideCarousel } from "./slide-carousel";
import { getTheme, applyThemeVariables, type PresentationTheme } from "./themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  SettingsIcon,
  DownloadIcon,
  ShareIcon,
  PrintIcon,
  EyeIcon,
  EditIcon,
  PresentationIcon,
  ClockIcon,
  FileTextIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
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

interface PresentationData {
  id: string;
  title: string;
  theme: string;
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
}

interface PresentationViewerProps {
  presentation: PresentationData;
  className?: string;
  isEditing?: boolean;
  onPresentationUpdate?: (updates: Partial<PresentationData>) => void;
  onSlideUpdate?: (slideIndex: number, slide: Slide) => void;
  showSettings?: boolean;
  autoPlay?: boolean;
}

export function PresentationViewer({
  presentation,
  className,
  isEditing = false,
  onPresentationUpdate,
  onSlideUpdate,
  showSettings = true,
  autoPlay = false,
}: PresentationViewerProps) {
  const [viewMode, setViewMode] = useState<"presentation" | "edit">("presentation");
  const [selectedTheme, setSelectedTheme] = useState(presentation.theme);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(autoPlay);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const currentTheme = getTheme(selectedTheme);
  const currentSlide = presentation.slides[currentSlideIndex];

  useEffect(() => {
    if (selectedTheme !== presentation.theme && onPresentationUpdate) {
      onPresentationUpdate({ theme: selectedTheme });
    }
  }, [selectedTheme, presentation.theme, onPresentationUpdate]);

  const handleSlideChange = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const handleSlideEdit = (slideIndex: number, updatedSlide: Slide) => {
    if (onSlideUpdate) {
      onSlideUpdate(slideIndex, updatedSlide);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
  };

  const handleExport = () => {
    // Export functionality - could be implemented to export to PDF, PPT, etc.
    const exportData = {
      ...presentation,
      theme: selectedTheme,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${presentation.title.replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: presentation.title,
          text: `Check out my presentation: ${presentation.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const toggleEditMode = () => {
    setViewMode(viewMode === "presentation" ? "edit" : "presentation");
  };

  return (
    <div
      className={cn("space-y-6", className)}
      style={{
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.text,
        fontFamily: currentTheme.fonts.body,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: currentTheme.colors.muted }}>
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: currentTheme.fonts.heading }}>
              {presentation.title}
            </h1>
            <div className="flex items-center gap-2 text-sm" style={{ opacity: 0.7 }}>
              <Badge variant="outline" style={{ borderColor: currentTheme.colors.accent }}>
                {selectedTheme}
              </Badge>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileTextIcon className="h-3 w-3" />
                {presentation.slides.length} slides
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {formatDistanceToNow(new Date(presentation.updatedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleEditMode}
            className="flex items-center gap-2"
          >
            {viewMode === "presentation" ? (
              <>
                <EditIcon className="h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <EyeIcon className="h-4 w-4" />
                Present
              </>
            )}
          </Button>

          {/* Action Buttons */}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <PrintIcon className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="flex gap-6 px-6">
        {/* Main Content Area */}
        <div className="flex-1">
          <SlideCarousel
            slides={presentation.slides}
            theme={selectedTheme}
            onSlideChange={handleSlideChange}
            onSlideEdit={handleSlideEdit}
            isEditing={viewMode === "edit"}
            autoPlay={autoPlayEnabled}
            showControls={viewMode === "presentation"}
          />
        </div>

        {/* Settings Sidebar */}
        {showSettings && (
          <div className="w-80 space-y-4">
            {/* Theme Settings */}
            <Card style={{ backgroundColor: currentTheme.colors.secondary }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: currentTheme.fonts.heading }}>
                  <SettingsIcon className="h-5 w-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Theme</label>
                  <Select value={selectedTheme} onValueChange={handleThemeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Auto Play</label>
                  <Switch
                    checked={autoPlayEnabled}
                    onCheckedChange={setAutoPlayEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Speaker Notes</label>
                  <Switch
                    checked={showSpeakerNotes}
                    onCheckedChange={setShowSpeakerNotes}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Slide Info */}
            {currentSlide && (
              <Card style={{ backgroundColor: currentTheme.colors.secondary }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg" style={{ fontFamily: currentTheme.fonts.heading }}>
                    <PresentationIcon className="h-5 w-5" />
                    Current Slide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium truncate">{currentSlide.title}</h4>
                    <p className="text-sm" style={{ opacity: 0.7 }}>
                      Type: {currentSlide.type}
                    </p>
                  </div>

                  {showSpeakerNotes && currentSlide.content.speakerNotes && (
                    <div>
                      <h5 className="font-medium text-sm mb-2">Speaker Notes:</h5>
                      <p className="text-sm p-2 rounded" style={{ backgroundColor: currentTheme.colors.muted }}>
                        {currentSlide.content.speakerNotes}
                      </p>
                    </div>
                  )}

                  <div className="text-sm" style={{ opacity: 0.7 }}>
                    Slide {currentSlideIndex + 1} of {presentation.slides.length}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card style={{ backgroundColor: currentTheme.colors.secondary }}>
              <CardHeader>
                <CardTitle className="text-lg" style={{ fontFamily: currentTheme.fonts.heading }}>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <PresentationIcon className="h-4 w-4 mr-2" />
                  Start Presentation
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}