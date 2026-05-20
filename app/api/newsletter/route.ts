import { NextRequest, NextResponse } from 'next/server'
import { getMailjetClient } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const mailjet = getMailjetClient()
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: { Email: 'perfumescarljones@gmail.com', Name: 'Carl Jones Perfumes' },
          To: [{ Email: 'perfumescarljones@gmail.com', Name: 'Carl Jones' }],
          Subject: 'New Newsletter Subscription',
          TextPart: `New subscriber: ${email}`,
          HTMLPart: `<p>New newsletter subscriber: <strong>${email}</strong></p>`,
        },
      ],
    })

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 200 })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 })
  }
}
