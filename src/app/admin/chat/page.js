'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');
  :root {
    --green: #00ff41;
    --amber: #ffb347;
    --red: #ff0044;
    --white: #e8e8ea;
    --bg: #02050a;
  }
  * { cursor: none !important; }
  body { font-family: 'Barlow', sans-serif !important; background: var(--bg) !important; color: var(--white) !important; }
  
  .cursor-block { position: fixed; width: 10px; height: 18px; background: var(--green); pointer-events: none; z-index: 9999; animation: blink 1s step-end infinite; transform: translate(-2px, -16px); mix-blend-mode: exclusion; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
  
  .grain::after { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.035; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
  .scanlines::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 99; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px); }
  
  .font-bebas { font-family: 'Bebas Neue', cursive !important; }
  .font-mono { font-family: 'Share Tech Mono', monospace !important; }
  
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: var(--green); border-radius: 4px; }
  ::selection { background: rgba(0,255,65,0.2); }
`

function CodeRain() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)

    const snippets = ['const chat = true', 'if (message) respond()', 'class Support {}']

    const FONT_SIZE = 13
    const cols = Math.floor(W / (FONT_SIZE * 1.1))
    const drops = Array.from({ length: cols }, () => Math.random() * -100)
    const colSnippets = Array.from({ length: cols }, () => snippets[Math.floor(Math.random() * snippets.length)])
    const colSpeeds = Array.from({ length: cols }, () => 0.2 + Math.random() * 0.6)
    const colOpacity = Array.from({ length: cols }, () => 0.04 + Math.random() * 0.12)

    let raf
    const draw = () => {
      ctx.fillStyle = 'rgba(2,5,10,0.06)'
      ctx.fillRect(0, 0, W, H)

      for (let i = 0; i < cols; i++) {
        const snippet = colSnippets[i]
        const chars = snippet.split('')
        const x = i * FONT_SIZE * 1.1

        chars.forEach((char, j) => {
          const y = (drops[i] + j) * FONT_SIZE
          if (y < 0 || y > H + 50) return
          ctx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`
          if (j === 0) {
            ctx.fillStyle = `rgba(180,255,200,${colOpacity[i] * 4})`
          } else {
            const fade = 1 - j / chars.length
            ctx.fillStyle = `rgba(0,255,65,${colOpacity[i] * fade * 1.5})`
          }
          ctx.fillText(char, x, y)
        })

        drops[i] += colSpeeds[i]
        if (drops[i] * FONT_SIZE > H + 200) {
          drops[i] = -30 - Math.random() * 50
          colSnippets[i] = snippets[Math.floor(Math.random() * snippets.length)]
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'none', opacity:0.8 }} />
}

