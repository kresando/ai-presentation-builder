import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { templateRegistry } from './templates';
import { TemplateLayoutConfig, SlideElementData, ElementType } from '@/db/schema/presentations';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Enhanced Zod schema for AI-generated slide elements
const slideElementSchema = z.object({
  id: z.string(),
  type: z.enum([
    'text', 'heading', 'subheading', 'bullet', 'image', 'shape',
    'chart', 'table', 'icon', 'video', 'code', 'quote'
  ]),
  content: z.object({
    text: z.string().optional(),
    imageUrl: z.string().optional(),
    altText: z.string().optional(),
    chartType: z.enum(['bar', 'line', 'pie', 'scatter', 'area']).optional(),
    chartData: z.object({
      labels: z.array(z.string()),
      datasets: z.array(z.object({
        label: z.string(),
        data: z.array(z.number()),
        backgroundColor: z.array(z.string()).optional(),
        borderColor: z.array(z.string()).optional(),
      })),
    }).optional(),
    tableData: z.object({
      headers: z.array(z.string()),
      rows: z.array(z.array(z.string())),
    }).optional(),
    icon: z.string().optional(),
    videoUrl: z.string().optional(),
    code: z.string().optional(),
    language: z.string().optional(),
    bulletPoints: z.array(z.string()).optional(),
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  styling: z.object({
    fontSize: z.number().optional(),
    fontFamily: z.string().optional(),
    fontWeight: z.string().optional(),
    color: z.string().optional(),
    backgroundColor: z.string().optional(),
    borderColor: z.string().optional(),
    borderWidth: z.number().optional(),
    borderRadius: z.number().optional(),
    textAlign: z.enum(['left', 'center', 'right', 'justify']).optional(),
    lineHeight: z.number().optional(),
    letterSpacing: z.number().optional(),
    opacity: z.number().optional(),
    rotation: z.number().optional(),
  }).optional(),
  animation: z.object({
    type: z.enum(['fadeIn', 'slideIn', 'zoomIn', 'bounce', 'rotate']).optional(),
    duration: z.number().optional(),
    delay: z.number().optional(),
    direction: z.enum(['left', 'right', 'up', 'down']).optional(),
  }).optional(),
});

// Enhanced slide schema
const slideSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['title', 'content', 'bullet-points', 'image', 'comparison', 'data', 'timeline', 'gallery', 'quote']).default('content'),
  templateId: z.string().optional(),
  layoutType: z.string().optional(),
  content: z.object({
    elements: z.array(slideElementSchema).optional(),
    text: z.string().optional(),
    bulletPoints: z.array(z.string()).optional(),
    image: z.string().optional(),
    layout: z.string().optional(),
    speakerNotes: z.string().optional(),
  }),
  backgroundColor: z.string().optional(),
  transitionEffect: z.enum(['none', 'fade', 'slide', 'zoom']).default('none'),
  transitionDuration: z.number().default(300),
});

const presentationSchema = z.object({
  title: z.string().min(1),
  theme: z.string().optional(),
  slides: z.array(slideSchema).min(1),
});

export type GeneratedSlideElement = z.infer<typeof slideElementSchema>;
export type GeneratedSlide = z.infer<typeof slideSchema>;
export type GeneratedPresentation = z.infer<typeof presentationSchema>;

// Template mapping for AI
const TEMPLATE_MAPPINGS = {
  'title': 'title-slide',
  'title-slide': 'title-slide',
  'introduction': 'title-slide',
  'overview': 'title-slide',
  'agenda': 'title-with-bullets',
  'summary': 'title-with-bullets',
  'conclusion': 'title-with-bullets',
  'comparison': 'comparison',
  'vs': 'comparison',
  'versus': 'comparison',
  'pros-cons': 'comparison',
  'data': 'bar-chart',
  'statistics': 'bar-chart',
  'chart': 'bar-chart',
  'graph': 'bar-chart',
  'timeline': 'timeline',
  'history': 'timeline',
  'process': 'process-flow',
  'workflow': 'process-flow',
  'steps': 'process-flow',
  'two-columns': 'two-columns',
  'side-by-side': 'two-columns',
  'image-text': 'image-and-text',
  'text-image': 'image-and-text',
  'gallery': 'image-gallery',
  'images': 'image-gallery',
  'quote': 'quote',
  'testimonial': 'quote',
  'three-columns': 'three-columns',
  'three-points': 'three-columns',
};

/**
 * Generate presentation content using Gemini AI with advanced template support
 */
