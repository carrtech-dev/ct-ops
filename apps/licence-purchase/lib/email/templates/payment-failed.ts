// TEMPLATE STUB — fill out during Phase 4 (see PROGRESS.md).
export function paymentFailedEmail(params: {
  organisationName: string
  invoiceUrl: string
}): { subject: string; html: string; text: string } {
  const { organisationName, invoiceUrl } = params
  return {
    subject: `Payment failed for ${organisationName}`,
    text: `A recent payment for ${organisationName} failed. Please review: ${invoiceUrl}`,
    html: `<p>A recent payment for <strong>${organisationName}</strong> failed. Please review: <a href="${invoiceUrl}">${invoiceUrl}</a></p>`,
  }
}
