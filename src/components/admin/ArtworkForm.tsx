'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ArtworkData {
  id?: string
  slug?: string
  title: string
  description: string
  story: string
  medium: string
  year: string
  imageUrl: string
  hasDigital: boolean
  hasPhysical: boolean
  digitalPriceCents: string
  physicalPriceCents: string
  printSizes: string
  digitalFileUrl: string
  digitalFilename: string
  isFeatured: boolean
  isPublished: boolean
}

interface Props {
  initial?: Partial<ArtworkData>
}

export function ArtworkForm({ initial }: Props) {
  const router = useRouter()
  const isEdit = Boolean(initial?.id)

  const [form, setForm] = useState<ArtworkData>({
    title: '',
    description: '',
    story: '',
    medium: '',
    year: '',
    imageUrl: '',
    hasDigital: true,
    hasPhysical: true,
    digitalPriceCents: '',
    physicalPriceCents: '',
    printSizes: JSON.stringify([
      { label: 'A4', widthCm: 21, heightCm: 29.7 },
      { label: 'A3', widthCm: 29.7, heightCm: 42 },
    ]),
    digitalFileUrl: '',
    digitalFilename: '',
    isFeatured: false,
    isPublished: false,
    ...initial,
  })

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof ArtworkData, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function uploadFile(file: File, type: 'image' | 'pdf') {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', type)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      return data.url as string
    } catch (err: any) {
      setError(err.message || 'Upload failed')
      return ''
    } finally {
      setUploading(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'image')
    if (url) set('imageUrl', url)
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'pdf')
    if (url) {
      set('digitalFileUrl', url)
      set('digitalFilename', file.name)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      digitalPriceCents: form.digitalPriceCents ? Math.round(parseFloat(form.digitalPriceCents) * 100) : null,
      physicalPriceCents: form.physicalPriceCents ? Math.round(parseFloat(form.physicalPriceCents) * 100) : null,
      year: form.year ? Number(form.year) : null,
    }

    const url = isEdit ? `/api/admin/artworks/${initial!.id}` : '/api/admin/artworks'
    const method = isEdit ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/artworks')
      router.refresh()
    } else {
      let errMsg = `Server error (${res.status})`
      try {
        const data = await res.json()
        errMsg = data.error || errMsg
      } catch {
        // response body was empty or not JSON
      }
      setError(errMsg)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this artwork? This cannot be undone.')) return
    await fetch(`/api/admin/artworks/${initial!.id}`, { method: 'DELETE' })
    router.push('/admin/artworks')
  }

  const inputCls = 'w-full border border-[#E8D5B7] rounded-lg px-4 py-3 text-[#2C2C2C] focus:outline-none focus:border-[#3D3B7A] transition-colors text-sm bg-white'
  const labelCls = 'block text-xs tracking-widest uppercase text-[#8B7D6B] mb-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Basic info */}
      <div className="bg-white rounded-xl p-6 space-y-5">
        <h2 className="text-sm text-[#8B7D6B] uppercase tracking-widest">Basic Info</h2>

        <div>
          <label className={labelCls}>Title *</label>
          <input required type="text" value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} placeholder="Mystic Horizon" />
        </div>
        <div>
          <label className={labelCls}>Description *</label>
          <textarea required rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={inputCls} placeholder="A journey into the unknown..." />
        </div>
        <div>
          <label className={labelCls}>Artist Story (optional)</label>
          <textarea rows={3} value={form.story} onChange={e => set('story', e.target.value)} className={inputCls} placeholder="This piece was inspired by..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Medium</label>
            <input type="text" value={form.medium} onChange={e => set('medium', e.target.value)} className={inputCls} placeholder="Watercolour & Ink" />
          </div>
          <div>
            <label className={labelCls}>Year</label>
            <input type="number" value={form.year} onChange={e => set('year', e.target.value)} className={inputCls} placeholder="2025" min="1900" max="2100" />
          </div>
        </div>
      </div>

      {/* Image upload */}
      <div className="bg-white rounded-xl p-6 space-y-5">
        <h2 className="text-sm text-[#8B7D6B] uppercase tracking-widest">Artwork Image</h2>

        {form.imageUrl && (
          <div className="relative w-48 h-48 rounded-lg overflow-hidden">
            <Image src={form.imageUrl} alt="Preview" fill className="object-cover" />
          </div>
        )}

        <div>
          <label className={labelCls}>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-[#8B7D6B] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#3D3B7A] file:text-white hover:file:bg-[#2E2C60] file:cursor-pointer"
          />
          {uploading && <p className="text-xs text-[#8B7D6B] mt-2">Uploading...</p>}
        </div>
        <div>
          <label className={labelCls}>Or paste image URL</label>
          <input type="text" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} className={inputCls} placeholder="https://..." />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl p-6 space-y-5">
        <h2 className="text-sm text-[#8B7D6B] uppercase tracking-widest">Pricing & Formats</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" id="hasDigital" checked={form.hasDigital} onChange={e => set('hasDigital', e.target.checked)} className="accent-[#3D3B7A]" />
              <label htmlFor="hasDigital" className="text-sm text-[#2C2C2C]">Digital PDF available</label>
            </div>
            {form.hasDigital && (
              <div>
                <label className={labelCls}>Price (€)</label>
                <input type="number" step="0.01" min="0" value={form.digitalPriceCents} onChange={e => set('digitalPriceCents', e.target.value)} className={inputCls} placeholder="35.00" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" id="hasPhysical" checked={form.hasPhysical} onChange={e => set('hasPhysical', e.target.checked)} className="accent-[#7A8C6E]" />
              <label htmlFor="hasPhysical" className="text-sm text-[#2C2C2C]">Physical print available</label>
            </div>
            {form.hasPhysical && (
              <div>
                <label className={labelCls}>Price (€)</label>
                <input type="number" step="0.01" min="0" value={form.physicalPriceCents} onChange={e => set('physicalPriceCents', e.target.value)} className={inputCls} placeholder="95.00" />
              </div>
            )}
          </div>
        </div>

        {form.hasPhysical && (
          <div>
            <label className={labelCls}>Print Sizes (JSON)</label>
            <textarea rows={3} value={form.printSizes} onChange={e => set('printSizes', e.target.value)} className={`${inputCls} font-mono text-xs`} />
            <p className="text-xs text-[#8B7D6B] mt-1">Format: [{'{'}label, widthCm, heightCm{'}'}]</p>
          </div>
        )}
      </div>

      {/* Digital file */}
      {form.hasDigital && (
        <div className="bg-white rounded-xl p-6 space-y-5">
          <h2 className="text-sm text-[#8B7D6B] uppercase tracking-widest">Digital File (PDF)</h2>
          <div>
            <label className={labelCls}>Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              disabled={uploading}
              className="block w-full text-sm text-[#8B7D6B] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#C4714A] file:text-white hover:file:bg-[#A85D38] file:cursor-pointer"
            />
            {form.digitalFileUrl && <p className="text-xs text-green-600 mt-2">✓ File uploaded: {form.digitalFilename}</p>}
          </div>
        </div>
      )}

      {/* Visibility */}
      <div className="bg-white rounded-xl p-6 space-y-4">
        <h2 className="text-sm text-[#8B7D6B] uppercase tracking-widest">Visibility</h2>
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isPublished" checked={form.isPublished} onChange={e => set('isPublished', e.target.checked)} className="accent-[#3D3B7A]" />
            <label htmlFor="isPublished" className="text-sm text-[#2C2C2C]">Published (visible in shop)</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="accent-[#C4714A]" />
            <label htmlFor="isFeatured" className="text-sm text-[#2C2C2C]">Featured on homepage</label>
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-[#3D3B7A] text-white px-8 py-3 rounded-lg hover:bg-[#2E2C60] transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Artwork'}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        )}

        <button
          type="button"
          onClick={() => router.push('/admin/artworks')}
          className="border border-[#E8D5B7] text-[#8B7D6B] px-6 py-3 rounded-lg hover:border-[#8B7D6B] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
