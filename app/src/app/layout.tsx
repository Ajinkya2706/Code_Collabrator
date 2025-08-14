import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalProvider from "@/providers/GlobalProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Code Collab - Real-time Collaborative Coding Platform",
  description: "Collaborate on code in real-time with your team. Features include live editing, video calls, chat, and more.",
  keywords: "collaborative coding, real-time editor, pair programming, remote development, code collaboration",
  authors: [{ name: "Code Collab Team" }],
  creator: "Code Collab",
  publisher: "Code Collab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://code-collab.vercel.app'),
  openGraph: {
    title: "Code Collab - Real-time Collaborative Coding Platform",
    description: "Collaborate on code in real-time with your team. Features include live editing, video calls, chat, and more.",
    url: 'https://code-collab.vercel.app',
    siteName: 'Code Collab',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Code Collab - Collaborative Coding Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Code Collab - Real-time Collaborative Coding Platform",
    description: "Collaborate on code in real-time with your team. Features include live editing, video calls, chat, and more.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* Preload critical images */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        
        {/* Performance optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        
        {/* Resource hints */}
        <link rel="preconnect" href="https://api.code-collab.com" />
        <link rel="dns-prefetch" href="//api.code-collab.com" />
        
        {/* Service Worker for caching */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <GlobalProvider>
            <SocketProvider>
              {children}
              <Toaster 
                position="top-right"
                richColors
                closeButton
                duration={4000}
                toastOptions={{
                  style: {
                    background: 'rgba(0, 0, 0, 0.9)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  },
                }}
              />
            </SocketProvider>
          </GlobalProvider>
        </SessionProvider>
        
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              window.addEventListener('load', function() {
                if ('performance' in window) {
                  const perfData = performance.getEntriesByType('navigation')[0];
                  if (perfData) {
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                    console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
                  }
                }
              });
              
              // Service Worker registration
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
