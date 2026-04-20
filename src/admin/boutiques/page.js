'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function BoutiquesPage() {
  const router = useRouter()
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
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
      const method = editingId ? 'PUT' : 'POST'
      const url = '/api/boutiques'
      const payload = editingId ? { ...formData, id: editingId } : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        fetchBoutiques()
        resetForm()
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
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
      console.error('Error deleting boutique:', error)
    }
  }

  const handleEdit = (boutique) => {
    setFormData(boutique)
    setEditingId(boutique.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      image_url: '',
      video_url: '',
      features: '',
      status: 'active',
    })
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-pink-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-white">Gestion Boutiques</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="px-6 py-2 bg-pink-500/20 border border-pink-500/50 text-pink-400 rounded-lg hover:bg-pink-500/30 transition"
          >
            {showForm ? 'Annuler' : '+ Nouvelle Boutique'}
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/30 rounded-xl p-8 mb-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Catégorie</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">URL Image</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">URL Vidéo</label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition"
              >
                {editingId ? 'Mettre à jour' : 'Créer'}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boutiques.map((boutique, i) => (
              <motion.div
                key={boutique.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 rounded-xl overflow-hidden hover:border-pink-500/50 transition"
              >
                {boutique.image_url && (
                  <img
                    src={boutique.image_url}
                    alt={boutique.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2">{boutique.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{boutique.description}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                    boutique.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {boutique.status}
                  </span>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleEdit(boutique)}
                      className="flex-1 px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm"
                    >
                      Éditer
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleDelete(boutique.id)}
                      className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm"
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
