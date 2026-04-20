import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query('SELECT * FROM tarifs ORDER BY created_at DESC')
    return Response.json({ data: result.rows || [] })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { name, price, currency, period, description, features, highlighted, cta_text } = await request.json()
    const result = await query(
      'INSERT INTO tarifs (name, price, currency, period, description, features, highlighted, cta_text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, price, currency || 'EUR', period || 'month', description, features, highlighted || false, cta_text || 'Choisir']
    )
    return Response.json({ data: result.rows[0] })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { id, name, price, currency, period, description, features, highlighted, cta_text } = await request.json()
    const result = await query(
      'UPDATE tarifs SET name=$1, price=$2, currency=$3, period=$4, description=$5, features=$6, highlighted=$7, cta_text=$8, updated_at=NOW() WHERE id=$9 RETURNING *',
      [name, price, currency, period, description, features, highlighted, cta_text, id]
    )
    return Response.json({ data: result.rows[0] })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    await query('DELETE FROM tarifs WHERE id=$1', [id])
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
