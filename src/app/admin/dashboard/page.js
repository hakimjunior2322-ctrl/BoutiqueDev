'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    boutiques: 0,
    avis: 0,
    devis: 0,
    messages: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const [boutiques, avis, devis] = await Promise.all([
        fetch('/api/boutiques').then(r => r.json()),
        fetch('/api/avis').then(r => r.json()),
        fetch('/api/devis').then(r => r.json()),
      ])

      setStats({
        boutiques: boutiques.data?.length || 0,
        avis: avis.data?.length || 0,
        devis: devis.data?.length || 0,
        messages: 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/admin/login')
  }

  const menuItems = [
    { label: 'Boutiques', href: '/admin/boutiques', icon: '🛍️', count: stats.boutiques },
    { label: 'Avis', href: '/admin/avis', icon: '⭐', count: stats.avis },
    { label: 'Tarifs', href: '/admin/tarifs', icon: '💰', count: stats.tarifs },
    { label: 'Devis', href: '/admin/devis', icon: '📋', count: stats.devis },
  ]

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
      <div className="bg-gradient-to-r from-black via-violet-950/20 to-black border-b border-violet-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-black text-cyan-400">ADMIN DASHBOARD</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30"
          >
            Déconnexion
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {menuItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => router.push(item.href)}
                className="cursor-pointer bg-gradient-to-br from-violet-950/20 to-black border border-violet-500/20 rounded-xl p-6 hover:border-violet-500/50 transition"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{item.label}</h3>
                <p className="text-2xl font-black text-cyan-400">{item.count}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Menu rapide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(item.href)}
              className="px-6 py-4 bg-black border border-violet-500/30 rounded-lg text-left hover:border-violet-500 transition group"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="font-bold text-white group-hover:text-cyan-400">{item.label}</p>
                  <p className="text-sm text-gray-400">{item.count} éléments</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
