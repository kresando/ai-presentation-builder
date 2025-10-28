import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { presentations, slides } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
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

    const { id } = await params;

    // Get presentation with slides
    const presentationData = await db
      .select({
        id: presentations.id,
        title: presentations.title,
        theme: presentations.theme,
        createdAt: presentations.createdAt,
        updatedAt: presentations.updatedAt,
        slides: {
          id: slides.id,
          order: slides.order,
          type: slides.type,
          title: slides.title,
          content: slides.content,
          createdAt: slides.createdAt,
        },
      })
      .from(presentations)
      .leftJoin(slides, eq(presentations.id, slides.presentationId))
      .where(and(
        eq(presentations.id, id),
        eq(presentations.userId, session.user.id)
      ));

    if (presentationData.length === 0) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      );
    }

    // Group slides under presentation
    const presentation = {
      id: presentationData[0].id,
      title: presentationData[0].title,
      theme: presentationData[0].theme,
      createdAt: presentationData[0].createdAt,
      updatedAt: presentationData[0].updatedAt,
      slides: presentationData
        .filter(row => row.slides.id)
        .map(row => row.slides)
        .sort((a, b) => a.order - b.order),
    };

    return NextResponse.json({ presentation });

  } catch (error) {
    console.error('Error fetching presentation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presentation' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
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

    const { id } = await params;

    // Check if presentation exists and belongs to user
    const presentation = await db
      .select()
      .from(presentations)
      .where(and(
        eq(presentations.id, id),
        eq(presentations.userId, session.user.id)
      ));

    if (presentation.length === 0) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      );
    }

    // Delete presentation (cascade will delete slides)
    await db.delete(presentations).where(eq(presentations.id, id));

    return NextResponse.json({
      success: true,
      message: 'Presentation deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting presentation:', error);
    return NextResponse.json(
      { error: 'Failed to delete presentation' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
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

    const { id } = await params;
    const body = await request.json();
    const { title, theme } = body;

    // Validate input
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (theme && !['modern', 'classic', 'minimal', 'creative', 'professional'].includes(theme)) {
      return NextResponse.json(
        { error: 'Invalid theme' },
        { status: 400 }
      );
    }

    // Check if presentation exists and belongs to user
    const existingPresentation = await db
      .select()
      .from(presentations)
      .where(and(
        eq(presentations.id, id),
        eq(presentations.userId, session.user.id)
      ));

    if (existingPresentation.length === 0) {
      return NextResponse.json(
        { error: 'Presentation not found' },
        { status: 404 }
      );
    }

    // Update presentation
    await db
      .update(presentations)
      .set({
        title: title.trim(),
        theme: theme || existingPresentation[0].theme,
        updatedAt: new Date(),
      })
      .where(eq(presentations.id, id));

    return NextResponse.json({
      success: true,
      message: 'Presentation updated successfully',
    });

  } catch (error) {
    console.error('Error updating presentation:', error);
    return NextResponse.json(
      { error: 'Failed to update presentation' },
      { status: 500 }
    );
  }
}