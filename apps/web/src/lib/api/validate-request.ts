import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import createDOMPurify from 'isomorphic-dompurify';

const DOMPurify = createDOMPurify();

export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Validation failed',
            details: result.error.issues.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        ),
      };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      ),
    };
  }
}

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

export function isBot(data: { website?: string }): boolean {
  return !!data.website && data.website.length > 0;
}
