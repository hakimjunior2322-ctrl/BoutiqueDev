import './globals.css'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: 'yes',
}

export const metadata = {
  title: 'JuDev - Portfolio Créatif',
  description: 'Des sites web modernes et performants avec un design créatif. Nous transformons vos idées en expériences numériques inoubliables.',
  
  // Open Graph (pour les réseaux sociaux)
  openGraph: {
    title: 'JuDev - Agence Web Créative',
    description: 'Création de sites web modernes et performants. Design créatif et innovation.',
    url: 'https://judev.store',
    siteName: 'JuDev',
    images: [
      {
        url: 'https://i.imgur.com/fXJwB5B.jpeg', // Ton image imgur ou autre
        width: 1200,
        height: 630,
      }
    ],
    type: 'website',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'JuDev - Agence Web Créative',
    description: 'Création de sites web modernes et performants.',
    images: ['https://i.imgur.com/fXJwB5B.jpeg'], // Même image
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
