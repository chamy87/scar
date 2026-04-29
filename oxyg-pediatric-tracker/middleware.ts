import { NextResponse, type NextRequest } from 'next/server';

const ALLOWLISTED_IPS = [
  // Add trusted IPs here if needed.
];

const suspiciousPatterns = [
  '.env',
  '.git',
  'wp-config',
  'phpinfo',
  'backup.sql',
  'database.sql',
  'secrets',
  'config.php',
  '/docker/',
  '/.github/',
  '/.aws/',
  '/.ssh/',
];

function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }

  return request.ip ?? 'unknown';
}

function isSuspiciousPath(pathname: string): boolean {
  const normalizedPath = pathname.toLowerCase();
  return suspiciousPatterns.some((pattern) => normalizedPath.includes(pattern));
}

function forbiddenResponse() {
  return new NextResponse('Forbidden', {
    status: 403,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

async function isBlockedIp(ip: string, supabaseUrl: string, serviceRoleKey: string): Promise<boolean> {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/blocked_ips?select=blocked&ip=eq.${encodeURIComponent(ip)}&blocked=eq.true&limit=1`,
    {
      method: 'GET',
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as Array<{ blocked?: boolean }>;
  return data.length > 0 && Boolean(data[0]?.blocked);
}

async function upsertBlockedIp(
  ip: string,
  pathname: string,
  userAgent: string,
  supabaseUrl: string,
  serviceRoleKey: string,
) {
  const payload = {
    ip,
    reason: 'sensitive_path_probe',
    request_path: pathname,
    user_agent: userAgent,
    blocked: true,
    last_seen_at: new Date().toISOString(),
  };

  await fetch(`${supabaseUrl}/rest/v1/blocked_ips?on_conflict=ip`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      'content-type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(payload),
  });
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const ip = getClientIp(request);

  if (ALLOWLISTED_IPS.includes(ip)) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasServerSecrets = Boolean(supabaseUrl && serviceRoleKey);

  if (hasServerSecrets && ip !== 'unknown') {
    try {
      const blocked = await isBlockedIp(ip, supabaseUrl as string, serviceRoleKey as string);
      if (blocked) {
        return forbiddenResponse();
      }
    } catch {
      // Fail open on Supabase lookup error to avoid blocking legitimate traffic.
    }
  }

  if (isSuspiciousPath(pathname)) {
    if (hasServerSecrets && ip !== 'unknown') {
      try {
        await upsertBlockedIp(
          ip,
          pathname,
          request.headers.get('user-agent') ?? 'unknown',
          supabaseUrl as string,
          serviceRoleKey as string,
        );
      } catch {
        // Ignore write errors and still block immediately.
      }
    }

    return forbiddenResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!assets|favicon.ico|robots.txt).*)'],
};
