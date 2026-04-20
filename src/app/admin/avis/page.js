'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AvisPage() {
  const router = useRouter()
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
      <div className="bg-black border-b border-pink-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-black text-white mb-4">Gestion des Avis</h1>
          <div className="flex gap-2">
            {['approved', 'pending'].map(status => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition ${
                  filterStatus === status
                    ? 'bg-pink-500/30 border border-pink-500 text-pink-400'
                    : 'bg-gray-500/10 border border-gray-500/30 text-gray-400 hover:border-pink-500/50'
                }`}
              >
                {status === 'approved' ? 'Approuvés' : 'En attente'}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Chargement...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {avis.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/50 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{item.business}</p>
                  </div>
                  <div className="text-2xl">
                    {'⭐'.repeat(item.rating)}
                  </div>
                </div>

                <p className="text-gray-300 mb-6 italic">"{item.text}"</p>

                <div className="flex gap-2">
                  {filterStatus === 'pending' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleApprove(item.id)}
                      className="flex-1 px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                    >
                      ✓ Approuver
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                  >
                    Supprimer
                  </motion.button>
                </div>
              </motion.div>
            ))}

            {avis.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">Aucun avis {filterStatus === 'pending' ? 'en attente' : 'approuvé'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
