import { query } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const result = await query('SELECT * FROM avis WHERE status=$1 ORDER BY created_at DESC', [status])
    return Response.json({ data: result.rows || [] })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, business, email, text, rating, status } = await request.json()
    const result = await query(
      'INSERT INTO avis (name, business, email, text, rating, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, business, email, text, rating, status || 'pending']
    )
    return Response.json({ data: result.rows[0] })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { id, status } = await request.json()
    const result = await query(
      'UPDATE avis SET status=$1, approved_at=NOW() WHERE id=$2 RETURNING *',
      [status, id]
    )
    return Response.json({ data: result.rows[0] })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    await query('DELETE FROM avis WHERE id=$1', [id])
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
