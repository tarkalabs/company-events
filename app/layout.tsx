import './globals.css'
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google';
import ClientLayout from './components/ClientLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

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
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  )
}
