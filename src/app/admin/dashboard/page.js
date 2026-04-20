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
  
  .glow-green { text-shadow: 0 0 20px rgba(0,255,65,0.6); }
  .text-green { color: var(--green); }
  .text-amber { color: var(--amber); }
  
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
  
  .hack-input-enhanced {
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(0,255,65,0.2);
    color: var(--white);
    padding: 12px;
    border-radius: 8px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 16px !important;
    width: 100%;
    transition: all 0.3s;
  }
  .hack-input-enhanced:focus {
    outline: none;
    border-color: var(--green);
    box-shadow: 0 0 20px rgba(0,255,65,0.3), inset 0 0 20px rgba(0,255,65,0.05);
    background: rgba(0,255,65,0.02);
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
      'const admin = true',
      'if (access) manage()',
      'class Dashboard {}',
      'async function load()',
      'await update()',
      'export dashboard',
      'npm run admin',
      'while (online) work()',
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

export default function DashboardPage() {
  const router = useRouter()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [stats, setStats] = useState({
    boutiques: 0,
    avis: 0,
    devis: 0,
    tarifs: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchStats()
  }, [router])

  useEffect(() => {
    const onMove = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const fetchStats = async () => {
    try {
      const [boutiques, avis, devis, tarifs] = await Promise.all([
        fetch('/api/boutiques').then(r => r.json()),
        fetch('/api/avis').then(r => r.json()),
        fetch('/api/devis').then(r => r.json()),
        fetch('/api/tarifs').then(r => r.json()),
      ])

      setStats({
        boutiques: boutiques.data?.length || 0,
        avis: avis.data?.length || 0,
        devis: devis.data?.length || 0,
        tarifs: tarifs.data?.length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/admin/login')
  }

  const menuItems = [
    { label: 'Boutiques', href: '/admin/boutiques', icon: '🛍️', key: 'boutiques' },
    { label: 'Avis', href: '/admin/avis', icon: '⭐', key: 'avis' },
    { label: 'Tarifs', href: '/admin/tarifs', icon: '💰', key: 'tarifs' },
    { label: 'Devis', href: '/admin/devis', icon: '📋', key: 'devis' },
  ]

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
            <div>
              <button onClick={() => router.push('/')} className="font-bebas text-xl md:text-2xl font-black" style={{ color: 'var(--green)', textShadow: '0 0 20px rgba(0,255,65,0.5)', letterSpacing: '2px', background: 'none', border: 'none', cursor: 'none' }}>
                JuDev
              </button>
              <p className="font-mono text-xs" style={{ color: 'rgba(0,255,65,0.4)', letterSpacing: '2px' }}>ADMIN</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="font-mono px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all"
              style={{ background: 'rgba(255,0,68,0.1)', border: '1px solid rgba(255,0,68,0.3)', color: 'var(--red)' }}
            >
              DÉCONNEXION
            </motion.button>
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
                TABLEAU DE BORD
              </p>
            </div>
            <h1 className="font-bebas leading-tight" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', letterSpacing: '-1px', lineHeight: '0.9' }}>
              <span style={{ color: 'var(--white)' }}>BIENVENUE</span><br/>
              <GlitchH style={{ color: 'var(--green)', textShadow: '0 0 30px rgba(0,255,65,0.4)' }}>ADMIN</GlitchH>
            </h1>
          </div>

          {/* STATS CARDS */}
          {loading ? (
            <div className="text-center py-20">
              <p className="font-mono" style={{ color: 'rgba(0,255,65,0.4)' }}>[ CHARGEMENT DES DONNÉES... ]</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-12">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="tilt-card rounded-lg p-4 md:p-6 transition-all group cursor-none"
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
                    <div className="text-3xl md:text-4xl mb-3" style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,65,0.3))' }}>
                      {item.icon}
                    </div>
                    <p className="font-mono text-xs md:text-sm mb-2" style={{ color: 'rgba(0,255,65,0.6)', letterSpacing: '1px' }}>
                      {item.label}
                    </p>
                    <p className="font-bebas text-2xl md:text-3xl font-black" style={{ color: 'var(--green)', textShadow: '0 0 15px rgba(0,255,65,0.4)' }}>
                      {stats[item.key]}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* MENU BUTTONS - RESPONSIVE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(item.href)}
                    className="group relative px-5 md:px-8 py-4 md:py-6 rounded-lg text-left font-mono transition-all overflow-hidden cursor-none"
                    style={{
                      background: 'rgba(6,12,20,0.8)',
                      border: '1px solid rgba(0,255,65,0.1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(0,255,65,0.4)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,65,0.2)';
                      e.currentTarget.style.background = 'rgba(6,12,20,0.95)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border = '1px solid rgba(0,255,65,0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = 'rgba(6,12,20,0.8)';
                    }}
                  >
                    {/* Scan line effect */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-100%',
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, var(--green), transparent)',
                      }}
                      className="group-hover:animate-pulse"
                    />

                    <div className="flex items-center justify-between md:flex-col md:items-start">
                      <div className="flex items-center gap-3 md:gap-4 flex-1">
                        <span className="text-2xl md:text-4xl">{item.icon}</span>
                        <div className="md:hidden">
                          <p className="font-bold text-white text-sm" style={{ color: 'var(--green)' }}>{item.label}</p>
                          <p className="text-xs" style={{ color: 'rgba(0,255,65,0.5)' }}>{stats[item.key]} éléments</p>
                        </div>
                      </div>
                      <div className="hidden md:block w-full">
                        <p className="font-bold text-lg md:text-xl mb-2" style={{ color: 'var(--green)', textShadow: '0 0 10px rgba(0,255,65,0.4)' }}>
                          {item.label}
                        </p>
                        <p className="text-sm" style={{ color: 'rgba(0,255,65,0.6)' }}>
                          {stats[item.key]} éléments
                        </p>
                      </div>
                      <span className="hidden md:block text-xl" style={{ color: 'var(--green)' }}>→</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </>
  )
}
