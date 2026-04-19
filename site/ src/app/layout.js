import './globals.css'

export const metadata = {
  title: 'JuDev',
  description: 'Portfolio créatif',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head />
      <body>{children}</body>
    </html>
  )
}
