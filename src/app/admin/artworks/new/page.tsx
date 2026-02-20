import { ArtworkForm } from '@/components/admin/ArtworkForm'

export const metadata = { title: 'New Artwork — Admin' }

export default function NewArtworkPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl text-[#2C2C2C] mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Add New Artwork
      </h1>
      <ArtworkForm />
    </div>
  )
}
