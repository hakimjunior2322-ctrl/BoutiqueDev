'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password }),
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('auth_token', data.token)
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Erreur de connexion')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      {/* ← BOUTON RETOUR */}
      <button
        onClick={() => router.back()}
        className="fixed top-6 left-6 z-50 px-4 py-2 bg-cyan-400/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/30 transition"
      >
        ← Retour
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-violet-950/30 to-black border border-violet-500/30 rounded-xl p-8">
          <h1 className="text-4xl font-black text-center text-cyan-400 mb-2">NEON</h1>
          <p className="text-center text-gray-400 mb-8">Admin Panel</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-cyan-400/30 rounded-lg text-white focus:border-cyan-400 outline-none transition"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-cyan-400/30 rounded-lg text-white focus:border-cyan-400 outline-none transition"
                placeholder="••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-violet-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-400/50 transition disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
