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
  
  .glitch { position: relative; display: inline-block; }
  .glitch:hover::before, .glitch:hover::after { content: attr(data-text); position: absolute; top: 0; left: 0; }
  .glitch:hover::before { animation: g1 0.3s; color: var(--red); clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%); transform: translateX(-3px); }
  .glitch:hover::after { animation: g2 0.3s; color: var(--green); clip-path: polygon(0 66%, 100% 66%, 100% 100%, 0 100%); transform: translateX(3px); }
  @keyframes g1 { 0%,100% { transform: translateX(-3px); } 25% { transform: translateX(3px); } }
  @keyframes g2 { 0%,100% { transform: translateX(3px); } 25% { transform: translateX(-3px); } }
  
  .hack-input {
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(0,255,65,0.2);
    color: var(--white);
    padding: 12px 16px;
    border-radius: 8px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 16px !important;
    width: 100%;
    transition: all 0.3s;
  }
  .hack-input:focus {
    outline: none;
    border-color: var(--green);
    box-shadow: 0 0 20px rgba(0,255,65,0.3), inset 0 0 20px rgba(0,255,65,0.05);
    background: rgba(0,255,65,0.02);
  }
  .hack-input::placeholder { color: rgba(232,232,234,0.2); }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,65,0.4); }
    50% { box-shadow: 0 0 0 10px rgba(0,255,65,0); }
  }
  
  .pulse-glow {
    animation: pulse-glow 2s infinite;
  }
  
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: var(--green); border-radius: 4px; }
  ::selection { background: rgba(0,255,65,0.2); }
  
  @media (max-width: 768px) {
    .font-bebas { font-size: max(1.2rem, 6vw) !important; }
  }
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

    const snippets = [
      'const access = verify()',
      'if (authorized) enter()',
      'await authenticate()',
      'export admin',
      'function login() {}',
      'while (secure) protect()',
      'npm run auth',
    ]

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

function GlitchH({ children, style = {} }) {
  return <span className={`glitch font-bebas`} data-text={children} style={style}>{children}</span>
}

export default function LoginPage() {
  const router = useRouter()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onMove = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password }),
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('auth_token', data.token)
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Erreur de connexion')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="cursor-block" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="grain scanlines" style={{ position: 'fixed', inset: 0, zIndex: 98, pointerEvents: 'none' }} />
      <CodeRain />
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(2,5,10,0.8) 100%)' }} />

      <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen flex items-center justify-center px-4 relative" style={{ zIndex: 10 }}>
        {/* RETOUR BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="fixed top-6 left-6 z-50 font-mono px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all cursor-none"
          style={{
            background: 'rgba(0,255,65,0.1)',
            border: '1px solid rgba(0,255,65,0.3)',
            color: 'var(--green)',
          }}
        >
          ← RETOUR
        </motion.button>

        {/* LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="w-full max-w-md rounded-lg overflow-hidden"
          style={{
            background: 'rgba(6,12,20,0.95)',
            border: '1px solid rgba(0,255,65,0.2)',
            boxShadow: '0 0 40px rgba(0,255,65,0.1)'
          }}
        >
          {/* HEADER */}
          <div className="px-6 md:px-8 pt-8 md:pt-12 pb-6 text-center" style={{ borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
            <motion.h1
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-bebas text-4xl md:text-5xl mb-2 font-black"
              style={{
                color: 'var(--green)',
                textShadow: '0 0 30px rgba(0,255,65,0.6)',
                letterSpacing: '4px'
              }}
            >
              JuDev
            </motion.h1>
            <p className="font-mono text-xs md:text-sm" style={{ color: 'rgba(0,255,65,0.4)', letterSpacing: '2px' }}>
              [ ADMIN ACCESS ]
            </p>
            <div className="mt-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--green), transparent)' }} />
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="px-6 md:px-8 py-8 md:py-10 space-y-6">
            {/* Username */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block font-mono text-xs mb-3" style={{ color: 'rgba(0,255,65,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="hack-input"
                disabled={loading}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block font-mono text-xs mb-3" style={{ color: 'rgba(0,255,65,0.6)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="hack-input"
                disabled={loading}
              />
            </motion.div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg text-sm font-mono"
                style={{
                  background: 'rgba(255,0,68,0.1)',
                  border: '1px solid rgba(255,0,68,0.3)',
                  color: 'var(--red)'
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 md:py-4 font-bebas text-lg md:text-xl font-black rounded-lg transition-all cursor-none disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,65,0.2), rgba(255,179,71,0.15))',
                border: '1px solid rgba(0,255,65,0.3)',
                color: 'var(--green)',
                textShadow: '0 0 10px rgba(0,255,65,0.5)',
                letterSpacing: '2px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,255,65,0.3), rgba(255,179,71,0.2))';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,65,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,255,65,0.2), rgba(255,179,71,0.15))';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {loading ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  CONNEXION...
                </motion.span>
              ) : (
                'SE CONNECTER'
              )}
            </motion.button>
          </form>

          {/* FOOTER */}
          <div className="px-6 md:px-8 py-4 text-center text-xs font-mono" style={{ borderTop: '1px solid rgba(0,255,65,0.1)', color: 'rgba(0,255,65,0.25)' }}>
            © 2026 <span style={{ color: 'var(--green)', textShadow: '0 0 10px rgba(0,255,65,0.5)' }}>JuDev</span> ADMIN
          </div>
        </motion.div>

        {/* Floating text background */}
        <div className="fixed bottom-10 left-10 md:bottom-20 md:left-20 font-mono text-xs opacity-10 pointer-events-none hidden md:block" style={{ color: 'var(--green)' }}>
          <div>&gt; INITIALIZING...</div>
          <div>&gt; SECURITY_CHECK</div>
          <div>&gt; AUTHENTICATION...</div>
        </div>
      </motion.div>
    </>
  )
}
