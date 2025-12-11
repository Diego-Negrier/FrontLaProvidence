"use client";

import './globals.css';

import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { PanierProvider } from './contexts/PanierContext';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const paymentPages = ['/checkout/panier', '/checkout/information', '/checkout/livraison', '/checkout/paiement'];
    const isInPaymentTunnel = paymentPages.includes(pathname ?? '');

    useEffect(() => {
        if (typeof window !== 'undefined') {
          document.body.setAttribute('cz-shortcut-listen', 'true');
        }
      }, []);

    return (
        <html lang="fr">
            <head>
                <title>La Providence</title>
                <meta name="description" content="Boutique en ligne de produits de qualité." />
                <meta property="og:title" content="La Providence" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Merriweather:wght@300;400;700&family=Cinzel:wght@400;700&family=Lora:wght@400;700&family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap"
                rel="stylesheet"
                />
            </head>

            <body className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}>
                <ThemeProvider>
                    <AuthProvider>
                        <PanierProvider>
                            <Header />
                            <main className="flex-1">
                                {children}
                            </main>
                            <Footer />
                        </PanierProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;