import { AdminSidebar } from '@/components/layout/AdminSidebar'

export const metadata = { title: 'Admin — Art by Ewelina' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F5EEE3]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
