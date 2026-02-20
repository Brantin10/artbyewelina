import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder')
}

const FROM = process.env.EMAIL_FROM || 'noreply@artbyewelina.com'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function sendDigitalPurchaseEmail({
  to,
  buyerName,
  artworkTitle,
  token,
}: {
  to: string
  buyerName?: string | null
  artworkTitle: string
  token: string
}) {
  const downloadUrl = `${BASE_URL}/download/${token}`

  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Your download is ready — ${artworkTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Georgia, serif; background: #FAF6F0; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; }
          .header { background: #3D3B7A; padding: 40px; text-align: center; }
          .header h1 { color: #FAF6F0; font-size: 24px; margin: 0; letter-spacing: 2px; }
          .body { padding: 40px; }
          .body h2 { color: #2C2C2C; font-size: 22px; margin-bottom: 16px; }
          .body p { color: #555; line-height: 1.7; margin: 0 0 16px; }
          .btn { display: inline-block; background: #C4714A; color: #fff !important; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-size: 16px; margin: 20px 0; }
          .note { background: #FAF6F0; border-left: 3px solid #C4714A; padding: 16px; border-radius: 0 4px 4px 0; font-size: 14px; color: #666; }
          .footer { padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #E8D5B7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>art by ewelina</h1>
          </div>
          <div class="body">
            <h2>Thank you${buyerName ? `, ${buyerName}` : ''}!</h2>
            <p>Your purchase of <strong>${artworkTitle}</strong> is ready to download. Click the button below to save your high-resolution PDF.</p>
            <a href="${downloadUrl}" class="btn">Download Your Art</a>
            <div class="note">
              <strong>Please note:</strong> This link is valid for 72 hours and can be used up to 3 times. Please save your file once downloaded.
            </div>
            <p>Thank you for bringing this piece into your space. I hope it brings you joy and inspiration.</p>
            <p>With love,<br/><em>Ewelina</em></p>
          </div>
          <div class="footer">
            <p>art by ewelina &nbsp;•&nbsp; artbyewelina.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendPhysicalOrderEmail({
  to,
  buyerName,
  artworkTitle,
  printSize,
  orderId,
}: {
  to: string
  buyerName?: string | null
  artworkTitle: string
  printSize?: string | null
  orderId: string
}) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Order confirmed — ${artworkTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Georgia, serif; background: #FAF6F0; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; }
          .header { background: #3D3B7A; padding: 40px; text-align: center; }
          .header h1 { color: #FAF6F0; font-size: 24px; margin: 0; letter-spacing: 2px; }
          .body { padding: 40px; }
          .body h2 { color: #2C2C2C; font-size: 22px; margin-bottom: 16px; }
          .body p { color: #555; line-height: 1.7; margin: 0 0 16px; }
          .detail-box { background: #FAF6F0; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-box p { margin: 4px 0; font-size: 14px; }
          .footer { padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #E8D5B7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>art by ewelina</h1>
          </div>
          <div class="body">
            <h2>Your order is confirmed${buyerName ? `, ${buyerName}` : ''}!</h2>
            <p>Thank you for purchasing a print of <strong>${artworkTitle}</strong>. I am personally preparing your order with care.</p>
            <div class="detail-box">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Artwork:</strong> ${artworkTitle}</p>
              ${printSize ? `<p><strong>Size:</strong> ${printSize}</p>` : ''}
            </div>
            <p>I will send you a follow-up email with your tracking number as soon as your print is on its way. This typically takes 3–5 business days.</p>
            <p>Thank you for supporting independent art. It truly means the world to me.</p>
            <p>With love,<br/><em>Ewelina</em></p>
          </div>
          <div class="footer">
            <p>art by ewelina &nbsp;•&nbsp; artbyewelina.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendShippingEmail({
  to,
  buyerName,
  artworkTitle,
  trackingNumber,
}: {
  to: string
  buyerName?: string | null
  artworkTitle: string
  trackingNumber: string
}) {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Your print is on its way! — ${artworkTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Georgia, serif; background: #FAF6F0; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; overflow: hidden; }
          .header { background: #7A8C6E; padding: 40px; text-align: center; }
          .header h1 { color: #FAF6F0; font-size: 24px; margin: 0; letter-spacing: 2px; }
          .body { padding: 40px; }
          .body h2 { color: #2C2C2C; font-size: 22px; margin-bottom: 16px; }
          .body p { color: #555; line-height: 1.7; margin: 0 0 16px; }
          .tracking { background: #FAF6F0; border: 2px solid #7A8C6E; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .tracking p { font-size: 20px; font-weight: bold; color: #2C2C2C; margin: 0; }
          .footer { padding: 24px 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #E8D5B7; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>art by ewelina</h1>
          </div>
          <div class="body">
            <h2>Your print is on its way${buyerName ? `, ${buyerName}` : ''}!</h2>
            <p>Your print of <strong>${artworkTitle}</strong> has been carefully packaged and shipped.</p>
            <div class="tracking">
              <p>Tracking: ${trackingNumber}</p>
            </div>
            <p>I hope it arrives safely and looks beautiful in your space. Thank you again for your support.</p>
            <p>With love,<br/><em>Ewelina</em></p>
          </div>
          <div class="footer">
            <p>art by ewelina &nbsp;•&nbsp; artbyewelina.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}
