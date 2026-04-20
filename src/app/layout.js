import './globals.css'

export const metadata = {
  title: 'JuDev',
  description: 'Portfolio créatif',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" style={{ overflowY: 'auto' }}>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ overflowY: 'auto', overflowX: 'hidden', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
