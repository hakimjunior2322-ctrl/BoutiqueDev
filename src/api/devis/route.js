import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET - Récupérer tous les devis
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    let sql = 'SELECT * FROM devis'
    const params = []

    if (status) {
      sql += ' WHERE status = $1'
      params.push(status)
    }

    sql += ' ORDER BY created_at DESC'

    const result = await query(sql, params)

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('GET devis error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - Créer un nouveau devis
export async function POST(req) {
  try {
    const { name, email, phone, company, budget, project_type, timeline, message, status } = await req.json()

    const result = await query(
      'INSERT INTO devis (name, email, phone, company, budget, project_type, timeline, message, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, email, phone, company, budget, project_type, timeline, message, status || 'new']
    )

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('POST devis error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour un devis
export async function PUT(req) {
  try {
    const { id, name, email, phone, company, budget, project_type, timeline, message, status } = await req.json()

    const result = await query(
      'UPDATE devis SET name = $1, email = $2, phone = $3, company = $4, budget = $5, project_type = $6, timeline = $7, message = $8, status = $9, updated_at = NOW() WHERE id = $10 RETURNING *',
      [name, email, phone, company, budget, project_type, timeline, message, status, id]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('PUT devis error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer un devis
export async function DELETE(req) {
  try {
    const { id } = await req.json()

    await query('DELETE FROM devis WHERE id = $1', [id])

    return NextResponse.json({ success: true, message: 'Devis deleted' })
  } catch (error) {
    console.error('DELETE devis error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
