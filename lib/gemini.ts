import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Zod schema for validating AI-generated presentation content
const slideSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['title', 'content', 'bullet-points', 'image']).default('content'),
  content: z.object({
    text: z.string().optional(),
    bulletPoints: z.array(z.string()).optional(),
    image: z.string().optional(),
    layout: z.string().optional(),
    speakerNotes: z.string().optional(),
  }),
});

const presentationSchema = z.object({
  title: z.string().min(1),
  slides: z.array(slideSchema).min(1),
});

export type GeneratedSlide = z.infer<typeof slideSchema>;
export type GeneratedPresentation = z.infer<typeof presentationSchema>;

/**
 * Generate presentation content using Gemini AI
 */
export async function generatePresentation(
  prompt: string,
  slideCount: number = 5
): Promise<GeneratedPresentation> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const engineeredPrompt = `
You are an expert presentation designer. Create a professional presentation based on the following user request: "${prompt}"

Requirements:
1. Generate exactly ${slideCount} slides
2. Create a compelling presentation title
3. Each slide should have a clear title and structured content
4. Include different slide types: title, content, bullet-points
5. Content should be professional, engaging, and well-structured
6. Return the response as valid JSON matching this structure:
{
  "title": "Presentation Title",
  "slides": [
    {
      "title": "Slide Title",
      "type": "title|content|bullet-points",
      "content": {
        "text": "Main content text (for content slides)",
        "bulletPoints": ["point 1", "point 2", "point 3"] (for bullet-point slides),
        "layout": "layout suggestion (optional)",
        "speakerNotes": "Additional context for presenter (optional)"
      }
    }
  ]
}

Important guidelines:
- Title slide should be type "title" with minimal content
- Content slides should be type "content" with clear, concise text
- Bullet point slides should be type "bullet-points" with 3-5 key points
- Keep content brief and impactful - no more than 2-3 sentences per content slide
- Focus on clear, professional communication
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

    // Validate the response structure
    const validatedResponse = presentationSchema.parse(parsedResponse);

    return validatedResponse;
  } catch (error) {
    console.error('Error generating presentation:', error);
    throw new Error('Failed to generate presentation content');
  }
}

/**
 * Generate slide suggestions for editing existing slides
 */
export async function generateSlideSuggestions(
  currentSlide: GeneratedSlide,
  instruction: string
): Promise<GeneratedSlide> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const engineeredPrompt = `
You are an expert presentation editor. Modify the following slide based on the user's instruction.

Current slide:
Title: "${currentSlide.title}"
Type: "${currentSlide.type}"
Content: ${JSON.stringify(currentSlide.content, null, 2)}

User instruction: "${instruction}"

Modify the slide according to the instruction while maintaining:
1. Professional quality
2. Clear structure
3. Appropriate content length
4. Consistent formatting

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

    const validatedResponse = slideSchema.parse(parsedResponse);

    return validatedResponse;
  } catch (error) {
    console.error('Error modifying slide:', error);
    throw new Error('Failed to modify slide content');
  }
}