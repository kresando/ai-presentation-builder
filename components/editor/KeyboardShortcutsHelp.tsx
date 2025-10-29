'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircleIcon } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  shortcuts?: Record<string, string>;
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  shortcuts,
}) => {
  const defaultShortcuts = {
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
  };

  const shortcutsList = shortcuts || defaultShortcuts;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Keyboard Shortcuts">
          <HelpCircleIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">File & Edit</h4>
            {Object.entries(shortcutsList)
              .filter(([key]) => key.includes('Ctrl') || key.includes('Save') || key.includes('Undo') || key.includes('Redo'))
              .map(([shortcut, description]) => (
                <div key={shortcut} className="flex justify-between items-center py-1">
                  <span className="text-sm">{description}</span>
                  <kbd className="px-2 py-1 text-xs bg-muted border border-border rounded">
                    {shortcut}
                  </kbd>
                </div>
              ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">Navigation</h4>
            {Object.entries(shortcutsList)
              .filter(([key]) => key.includes('Arrow') || key.includes('Space') || key.includes('1-9') || key.includes('Delete'))
              .map(([shortcut, description]) => (
                <div key={shortcut} className="flex justify-between items-center py-1">
                  <span className="text-sm">{description}</span>
                  <kbd className="px-2 py-1 text-xs bg-muted border border-border rounded">
                    {shortcut}
                  </kbd>
                </div>
              ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">View & Display</h4>
            {Object.entries(shortcutsList)
              .filter(([key]) => key.includes('Zoom') || key.includes('Preview') || key.includes('Escape'))
              .map(([shortcut, description]) => (
                <div key={shortcut} className="flex justify-between items-center py-1">
                  <span className="text-sm">{description}</span>
                  <kbd className="px-2 py-1 text-xs bg-muted border border-border rounded">
                    {shortcut}
                  </kbd>
                </div>
              ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground">Element Editing</h4>
            {Object.entries(shortcutsList)
              .filter(([key]) => key.includes('Tab') || key.includes('Enter') || key.includes('Duplicate'))
              .map(([shortcut, description]) => (
                <div key={shortcut} className="flex justify-between items-center py-1">
                  <span className="text-sm">{description}</span>
                  <kbd className="px-2 py-1 text-xs bg-muted border border-border rounded">
                    {shortcut}
                  </kbd>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-6 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Pro tip:</strong> Most shortcuts work both on Windows (Ctrl) and Mac (Cmd) keyboards.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};