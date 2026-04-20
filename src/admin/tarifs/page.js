'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function TarifsPage() {
  const router = useRouter()
  const [tarifs, setTarifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'EUR',
    period: 'month',
    description: '',
    features: '',
    highlighted: false,
    cta_text: '',
    status: 'active',
  })

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchTarifs()
  }, [router])

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
      const method = editingId ? 'PUT' : 'POST'
      const payload = {
        ...formData,
        price: formData.price ? parseInt(formData.price) : null,
        id: editingId,
      }

      const res = await fetch('/api/tarifs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        fetchTarifs()
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
      const res = await fetch('/api/tarifs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        fetchTarifs()
      }
    } catch (error) {
      console.error('Error deleting tarif:', error)
    }
  }

  const handleEdit = (tarif) => {
    setFormData(tarif)
    setEditingId(tarif.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      currency: 'EUR',
      period: 'month',
      description: '',
      features: '',
      highlighted: false,
      cta_text: '',
      status: 'active',
    })
    setEditingId(null)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-blue-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-white">Gestion Tarifs</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="px-6 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
          >
            {showForm ? 'Annuler' : '+ Nouveau Tarif'}
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
            className="bg-gradient-to-br from-blue-950/20 to-cyan-950/20 border border-blue-500/30 rounded-xl p-8 mb-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Prix</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Monnaie</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Fonctionnalités (JSON)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows="3"
                  placeholder='["Feature 1", "Feature 2"]'
                  className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Bouton CTA</label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">Mise en avant?</label>
                  <input
                    type="checkbox"
                    checked={formData.highlighted}
                    onChange={(e) => setFormData({ ...formData, highlighted: e.target.checked })}
                    className="w-6 h-6"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tarifs.map((tarif, i) => (
              <motion.div
                key={tarif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`border rounded-xl p-6 transition ${
                  tarif.highlighted
                    ? 'bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/50'
                    : 'bg-gradient-to-br from-blue-950/10 to-cyan-950/10 border-blue-500/20'
                }`}
              >
                {tarif.highlighted && (
                  <span className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full mb-4">
                    RECOMMANDÉ
                  </span>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{tarif.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tarif.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-blue-400">{tarif.price || 'Devis'}</span>
                  {tarif.price && <span className="text-gray-400">€</span>}
                </div>
                <p className="text-gray-400 text-xs mb-6">{tarif.cta_text}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleEdit(tarif)}
                    className="flex-1 px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm"
                  >
                    Éditer
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleDelete(tarif.id)}
                    className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm"
                  >
                    Supprimer
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
