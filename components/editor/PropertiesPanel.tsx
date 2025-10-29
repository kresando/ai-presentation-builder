'use client';

import React, { useState } from 'react';
import { Slide, SlideElement, ElementType } from '@/db/schema/presentations';
import { templateRegistry } from '@/lib/templates';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PaletteIcon,
  TypeIcon,
  ImageIcon,
  LayoutIcon,
  SettingsIcon,
  PlusIcon,
  TrashIcon,
  MoveIcon,
  RotateCwIcon,
} from 'lucide-react';

interface PropertiesPanelProps {
  slide: Slide | null;
  selectedElementId: string | null;
  onSlideUpdate: (slideIndex: number, updates: Partial<Slide>) => void;
  onElementUpdate: (elementId: string, updates: Partial<SlideElement>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  slide,
  selectedElementId,
  onSlideUpdate,
  onElementUpdate,
}) => {
  const [activeTab, setActiveTab] = useState('slide');

  const selectedElement = slide?.content.elements?.find(el => el.id === selectedElementId);

  const handleSlidePropertyChange = (property: string, value: any) => {
    if (!slide) return;
    onSlideUpdate(0, { [property]: value });
  };

  const handleElementPropertyChange = (property: string, value: any) => {
    if (!selectedElement) return;
    onElementUpdate(selectedElement.id, { [property]: value });
  };

  const handleElementStylingChange = (property: string, value: any) => {
    if (!selectedElement) return;
    onElementUpdate(selectedElement.id, {
      styling: {
        ...selectedElement.styling,
        [property]: value,
      },
    });
  };

  const handleElementContentChange = (property: string, value: any) => {
    if (!selectedElement) return;
    onElementUpdate(selectedElement.id, {
      content: {
        ...selectedElement.content,
        [property]: value,
      },
    });
  };

  const addElement = (type: ElementType) => {
    if (!slide) return;

    const newElement: SlideElement = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: {
        text: type === 'heading' ? 'New Heading' : type === 'text' ? 'New Text' : '',
        bulletPoints: type === 'bullet' ? ['Point 1', 'Point 2'] : undefined,
      },
      position: { x: 0.1, y: 0.1, width: 0.8, height: 0.2 },
      styling: {
        fontSize: type === 'heading' ? 32 : 16,
        fontFamily: 'Inter',
        color: '#1f2937',
        textAlign: 'left',
      },
      animation: undefined,
    };

    // Add element to slide
    const updatedElements = [...(slide.content.elements || []), newElement];
    onSlideUpdate(0, {
      content: {
        ...slide.content,
        elements: updatedElements,
      },
    });
  };

  const deleteElement = () => {
    if (!selectedElement || !slide) return;

    const updatedElements = slide.content.elements?.filter(el => el.id !== selectedElement.id) || [];
    onSlideUpdate(0, {
      content: {
        ...slide.content,
        elements: updatedElements,
      },
    });
  };

  const applyTemplate = (templateId: string) => {
    if (!slide) return;

    const template = templateRegistry.getTemplate(templateId);
    if (!template) return;

    const templateElements = template.elements.map(element => ({
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: element.type,
      content: {
        text: element.placeholder || '',
        bulletPoints: element.type === 'bullet' ? ['Point 1', 'Point 2'] : undefined,
      },
      position: element.defaultPosition,
      styling: element.defaultStyling,
      animation: undefined,
    }));

    onSlideUpdate(0, {
      content: {
        ...slide.content,
        elements: templateElements,
      },
      templateId,
      layoutType: template.name,
      backgroundColor: template.defaultStyles.backgroundColor,
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Properties</h3>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="px-4 pt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="slide" className="text-xs">
                <LayoutIcon className="w-3 h-3 mr-1" />
                Slide
              </TabsTrigger>
              <TabsTrigger value="element" className="text-xs" disabled={!selectedElement}>
                <TypeIcon className="w-3 h-3 mr-1" />
                Element
              </TabsTrigger>
              <TabsTrigger value="add" className="text-xs">
                <PlusIcon className="w-3 h-3 mr-1" />
                Add
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Slide Properties Tab */}
          <TabsContent value="slide" className="p-4 space-y-6">
            {/* Slide Background */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Background
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={slide?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleSlidePropertyChange('backgroundColor', e.target.value)}
                  className="w-12 h-8 p-0 border-0"
                />
                <Input
                  value={slide?.backgroundColor || '#ffffff'}
                  onChange={(e) => handleSlidePropertyChange('backgroundColor', e.target.value)}
                  className="flex-1"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Template
              </Label>
              <Select
                value={slide?.templateId || ''}
                onValueChange={applyTemplate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose template" />
                </SelectTrigger>
                <SelectContent>
                  {templateRegistry.getAllTemplates().map((template) => (
                    <SelectItem key={template.name} value={template.name.toLowerCase().replace(/\s+/g, '-')}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Layout Settings */}
            <Accordion type="single" collapsible>
              <AccordionItem value="layout">
                <AccordionTrigger className="text-sm">Layout Settings</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1 block">
                      Transition Effect
                    </Label>
                    <Select
                      value={slide?.transitionEffect || 'none'}
                      onValueChange={(value) => handleSlidePropertyChange('transitionEffect', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="fade">Fade</SelectItem>
                        <SelectItem value="slide">Slide</SelectItem>
                        <SelectItem value="zoom">Zoom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-600 mb-1 block">
                      Transition Duration (ms)
                    </Label>
                    <Slider
                      value={[slide?.transitionDuration || 300]}
                      onValueChange={([value]) => handleSlidePropertyChange('transitionDuration', value)}
                      min={100}
                      max={2000}
                      step={100}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {slide?.transitionDuration || 300}ms
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="speaker-notes">
                <AccordionTrigger className="text-sm">Speaker Notes</AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    value={slide?.speakerNotes || ''}
                    onChange={(e) => handleSlidePropertyChange('speakerNotes', e.target.value)}
                    placeholder="Add speaker notes for this slide..."
                    rows={4}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          {/* Element Properties Tab */}
          <TabsContent value="element" className="p-4 space-y-6">
            {selectedElement ? (
              <>
                {/* Element Type and Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700 capitalize">
                    {selectedElement.type}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteElement}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>

                {/* Content Properties */}
                {(selectedElement.type === 'text' ||
                  selectedElement.type === 'heading' ||
                  selectedElement.type === 'subheading') && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Text Content
                    </Label>
                    <Textarea
                      value={selectedElement.content.text || ''}
                      onChange={(e) => handleElementContentChange('text', e.target.value)}
                      placeholder="Enter text..."
                      rows={3}
                    />
                  </div>
                )}

                {selectedElement.type === 'bullet' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Bullet Points
                    </Label>
                    <div className="space-y-2">
                      {selectedElement.content.bulletPoints?.map((point, index) => (
                        <Input
                          key={index}
                          value={point}
                          onChange={(e) => {
                            const newBullets = [...(selectedElement.content.bulletPoints || [])];
                            newBullets[index] = e.target.value;
                            handleElementContentChange('bulletPoints', newBullets);
                          }}
                          placeholder={`Point ${index + 1}`}
                        />
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newBullets = [...(selectedElement.content.bulletPoints || []), ''];
                          handleElementContentChange('bulletPoints', newBullets);
                        }}
                      >
                        <PlusIcon className="w-3 h-3 mr-1" />
                        Add Point
                      </Button>
                    </div>
                  </div>
                )}

                {/* Styling Properties */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="styling">
                    <AccordionTrigger className="text-sm">Styling</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Typography */}
                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-2 block">
                          Typography
                        </Label>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Font Size</Label>
                            <Slider
                              value={[selectedElement.styling?.fontSize || 16]}
                              onValueChange={([value]) => handleElementStylingChange('fontSize', value)}
                              min={8}
                              max={72}
                              className="w-full"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                              {selectedElement.styling?.fontSize || 16}px
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Font Family</Label>
                            <Select
                              value={selectedElement.styling?.fontFamily || 'Inter'}
                              onValueChange={(value) => handleElementStylingChange('fontFamily', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Inter">Inter</SelectItem>
                                <SelectItem value="Arial">Arial</SelectItem>
                                <SelectItem value="Helvetica">Helvetica</SelectItem>
                                <SelectItem value="Georgia">Georgia</SelectItem>
                                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                <SelectItem value="Courier New">Courier New</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Text Align</Label>
                            <Select
                              value={selectedElement.styling?.textAlign || 'left'}
                              onValueChange={(value) => handleElementStylingChange('textAlign', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                                <SelectItem value="justify">Justify</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Colors */}
                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-2 block">
                          Colors
                        </Label>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Text Color</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="color"
                                value={selectedElement.styling?.color || '#1f2937'}
                                onChange={(e) => handleElementStylingChange('color', e.target.value)}
                                className="w-8 h-8 p-0 border-0"
                              />
                              <Input
                                value={selectedElement.styling?.color || '#1f2937'}
                                onChange={(e) => handleElementStylingChange('color', e.target.value)}
                                className="flex-1 text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Background</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="color"
                                value={selectedElement.styling?.backgroundColor || '#ffffff'}
                                onChange={(e) => handleElementStylingChange('backgroundColor', e.target.value)}
                                className="w-8 h-8 p-0 border-0"
                              />
                              <Input
                                value={selectedElement.styling?.backgroundColor || '#ffffff'}
                                onChange={(e) => handleElementStylingChange('backgroundColor', e.target.value)}
                                className="flex-1 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Position */}
                      <div>
                        <Label className="text-xs font-medium text-gray-600 mb-2 block">
                          Position
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">X (%)</Label>
                            <Input
                              type="number"
                              value={Math.round(selectedElement.position.x * 100)}
                              onChange={(e) => {
                                const newX = Math.max(0, Math.min(100, Number(e.target.value))) / 100;
                                handleElementPropertyChange('position', {
                                  ...selectedElement.position,
                                  x: newX,
                                });
                              }}
                              min="0"
                              max="100"
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Y (%)</Label>
                            <Input
                              type="number"
                              value={Math.round(selectedElement.position.y * 100)}
                              onChange={(e) => {
                                const newY = Math.max(0, Math.min(100, Number(e.target.value))) / 100;
                                handleElementPropertyChange('position', {
                                  ...selectedElement.position,
                                  y: newY,
                                });
                              }}
                              min="0"
                              max="100"
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Width (%)</Label>
                            <Input
                              type="number"
                              value={Math.round(selectedElement.position.width * 100)}
                              onChange={(e) => {
                                const newWidth = Math.max(1, Math.min(100, Number(e.target.value))) / 100;
                                handleElementPropertyChange('position', {
                                  ...selectedElement.position,
                                  width: newWidth,
                                });
                              }}
                              min="1"
                              max="100"
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Height (%)</Label>
                            <Input
                              type="number"
                              value={Math.round(selectedElement.position.height * 100)}
                              onChange={(e) => {
                                const newHeight = Math.max(1, Math.min(100, Number(e.target.value))) / 100;
                                handleElementPropertyChange('position', {
                                  ...selectedElement.position,
                                  height: newHeight,
                                });
                              }}
                              min="1"
                              max="100"
                              className="text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <TypeIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No element selected</p>
                <p className="text-xs">Click on an element to edit its properties</p>
              </div>
            )}
          </TabsContent>

          {/* Add Elements Tab */}
          <TabsContent value="add" className="p-4 space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Add Element
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addElement('heading')}
                  className="h-auto py-3 flex flex-col items-center gap-1"
                >
                  <TypeIcon className="w-4 h-4" />
                  <span className="text-xs">Heading</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addElement('text')}
                  className="h-auto py-3 flex flex-col items-center gap-1"
                >
                  <TypeIcon className="w-4 h-4" />
                  <span className="text-xs">Text</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addElement('bullet')}
                  className="h-auto py-3 flex flex-col items-center gap-1"
                >
                  <TypeIcon className="w-4 h-4" />
                  <span className="text-xs">Bullets</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addElement('image')}
                  className="h-auto py-3 flex flex-col items-center gap-1"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-xs">Image</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addElement('chart')}
                  className="h-auto py-3 flex flex-col items-center gap-1"
                >
                  <LayoutIcon className="w-4 h-4" />
                  <span className="text-xs">Chart</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addElement('table')}
                  className="h-auto py-3 flex flex-col items-center gap-1"
                >
                  <LayoutIcon className="w-4 h-4" />
                  <span className="text-xs">Table</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addElement('shape')}
                  className="h-auto py-3 flex flex-col items-center gap-1"
                >
                  <LayoutIcon className="w-4 h-4" />
                  <span className="text-xs">Shape</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addElement('quote')}
                  className="h-auto py-3 flex flex-col items-center gap-1"
                >
                  <TypeIcon className="w-4 h-4" />
                  <span className="text-xs">Quote</span>
                </Button>
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Quick Templates
              </Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate('title-slide')}
                  className="w-full justify-start"
                >
                  <LayoutIcon className="w-4 h-4 mr-2" />
                  Title Slide
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate('two-columns')}
                  className="w-full justify-start"
                >
                  <LayoutIcon className="w-4 h-4 mr-2" />
                  Two Columns
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyTemplate('title-with-bullets')}
                  className="w-full justify-start"
                >
                  <LayoutIcon className="w-4 h-4 mr-2" />
                  Title + Bullets
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};