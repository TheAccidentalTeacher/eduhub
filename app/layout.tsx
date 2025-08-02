import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata = {
  title: 'EduCraft - AI Worksheet Generator',
  description: 'Generate customized educational worksheets with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-inter">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
