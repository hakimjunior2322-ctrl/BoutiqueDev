'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
  
  * { cursor: auto; }
  
  body { 
    font-family: 'Inter', sans-serif !important; 
    background: #ffffff !important; 
    color: #1a1a1a !important;
    margin: 0;
    padding: 0;
  }
  
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: #f5f5f5; }
  ::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 5px; }
  
  .gradient-blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
  .gradient-purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
  .gradient-text { background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  
  .card-hover {
    transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
    border: 1px solid #e5e7eb;
  }
  .card-hover:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    border: none;
    padding: 14px 36px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    font-family: 'Inter', sans-serif;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }
  
  .btn-secondary {
    background: white;
    color: #1f2937;
    border: 2px solid #e5e7eb;
    padding: 12px 32px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
    font-family: 'Inter', sans-serif;
  }
  .btn-secondary:hover {
    background: #f9fafb;
    border-color: #3b82f6;
    color: #3b82f6;
  }
  
  .input-field {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    transition: all 0.3s;
    background: #fafafa;
  }
  .input-field:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .textarea-field {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    transition: all 0.3s;
    background: #fafafa;
    resize: none;
  }
  .textarea-field:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
  
  .live-clock {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 10;
    color: #9ca3af;
    font-size: 14px;
    text-align: right;
  }
  
  @media (max-width: 768px) {
    .live-clock { display: none; }
  }
