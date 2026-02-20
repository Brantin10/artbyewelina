import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/lib/tokens'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const result = await validateToken(token)

  if (!result.valid || !result.record) {
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head><title>Download Unavailable — Art by Ewelina</title>
<style>body{font-family:Georgia,serif;background:#FAF6F0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
.box{max-width:480px;text-align:center;padding:40px;}
h1{color:#2C2C2C;font-size:28px;margin-bottom:16px;}
p{color:#8B7D6B;line-height:1.6;margin-bottom:24px;}
a{display:inline-block;background:#C4714A;color:white;text-decoration:none;padding:12px 28px;border-radius:50px;font-size:14px;}
</style></head>
<body><div class="box">
<h1>Download Unavailable</h1>
<p>${result.reason}</p>
<p>If you believe this is an error, please contact us and include your order details.</p>
<a href="/">Return to Shop</a>
</div></body></html>`,
      { status: 403, headers: { 'Content-Type': 'text/html' } }
    )
  }

  const { record } = result
  const artwork = record.order.artwork

  if (!artwork.digitalFileUrl) {
    return new NextResponse('File not yet available. Please contact us.', { status: 404 })
  }

  // Increment download count
  await prisma.downloadToken.update({
    where: { id: record.id },
    data: { downloadCount: { increment: 1 } },
  })

  // Fetch file from storage (Vercel Blob or any URL)
  const fileRes = await fetch(artwork.digitalFileUrl)
  if (!fileRes.ok) {
    return new NextResponse('File fetch failed. Please contact us.', { status: 500 })
  }

  const filename = artwork.digitalFilename || `${artwork.slug}.pdf`

  return new NextResponse(fileRes.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
