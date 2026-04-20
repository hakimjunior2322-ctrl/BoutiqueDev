'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  html, body { 
    width: 100%;
    height: 100%;
  }
  
  body { 
    font-family: 'Inter', sans-serif;
    background: #0a0a0a;
    color: #fff;
    overflow-x: hidden;
  }
  
  h1, h2, h3 { font-family: 'Poppins', sans-serif; color: #fff; }
  
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
    background: rgba(10, 10, 10, 0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(100, 100, 100, 0.1);
    z-index: 50;
    padding: 16px 30px;
  }
  
  .nav-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 22px;
    font-weight: 800;
    cursor: pointer;
    color: #fff;
    border: none;
    background: none;
    font-family: 'Poppins', sans-serif;
    letter-spacing: -1px;
  }
  
  .nav-links {
    display: flex;
    gap: 35px;
    align-items: center;
  }
  
  .nav-link {
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    background: none;
    color: #ccc;
    transition: all 0.3s;
    position: relative;
  }
  
  .nav-link.active {
    color: #fff;
    font-weight: 600;
  }
  
  .nav-link:hover {
    color: #fff;
  }
  
  .nav-link:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #ff6b9d;
    transition: width 0.3s;
  }
  
  .nav-link:hover:after {
    width: 100%;
  }
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 30px;
  }
  
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 80px;
    position: relative;
  }
  
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  
  .hero-content h1 {
    font-size: clamp(36px, 7vw, 76px);
    line-height: 1.1;
    margin-bottom: 20px;
    font-weight: 900;
    color: #fff;
    letter-spacing: -2px;
  }
  
  .hero-label {
    font-size: 16px;
    color: #fff;
    margin-bottom: 15px;
    font-weight: 500;
  }
  
  .hero-desc {
    font-size: clamp(14px, 3vw, 16px);
    color: #fff;
    line-height: 1.7;
    margin-bottom: 40px;
    max-width: 500px;
  }
  
  .button-group {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 13px 30px;
    border: 2px solid #ff6b9d;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.4s ease;
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #ff6b9d, #ff8fae);
    color: #fff;
    border-radius: 50px;
    position: relative;
    overflow: hidden;
  }
  
  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 107, 157, 0.3);
  }
  
  .btn-secondary {
    background: transparent;
    border: 2px solid #ff6b9d;
    color: #ff6b9d;
  }
  
  .btn-secondary:hover {
    background: rgba(255, 107, 157, 0.1);
  }
  
  .boutiques-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .swiper-carousel {
    width: 100%;
    height: 400px;
    border-radius: 20px;
    border: 1px solid rgba(255, 107, 157, 0.1);
    overflow: hidden;
    background: rgba(50, 50, 60, 0.2);
    backdrop-filter: blur(10px);
  }
  
  .swiper {
    width: 100%;
    height: 100%;
  }
  
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .boutique-name-container {
    text-align: center;
    padding: 20px;
    background: rgba(10, 10, 10, 0.5);
  }
  
  .boutique-name {
    font-size: clamp(18px, 4vw, 28px);
    font-weight: 700;
    color: #fff;
    font-family: 'Poppins', sans-serif;
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: #ff6b9d;
    background: rgba(255, 107, 157, 0.15);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid rgba(255, 107, 157, 0.3);
    transition: all 0.3s ease;
  }
  
  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    background: rgba(255, 107, 157, 0.3);
    border-color: #ff6b9d;
  }
  
  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 18px;
    font-weight: bold;
  }
  
  .swiper-pagination-bullet {
    background: rgba(255, 107, 157, 0.4) !important;
  }
  
  .swiper-pagination-bullet-active {
    background: #ff6b9d !important;
  }
  
  .section {
    padding: clamp(80px, 15vw, 140px) 0;
    position: relative;
    min-height: auto;
  }
  
  .section h2 {
    font-size: clamp(36px, 7vw, 64px);
    margin-bottom: 50px;
    color: #fff;
    font-weight: 900;
    letter-spacing: -1px;
  }
  
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
  }
  
  .gallery-item {
    aspect-ratio: 1;
    background: rgba(50, 50, 60, 0.2);
    border: 1px solid rgba(255, 107, 157, 0.15);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    transition: all 0.5s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #fff;
    backdrop-filter: blur(10px);
  }
  
  .gallery-item:hover {
    border-color: #ff6b9d;
    transform: translateY(-15px);
    box-shadow: 0 30px 60px rgba(255, 107, 157, 0.2);
  }
  
  .pricing {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
  }
  
  .price-card {
    border: 1px solid rgba(255, 107, 157, 0.15);
    padding: clamp(35px, 5vw, 50px);
    background: rgba(50, 50, 60, 0.2);
    border-radius: 16px;
    transition: all 0.5s ease;
    position: relative;
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
    font-size: clamp(22px, 5vw, 28px);
    margin-bottom: 10px;
    color: #fff;
    font-weight: 700;
  }
  
  .price-desc {
    color: #ccc;
    font-size: 13px;
    margin-bottom: 20px;
    font-weight: 400;
  }
  
  .price {
    font-size: clamp(32px, 6vw, 48px);
    font-weight: 900;
    margin: 25px 0;
    color: #ff6b9d;
  }
  
  .features-list {
    text-align: left;
    margin: 35px 0;
    font-size: 14px;
    line-height: 2.2;
    color: #ccc;
  }
  
  .features-list li {
    list-style: none;
  }
  
  .contact-form {
    max-width: 700px;
  }
  
  .form-group {
    margin-bottom: 25px;
  }
  
  .form-group label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
    color: #fff;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid rgba(255, 107, 157, 0.15);
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    background: rgba(50, 50, 60, 0.3);
    color: #fff;
    transition: all 0.3s;
    border-radius: 8px;
  }
  
  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: #999;
  }
  
  .form-group textarea {
    resize: none;
    min-height: 120px;
  }
  
  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #ff6b9d;
    background: rgba(50, 50, 60, 0.5);
    box-shadow: 0 0 20px rgba(255, 107, 157, 0.15);
  }
  
  footer {
    border-top: 1px solid rgba(255, 107, 157, 0.1);
    padding: clamp(40px, 8vw, 60px) 0;
    text-align: center;
    font-size: 13px;
    color: #999;
    font-weight: 400;
  }
  
  @media (max-width: 1024px) {
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    
    .swiper-carousel {
      height: 300px;
    }
  }
  
  @media (max-width: 768px) {
    .nav {
      padding: 12px 20px;
    }
    
    .nav-links {
      gap: 20px;
    }
    
    .nav-link {
      font-size: 12px;
    }
    
    .hero {
      padding-top: 70px;
      padding-bottom: 40px;
    }
    
    .button-group {
      gap: 10px;
    }
    
    .btn {
      padding: 11px 22px;
      font-size: 12px;
    }
    
    .swiper-carousel {
      height: 250px;
    }
    
    .gallery {
      grid-template-columns: 1fr;
    }
    
    .pricing {
      grid-template-columns: 1fr;
    }
    
    .price-card.highlight {
      transform: scale(1);
    }
  }