`

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className="live-clock">
      <div style={{ fontWeight: 600, color: '#3b82f6' }}>
        {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div>{time.toLocaleDateString('fr-FR')}</div>
    </div>
  )
}

export default function JuDev() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [boutiques, setBoutiques] = useState([])
  const [tarifs, setTarifs] = useState([])
  const [contactFormData, setContactFormData] = useState({ name: '', email: '', message: '' })
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSuccess, setContactSuccess] = useState('')

  useEffect(() => {
    // Charger depuis le JSON
    fetch('/api/boutiques')
      .then(r => r.json())
      .then(d => setBoutiques((d.data || []).map(b => ({
        id: b.id,
        title: b.title,
        url: b.image_url || 'https://via.placeholder.com/600x400?text=' + b.title,
        thumbnail: b.image_url || 'https://via.placeholder.com/300x200?text=' + b.title
      }))))
      .catch(() => setBoutiques([]))
  }, [])

  useEffect(() => {
    fetch('/api/tarifs')
      .then(r => r.json())
      .then(d => setTarifs((d.data || []).map((t, i) => ({
        id: t.id,
        name: t.name,
        price: t.price ? t.price : 'Personnalisé',
        description: t.description || '',
        features: (t.features || '').split(',').filter(f => f.trim()),
        highlight: i === 1
      }))))
      .catch(() => setTarifs([]))
  }, [])

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactSubmitting(true)
    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactFormData.name,
          email: contactFormData.email,
          message: contactFormData.message
        })
      })
      if (res.ok) {
        setContactSuccess('✓ Message reçu ! Nous vous répondrons sous 24h.')
        setContactFormData({ name: '', email: '', message: '' })
        setTimeout(() => setContactSuccess(''), 5000)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setContactSubmitting(false)
    }
  }

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'clients', label: 'Nos Clients' },
    { id: 'tarifs', label: 'Tarifs' },
    { id: 'contact', label: 'Contact' }
  ]

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0 }
  }

  return (
    <>
      <style>{STYLES}</style>
      <LiveClock />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e5e7eb' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <button onClick={() => setCurrentPage('home')} className="font-bold text-2xl" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            JuDev
          </button>
          <div className="flex items-center gap-2 md:gap-4">
            {navItems.map((item) => (
              <motion.button 
                key={item.id} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setCurrentPage(item.id)} 
                className="px-4 py-2 rounded-lg font-medium transition-all text-sm md:text-base"
                style={{
                  background: currentPage === item.id ? '#e0e7ff' : 'transparent',
                  color: currentPage === item.id ? '#3b82f6' : '#6b7280'
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* HOME */}
      {currentPage === 'home' && (
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen pt-24 md:pt-32 flex items-center justify-center relative" style={{ zIndex: 10 }}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 w-full text-center py-20 md:py-32">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="badge mb-6 justify-center flex">
                ✨ Bienvenue chez JuDev
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2, duration: 0.8 }} 
              className="text-5xl md:text-7xl font-black leading-tight mb-6 md:mb-8"
              style={{ fontFamily: 'Poppins' }}
            >
              Créez votre <br />
              <span className="gradient-text">présence en ligne</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3, duration: 0.8 }} 
              className="text-lg md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed px-2"
              style={{ color: '#6b7280' }}
            >
              Des sites web <strong>modernes, rapides et performants</strong> pour développer votre business et convertir vos visiteurs en clients.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4, duration: 0.8 }} 
              className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center px-2"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setCurrentPage('clients')} 
                className="btn-primary w-full md:w-auto"
              >
                Voir nos réalisations
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={() => setCurrentPage('contact')} 
                className="btn-secondary w-full md:w-auto"
              >
                Obtenir un devis
              </motion.button>
            </motion.div>

            {/* FEATURES */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.6 }} 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-20 md:mt-32"
            >
              {[
                { icon: '⚡', title: 'Ultra rapide', desc: 'Optimisé pour les performances' },
                { icon: '📱', title: 'Responsive', desc: 'Parfait sur tous les appareils' },
                { icon: '🎨', title: 'Design moderne', desc: 'Esthétique et fonctionnel' }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="p-6 rounded-xl"
                  style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px' }}>{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* CLIENTS */}
      {currentPage === 'clients' && (
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen pt-24 md:pt-32 pb-20 relative" style={{ zIndex: 10 }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="badge mb-6">
                💼 Nos Réalisations
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-4" style={{ fontFamily: 'Poppins' }}>
                Nos Clients
              </h2>
              <p className="text-lg md:text-xl mb-16" style={{ color: '#6b7280', maxWidth: '600px' }}>
                Découvrez les sites web que nous avons créés pour nos clients. Des projets variés, tous avec un seul objectif : la réussite.
              </p>
            </motion.div>

            {selectedMedia && (
              <div 
                onClick={() => setSelectedMedia(null)} 
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)' }}
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  className="relative max-w-4xl w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setSelectedMedia(null)} 
                    className="absolute -top-10 right-0 text-white text-3xl"
                  >
                    ✕
                  </button>
                  <img src={selectedMedia.url} alt={selectedMedia.title} className="w-full h-auto rounded-lg" />
                  <p className="text-center text-white mt-6 text-lg">{selectedMedia.title}</p>
                </motion.div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {boutiques.length === 0 ? (
                <p style={{ color: '#9ca3af' }}>Chargement des réalisations...</p>
              ) : boutiques.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedMedia(item)}
                  className="card-hover rounded-xl overflow-hidden cursor-pointer group"
                  style={{ background: 'white' }}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6"
                      style={{ background: 'linear-gradient(to top, rgba(59, 130, 246, 0.9), transparent)' }}
                    >
                      <p className="text-white font-bold text-lg">{item.title}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Site web professionnel</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TARIFS */}
      {currentPage === 'tarifs' && (
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen pt-24 md:pt-32 pb-20 relative" style={{ zIndex: 10 }}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="badge mb-6">
                💰 Tarifs transparents
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-4" style={{ fontFamily: 'Poppins' }}>
                Nos Offres
              </h2>
              <p className="text-lg md:text-xl mb-16" style={{ color: '#6b7280', maxWidth: '600px' }}>
                Choisissez le plan qui correspond à vos besoins. Pas de frais cachés, tout est transparent.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {tarifs.length === 0 ? (
                <p style={{ color: '#9ca3af' }}>Chargement des tarifs...</p>
              ) : tarifs.map((plan, i) => (
                <motion.div 
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card-hover rounded-xl p-8"
                  style={{
                    background: plan.highlight ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'white',
                    color: plan.highlight ? 'white' : '#1a1a1a',
                    transform: plan.highlight ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {plan.highlight && (
                    <div className="badge mb-4" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                      ⭐ POPULAIRE
                    </div>
                  )}
                  
                  <h3 className="font-black text-3xl mb-2" style={{ fontFamily: 'Poppins' }}>
                    {plan.name}
                  </h3>
                  <p style={{ opacity: 0.8, marginBottom: '24px' }}>
                    {plan.description}
                  </p>
                  
                  <div className="mb-8">
                    <span className="text-5xl font-black" style={{ fontFamily: 'Poppins' }}>
                      {plan.price}
                    </span>
                    {plan.price !== 'Personnalisé' && (
                      <span style={{ opacity: 0.7 }}>€</span>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <span style={{ fontSize: '20px' }}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => setCurrentPage('contact')}
                    style={{
                      width: '100%',
                      background: plan.highlight ? 'white' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: plan.highlight ? '#3b82f6' : 'white',
                      border: 'none',
                      padding: '14px 36px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    Choisir ce plan
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* CONTACT */}
      {currentPage === 'contact' && (
        <motion.div variants={pageVariants} initial="initial" animate="animate" className="min-h-screen pt-24 md:pt-32 pb-20 flex items-center justify-center relative" style={{ zIndex: 10 }}>
          <div className="max-w-2xl mx-auto px-4 md:px-6 w-full">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="badge mb-6 justify-center flex">
                📧 Demander un devis
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-4 text-center" style={{ fontFamily: 'Poppins' }}>
                Parlons de votre <br /> projet
              </h2>
              <p className="text-lg md:text-xl mb-12 text-center" style={{ color: '#6b7280' }}>
                Remplissez le formulaire ci-dessous et nous vous répondrons sous 24h.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
              className="p-8 rounded-2xl"
              style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}
            >
              {contactSuccess && (
                <div className="mb-6 p-4 rounded-lg text-center text-sm font-semibold" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#059669' }}>
                  {contactSuccess}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nom *</label>
                  <input 
                    type="text" 
                    placeholder="Jean Dupont" 
                    value={contactFormData.name} 
                    onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                    className="input-field"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email *</label>
                  <input 
                    type="email" 
                    placeholder="votre@email.com" 
                    value={contactFormData.email} 
                    onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                    className="input-field"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message *</label>
                  <textarea 
                    placeholder="Décrivez votre projet..." 
                    rows={6} 
                    value={contactFormData.message} 
                    onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                    className="textarea-field"
                    required 
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  type="submit" 
                  disabled={contactSubmitting}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {contactSubmitting ? 'Envoi en cours...' : 'Envoyer mon message'}
                </motion.button>
              </form>
            </motion.div>

            {/* CONTACT INFO */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
            >
              <div className="p-6 rounded-lg" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <h3 className="font-bold text-lg mb-2">📧 Email</h3>
                <p style={{ color: '#6b7280' }}>hello@judev.com</p>
              </div>
              <div className="p-6 rounded-lg" style={{ background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <h3 className="font-bold text-lg mb-2">📱 Téléphone</h3>
                <p style={{ color: '#6b7280' }}>+33 6 12 34 56 78</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* FOOTER */}
      <footer style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af' }}>
          © 2026 <strong>JuDev</strong> — Créé avec passion ✨
        </p>
      </footer>
    </>
  )
}
