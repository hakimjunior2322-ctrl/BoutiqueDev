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
      'const shops = load()',
      'if (store) display()',
      'await sync()',
      'export boutique',
      'function create() {}',
      'while (online) manage()',
      'npm run shop',
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

// ─── MODAL BOUTIQUE ─────────────────────────────────────────────────────────

function FileDropZone({ label, accept, file, preview, onFile, icon }) {
  const inputRef = useRef()

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="relative cursor-none group border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 min-h-[120px] transition-all"
      style={{
        borderColor: 'rgba(0,255,65,0.2)',
        background: 'rgba(6,12,20,0.6)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,255,65,0.5)';
        e.currentTarget.style.background = 'rgba(6,12,20,0.8)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,255,65,0.2)';
        e.currentTarget.style.background = 'rgba(6,12,20,0.6)';
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFile(e.target.files[0] ?? null)}
      />

      {preview ? (
        <>
          {accept.startsWith('image') ? (
            <img src={preview} alt="preview" className="w-full h-28 object-cover rounded-lg" />
          ) : (
            <video src={preview} className="w-full h-28 object-cover rounded-lg" controls />
          )}
          <p className="text-xs font-mono" style={{ color: 'rgba(0,255,65,0.6)' }}>{file?.name}</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFile(null) }}
            className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full transition"
            style={{ background: 'rgba(0,0,0,0.8)', color: 'var(--red)' }}
          >✕</button>
        </>
      ) : (
        <>
          <span className="text-3xl opacity-40 group-hover:opacity-70 transition">{icon}</span>
          <span className="text-xs font-mono text-center" style={{ color: 'rgba(0,255,65,0.4)' }}>{label}</span>
        </>
      )}
    </div>
  )
}

function BoutiqueModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id
  const [form, setForm] = useState(initial ? { ...initial } : {
    title: '', description: '', category: '', features: '', status: 'active'
  })
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initial?.image_url ?? null)
  const [videoPreview, setVideoPreview] = useState(initial?.video_url ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleImageFile(file) {
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  function handleVideoFile(file) {
    setVideoFile(file)
    setVideoPreview(file ? URL.createObjectURL(file) : null)
  }

  async function handleSubmit() {
    if (!form.title.trim()) return setError('Le titre est requis')
    setSaving(true)
    setError('')

    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v != null) fd.append(k, v)
      })
      if (imageFile) fd.append('image', imageFile)
      if (videoFile) fd.append('video', videoFile)

      const res = await fetch('/api/boutiques', {
        method: isEdit ? 'PUT' : 'POST',
        body: fd,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur inconnue')

      onSaved(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 cursor-none"
      style={{ background: 'rgba(2,5,10,0.9)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-lg rounded-lg overflow-hidden max-h-[92vh] flex flex-col"
        style={{
          background: 'rgba(6,12,20,0.95)',
          border: '1px solid rgba(0,255,65,0.2)',
          boxShadow: '0 0 30px rgba(0,255,65,0.1)'
        }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
          <h2 className="font-bebas text-xl" style={{ color: 'var(--green)', textShadow: '0 0 10px rgba(0,255,65,0.3)' }}>
            {isEdit ? '✎ MODIFIER' : '+ NOUVELLE BOUTIQUE'}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="font-mono text-lg cursor-none"
            style={{ color: 'var(--red)' }}
          >
            ✕
          </motion.button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Upload zones */}
          <div className="grid grid-cols-2 gap-3">
            <FileDropZone
              label="Photo"
              accept="image/*"
              file={imageFile}
              preview={imagePreview}
              onFile={handleImageFile}
              icon="📷"
            />
            <FileDropZone
              label="Vidéo"
              accept="video/*"
              file={videoFile}
              preview={videoPreview}
              onFile={handleVideoFile}
              icon="🎬"
            />
          </div>

          {/* Titre */}
          <div>
            <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
              TITRE *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Nom de la boutique"
              className="hack-input"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
              DESCRIPTION
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description courte..."
              rows={3}
              className="hack-input resize-none"
            />
          </div>

          {/* Catégorie & Statut */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
                CATÉGORIE
              </label>
              <input
                type="text"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                placeholder="Mode, Tech..."
                className="hack-input"
              />
            </div>
            <div>
              <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
                STATUT
              </label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="hack-input"
                style={{ color: 'var(--white)' }}
              >
                <option value="active">● Actif</option>
                <option value="inactive">○ Inactif</option>
              </select>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block font-mono text-xs mb-2" style={{ color: 'rgba(0,255,65,0.5)', letterSpacing: '1px' }}>
              CARACTÉRISTIQUES
            </label>
            <input
              type="text"
              value={form.features}
              onChange={e => setForm({ ...form, features: e.target.value })}
              placeholder="Livraison, Retours, Click & Collect..."
              className="hack-input"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 rounded-lg text-sm font-mono" style={{ background: 'rgba(255,0,68,0.1)', border: '1px solid rgba(255,0,68,0.3)', color: 'var(--red)' }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid rgba(0,255,65,0.1)' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-sm font-mono rounded-lg transition cursor-none"
            style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.2)', color: 'rgba(0,255,65,0.5)' }}
          >
            ANNULER
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3 text-sm font-mono font-semibold rounded-lg transition cursor-none disabled:opacity-50"
            style={{ background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.3)', color: 'var(--green)' }}
          >
            {saving ? '⏳ ENVOI...' : isEdit ? '✓ METTRE À JOUR' : '✓ CRÉER'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── BOUTIQUE CARD ──────────────────────────────────────────────────────────

function BoutiqueCard({ boutique, onEdit, onDelete, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6 }}
      className="tilt-card rounded-lg overflow-hidden group cursor-none"
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
      {/* Media */}
      <div className="relative h-48 bg-black/60 overflow-hidden">
        {boutique.video_url ? (
          <video
            src={boutique.video_url}
            className="w-full h-full object-cover"
            muted loop
            onMouseOver={e => e.target.play()}
            onMouseOut={e => { e.target.pause(); e.target.currentTime = 0 }}
          />
        ) : boutique.image_url ? (
          <img src={boutique.image_url} alt={boutique.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🏪</div>
        )}

        {/* Status badge */}
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="absolute top-3 right-3 text-xs px-2 py-1 rounded-lg font-mono font-semibold transition cursor-none"
          style={{
            background: boutique.status === 'active' ? 'rgba(0,255,65,0.12)' : 'rgba(100,100,100,0.12)',
            border: boutique.status === 'active' ? '1px solid rgba(0,255,65,0.3)' : '1px solid rgba(100,100,100,0.3)',
            color: boutique.status === 'active' ? 'var(--green)' : 'rgba(150,150,150,0.8)',
            textShadow: boutique.status === 'active' ? '0 0 8px rgba(0,255,65,0.3)' : 'none'
          }}
        >
          {boutique.status === 'active' ? '● ACTIF' : '○ INACTIF'}
        </motion.span>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bebas text-lg" style={{ color: 'var(--green)', textShadow: '0 0 10px rgba(0,255,65,0.3)' }}>
            {boutique.title}
          </h3>
          {boutique.category && (
            <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.2)', color: 'rgba(0,255,65,0.5)' }}>
              {boutique.category}
            </span>
          )}
        </div>
        {boutique.description && (
          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'rgba(232,232,234,0.6)' }}>
            {boutique.description}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(boutique)}
            className="flex-1 py-2 text-xs md:text-sm font-mono rounded-lg transition cursor-none"
            style={{ background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.3)', color: 'var(--green)' }}
          >
            ✎ MODIFIER
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(boutique.id)}
            className="flex-1 py-2 text-xs md:text-sm font-mono rounded-lg transition cursor-none"
            style={{ background: 'rgba(255,0,68,0.1)', border: '1px solid rgba(255,0,68,0.3)', color: 'var(--red)' }}
          >
            🗑️ SUPPRIMER
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── PAGE PRINCIPALE ────────────────────────────────────────────────────────

export default function BoutiquesPage() {
  const router = useRouter()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { router.push('/admin/login'); return }
    fetchBoutiques()
  }, [router])

  useEffect(() => {
    const onMove = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const fetchBoutiques = async () => {
    try {
      const res = await fetch('/api/boutiques')
      const data = await res.json()
      setBoutiques(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaved = (saved) => {
    setBoutiques(prev => {
      const exists = prev.find(b => b.id === saved.id)
      return exists
        ? prev.map(b => b.id === saved.id ? saved : b)
        : [saved, ...prev]
    })
    setModal(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette boutique ?')) return
    try {
      const res = await fetch('/api/boutiques', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) setBoutiques(prev => prev.filter(b => b.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = boutiques.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  )

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
              BOUTIQUES
            </h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModal({ mode: 'create' })}
              className="font-mono px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all cursor-none"
              style={{ background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.3)', color: 'var(--green)' }}
            >
              + NOUVELLE
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
              <span style={{ color: 'var(--white)' }}>MES</span><br/>
              <span className="glitch" data-text="BOUTIQUES" style={{ color: 'var(--green)', textShadow: '0 0 30px rgba(0,255,65,0.4)' }}>BOUTIQUES</span>
            </h2>
          </div>

          {/* SEARCH */}
          <div className="mb-8 md:mb-12">
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Rechercher par titre ou catégorie..."
              className="hack-input"
            />
          </div>

          {/* GRID */}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="w-12 h-12 border-2 rounded-full"
                style={{ borderColor: 'var(--green)', borderTopColor: 'transparent' }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 rounded-lg" style={{ background: 'rgba(6,12,20,0.8)', border: '1px solid rgba(0,255,65,0.1)' }}>
              <p className="text-5xl mb-4">🏪</p>
              <p className="font-mono" style={{ color: 'rgba(0,255,65,0.4)' }}>
                {search ? '[ AUCUN RÉSULTAT ]' : '[ AUCUNE BOUTIQUE — CRÉEZ-EN UNE ! ]'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filtered.map((b, i) => (
                <BoutiqueCard
                  key={b.id}
                  boutique={b}
                  index={i}
                  onEdit={(b) => setModal(b)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {modal && (
          <BoutiqueModal
            initial={modal.mode === 'create' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </>
  )
}
