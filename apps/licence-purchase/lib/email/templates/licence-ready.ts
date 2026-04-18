// TEMPLATE STUB — fill out during Phase 4 (see PROGRESS.md).
// Sent to the organisation's technical contact after a licence has been issued
// and is ready to download from the dashboard. Does NOT include the raw key.

export function licenceReadyEmail(params: {
  organisationName: string
  dashboardUrl: string
}): { subject: string; html: string; text: string } {
  const { organisationName, dashboardUrl } = params
  return {
    subject: `Your Infrawatch licence is ready`,
    text: `Hi,\n\nYour Infrawatch licence for ${organisationName} is ready to download from your dashboard:\n\n${dashboardUrl}\n\nInfrawatch Licensing`,
    html: `<p>Hi,</p><p>Your Infrawatch licence for <strong>${organisationName}</strong> is ready to download from your dashboard.</p><p><a href="${dashboardUrl}">Open dashboard</a></p><p>— Infrawatch Licensing</p>`,
  }
}
