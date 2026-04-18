import { env } from '@/lib/env'
import type { PaidTierId } from '@/lib/tiers'

export type SignLicenceInput = {
  organisationId: string
  customer: { name: string; email: string }
  tier: PaidTierId
  features: string[]
  maxHosts?: number
  jti: string
  issuedAt: Date
  expiresAt: Date
}

export type SignedLicence = {
  jwt: string
  jti: string
  expiresAt: Date
}

// ─────────────────────────────────────────────────────────────────────────────
// STUB — wired up in Phase 2. See apps/licence-purchase/PROGRESS.md.
//
// Real implementation (pseudo):
//   import { importPKCS8, SignJWT } from 'jose'
//   const pem = env.licenceSigningPem ?? readFileSync(env.licenceSigningPath!)
//   const key = await importPKCS8(pem, 'RS256')
//   const jwt = await new SignJWT({ tier, features, maxHosts, customer })
//     .setProtectedHeader({ alg: 'RS256' })
//     .setIssuer(env.licenceIssuer)
//     .setAudience(env.licenceAudience)
//     .setSubject(organisationId)
//     .setJti(jti)
//     .setIssuedAt(issuedAt)
//     .setNotBefore(issuedAt)
//     .setExpirationTime(expiresAt)
//     .sign(key)
//
// Payload shape must match apps/web/lib/licence.ts (LicencePayload type).
// ─────────────────────────────────────────────────────────────────────────────
export async function signLicence(input: SignLicenceInput): Promise<SignedLicence> {
  console.warn('[licence] signLicence is a scaffolding stub; returning a placeholder token.', {
    tier: input.tier,
    organisationId: input.organisationId,
    issuer: env.licenceIssuer,
  })
  return {
    jwt: 'FAKE_JWT_FOR_SCAFFOLDING',
    jti: input.jti,
    expiresAt: input.expiresAt,
  }
}
