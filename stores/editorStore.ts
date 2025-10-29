import { create } from 'zustand';
import { Slide, SlideElement, TemplateLayoutConfig } from '@/db/schema/presentations';
import { templateRegistry } from '@/lib/templates';

interface EditorState {
  // Slides and navigation
  slides: Slide[];
  currentSlideIndex: number;
  selectedElementId: string | null;

  // UI state
  isPreviewMode: boolean;
  showGrid: boolean;
  zoom: number;

  // History for undo/redo
  history: EditorState[];
  historyIndex: number;

  // Actions
  setCurrentSlide: (index: number) => void;
  selectElement: (elementId: string | null) => void;
  addSlide: (templateId?: string) => void;
  updateSlide: (slideIndex: number, updates: Partial<Slide>) => void;
  deleteSlide: (slideIndex: number) => void;
  duplicateSlide: (slideIndex: number) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;

  addElement: (slideIndex: number, element: SlideElement) => void;
  updateElement: (elementId: string, updates: Partial<SlideElement>) => void;
  deleteElement: (elementId: string) => void;

  setPreviewMode: (enabled: boolean) => void;
  setShowGrid: (enabled: boolean) => void;
  setZoom: (zoom: number) => void;

  // History management
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
}

const initialState = {
  slides: [],
  currentSlideIndex: 0,
  selectedElementId: null,
  isPreviewMode: false,
  showGrid: false,
  zoom: 1,
  history: [],
  historyIndex: -1,
};

