import { TemplateLayoutConfig, TemplateCategory, ElementType } from '@/db/schema/presentations';

// Blank Templates
export const blankTemplate: TemplateLayoutConfig = {
  name: 'Blank',
  category: 'basic',
  description: 'A blank canvas for complete creative freedom',
  elements: [],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

export const titleTemplate: TemplateLayoutConfig = {
  name: 'Title Slide',
  category: 'basic',
  description: 'Perfect for presentation openings',
  elements: [
    {
      id: 'title',
      type: 'heading',
      defaultPosition: { x: 0, y: 0.3, width: 1, height: 0.3 },
      defaultStyling: {
        fontSize: 48,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
      },
      placeholder: 'Enter your title',
      isRequired: true,
    },
    {
      id: 'subtitle',
      type: 'text',
      defaultPosition: { x: 0, y: 0.55, width: 1, height: 0.2 },
      defaultStyling: {
        fontSize: 24,
        fontFamily: 'Inter',
        color: '#6b7280',
        textAlign: 'center',
      },
      placeholder: 'Enter your subtitle',
      isRequired: false,
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

export const titleWithBulletsTemplate: TemplateLayoutConfig = {
  name: 'Title with Bullets',
  category: 'basic',
  description: 'Title with bullet points for content',
  elements: [
    {
      id: 'title',
      type: 'heading',
      defaultPosition: { x: 0, y: 0.1, width: 1, height: 0.25 },
      defaultStyling: {
        fontSize: 42,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'left',
      },
      placeholder: 'Enter your title',
      isRequired: true,
    },
    {
      id: 'bullets',
      type: 'bullet',
      defaultPosition: { x: 0, y: 0.4, width: 1, height: 0.5 },
      defaultStyling: {
        fontSize: 20,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'left',
      },
      placeholder: 'Enter bullet points',
      isRequired: true,
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

// Two Column Layouts
export const twoColumnsTemplate: TemplateLayoutConfig = {
  name: 'Two Columns',
  category: 'content',
  description: 'Split content into two columns',
  elements: [
    {
      id: 'left-title',
      type: 'subheading',
      defaultPosition: { x: 0, y: 0.1, width: 0.45, height: 0.15 },
      defaultStyling: {
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'left',
      },
      placeholder: 'Left column title',
      isRequired: false,
    },
    {
      id: 'left-content',
      type: 'text',
      defaultPosition: { x: 0, y: 0.25, width: 0.45, height: 0.65 },
      defaultStyling: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'left',
      },
      placeholder: 'Left column content',
      isRequired: false,
    },
    {
      id: 'right-title',
      type: 'subheading',
      defaultPosition: { x: 0.55, y: 0.1, width: 0.45, height: 0.15 },
      defaultStyling: {
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'left',
      },
      placeholder: 'Right column title',
      isRequired: false,
    },
    {
      id: 'right-content',
      type: 'text',
      defaultPosition: { x: 0.55, y: 0.25, width: 0.45, height: 0.65 },
      defaultStyling: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'left',
      },
      placeholder: 'Right column content',
      isRequired: false,
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

export const imageAndTextTemplate: TemplateLayoutConfig = {
  name: 'Image and Text',
  category: 'media',
  description: 'Image on left, text on right',
  elements: [
    {
      id: 'image',
      type: 'image',
      defaultPosition: { x: 0, y: 0.1, width: 0.45, height: 0.8 },
      defaultStyling: {
        borderRadius: 8,
        objectFit: 'cover',
      },
      placeholder: 'Add image',
      isRequired: true,
    },
    {
      id: 'title',
      type: 'subheading',
      defaultPosition: { x: 0.55, y: 0.1, width: 0.45, height: 0.2 },
      defaultStyling: {
        fontSize: 28,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'left',
      },
      placeholder: 'Enter title',
      isRequired: false,
    },
    {
      id: 'content',
      type: 'text',
      defaultPosition: { x: 0.55, y: 0.3, width: 0.45, height: 0.6 },
      defaultStyling: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'left',
      },
      placeholder: 'Enter content',
      isRequired: false,
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

// Three Column Layout
export const threeColumnsTemplate: TemplateLayoutConfig = {
  name: 'Three Columns',
  category: 'content',
  description: 'Content organized in three columns',
  elements: [
    {
      id: 'main-title',
      type: 'heading',
      defaultPosition: { x: 0, y: 0.05, width: 1, height: 0.15 },
      defaultStyling: {
        fontSize: 36,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
      },
      placeholder: 'Enter main title',
      isRequired: false,
    },
    {
      id: 'col1-title',
      type: 'subheading',
      defaultPosition: { x: 0, y: 0.25, width: 0.3, height: 0.1 },
      defaultStyling: {
        fontSize: 20,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'center',
      },
      placeholder: 'Column 1 title',
      isRequired: false,
    },
    {
      id: 'col1-content',
      type: 'text',
      defaultPosition: { x: 0, y: 0.35, width: 0.3, height: 0.55 },
      defaultStyling: {
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'center',
      },
      placeholder: 'Column 1 content',
      isRequired: false,
    },
    {
      id: 'col2-title',
      type: 'subheading',
      defaultPosition: { x: 0.35, y: 0.25, width: 0.3, height: 0.1 },
      defaultStyling: {
        fontSize: 20,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'center',
      },
      placeholder: 'Column 2 title',
      isRequired: false,
    },
    {
      id: 'col2-content',
      type: 'text',
      defaultPosition: { x: 0.35, y: 0.35, width: 0.3, height: 0.55 },
      defaultStyling: {
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'center',
      },
      placeholder: 'Column 2 content',
      isRequired: false,
    },
    {
      id: 'col3-title',
      type: 'subheading',
      defaultPosition: { x: 0.7, y: 0.25, width: 0.3, height: 0.1 },
      defaultStyling: {
        fontSize: 20,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'center',
      },
      placeholder: 'Column 3 title',
      isRequired: false,
    },
    {
      id: 'col3-content',
      type: 'text',
      defaultPosition: { x: 0.7, y: 0.35, width: 0.3, height: 0.55 },
      defaultStyling: {
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'center',
      },
      placeholder: 'Column 3 content',
      isRequired: false,
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

// Timeline Template
export const timelineTemplate: TemplateLayoutConfig = {
  name: 'Timeline',
  category: 'timeline',
  description: 'Display events in chronological order',
  elements: [
    {
      id: 'title',
      type: 'heading',
      defaultPosition: { x: 0, y: 0.05, width: 1, height: 0.15 },
      defaultStyling: {
        fontSize: 36,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
      },
      placeholder: 'Timeline title',
      isRequired: false,
    },
    {
      id: 'timeline-events',
      type: 'bullet',
      defaultPosition: { x: 0.1, y: 0.25, width: 0.8, height: 0.65 },
      defaultStyling: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'left',
      },
      placeholder: 'Add timeline events',
      isRequired: true,
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

// Data/Chart Templates
export const barChartTemplate: TemplateLayoutConfig = {
  name: 'Bar Chart',
  category: 'data',
  description: 'Display data with bar charts',
  elements: [
    {
      id: 'title',
      type: 'heading',
      defaultPosition: { x: 0, y: 0.05, width: 1, height: 0.15 },
      defaultStyling: {
        fontSize: 32,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
      },
      placeholder: 'Chart title',
      isRequired: false,
    },
    {
      id: 'chart',
      type: 'chart',
      defaultPosition: { x: 0.1, y: 0.25, width: 0.8, height: 0.6 },
      defaultStyling: {
        borderRadius: 8,
      },
      placeholder: 'Chart data',
      isRequired: true,
    },
    {
      id: 'caption',
      type: 'text',
      defaultPosition: { x: 0, y: 0.85, width: 1, height: 0.1 },
      defaultStyling: {
        fontSize: 14,
        fontFamily: 'Inter',
        color: '#6b7280',
        textAlign: 'center',
      },
      placeholder: 'Chart caption or notes',
      isRequired: false,
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

// Process Templates
export const processFlowTemplate: TemplateLayoutConfig = {
  name: 'Process Flow',
  category: 'process',
  description: 'Show a process or workflow',
  elements: [
    {
      id: 'title',
      type: 'heading',
      defaultPosition: { x: 0, y: 0.05, width: 1, height: 0.15 },
      defaultStyling: {
        fontSize: 32,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
      },
      placeholder: 'Process title',
      isRequired: false,
    },
    {
      id: 'step1',
      type: 'text',
      defaultPosition: { x: 0.05, y: 0.3, width: 0.2, height: 0.15 },
      defaultStyling: {
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'center',
        borderRadius: 8,
        backgroundColor: '#e5e7eb',
      },
      placeholder: 'Step 1',
      isRequired: true,
    },
    {
      id: 'arrow1',
      type: 'shape',
      defaultPosition: { x: 0.25, y: 0.35, width: 0.1, height: 0.05 },
      defaultStyling: {
        color: '#6b7280',
      },
      placeholder: '→',
      isRequired: true,
    },
    {
      id: 'step2',
      type: 'text',
      defaultPosition: { x: 0.35, y: 0.3, width: 0.2, height: 0.15 },
      defaultStyling: {
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'center',
        borderRadius: 8,
        backgroundColor: '#e5e7eb',
      },
      placeholder: 'Step 2',
      isRequired: true,
    },
    {
      id: 'arrow2',
      type: 'shape',
      defaultPosition: { x: 0.55, y: 0.35, width: 0.1, height: 0.05 },
      defaultStyling: {
        color: '#6b7280',
      },
      placeholder: '→',
      isRequired: true,
    },
    {
      id: 'step3',
      type: 'text',
      defaultPosition: { x: 0.65, y: 0.3, width: 0.2, height: 0.15 },
      defaultStyling: {
        fontSize: 16,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'center',
        borderRadius: 8,
        backgroundColor: '#e5e7eb',
      },
      placeholder: 'Step 3',
      isRequired: true,
    },
    {
      id: 'description',
      type: 'text',
      defaultPosition: { x: 0, y: 0.5, width: 1, height: 0.4 },
      defaultStyling: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'center',
      },
      placeholder: 'Process description',
      isRequired: false,
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

// Comparison Template
export const comparisonTemplate: TemplateLayoutConfig = {
  name: 'Comparison',
  category: 'comparison',
  description: 'Compare two options side by side',
  elements: [
    {
      id: 'title',
      type: 'heading',
      defaultPosition: { x: 0, y: 0.05, width: 1, height: 0.15 },
      defaultStyling: {
        fontSize: 32,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
      },
      placeholder: 'Comparison title',
      isRequired: false,
    },
    {
      id: 'option1-title',
      type: 'subheading',
      defaultPosition: { x: 0.05, y: 0.25, width: 0.4, height: 0.1 },
      defaultStyling: {
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'center',
        backgroundColor: '#dbeafe',
        borderRadius: 8,
      },
      placeholder: 'Option 1',
      isRequired: true,
    },
    {
      id: 'option1-content',
      type: 'bullet',
      defaultPosition: { x: 0.05, y: 0.35, width: 0.4, height: 0.5 },
      defaultStyling: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'left',
      },
      placeholder: 'Option 1 details',
      isRequired: true,
    },
    {
      id: 'option2-title',
      type: 'subheading',
      defaultPosition: { x: 0.55, y: 0.25, width: 0.4, height: 0.1 },
      defaultStyling: {
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#1f2937',
        textAlign: 'center',
        backgroundColor: '#fee2e2',
        borderRadius: 8,
      },
      placeholder: 'Option 2',
      isRequired: true,
    },
    {
      id: 'option2-content',
      type: 'bullet',
      defaultPosition: { x: 0.55, y: 0.35, width: 0.4, height: 0.5 },
      defaultStyling: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'left',
      },
      placeholder: 'Option 2 details',
      isRequired: true,
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

// Quote Template
export const quoteTemplate: TemplateLayoutConfig = {
  name: 'Quote',
  category: 'specialized',
  description: 'Highlight an important quote',
  elements: [
    {
      id: 'quote',
      type: 'quote',
      defaultPosition: { x: 0.1, y: 0.3, width: 0.8, height: 0.3 },
      defaultStyling: {
        fontSize: 32,
        fontFamily: 'Inter',
        fontWeight: '300',
        color: '#1f2937',
        textAlign: 'center',
        fontStyle: 'italic',
      },
      placeholder: 'Enter quote',
      isRequired: true,
    },
    {
      id: 'author',
      type: 'text',
      defaultPosition: { x: 0.1, y: 0.65, width: 0.8, height: 0.1 },
      defaultStyling: {
        fontSize: 18,
        fontFamily: 'Inter',
        fontWeight: 'semibold',
        color: '#6b7280',
        textAlign: 'right',
      },
      placeholder: '— Author',
      isRequired: false,
    },
  ],
  defaultStyles: {
    backgroundColor: '#f9fafb',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

// Gallery Template
export const galleryTemplate: TemplateLayoutConfig = {
  name: 'Image Gallery',
  category: 'gallery',
  description: 'Showcase multiple images',
  elements: [
    {
      id: 'title',
      type: 'heading',
      defaultPosition: { x: 0, y: 0.05, width: 1, height: 0.15 },
      defaultStyling: {
        fontSize: 32,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
      },
      placeholder: 'Gallery title',
      isRequired: false,
    },
    {
      id: 'image1',
      type: 'image',
      defaultPosition: { x: 0.05, y: 0.25, width: 0.4, height: 0.35 },
      defaultStyling: {
        borderRadius: 8,
        objectFit: 'cover',
      },
      placeholder: 'Image 1',
      isRequired: true,
    },
    {
      id: 'image2',
      type: 'image',
      defaultPosition: { x: 0.55, y: 0.25, width: 0.4, height: 0.35 },
      defaultStyling: {
        borderRadius: 8,
        objectFit: 'cover',
      },
      placeholder: 'Image 2',
      isRequired: false,
    },
    {
      id: 'image3',
      type: 'image',
      defaultPosition: { x: 0.05, y: 0.65, width: 0.4, height: 0.25 },
      defaultStyling: {
        borderRadius: 8,
        objectFit: 'cover',
      },
      placeholder: 'Image 3',
      isRequired: false,
    },
    {
      id: 'image4',
      type: 'image',
      defaultPosition: { x: 0.55, y: 0.65, width: 0.4, height: 0.25 },
      defaultStyling: {
        borderRadius: 8,
        objectFit: 'cover',
      },
      placeholder: 'Image 4',
      isRequired: false,
    },
  ],
  defaultStyles: {
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 16,
  },
  placeholders: [],
};

// All templates export
export const ALL_TEMPLATES = [
  blankTemplate,
  titleTemplate,
  titleWithBulletsTemplate,
  twoColumnsTemplate,
  imageAndTextTemplate,
  threeColumnsTemplate,
  timelineTemplate,
  barChartTemplate,
  processFlowTemplate,
  comparisonTemplate,
  quoteTemplate,
  galleryTemplate,
];

export const TEMPLATES_BY_CATEGORY = {
  basic: [blankTemplate, titleTemplate, titleWithBulletsTemplate],
  content: [twoColumnsTemplate, threeColumnsTemplate],
  media: [imageAndTextTemplate],
  timeline: [timelineTemplate],
  data: [barChartTemplate],
  process: [processFlowTemplate],
  comparison: [comparisonTemplate],
  gallery: [galleryTemplate],
  specialized: [quoteTemplate],
};