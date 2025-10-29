'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Undo2Icon,
  Redo2Icon,
  SaveIcon,
  DownloadIcon,
  ShareIcon,
  EyeIcon,
  Grid3x3Icon,
  ZoomInIcon,
  ZoomOutIcon,
  Maximize2Icon,
  PlayIcon,
  HelpCircleIcon,
} from 'lucide-react';

interface ToolbarProps {
  onSave?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onPreview?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onToggleGrid?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  zoom?: number;
  showGrid?: boolean;
  isPreviewMode?: boolean;
  title?: string;
  onTitleChange?: (title: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onExport,
  onShare,
  onPreview,
  onUndo,
  onRedo,
  onToggleGrid,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  canUndo = false,
  canRedo = false,
  zoom = 1,
  showGrid = false,
  isPreviewMode = false,
  title,
  onTitleChange,
}) => {
  return (
    <div className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {title && onTitleChange && (
          <>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-lg font-semibold border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 w-auto"
              placeholder="Untitled Presentation"
            />
            <Separator orientation="vertical" className="h-6" />
          </>
        )}

        {/* Edit Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2Icon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2Icon className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* File Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            title="Save (Ctrl+S)"
          >
            <SaveIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            title="Export (Ctrl+E)"
          >
            <DownloadIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            title="Share (Ctrl+Shift+S)"
          >
            <ShareIcon className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* View Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant={isPreviewMode ? 'secondary' : 'ghost'}
            size="sm"
            onClick={onPreview}
            title="Preview (Ctrl+P)"
          >
            {isPreviewMode ? (
              <EyeIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant={showGrid ? 'secondary' : 'ghost'}
            size="sm"
            onClick={onToggleGrid}
            title="Toggle Grid"
          >
            <Grid3x3Icon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            disabled={zoom <= 0.25}
            title="Zoom Out (Ctrl+-)"
          >
            <ZoomOutIcon className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            disabled={zoom >= 2}
            title="Zoom In (Ctrl++)"
          >
            <ZoomInIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomReset}
            title="Fit to Screen"
          >
            <Maximize2Icon className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Help */}
        <Button
          variant="ghost"
          size="sm"
          title="Keyboard Shortcuts (Ctrl+?)"
        >
          <HelpCircleIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};