import { query } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'new'
    const result = await query('SELECT * FROM devis WHERE status=$1 ORDER BY created_at DESC', [status])
    return Response.json({ data: result.rows || [] })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, email, phone, company, budget, project_type, timeline, message } = await request.json()
    const result = await query(
      'INSERT INTO devis (name, email, phone, company, budget, project_type, timeline, message, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, email, phone, company, budget, project_type, timeline, message, 'new']
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
      'UPDATE devis SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
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
    await query('DELETE FROM devis WHERE id=$1', [id])
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
