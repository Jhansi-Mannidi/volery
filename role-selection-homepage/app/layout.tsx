import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeContextProvider } from '@/lib/theme-context'
import { AuthProvider } from '@/lib/auth-context'
import { AppChrome } from '@/components/dashboard/app-chrome'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: 'Volery',
  description: 'Syndication management platform for deal flow, startup tracking, and investor relationships',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var preset = localStorage.getItem('volery-color-preset');
                  var presets = ['default','red','orange','yellow','green','violet','rose','blue','purple'];
                  if (preset && presets.indexOf(preset) !== -1) {
                    document.documentElement.setAttribute('data-color-preset', preset);
                  } else {
                    document.documentElement.setAttribute('data-color-preset', 'blue');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="theme"
        >
          <ThemeContextProvider>
            <AuthProvider>
              <AppChrome>{children}</AppChrome>
            </AuthProvider>
          </ThemeContextProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
