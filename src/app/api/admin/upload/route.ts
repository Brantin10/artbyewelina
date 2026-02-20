import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const type = (formData.get('type') as string) || 'image'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const filename = `${type}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  try {
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    })
    return NextResponse.json({ url: blob.url })
  } catch (err: any) {
    console.error('[upload] Blob error:', err)
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 })
  }
}
