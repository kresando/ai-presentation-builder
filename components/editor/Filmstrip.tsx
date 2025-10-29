'use client';

import React, { useState } from 'react';
import { Slide } from '@/db/schema/presentations';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  TrashIcon,
  CopyIcon,
  GripVerticalIcon,
  EyeIcon,
  EyeOffIcon,
} from 'lucide-react';

interface FilmstripProps {
  slides: Slide[];
  currentSlideIndex: number;
  selectedElementId: string | null;
  onSlideSelect: (index: number) => void;
  onAddSlide: (templateId?: string) => void;
  onDeleteSlide: (index: number) => void;
  onReorderSlides: (fromIndex: number, toIndex: number) => void;
}

export const Filmstrip: React.FC<FilmstripProps> = ({
  slides,
  currentSlideIndex,
  selectedElementId,
  onSlideSelect,
  onAddSlide,
  onDeleteSlide,
  onReorderSlides,
}) => {
  const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSlideIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedSlideIndex !== null && draggedSlideIndex !== dropIndex) {
      onReorderSlides(draggedSlideIndex, dropIndex);
    }
    setDraggedSlideIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedSlideIndex(null);
  };

  const getSlidePreview = (slide: Slide) => {
    // Generate a simple preview of the slide content
    if (slide.content.elements && slide.content.elements.length > 0) {
      const textElement = slide.content.elements.find(el =>
        el.type === 'heading' || el.type === 'text'
      );
      if (textElement && textElement.content.text) {
        return textElement.content.text.length > 50
          ? textElement.content.text.substring(0, 50) + '...'
          : textElement.content.text;
      }
    }
    return slide.title || 'Untitled Slide';
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Slides</h3>
          <div className="text-xs text-gray-500">{slides.length}</div>
        </div>
      </div>

      {/* Slides List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
              index === currentSlideIndex
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
            onClick={() => onSlideSelect(index)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            {/* Drag Handle */}
            <div className="absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVerticalIcon className="w-4 h-4 text-gray-400" />
            </div>

            {/* Slide Preview */}
            <div className="p-3 pl-8">
              <div className="aspect-video bg-white rounded border border-gray-200 mb-2 overflow-hidden">
                <div className="p-2 h-full flex items-center justify-center">
                  <p className="text-xs text-gray-600 text-center line-clamp-3">
                    {getSlidePreview(slide)}
                  </p>
                </div>
              </div>

              {/* Slide Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700">
                    {index + 1}
                  </span>
                  {slide.isHidden && (
                    <EyeOffIcon className="w-3 h-3 text-gray-400" />
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle visibility
                    }}
                    title={slide.isHidden ? 'Show slide' : 'Hide slide'}
                  >
                    {slide.isHidden ? (
                      <EyeOffIcon className="w-3 h-3 text-gray-500" />
                    ) : (
                      <EyeIcon className="w-3 h-3 text-gray-500" />
                    )}
                  </button>
                  <button
                    className="p-1 hover:bg-gray-200 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Duplicate slide
                    }}
                    title="Duplicate slide"
                  >
                    <CopyIcon className="w-3 h-3 text-gray-500" />
                  </button>
                  {slides.length > 1 && (
                    <button
                      className="p-1 hover:bg-red-100 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSlide(index);
                      }}
                      title="Delete slide"
                    >
                      <TrashIcon className="w-3 h-3 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Current Slide Indicator */}
            {index === currentSlideIndex && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" />
            )}
          </motion.div>
        ))}

        {/* Add Slide Button */}
        <div className="relative">
          <button
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-gray-400 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <PlusIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Add Slide</span>
          </button>

          {/* Template Selector */}
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
            >
              <div className="text-xs font-semibold text-gray-700 mb-2 px-2">
                Choose Template
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => {
                    onAddSlide('blank');
                    setShowTemplates(false);
                  }}
                >
                  Blank
                </button>
                <button
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => {
                    onAddSlide('title-slide');
                    setShowTemplates(false);
                  }}
                >
                  Title
                </button>
                <button
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => {
                    onAddSlide('title-with-bullets');
                    setShowTemplates(false);
                  }}
                >
                  Title + Bullets
                </button>
                <button
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => {
                    onAddSlide('two-columns');
                    setShowTemplates(false);
                  }}
                >
                  Two Columns
                </button>
                <button
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => {
                    onAddSlide('image-and-text');
                    setShowTemplates(false);
                  }}
                >
                  Image + Text
                </button>
                <button
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => {
                    onAddSlide('three-columns');
                    setShowTemplates(false);
                  }}
                >
                  Three Columns
                </button>
                <button
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => {
                    onAddSlide('timeline');
                    setShowTemplates(false);
                  }}
                >
                  Timeline
                </button>
                <button
                  className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => {
                    onAddSlide('bar-chart');
                    setShowTemplates(false);
                  }}
                >
                  Bar Chart
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Drag slides to reorder
        </div>
      </div>
    </div>
  );
};