export async function generatePresentation(
  prompt: string,
  slideCount: number = 5,
  theme: string = 'modern'
): Promise<GeneratedPresentation> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const availableTemplates = templateRegistry.getAllTemplates().map(t => t.name);
    const templateDescriptions = templateRegistry.getAllTemplates().map(t =>
      `${t.name}: ${t.description} (${t.category})`
    ).join('\n');

    const engineeredPrompt = `
You are an expert presentation designer. Create a professional presentation based on the following user request: "${prompt}"

Requirements:
1. Generate exactly ${slideCount} slides
2. Create a compelling presentation title
3. Use appropriate templates from our library for each slide type
4. Each slide should have a clear title, template selection, and structured elements
5. Content should be professional, engaging, and well-structured
6. Include diverse slide types and layouts for visual variety

Available templates:
${templateDescriptions}

Return the response as valid JSON matching this structure:
{
  "title": "Presentation Title",
  "theme": "${theme}",
  "slides": [
    {
      "title": "Slide Title",
      "type": "title|content|bullet-points|comparison|data|timeline|gallery|quote",
      "templateId": "template-name-from-list",
      "layoutType": "Layout name",
      "content": {
        "elements": [
          {
            "id": "unique-element-id",
            "type": "heading|text|bullet|image|chart|table|quote|shape",
            "content": {
              "text": "Content text or placeholder",
              "bulletPoints": ["point 1", "point 2"],
              "chartData": {
                "labels": ["Label1", "Label2"],
                "datasets": [{"label": "Dataset", "data": [10, 20]}]
              }
            },
            "position": {"x": 0.1, "y": 0.1, "width": 0.8, "height": 0.2},
            "styling": {
              "fontSize": 24,
              "fontFamily": "Inter",
              "color": "#1f2937",
              "textAlign": "center"
            }
          }
        ],
        "speakerNotes": "Additional context for presenter (optional)"
      },
      "backgroundColor": "#ffffff",
      "transitionEffect": "fade",
      "transitionDuration": 300
    }
  ]
}

Important guidelines:
- Start with a title slide using "Title Slide" template
- Include various slide types: content, bullet-points, comparison, data, timeline, etc.
- For data slides, suggest appropriate chart types and provide sample data
- For image slides, indicate where images should be placed
- Use realistic positioning coordinates (x, y, width, height as 0-1 percentages)
- Provide professional styling for all elements
- Keep content concise and impactful
- Suggest appropriate transitions for flow
- Respond with valid JSON only, no additional text or explanations
`;

    const result = await model.generateContent(engineeredPrompt);
    const response = result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    const cleanText = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Invalid response format from AI service');
    }

    // Post-process and validate the response
    const processedResponse = await processGeneratedPresentation(parsedResponse);
    const validatedResponse = presentationSchema.parse(processedResponse);

    return validatedResponse;
  } catch (error) {
    console.error('Error generating presentation:', error);
    throw new Error('Failed to generate presentation content');
  }
}

/**
 * Process and enhance the AI-generated presentation
 */
async function processGeneratedPresentation(presentation: any): Promise<any> {
  const processedSlides = await Promise.all(
    presentation.slides.map(async (slide: any, index: number) => {
      // Ensure templateId is valid
      let templateId = slide.templateId;
      if (templateId) {
        const template = templateRegistry.getTemplate(templateId);
        if (!template) {
          // Fallback to appropriate template based on type
          templateId = getFallbackTemplate(slide.type, index);
        }
      } else {
        templateId = getFallbackTemplate(slide.type, index);
      }

      // Process elements and ensure they have proper structure
      let elements = slide.content?.elements || [];

      // If no elements but has legacy content, convert it
      if (elements.length === 0 && slide.content) {
        elements = convertLegacyContent(slide, templateId);
      }

      // Validate and enhance each element
      elements = elements.map((element: any, elementIndex: number) => ({
        ...element,
        id: element.id || `element-${Date.now()}-${elementIndex}`,
        position: {
          x: element.position?.x || 0.1,
          y: element.position?.y || 0.1 + (elementIndex * 0.2),
          width: element.position?.width || 0.8,
          height: element.position?.height || 0.15,
        },
        styling: {
          fontSize: element.styling?.fontSize || getDefaultFontSize(element.type),
          fontFamily: element.styling?.fontFamily || 'Inter',
          color: element.styling?.color || '#1f2937',
          textAlign: element.styling?.textAlign || getDefaultTextAlign(element.type),
          ...element.styling,
        },
      }));

      return {
        ...slide,
        templateId,
        content: {
          ...slide.content,
          elements,
        },
        backgroundColor: slide.backgroundColor || '#ffffff',
        transitionEffect: slide.transitionEffect || getDefaultTransition(index),
        transitionDuration: slide.transitionDuration || 300,
      };
    })
  );

  return {
    ...presentation,
    theme: presentation.theme || 'modern',
    slides: processedSlides,
  };
}

/**
 * Get fallback template based on slide type and position
 */
