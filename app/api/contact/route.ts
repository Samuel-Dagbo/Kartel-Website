import { NextRequest, NextResponse } from 'next/server'
import { getMailjetClient } from '@/lib/email'

function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const safeName = sanitize(name)
    const safeSubject = sanitize(subject)
    const safeMessage = sanitize(message)
    const safeEmail = sanitize(email)

    const mailjet = getMailjetClient()
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: { Email: 'perfumescarljones@gmail.com', Name: 'Carl Jones Perfumes' },
          To: [{ Email: 'perfumescarljones@gmail.com', Name: 'Carl Jones' }],
          Subject: `Contact Form: ${safeSubject}`,
          TextPart: `From: ${safeName} (${safeEmail})\nSubject: ${safeSubject}\nMessage: ${safeMessage}`,
          HTMLPart: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
          `,
        },
      ],
    })

    return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
