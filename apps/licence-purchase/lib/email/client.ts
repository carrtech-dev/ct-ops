import nodemailer from 'nodemailer'
import { env } from '@/lib/env'

let _transport: nodemailer.Transporter | null = null

function transport(): nodemailer.Transporter {
  if (!_transport) {
    const { host, port, secure, user, password } = env.smtp
    _transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && password ? { user, pass: password } : undefined,
    })
  }
  return _transport
}

export type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const { fromAddress, fromName } = env.smtp
  const from = `${fromName} <${fromAddress}>`

  if (!env.smtp.host) {
    console.warn('[email] SMTP not configured; printing message instead.', {
      to: input.to,
      subject: input.subject,
    })
    return
  }

  await transport().sendMail({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  })
}
