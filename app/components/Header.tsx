"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTheme } from '@/app/contexts/ThemeContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaStore, FaTruck, FaHome, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const { isAuthenticated, logout } = useAuth();
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
    { href: '/', label: 'Accueil', icon: FaHome },
    { href: '/produits', label: 'Magasin', icon: FaStore },
    { href: '/fournisseurs', label: 'Fournisseurs', icon: FaTruck },
  ];

  // Navigation privée (utilisateurs connectés uniquement)
  const privateNavLinks = [
    { href: '/commande', label: 'Mes Commandes', icon: FaClipboardList },
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
      borderBottom: `1px solid ${theme.colors.border}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      backdropFilter: 'blur(10px)'
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
          height: '64px',
          gap: '1rem'
        }}>
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{
              fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
              fontWeight: '700',
              color: theme.colors.primary,
              fontFamily: theme.fonts.heading,
              whiteSpace: 'nowrap'
            }}>
              🏛️ La Providence
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav
            className="hidden md:flex"
            style={{
              alignItems: 'center',
              gap: '0.5rem',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontWeight: '500',
                    fontSize: '0.95rem',
                    color: isActive ? theme.colors.primary : theme.colors.text,
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: isActive ? theme.colors.primary + '15' : 'transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = theme.colors.primary + '08';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {Icon && <Icon style={{ fontSize: '1rem' }} />}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0
          }}>
            {/* Panier - toujours visible */}
            <Link
              href="/panier"
              style={{
                position: 'relative',
                padding: '0.5rem',
                borderRadius: '8px',
                backgroundColor: pathname === '/panier' ? theme.colors.primary + '15' : 'transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: isCartAnimating ? 'scale(1.15)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!isCartAnimating) {
                  e.currentTarget.style.backgroundColor = theme.colors.primary + '15';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCartAnimating) {
                  if (pathname !== '/panier') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }
              }}
            >
              <FaShoppingCart
                style={{
                  fontSize: '1.3rem',
                  color: pathname === '/panier' ? theme.colors.primary : theme.colors.text,
                  transition: 'all 0.2s ease',
                }}
              />
              {cartItemsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '18px',
                    height: '18px',
                    padding: '0 4px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    borderRadius: '9px',
                    backgroundColor: theme.colors.error,
                    color: '#fff',
                    border: `2px solid ${theme.colors.cardBg}`,
                  }}
                >
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Authentification */}
            {isAuthenticated ? (
              <>
                <Link
                  href="/parametre"
                  className="hidden sm:flex"
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    backgroundColor: pathname === '/parametre' ? theme.colors.primary + '15' : 'transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary + '15';
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== '/parametre') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <FaUser style={{
                    fontSize: '1.3rem',
                    color: pathname === '/parametre' ? theme.colors.primary : theme.colors.text
                  }} />
                </Link>
                <button
                  onClick={logout}
                  className="hidden sm:flex"
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    backgroundColor: 'transparent',
                    color: theme.colors.error,
                    border: `1px solid ${theme.colors.error}40`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.error;
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = theme.colors.error;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.error;
                    e.currentTarget.style.borderColor = theme.colors.error + '40';
                  }}
                >
                  <FaSignOutAlt />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontWeight: '500',
                  backgroundColor: theme.colors.primary,
                  color: '#fff',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Connexion
              </Link>
            )}

            {/* Menu Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button"
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
              borderTop: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.cardBg
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    fontWeight: '500',
                    fontSize: '0.95rem',
                    color: isActive ? theme.colors.primary : theme.colors.text,
                    backgroundColor: isActive ? theme.colors.primary + '10' : 'transparent',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {Icon && <Icon style={{ fontSize: '1.1rem' }} />}
                  {link.label}
                </Link>
              );
            })}

            {/* Actions mobile */}
            <div style={{
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: `1px solid ${theme.colors.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/parametre"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      fontWeight: '500',
                      fontSize: '0.95rem',
                      color: pathname === '/parametre' ? theme.colors.primary : theme.colors.text,
                      backgroundColor: pathname === '/parametre' ? theme.colors.primary + '10' : 'transparent',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FaUser style={{ fontSize: '1.1rem' }} />
                    Paramètres
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      fontWeight: '500',
                      fontSize: '0.95rem',
                      color: theme.colors.error,
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.colors.error}40`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FaSignOutAlt style={{ fontSize: '1.1rem' }} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    fontWeight: '500',
                    fontSize: '0.95rem',
                    color: '#fff',
                    backgroundColor: theme.colors.primary,
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Connexion
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
