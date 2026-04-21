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
    width: 100%;
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

  .form-container {
    max-width: 500px;
    margin: 0 auto;
    background: rgba(50, 50, 60, 0.2);
    border: 1px solid rgba(255, 107, 157, 0.15);
    padding: 40px 30px;
    border-radius: 16px;
    backdrop-filter: blur(10px);
  }

  .form-group {
    margin-bottom: 20px;
    text-align: left;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 14px;
    color: #fff;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ff6b9d;
    background: rgba(50, 50, 60, 0.5);
    color: #fff;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: all 0.3s;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #ff6b9d;
    box-shadow: 0 0 10px rgba(255, 107, 157, 0.3);
    background: rgba(50, 50, 60, 0.8);
  }

  .form-group input::placeholder {
    color: #999;
  }

  .btn {
    width: 100%;
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
    margin-top: 10px;
  }

  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 107, 157, 0.3);
  }

  .btn:focus {
    outline: 2px solid #ff6b9d;
    outline-offset: 2px;
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

    .form-container {
      padding: 30px 20px;
    }

    .btn {
      padding: 11px 20px;
      font-size: 12px;
    }
  }
`

export default function DevisPage() {
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Demande envoyée! Nous vous contacterons bientôt.')
        e.target.reset()
      } else {
        alert('Erreur: ' + (result.error || 'Une erreur est survenue'))
      }
    } catch (error) {
      alert('Erreur: ' + error.message)
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div id="vanta-bg"></div>
      
      <div className="wrapper">
        <div className="contact-section">
          <div className="container">
            <div className="contact-content">
              <h1>Demande de Devis</h1>
              <p>Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement</p>
              
              <div className="form-container">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nom</label>
                    <input type="text" name="nom" required placeholder="Votre nom" />
                  </div>

                  <div className="form-group">
                    <label>Prénom</label>
                    <input type="text" name="prenom" required placeholder="Votre prénom" />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" required placeholder="Votre email" />
                  </div>

                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" name="telephone" required placeholder="+33 6 12 34 56 78" />
                  </div>

                  <div className="form-group">
                    <label>Offre intéressée</label>
                    <select name="offre" required>
                      <option>Offre Essentiel (200€)</option>
                      <option>Offre Professionnel (500€)</option>
                      <option>Offre Entreprise (Devis)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn">
                    Envoyer ma demande
                  </button>
                </form>
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
}
