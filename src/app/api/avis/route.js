import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET - Récupérer tous les avis
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'approved'

    const result = await query(
      'SELECT * FROM avis WHERE status = $1 ORDER BY created_at DESC',
      [status]
    )

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('GET avis error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - Créer un nouvel avis
export async function POST(req) {
  try {
    const { name, business, email, text, rating, status } = await req.json()

    const result = await query(
      'INSERT INTO avis (name, business, email, text, rating, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, business, email, text, rating || 5, status || 'pending']
    )

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('POST avis error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour un avis
export async function PUT(req) {
  try {
    const { id, name, business, email, text, rating, status } = await req.json()

    const result = await query(
      'UPDATE avis SET name = $1, business = $2, email = $3, text = $4, rating = $5, status = $6, approved_at = NOW() WHERE id = $7 RETURNING *',
      [name, business, email, text, rating, status, id]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('PUT avis error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer un avis
export async function DELETE(req) {
  try {
    const { id } = await req.json()

    await query('DELETE FROM avis WHERE id = $1', [id])

    return NextResponse.json({ success: true, message: 'Avis deleted' })
  } catch (error) {
    console.error('DELETE avis error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