export default function AdminChatPage() {
  const router = useRouter()
  const [allMessages, setAllMessages] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    const interval = setInterval(fetchAllMessages, 2000)
    fetchAllMessages()
    return () => clearInterval(interval)
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [allMessages, selectedSession])

  useEffect(() => {
    const onMove = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const fetchAllMessages = async () => {
    try {
      const res = await fetch('/api/chat')
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
  })).sort((a, b) => new Date(b.lastMessage?.created_at || 0) - new Date(a.lastMessage?.created_at || 0))

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
    <>
      <style>{STYLES}</style>
      <div className="cursor-block" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="grain scanlines" style={{ position: 'fixed', inset: 0, zIndex: 98, pointerEvents: 'none' }} />
      <CodeRain />
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(2,5,10,0.8) 100%)' }} />

      {/* HEADER */}
      <nav className="fixed top-0 left-0 right-0 z-40" style={{ background: 'rgba(2,5,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,255,65,0.12)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <h1 className="font-bebas text-xl md:text-2xl font-black" style={{ color: '#00ff41', textShadow: '0 0 20px rgba(0,255,65,0.5)', letterSpacing: '2px' }}>💬 CHAT ADMIN</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/admin/dashboard')}
            className="font-mono px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all"
            style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.3)', color: '#00ff41' }}
          >
            ← RETOUR
          </motion.button>
        </div>
      </nav>

      {/* MAIN */}
      <div className="min-h-screen pt-16 md:pt-20 pb-8" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-calc" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px', maxHeight: 'calc(100vh - 100px)' }}>
          
          {/* SESSIONS LIST */}
          <div style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
              <h2 className="font-mono" style={{ fontSize: '16px', fontWeight: 'bold', color: '#00ff41', margin: 0 }}>Sessions</h2>
              <p className="font-mono" style={{ fontSize: '12px', color: 'rgba(232,232,234,0.3)', margin: '4px 0 0 0' }}>{sessions.length} conversation(s)</p>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {loading ? (
                <p className="font-mono" style={{ padding: '16px', color: 'rgba(232,232,234,0.3)', fontSize: '14px' }}>Chargement...</p>
              ) : sessions.length === 0 ? (
                <p className="font-mono" style={{ padding: '16px', color: 'rgba(232,232,234,0.3)', fontSize: '14px' }}>Aucune conversation</p>
              ) : (
                sessions.map(session => (
                  <motion.button
                    key={session.sessionId}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedSession(session.sessionId)}
                    className="font-mono"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderBottom: '1px solid rgba(0,255,65,0.05)',
                      background: selectedSession === session.sessionId ? 'rgba(0,255,65,0.1)' : 'transparent',
                      border: selectedSession === session.sessionId ? '1px solid rgba(0,255,65,0.3)' : 'none',
                      color: selectedSession === session.sessionId ? '#00ff41' : 'rgba(232,232,234,0.6)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      fontSize: '13px'
                    }}
                    onMouseEnter={e => !selectedSession && (e.currentTarget.style.background = 'rgba(0,255,65,0.05)')}
                    onMouseLeave={e => !selectedSession && (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontWeight: 'bold' }}>👤 {session.userName}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(232,232,234,0.4)', marginTop: '4px' }}>{session.messages.length} messages</div>
                    <div style={{ fontSize: '11px', color: 'rgba(232,232,234,0.3)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.lastMessage?.message}
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* MESSAGES */}
          {currentSession ? (
            <div style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
              {/* HEADER */}
              <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
                <h3 className="font-mono" style={{ fontSize: '16px', fontWeight: 'bold', color: '#00ff41', margin: 0 }}>👤 {currentSession.userName}</h3>
                <p className="font-mono" style={{ fontSize: '12px', color: 'rgba(232,232,234,0.3)', margin: '4px 0 0 0' }}>Session: {currentSession.sessionId.substring(0, 15)}...</p>
              </div>

              {/* MESSAGES LIST */}
              <div style={{ flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentSession.messages.length === 0 ? (
                  <p className="font-mono" style={{ color: 'rgba(232,232,234,0.3)', textAlign: 'center', margin: 'auto' }}>Aucun message</p>
                ) : (
                  currentSession.messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{
                        display: 'flex',
                        justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '8px'
                      }}
                    >
                      <div
                        className="font-mono"
                        style={{
                          maxWidth: '70%',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          background: msg.type === 'user' ? 'rgba(0,255,65,0.15)' : 'rgba(255,179,71,0.15)',
                          border: msg.type === 'user' ? '1px solid rgba(0,255,65,0.3)' : '1px solid rgba(255,179,71,0.3)',
                          color: msg.type === 'user' ? '#00ff41' : '#ffb347',
                          fontSize: '14px'
                        }}
                      >
                        {msg.type === 'admin' && (
                          <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', opacity: 0.7 }}>🛟 Support</div>
                        )}
                        <p style={{ margin: 0, lineHeight: '1.4' }}>{msg.message}</p>
                        <div style={{ fontSize: '10px', marginTop: '6px', opacity: 0.6 }}>
                          {new Date(msg.created_at).toLocaleTimeString('fr-FR')}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* REPLY FORM */}
              <div style={{ padding: '16px', borderTop: '1px solid rgba(0,255,65,0.1)' }}>
                <form onSubmit={sendReply} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Répondre..."
                    className="font-mono"
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(0,255,65,0.2)',
                      borderRadius: '8px',
                      color: '#e8e8ea',
                      fontSize: '14px'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,65,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(0,255,65,0.2)'}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="font-mono"
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
                  >
                    Envoyer
                  </motion.button>
                </form>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="font-mono" style={{ color: 'rgba(232,232,234,0.3)', fontSize: '16px' }}>Sélectionnez une conversation →</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
