'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Slide, SlideElement } from '@/db/schema/presentations';
import { ElementRenderer } from '@/lib/templates/renderer';
import { motion } from 'framer-motion';
import {
  ZoomInIcon,
  ZoomOutIcon,
  Maximize2Icon,
  Grid3x3Icon,
  PlayIcon,
  EyeIcon,
  EditIcon,
} from 'lucide-react';

interface CanvasProps {
  slide: Slide;
  selectedElementId: string | null;
  onElementSelect: (elementId: string) => void;
  onSlideUpdate: (slideIndex: number, updates: Partial<Slide>) => void;
  onElementUpdate: (elementId: string, updates: Partial<SlideElement>) => void;
}

export const Canvas = React.forwardRef<HTMLDivElement, CanvasProps>(({
  slide,
  selectedElementId,
  onElementSelect,
  onSlideUpdate,
  onElementUpdate,
}, ref) => {
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  const slideWidth = 1920; // Standard 16:9 slide width
  const slideHeight = 1080; // Standard 16:9 slide height

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.25));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    if (isPreviewMode) return;

    e.preventDefault();
    e.stopPropagation();

    const element = slide.content.elements?.find(el => el.id === elementId);
    if (!element) return;

    setIsDragging(true);
    setDraggedElement(elementId);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElementStart({ x: element.position.x, y: element.position.y });

    onElementSelect(elementId);
  }, [isPreviewMode, slide.content.elements, onElementSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !draggedElement) return;

    const deltaX = (e.clientX - dragStart.x) / (slideWidth * zoom);
    const deltaY = (e.clientY - dragStart.y) / (slideHeight * zoom);

    const newX = Math.max(0, Math.min(1, elementStart.x + deltaX));
    const newY = Math.max(0, Math.min(1, elementStart.y + deltaY));

    onElementUpdate(draggedElement, {
      position: {
        ...slide.content.elements?.find(el => el.id === draggedElement)?.position,
        x: newX,
        y: newY,
      },
    });
  }, [isDragging, draggedElement, dragStart, elementStart, slideWidth, slideHeight, zoom, onElementUpdate, slide.content.elements]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedElement(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === slideRef.current) {
      onElementSelect('');
    }
  }, [onElementSelect]);

  const renderSlideBackground = () => {
    if (slide.backgroundImage) {
      return (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${slide.backgroundImage})` }}
        />
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded transition-colors ${
              isPreviewMode
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            title={isPreviewMode ? 'Exit preview' : 'Preview'}
          >
            {isPreviewMode ? <EditIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button
            className={`p-2 rounded transition-colors ${
              showGrid ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-600'
            }`}
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle grid"
          >
            <Grid3x3Icon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Zoom:</span>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={handleZoomOut}
              title="Zoom out"
            >
              <ZoomOutIcon className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={handleZoomIn}
              title="Zoom in"
            >
              <ZoomInIcon className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={handleZoomReset}
              title="Fit to screen"
            >
              <Maximize2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="flex-1 overflow-auto bg-gray-100"
        onClick={handleCanvasClick}
      >
        <div className="min-h-full flex items-center justify-center p-8">
          {/* Slide Container */}
          <motion.div
            ref={slideRef}
            className="relative bg-white shadow-2xl rounded-lg overflow-hidden"
            style={{
              width: `${slideWidth * zoom}px`,
              height: `${slideHeight * zoom}px`,
              transformOrigin: 'center center',
            }}
            layout
            transition={{ duration: 0.2 }}
          >
            {/* Background */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: slide.backgroundColor || '#ffffff' }}
            >
              {renderSlideBackground()}
            </div>

            {/* Grid Overlay */}
            {showGrid && !isPreviewMode && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: `${48 * zoom}px ${48 * zoom}px`,
                }}
              />
            )}

            {/* Slide Elements */}
            {slide.content.elements?.map((element) => (
              <motion.div
                key={element.id}
                className={`absolute ${!isPreviewMode ? 'cursor-move' : ''} ${
                  selectedElementId === element.id && !isPreviewMode
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : ''
                }`}
                onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                layout
                transition={{ duration: 0.2 }}
              >
                <ElementRenderer
                  element={element}
                  isEditing={!isPreviewMode}
                  onUpdate={(elementId, updates) => onElementUpdate(elementId, updates)}
                  slideWidth={slideWidth * zoom}
                  slideHeight={slideHeight * zoom}
                />
              </motion.div>
            ))}

            {/* Selection Box for Empty State */}
            {isPreviewMode && (!slide.content.elements || slide.content.elements.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-lg mb-2">Empty Slide</div>
                  <div className="text-sm">Add elements from the properties panel</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between px-4">
        <div className="text-xs text-gray-600">
          Slide {slide.order + 1} • {slideWidth} × {slideHeight}px
        </div>
        <div className="text-xs text-gray-600">
          {selectedElementId && !isPreviewMode
            ? `Selected: ${selectedElementId}`
            : isPreviewMode
            ? 'Preview Mode'
            : 'Click element to edit'}
        </div>
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';