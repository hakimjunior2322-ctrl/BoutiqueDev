'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function DevisPage() {
  const router = useRouter()
  const [devis, setDevis] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('new')
  const [selectedDevis, setSelectedDevis] = useState(null)

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
      const url = filterStatus ? `/api/devis?status=${filterStatus}` : '/api/devis'
      const res = await fetch(url)
      const data = await res.json()
      setDevis(data.data || [])
    } catch (error) {
      console.error('Error fetching devis:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const devisItem = devis.find(d => d.id === id)
      const res = await fetch('/api/devis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...devisItem, id, status: newStatus }),
      })

      if (res.ok) {
        fetchDevis()
        setSelectedDevis(null)
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
        setSelectedDevis(null)
      }
    } catch (error) {
      console.error('Error deleting devis:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
      case 'contacted':
        return 'bg-blue-500/20 border-blue-500 text-blue-400'
      case 'quoted':
        return 'bg-purple-500/20 border-purple-500 text-purple-400'
      case 'closed':
        return 'bg-green-500/20 border-green-500 text-green-400'
      default:
        return 'bg-gray-500/20 border-gray-500 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-green-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-black text-white mb-4">Demandes de Devis</h1>
          <div className="flex gap-2 overflow-x-auto">
            {['new', 'contacted', 'quoted', 'closed'].map(status => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-green-500/30 border border-green-500 text-green-400'
                    : 'bg-gray-500/10 border border-gray-500/30 text-gray-400 hover:border-green-500/50'
                }`}
              >
                {status === 'new' ? 'Nouveau' : status === 'contacted' ? 'Contacté' : status === 'quoted' ? 'Devisé' : 'Fermé'}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {devis.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedDevis(item)}
                  className={`bg-gradient-to-br from-green-950/20 to-emerald-950/20 border rounded-xl p-6 cursor-pointer hover:border-green-500/50 transition ${
                    selectedDevis?.id === item.id
                      ? 'border-green-500/50 bg-green-950/30'
                      : 'border-green-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <p className="text-gray-400 text-sm">{item.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.company && (
                    <p className="text-gray-400 text-sm mb-2">Entreprise: {item.company}</p>
                  )}
                  <p className="text-gray-400 text-xs">
                    {new Date(item.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </motion.div>
              ))}

              {devis.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">Aucun devis</p>
                </div>
              )}
            </div>

            {/* Detail */}
            {selectedDevis && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-green-950/20 to-emerald-950/20 border border-green-500/30 rounded-xl p-6 sticky top-24"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Détails</h2>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Nom</p>
                    <p className="text-white">{selectedDevis.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Email</p>
                    <p className="text-white break-all">{selectedDevis.email}</p>
                  </div>
                  {selectedDevis.phone && (
                    <div>
                      <p className="text-gray-500 mb-1">Téléphone</p>
                      <p className="text-white">{selectedDevis.phone}</p>
                    </div>
                  )}
                  {selectedDevis.company && (
                    <div>
                      <p className="text-gray-500 mb-1">Entreprise</p>
                      <p className="text-white">{selectedDevis.company}</p>
                    </div>
                  )}
                  {selectedDevis.budget && (
                    <div>
                      <p className="text-gray-500 mb-1">Budget</p>
                      <p className="text-white">{selectedDevis.budget}€</p>
                    </div>
                  )}
                  {selectedDevis.message && (
                    <div>
                      <p className="text-gray-500 mb-1">Message</p>
                      <p className="text-white">{selectedDevis.message}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleUpdateStatus(selectedDevis.id, 'contacted')}
                    className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm font-semibold"
                  >
                    Marquer Contacté
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleUpdateStatus(selectedDevis.id, 'quoted')}
                    className="w-full px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm font-semibold"
                  >
                    Marquer Devisé
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleUpdateStatus(selectedDevis.id, 'closed')}
                    className="w-full px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition text-sm font-semibold"
                  >
                    Marquer Fermé
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleDelete(selectedDevis.id)}
                    className="w-full px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm font-semibold"
                  >
                    Supprimer
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
