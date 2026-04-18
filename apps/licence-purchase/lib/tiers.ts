// Source of truth for tier / feature / pricing display.
//
// The feature keys and tier names here MUST stay aligned with:
//   apps/web/lib/features.ts       — the canonical feature gate matrix
//   apps/docs/docs/licensing.md    — the customer-facing tier descriptions
//   apps/web/lib/licence.ts        — the licence payload shape (tier, features)
//
// This file is duplicated (not imported) from apps/web so this app is
// deployable independently from the main Infrawatch web app.

export type TierId = 'community' | 'pro' | 'enterprise'

// Human-readable feature bullets shown on the pricing page.
// Grouped per tier. Headline bullets first, deep-dive bullets further down.
export const COMMUNITY_FEATURES: string[] = [
  'Email / password auth + TOTP MFA',
  'LDAP / AD login (live bind authentication)',
  'Organisations, teams, user management, 4 built-in roles',
  'Agent registration, approval, heartbeat, self-update',
  'Host inventory, deduplication, network topology graphs',
  'Check definitions (port, process, HTTP)',
  'Alerts, acknowledge / silence',
  'Notification channels: in-app, webhook, SMTP, Slack, Telegram',
  'Interactive terminal (multi-tab, split-pane)',
  'Custom script runner, service management',
  'SSL certificate checker tool (one-off URL lookup)',
  'Metric graphs + retention up to 180 days',
  'Air-gap deployment',
]

export const PRO_ADDITIONAL_FEATURES: string[] = [
  'Certificate expiry tracker — dashboards, scheduled expiry notifications, bulk export',
  'Service account tracker — password / token expiry warnings',
  'CSR generation, approval workflow, internal CA',
  'SSH key inventory and rotation tracking',
  'Reports — scheduled delivery and CSV / PDF export',
  'Extended metric retention (up to 365 days) and metric export API',
  'OIDC single sign-on (Google, Entra, Okta, Keycloak)',
  'Audit log (user + admin actions, export, retention)',
  'Scheduled task runner',
  'Alert routing policies (on-call rotations, escalation)',
  'Advanced notification templating',
  'Business-hours email support',
]

export const ENTERPRISE_ADDITIONAL_FEATURES: string[] = [
  'SAML 2.0 single sign-on',
  'Advanced RBAC — tag-based resource scoping, custom role definitions',
  'Compliance packs (SOC 2, ISO 27001, HIPAA-style evidence templates)',
  'White labelling — custom logo, theme, login page, email sender',
  'Air-gap bundlers for Jenkins, Docker, Ansible, Terraform',
  'HA deployment profile and migration tooling',
  '24 / 7 support with incident SLA and a dedicated CSM',
]

// Feature keys (JWT `features` claim) unlocked at each paid tier.
// Must match apps/web/lib/features.ts.
export const PRO_FEATURE_KEYS: string[] = [
  'ssoOidc',
  'auditLog',
  'certExpiryTracker',
  'serviceAccountTracker',
  'reportsExport',
  'reportsScheduled',
  'metricRetentionExtended',
  'scheduledTasks',
  'alertRouting',
  'csrInternalCa',
  'sshKeyInventory',
]

export const ENTERPRISE_FEATURE_KEYS: string[] = [
  ...PRO_FEATURE_KEYS,
  'ssoSaml',
  'advancedRbac',
  'whiteLabel',
  'compliancePack',
  'airgapBundlers',
  'haDeployment',
]

export type PaidTierId = 'pro' | 'enterprise'
export type BillingInterval = 'month' | 'year'

export type TierDefinition = {
  id: TierId
  name: string
  tagline: string
  audience: string
  // Display price per month, in GBP. Annual tiers show a reduced per-month figure.
  displayPrice: {
    month: number | null
    year: number | null // stored as per-month price when billed annually
  }
  // The multiplier applied to monthly price to get 12-month revenue when billing annually.
  annualDiscountPercent?: number
  ctaLabel: string
  ctaHref: string
  featureHeader: string
  features: string[]
  highlighted?: boolean
}

// Prices are placeholders for the scaffold; real numbers will be set once
// Stripe products are created in Phase 1 (see PROGRESS.md).
export const TIERS: TierDefinition[] = [
  {
    id: 'community',
    name: 'Community',
    tagline: 'Everything a small team needs, free forever.',
    audience: 'Individual engineers and small teams.',
    displayPrice: { month: 0, year: 0 },
    ctaLabel: 'Self-host for free',
    ctaHref: 'https://github.com/carrtech-dev/infrawatch',
    featureHeader: 'Core platform',
    features: COMMUNITY_FEATURES,
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Tier 1 — governance, reporting and corporate IdP.',
    audience: 'Corporate engineering teams who need audit, SSO and extended retention.',
    displayPrice: { month: 49, year: 39 },
    annualDiscountPercent: 20,
    ctaLabel: 'Buy Pro',
    ctaHref: '/checkout/pro',
    featureHeader: 'Everything in Community, plus',
    features: PRO_ADDITIONAL_FEATURES,
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Tier 2 — SAML, advanced RBAC and compliance packs.',
    audience: 'Large organisations with compliance, security and procurement requirements.',
    displayPrice: { month: 199, year: 165 },
    annualDiscountPercent: 17,
    ctaLabel: 'Buy Enterprise',
    ctaHref: '/checkout/enterprise',
    featureHeader: 'Everything in Pro, plus',
    features: ENTERPRISE_ADDITIONAL_FEATURES,
  },
]

export function getTier(id: TierId): TierDefinition {
  const tier = TIERS.find((t) => t.id === id)
  if (!tier) throw new Error(`Unknown tier: ${id}`)
  return tier
}

export function featureKeysForTier(tier: PaidTierId): string[] {
  return tier === 'enterprise' ? ENTERPRISE_FEATURE_KEYS : PRO_FEATURE_KEYS
}
