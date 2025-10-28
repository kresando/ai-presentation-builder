"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlideRenderer } from "./slide-renderer";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Maximize2Icon,
  Grid3x3Icon,
  PlayIcon,
  PauseIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SlideCarouselProps {
  slides: Slide[];
  theme: string;
  className?: string;
  onSlideChange?: (index: number) => void;
  onSlideEdit?: (slideIndex: number, slide: Slide) => void;
  isEditing?: boolean;
  showControls?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function SlideCarousel({
  slides,
  theme,
  className,
  onSlideChange,
  onSlideEdit,
  isEditing = false,
  showControls = true,
  autoPlay = false,
  autoPlayInterval = 5000,
}: SlideCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      const index = carouselApi.selectedScrollSnap();
      setCurrentSlide(index);
      onSlideChange?.(index);
    };

    carouselApi.on("select", onSelect);
    onSelect();
  }, [carouselApi, onSlideChange]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !carouselApi || slides.length <= 1) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, carouselApi, slides.length, autoPlayInterval]);

  const handleSlideEdit = (slideIndex: number, field: string, value: any) => {
    if (!onSlideEdit) return;

    const slide = slides[slideIndex];
    const updatedSlide = { ...slide };

    if (field === "title") {
      updatedSlide.title = value;
    } else if (field.startsWith("content.")) {
      const contentField = field.replace("content.", "");
      updatedSlide.content = {
        ...updatedSlide.content,
        [contentField]: value,
      };
    }

    onSlideEdit(slideIndex, updatedSlide);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const goToSlide = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  const goToPrevious = () => {
    carouselApi?.scrollPrev();
  };

  const goToNext = () => {
    carouselApi?.scrollNext();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, isPlaying]);

  if (slides.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-96 border-2 border-dashed rounded-lg",
          className
        )}
      >
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No slides available</p>
          <p className="text-sm text-muted-foreground">
            Create your first slide to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Carousel */}
      <div className={cn("relative", isFullscreen && "fixed inset-0 z-50 bg-background")}>
        <Carousel
          className="w-full h-full"
          setApi={setCarouselApi}
          orientation="horizontal"
        >
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id} className="basis-full">
                <div className="h-[70vh] md:h-[80vh] flex items-center justify-center p-4">
                  <SlideRenderer
                    title={slide.title}
                    content={slide.content}
                    type={slide.type as any}
                    theme={theme}
                    isEditing={isEditing}
                    onTitleChange={(title) => handleSlideEdit(index, "title", title)}
                    onContentChange={(content) => handleSlideEdit(index, "content", content)}
                    className="w-full h-full max-w-6xl"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Navigation Controls */}
        {showControls && slides.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Fullscreen Mode Controls */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayPause}
              className="bg-background/80 backdrop-blur-sm"
            >
              {isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => document.exitFullscreen()}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Maximize2Icon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Slide Navigation and Controls */}
      <div className="flex items-center justify-between px-4">
        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          <Grid3x3Icon className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentSlide
                    ? "w-8 bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
          <Badge variant="secondary" className="text-xs">
            {currentSlide + 1} / {slides.length}
          </Badge>
        </div>

        {/* Playback Controls */}
        {showControls && slides.length > 1 && (
          <div className="flex items-center gap-2">
            {!isFullscreen && (
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlayPause}
                className="h-8 w-8"
              >
                {isPlaying ? (
                  <PauseIcon className="h-4 w-4" />
                ) : (
                  <PlayIcon className="h-4 w-4" />
                )}
              </Button>
            )}
            {!isFullscreen && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="h-8 w-8"
              >
                <Maximize2Icon className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      {!isFullscreen && (
        <div className="text-center text-xs text-muted-foreground">
          Use arrow keys to navigate • Space to play/pause • F for fullscreen
        </div>
      )}
    </div>
  );
}