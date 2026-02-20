import { cookies } from 'next/headers'

// Lightweight cookie-based auth check for admin API routes
// Avoids hitting the database on every API call
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token =
    cookieStore.get('__Secure-authjs.session-token')?.value ||
    cookieStore.get('authjs.session-token')?.value ||
    cookieStore.get('next-auth.session-token')?.value ||
    cookieStore.get('__Secure-next-auth.session-token')?.value
  return Boolean(token)
}
