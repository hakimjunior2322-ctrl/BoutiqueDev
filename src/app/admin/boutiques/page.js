'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  features: '',
  status: 'active',
}

// ─── Upload Zone ────────────────────────────────────────────────────────────

function FileDropZone({ label, accept, file, preview, onFile, icon }) {
  const inputRef = useRef()

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="relative cursor-pointer group border-2 border-dashed border-cyan-500/30 rounded-xl p-4 hover:border-cyan-400/60 transition-all bg-black/40 flex flex-col items-center justify-center gap-2 min-h-[120px]"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture="environment"
        className="hidden"
        onChange={(e) => onFile(e.target.files[0] ?? null)}
      />

      {preview ? (
        <>
          {accept.startsWith('image') ? (
            <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
          ) : (
            <video src={preview} className="w-full h-32 object-cover rounded-lg" controls />
          )}
          <p className="text-xs text-cyan-400 truncate max-w-full">{file?.name}</p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onFile(null) }}
            className="absolute top-2 right-2 text-red-400 bg-black/60 rounded-full px-2 py-0.5 text-xs hover:text-red-300"
          >✕</button>
        </>
      ) : (
        <>
          <span className="text-3xl opacity-40 group-hover:opacity-70 transition">{icon}</span>
          <span className="text-xs text-gray-400 group-hover:text-cyan-300 transition text-center">{label}</span>
        </>
      )}
    </div>
  )
}

// ─── Boutique Card ──────────────────────────────────────────────────────────

function BoutiqueCard({ boutique, onEdit, onDelete, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 200, damping: 20 }}
      className="group bg-gradient-to-br from-cyan-950/20 to-black border border-cyan-500/20 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all"
    >
      {/* Media */}
      <div className="relative h-44 bg-black/60 overflow-hidden">
        {boutique.video_url ? (
          <video
            src={boutique.video_url}
            className="w-full h-full object-cover"
            muted loop
            onMouseOver={e => e.target.play()}
            onMouseOut={e => { e.target.pause(); e.target.currentTime = 0 }}
          />
        ) : boutique.image_url ? (
          <img src={boutique.image_url} alt={boutique.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🏪</div>
        )}

        {/* Status badge */}
        <span className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full border font-semibold ${
          boutique.status === 'active'
            ? 'bg-green-500/20 border-green-500/50 text-green-400'
            : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
        }`}>
          {boutique.status === 'active' ? '● Actif' : '○ Inactif'}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-lg font-bold text-cyan-300 leading-tight">{boutique.title}</h3>
          {boutique.category && (
            <span className="text-xs text-cyan-500/70 border border-cyan-500/20 rounded px-2 py-0.5 whitespace-nowrap">{boutique.category}</span>
          )}
        </div>
        {boutique.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{boutique.description}</p>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit(boutique)}
            className="flex-1 py-2 text-sm bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 rounded-lg hover:bg-cyan-400/20 transition font-medium"
          >
            ✎ Modifier
          </button>
          <button
            onClick={() => onDelete(boutique.id)}
            className="flex-1 py-2 text-sm bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition font-medium"
          >
            🗑 Supprimer
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Form Modal ─────────────────────────────────────────────────────────────

function BoutiqueModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id
  const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY_FORM })
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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-lg bg-[#080e14] border border-cyan-500/25 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10 max-h-[92vh] flex flex-col"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/15">
          <h2 className="text-lg font-bold text-white">{isEdit ? '✎ Modifier la boutique' : '+ Nouvelle boutique'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl leading-none">✕</button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Upload zone — photos & vidéos galerie */}
          <div className="grid grid-cols-2 gap-3">
            <FileDropZone
              label="Photo depuis galerie"
              accept="image/*"
              file={imageFile}
              preview={imagePreview}
              onFile={handleImageFile}
              icon="📷"
            />
            <FileDropZone
              label="Vidéo depuis galerie"
              accept="video/*"
              file={videoFile}
              preview={videoPreview}
              onFile={handleVideoFile}
              icon="🎬"
            />
          </div>

          <Field label="Titre *">
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Nom de la boutique"
              className="input-style"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description courte..."
              rows={3}
              className="input-style resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Catégorie">
              <input
                type="text"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                placeholder="Mode, Tech..."
                className="input-style"
              />
            </Field>
            <Field label="Statut">
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="input-style"
              >
                <option value="active">● Actif</option>
                <option value="inactive">○ Inactif</option>
              </select>
            </Field>
          </div>

          <Field label="Caractéristiques">
            <input
              type="text"
              value={form.features}
              onChange={e => setForm({ ...form, features: e.target.value })}
              placeholder="Livraison, Retours, Click & Collect..."
              className="input-style"
            />
          </Field>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 border-t border-cyan-500/15 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-sm border border-gray-600/50 text-gray-400 rounded-xl hover:bg-gray-800/40 transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3 text-sm bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded-xl hover:bg-cyan-500/30 transition font-semibold disabled:opacity-50"
          >
            {saving ? '⏳ Envoi...' : isEdit ? '✓ Mettre à jour' : '✓ Créer'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

// ─── Page principale ────────────────────────────────────────────────────────

export default function BoutiquesPage() {
  const router = useRouter()
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | { mode: 'create' } | boutique object (edit)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { router.push('/admin/login'); return }
    fetchBoutiques()
  }, [router])

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
    if (!confirm('Supprimer cette boutique ?')) return
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

  return (
    <>
      {/* Global input styles injected once */}
      <style>{`
        .input-style {
          width: 100%;
          padding: 0.55rem 0.85rem;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(34,211,238,0.2);
          border-radius: 0.6rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-style:focus { border-color: rgba(34,211,238,0.6); }
        .input-style option { background: #0a1520; }
      `}</style>

      <div className="min-h-screen bg-[#050c12]">

        {/* ── Header ── */}
        <div className="sticky top-0 z-20 bg-[#050c12]/90 backdrop-blur border-b border-cyan-500/15">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={() => router.back()}
              className="self-start sm:self-auto px-3 py-1.5 text-sm bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition"
            >
              ← Retour
            </button>

            <h1 className="text-xl font-black text-white flex-1 sm:text-center">🏪 Boutiques</h1>

            <button
              onClick={() => setModal({ mode: 'create' })}
              className="self-start sm:self-auto px-4 py-1.5 text-sm bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition font-semibold"
            >
              + Nouvelle
            </button>
          </div>

          {/* Search */}
          <div className="max-w-6xl mx-auto px-4 pb-3">
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Rechercher par titre ou catégorie..."
              className="w-full px-4 py-2 bg-black/50 border border-cyan-500/20 rounded-xl text-white text-sm outline-none focus:border-cyan-400/50 placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">🏪</p>
              <p>{search ? 'Aucun résultat' : 'Aucune boutique — créez-en une !'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      </div>

      {/* ── Modal ── */}
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
