import { useEffect } from 'react';
import { useEditorStore } from '@/stores/editorStore';

interface KeyboardShortcutOptions {
  presentationId: string;
  onExport?: () => void;
  onShare?: () => void;
  onPreview?: () => void;
  onSave?: () => void;
}

export function useKeyboardShortcuts({
  presentationId,
  onExport,
  onShare,
  onPreview,
  onSave,
}: KeyboardShortcutOptions) {
  const {
    slides,
    currentSlideIndex,
    setCurrentSlide,
    deleteSlide,
    duplicateSlide,
    undo,
    redo,
    saveToHistory,
  } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default for our shortcuts
      const isModifierKey = event.ctrlKey || event.metaKey;
      const isShiftKey = event.shiftKey;
      const key = event.key.toLowerCase();

      // Navigation shortcuts
      if (key === 'arrowright' && !isModifierKey && !isShiftKey) {
        event.preventDefault();
        if (currentSlideIndex < slides.length - 1) {
          setCurrentSlide(currentSlideIndex + 1);
        }
      }

      if (key === 'arrowleft' && !isModifierKey && !isShiftKey) {
        event.preventDefault();
        if (currentSlideIndex > 0) {
          setCurrentSlide(currentSlideIndex - 1);
        }
      }

      // Mod+S - Save
      if (isModifierKey && key === 's') {
        event.preventDefault();
        onSave?.();
      }

      // Mod+E - Export
      if (isModifierKey && key === 'e') {
        event.preventDefault();
        onExport?.();
      }

      // Mod+Shift+S - Share
      if (isModifierKey && isShiftKey && key === 's') {
        event.preventDefault();
        onShare?.();
      }

      // Mod+P - Preview
      if (isModifierKey && key === 'p') {
        event.preventDefault();
        onPreview?.();
      }

      // Mod+Z - Undo
      if (isModifierKey && !isShiftKey && key === 'z') {
        event.preventDefault();
        undo();
      }

      // Mod+Shift+Z or Mod+Y - Redo
      if ((isModifierKey && isShiftKey && key === 'z') || (isModifierKey && key === 'y')) {
        event.preventDefault();
        redo();
      }

      // Delete key - Delete current slide
      if (key === 'delete' && !isModifierKey && slides.length > 1) {
        event.preventDefault();
        deleteSlide(currentSlideIndex);
      }

      // Mod+D - Duplicate current slide
      if (isModifierKey && key === 'd' && !isShiftKey) {
        event.preventDefault();
        duplicateSlide(currentSlideIndex);
      }

      // Space - Play presentation (preview mode)
      if (key === ' ' && !isModifierKey) {
        event.preventDefault();
        onPreview?.();
      }

      // Escape - Exit preview mode or deselect element
      if (key === 'escape' && !isModifierKey) {
        event.preventDefault();
        // This would be handled by the preview state management
      }

      // Number keys (1-9) - Jump to slide
      if (!isModifierKey && !isShiftKey && /^[1-9]$/.test(key)) {
        event.preventDefault();
        const slideIndex = parseInt(key) - 1;
        if (slideIndex < slides.length) {
          setCurrentSlide(slideIndex);
        }
      }

      // Mod+Plus/Minus - Zoom in/out
      if (isModifierKey && (key === '=' || key === '+' || key === '-')) {
        event.preventDefault();
        // This would be handled by the canvas zoom state
      }

      // Tab - Navigate between elements (when not in input fields)
      if (key === 'tab' && !isModifierKey) {
        const target = event.target as HTMLElement;
        const isInputElement = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true';

        if (!isInputElement) {
          event.preventDefault();
          // Navigate to next element in current slide
        }
      }

      // Enter - Edit selected element (when not in input fields)
      if (key === 'enter' && !isModifierKey) {
        const target = event.target as HTMLElement;
        const isInputElement = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true';

        if (!isInputElement) {
          event.preventDefault();
          // Enter edit mode for selected element
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    slides,
    currentSlideIndex,
    setCurrentSlide,
    deleteSlide,
    duplicateSlide,
    undo,
    redo,
    onExport,
    onShare,
    onPreview,
    onSave,
  ]);

  // Save state before major operations
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Save current state before leaving
      saveToHistory();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveToHistory]);

  return {
    shortcuts: {
      'Ctrl/Cmd + S': 'Save presentation',
      'Ctrl/Cmd + E': 'Export presentation',
      'Ctrl/Cmd + Shift + S': 'Share presentation',
      'Ctrl/Cmd + P': 'Preview presentation',
      'Ctrl/Cmd + Z': 'Undo',
      'Ctrl/Cmd + Shift + Z': 'Redo',
      'Ctrl/Cmd + D': 'Duplicate slide',
      'Delete': 'Delete current slide',
      'Arrow Keys': 'Navigate slides',
      'Space': 'Play presentation',
      '1-9': 'Jump to slide',
      'Ctrl/Cmd + +/-': 'Zoom in/out',
      'Tab': 'Navigate elements',
      'Enter': 'Edit selected element',
      'Escape': 'Exit preview mode',
    },
  };
}