import { NextResponse } from 'next/server'
import { Pool } from 'pg'

export async function GET() {
  const raw = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || ''
  const masked = raw.replace(/:([^@]+)@/, ':***@')

  try {
    const pool = new Pool({
      connectionString: raw,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    })
    const result = await pool.query('SELECT current_database(), now()')
    await pool.end()
    return NextResponse.json({ ok: true, db: result.rows[0], url: masked })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, url: masked }, { status: 500 })
  }
}
