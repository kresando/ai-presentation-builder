import { useEffect, useRef } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { Slide } from '@/db/schema/presentations';

interface AutoSaveOptions {
  presentationId: string;
  debounceMs?: number;
  onSave?: (success: boolean) => void;
}

export function useAutoSave({ presentationId, debounceMs = 2000, onSave }: AutoSaveOptions) {
  const { slides, currentSlideIndex } = useEditorStore();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedStateRef = useRef<string>('');

  useEffect(() => {
    // Create a string representation of the current state for comparison
    const currentState = JSON.stringify({ slides, currentSlideIndex });

    // Only save if the state has actually changed
    if (currentState === lastSavedStateRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/presentations/${presentationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slides: slides,
            currentSlideIndex: currentSlideIndex,
          }),
        });

        if (response.ok) {
          lastSavedStateRef.current = currentState;
          onSave?.(true);
        } else {
          onSave?.(false);
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
        onSave?.(false);
      }
    }, debounceMs);

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [slides, currentSlideIndex, presentationId, debounceMs, onSave]);

  // Force save function
  const forceSave = async () => {
    try {
      const currentState = JSON.stringify({ slides, currentSlideIndex });

      const response = await fetch(`/api/presentations/${presentationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slides: slides,
          currentSlideIndex: currentSlideIndex,
        }),
      });

      if (response.ok) {
        lastSavedStateRef.current = currentState;
        onSave?.(true);
        return true;
      } else {
        onSave?.(false);
        return false;
      }
    } catch (error) {
      console.error('Force save failed:', error);
      onSave?.(false);
      return false;
    }
  };

  return { forceSave };
}