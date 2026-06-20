/**
 * Email validation for API inputs. The frontend uses HTML5 type="email",
 * but the backend must not trust that — validate format and bound length
 * before forwarding to third-party services (Buttondown).
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const email = value.trim();
  // RFC 5321 caps the full address at 254 chars; reject absurd inputs early.
  if (email.length === 0 || email.length > 254) return false;
  return EMAIL_RE.test(email);
}
