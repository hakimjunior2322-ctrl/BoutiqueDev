'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  
  /* IMAGE SCAN EFFECT */
  .scan-image { position: relative; overflow: hidden; }
  .scan-image::after {
    content: '';
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, transparent, rgba(0,255,65,0.3), transparent);
    animation: scanPass 0s ease-in;
    pointer-events: none;
  }
  .scan-image:hover::after {
    animation: scanPass 0.6s ease-in forwards;
  }
  @keyframes scanPass {
    0% { top: -100%; }
    100% { top: 100%; }
  }
  
  /* CARD TILT */
  .tilt-card {
    transition: transform 0.2s ease-out;
    transform-style: preserve-3d;
  }
  
  /* INPUT GLOW */
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
  .hack-input-enhanced::placeholder { color: rgba(232,232,234,0.2); font-family: 'Share Tech Mono', monospace; }
  
  /* SECTION LINE ANIMATION */
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
  
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: var(--green); border-radius: 4px; }
  ::selection { background: rgba(0,255,65,0.2); }
  
  /* RESPONSIVE IMPROVEMENTS */
  @media (max-width: 768px) {
    .font-bebas { font-size: max(1.2rem, 6vw) !important; }
  }
`

/* CODE RAIN */
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
      'const soul = new Dev()',
      'if (creative) render()',
      'class Portfolio {}',
      'import { passion }',
      'await deploy()',
      'const identity = dual',
      'function create() {}',
      'npm run feel',
      'export this',
      'while (alive) build()',
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

function GlitchH({ children, className = '', style = {} }) {
  return <span className={`glitch font-bebas ${className}`} data-text={children} style={style}>{children}</span>
}

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']
  const day = days[time.getDay()]
  const date = time.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })
  const timeStr = time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return (
    <div className="fixed bottom-8 right-6 md:right-8 z-10 font-mono text-xs" style={{ color: 'rgba(0,255,65,0.3)', textAlign: 'right', lineHeight: '1.6' }}>
      <div style={{ color: 'var(--green)', textShadow: '0 0 8px rgba(0,255,65,0.4)', fontWeight: 'bold' }}>{timeStr}</div>
      <div>{date}</div>
      <div>{day}</div>
    </div>
  )
}

/* SECTION HEADER */
function SectionHeader({ sceneNum, title, subtitle, style = {} }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={style}>
      <div className="flex items-center gap-4 mb-6">
        <div style={{ width: 2, height: 40, background: 'var(--amber)', boxShadow: '0 0 12px rgba(255,179,71,0.6)' }} />
        <div className="section-line" style={{ flex: 1, maxWidth: 100 }} />
        <p className="font-mono text-xs" style={{ color: 'var(--amber)', letterSpacing: '3px', textTransform: 'uppercase' }}>
          SCÈNE {String(sceneNum).padStart(3, '0')}
        </p>
      </div>
      <h2 className="font-bebas mb-2" style={{ fontSize: 'clamp(3rem,7vw,5.5rem)', letterSpacing: '-1px', lineHeight: '0.9' }}>
        <span style={{ color: 'var(--white)' }}>{title}</span><br/>
        <GlitchH style={{ color: 'var(--green)', textShadow: '0 0 30px rgba(0,255,65,0.4)' }}>{subtitle}</GlitchH>
      </h2>
    </motion.div>
  )
}

/* TILT CARD COMPONENT */
function TiltCard({ children, ...props }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientY - rect.top - rect.height / 2) / 20
    const y = (e.clientX - rect.left - rect.width / 2) / -20
    setTilt({ x, y })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="tilt-card" 
      style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }} {...props}>
      {children}
    </div>
  )
}

export default function JuDevCyber() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showSplash, setShowSplash] = useState(true)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [showAvisForm, setShowAvisForm] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ id: 1, sender: 'bot', text: "Bonjour! 👋" }])
  const [chatInput, setChatInput] = useState('')
  const [contactFormData, setContactFormData] = useState({ name: '', email: '', message: '' })
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSuccess, setContactSuccess] = useState('')
  const [avisFormData, setAvisFormData] = useState({ name: '', business: '', email: '', text: '', rating: 5 })
  const [avisSubmitting, setAvisSubmitting] = useState(false)
  const [avisSuccess, setAvisSuccess] = useState('')
  const [boutiques, setBoutiques] = useState([])
  const [avis, setAvis] = useState([])
  const [tarifs, setTarifs] = useState([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onMove = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    fetch('/api/boutiques').then(r => r.json()).then(d => setBoutiques((d.data || []).map(b => ({ id: b.id, title: b.title, url: b.image_url || 'https://via.placeholder.com/600x400?text=' + b.title, thumbnail: b.image_url || 'https://via.placeholder.com/200x150?text=' + b.title })))).catch(e => console.error('Erreur boutiques:', e))
  }, [])

  useEffect(() => {
    fetch('/api/avis?status=approved').then(r => r.json()).then(d => setAvis((d.data || []).map(a => ({ id: a.id, name: a.name, role: a.business || 'Client', text: a.text, rating: a.rating || 5, avatarInitial: a.name ? a.name.charAt(0).toUpperCase() : '?' })))).catch(e => console.error('Erreur avis:', e))
  }, [])

  useEffect(() => {
    fetch('/api/tarifs').then(r => r.json()).then(d => setTarifs((d.data || []).map((t, i) => ({ id: t.id, name: t.name, price: t.price ? t.price + '€' : 'Sur devis', period: t.period ? '/' + t.period : '', description: t.description || '', features: (t.features || '').split(',').filter(f => f.trim()).length > 0 ? (t.features || '').split(',').filter(f => f.trim()) : ['Voir tarif'], cta: 'Choisir', highlight: i === 1 })))).catch(e => console.error('Erreur tarifs:', e))
  }, [])

  const handleChatSend = () => {
    if (!chatInput.trim()) return
    setChatMessages(prev => [...prev, { id: prev.length + 1, sender: 'user', text: chatInput }])
    setChatInput('')
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: prev.length + 1, sender: 'bot', text: 'Merci! Passe ta demande à notre équipe.' }])
    }, 500)
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactSubmitting(true)
    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactFormData.name, email: contactFormData.email, phone: '', company: '', budget: 0, project_type: 'consultation', message: contactFormData.message, status: 'new' })
      })
      if (res.ok) {
        setContactSuccess('✓ Message reçu ! Réponse sous 24–48h.')
        setContactFormData({ name: '', email: '', message: '' })
        setTimeout(() => setContactSuccess(''), 5000)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setContactSubmitting(false)
    }
  }

  const handleAvisSubmit = async (e) => {
    e.preventDefault()
    setAvisSubmitting(true)
    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: avisFormData.name, business: avisFormData.business, email: avisFormData.email, text: avisFormData.text, rating: avisFormData.rating, status: 'pending' })
      })
      if (res.ok) {
        setAvisSuccess('✓ Merci ! Avis publié après validation.')
        setAvisFormData({ name: '', business: '', email: '', text: '', rating: 5 })
        setShowAvisForm(false)
        setTimeout(() => setAvisSuccess(''), 5000)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setAvisSubmitting(false)
    }
  }

  const navItems = [
    { id: 'home', label: 'Accueil', shortLabel: 'Home' },
    { id: 'judev', label: 'Nos Clients', shortLabel: 'Clients' },
    { id: 'avis', label: 'Avis', shortLabel: 'Avis' },
    { id: 'tarifs', label: 'Tarifs', shortLabel: 'Tarifs' },
    { id: 'contact', label: 'Contact', shortLabel: 'Contact' },
  ]

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  }

  if (showSplash) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#02050a' }}>
          <div className="text-center relative z-10">
            <motion.h1 animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="font-bebas text-8xl font-black mb-4" style={{ textShadow: '0 0 40px rgba(0,255,65,0.6)', letterSpacing: '4px', color: 'var(--green)' }}>JuDev</motion.h1>
            <motion.p animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, delay: 0.3, repeat: Infinity }} className="font-mono text-xs tracking-widest" style={{ color: 'rgba(0,255,65,0.5)' }}>[ INITIALISATION... ]</motion.p>
            <motion.div initial={{ width: 0 }} animate={{ width: 100 }} transition={{ duration: 3 }} className="mt-8 h-px w-32 mx-auto" style={{ background: 'linear-gradient(90deg, var(--green), transparent)' }} />
          </div>
          <CodeRain />
        </div>
      </>
    )
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="cursor-block" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="grain scanlines" style={{ position: 'fixed', inset: 0, zIndex: 98, pointerEvents: 'none' }} />
      <CodeRain />
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(2,5,10,0.8) 100%)' }} />

      <LiveClock />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40" style={{ background: 'rgba(2,5,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,255,65,0.12)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <button onClick={() => setCurrentPage('home')} className="font-bebas text-2xl font-black" style={{ color: 'var(--green)', textShadow: '0 0 20px rgba(0,255,65,0.5)', letterSpacing: '2px', background: 'none', border: 'none', cursor: 'none' }}>JuDev</button>
          <div className="flex items-center gap-1 md:gap-3 lg:gap-4 flex-wrap justify-end">
            {/* DESKTOP - Texte complet */}
            <div className="hidden lg:flex gap-1">
              {navItems.map((item) => (
                <motion.button key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage(item.id)} className="font-mono px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all whitespace-nowrap" style={{ background: currentPage === item.id ? 'rgba(0,255,65,0.15)' : 'transparent', color: currentPage === item.id ? 'var(--green)' : 'rgba(232,232,234,0.35)', textShadow: currentPage === item.id ? '0 0 10px rgba(0,255,65,0.5)' : 'none' }}>
                  {item.label}
                </motion.button>
              ))}
            </div>
            {/* MOBILE & TABLET - Texte court */}
            <div className="lg:hidden flex gap-1 flex-wrap justify-end">
              {navItems.map((item) => (
                <motion.button key={item.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage(item.id)} className="font-mono px-2.5 md:px-3 py-1.5 text-xs font-semibold rounded transition-all whitespace-nowrap" style={{ background: currentPage === item.id ? 'rgba(0,255,65,0.15)' : 'transparent', color: currentPage === item.id ? 'var(--green)' : 'rgba(232,232,234,0.35)' }}>
                  {item.shortLabel}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* HOME */}
      {currentPage === 'home' && (
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen pt-16 md:pt-20 flex items-center justify-center relative" style={{ zIndex: 10 }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6 w-full text-center py-20 md:py-32">
            <p className="font-mono text-xs md:text-sm mb-4 md:mb-6 tracking-widest" style={{ color: 'var(--amber)', letterSpacing: '4px' }}>// BIENVENU(E) //</p>
            <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="font-bebas leading-tight mb-6 md:mb-8" style={{ fontSize: 'clamp(3.5rem, 10vw, 10rem)', letterSpacing: '-2px' }}>
              <span className="block" style={{ color: 'var(--white)' }}>DÉVELOPPEUR</span>
              <GlitchH style={{ color: 'var(--green)', textShadow: '0 0 40px rgba(0,255,65,0.5)' }}>CRÉATIF</GlitchH>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-base md:text-2xl mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2" style={{ color: 'rgba(232,232,234,0.6)' }}>
              Je crée des <span style={{ color: 'var(--amber)' }}>interfaces web UNIQUE</span> et des <span style={{ color: 'var(--green)' }}>expériences 3D</span> qui VOUS fascinent.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center px-2">
              <motion.button whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(0,255,65,0.3)' }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage('judev')} className="font-mono px-6 md:px-8 py-3 md:py-4 rounded-lg hover:text-white transition text-base md:text-lg w-full md:w-auto" style={{ background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.3)', color: 'var(--green)' }}>
                → NOS CLIENTS
              </motion.button>
              <motion.button whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(255,179,71,0.3)' }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage('contact')} className="font-mono px-6 md:px-8 py-3 md:py-4 rounded-lg hover:text-white transition text-base md:text-lg w-full md:w-auto" style={{ background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.3)', color: 'var(--amber)' }}>
                → NOUS CONTACTER 
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* JUDEV */}
      {currentPage === 'judev' && (
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 relative" style={{ zIndex: 10 }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeader sceneNum={1} title="GALERIE" subtitle="BOUTIQUES" />
            {selectedMedia && (
              <div onClick={() => setSelectedMedia(null)} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(2,5,10,0.92)', backdropFilter: 'blur(12px)' }}>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setSelectedMedia(null)} className="absolute -top-10 right-0 font-mono text-3xl" style={{ color: 'rgba(232,232,234,0.6)' }}>✕</button>
                  <img src={selectedMedia.url} alt={selectedMedia.title} className="w-full h-auto rounded-lg" />
                  <p className="text-center text-gray-400 mt-6 text-lg">{selectedMedia.title}</p>
                </motion.div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-10">
              {boutiques.length === 0 ? (
                <p style={{ color: 'rgba(232,232,234,0.3)' }}>Chargement boutiques...</p>
              ) : boutiques.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedMedia(item)} className="group relative rounded-lg overflow-hidden" style={{ cursor: 'none', background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)' }}>
                  <div className="relative h-64 scan-image">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-end p-4" style={{ background: 'linear-gradient(to top, rgba(2,5,10,0.9), transparent)' }}>
                      <p className="font-mono font-semibold" style={{ color: 'var(--green)' }}>{item.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* AVIS */}
      {currentPage === 'avis' && (
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 relative" style={{ zIndex: 10 }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
              <SectionHeader sceneNum={2} title="AVIS" subtitle="CLIENTS" />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAvisForm(!showAvisForm)} className="font-mono px-6 py-3 rounded-lg font-semibold hover:text-white transition w-full md:w-auto" style={{ background: 'linear-gradient(135deg, rgba(0,255,65,0.1), rgba(255,179,71,0.1))', border: '1px solid rgba(0,255,65,0.2)', color: 'var(--green)' }}>
                + LAISSER UN AVIS
              </motion.button>
            </div>

            {avisSuccess && (
              <div className="mb-8 p-4 rounded-lg text-center text-sm font-semibold" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac' }}>
                {avisSuccess}
              </div>
            )}

            {showAvisForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 md:p-10 mb-12 rounded-lg" style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)' }}>
                <form onSubmit={handleAvisSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-white/70 text-sm mb-2 font-semibold font-mono">Nom *</label>
                      <input type="text" placeholder="Jean Dupont" value={avisFormData.name} onChange={(e) => setAvisFormData({ ...avisFormData, name: e.target.value })} className="hack-input-enhanced" required />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-2 font-semibold font-mono">Entreprise</label>
                      <input type="text" placeholder="E-commerce, Startup…" value={avisFormData.business} onChange={(e) => setAvisFormData({ ...avisFormData, business: e.target.value })} className="hack-input-enhanced" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2 font-semibold font-mono">Email *</label>
                    <input type="email" placeholder="votre@email.com" value={avisFormData.email} onChange={(e) => setAvisFormData({ ...avisFormData, email: e.target.value })} className="hack-input-enhanced" required />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-3 font-semibold font-mono">Note *</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button key={star} type="button" whileHover={{ scale: 1.2 }} onClick={() => setAvisFormData({ ...avisFormData, rating: star })} className="text-5xl transition-all" style={{ opacity: star <= avisFormData.rating ? 1 : 0.3 }}>
                          ⭐
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2 font-semibold font-mono">Avis *</label>
                    <textarea placeholder="Partagez votre expérience…" rows={5} value={avisFormData.text} onChange={(e) => setAvisFormData({ ...avisFormData, text: e.target.value })} className="hack-input-enhanced resize-none" required />
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={avisSubmitting} className="w-full py-3 rounded-lg font-semibold font-mono disabled:opacity-50" style={{ background: 'linear-gradient(135deg, var(--green), var(--amber))', color: '#000' }}>
                    {avisSubmitting ? 'ENVOI...' : 'PUBLIER MON AVIS'}
                  </motion.button>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              {avis.length === 0 ? (
                <p style={{ color: 'rgba(232,232,234,0.3)' }}>Chargement avis...</p>
              ) : avis.map((testimonial, i) => (
                <motion.div key={testimonial.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} as={TiltCard} className="p-6 md:p-8 rounded-lg" style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)' }}>
                  <div className="flex items-start gap-4 mb-4">
                    <svg width="48" height="48" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                      <defs>
                        <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: '#00ff41', stopOpacity: 0.25 }} />
                          <stop offset="100%" style={{ stopColor: '#ffb347', stopOpacity: 0.25 }} />
                        </linearGradient>
                      </defs>
                      {/* Fond */}
                      <circle cx="24" cy="24" r="24" fill="url(#avatarGrad)" stroke="rgba(0,255,65,0.3)" strokeWidth="1" />
                      {/* Tête silhouette */}
                      <circle cx="24" cy="15" r="7" fill="rgba(0,255,65,0.5)" />
                      {/* Corps silhouette */}
                      <path d="M 16 26 Q 16 24 24 24 Q 32 24 32 26 L 32 34 Q 32 36 24 36 Q 16 36 16 34 Z" fill="rgba(0,255,65,0.4)" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white font-mono">{testimonial.name}</h3>
                      <p className="text-sm" style={{ color: 'rgba(232,232,234,0.4)' }}>{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <p className="italic" style={{ color: 'rgba(232,232,234,0.55)' }}>"{testimonial.text}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TARIFS */}
      {currentPage === 'tarifs' && (
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 relative" style={{ zIndex: 10 }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeader sceneNum={3} title="NOS" subtitle="TARIFS" />
            <p style={{ color: 'rgba(232,232,234,0.4)', marginBottom: '64px', fontSize: '18px' }}>Choisis le plan qui correspond à tes besoins</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {tarifs.length === 0 ? (
                <p style={{ color: 'rgba(232,232,234,0.3)' }}>Chargement tarifs...</p>
              ) : tarifs.map((plan, i) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} as={TiltCard} className="relative rounded-lg p-6 md:p-8 transition-all" style={{ background: 'rgba(6,12,20,0.8)', border: `1px solid rgba(0,255,65,${plan.highlight ? 0.3 : 0.1})`, transform: plan.highlight ? 'scale(1.05)' : 'scale(1)' }}>
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 font-mono px-4 py-1 rounded-full text-xs font-bold" style={{ background: 'linear-gradient(135deg, var(--green), var(--amber))', color: '#000', whiteSpace: 'nowrap' }}>
                      RECOMMANDÉ
                    </div>
                  )}
                  <h3 className="font-bebas text-2xl md:text-3xl text-white mb-1">{plan.name}</h3>
                  <p style={{ color: 'rgba(232,232,234,0.4)', fontSize: '14px', marginBottom: '24px' }}>{plan.description}</p>
                  <div className="mb-8">
                    <span className="font-bebas font-black" style={{ fontSize: '3rem', color: 'var(--green)', textShadow: '0 0 20px rgba(0,255,65,0.4)' }}>{plan.price}</span>
                    <span style={{ color: 'rgba(232,232,234,0.3)' }}>{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="text-sm flex items-center gap-3" style={{ color: 'rgba(232,232,234,0.55)' }}>
                        <span style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage('contact')} className="w-full py-3 rounded-lg font-semibold font-mono transition" style={{ background: plan.highlight ? 'linear-gradient(135deg, var(--green), var(--amber))' : 'rgba(0,255,65,0.1)', color: plan.highlight ? '#000' : 'var(--green)', border: plan.highlight ? 'none' : '1px solid rgba(0,255,65,0.3)' }}>
                    {plan.cta}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* CONTACT */}
      {currentPage === 'contact' && (
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 flex items-center justify-center relative" style={{ zIndex: 10 }}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 w-full">
            <SectionHeader sceneNum={4} title="ME" subtitle="CONTACTER" />
            
            {/* CONTACT CARDS - Mix des 4 options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 mt-12">
              
              {/* EMAIL CARD - Flip + Copy */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }}
                className="group relative h-48 cursor-none"
              >
                <div 
                  className="w-full h-full rounded-lg p-6 md:p-8 transition-all duration-500 transform-gpu relative"
                  style={{ 
                    background: 'rgba(6,12,20,0.8)', 
                    border: '1px solid rgba(0,255,65,0.1)',
                    transformStyle: 'preserve-3d'
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
                  {/* Scan line overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '-100%',
                      left: 0,
                      width: '100%',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, var(--green), transparent)',
                      animation: 'none'
                    }}
                    className="group-hover:animate-pulse"
                  />
                  
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="font-mono text-xs mb-3" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '2px' }}>
                        &gt; MAIL_PROTOCOL
                      </div>
                      <h3 className="font-bebas text-2xl text-white mb-2" style={{ textShadow: '0 0 15px rgba(0,255,65,0.3)' }}>
                        EMAIL
                      </h3>
                      <p className="font-mono text-xs" style={{ color: 'rgba(0,255,65,0.4)' }}>
                        [ CLICK TO REVEAL ]
                      </p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        navigator.clipboard.writeText('hello@judev.com');
                        e.currentTarget.innerText = '✓ COPIED !';
                        setTimeout(() => { e.currentTarget.innerText = 'hello@judev.com'; }, 2000);
                      }}
                      className="font-mono text-sm px-4 py-2 rounded transition-all text-white"
                      style={{ 
                        background: 'rgba(0,255,65,0.1)', 
                        border: '1px solid rgba(0,255,65,0.3)',
                        color: 'var(--green)',
                        textShadow: '0 0 8px rgba(0,255,65,0.5)'
                      }}
                    >
                      hello@judev.com
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* PHONE CARD - Terminal style */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="group relative h-48 cursor-none"
              >
                <div 
                  className="w-full h-full rounded-lg p-6 md:p-8 transition-all duration-500 relative"
                  style={{ 
                    background: 'rgba(6,12,20,0.8)', 
                    border: '1px solid rgba(255,179,71,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255,179,71,0.4)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255,179,71,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255,179,71,0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="font-mono text-xs mb-3" style={{ color: 'rgba(255,179,71,0.5)', letterSpacing: '2px' }}>
                        &gt; PHONE_CALL
                      </div>
                      <h3 className="font-bebas text-2xl text-white mb-2" style={{ textShadow: '0 0 15px rgba(255,179,71,0.3)' }}>
                        TÉLÉPHONE
                      </h3>
                      <p className="font-mono text-xs" style={{ color: 'rgba(255,179,71,0.4)' }}>
                        [ CLICK TO REVEAL ]
                      </p>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        navigator.clipboard.writeText('+33 6 12 34 56 78');
                        e.currentTarget.innerText = '✓ COPIED !';
                        setTimeout(() => { e.currentTarget.innerText = '+33 6 12 34 56 78'; }, 2000);
                      }}
                      className="font-mono text-sm px-4 py-2 rounded transition-all text-white"
                      style={{ 
                        background: 'rgba(255,179,71,0.1)', 
                        border: '1px solid rgba(255,179,71,0.3)',
                        color: 'var(--amber)',
                        textShadow: '0 0 8px rgba(255,179,71,0.5)'
                      }}
                    >
                      +33 6 12 34 56 78
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* CHAT CARD - Interactive toggle */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="group relative h-48 cursor-none"
              >
                <div 
                  className="w-full h-full rounded-lg p-6 md:p-8 transition-all duration-500 relative flex flex-col justify-between"
                  style={{ 
                    background: showChat ? 'rgba(0,255,65,0.08)' : 'rgba(6,12,20,0.8)', 
                    border: showChat ? '1px solid rgba(0,255,65,0.4)' : '1px solid rgba(0,255,65,0.1)',
                    boxShadow: showChat ? '0 0 20px rgba(0,255,65,0.2)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!showChat) {
                      e.currentTarget.style.border = '1px solid rgba(0,255,65,0.4)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,65,0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showChat) {
                      e.currentTarget.style.border = '1px solid rgba(0,255,65,0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div>
                    <div className="font-mono text-xs mb-3" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '2px' }}>
                      &gt; LIVE_CHAT
                    </div>
                    <h3 className="font-bebas text-2xl text-white mb-2" style={{ textShadow: '0 0 15px rgba(0,255,65,0.3)' }}>
                      CHAT
                    </h3>
                    <p className="font-mono text-xs" style={{ color: 'rgba(0,255,65,0.4)' }}>
                      [ CONNEXION { showChat ? 'ACTIVE' : 'INACTIVE' } ]
                    </p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowChat(!showChat)}
                    className="font-mono text-sm px-4 py-2 rounded transition-all text-white w-full"
                    style={{ 
                      background: showChat ? 'rgba(0,255,65,0.2)' : 'rgba(0,255,65,0.1)', 
                      border: '1px solid rgba(0,255,65,0.3)',
                      color: 'var(--green)',
                      textShadow: '0 0 8px rgba(0,255,65,0.5)'
                    }}
                  >
                    {showChat ? '◉ CHAT ACTIF' : '○ ACTIVER CHAT'}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {showChat && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-5 mb-8 rounded-lg" style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(255,179,71,0.1)' }}>
                <div className="space-y-3 max-h-72 overflow-y-auto mb-4 pr-1">
                  {chatMessages.map(msg => (
                    <motion.div key={msg.id} initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-xs px-4 py-2 rounded-lg text-sm font-mono" style={msg.sender === 'user' ? { background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.25)', color: 'rgba(0,255,65,0.8)' } : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Écris ton message…" className="flex-1 px-4 py-2 text-sm rounded-lg font-mono hack-input-enhanced" />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleChatSend} className="px-4 py-2 rounded-lg text-sm font-mono" style={{ background: 'var(--green)', color: '#000' }}>Envoyer</motion.button>
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 md:p-10 rounded-lg" style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)' }}>
              {contactSuccess && (
                <div className="mb-6 p-4 rounded-lg text-center text-sm font-semibold" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac' }}>
                  {contactSuccess}
                </div>
              )}
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/65 text-sm mb-2 font-semibold font-mono">Nom</label>
                    <input type="text" placeholder="Ton nom" value={contactFormData.name} onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })} className="hack-input-enhanced" required />
                  </div>
                  <div>
                    <label className="block text-white/65 text-sm mb-2 font-semibold font-mono">Email</label>
                    <input type="email" placeholder="tonemail@example.com" value={contactFormData.email} onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })} className="hack-input-enhanced" required />
                  </div>
                </div>
                <div>
                  <label className="block text-white/65 text-sm mb-2 font-semibold font-mono">Message</label>
                  <textarea placeholder="Décris ton projet en détail…" rows={6} value={contactFormData.message} onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })} className="hack-input-enhanced resize-none" required />
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={contactSubmitting} className="w-full py-3 rounded-lg font-semibold font-mono disabled:opacity-50" style={{ background: 'linear-gradient(135deg, var(--green), var(--amber))', color: '#000' }}>
                  {contactSubmitting ? 'ENVOI...' : 'ENVOYER MON MESSAGE'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* FOOTER */}
      <footer className="relative" style={{ zIndex: 10, borderTop: '1px solid rgba(0,255,65,0.08)', padding: '24px 40px', textAlign: 'center', background: 'rgba(2,5,10,0.85)' }}>
        <p className="font-mono text-sm" style={{ color: 'rgba(0,255,65,0.25)' }}>© 2026 <span style={{ color: 'var(--green)', textShadow: '0 0 10px rgba(0,255,65,0.5)' }}>JuDev</span> — Créé avec passion et amour ✨</p>
      </footer>
    </>
  )
}
