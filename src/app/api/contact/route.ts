import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder')
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@artbyewelina.com',
      to: process.env.ADMIN_EMAIL || 'ewelina@artbyewelina.com',
      replyTo: email,
      subject: `New message from ${name} — Art by Ewelina`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${message}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
