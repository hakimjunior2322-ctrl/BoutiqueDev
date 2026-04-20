'use client'

import React from 'react'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  html, body { width: 100%; height: 100%; }
  
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
  
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .contact-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
  }
  
  .contact-content {
    text-align: center;
  }
  
  .contact-content h1 {
    font-size: clamp(32px, 8vw, 64px);
    margin-bottom: 20px;
    font-weight: 900;
    color: #fff;
    letter-spacing: -1px;
  }
  
  .contact-content p {
    font-size: 16px;
    color: #ccc;
    margin-bottom: 60px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .contact-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 40px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .contact-card {
    background: rgba(50, 50, 60, 0.2);
    border: 1px solid rgba(255, 107, 157, 0.15);
    padding: 40px 30px;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }
  
  .contact-card:hover {
    border-color: #ff6b9d;
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(255, 107, 157, 0.2);
  }
  
  .contact-icon {
    font-size: 48px;
    margin-bottom: 20px;
    display: block;
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
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    word-break: break-word;
  }
  
  .contact-value a {
    color: #ff6b9d;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .contact-value a:hover {
    text-decoration: underline;
  }
  
  footer {
    border-top: 1px solid rgba(255, 107, 157, 0.1);
    padding: 30px 0;
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-top: 60px;
  }
  
  @media (max-width: 768px) {
    .contact-section {
      padding: 40px 20px;
    }
    
    .contact-content h1 {
      font-size: 36px;
    }
    
    .contact-content p {
      font-size: 14px;
      margin-bottom: 40px;
    }
    
    .contact-info-grid {
      grid-template-columns: 1fr;
      gap: 25px;
    }
    
    .contact-card {
      padding: 30px 20px;
    }
    
    .contact-icon {
      font-size: 40px;
      margin-bottom: 15px;
    }
    
    .contact-value {
      font-size: 16px;
    }
  }
`

export default function ContactPage() {
  // Charge Vanta au mount
  React.useEffect(() => {
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

  return (
    <>
      <style>{STYLES}</style>
      <div id="vanta-bg"></div>
      
      <div className="wrapper">
        <div className="contact-section">
          <div className="container">
            <div className="contact-content">
              <h1>Contactez-nous</h1>
              <p>Nous sommes là pour répondre à vos questions et discuter de vos projets</p>
              
              <div className="contact-info-grid">
                {/* EMAIL */}
                <div className="contact-card">
                  <span className="contact-icon">📧</span>
                  <div className="contact-label">Email</div>
                  <div className="contact-value">
                    <a href="mailto:contact@judev.store">contact@judev.store</a>
                  </div>
                </div>
                
                {/* TÉLÉPHONE */}
                <div className="contact-card">
                  <span className="contact-icon">📱</span>
                  <div className="contact-label">Téléphone</div>
                  <div className="contact-value">
                    <a href="tel:+33612345678">+33 6 12 34 56 78</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <footer>
          <div className="container">
            <p>© 2026 JuDev — Design créatif et innovant ✨</p>
          </div>
        </footer>
      </div>
    </>
  )
