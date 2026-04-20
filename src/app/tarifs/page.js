'use client'
import { useState, useEffect } from 'react'

export default function TarifsPage() {
  const [tarifs, setTarifs] = useState([])

  useEffect(() => {
    fetch('/api/tarifs')
      .then(r => r.json())
      .then(d => setTarifs(d.data || []))
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <div className="py-12 text-center">
        <h1 className="text-5xl font-black text-green-400">NOS TARIFS</h1>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tarifs.map(t => (
            <div key={t.id} className={`rounded-xl p-8 ${t.highlighted ? 'bg-green-950/40 border-2 border-green-500 scale-105' : 'bg-green-950/20 border border-green-500/20'}`}>
              <h3 className="text-2xl font-bold text-green-400 mb-4">{t.name}</h3>
              <div className="text-5xl font-black text-white mb-6">{t.price}€</div>
              <p className="text-gray-300 mb-8">{t.features}</p>
              <button className="w-full px-6 py-3 bg-green-400/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-400/30">Choisir</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
