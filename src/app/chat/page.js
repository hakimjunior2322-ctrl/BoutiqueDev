'use client'
import { useState, useEffect, useRef } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [userName, setUserName] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setSessionId(`session_${Date.now()}`)
  }, [])

  useEffect(() => {
    if (!started || !sessionId) return
    const interval = setInterval(async () => {
      const res = await fetch(`/api/chat?sessionId=${sessionId}`)
      if (res.ok) {
        const d = await res.json()
        setMessages(d.data || [])
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [sessionId, started])

  const send = async e => {
    e.preventDefault()
    if (!newMsg.trim()) return
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userName,
        message: newMsg,
        type: 'user',
      }),
    })
    setNewMsg('')
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-cyan-400 text-center mb-8">💬 Chat en Direct</h1>
          <input
            type="text"
            placeholder="Votre prénom"
            onChange={e => setUserName(e.target.value)}
            className="w-full px-4 py-3 bg-black/60 border border-cyan-400/30 rounded-lg text-white mb-4"
            autoFocus
          />
          <button
            onClick={() => setStarted(!!userName)}
            className="w-full px-6 py-3 bg-cyan-400/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/30"
          >
            Commencer le chat →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="bg-cyan-950/20 border-b border-cyan-500/20 py-4 px-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-cyan-400">💬 Support en Direct</h1>
            <p className="text-gray-400 text-sm">Connecté en tant que : {userName}</p>
          </div>
          <button
            onClick={() => {
              setStarted(false)
              setMessages([])
            }}
            className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm"
          >
            Quitter
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">Aucun message... Posez votre question ! 👇</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-sm px-6 py-3 rounded-xl ${
                  m.type === 'user'
                    ? 'bg-cyan-400 text-black rounded-br-none'
                    : 'bg-gray-700 text-gray-100 rounded-bl-none'
                }`}
              >
                {m.type === 'admin' && <p className="text-xs font-bold mb-1 opacity-70">Support</p>}
                <p>{m.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-cyan-950/20 border-t border-cyan-500/20 py-4 px-6 flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          placeholder="Votre message..."
          className="flex-1 px-4 py-3 bg-black/60 border border-cyan-400/30 rounded-lg text-white"
          onKeyPress={e => e.key === 'Enter' && send(e)}
        />
        <button
          onClick={send}
          className="px-6 py-3 bg-cyan-400/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/30"
        >
          →
        </button>
      </div>
    </div>
  )
}
