'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function TarifsPage() {
  const router = useRouter()
  const [tarifs, setTarifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'EUR',
    period: 'once',
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
      <div className="bg-black border-b border-green-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-black text-white">Gestion des Tarifs</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-green-400/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-400/30"
            >
              + Nouveau Tarif
            </motion.button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 bg-black/60 p-6 rounded-lg border border-green-400/20 mb-6">
              <input
                type="text"
                placeholder="Nom du plan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-white outline-none focus:border-green-400"
                required
              />
              <input
                type="number"
                placeholder="Prix"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-white outline-none focus:border-green-400"
                required
              />
              <input
                type="text"
                placeholder="Fonctionnalités (séparées par des virgules)"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-4 py-2 bg-black/60 border border-green-400/30 rounded-lg text-white outline-none focus:border-green-400"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tarifs.map((tarif, i) => (
              <motion.div
                key={tarif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gradient-to-br from-green-950/20 to-black border border-green-500/20 rounded-xl p-6 hover:border-green-500/50 transition"
              >
                <h3 className="text-xl font-bold text-green-400 mb-2">{tarif.name}</h3>
                <div className="text-3xl font-black text-white mb-4">{tarif.price}€</div>
                <p className="text-gray-300 text-sm mb-6">{tarif.features}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleDelete(tarif.id)}
                  className="w-full px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30"
                >
                  Supprimer
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
