import { query } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return Response.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const messages = await query(
      'SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC LIMIT 50',
      [sessionId]
    )

    return Response.json({ data: messages.rows || [] })
  } catch (error) {
    console.error('Error fetching chat:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { sessionId, userName, message, type } = await request.json()

    if (!sessionId || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await query(
      'INSERT INTO chat_messages (session_id, user_name, message, type, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [sessionId, userName || 'Visiteur', message, type || 'user']
    )

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error sending message:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
