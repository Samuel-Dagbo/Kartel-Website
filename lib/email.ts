import { Client } from 'node-mailjet'

// CAUTION: Gmail's DMARC policy (p=reject) flags emails from third-party
// services like Mailjet claiming to be from @gmail.com, hurting deliverability.
// For reliable inbox delivery, set up a custom domain sender
// (e.g., noreply@carljonesperfumes.com) with SPF/DKIM/DMARC in Mailjet.
const FROM_EMAIL = 'perfumescarljones@gmail.com'
const FROM_NAME = 'Carl Jones Perfumes'

function getMailjet() {
  return new Client({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
  })
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const mailjet = getMailjet()
    const stripHtml = html.replace(/<[^>]*>/g, '')
    const result = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: FROM_EMAIL,
            Name: FROM_NAME,
          },
          To: [
            {
              Email: to,
              Name: to.split('@')[0],
            },
          ],
          Subject: subject,
          TextPart: stripHtml.slice(0, 500),
          HTMLPart: html,
          TrackOpens: 'enabled',
          TrackClicks: 'enabled',
        },
      ],
    })
    return result
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

function getHtmlTemplate(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Carl Jones Perfumes</title>
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #1a1a1a; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #242424; border-radius: 16px; overflow: hidden;">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%); padding: 30px; text-align: center;">
                <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 700; letter-spacing: 4px;">CARL JONES</h1>
                <p style="margin: 8px 0 0 0; color: #1a1a1a; font-size: 12px; letter-spacing: 2px; opacity: 0.8;">LUXURY FRAGRANCES</p>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 40px 30px;">
                ${content}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #1e1e1e; padding: 25px 30px; text-align: center;">
                <p style="margin: 0; color: #888888; font-size: 12px;">
                 Carl Jones Perfumes — Premium Fragrance Experience
                </p>
                <p style="margin: 10px 0 0 0; color: #666666; font-size: 11px;">
                  This email was sent to you as a registered member of Carl Jones Perfumes.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = getHtmlTemplate(`
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #1a1a1a; font-size: 36px;">✨</span>
      </div>
      <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 15px 0; font-weight: 600;">Welcome to Carl Jones, ${name}!</h2>
      <p style="color: #bbbbbb; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">
        Thank you for joining our exclusive fragrance community. Prepare to discover your signature scent from our curated collection of luxury perfumes.
      </p>
      <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 0;">
        💡 <strong>Tip:</strong> Check your spam or junk folder if you don't see our emails in your inbox.
      </p>
      <a href="https://carljonesperfumes.com/shop" style="display: inline-block; margin-top: 30px; padding: 14px 35px; background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%); color: #1a1a1a; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px;">Explore Collection</a>
    </div>
  `)

  return sendEmail({
    to: email,
    subject: 'Welcome to Carl Jones Perfumes ✨',
    html,
  })
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderNumber: string,
  totalAmount: number,
  items: { name: string; quantity: number; price: number }[]
) {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #333333;">
        <span style="color: #ffffff; font-size: 14px;">${item.name}</span>
        <span style="color: #888888; font-size: 13px; float: right;">× ${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #333333; text-align: right;">
        <span style="color: #D4AF37; font-size: 14px; font-weight: 600;">GHS ${item.price}</span>
      </td>
    </tr>
  `
    )
    .join('')

  const html = getHtmlTemplate(`
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #1a1a1a; font-size: 36px;">📦</span>
      </div>
      <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 10px 0; font-weight: 600;">Order Confirmed!</h2>
      <p style="color: #bbbbbb; font-size: 15px; margin: 0 0 25px 0;">
        Thank you for your purchase, ${name}!
      </p>
      <div style="background-color: #2a2a2a; border-radius: 12px; padding: 25px; margin: 20px 0; text-align: left;">
        <p style="margin: 0 0 15px 0;">
          <span style="color: #888888; font-size: 13px;">Order Number</span><br>
          <span style="color: #D4AF37; font-size: 18px; font-weight: 700;">${orderNumber}</span>
        </p>
        <table width="100%" cellspacing="0" cellpadding="0" border="0">
          ${itemsHtml}
        </table>
        <div style="border-top: 2px solid #D4AF37; margin-top: 15px; padding-top: 15px; text-align: right;">
          <span style="color: #888888; font-size: 13px;">Total</span>
          <span style="color: #D4AF37; font-size: 20px; font-weight: 700; margin-left: 15px;">GHS ${totalAmount}</span>
        </div>
      </div>
      <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 0;">
        💡 <strong>Tip:</strong> Check your spam or junk folder if you don't see our order confirmation in your inbox.
      </p>
      <p style="color: #888888; font-size: 13px; margin: 20px 0 0 0;">Estimated delivery: 3-5 business days</p>
    </div>
  `)

  return sendEmail({
    to: email,
    subject: `Order ${orderNumber} Confirmed - Carl Jones Perfumes`,
    html,
  })
}

export async function sendOrderStatusUpdateEmail(
  email: string,
  name: string,
  orderNumber: string,
  status: string
) {
  const statusEmoji: Record<string, string> = {
    pending: '⏳',
    processing: '🔄',
    shipped: '📦',
    delivered: '✅',
    cancelled: '❌',
  }

  const statusMessages: Record<string, string> = {
    pending: 'Your order is being reviewed.',
    processing: 'Your order is being prepared with care.',
    shipped: 'Your fragrance is on its way to you!',
    delivered: 'Your order has been delivered.',
    cancelled: 'Your order has been cancelled.',
  }

  const html = getHtmlTemplate(`
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #1a1a1a; font-size: 36px;">${statusEmoji[status] || '📋'}</span>
      </div>
      <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 15px 0; font-weight: 600;">Order Update</h2>
      <p style="color: #bbbbbb; font-size: 15px; margin: 0 0 10px 0;">Hello ${name},</p>
      <p style="color: #bbbbbb; font-size: 15px; margin: 0 0 25px 0;">${statusMessages[status]}</p>
      <div style="background-color: #2a2a2a; border-radius: 12px; padding: 25px; margin: 20px 0;">
        <p style="margin: 0;">
          <span style="color: #888888; font-size: 13px;">Order Number</span><br>
          <span style="color: #D4AF37; font-size: 18px; font-weight: 700;">${orderNumber}</span>
        </p>
        <p style="margin: 15px 0 0 0;">
          <span style="color: #888888; font-size: 13px;">Status</span><br>
          <span style="color: #ffffff; font-size: 16px; font-weight: 600; text-transform: uppercase;">${status}</span>
        </p>
      </div>
      <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 0;">
        💡 <strong>Tip:</strong> Check your spam or junk folder if you don't see our email in your inbox.
      </p>
      <a href="https://carljonesperfumes.com/customer/orders" style="display: inline-block; margin-top: 30px; padding: 14px 35px; background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%); color: #1a1a1a; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px;">View Order Details</a>
    </div>
  `)

  return sendEmail({
    to: email,
    subject: `Order ${orderNumber} Status: ${status.charAt(0).toUpperCase() + status.slice(1)} - Carl Jones`,
    html,
  })
}

export async function sendPasswordResetEmail(email: string, name: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

  const html = getHtmlTemplate(`
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #1a1a1a; font-size: 36px;">🔐</span>
      </div>
      <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 15px 0; font-weight: 600;">Reset Your Password</h2>
      <p style="color: #bbbbbb; font-size: 15px; margin: 0 0 25px 0;">
        Hello ${name}, we received a request to reset your password.
      </p>
      <a href="${resetUrl}" style="display: inline-block; margin-top: 10px; padding: 14px 35px; background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%); color: #1a1a1a; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px;">Reset Password</a>
      <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 25px 0 0 0;">
        💡 <strong>Tip:</strong> Check your spam or junk folder if you don't see our email in your inbox.
      </p>
      <p style="color: #666666; font-size: 12px; margin: 30px 0 0 0;">
        This link will expire in 1 hour. If you didn't request this, please ignore this email.
      </p>
    </div>
  `)

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - Carl Jones Perfumes',
    html,
  })
}

export async function sendTestEmail(to: string) {
  const html = getHtmlTemplate(`
    <div style="text-align: center;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%); border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;">
        <span style="color: #1a1a1a; font-size: 36px;">✅</span>
      </div>
      <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 15px 0; font-weight: 600;">Email Service Test</h2>
      <p style="color: #bbbbbb; font-size: 15px; margin: 0 0 25px 0;">
        Hello! This is a test email to confirm that your Mailjet email service is working correctly.
      </p>
      <p style="color: #D4AF37; font-size: 14px; font-weight: 600;">If you received this, your email configuration is working! 🎉</p>
      <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 25px 0 0 0;">
        💡 <strong>Tip:</strong> Check your spam or junk folder if you don't see our emails in your inbox.
      </p>
    </div>
  `)

  return sendEmail({
    to: to,
    subject: 'Test Email - Carl Jones Perfumes',
    html,
  })
}