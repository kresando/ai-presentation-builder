import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { presentations, slides } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Validate user authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's presentations with slide count
    const userPresentations = await db
      .select({
        id: presentations.id,
        title: presentations.title,
        theme: presentations.theme,
        createdAt: presentations.createdAt,
        updatedAt: presentations.updatedAt,
      })
      .from(presentations)
      .where(eq(presentations.userId, session.user.id))
      .orderBy(desc(presentations.createdAt));

    // Get slide count for each presentation
    const presentationsWithSlideCount = await Promise.all(
      userPresentations.map(async (presentation) => {
        const slideCount = await db
          .select({ count: slides.id })
          .from(slides)
          .where(eq(slides.presentationId, presentation.id));

        return {
          ...presentation,
          slideCount: slideCount.length,
        };
      })
    );

    return NextResponse.json({
      presentations: presentationsWithSlideCount,
    });

  } catch (error) {
    console.error('Error fetching presentations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presentations' },
      { status: 500 }
    );
  }
}