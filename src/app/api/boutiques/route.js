import { query } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// ─── Helpers ───────────────────────────────────────────────────────────────

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads')

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/quicktime', 'video/avi', 'video/webm']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10 MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200 MB

async function saveFile(file) {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

  if (!isImage && !isVideo) {
    throw new Error(`Type de fichier non autorisé : ${file.type}`)
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
  if (buffer.length > maxSize) {
    throw new Error(`Fichier trop lourd (max ${isVideo ? '200MB' : '10MB'})`)
  }

  const ext = file.name.split('.').pop()
  const filename = `${uuidv4()}.${ext}`
  const subdir = isVideo ? 'videos' : 'images'
  const dir = join(UPLOAD_DIR, subdir)

  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, filename), buffer)

  return `/uploads/${subdir}/${filename}`
}

function validate(fields) {
  const { title, category } = fields
  if (!title?.trim()) return 'Le titre est requis'
  if (!category?.trim()) return 'La catégorie est requise'
  return null
}

// ─── GET ───────────────────────────────────────────────────────────────────

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let sql = 'SELECT * FROM boutiques'
    const params = []
    const conditions = []

    if (category) {
      params.push(category)
      conditions.push(`category = $${params.length}`)
    }
    if (status) {
      params.push(status)
      conditions.push(`status = $${params.length}`)
    }

    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
    sql += ' ORDER BY created_at DESC'

    const result = await query(sql, params)
    return Response.json({ data: result.rows ?? [] })
  } catch (error) {
    console.error('[GET /boutiques]', error)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ─── POST — supporte JSON ET multipart/form-data (galerie téléphone) ───────

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    let fields = {}

    if (contentType.includes('multipart/form-data')) {
      // Upload depuis la galerie (photo/vidéo)
      const formData = await request.formData()

      fields = {
        title:       formData.get('title'),
        description: formData.get('description'),
        category:    formData.get('category'),
        features:    formData.get('features'),
        status:      formData.get('status'),
      }

      const imageFile = formData.get('image')   // <input name="image" type="file">
      const videoFile = formData.get('video')   // <input name="video" type="file">

      if (imageFile instanceof File) fields.image_url = await saveFile(imageFile)
      if (videoFile instanceof File) fields.video_url = await saveFile(videoFile)

    } else {
      // JSON classique
      fields = await request.json()
    }

    const error = validate(fields)
    if (error) return Response.json({ error }, { status: 400 })

    const { title, description, category, image_url, video_url, features, status } = fields

    const result = await query(
      `INSERT INTO boutiques
         (title, description, category, image_url, video_url, features, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [title, description ?? null, category, image_url ?? null, video_url ?? null, features ?? null, status ?? 'active']
    )

    return Response.json({ data: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('[POST /boutiques]', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// ─── PUT ───────────────────────────────────────────────────────────────────

export async function PUT(request) {
  try {
    const contentType = request.headers.get('content-type') ?? ''
    let fields = {}

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()

      fields = {
        id:          formData.get('id'),
        title:       formData.get('title'),
        description: formData.get('description'),
        category:    formData.get('category'),
        features:    formData.get('features'),
        status:      formData.get('status'),
        image_url:   formData.get('image_url'), // URL existante si pas de nouveau fichier
        video_url:   formData.get('video_url'),
      }

      const imageFile = formData.get('image')
      const videoFile = formData.get('video')

      if (imageFile instanceof File) fields.image_url = await saveFile(imageFile)
      if (videoFile instanceof File) fields.video_url = await saveFile(videoFile)

    } else {
      fields = await request.json()
    }

    const { id, title, description, category, image_url, video_url, features, status } = fields

    if (!id) return Response.json({ error: 'ID requis' }, { status: 400 })

    const result = await query(
      `UPDATE boutiques
       SET title=$1, description=$2, category=$3, image_url=$4,
           video_url=$5, features=$6, status=$7, updated_at=NOW()
       WHERE id=$8
       RETURNING *`,
      [title, description ?? null, category, image_url ?? null, video_url ?? null, features ?? null, status, id]
    )

    if (!result.rows[0]) return Response.json({ error: 'Boutique introuvable' }, { status: 404 })

    return Response.json({ data: result.rows[0] })
  } catch (error) {
    console.error('[PUT /boutiques]', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

// ─── DELETE ────────────────────────────────────────────────────────────────

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    if (!id) return Response.json({ error: 'ID requis' }, { status: 400 })

    const result = await query('DELETE FROM boutiques WHERE id=$1 RETURNING id', [id])

    if (!result.rows[0]) return Response.json({ error: 'Boutique introuvable' }, { status: 404 })

    return Response.json({ success: true })
  } catch (error) {
    console.error('[DELETE /boutiques]', error)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
