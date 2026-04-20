'use client'
import { useState } from 'react'

export default function DevisPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    project_type: 'website',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    await fetch('/api/devis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        budget: parseInt(form.budget) || 0,
        status: 'new',
      }),
    })
    setSuccess('✓ Devis envoyé ! Nous vous recontacterons très bientôt.')
    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      budget: '',
      project_type: 'website',
      message: '',
    })
    setSubmitting(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="py-12 text-center">
        <h1 className="text-5xl font-black text-yellow-400">DEMANDE DE DEVIS</h1>
        <p className="text-gray-400 mt-2">Décrivez votre projet et recevez un devis gratuit</p>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-8 text-center">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 bg-yellow-950/20 border border-yellow-500/30 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Nom *"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-black/60 border border-yellow-400/30 rounded-lg text-white"
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-black/60 border border-yellow-400/30 rounded-lg text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="tel"
              placeholder="Téléphone *"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-black/60 border border-yellow-400/30 rounded-lg text-white"
              required
            />
            <input
              type="text"
              placeholder="Entreprise"
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
              className="w-full px-4 py-3 bg-black/60 border border-yellow-400/30 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              value={form.project_type}
              onChange={e => setForm({ ...form, project_type: e.target.value })}
              className="w-full px-4 py-3 bg-black/60 border border-yellow-400/30 rounded-lg text-white"
            >
              <option value="website">Site Web</option>
              <option value="app">Application Mobile</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="design">Design Graphique</option>
              <option value="autre">Autre</option>
            </select>
            <input
              type="number"
              placeholder="Budget estimé (€)"
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              className="w-full px-4 py-3 bg-black/60 border border-yellow-400/30 rounded-lg text-white"
            />
          </div>

          <textarea
            placeholder="Décrivez votre projet *"
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            rows="6"
            className="w-full px-4 py-3 bg-black/60 border border-yellow-400/30 rounded-lg text-white"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-4 bg-yellow-400/20 border border-yellow-400 text-yellow-400 rounded-lg font-bold hover:bg-yellow-400/30 disabled:opacity-50"
          >
            {submitting ? 'Envoi en cours...' : '📤 Envoyer la demande de devis'}
          </button>
        </form>
      </div>
    </div>
  )
}