function getFallbackTemplate(slideType: string, index: number): string {
  if (index === 0) return 'title-slide';

  switch (slideType) {
    case 'title': return 'title-slide';
    case 'bullet-points': return 'title-with-bullets';
    case 'comparison': return 'comparison';
    case 'data': return 'bar-chart';
    case 'timeline': return 'timeline';
    case 'gallery': return 'image-gallery';
    case 'quote': return 'quote';
    default: return index % 2 === 0 ? 'two-columns' : 'title-with-bullets';
  }
}

/**
 * Convert legacy content format to new element-based format
 */
function convertLegacyContent(slide: any, templateId: string): any[] {
  const template = templateRegistry.getTemplate(templateId);
  const elements: any[] = [];

  if (slide.title) {
    elements.push({
      id: `element-${Date.now()}-title`,
      type: 'heading',
      content: { text: slide.title },
      position: { x: 0.1, y: 0.1, width: 0.8, height: 0.2 },
      styling: {
        fontSize: 32,
        fontFamily: 'Inter',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
      },
    });
  }

  if (slide.content?.text) {
    elements.push({
      id: `element-${Date.now()}-content`,
      type: 'text',
      content: { text: slide.content.text },
      position: { x: 0.1, y: 0.4, width: 0.8, height: 0.4 },
      styling: {
        fontSize: 18,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'left',
      },
    });
  }

  if (slide.content?.bulletPoints) {
    elements.push({
      id: `element-${Date.now()}-bullets`,
      type: 'bullet',
      content: { bulletPoints: slide.content.bulletPoints },
      position: { x: 0.1, y: 0.3, width: 0.8, height: 0.5 },
      styling: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#374151',
        textAlign: 'left',
      },
    });
  }

  return elements;
}

/**
 * Get default font size for element type
 */
function getDefaultFontSize(type: string): number {
  switch (type) {
    case 'heading': return 32;
    case 'subheading': return 24;
    case 'text': return 16;
    case 'bullet': return 16;
    case 'quote': return 28;
    default: return 16;
  }
}

/**
 * Get default text alignment for element type
 */
function getDefaultTextAlign(type: string): string {
  switch (type) {
    case 'heading': return 'center';
    case 'subheading': return 'center';
    case 'quote': return 'center';
    default: return 'left';
  }
}

/**
 * Get default transition based on slide position
 */
function getDefaultTransition(index: number): string {
  const transitions = ['none', 'fade', 'slide', 'zoom'];
  return transitions[index % transitions.length];
}

/**
 * Generate slide suggestions for editing existing slides with template awareness
 */
export async function generateSlideSuggestions(
  currentSlide: GeneratedSlide,
  instruction: string
): Promise<GeneratedSlide> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const templateDescriptions = templateRegistry.getAllTemplates().map(t =>
      `${t.name}: ${t.description} (${t.category})`
    ).join('\n');

    const engineeredPrompt = `
You are an expert presentation editor. Modify the following slide based on the user's instruction.

Current slide:
Title: "${currentSlide.title}"
Type: "${currentSlide.type}"
Template: "${currentSlide.templateId || 'None'}"
Content: ${JSON.stringify(currentSlide.content, null, 2)}

Available templates:
${templateDescriptions}

User instruction: "${instruction}"

Modify the slide according to the instruction while maintaining:
1. Professional quality and visual consistency
2. Clear structure and logical flow
3. Appropriate content length and readability
4. Consistent formatting and styling
5. Proper element positioning (x, y, width, height as 0-1 percentages)

Guidelines:
- If the instruction suggests changing layout, recommend an appropriate template
- Maintain existing elements when possible unless instructed to replace them
- Ensure all elements have proper positioning and styling
- Keep content concise and impactful
- Use consistent styling with the current theme

Return the modified slide as valid JSON matching the same structure.
Respond with valid JSON only, no additional text or explanations.
`;

    const result = await model.generateContent(engineeredPrompt);
    const response = result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse slide modification response:', parseError);
      throw new Error('Invalid response format from AI service');
    }

    // Process and validate the response
    const processedResponse = await processGeneratedSlide(parsedResponse, currentSlide);
    const validatedResponse = slideSchema.parse(processedResponse);

    return validatedResponse;
  } catch (error) {
    console.error('Error modifying slide:', error);
    throw new Error('Failed to modify slide content');
  }
}

/**
 * Generate content suggestions for specific elements
 */
