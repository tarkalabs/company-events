import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

// Metadata needs to be in a separate server component
export const metadata: Metadata = {
  title: 'Company Events',
  description: 'Event feedback application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
