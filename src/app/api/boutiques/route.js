import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query('SELECT * FROM boutiques ORDER BY created_at DESC')
    return Response.json({ data: result.rows || [] })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { title, description, category, image_url, video_url, features, status } = await request.json()
    const result = await query(
      'INSERT INTO boutiques (title, description, category, image_url, video_url, features, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, category, image_url, video_url, features, status || 'active']
    )
    return Response.json({ data: result.rows[0] })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { id, title, description, category, image_url, video_url, features, status } = await request.json()
    const result = await query(
      'UPDATE boutiques SET title=$1, description=$2, category=$3, image_url=$4, video_url=$5, features=$6, status=$7, updated_at=NOW() WHERE id=$8 RETURNING *',
      [title, description, category, image_url, video_url, features, status, id]
    )
    return Response.json({ data: result.rows[0] })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    await query('DELETE FROM boutiques WHERE id=$1', [id])
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
