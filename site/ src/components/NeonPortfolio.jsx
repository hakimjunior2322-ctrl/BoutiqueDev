'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function NeonPortfolio() {
  const [currentPage, setCurrentPage] = useState('home')
  const [showSplash, setShowSplash] = useState(true)
  const [isTerminalMode, setIsTerminalMode] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  // GALERIE BOUTIQUES - Ajoute tes vidéos et photos ici
  const galleryItems = [
    {
      id: 1,
      title: 'Boutique Paris - Ambiance',
      type: 'image', // 'image' ou 'video'
      url: 'https://via.placeholder.com/600x400?text=Boutique+Paris',
      thumbnail: 'https://via.placeholder.com/200x150?text=Paris',
    },
    {
      id: 2,
      title: 'Boutique Paris - Visite 360',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Remplace par ta vidéo YouTube
      thumbnail: 'https://via.placeholder.com/200x150?text=Video+Paris',
    },
    {
      id: 3,
      title: 'Boutique Lyon - Facade',
      type: 'image',
      url: 'https://via.placeholder.com/600x400?text=Boutique+Lyon',
      thumbnail: 'https://via.placeholder.com/200x150?text=Lyon',
    },
    {
      id: 4,
      title: 'Boutique Lyon - Intérieur',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://via.placeholder.com/200x150?text=Video+Lyon',
    },
    {
      id: 5,
      title: 'Boutique Marseille - Vue générale',
      type: 'image',
      url: 'https://via.placeholder.com/600x400?text=Boutique+Marseille',
      thumbnail: 'https://via.placeholder.com/200x150?text=Marseille',
    },
    {
      id: 6,
      title: 'Boutique Marseille - Détails',
      type: 'image',
      url: 'https://via.placeholder.com/600x400?text=Details+Marseille',
      thumbnail: 'https://via.placeholder.com/200x150?text=Details',
    },
  ]

  const projects = [
    {
      id: 1,
      title: 'Dashboard Analytics',
      description: 'Tableau de bord temps réel',
      stack: ['Next.js', 'React', 'Chart.js'],
      image: '📊',
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'Plateforme complète',
      stack: ['React', 'Node.js', 'MongoDB'],
      image: '🛍️',
    },
    {
      id: 3,
      title: '3D Viewer',
      description: 'Visualiseur 3D',
      stack: ['Three.js', 'React', 'WebGL'],
      image: '🎨',
    },
    {
      id: 4,
      title: 'SaaS App',
      description: 'Application SaaS',
      stack: ['Next.js', 'OpenAI', 'Stripe'],
      image: '✨',
    },
    {
      id: 5,
      title: 'Design Tool',
      description: 'Outil collaboratif',
      stack: ['React', 'Socket.io', 'Canvas'],
      image: '🎭',
    },
    {
      id: 6,
      title: 'Mobile App',
      description: 'App native',
      stack: ['React Native', 'Firebase', 'Expo'],
      image: '📱',
    },
  ]

  const services = [
    { icon: '🌐', title: 'Site Vitrine', description: 'Web moderne' },
    { icon: '⚙️', title: 'App Web', description: 'Scalable' },
    { icon: '📱', title: 'PWA', description: 'Offline-first' },
    { icon: '🎨', title: 'UI/UX Design', description: 'Innovant' },
    { icon: '🚀', title: 'Landing Page', description: 'Conversion' },
    { icon: '🔧', title: 'Maintenance', description: 'Support' },
  ]

  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'Three.js', 'Tailwind', 'GSAP'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'] },
    { category: 'Tools', items: ['Git', 'Docker', 'Figma', 'Vercel'] },
  ]

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'judev', label: 'JuDev' },
    { id: 'services', label: 'Services' },
    { id: 'skills', label: 'Skills' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' },
  ]

  // SPLASHSCREEN
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <motion.h1
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            JuDev
          </motion.h1>

          <motion.p
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
            className="text-pink-400 text-xs md:text-sm tracking-widest font-mono"
          >
            Chargement...
          </motion.p>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ duration: 3 }}
            className="mt-8 h-1 w-32 mx-auto bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full"
          />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -left-1/2 w-96 h-96 border border-pink-400/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1/2 -right-1/2 w-96 h-96 border border-blue-400/10 rounded-full"
          />
        </div>
      </div>
    )
  }

  // NAVIGATION
  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-pink-500/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl md:text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          JuDev
        </motion.h1>

        <div className="flex items-center gap-2 md:gap-8">
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-300 border border-pink-500/50'
                    : 'text-gray-400 hover:text-pink-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="md:hidden flex gap-1">
            {navItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                  currentPage === item.id ? 'bg-pink-500/30 text-pink-300' : 'text-gray-400'
                }`}
              >
                {item.label.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsTerminalMode(!isTerminalMode)}
            className="px-3 md:px-4 py-2 text-xs md:text-sm border border-pink-500/50 text-pink-400 rounded-lg hover:bg-pink-500/10 transition font-mono"
          >
            $ {isTerminalMode ? 'EXIT' : 'TERM'}
          </button>
        </div>
      </div>
    </nav>
  )

  // PAGE: HOME
  const HomePage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-16 md:pt-20 bg-gradient-to-b from-black via-purple-950/20 to-black flex items-center justify-center"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full text-center py-20 md:py-32">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <p className="text-pink-400 text-sm md:text-lg font-mono mb-4 md:mb-6 tracking-widest">BIENVENUE À</p>

          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-tight mb-6 md:mb-8">
            <span className="block text-white">DÉVELOPPEUR</span>
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">CRÉATIF</span>
          </h1>

          <p className="text-base md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            Je crée des <span className="text-pink-400 font-semibold">interfaces web immersives</span> et des
            <span className="text-purple-400 font-semibold"> expériences 3D</span> qui fascinent.
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center px-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('judev')}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400 text-pink-300 rounded-lg hover:from-pink-500/30 hover:to-purple-500/30 transition font-semibold text-base md:text-lg w-full md:w-auto"
            >
              → JuDev
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage('contact')}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400 text-blue-300 rounded-lg hover:from-blue-500/30 hover:to-cyan-500/30 transition font-semibold text-base md:text-lg w-full md:w-auto"
            >
              → Contact
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: -1 }}
        >
          <motion.div
            animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-40 md:w-72 h-40 md:h-72 border-2 border-pink-400/15 rounded-2xl"
          />
        </motion.div>
      </div>
    </motion.div>
  )

  // PAGE: JUDEV (Galerie + Projets)
  const JuDevPage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Galerie Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-4">
            <span className="block text-white">GALERIE</span>
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">BOUTIQUES</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-12">Photos et vidéos de nos boutiques</p>

          {/* Modal Fullscreen */}
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedMedia(null)}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute -top-10 right-0 text-pink-400 text-3xl z-10"
                >
                  ✕
                </button>

                {selectedMedia.type === 'video' ? (
                  <iframe
                    width="100%"
                    height="600"
                    src={selectedMedia.url}
                    title={selectedMedia.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-xl"
                  />
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full h-auto rounded-xl"
                  />
                )}

                <p className="text-center text-gray-300 mt-6 text-lg">{selectedMedia.title}</p>
              </motion.div>
            </motion.div>
          )}

          {/* Galerie Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-20">
            {galleryItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedMedia(item)}
                className="group relative cursor-pointer"
              >
                <div className="relative bg-black/60 backdrop-blur-md border border-pink-500/20 rounded-xl overflow-hidden hover:border-pink-500/50 transition-all h-64 md:h-72">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end justify-end p-4">
                    <p className="text-pink-300 text-sm md:text-base font-semibold text-right">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.type === 'video' ? '🎥 Vidéo' : '📸 Photo'}
                    </p>
                  </div>

                  {/* Play Icon for Videos */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/30 transition-all">
                      <div className="w-16 h-16 bg-pink-500/30 border-2 border-pink-400 rounded-full flex items-center justify-center group-hover:bg-pink-500/50 transition-all">
                        <span className="text-white text-2xl ml-1">▶</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Projets Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <h3 className="text-4xl md:text-5xl font-black mb-8">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">PROJETS</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projects.slice(0, 3).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative bg-black/60 backdrop-blur-md border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 transition-all h-full flex flex-col bg-gradient-to-br from-blue-950/10 to-cyan-950/10">
                  <div className="text-5xl mb-4">{project.image}</div>
                  <h4 className="text-lg md:text-xl font-bold text-white mb-2">{project.title}</h4>
                  <p className="text-gray-400 text-sm md:text-base mb-4 flex-grow">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  // PAGE: SERVICES
  const ServicesPage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 md:mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-4">
            <span className="block text-white">MES</span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SERVICES</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-blue-950/20 to-cyan-950/20 border border-blue-500/20 rounded-xl p-6 md:p-8 hover:border-blue-500/50 transition-all group"
            >
              <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm md:text-base">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  // PAGE: SKILLS
  const SkillsPage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 md:mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-4">
            <span className="block text-white">MES</span>
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">COMPÉTENCES</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-pink-950/20 to-purple-950/20 border border-pink-500/20 rounded-xl p-6 md:p-8"
            >
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
                {skill.category}
              </h3>
              <ul className="space-y-3">
                {skill.items.map((item, j) => (
                  <li key={j} className="text-gray-300 text-sm md:text-base flex items-center gap-3">
                    <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  // PAGE: ABOUT
  const AboutPage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8 md:mb-12">
            <span className="block text-white">À</span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">PROPOS</span>
          </h2>

          <div className="space-y-6 md:space-y-8 text-gray-300 text-base md:text-lg leading-relaxed">
            <p>
              Je suis un développeur web créatif passionné par la création d'expériences numériques immersives.
              Avec 5+ ans d'expérience, je combine <span className="text-pink-400 font-semibold">technologie cutting-edge</span> et
              <span className="text-purple-400 font-semibold"> design innovant</span>.
            </p>

            <p>
              Ma spécialité : créer des interfaces web qui fascinent et engagent. De la conception au déploiement,
              je gère tous les aspects du projet avec passion et rigueur.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  // PAGE: CONTACT
  const ContactPage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 md:pt-32 pb-16 md:pb-20 bg-black flex items-center justify-center"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 md:mb-8">
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
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-lg md:text-xl font-bold text-blue-400 mb-2">Réseaux</h3>
              <p className="text-gray-300 text-base">GitHub • LinkedIn • Instagram</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 md:px-12 py-4 w-full md:w-auto bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-400 text-pink-300 rounded-lg hover:from-pink-500/40 hover:to-purple-500/40 transition font-semibold text-base md:text-lg"
          >
            → Envoyer un message
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )

  // Render
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'judev':
        return <JuDevPage />
      case 'services':
        return <ServicesPage />
      case 'skills':
        return <SkillsPage />
      case 'about':
        return <AboutPage />
      case 'contact':
        return <ContactPage />
      default:
        return <HomePage />
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
