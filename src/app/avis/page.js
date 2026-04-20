'use client'
import { useState, useEffect } from 'react'

export default function AvisPage() {
  const [avis, setAvis] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [code, setCode] = useState('')
  const [verified, setVerified] = useState(false)
  const [form, setForm] = useState({
    name: '',
    business: '',
    email: '',
    rating: 5,
    text: '',
  })

  useEffect(() => {
    fetch('/api/avis?status=approved')
      .then(r => r.json())
      .then(d => setAvis(d.data || []))
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    await fetch('/api/avis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        rating: parseInt(form.rating),
        status: 'pending',
      }),
    })
    setForm({ name: '', business: '', email: '', rating: 5, text: '' })
    setVerified(false)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="py-12 text-center">
        <h1 className="text-5xl font-black text-pink-400">TÉMOIGNAGES</h1>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {avis.map(a => (
            <div key={a.id} className="bg-pink-950/20 border border-pink-500/20 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white">{a.name}</h3>
              <p className="text-gray-400 text-sm">{a.business}</p>
              <p className="text-gray-300 italic mt-4">"{a.text}"</p>
              <div className="text-2xl mt-4">{'⭐'.repeat(a.rating)}</div>
            </div>
          ))}
        </div>

        {!showForm ? (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-pink-400/20 border border-pink-400 text-pink-400 rounded-lg hover:bg-pink-400/30"
            >
              ✍️ Laisser un avis
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-pink-950/20 border border-pink-500/30 rounded-xl p-8">
            {!verified ? (
              <div className="space-y-4">
                <p className="text-gray-300">Code d'accès (ex: JUDEV2024)</p>
                <input
                  type="text"
                  placeholder="Code"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 bg-black/60 border border-pink-400/30 rounded-lg text-white"
                />
                <button
                  onClick={() => {
                    if (code.startsWith('JUDEV') || code.startsWith('CLIENT')) {
                      setVerified(true)
                    } else {
                      alert('Code invalide')
                    }
                  }}
                  className="w-full px-4 py-2 bg-pink-400/20 border border-pink-400 text-pink-400 rounded-lg"
                >
                  Vérifier
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/60 border border-pink-400/30 rounded-lg text-white"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/60 border border-pink-400/30 rounded-lg text-white"
                  required
                />
                <textarea
                  placeholder="Votre avis"
                  value={form.text}
                  onChange={e => setForm({ ...form, text: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 bg-black/60 border border-pink-400/30 rounded-lg text-white"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-pink-400/20 border border-pink-400 text-pink-400 rounded-lg hover:bg-pink-400/30"
                >
                  Envoyer
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
