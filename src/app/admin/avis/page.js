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
  
  .section-line {
    position: relative;
    height: 1px;
    background: linear-gradient(90deg, rgba(0,255,65,0.3), transparent);
    overflow: hidden;
  }
  .section-line::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, var(--green), transparent);
    animation: lineSlide 1.5s ease-in-out infinite;
  }
  @keyframes lineSlide {
    0% { left: -100%; }
    50% { left: 100%; }
    100% { left: 100%; }
  }
  
  .tilt-card {
    transition: transform 0.2s ease-out;
    transform-style: preserve-3d;
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
      'const reviews = load()',
      'if (approved) show()',
      'await validate()',
      'export feedback',
      'function manage() {}',
      'while (reviewing) check()',
      'npm run review',
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

export default function AvisPage() {
  const router = useRouter()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [avis, setAvis] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('approved')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchAvis()
  }, [router, filterStatus])

  useEffect(() => {
    const onMove = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const fetchAvis = async () => {
    try {
      const res = await fetch(`/api/avis?status=${filterStatus}`)
      const data = await res.json()
      setAvis(data.data || [])
    } catch (error) {
      console.error('Error fetching avis:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const avisItem = avis.find(a => a.id === id)
      const res = await fetch('/api/avis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...avisItem, id, status: 'approved' }),
      })

      if (res.ok) {
        fetchAvis()
      }
    } catch (error) {
      console.error('Error approving avis:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr?')) return

    try {
      const res = await fetch('/api/avis', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        fetchAvis()
      }
    } catch (error) {
      console.error('Error deleting avis:', error)
    }
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="cursor-block" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="grain scanlines" style={{ position: 'fixed', inset: 0, zIndex: 98, pointerEvents: 'none' }} />
      <CodeRain />
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(2,5,10,0.8) 100%)' }} />

      <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen pt-16 md:pt-20 pb-16 md:pb-20 relative" style={{ zIndex: 10 }}>
        {/* HEADER */}
        <nav className="fixed top-0 left-0 right-0 z-40" style={{ background: 'rgba(2,5,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,255,65,0.12)' }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="font-mono px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all"
              style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.3)', color: 'var(--green)' }}
            >
              ← RETOUR
            </motion.button>

            <h1 className="font-bebas text-lg md:text-2xl font-black" style={{ color: 'var(--green)', textShadow: '0 0 20px rgba(0,255,65,0.5)', letterSpacing: '2px' }}>
              AVIS
            </h1>

            <div />
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          {/* TITLE SECTION */}
          <div className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div style={{ width: 2, height: 40, background: 'var(--amber)', boxShadow: '0 0 12px rgba(255,179,71,0.6)' }} />
              <div className="section-line" style={{ flex: 1, maxWidth: 100 }} />
              <p className="font-mono text-xs" style={{ color: 'var(--amber)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                GESTION
              </p>
            </div>
            <h2 className="font-bebas leading-tight" style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', letterSpacing: '-1px', lineHeight: '0.9' }}>
              <span style={{ color: 'var(--white)' }}>LES</span><br/>
              <GlitchH style={{ color: 'var(--green)', textShadow: '0 0 30px rgba(0,255,65,0.4)' }}>AVIS</GlitchH>
            </h2>
          </div>

          {/* FILTERS */}
          <div className="flex gap-3 md:gap-4 mb-12 flex-wrap">
            {['approved', 'pending'].map(status => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status)}
                className="font-mono px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all cursor-none"
                style={{
                  background: filterStatus === status ? 'rgba(0,255,65,0.12)' : 'rgba(6,12,20,0.8)',
                  border: filterStatus === status ? '1px solid rgba(0,255,65,0.4)' : '1px solid rgba(0,255,65,0.1)',
                  color: filterStatus === status ? 'var(--green)' : 'rgba(0,255,65,0.5)',
                  textShadow: filterStatus === status ? '0 0 10px rgba(0,255,65,0.5)' : 'none',
                  boxShadow: filterStatus === status ? '0 0 15px rgba(0,255,65,0.2)' : 'none'
                }}
              >
                {status === 'approved' ? '✓ APPROUVÉS' : '⏳ EN ATTENTE'}
              </motion.button>
            ))}
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="text-center py-20">
              <p className="font-mono" style={{ color: 'rgba(0,255,65,0.4)' }}>[ CHARGEMENT... ]</p>
            </div>
          ) : avis.length === 0 ? (
            <div className="text-center py-20 rounded-lg" style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)' }}>
              <p className="font-mono text-lg" style={{ color: 'rgba(0,255,65,0.4)' }}>
                [ AUCUN AVIS {filterStatus === 'pending' ? 'EN ATTENTE' : 'APPROUVÉ'} ]
              </p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {avis.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="tilt-card rounded-lg p-5 md:p-8 transition-all group cursor-none"
                  style={{
                    background: 'rgba(6,12,20,0.8)',
                    border: '1px solid rgba(0,255,65,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(0,255,65,0.4)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,65,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(0,255,65,0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="font-bebas text-lg md:text-2xl mb-1" style={{ color: 'var(--green)', textShadow: '0 0 10px rgba(0,255,65,0.3)' }}>
                        {item.name}
                      </h3>
                      <p className="font-mono text-xs md:text-sm" style={{ color: 'rgba(0,255,65,0.5)' }}>
                        {item.business || 'Client'}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs" style={{ color: 'rgba(0,255,65,0.4)', letterSpacing: '1px' }}>
                        NOTE
                      </span>
                      <div className="text-xl md:text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(255,179,71,0.4))' }}>
                        {'⭐'.repeat(item.rating || 5)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6 pb-6" style={{ borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
                    <p className="text-sm md:text-base italic" style={{ color: 'rgba(232,232,234,0.7)', lineHeight: '1.6' }}>
                      "{item.text}"
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    {filterStatus === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 font-mono px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all cursor-none"
                        style={{
                          background: 'rgba(0,255,65,0.1)',
                          border: '1px solid rgba(0,255,65,0.3)',
                          color: 'var(--green)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0,255,65,0.2)';
                          e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,65,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0,255,65,0.1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        ✓ APPROUVER
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 font-mono px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all cursor-none"
                      style={{
                        background: 'rgba(255,0,68,0.1)',
                        border: '1px solid rgba(255,0,68,0.3)',
                        color: 'var(--red)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,0,68,0.2)';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(255,0,68,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,0,68,0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      🗑️ SUPPRIMER
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
