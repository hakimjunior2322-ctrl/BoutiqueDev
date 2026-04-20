'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

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
  
  .hack-input {
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(0,255,65,0.2);
    color: var(--white);
    padding: 10px 14px;
    border-radius: 8px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 14px !important;
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
      'const pricing = load()',
      'if (plan) display()',
      'await calculate()',
      'export tarifs',
      'function manage() {}',
      'while (active) sync()',
      'npm run pricing',
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

export default function TarifsPage() {
  const router = useRouter()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [tarifs, setTarifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'EUR',
    period: 'once',
    description: '',
    features: '',
    highlighted: false,
    cta_text: 'Choisir',
  })

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchTarifs()
  }, [router])

  useEffect(() => {
    const onMove = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const fetchTarifs = async () => {
    try {
      const res = await fetch('/api/tarifs')
      const data = await res.json()
      setTarifs(data.data || [])
    } catch (error) {
      console.error('Error fetching tarifs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/tarifs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          name: '',
          price: '',
          currency: 'EUR',
          period: 'once',
          description: '',
          features: '',
          highlighted: false,
          cta_text: 'Choisir',
        })
        setShowForm(false)
        fetchTarifs()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) return

    try {
      const res = await fetch('/api/tarifs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        fetchTarifs()
      }
    } catch (error) {
      console.error('Error:', error)
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
              className="font-mono px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all cursor-none"
              style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.3)', color: 'var(--green)' }}
            >
              ← RETOUR
            </motion.button>

            <h1 className="font-bebas text-lg md:text-2xl font-black" style={{ color: 'var(--green)', textShadow: '0 0 20px rgba(0,255,65,0.5)', letterSpacing: '2px' }}>
              TARIFS
            </h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="font-mono px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all cursor-none"
              style={{ background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.3)', color: 'var(--green)' }}
            >
              + NOUVEAU
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
                GESTION
              </p>
            </div>
            <h2 className="font-bebas leading-tight" style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', letterSpacing: '-1px', lineHeight: '0.9' }}>
              <span style={{ color: 'var(--white)' }}>NOS</span><br/>
              <GlitchH style={{ color: 'var(--green)', textShadow: '0 0 30px rgba(0,255,65,0.4)' }}>TARIFS</GlitchH>
            </h2>
          </div>

          {/* FORM */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-12 rounded-lg p-6 md:p-8"
                style={{
                  background: 'rgba(6,12,20,0.8)',
                  border: '1px solid rgba(0,255,65,0.2)',
                }}
              >
                <h3 className="font-bebas text-2xl mb-6" style={{ color: 'var(--green)', textShadow: '0 0 10px rgba(0,255,65,0.3)' }}>
                  + AJOUTER UN TARIF
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nom */}
                    <div>
                      <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
                        NOM DU PLAN *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Starter, Pro, Enterprise..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="hack-input"
                        required
                      />
                    </div>

                    {/* Prix */}
                    <div>
                      <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
                        PRIX *
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="hack-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
                      DESCRIPTION
                    </label>
                    <input
                      type="text"
                      placeholder="Description courte du plan..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="hack-input"
                    />
                  </div>

                  {/* Fonctionnalités */}
                  <div>
                    <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
                      FONCTIONNALITÉS (séparées par des virgules)
                    </label>
                    <textarea
                      placeholder="Feature 1, Feature 2, Feature 3..."
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="hack-input resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Grid pour Period et CTA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
                        PÉRIODE
                      </label>
                      <select
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        className="hack-input"
                      >
                        <option value="once">Une seule fois</option>
                        <option value="month">/mois</option>
                        <option value="year">/an</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
                        TEXTE CTA
                      </label>
                      <input
                        type="text"
                        placeholder="Choisir"
                        value={formData.cta_text}
                        onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                        className="hack-input"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="flex-1 py-3 font-mono font-semibold rounded-lg cursor-none transition"
                      style={{ background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.3)', color: 'var(--green)' }}
                    >
                      ✓ CRÉER
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 font-mono font-semibold rounded-lg cursor-none transition"
                      style={{ background: 'rgba(255,0,68,0.1)', border: '1px solid rgba(255,0,68,0.3)', color: 'var(--red)' }}
                    >
                      ANNULER
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TARIFS GRID */}
          {loading ? (
            <div className="text-center py-20">
              <p className="font-mono" style={{ color: 'rgba(0,255,65,0.4)' }}>[ CHARGEMENT... ]</p>
            </div>
          ) : tarifs.length === 0 ? (
            <div className="text-center py-20 rounded-lg" style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)' }}>
              <p className="font-mono text-lg" style={{ color: 'rgba(0,255,65,0.4)' }}>
                [ AUCUN TARIF — CRÉEZ-EN UN ! ]
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {tarifs.map((tarif, i) => (
                <motion.div
                  key={tarif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="tilt-card rounded-lg p-5 md:p-8 transition-all group cursor-none relative"
                  style={{
                    background: tarif.highlighted ? 'rgba(0,255,65,0.08)' : 'rgba(6,12,20,0.8)',
                    border: tarif.highlighted ? '1px solid rgba(0,255,65,0.4)' : '1px solid rgba(0,255,65,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = tarif.highlighted ? '1px solid rgba(0,255,65,0.4)' : '1px solid rgba(0,255,65,0.4)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,65,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = tarif.highlighted ? '1px solid rgba(0,255,65,0.4)' : '1px solid rgba(0,255,65,0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Highlight badge */}
                  {tarif.highlighted && (
                    <div className="absolute top-4 right-4 font-mono text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.3)', color: 'var(--green)', textShadow: '0 0 8px rgba(0,255,65,0.3)' }}>
                      VEDETTE
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="font-bebas text-2xl mb-3" style={{ color: 'var(--green)', textShadow: '0 0 10px rgba(0,255,65,0.3)' }}>
                    {tarif.name}
                  </h3>

                  {tarif.description && (
                    <p className="text-sm mb-4" style={{ color: 'rgba(232,232,234,0.6)' }}>
                      {tarif.description}
                    </p>
                  )}

                  <div className="mb-6 pb-6" style={{ borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
                    <p className="font-bebas text-3xl md:text-4xl" style={{ color: 'var(--green)', textShadow: '0 0 15px rgba(0,255,65,0.4)' }}>
                      {tarif.price}€
                    </p>
                    {tarif.period && (
                      <p className="font-mono text-xs" style={{ color: 'rgba(0,255,65,0.4)' }}>
                        / {tarif.period === 'month' ? 'mois' : tarif.period === 'year' ? 'an' : 'une seule fois'}
                      </p>
                    )}
                  </div>

                  {tarif.features && (
                    <div className="space-y-2 mb-8">
                      {tarif.features.split(',').map((feature, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(232,232,234,0.6)' }}>
                          <span style={{ color: 'var(--green)' }}>✓</span>
                          {feature.trim()}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delete Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(tarif.id)}
                    className="w-full py-2 md:py-3 font-mono text-xs md:text-sm rounded-lg transition cursor-none"
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
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
