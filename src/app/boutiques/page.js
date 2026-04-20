'use client'
import { useState, useEffect } from 'react'

export default function BoutiquesPage() {
  const [boutiques, setBoutiques] = useState([])

  useEffect(() => {
    fetch('/api/boutiques')
      .then(r => r.json())
      .then(d => setBoutiques(d.data || []))
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <div className="py-12 text-center">
        <h1 className="text-5xl font-black text-cyan-400">NOS BOUTIQUES</h1>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {boutiques.map(b => (
            <div key={b.id} className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-6">
              {b.image_url && <img src={b.image_url} alt={b.title} className="w-full h-40 object-cover rounded mb-4" />}
              <h3 className="text-xl font-bold text-cyan-400">{b.title}</h3>
              <p className="text-gray-300">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
