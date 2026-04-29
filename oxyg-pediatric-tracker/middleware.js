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

function getClientIp(request) {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }

  return request.headers.get('x-vercel-forwarded-for')?.trim() ?? 'unknown';
}

function isSuspiciousPath(pathname) {
  const normalizedPath = pathname.toLowerCase();
  return suspiciousPatterns.some((pattern) => normalizedPath.includes(pattern));
}

function forbiddenResponse() {
  return new Response('Forbidden', {
    status: 403,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

async function isBlockedIp(ip, supabaseUrl, serviceRoleKey) {
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

  const data = await response.json();
  return Array.isArray(data) && data.length > 0 && Boolean(data[0]?.blocked);
}

async function upsertBlockedIp(ip, pathname, userAgent, supabaseUrl, serviceRoleKey) {
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

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const ip = getClientIp(request);

  if (ALLOWLISTED_IPS.includes(ip)) {
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasServerSecrets = Boolean(supabaseUrl && serviceRoleKey);

  if (hasServerSecrets && ip !== 'unknown') {
    try {
      const blocked = await isBlockedIp(ip, supabaseUrl, serviceRoleKey);
      if (blocked) {
        return forbiddenResponse();
      }
    } catch {
      // Fail open if Supabase read fails.
    }
  }

  if (isSuspiciousPath(pathname)) {
    if (hasServerSecrets && ip !== 'unknown') {
      try {
        await upsertBlockedIp(
          ip,
          pathname,
          request.headers.get('user-agent') ?? 'unknown',
          supabaseUrl,
          serviceRoleKey,
        );
      } catch {
        // Ignore persistence errors and still block immediately.
      }
    }

    return forbiddenResponse();
  }

  return;
}

export const config = {
  matcher: ['/((?!assets|favicon.ico|robots.txt).*)'],
};
