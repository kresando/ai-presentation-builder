'use client';

import React, { useState, useRef, useCallback } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { Filmstrip } from './Filmstrip';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { Toolbar } from './Toolbar';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { useEditorStore } from '@/stores/editorStore';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Slide, SlideElement } from '@/db/schema/presentations';
import { toast } from 'sonner';

interface EditorLayoutProps {
  presentationId: string;
  initialSlides: Slide[];
  presentationTitle?: string;
  onTitleChange?: (title: string) => void;
}

export const EditorLayout: React.FC<EditorLayoutProps> = ({
  presentationId,
  initialSlides,
  presentationTitle,
  onTitleChange,
}) => {
  const {
    slides,
    currentSlideIndex,
    selectedElementId,
    isPreviewMode,
    showGrid,
    zoom,
    setCurrentSlide,
    selectElement,
    updateSlide,
    updateElement,
    addSlide,
    deleteSlide,
    setPreviewMode,
    setShowGrid,
    setZoom,
    undo,
    redo,
    history,
    historyIndex,
  } = useEditorStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(presentationTitle || 'Untitled Presentation');
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Initialize store with initial slides
  React.useEffect(() => {
    if (slides.length === 0 && initialSlides.length > 0) {
      // Initialize slides in store
      initialSlides.forEach(slide => {
        useEditorStore.getState().addSlide(slide);
      });
    }
  }, [initialSlides, slides.length]);

  // Auto-save functionality
  const { forceSave } = useAutoSave({
    presentationId,
    debounceMs: 2000,
    onSave: (success) => {
      if (success) {
        toast.success('Presentation saved automatically');
      }
    },
  });

  // Keyboard shortcuts
  const { shortcuts } = useKeyboardShortcuts({
    presentationId,
    onSave: () => {
      forceSave().then(success => {
        if (success) {
          toast.success('Presentation saved');
        } else {
          toast.error('Failed to save presentation');
        }
      });
    },
    onExport: () => {
      // Handle export
      window.open(`/api/presentations/${presentationId}/export`, '_blank');
    },
    onShare: async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: title,
            text: 'Check out my presentation',
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          toast.success('Presentation link copied to clipboard');
        }
      } catch (error) {
        toast.error('Failed to share presentation');
      }
    },
    onPreview: () => {
      setPreviewMode(!isPreviewMode);
    },
  });

  // Handle title change
  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    onTitleChange?.(newTitle);
  }, [onTitleChange]);

  const handleSlideSelect = useCallback((slideIndex: number) => {
    setCurrentSlide(slideIndex);
  }, [setCurrentSlide]);

  const handleElementSelect = useCallback((elementId: string) => {
    selectElement(elementId);
  }, [selectElement]);

  const handleSlideUpdate = useCallback((slideIndex: number, updates: Partial<Slide>) => {
    updateSlide(slideIndex, updates);
  }, [updateSlide]);

  const handleElementUpdate = useCallback((elementId: string, updates: Partial<SlideElement>) => {
    updateElement(elementId, updates);
  }, [updateElement]);

  const handleAddSlide = useCallback((templateId?: string) => {
    addSlide(templateId);
  }, [addSlide]);

  const handleDeleteSlide = useCallback((slideIndex: number) => {
    deleteSlide(slideIndex);
  }, [deleteSlide]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  }, [setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.25));
  }, [setZoom]);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, [setZoom]);

  const handleToggleGrid = useCallback(() => {
    setShowGrid(!showGrid);
  }, [showGrid, setShowGrid]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Toolbar */}
      <Toolbar
        title={title}
        onTitleChange={handleTitleChange}
        onSave={() => {
          forceSave().then(success => {
            if (success) {
              toast.success('Presentation saved');
            } else {
              toast.error('Failed to save presentation');
            }
          });
        }}
        onExport={() => window.open(`/api/presentations/${presentationId}/export`, '_blank')}
        onShare={async () => {
          try {
            if (navigator.share) {
              await navigator.share({
                title: title,
                text: 'Check out my presentation',
                url: window.location.href,
              });
            } else {
              await navigator.clipboard.writeText(window.location.href);
              toast.success('Presentation link copied to clipboard');
            }
          } catch (error) {
            toast.error('Failed to share presentation');
          }
        }}
        onPreview={() => setPreviewMode(!isPreviewMode)}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onToggleGrid={handleToggleGrid}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        zoom={zoom}
        showGrid={showGrid}
        isPreviewMode={isPreviewMode}
      />

      {/* Main Editor */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel - Filmstrip */}
          <Panel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full bg-gray-100 border-r border-gray-200">
              <Filmstrip
                slides={slides}
                currentSlideIndex={currentSlideIndex}
                selectedElementId={selectedElementId}
                onSlideSelect={handleSlideSelect}
                onAddSlide={handleAddSlide}
                onDeleteSlide={handleDeleteSlide}
                onReorderSlides={(fromIndex, toIndex) => {
                  // Handle slide reordering
                  console.log('Reorder slides:', fromIndex, toIndex);
                }}
              />
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-gray-400 transition-colors" />

          {/* Center Panel - Canvas */}
          <Panel defaultSize={50} minSize={40}>
            <div className="h-full bg-gray-50">
              {currentSlide ? (
                <Canvas
                  ref={canvasRef}
                  slide={currentSlide}
                  selectedElementId={selectedElementId}
                  onElementSelect={handleElementSelect}
                  onSlideUpdate={handleSlideUpdate}
                  onElementUpdate={handleElementUpdate}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No slides yet</h3>
                    <p className="text-gray-500 mb-4">Create your first slide to get started</p>
                    <button
                      onClick={() => handleAddSlide()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Slide
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-gray-400 transition-colors" />

          {/* Right Panel - Properties */}
          <Panel defaultSize={30} minSize={20} maxSize={40}>
            <div className="h-full bg-white border-l border-gray-200">
              <PropertiesPanel
                slide={currentSlide}
                selectedElementId={selectedElementId}
                onSlideUpdate={handleSlideUpdate}
                onElementUpdate={handleElementUpdate}
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};