'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminChatPage() {
  const [allMessages, setAllMessages] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const interval = setInterval(fetchAllMessages, 2000)
    fetchAllMessages()
    return () => clearInterval(interval)
  }, [])

  const fetchAllMessages = async () => {
    try {
      const res = await fetch('/api/chat?admin=true')
      if (res.ok) {
        const d = await res.json()
        setAllMessages(d.data || [])
        setLoading(false)
      }
    } catch (e) {
      console.error('Error:', e)
    }
  }

  const sessions = [...new Set(allMessages.map(m => m.session_id))].map(sid => ({
    sessionId: sid,
    messages: allMessages.filter(m => m.session_id === sid),
    lastMessage: allMessages.filter(m => m.session_id === sid).pop(),
    userName: allMessages.find(m => m.session_id === sid)?.user_name || 'Visiteur'
  }))

  const currentSession = sessions.find(s => s.sessionId === selectedSession)

  const sendReply = async e => {
    e.preventDefault()
    if (!replyText.trim() || !selectedSession) return

    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: selectedSession,
        userName: 'Support',
        message: replyText,
        type: 'admin'
      })
    })
    setReplyText('')
    fetchAllMessages()
  }

  return (
    <div className="min-h-screen" style={{ background: '#02050a', color: '#e8e8ea' }}>
      {/* HEADER */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,255,65,0.12)', background: 'rgba(2,5,10,0.85)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ff41', letterSpacing: '2px' }}>💬 CHAT ADMIN</h1>
          <Link href="/admin/dashboard" style={{ padding: '8px 16px', background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '8px', color: '#00ff41', textDecoration: 'none', fontSize: '14px', cursor: 'pointer' }}>
            ← RETOUR
          </Link>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px', padding: '24px', maxWidth: '1280px', margin: '0 auto', height: 'calc(100vh - 80px)' }}>
        
        {/* SESSIONS LIST */}
        <div style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)', borderRadius: '12px', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#00ff41', margin: 0 }}>Sessions</h2>
            <p style={{ fontSize: '12px', color: 'rgba(232,232,234,0.3)', margin: '4px 0 0 0' }}>{sessions.length} conversation(s)</p>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {loading ? (
              <p style={{ padding: '16px', color: 'rgba(232,232,234,0.3)', fontSize: '14px' }}>Chargement...</p>
            ) : sessions.length === 0 ? (
              <p style={{ padding: '16px', color: 'rgba(232,232,234,0.3)', fontSize: '14px' }}>Aucune conversation</p>
            ) : (
              sessions.map(session => (
                <button
                  key={session.sessionId}
                  onClick={() => setSelectedSession(session.sessionId)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderBottom: '1px solid rgba(0,255,65,0.05)',
                    background: selectedSession === session.sessionId ? 'rgba(0,255,65,0.1)' : 'transparent',
                    border: selectedSession === session.sessionId ? '1px solid rgba(0,255,65,0.3)' : 'none',
                    borderBottom: '1px solid rgba(0,255,65,0.05)',
                    color: selectedSession === session.sessionId ? '#00ff41' : 'rgba(232,232,234,0.6)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontFamily: 'monospace'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,65,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = selectedSession === session.sessionId ? 'rgba(0,255,65,0.1)' : 'transparent'}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>👤 {session.userName}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(232,232,234,0.4)', marginTop: '4px' }}>{session.messages.length} messages</div>
                  <div style={{ fontSize: '11px', color: 'rgba(232,232,234,0.3)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.lastMessage?.message}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* MESSAGES */}
        {currentSession ? (
          <div style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            {/* HEADER */}
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#00ff41', margin: 0 }}>👤 {currentSession.userName}</h3>
              <p style={{ fontSize: '12px', color: 'rgba(232,232,234,0.3)', margin: '4px 0 0 0' }}>Session: {currentSession.sessionId.substring(0, 15)}...</p>
            </div>

            {/* MESSAGES LIST */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentSession.messages.length === 0 ? (
                <p style={{ color: 'rgba(232,232,234,0.3)', textAlign: 'center', margin: 'auto' }}>Aucun message</p>
              ) : (
                currentSession.messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '8px'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        background: msg.type === 'user' ? 'rgba(0,255,65,0.15)' : 'rgba(255,179,71,0.15)',
                        border: msg.type === 'user' ? '1px solid rgba(0,255,65,0.3)' : '1px solid rgba(255,179,71,0.3)',
                        color: msg.type === 'user' ? '#00ff41' : '#ffb347'
                      }}
                    >
                      {msg.type === 'admin' && (
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', opacity: 0.7 }}>🛟 Support</div>
                      )}
                      <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>{msg.message}</p>
                      <div style={{ fontSize: '10px', marginTop: '6px', opacity: 0.6 }}>
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* REPLY FORM */}
            <div style={{ padding: '16px', borderTop: '1px solid rgba(0,255,65,0.1)' }}>
              <form onSubmit={sendReply} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Répondre..."
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(0,255,65,0.2)',
                    borderRadius: '8px',
                    color: '#e8e8ea',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,65,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,255,65,0.2)'}
                />
                <button
                  type="submit"
                  style={{
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #00ff41, #ffb347)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'rgba(232,232,234,0.3)', fontSize: '16px' }}>Sélectionnez une conversation →</p>
          </div>
        )}
      </div>
    </div>
  )
}