`

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home')

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
                color: 0x0
              })
            }
          }, 200)
        }
      }
    }

    loadVanta()
  }, [])

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'clients', label: 'Portfolio' },
    { id: 'tarifs', label: 'Tarifs' },
    { id: 'contact', label: 'Contact' }
  ]

  // DONNÉES DES BOUTIQUES - À MODIFIER AVEC TES BOUTIQUES
  const boutiques = [
    {
      id: 1,
      nom: 'Boutique Paris',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&h=800&fit=crop'
    },
    {
      id: 2,
      nom: 'Boutique Lyon',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1000&h=800&fit=crop'
    },
    {
      id: 3,
      nom: 'Boutique Marseille',
      image: 'https://images.unsplash.com/photo-1522869635100-ce306e08c5ec?w=1000&h=800&fit=crop'
    },
    {
      id: 4,
      nom: 'Boutique Toulouse',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&h=800&fit=crop'
    },
    {
      id: 5,
      nom: 'Boutique Nice',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&h=800&fit=crop'
    },
    {
      id: 6,
      nom: 'Boutique Bordeaux',
      image: 'https://images.unsplash.com/photo-1570129477492-45acc003a6bb?w=1000&h=800&fit=crop'
    }
  ]

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
                    <button className="btn" onClick={() => setCurrentPage('clients')}>
                      Voir nos projets
                    </button>
                    <button className="btn btn-secondary" onClick={() => setCurrentPage('contact')}>
                      Obtenir un devis
                    </button>
                  </motion.div>
                </div>

                {/* CAROUSEL BOUTIQUES */}
                <motion.div 
                  className="boutiques-container"
                  variants={itemVariants}
                >
                  <div className="swiper-carousel">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation
                      pagination={{ clickable: true }}
                      loop={true}
                      spaceBetween={0}
                      slidesPerView={1}
                    >
                      {boutiques.map(boutique => (
                        <SwiperSlide key={boutique.id}>
                          <img 
                            src={boutique.image} 
                            alt={boutique.nom}
                            className="slide-image"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  <div className="boutique-name-container">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation={false}
                      pagination={false}
                      loop={true}
                      spaceBetween={0}
                      slidesPerView={1}
                      onSlideChange={(swiper) => {}}
                    >
                      {boutiques.map(boutique => (
                        <SwiperSlide key={boutique.id}>
                          <div className="boutique-name">{boutique.nom}</div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* CLIENTS */}
        {currentPage === 'clients' && (
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
                  {[
                    'E-commerce Premium',
                    'Application SaaS',
                    'Portfolio Designer',
                    'Site Institutionnel',
                    'Plateforme Éducative',
                    'Application Mobile Web'
                  ].map((label, i) => (
                    <motion.div 
                      key={i}
                      className="gallery-item"
                      variants={itemVariants}
                    >
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
                      <li>✓ Site 5-10 pages</li>
                      <li>✓ Design responsive</li>
                      <li>✓ SEO basique</li>
                      <li>✓ Support 1 mois</li>
                    </ul>
                    <button className="btn" style={{ width: '100%' }} onClick={() => setCurrentPage('contact')}>Choisir</button>
                  </motion.div>

                  <motion.div className="price-card highlight" variants={itemVariants}>
                    <h3>Professionnel</h3>
                    <p className="price-desc">⭐ Populaire</p>
                    <div className="price">3 990€</div>
                    <ul className="features-list">
                      <li>✓ Site 15-20 pages</li>
                      <li>✓ E-commerce basique</li>
                      <li>✓ SEO avancé</li>
                      <li>✓ Support 3 mois</li>
                    </ul>
                    <button className="btn" style={{ width: '100%' }} onClick={() => setCurrentPage('contact')}>Choisir</button>
                  </motion.div>

                  <motion.div className="price-card" variants={itemVariants}>
                    <h3>Entreprise</h3>
                    <p className="price-desc">Projets complexes</p>
                    <div className="price">Devis</div>
                    <ul className="features-list">
                      <li>✓ Tout ce que vous voulez</li>
                      <li>✓ E-commerce complet</li>
                      <li>✓ Application web</li>
                      <li>✓ Support illimité</li>
                    </ul>
                    <button className="btn" style={{ width: '100%' }} onClick={() => setCurrentPage('contact')}>Discuter</button>
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
                  Parlons de votre projet
                </motion.h2>
                <motion.form 
                  className="contact-form"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div className="form-group" variants={itemVariants}>
                    <label>Nom complet</label>
                    <input type="text" placeholder="Jean Dupont" />
                  </motion.div>
                  <motion.div className="form-group" variants={itemVariants}>
                    <label>Email</label>
                    <input type="email" placeholder="vous@email.com" />
                  </motion.div>
                  <motion.div className="form-group" variants={itemVariants}>
                    <label>Décrivez votre projet</label>
                    <textarea placeholder="Parlez-nous de votre vision..."></textarea>
                  </motion.div>
                  <motion.button 
                    type="submit" 
                    className="btn" 
                    style={{ width: '100%' }}
                    variants={itemVariants}
                  >
                    Envoyer
                  </motion.button>
                </motion.form>
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
