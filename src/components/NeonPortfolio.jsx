'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home')
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const loadVanta = async () => {
      const three = document.createElement('script')
      three.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'
      three.async = true
      document.head.appendChild(three)

      three.onload = () => {
        const vanta = document.createElement('script')
        vanta.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js'
        vanta.async = true
        document.head.appendChild(vanta)

        vanta.onload = () => {
          setTimeout(() => {
            if (window.VANTA) {
              window.VANTA.WAVES({
                el: '#vanta-bg',
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200,
                minWidth: 200,
                scale: 1,
                scaleMobile: 1,
                color: isDarkMode ? 0x0 : 0xffffff
              })
            }
          }, 200)
        }
      }
    }
    loadVanta()
  }, [isDarkMode])

  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    html, body { width: 100%; height: 100%; }
    
    body { 
      font-family: 'Inter', sans-serif;
      background: ${isDarkMode ? '#0a0a0a' : '#ffffff'};
      color: ${isDarkMode ? '#fff' : '#000'};
      overflow-x: hidden;
      transition: background 0.3s, color 0.3s;
    }
    
    h1, h2, h3 { font-family: 'Poppins', sans-serif; color: ${isDarkMode ? '#fff' : '#000'}; }
    
    #vanta-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    
    .wrapper {
      position: relative;
      z-index: 2;
    }
    
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: ${isDarkMode ? 'rgba(10, 10, 10, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
      backdrop-filter: blur(20px);
      border-bottom: 1px solid ${isDarkMode ? 'rgba(100, 100, 100, 0.1)' : 'rgba(100, 100, 100, 0.2)'};
      z-index: 50;
      padding: 16px 20px;
      transition: all 0.3s;
    }
    
    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 20px;
      font-weight: 800;
      cursor: pointer;
      color: ${isDarkMode ? '#fff' : '#000'};
      border: none;
      background: none;
      font-family: 'Poppins', sans-serif;
    }
    
    .nav-links {
      display: flex;
      gap: 30px;
      align-items: center;
    }
    
    .nav-link {
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      background: none;
      color: ${isDarkMode ? '#ccc' : '#666'};
      transition: all 0.3s;
    }
    
    .nav-link:hover {
      color: #ff6b9d;
    }
    
    .theme-toggle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid #ff6b9d;
      background: ${isDarkMode ? 'rgba(255, 107, 157, 0.1)' : 'rgba(255, 107, 157, 0.2)'};
      color: #ff6b9d;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: all 0.3s;
    }
    
    .theme-toggle:hover {
      background: ${isDarkMode ? 'rgba(255, 107, 157, 0.2)' : 'rgba(255, 107, 157, 0.3)'};
      transform: scale(1.1);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding-top: 80px;
    }
    
    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }
    
    .hero-content h1 {
      font-size: clamp(36px, 8vw, 72px);
      line-height: 1.1;
      margin-bottom: 20px;
      font-weight: 900;
      letter-spacing: -1px;
    }
    
    .hero-label {
      font-size: 16px;
      color: ${isDarkMode ? '#fff' : '#000'};
      margin-bottom: 15px;
      font-weight: 500;
    }
    
    .hero-desc {
      font-size: 16px;
      color: ${isDarkMode ? '#ccc' : '#666'};
      line-height: 1.7;
      margin-bottom: 40px;
    }
    
    .button-group {
      display: flex;
      gap: 15px;
    }
    
    .btn {
      padding: 12px 28px;
      border: 2px solid #ff6b9d;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s;
      background: linear-gradient(135deg, #ff6b9d, #ff8fae);
      color: #fff;
      border-radius: 50px;
    }
    
    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(255, 107, 157, 0.3);
    }
    
    .btn-secondary {
      background: transparent;
      color: #ff6b9d;
    }
    
    .btn-secondary:hover {
      background: rgba(255, 107, 157, 0.1);
    }
    
    .carousel-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .carousel-box {
      position: relative;
      width: 100%;
      height: 400px;
      border-radius: 16px;
      overflow: hidden;
      background: ${isDarkMode ? 'rgba(50, 50, 60, 0.2)' : 'rgba(200, 200, 200, 0.2)'};
      border: 1px solid ${isDarkMode ? 'rgba(255, 107, 157, 0.1)' : 'rgba(255, 107, 157, 0.2)'};
    }
    
    .carousel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .carousel-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      background: rgba(255, 107, 157, 0.2);
      border: 2px solid #ff6b9d;
      color: #ff6b9d;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      border-radius: 50%;
      transition: all 0.3s;
      z-index: 10;
      user-select: none;
    }
    
    .carousel-arrow:hover {
      background: rgba(255, 107, 157, 0.4);
      transform: translateY(-50%) scale(1.1);
    }
    
    .carousel-arrow.prev {
      left: 15px;
    }
    
    .carousel-arrow.next {
      right: 15px;
    }
    
    .carousel-label {
      text-align: center;
      padding: 20px;
      background: ${isDarkMode ? 'rgba(10, 10, 10, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
      font-size: 24px;
      font-weight: 700;
      border-radius: 8px;
      color: ${isDarkMode ? '#fff' : '#000'};
    }
    
    .section {
      padding: 120px 0;
      position: relative;
    }
    
    .section h2 {
      font-size: clamp(36px, 7vw, 64px);
      margin-bottom: 50px;
      font-weight: 900;
      letter-spacing: -1px;
    }
    
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
    }
    
    .gallery-item {
      aspect-ratio: 1;
      background: ${isDarkMode ? 'rgba(50, 50, 60, 0.2)' : 'rgba(200, 200, 200, 0.2)'};
      border: 1px solid ${isDarkMode ? 'rgba(255, 107, 157, 0.15)' : 'rgba(255, 107, 157, 0.2)'};
      cursor: pointer;
      overflow: hidden;
      border-radius: 16px;
      transition: all 0.5s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: ${isDarkMode ? '#fff' : '#000'};
      backdrop-filter: blur(10px);
    }
    
    .gallery-item:hover {
      border-color: #ff6b9d;
      transform: translateY(-15px);
      box-shadow: 0 30px 60px rgba(255, 107, 157, 0.2);
    }
    
    .pricing {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    
    .price-card {
      border: 1px solid ${isDarkMode ? 'rgba(255, 107, 157, 0.15)' : 'rgba(255, 107, 157, 0.2)'};
      padding: 40px 30px;
      background: ${isDarkMode ? 'rgba(50, 50, 60, 0.2)' : 'rgba(200, 200, 200, 0.2)'};
      border-radius: 16px;
      transition: all 0.5s ease;
      backdrop-filter: blur(10px);
    }
    
    .price-card:hover {
      border-color: #ff6b9d;
      transform: translateY(-15px);
      box-shadow: 0 30px 60px rgba(255, 107, 157, 0.15);
    }
    
    .price-card.highlight {
      border-color: #ff6b9d;
      background: rgba(255, 107, 157, 0.1);
      transform: scale(1.02);
    }
    
    .price-card h3 {
      font-size: 24px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    
    .price-desc {
      color: ${isDarkMode ? '#ccc' : '#666'};
      font-size: 13px;
      margin-bottom: 20px;
    }
    
    .price {
      font-size: 42px;
      font-weight: 900;
      margin: 20px 0;
      color: #ff6b9d;
    }
    
    .features-list {
      text-align: left;
      margin: 30px 0;
      font-size: 14px;
      line-height: 2.2;
      color: ${isDarkMode ? '#ccc' : '#666'};
    }
    
    .features-list li {
      list-style: none;
    }
    
    .contact-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      max-width: 700px;
    }
    
    .contact-card {
      border: 1px solid ${isDarkMode ? 'rgba(255, 107, 157, 0.15)' : 'rgba(255, 107, 157, 0.2)'};
      padding: 40px 30px;
      background: ${isDarkMode ? 'rgba(50, 50, 60, 0.2)' : 'rgba(200, 200, 200, 0.2)'};
      border-radius: 16px;
      backdrop-filter: blur(10px);
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .contact-card:hover {
      border-color: #ff6b9d;
      transform: translateY(-15px);
      box-shadow: 0 30px 60px rgba(255, 107, 157, 0.15);
    }
    
    .contact-icon {
      font-size: 32px;
      margin-bottom: 15px;
    }
    
    .contact-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #ff6b9d;
      margin-bottom: 10px;
    }
    
    .contact-value {
      font-size: 18px;
      font-weight: 700;
      color: ${isDarkMode ? '#fff' : '#000'};
    }
    
    footer {
      border-top: 1px solid ${isDarkMode ? 'rgba(255, 107, 157, 0.1)' : 'rgba(255, 107, 157, 0.2)'};
      padding: 50px 0;
      text-align: center;
      font-size: 13px;
      color: ${isDarkMode ? '#999' : '#666'};
    }
    
    @media (max-width: 1024px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      
      .carousel-box {
        height: 300px;
      }
    }
    
    @media (max-width: 768px) {
      .nav {
        padding: 12px 16px;
      }
      
      .nav-links {
        gap: 15px;
      }
      
      .nav-link {
        font-size: 11px;
      }
      
      .hero {
        padding-top: 70px;
      }
      
      .container {
        padding: 0 16px;
      }
      
      .button-group {
        flex-direction: column;
        gap: 10px;
      }
      
      .btn {
        width: 100%;
        padding: 11px 20px;
        font-size: 12px;
      }
      
      .carousel-box {
        height: 220px;
      }
      
      .carousel-arrow {
        width: 40px;
        height: 40px;
        font-size: 18px;
      }
      
      .carousel-label {
        font-size: 18px;
        padding: 15px;
      }
      
      .gallery {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .pricing {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .price-card.highlight {
        transform: scale(1);
      }
      
      .section {
        padding: 60px 0;
      }
      
      .section h2 {
        font-size: 32px;
        margin-bottom: 30px;
      }
    }
    
    @media (max-width: 480px) {
      .nav {
        padding: 10px 12px;
      }
      
      .logo {
        font-size: 18px;
      }
      
      .nav-links {
        gap: 10px;
      }
      
      .nav-link {
        font-size: 10px;
      }
      
      .theme-toggle {
        width: 40px;
        height: 40px;
        font-size: 18px;
      }
      
      .hero-content h1 {
        font-size: 28px;
      }
      
      .hero-label {
        font-size: 13px;
      }
      
      .hero-desc {
        font-size: 14px;
      }
      
      .carousel-box {
        height: 180px;
      }
      
      .carousel-arrow {
        width: 35px;
        height: 35px;
        font-size: 16px;
      }
      
      .carousel-label {
        font-size: 16px;
      }
      
      .section h2 {
        font-size: 26px;
      }
      
      .contact-cards {
        grid-template-columns: 1fr;
      }
    }
  `

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'tarifs', label: 'Tarifs' },
    { id: 'contact', label: 'Contact' }
  ]

  const carouselImages = [
    'https://i.imgur.com/fXJwB5B.jpeg',
    'https://i.imgur.com/fXJwB5B.jpeg',
    'https://i.imgur.com/fXJwB5B.jpeg'
  ]

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <>
      <style>{STYLES}</style>
      <div id="vanta-bg"></div>

      <div className="wrapper">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-content">
            <button className="logo" onClick={() => setCurrentPage('home')}>
              JuDev
            </button>
            <div className="nav-links">
              {navItems.map(item => (
                <button
                  key={item.id}
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  {item.label}
                </button>
              ))}
              <button 
                className="theme-toggle"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </nav>

        {/* HOME */}
        {currentPage === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hero">
            <div className="container" style={{ width: '100%' }}>
              <motion.div
                className="hero-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="hero-content">
                  <motion.div variants={itemVariants}>
                    <div className="hero-label">Bienvenue chez JuDev</div>
                  </motion.div>
                  <motion.h1 variants={itemVariants}>
                    Créons votre site<br />
                    <span style={{ color: '#ff6b9d' }}>exception</span>nel
                  </motion.h1>
                  <motion.p variants={itemVariants} className="hero-desc">
                    Des sites web modernes et performants avec un design créatif. Nous transformons vos idées en expériences numériques inoubliables.
                  </motion.p>
                  <motion.div variants={itemVariants} className="button-group">
                    <button className="btn" onClick={() => setCurrentPage('tarifs')}>
                      Voir nos tarifs
                    </button>
                    <button className="btn btn-secondary" onClick={() => setCurrentPage('contact')}>
                      Obtenir un devis
                    </button>
                  </motion.div>
                </div>

                {/* CAROUSEL */}
                <motion.div className="carousel-container" variants={itemVariants}>
                  <div className="carousel-box">
                    <img
                      src={carouselImages[carouselIndex]}
                      alt="Carousel"
                      className="carousel-image"
                    />
                    <button className="carousel-arrow prev" onClick={prevSlide}>
                      ‹
                    </button>
                    <button className="carousel-arrow next" onClick={nextSlide}>
                      ›
                    </button>
                  </div>
                  <div className="carousel-label">
                    Boutique Exemple {carouselIndex + 1}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* PORTFOLIO */}
        {currentPage === 'portfolio' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="container">
              <div className="section">
                <motion.h2 variants={itemVariants} initial="hidden" animate="visible">
                  Nos Projets
                </motion.h2>
                <motion.div
                  className="gallery"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {['E-commerce Premium', 'Application SaaS', 'Portfolio Designer', 'Site Institutionnel', 'Plateforme Éducative', 'Application Mobile Web'].map((label, i) => (
                    <motion.div key={i} className="gallery-item" variants={itemVariants}>
                      {label}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TARIFS */}
        {currentPage === 'tarifs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="container">
              <div className="section">
                <motion.h2 variants={itemVariants} initial="hidden" animate="visible">
                  Nos Offres
                </motion.h2>
                <motion.div
                  className="pricing"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="price-card" variants={itemVariants}>
                    <h3>Starter</h3>
                    <p className="price-desc">Pour débuter</p>
                    <div className="price">1 990€</div>
                    <ul className="features-list">
<section class="offers">
  <h2>Nos Offres de Création de Site Web</h2>

  <div class="pricing-container">

    <!-- Offre Essentiel -->
    <div class="pricing-card">
      <h3>Offre Essentiel</h3>
      <p class="price">À partir de 200€</p>
      <ul>
        <li>✓ Site vitrine 5 à 10 pages</li>
        <li>✓ Design moderne & responsive</li>
        <li>✓ SEO basique (optimisation Google)</li>
        <li>✓ Formulaire de contact</li>
        <li>✓ Intégration contenus</li>
        <li>✓ Mise en ligne du site</li>
        <li>✓ Support technique 1 mois</li>
      </ul>
                    <button className="btn" style={{ width: '100%' }} onClick={() => setCurrentPage('contact')}>
                      Choisir
                    </button>
                  </motion.div>

                  <motion.div className="price-card highlight" variants={itemVariants}>
                    <h3>Professionnel</h3>
                    <p className="price-desc">⭐ Populaire</p>
                    <div className="price">3 990€</div>
                    <ul className="features-list">
                       <!-- Offre Pro -->
    <div class="pricing-card featured">
      <h3>Offre Professionnel</h3>
      <p class="price">À partir de 500€</p>
      <ul>
        <li>✓ Site jusqu'à 15 pages</li>
        <li>✓ Design sur-mesure</li>
        <li>✓ Responsive tous supports</li>
        <li>✓ SEO optimisé</li>
        <li>✓ Optimisation vitesse</li>
        <li>✓ Intégration réseaux sociaux</li>
        <li>✓ Formation utilisation</li>
        <li>✓ Support prioritaire 2 mois</li>
      </ul>
                    <button className="btn" style={{ width: '100%' }} onClick={() => setCurrentPage('contact')}>
                      Choisir
                    </button>
                  </motion.div>

                  <motion.div className="price-card" variants={itemVariants}>
                    <h3>Entreprise</h3>
                    <p className="price-desc">Projets complexes</p>
                    <div className="price">Devis</div>
                    <ul className="features-list">
                            <li>✓ Site web sur mesure</li>
        <li>✓ UX/UI design professionnel</li>
        <li>✓ SEO avancé</li>
        <li>✓ Sécurité renforcée</li>
        <li>✓ Statistiques visiteurs</li>
        <li>✓ Maintenance incluse</li>
        <li>✓ Accompagnement stratégique</li>
        <li>✓ Support 3 mois</li>
      </ul>
                    <button className="btn" style={{ width: '100%' }} onClick={() => setCurrentPage('contact')}>
                      Discuter
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* CONTACT */}
        {currentPage === 'contact' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="container">
              <div className="section">
                <motion.h2 variants={itemVariants} initial="hidden" animate="visible">
                  Nous Contacter
                </motion.h2>
                <motion.div
                  className="contact-cards"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.a 
                    href="mailto:contact@judev.store"
                    className="contact-card"
                    variants={itemVariants}
                  >
                    <div className="contact-icon">📧</div>
                    <div className="contact-label">Email</div>
                    <div className="contact-value">contact@judev.store</div>
                  </motion.a>

                  <motion.a 
                    href="tel:+33612345678"
                    className="contact-card"
                    variants={itemVariants}
                  >
                    <div className="contact-icon">📱</div>
                    <div className="contact-label">Téléphone</div>
                    <div className="contact-value">+33 6 12 34 56 78</div>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        <footer>
          <div className="container">
            <p>© 2026 JuDev — Design créatif et innovant ✨</p>
          </div>
        </footer>
      </div>
    </>
  )
}
