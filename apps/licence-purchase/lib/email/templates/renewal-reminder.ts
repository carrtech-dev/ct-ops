// TEMPLATE STUB — fill out during Phase 4 (see PROGRESS.md).
// Sent at T-30, T-7, and T-1 days before licence expiry.
export function renewalReminderEmail(params: {
  organisationName: string
  daysUntilExpiry: number
  renewUrl: string
}): { subject: string; html: string; text: string } {
  const { organisationName, daysUntilExpiry, renewUrl } = params
  return {
    subject: `Infrawatch licence for ${organisationName} expires in ${daysUntilExpiry} day(s)`,
    text: `Your Infrawatch licence expires in ${daysUntilExpiry} day(s). Renew: ${renewUrl}`,
    html: `<p>Your Infrawatch licence for <strong>${organisationName}</strong> expires in <strong>${daysUntilExpiry}</strong> day(s).</p><p><a href="${renewUrl}">Renew now</a></p>`,
  }
}
