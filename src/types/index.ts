export type OrderType = 'DIGITAL' | 'PHYSICAL'

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'FULFILLED'
  | 'REFUNDED'
  | 'CANCELLED'

export interface PrintSize {
  label: string
  widthCm: number
  heightCm: number
}

export interface ArtworkWithOrders {
  id: string
  slug: string
  title: string
  description: string
  story?: string | null
  medium?: string | null
  year?: number | null
  imageUrl: string
  hasDigital: boolean
  hasPhysical: boolean
  digitalPriceCents?: number | null
  physicalPriceCents?: number | null
  printSizes?: string | null
  digitalFileUrl?: string | null
  digitalFilename?: string | null
  isFeatured: boolean
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}
