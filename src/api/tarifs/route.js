import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET - Récupérer tous les tarifs
export async function GET() {
  try {
    const result = await query(
      'SELECT * FROM tarifs WHERE status = $1 ORDER BY CASE WHEN highlighted THEN 0 ELSE 1 END, price',
      ['active']
    )

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('GET tarifs error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - Créer un nouveau tarif
export async function POST(req) {
  try {
    const { name, price, currency, period, description, features, highlighted, cta_text, status } = await req.json()

    const result = await query(
      'INSERT INTO tarifs (name, price, currency, period, description, features, highlighted, cta_text, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, price, currency || 'EUR', period || 'month', description, features || '[]', highlighted || false, cta_text, status || 'active']
    )

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('POST tarifs error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour un tarif
export async function PUT(req) {
  try {
    const { id, name, price, currency, period, description, features, highlighted, cta_text, status } = await req.json()

    const result = await query(
      'UPDATE tarifs SET name = $1, price = $2, currency = $3, period = $4, description = $5, features = $6, highlighted = $7, cta_text = $8, status = $9, updated_at = NOW() WHERE id = $10 RETURNING *',
      [name, price, currency, period, description, features, highlighted, cta_text, status, id]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('PUT tarifs error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer un tarif
export async function DELETE(req) {
  try {
    const { id } = await req.json()

    await query('DELETE FROM tarifs WHERE id = $1', [id])

    return NextResponse.json({ success: true, message: 'Tarif deleted' })
  } catch (error) {
    console.error('DELETE tarifs error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
