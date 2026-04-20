'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function BoutiquesPage() {
  const router = useRouter()
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
    video_url: '',
    features: '',
    status: 'active',
  })

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchBoutiques()
  }, [router])

  const fetchBoutiques = async () => {
    try {
      const res = await fetch('/api/boutiques')
      const data = await res.json()
      setBoutiques(data.data || [])
    } catch (error) {
      console.error('Error fetching boutiques:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/boutiques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          title: '',
          description: '',
          category: '',
          image_url: '',
          video_url: '',
          features: '',
          status: 'active',
        })
        setShowForm(false)
        fetchBoutiques()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr?')) return

    try {
      const res = await fetch('/api/boutiques', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        fetchBoutiques()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* ← BOUTON RETOUR */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 px-4 py-2 bg-cyan-400/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/30 transition"
      >
        ← Retour
      </button>

      {/* Header */}
      <div className="bg-black border-b border-cyan-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black text-white">Gestion des Boutiques</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-cyan-400/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/30"
            >
              + Nouvelle Boutique
            </motion.button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 bg-black/60 p-6 rounded-lg border border-cyan-400/20 mb-6">
              <input
                type="text"
                placeholder="Titre"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-black/60 border border-cyan-400/30 rounded-lg text-white outline-none focus:border-cyan-400"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-black/60 border border-cyan-400/30 rounded-lg text-white outline-none focus:border-cyan-400"
                rows="3"
              />
              <input
                type="text"
                placeholder="Catégorie"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-black/60 border border-cyan-400/30 rounded-lg text-white outline-none focus:border-cyan-400"
              />
              <input
                type="url"
                placeholder="URL Image"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 bg-black/60 border border-cyan-400/30 rounded-lg text-white outline-none focus:border-cyan-400"
              />
              <input
                type="url"
                placeholder="URL Vidéo"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full px-4 py-2 bg-black/60 border border-cyan-400/30 rounded-lg text-white outline-none focus:border-cyan-400"
              />
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30"
                >
                  ✓ Créer
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30"
                >
                  Annuler
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-gray-400">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boutiques.map((boutique, i) => (
              <motion.div
                key={boutique.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gradient-to-br from-cyan-950/20 to-black border border-cyan-500/20 rounded-xl overflow-hidden hover:border-cyan-500/50 transition"
              >
                {boutique.image_url && (
                  <div className="h-40 bg-black/60 overflow-hidden">
                    <img src={boutique.image_url} alt={boutique.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">{boutique.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{boutique.description}</p>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleDelete(boutique.id)}
                      className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30"
                    >
                      Supprimer
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
