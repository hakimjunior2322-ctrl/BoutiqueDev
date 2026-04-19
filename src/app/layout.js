import './globals.css'

export const metadata = {
  title: 'JuDev',
  description: 'Portfolio créatif',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
