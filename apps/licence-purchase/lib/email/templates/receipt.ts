// TEMPLATE STUB — fill out during Phase 4 (see PROGRESS.md).
// Sent to the billing contact after a successful payment.
export function receiptEmail(params: {
  organisationName: string
  invoiceNumber: string
  amount: string
  invoiceUrl: string
}): { subject: string; html: string; text: string } {
  const { organisationName, invoiceNumber, amount, invoiceUrl } = params
  return {
    subject: `Receipt for invoice ${invoiceNumber}`,
    text: `Thank you. Payment of ${amount} for ${organisationName} has been received.\nInvoice: ${invoiceUrl}`,
    html: `<p>Thank you. Payment of <strong>${amount}</strong> for <strong>${organisationName}</strong> has been received.</p><p><a href="${invoiceUrl}">View invoice</a></p>`,
  }
}
