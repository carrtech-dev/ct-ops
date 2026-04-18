// TEMPLATE STUB — fill out during Phase 4 (see PROGRESS.md).
export function licenceExpiredEmail(params: {
  organisationName: string
  renewUrl: string
}): { subject: string; html: string; text: string } {
  const { organisationName, renewUrl } = params
  return {
    subject: `Infrawatch licence for ${organisationName} has expired`,
    text: `The Infrawatch licence for ${organisationName} has expired. Paid features are unavailable until you renew: ${renewUrl}`,
    html: `<p>The Infrawatch licence for <strong>${organisationName}</strong> has expired. Paid features are unavailable until you renew.</p><p><a href="${renewUrl}">Renew now</a></p>`,
  }
}
