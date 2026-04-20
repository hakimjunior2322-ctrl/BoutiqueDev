'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function NeonPortfolio() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showSplash, setShowSplash] = useState(true)
  const [isTerminalMode, setIsTerminalMode] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'Bonjour! 👋 Comment puis-je t\'aider ?' }
  ])
  const [chatInput, setChatInput] = useState('')

  // CONTACT FORM
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSuccess, setContactSuccess] = useState('')

  // FORMULAIRE AVIS
  const [avisForm, setAvisForm] = useState({
    name: '',
    business: '',
    email: '',
    text: '',
    rating: 5
  })
  const [avisSubmitting, setAvisSubmitting] = useState(false)
  const [avisSuccess, setAvisSuccess] = useState('')

  // DONNÉES DEPUIS BDD
  const [boutiques, setBoutiques] = useState([])
  const [avis, setAvis] = useState([])
  const [tarifs, setTarifs] = useState([])

  // FIX CLAVIER MOBILE
  useEffect(() => {
    const handleFocus = () => {
      document.documentElement.style.overflow = 'hidden'
    }
    const handleBlur = () => {
      document.documentElement.style.overflow = 'auto'
    }
    
    const inputs = document.querySelectorAll('input, textarea')
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus)
      input.addEventListener('blur', handleBlur)
    })
    
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus)
        input.removeEventListener('blur', handleBlur)
      })
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // LOAD BOUTIQUES
  useEffect(() => {
    fetch('/api/boutiques')
      .then(r => r.json())
      .then(d => {
        setBoutiques((d.data || []).map(b => ({
          id: b.id,
          title: b.title,
          type: 'image',
          url: b.image_url || 'https://via.placeholder.com/600x400?text=' + b.title,
          thumbnail: b.image_url || 'https://via.placeholder.com/200x150?text=' + b.title,
        })))
      })
      .catch(e => console.error('Erreur boutiques:', e))
  }, [])

  // LOAD AVIS
  useEffect(() => {
    fetch('/api/avis?status=approved')
      .then(r => r.json())
      .then(d => {
        setAvis((d.data || []).map(a => ({
          id: a.id,
          name: a.name,
          role: a.business || 'Client',
          text: a.text,
          rating: a.rating || 5,
          avatar: ['👩‍💼', '👨‍💼', '👩‍🔬', '👨‍🎨'][Math.floor(Math.random() * 4)],
        })))
      })
      .catch(e => console.error('Erreur avis:', e))
  }, [])

  // LOAD TARIFS
  useEffect(() => {
    fetch('/api/tarifs')
      .then(r => r.json())
      .then(d => {
        setTarifs((d.data || []).map((t, i) => ({
          id: t.id,
          name: t.name,
          price: t.price ? t.price + '€' : 'Sur devis',
          period: t.period ? '/' + t.period : '',
          description: t.description || '',
          features: (t.features || '').split(',').filter(f => f.trim()).length > 0 ? (t.features || '').split(',').filter(f => f.trim()) : ['Voir tarif'],
          cta: 'Choisir',
          highlight: i === 1,
        })))
      })
      .catch(e => console.error('Erreur tarifs:', e))
  }, [])

  const faqs = [
    { id: 1, question: 'Combien de temps pour créer un site ?', answer: 'En général 2-4 semaines selon la complexité. Les projets simples peuvent être plus rapides.' },
    { id: 2, question: 'Offrez-vous le support après livraison ?', answer: 'Oui ! Support inclus selon votre plan. Maintenance et mises à jour disponibles.' },
    { id: 3, question: 'Mon site sera-t-il responsive ?', answer: 'Oui, 100% responsive ! Testés sur tous les appareils (mobile, tablette, PC).' },
    { id: 4, question: 'Pouvez-vous migrer mon ancien site ?', answer: 'Absolument ! Migration gratuite + redirection des URLs pour le SEO.' },
    { id: 5, question: 'Quelle est votre délai de réponse ?', answer: 'Réponse garantie en 24h. Chat en direct pour urgences.' },
    { id: 6, question: 'Acceptez-vous les paiements échelonnés ?', answer: 'Oui ! 2-3 versements possibles selon le devis. Flexible sur les conditions.' },
  ]

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'judev', label: 'JuDev' },
    { id: 'avis', label: 'Avis' },
    { id: 'tarifs', label: 'Tarifs' },
    { id: 'leave-avis', label: 'Votre avis' },
    { id: 'contact', label: 'Contact' },
  ]

  const handleChatSend = () => {
    if (!chatInput.trim()) return
    const newMessage = { id: chatMessages.length + 1, sender: 'user', text: chatInput }
    setChatMessages([...chatMessages, newMessage])
    setChatInput('')
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: prev.length + 1, sender: 'bot', text: 'Merci pour ta question ! Je passe ta demande à notre équipe. Tu recevras une réponse rapidement.' }])
    }, 500)
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactSubmitting(true)
    
    try {
      const res = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: '',
          company: '',
          budget: 0,
          project_type: 'consultation',
          message: contactForm.message,
          status: 'new'
        })
      })

      if (res.ok) {
        setContactSuccess('✓ Message reçu ! Nous vous répondrons dans les 24-48h.')
        setContactForm({ name: '', email: '', message: '' })
        setTimeout(() => setContactSuccess(''), 5000)
      }
    } catch (error) {
      console.error('Error:', error)
      setContactSuccess('❌ Erreur lors de l\'envoi')
    } finally {
      setContactSubmitting(false)
    }
  }

  const handleAvisSubmit = async (e) => {
    e.preventDefault()
    setAvisSubmitting(true)
    
    try {
      const res = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: avisForm.name,
          business: avisForm.business,
          email: avisForm.email,
          text: avisForm.text,
          rating: avisForm.rating,
          status: 'pending'
        })
      })

      if (res.ok) {
        setAvisSuccess('✓ Merci pour votre avis ! Il sera publié après validation.')
        setAvisForm({ name: '', business: '', email: '', text: '', rating: 5 })
        setTimeout(() => setAvisSuccess(''), 5000)
      }
    } catch (error) {
      console.error('Error:', error)
      setAvisSuccess('❌ Erreur lors de l\'envoi')
    } finally {
      setAvisSubmitting(false)
    }
  }

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="text-center relative z-10">
          <motion.h1 animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            JuDev
          </motion.h1>
          <motion.p animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, delay: 0.3, repeat: Infinity }} className="text-pink-400 text-xs md:text-sm tracking-widest font-mono">
            Chargement...
          </motion.p>
          <motion.div initial={{ width: 0 }} animate={{ width: 100 }} transition={{ duration: 3 }} className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full" />
        </motion.div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute -top-1/2 -left-1/2 w-96 h-96 border border-pink-400/10 rounded-full" />
        </div>
      </div>
    )
  }

  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-pink-500/20 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between whitespace-nowrap">
        <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent flex-shrink-0">
          JuDev
        </h1>
        <div className="flex items-center gap-1 md:gap-8 flex-shrink-0">
          <div className="hidden lg:flex gap-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${currentPage === item.id ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-300 border border-pink-500/50' : 'text-gray-400 hover:text-pink-300'}`}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="lg:hidden flex gap-1 overflow-x-auto">
            {navItems.slice(0, 5).map((item) => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`px-2 py-1 text-xs font-semibold rounded transition-all flex-shrink-0 ${currentPage === item.id ? 'bg-pink-500/30 text-pink-300' : 'text-gray-400'}`}>
                {item.label.split(' ')[0]}
              </button>
            ))}
          </div>
          <button onClick={() => setIsTerminalMode(!isTerminalMode)} className="px-3 md:px-4 py-2 text-xs md:text-sm border border-pink-500/50 text-pink-400 rounded-lg hover:bg-pink-500/10 transition font-mono flex-shrink-0">
            $ {isTerminalMode ? 'EXIT' : 'TERM'}
          </button>
        </div>
      </div>
    </nav>
  )

  const HomePage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-black via-purple-950/20 to-black flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full text-center py-20 md:py-32">
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <p className="text-pink-400 text-sm md:text-lg font-mono mb-4 md:mb-6 tracking-widest">BIENVENUE À</p>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-tight mb-6 md:mb-8">
            <span className="block text-white">DÉVELOPPEUR</span>
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">CRÉATIF</span>
          </h1>
          <p className="text-base md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Je crée des <span className="text-pink-400 font-semibold">interfaces web immersives</span> et des <span className="text-purple-400 font-semibold">expériences 3D</span> qui fascinent.
          </p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center px-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage('judev')} className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400 text-pink-300 rounded-lg hover:from-pink-500/30 hover:to-purple-500/30 transition font-semibold text-base md:text-lg w-full md:w-auto">
              → Galerie
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage('contact')} className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400 text-blue-300 rounded-lg hover:from-blue-500/30 hover:to-cyan-500/30 transition font-semibold text-base md:text-lg w-full md:w-auto">
              → Contact
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  const JuDevPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-5xl md:text-7xl font-black mb-12">
          <span className="block text-white">GALERIE</span>
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">BOUTIQUES</span>
        </h2>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setSelectedMedia(null)} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedMedia(null)} className="absolute -top-10 right-0 text-pink-400 text-3xl z-10">✕</button>
              <img src={selectedMedia.url} alt={selectedMedia.title} className="w-full h-auto rounded-xl" />
              <p className="text-center text-gray-300 mt-6 text-lg">{selectedMedia.title}</p>
            </motion.div>
          </motion.div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {boutiques.length === 0 ? (
            <p className="text-gray-400">Chargement boutiques...</p>
          ) : (
            boutiques.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setSelectedMedia(item)} className="group relative cursor-pointer">
                <div className="relative bg-black/60 border border-pink-500/20 rounded-xl overflow-hidden hover:border-pink-500/50 transition-all h-64">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-pink-300 font-semibold">{item.title}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )

  const AvisPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-5xl md:text-7xl font-black mb-4">
          <span className="block text-white">AVIS</span>
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">CLIENTS</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-12">Nos clients satisfaits partagent leur expérience</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {avis.length === 0 ? (
            <p className="text-gray-400">Chargement avis...</p>
          ) : (
            avis.map((testimonial, i) => (
              <motion.div key={testimonial.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )

  const TarifsPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-5xl md:text-7xl font-black mb-4">
          <span className="block text-white">NOS</span>
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">TARIFS</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-16">Choisis le plan qui correspond à tes besoins</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {tarifs.length === 0 ? (
            <p className="text-gray-400">Chargement tarifs...</p>
          ) : (
            tarifs.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`relative rounded-xl p-6 md:p-8 border transition-all ${plan.highlight ? 'bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border-blue-500/50 md:scale-105' : 'bg-gradient-to-br from-blue-950/10 to-cyan-950/10 border-blue-500/20 hover:border-blue-500/50'}`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-1 rounded-full text-sm font-semibold text-white">
                    RECOMMANDÉ
                  </div>
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm md:text-base mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-4xl md:text-5xl font-black text-blue-400">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-gray-300 flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-400 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage('contact')} className={`w-full py-3 rounded-lg font-semibold transition ${plan.highlight ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600' : 'bg-blue-500/20 border border-blue-500 text-blue-300 hover:bg-blue-500/30'}`}>
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )

  const LeaveAvisPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 md:px-6 w-full">
        <h2 className="text-5xl md:text-7xl font-black mb-4">
          <span className="block text-white">LAISSEZ</span>
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">VOTRE AVIS</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-12">Partagez votre expérience avec nous</p>

        <div className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 rounded-xl p-6 md:p-12">
          {avisSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg text-center font-semibold">
              {avisSuccess}
            </motion.div>
          )}

          <form onSubmit={handleAvisSubmit} className="space-y-6">
            {/* NOM */}
            <div>
              <label className="block text-white font-semibold mb-2">Votre nom *</label>
              <input 
                type="text" 
                placeholder="Jean Dupont" 
                value={avisForm.name} 
                onChange={(e) => setAvisForm({...avisForm, name: e.target.value})} 
                className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition" 
                required 
              />
            </div>

            {/* ENTREPRISE */}
            <div>
              <label className="block text-white font-semibold mb-2">Votre entreprise / Secteur</label>
              <input 
                type="text" 
                placeholder="Ex: Agence web, E-commerce, Startup..." 
                value={avisForm.business} 
                onChange={(e) => setAvisForm({...avisForm, business: e.target.value})} 
                className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition" 
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-white font-semibold mb-2">Email *</label>
              <input 
                type="email" 
                placeholder="votre@email.com" 
                value={avisForm.email} 
                onChange={(e) => setAvisForm({...avisForm, email: e.target.value})} 
                className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition" 
                required 
              />
            </div>

            {/* ÉTOILES */}
            <div>
              <label className="block text-white font-semibold mb-4">Votre note *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAvisForm({...avisForm, rating: star})}
                    className={`text-5xl transition-all ${
                      star <= avisForm.rating ? 'text-yellow-400' : 'text-gray-500'
                    }`}
                  >
                    ⭐
                  </motion.button>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-3">{avisForm.rating} sur 5 ⭐</p>
            </div>

            {/* TEXTE AVIS */}
            <div>
              <label className="block text-white font-semibold mb-2">Votre avis *</label>
              <textarea 
                placeholder="Partagez votre expérience. Qu'avez-vous particulièrement aimé ? Comment nous avons pu vous aider ?" 
                rows="6" 
                value={avisForm.text} 
                onChange={(e) => setAvisForm({...avisForm, text: e.target.value})} 
                className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition resize-none" 
                required 
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              type="submit" 
              disabled={avisSubmitting} 
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50"
            >
              {avisSubmitting ? 'Envoi...' : 'Publier mon avis'}
            </motion.button>
          </form>

          <p className="text-gray-400 text-sm text-center mt-8">
            Les avis sont modérés avant publication pour garantir la qualité. Merci de votre compréhension !
          </p>
        </div>
      </div>
    </motion.div>
  )

  const FAQPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <h2 className="text-5xl md:text-7xl font-black mb-4">
          <span className="block text-white">QUESTIONS</span>
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">FRÉQUENTES</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl mb-12">Trouve les réponses à tes questions</p>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <motion.div key={faq.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 rounded-xl overflow-hidden hover:border-pink-500/50 transition-all">
              <button onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)} className="w-full px-6 md:px-8 py-4 md:py-6 text-left flex items-center justify-between hover:bg-pink-500/10 transition">
                <h3 className="text-base md:text-lg font-bold text-white">{faq.question}</h3>
                <span className={`text-pink-400 text-2xl transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedFAQ === faq.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-6 md:px-8 py-4 md:py-6 border-t border-pink-500/20 text-gray-300">
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const ContactPage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 md:px-6 w-full">
        <h2 className="text-5xl md:text-7xl font-black mb-6">
          <span className="block text-white">ME</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">CONTACTER</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
          <div className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 rounded-xl p-6 md:p-8">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-lg md:text-xl font-bold text-pink-400 mb-2">Email</h3>
            <p className="text-white text-base md:text-lg font-mono">hello@judev.com</p>
          </div>
          <div className="bg-gradient-to-br from-blue-950/20 to-cyan-950/20 border border-blue-500/20 rounded-xl p-6 md:p-8">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-2">Chat direct</h3>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowChat(!showChat)} className="text-blue-300 hover:text-blue-200 transition">
              {showChat ? 'Fermer chat →' : 'Ouvrir chat →'}
            </motion.button>
          </div>
        </div>
        {showChat && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border border-blue-500/30 rounded-xl p-4 md:p-6 mb-8">
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500/30 text-blue-100 border border-blue-500/50' : 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChatSend()} placeholder="Écris ton message..." className="flex-1 bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleChatSend} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Envoyer
              </motion.button>
            </div>
          </motion.div>
        )}
        <div className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 rounded-xl p-6 md:p-12">
          {contactSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg text-center font-semibold">
              {contactSuccess}
            </motion.div>
          )}
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Nom</label>
                <input type="text" placeholder="Ton nom" value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition" required />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email</label>
                <input type="email" placeholder="tonemail@example.com" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition" required />
              </div>
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Message</label>
              <textarea placeholder="Décris ton projet en détail..." rows="6" value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="w-full bg-black/50 border border-pink-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition resize-none" required />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={contactSubmitting} className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50">
              {contactSubmitting ? 'Envoi...' : 'Envoyer mon message'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  )

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />
      case 'judev': return <JuDevPage />
      case 'avis': return <AvisPage />
      case 'leave-avis': return <LeaveAvisPage />
      case 'tarifs': return <TarifsPage />
      case 'contact': return <ContactPage />
      default: return <HomePage />
    }
  }

  return (
    <div className={isTerminalMode ? 'bg-gray-900 text-green-400 font-mono' : 'bg-black text-white'}>
      <Navigation />
      {renderPage()}
      <footer className="bg-black/50 border-t border-pink-500/20 py-8 md:py-12 text-center">
        <p className="text-gray-400 text-sm md:text-base">© 2024 JuDev. Créé avec passion ✨</p>
      </footer>
    </div>
  )
}