export const useEditorStore = create<EditorState>((set, get) => ({
  ...initialState,

  setCurrentSlide: (index: number) => {
    set((state) => ({
      currentSlideIndex: Math.max(0, Math.min(index, state.slides.length - 1)),
      selectedElementId: null,
    }));
  },

  selectElement: (elementId: string | null) => {
    set({ selectedElementId: elementId });
  },

  addSlide: (templateId?: string) => {
    const state = get();
    const template = templateId ? templateRegistry.getTemplate(templateId) : null;

    const newSlide: Slide = {
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: state.slides.length,
      type: 'content',
      title: template?.name || 'New Slide',
      content: {
        elements: template?.elements.map(element => ({
          id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: element.type,
          content: {
            text: element.placeholder || '',
            bulletPoints: element.type === 'bullet' ? [''] : undefined,
          },
          position: element.defaultPosition,
          styling: element.defaultStyling,
          animation: undefined,
        })) || [],
      },
      templateId: templateId,
      layoutType: template?.name,
      backgroundColor: template?.defaultStyles.backgroundColor || '#ffffff',
      backgroundImage: undefined,
      transitionEffect: 'none',
      transitionDuration: 300,
      speakerNotes: undefined,
      isHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      slides: [...state.slides, newSlide],
      currentSlideIndex: state.slides.length, // New slide becomes current
    }));
  },

  updateSlide: (slideIndex: number, updates: Partial<Slide>) => {
    set((state) => {
      const newSlides = [...state.slides];
      if (slideIndex >= 0 && slideIndex < newSlides.length) {
        newSlides[slideIndex] = {
          ...newSlides[slideIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return { slides: newSlides };
    });
  },

  deleteSlide: (slideIndex: number) => {
    const state = get();
    if (state.slides.length <= 1) return; // Don't allow deleting the last slide

    set((prevState) => {
      const newSlides = prevState.slides.filter((_, index) => index !== slideIndex);
      // Reorder the remaining slides
      const reorderedSlides = newSlides.map((slide, index) => ({
        ...slide,
        order: index,
      }));

      let newCurrentSlideIndex = prevState.currentSlideIndex;
      if (slideIndex < prevState.currentSlideIndex) {
        newCurrentSlideIndex = prevState.currentSlideIndex - 1;
      } else if (slideIndex === prevState.currentSlideIndex && newCurrentSlideIndex >= reorderedSlides.length) {
        newCurrentSlideIndex = reorderedSlides.length - 1;
      }

      return {
        slides: reorderedSlides,
        currentSlideIndex: newCurrentSlideIndex,
        selectedElementId: null,
      };
    });
  },

  duplicateSlide: (slideIndex: number) => {
    set((state) => {
      const slideToDuplicate = state.slides[slideIndex];
      if (!slideToDuplicate) return state;

      const duplicatedSlide: Slide = {
        ...slideToDuplicate,
        id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        order: slideToDuplicate.order + 1,
        title: `${slideToDuplicate.title} (Copy)`,
        content: {
          ...slideToDuplicate.content,
          elements: slideToDuplicate.content.elements?.map(element => ({
            ...element,
            id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })) || [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newSlides = [...state.slides];
      newSlides.splice(slideIndex + 1, 0, duplicatedSlide);

      // Reorder all slides
      const reorderedSlides = newSlides.map((slide, index) => ({
        ...slide,
        order: index,
      }));

      return {
        slides: reorderedSlides,
        currentSlideIndex: slideIndex + 1,
        selectedElementId: null,
      };
    });
  },

  reorderSlides: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const newSlides = [...state.slides];
      const [movedSlide] = newSlides.splice(fromIndex, 1);
      newSlides.splice(toIndex, 0, movedSlide);

      // Reorder all slides
      const reorderedSlides = newSlides.map((slide, index) => ({
        ...slide,
        order: index,
      }));

      // Update current slide index if needed
      let newCurrentSlideIndex = state.currentSlideIndex;
      if (fromIndex === state.currentSlideIndex) {
        newCurrentSlideIndex = toIndex;
      } else if (fromIndex < state.currentSlideIndex && toIndex >= state.currentSlideIndex) {
        newCurrentSlideIndex = state.currentSlideIndex - 1;
      } else if (fromIndex > state.currentSlideIndex && toIndex <= state.currentSlideIndex) {
        newCurrentSlideIndex = state.currentSlideIndex + 1;
      }

      return {
        slides: reorderedSlides,
        currentSlideIndex: newCurrentSlideIndex,
      };
    });
  },

  addElement: (slideIndex: number, element: SlideElement) => {
    set((state) => {
      const newSlides = [...state.slides];
      if (slideIndex >= 0 && slideIndex < newSlides.length) {
        const slide = newSlides[slideIndex];
        const newElements = [...(slide.content.elements || []), element];
        newSlides[slideIndex] = {
          ...slide,
          content: {
            ...slide.content,
            elements: newElements,
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return { slides: newSlides };
    });
  },

  updateElement: (elementId: string, updates: Partial<SlideElement>) => {
    set((state) => {
      const newSlides = state.slides.map(slide => {
        if (slide.content.elements) {
          const newElements = slide.content.elements.map(element =>
            element.id === elementId ? { ...element, ...updates } : element
          );
          return {
            ...slide,
            content: {
              ...slide.content,
              elements: newElements,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return slide;
      });
      return { slides: newSlides };
    });
  },

  deleteElement: (elementId: string) => {
    set((state) => {
      const newSlides = state.slides.map(slide => {
        if (slide.content.elements) {
          const newElements = slide.content.elements.filter(element => element.id !== elementId);
          return {
            ...slide,
            content: {
              ...slide.content,
              elements: newElements,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return slide;
      });
      return {
        slides: newSlides,
        selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
      };
    });
  },

  setPreviewMode: (enabled: boolean) => {
    set({
      isPreviewMode: enabled,
      selectedElementId: enabled ? null : get().selectedElementId,
    });
  },

  setShowGrid: (enabled: boolean) => {
    set({ showGrid: enabled });
  },

  setZoom: (zoom: number) => {
    set({ zoom: Math.max(0.25, Math.min(2, zoom)) });
  },

  saveToHistory: () => {
    const state = get();
    const currentState = {
      slides: JSON.parse(JSON.stringify(state.slides)),
      currentSlideIndex: state.currentSlideIndex,
      selectedElementId: state.selectedElementId,
    };

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(currentState);

    // Limit history size
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const previousState = state.history[state.historyIndex - 1];
      set({
        slides: JSON.parse(JSON.stringify(previousState.slides)),
        currentSlideIndex: previousState.currentSlideIndex,
        selectedElementId: previousState.selectedElementId,
        historyIndex: state.historyIndex - 1,
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const nextState = state.history[state.historyIndex + 1];
      set({
        slides: JSON.parse(JSON.stringify(nextState.slides)),
        currentSlideIndex: nextState.currentSlideIndex,
        selectedElementId: nextState.selectedElementId,
        historyIndex: state.historyIndex + 1,
      });
    }
  },
}));