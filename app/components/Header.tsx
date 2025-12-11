"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTheme } from '@/app/contexts/ThemeContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaStore, FaTruck } from 'react-icons/fa';
import { getContrastColor } from '@/app/utils/colorUtils';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme } = useTheme();

  // Écouter les événements d'ajout au panier
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      const newCount = event.detail.count;
      setCartItemsCount(newCount);

      // Déclencher l'animation
      setIsCartAnimating(true);
      setTimeout(() => setIsCartAnimating(false), 600);
    };

    window.addEventListener('cart-updated' as any, handleCartUpdate);

    // Charger le nombre initial d'items depuis localStorage
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        setCartItemsCount(cart.length || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
    }

    return () => {
      window.removeEventListener('cart-updated' as any, handleCartUpdate);
    };
  }, []);

  // Navigation publique (tous les utilisateurs)
  const publicNavLinks = [
    { href: '/', label: 'Accueil', icon: null },
    { href: '/produits', label: 'Magasin', icon: FaStore },
    { href: '/fournisseurs', label: 'Fournisseurs', icon: FaTruck },
  ];

  // Navigation privée (utilisateurs connectés uniquement)
  const privateNavLinks = [
    { href: '/commande', label: 'Mes Commandes', icon: null },
  ];

  // Combiner les liens selon l'authentification
  const navLinks = isAuthenticated
    ? [...publicNavLinks, ...privateNavLinks]
    : publicNavLinks;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: theme.colors.cardBg,
      borderBottom: `2px solid ${theme.colors.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px'
        }}>
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: theme.colors.primary,
              fontFamily: theme.fonts.heading
            }}>
              🏛️ La Providence
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav
            className="hidden md:flex"
            style={{
              alignItems: 'center',
              gap: '2rem'
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontWeight: '600',
                    fontSize: '1rem',
                    color: pathname === link.href ? theme.colors.primary : theme.colors.text,
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: pathname === link.href ? theme.colors.primary + '10' : 'transparent',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.backgroundColor = theme.colors.background;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {Icon && <Icon />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Panier - toujours visible */}
            <Link
              href="/panier"
              style={{
                position: 'relative',
                padding: '0.5rem',
                borderRadius: '50%',
                backgroundColor: pathname === '/panier' ? theme.colors.primary + '20' : 'transparent',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: isCartAnimating ? 'scale(1.3)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!isCartAnimating) {
                  e.currentTarget.style.backgroundColor = theme.colors.primary + '20';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCartAnimating) {
                  if (pathname !== '/panier') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <FaShoppingCart
                style={{
                  fontSize: '1.5rem',
                  color: pathname === '/panier' ? theme.colors.primary : theme.colors.text,
                  transition: 'all 0.3s ease',
                  transform: isCartAnimating ? 'rotate(20deg)' : 'rotate(0deg)',
                }}
              />
              {cartItemsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    backgroundColor: theme.colors.error,
                    color: getContrastColor(theme.colors.error),
                    animation: isCartAnimating ? 'pulse 0.6s ease' : 'none',
                  }}
                >
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Authentification */}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link
                  href="/parametre"
                  style={{
                    padding: '0.5rem',
                    borderRadius: '50%',
                    backgroundColor: pathname === '/parametre' ? theme.colors.primary + '20' : 'transparent',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary + '20';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== '/parametre') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <FaUser style={{
                    fontSize: '1.5rem',
                    color: pathname === '/parametre' ? theme.colors.primary : theme.colors.text
                  }} />
                </Link>
                <button
                  onClick={logout}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    fontWeight: '600',
                    backgroundColor: theme.colors.error,
                    color: getContrastColor(theme.colors.error),
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '0.9rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.error}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '50px',
                  fontWeight: '600',
                  backgroundColor: theme.colors.primary,
                  color: getContrastColor(theme.colors.primary),
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Connexion
              </Link>
            )}

            {/* Menu Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="block md:hidden"
              style={{
                padding: '0.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: theme.colors.text
              }}
            >
              {isMenuOpen ? (
                <FaTimes style={{ fontSize: '1.5rem' }} />
              ) : (
                <FaBars style={{ fontSize: '1.5rem' }} />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <nav
            className="md:hidden"
            style={{
              paddingTop: '1rem',
              paddingBottom: '1rem',
              borderTop: `2px solid ${theme.colors.border}`
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    fontWeight: '600',
                    color: pathname === link.href ? theme.colors.primary : theme.colors.text,
                    backgroundColor: pathname === link.href ? theme.colors.primary + '10' : 'transparent',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.backgroundColor = theme.colors.background;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== link.href) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {Icon && <Icon />}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
