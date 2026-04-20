// Customer-authored text often contains emails, phone numbers, API tokens, or
// licence keys. We pseudonymise before sending anything to Anthropic so the
// model never sees raw PII or secrets.

const EMAIL_RE = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi
const PHONE_RE = /(?:(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,4}\d{2,4})/g
const JWT_RE = /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g
const AWS_RE = /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g
const STRIPE_RE = /\b(sk|pk|rk)_(live|test)_[0-9a-zA-Z]{16,}\b/g
const GITHUB_PAT_RE = /\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g
const BEARER_RE = /\bBearer\s+[A-Za-z0-9._~+/=-]{16,}\b/gi
const LONG_B64_RE = /\b[A-Za-z0-9+/]{80,}={0,2}\b/g

export function redactCustomerText(input: string): string {
  let out = input
  out = out.replace(EMAIL_RE, '[redacted-email]')
  out = out.replace(JWT_RE, '[redacted-jwt]')
  out = out.replace(AWS_RE, '[redacted-aws-key]')
  out = out.replace(STRIPE_RE, '[redacted-stripe-key]')
  out = out.replace(GITHUB_PAT_RE, '[redacted-github-token]')
  out = out.replace(BEARER_RE, 'Bearer [redacted-token]')
  out = out.replace(LONG_B64_RE, '[redacted-b64]')
  out = out.replace(PHONE_RE, (m) => (m.replace(/\D/g, '').length >= 7 ? '[redacted-phone]' : m))
  return out
}
