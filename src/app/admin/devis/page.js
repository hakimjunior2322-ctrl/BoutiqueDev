'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function DevisPage() {
  const router = useRouter()
  const [devis, setDevis] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('new')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchDevis()
  }, [router, filterStatus])

  const fetchDevis = async () => {
    try {
      const res = await fetch(`/api/devis?status=${filterStatus}`)
      const data = await res.json()
      setDevis(data.data || [])
    } catch (error) {
      console.error('Error fetching devis:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const devisItem = devis.find(d => d.id === id)
      const res = await fetch('/api/devis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...devisItem, id, status: newStatus }),
      })

      if (res.ok) {
        fetchDevis()
      }
    } catch (error) {
      console.error('Error updating devis:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr?')) return

    try {
      const res = await fetch('/api/devis', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        fetchDevis()
      }
    } catch (error) {
      console.error('Error deleting devis:', error)
    }
  }

  const statuses = ['new', 'contacted', 'quoted', 'closed']

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
      <div className="bg-black border-b border-yellow-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-black text-white mb-4">Gestion des Devis</h1>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statuses.map(status => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-yellow-500/30 border border-yellow-500 text-yellow-400'
                    : 'bg-gray-500/10 border border-gray-500/30 text-gray-400 hover:border-yellow-500/50'
                }`}
              >
                {status === 'new' && 'Nouveaux'}
                {status === 'contacted' && 'Contactés'}
                {status === 'quoted' && 'Devis envoyés'}
                {status === 'closed' && 'Fermés'}
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
            {devis.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gradient-to-br from-yellow-950/20 to-orange-950/20 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">{item.name}</h3>
                    <div className="space-y-2 text-gray-300">
                      <p><span className="text-yellow-400">Email:</span> {item.email}</p>
                      <p><span className="text-yellow-400">Téléphone:</span> {item.phone}</p>
                      <p><span className="text-yellow-400">Entreprise:</span> {item.company}</p>
                      <p><span className="text-yellow-400">Budget:</span> {item.budget}€</p>
                      <p><span className="text-yellow-400">Type:</span> {item.project_type}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-300 mb-4"><span className="text-yellow-400">Message:</span></p>
                    <p className="text-gray-300 italic bg-black/40 p-4 rounded-lg">{item.message}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {statuses.map(status => (
                    status !== filterStatus && (
                      <motion.button
                        key={status}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => updateStatus(item.id, status)}
                        className="px-3 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 text-sm transition"
                      >
                        → {status === 'new' && 'Nouveau'}
                        {status === 'contacted' && 'Contacté'}
                        {status === 'quoted' && 'Devis'}
                        {status === 'closed' && 'Fermé'}
                      </motion.button>
                    )
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 text-sm transition"
                  >
                    Supprimer
                  </motion.button>
                </div>
              </motion.div>
            ))}

            {devis.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">Aucun devis</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
