import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { db } from '@/db';
import { presentations, slides, type NewPresentation, type NewSlide } from '@/db/schema';
import { generatePresentation, type GeneratedPresentation } from '@/lib/gemini';
import { nanoid } from 'nanoid';

// Zod schema for validating the request body
const generateRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt too long'),
  theme: z.enum(['modern', 'classic', 'minimal', 'creative', 'professional']).default('modern'),
  slideCount: z.number().int().min(1).max(20).default(5),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Validate user authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validatedData = generateRequestSchema.parse(body);

    const { prompt, theme, slideCount } = validatedData;

    // 3. Generate presentation content using Gemini AI
    let generatedPresentation: GeneratedPresentation;
    try {
      generatedPresentation = await generatePresentation(prompt, slideCount);
    } catch (aiError) {
      console.error('AI generation failed:', aiError);
      return NextResponse.json(
        { error: 'Failed to generate presentation content. Please try again.' },
        { status: 500 }
      );
    }

    // 4. Save presentation and slides to database
    const presentationId = nanoid();
    const userId = session.user.id;

    // Create presentation record
    const newPresentation: NewPresentation = {
      id: presentationId,
      userId,
      title: generatedPresentation.title,
      theme,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      // Use a transaction to ensure all data is saved together
      await db.transaction(async (tx) => {
        // Insert presentation
        await tx.insert(presentations).values(newPresentation);

        // Insert slides
        const slidesToInsert: NewSlide[] = generatedPresentation.slides.map((slide, index) => ({
          id: nanoid(),
          presentationId,
          order: index + 1,
          type: slide.type,
          title: slide.title,
          content: slide.content,
          createdAt: new Date(),
        }));

        if (slidesToInsert.length > 0) {
          await tx.insert(slides).values(slidesToInsert);
        }
      });
    } catch (dbError) {
      console.error('Database save failed:', dbError);
      return NextResponse.json(
        { error: 'Failed to save presentation. Please try again.' },
        { status: 500 }
      );
    }

    // 5. Return success response
    return NextResponse.json({
      success: true,
      presentationId,
      title: generatedPresentation.title,
      slideCount: generatedPresentation.slides.length,
      theme,
    });

  } catch (error) {
    console.error('Presentation generation error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle GET requests to provide API information
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/presentations/generate',
    method: 'POST',
    description: 'Generate a new AI-powered presentation',
    body: {
      prompt: 'string (required, max 1000 chars) - Description of the presentation you want to create',
      theme: 'enum (optional) - modern, classic, minimal, creative, professional (default: modern)',
      slideCount: 'number (optional) - Number of slides to generate, 1-20 (default: 5)',
    },
    authentication: 'Required - User must be logged in',
  });
}