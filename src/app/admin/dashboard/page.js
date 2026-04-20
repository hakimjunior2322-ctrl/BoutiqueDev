'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({ boutiques: 0, avis: 0, devis: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    const fetchStats = async () => {
      try {
        const [boutiquesRes, avisRes, devisRes] = await Promise.all([
          fetch('/api/boutiques'),
          fetch('/api/avis?status=all'),
          fetch('/api/devis'),
        ])

        const boutiquesData = await boutiquesRes.json()
        const avisData = await avisRes.json()
        const devisData = await devisRes.json()

        setStats({
          boutiques: boutiquesData.data?.length || 0,
          avis: avisData.data?.length || 0,
          devis: devisData.data?.length || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/admin/login')
  }

  const modules = [
    {
      title: 'Boutiques',
      description: 'Gérer vos boutiques/projets',
      icon: '🏪',
      link: '/admin/boutiques',
      stat: stats.boutiques,
    },
    {
      title: 'Avis',
      description: 'Approuver et gérer les avis',
      icon: '⭐',
      link: '/admin/avis',
      stat: stats.avis,
    },
    {
      title: 'Tarifs',
      description: 'Gérer les plans tarifaires',
      icon: '💰',
      link: '/admin/tarifs',
      stat: 3,
    },
    {
      title: 'Devis',
      description: 'Consulter les demandes de devis',
      icon: '📋',
      link: '/admin/devis',
      stat: stats.devis,
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-pink-500/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            JuDev Admin
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition"
          >
            Déconnexion
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Bienvenue dans le panel admin</h2>
          <p className="text-gray-400">Gérez votre portfolio, avis, tarifs et devis</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, i) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={module.link}>
                  <div className="h-full bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/50 transition cursor-pointer group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition">{module.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                    <div className="text-3xl font-black text-pink-400">{module.stat}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
