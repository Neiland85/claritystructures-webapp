import { NextResponse, type NextRequest } from 'next/server';

function unauthorizedResponse(): NextResponse {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Intakes", charset="UTF-8"',
    },
  });
}

function decodeBasicCredentials(authorizationHeader: string): {
  username: string;
  password: string;
} | null {
  if (!authorizationHeader.startsWith('Basic ')) {
    return null;
  }

  const encodedCredentials = authorizationHeader.slice('Basic '.length).trim();

  try {
    const decoded = atob(encodedCredentials);
    const separatorIndex = decoded.indexOf(':');

    if (separatorIndex < 0) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest): NextResponse {
  const username = process.env.ADMIN_BASIC_USER;
  const password = process.env.ADMIN_BASIC_PASSWORD;

  if (!username || !password) {
    return new NextResponse('Admin authentication is not configured', { status: 503 });
  }

  const authorizationHeader = request.headers.get('authorization');

  if (!authorizationHeader) {
    return unauthorizedResponse();
  }

  const credentials = decodeBasicCredentials(authorizationHeader);

  if (!credentials) {
    return unauthorizedResponse();
  }

  if (credentials.username !== username || credentials.password !== password) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/intakes/:path*'],
};
