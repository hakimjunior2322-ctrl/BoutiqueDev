import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET - Récupérer toutes les boutiques
export async function GET() {
  try {
    const result = await query('SELECT * FROM boutiques ORDER BY created_at DESC')
    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('GET boutiques error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - Créer une nouvelle boutique
export async function POST(req) {
  try {
    const { title, description, category, image_url, video_url, features, status } = await req.json()

    const result = await query(
      'INSERT INTO boutiques (title, description, category, image_url, video_url, features, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, category, image_url, video_url, features || '[]', status || 'active']
    )

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('POST boutiques error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT - Mettre à jour une boutique
export async function PUT(req) {
  try {
    const { id, title, description, category, image_url, video_url, features, status } = await req.json()

    const result = await query(
      'UPDATE boutiques SET title = $1, description = $2, category = $3, image_url = $4, video_url = $5, features = $6, status = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
      [title, description, category, image_url, video_url, features || '[]', status, id]
    )

    return NextResponse.json({ success: true, data: result.rows[0] })
  } catch (error) {
    console.error('PUT boutiques error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE - Supprimer une boutique
export async function DELETE(req) {
  try {
    const { id } = await req.json()

    await query('DELETE FROM boutiques WHERE id = $1', [id])

    return NextResponse.json({ success: true, message: 'Boutique deleted' })
  } catch (error) {
    console.error('DELETE boutiques error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
