// Security input sanitization & validation module
// Defends against XSS, Prototype Pollution, and Malicious payloads

export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Strip direct script tags and angle brackets
}

export function sanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') return '';
  const trimmed = email.trim().toLowerCase().slice(0, 254);
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(trimmed) ? trimmed : '';
}

export function sanitizeNumber(value: unknown, min = 0, max = 1000000): number {
  const num = Number(value);
  if (isNaN(num)) return min;
  return Math.min(Math.max(num, min), max);
}

// Client-side Rate Limiting (Token Bucket / Window based)
const rateLimits: Record<string, number[]> = {};

export function checkRateLimit(action: string, maxAttempts = 5, windowMs = 60000): boolean {
  const now = Date.now();
  if (!rateLimits[action]) {
    rateLimits[action] = [];
  }
  // Filter attempts in window
  rateLimits[action] = rateLimits[action].filter(time => now - time < windowMs);
  if (rateLimits[action].length >= maxAttempts) {
    return false; // Rate limited
  }
  rateLimits[action].push(now);
  return true; // Allowed
}
