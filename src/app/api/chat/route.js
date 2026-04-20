import { query } from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  const messages = await query('SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT 50', [sessionId])
  return Response.json({ data: messages.rows || [] })
}

export async function POST(request) {
  const { sessionId, userName, message, type } = await request.json()
  await query('INSERT INTO chat_messages (session_id, user_name, message, type, created_at) VALUES ($1, $2, $3, $4, NOW())', [sessionId, userName || 'Visiteur', message, type || 'user'])
  return Response.json({ success: true })
}