export async function generateElementContent(
  elementType: ElementType,
  instruction: string,
  context?: string
): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const engineeredPrompt = `
You are an expert content creator. Generate content for a ${elementType} element based on the user's instruction.

Element type: ${elementType}
User instruction: "${instruction}"
Context: ${context || 'No additional context'}

Generate appropriate content for this element type following these guidelines:

For text/heading/subheading:
- Create concise, impactful text
- Maintain professional tone
- Consider character limits and readability

For bullet points:
- Generate 3-5 key points
- Keep each point brief and clear
- Use parallel structure when possible

For chart data:
- Provide realistic, sample data
- Include appropriate labels and datasets
- Ensure data makes logical sense

For table data:
- Create structured tabular information
- Include clear headers
- Keep content organized and readable

For quotes:
- Generate inspirational or informative quotes
- Attribute appropriately if needed
- Keep length reasonable for slides

Return the content as valid JSON for this element type:
{
  "text": "Generated text content",
  "bulletPoints": ["point 1", "point 2", "point 3"],
  "chartData": {
    "labels": ["Label1", "Label2"],
    "datasets": [{"label": "Dataset", "data": [10, 20]}]
  },
  "tableData": {
    "headers": ["Header1", "Header2"],
    "rows": [["Value1", "Value2"], ["Value3", "Value4"]]
  }
}

Respond with valid JSON only, no additional text or explanations.
`;

    const result = await model.generateContent(engineeredPrompt);
    const response = result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse element content response:', parseError);
      throw new Error('Invalid response format from AI service');
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error generating element content:', error);
    throw new Error('Failed to generate element content');
  }
}

/**
 * Generate design suggestions for improving presentation aesthetics
 */
export async function generateDesignSuggestions(
  presentation: GeneratedPresentation
): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const engineeredPrompt = `
You are an expert presentation designer. Analyze this presentation and provide design improvement suggestions.

Presentation title: "${presentation.title}"
Theme: "${presentation.theme || 'modern'}"
Number of slides: ${presentation.slides.length}

Slide summary:
${presentation.slides.map((slide, index) =>
  `${index + 1}. "${slide.title}" (${slide.type}, template: ${slide.templateId || 'none'})`
).join('\n')}

Provide suggestions for:
1. Visual consistency and theme improvements
2. Slide flow and transitions
3. Layout and spacing optimization
4. Color scheme recommendations
5. Typography improvements
6. Content organization

Return suggestions as valid JSON:
{
  "theme": {
    "suggestedTheme": "modern",
    "primaryColor": "#3b82f6",
    "secondaryColor": "#64748b",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937"
  },
  "transitions": {
    "suggestedTransitionStyle": "fade",
    "slideTransitions": [
      {"slideIndex": 0, "transition": "fade", "duration": 300}
    ]
  },
  "layoutImprovements": [
    {
      "slideIndex": 1,
      "suggestion": "Use two-column layout for better content organization",
      "recommendedTemplate": "two-columns"
    }
  ],
  "contentOptimization": [
    {
      "slideIndex": 2,
      "suggestion": "Condense text to 3-4 key points for better readability"
    }
  ],
  "visualEnhancements": [
    {
      "slideIndex": 0,
      "suggestion": "Add a subtle background gradient for visual interest"
    }
  ]
}

Respond with valid JSON only, no additional text or explanations.
`;

    const result = await model.generateContent(engineeredPrompt);
    const response = result.response;
    const text = response.text();

    const cleanText = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse design suggestions response:', parseError);
      throw new Error('Invalid response format from AI service');
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error generating design suggestions:', error);
    throw new Error('Failed to generate design suggestions');
  }
}

/**
 * Process a single generated slide
 */
async function processGeneratedSlide(slide: any, originalSlide?: GeneratedSlide): Promise<any> {
  // Ensure templateId is valid
  let templateId = slide.templateId;
  if (templateId) {
    const template = templateRegistry.getTemplate(templateId);
    if (!template) {
      templateId = originalSlide?.templateId || 'title-slide';
    }
  } else {
    templateId = originalSlide?.templateId || 'title-slide';
  }

  // Process elements
  let elements = slide.content?.elements || [];
  elements = elements.map((element: any, elementIndex: number) => ({
    ...element,
    id: element.id || `element-${Date.now()}-${elementIndex}`,
    position: {
      x: element.position?.x || 0.1,
      y: element.position?.y || 0.1 + (elementIndex * 0.2),
      width: element.position?.width || 0.8,
      height: element.position?.height || 0.15,
    },
    styling: {
      fontSize: element.styling?.fontSize || getDefaultFontSize(element.type),
      fontFamily: element.styling?.fontFamily || 'Inter',
      color: element.styling?.color || '#1f2937',
      textAlign: element.styling?.textAlign || getDefaultTextAlign(element.type),
      ...element.styling,
    },
  }));

  return {
    ...slide,
    templateId,
    content: {
      ...slide.content,
      elements,
    },
    backgroundColor: slide.backgroundColor || originalSlide?.backgroundColor || '#ffffff',
    transitionEffect: slide.transitionEffect || originalSlide?.transitionEffect || 'fade',
    transitionDuration: slide.transitionDuration || originalSlide?.transitionDuration || 300,
  };
}