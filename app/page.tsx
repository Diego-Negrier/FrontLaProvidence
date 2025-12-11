"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ProduitsService,
  CategoriesService,
  FournisseursService,
  type Produit,
  type Categorie,
  type Fournisseur
} from '@/app/services';
import { useTheme } from '@/app/contexts/ThemeContext';
import { FaShoppingCart, FaTruck, FaBoxes, FaChevronRight } from 'react-icons/fa';
import { getContrastColor } from '@/app/utils/colorUtils';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('./components/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-full flex items-center justify-center">Chargement de la carte...</div>
});

export default function HomePage() {
  const { theme } = useTheme();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [produitsNouveautes, setProduitsNouveautes] = useState<Produit[]>([]);
  const [produitsPromos, setProduitsPromos] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [stats, setStats] = useState({
    total_produits: 0,
    total_fournisseurs: 0,
    total_categories: 0,
  });

  useEffect(() => {
    loadData();
    requestGeolocation();
  }, []);

  const requestGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.log('Géolocalisation refusée ou non disponible:', error);
          setLocationPermission('denied');
        }
      );
    } else {
      setLocationPermission('denied');
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [categoriesData, fournisseursData, produitsData] = await Promise.all([
        CategoriesService.getCategories(),
        FournisseursService.getFournisseurs(),
        ProduitsService.getProduits()
      ]);

      setCategories(categoriesData.slice(0, 6)); // Top 6 categories
      setFournisseurs(fournisseursData.slice(0, 12)); // Top 12 fournisseurs

      // TODO: Filter nouveautés and promotions when backend supports it
      // For now, just show recent products
      setProduitsNouveautes(produitsData.slice(0, 6));
      setProduitsPromos(produitsData.slice(6, 12));

      // Calculate stats
      setStats({
        total_produits: produitsData.length,
        total_fournisseurs: fournisseursData.length,
        total_categories: categoriesData.length,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trier les fournisseurs par distance si géolocalisation disponible
  const sortedFournisseurs = userLocation && fournisseurs.length > 0
    ? [...fournisseurs]
        .filter(f => f.latitude && f.longitude)
        .map(f => ({
          ...f,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            parseFloat(f.latitude!),
            parseFloat(f.longitude!)
          )
        }))
        .sort((a, b) => a.distance - b.distance)
    : fournisseurs;

  return (
    <div className="home-luxury">
      <style jsx>{`
        /* Hero Section - Style Luxueux Minimaliste */
        .hero-section {
          position: relative;
          height: 75vh;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }

        .video-background video {
          position: absolute;
          top: 50%;
          left: 50%;
          min-width: 100%;
          min-height: 100%;
          width: auto;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: cover;
          filter: brightness(0.7);
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.65) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: #FFFFFF;
          padding: 3rem 2rem;
          max-width: 900px;
          backdrop-filter: blur(2px);
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 5.5rem);
          font-weight: 300;
          font-family: ${theme.fonts.heading};
          margin-bottom: 1.5rem;
          color: #FFFFFF;
          text-shadow:
            0 2px 10px rgba(0, 0, 0, 0.8),
            0 4px 20px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(255, 255, 255, 0.1);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          animation: fadeInDown 1s ease-out;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 3vw, 1.8rem);
          margin-bottom: 2.5rem;
          color: #FFFFFF;
          text-shadow:
            0 2px 8px rgba(0, 0, 0, 0.9),
            0 4px 16px rgba(0, 0, 0, 0.7);
          font-weight: 300;
          letter-spacing: 0.08em;
          animation: fadeInUp 1s ease-out 0.3s both;
        }

        .hero-ornament {
          font-size: 2.5rem;
          color: #FFFFFF;
          text-shadow:
            0 2px 8px rgba(0, 0, 0, 0.8),
            0 0 30px rgba(255, 255, 255, 0.3);
          animation: pulse 2s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
        }

        .hero-tagline {
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          color: #FFFFFF;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
          margin-top: 2rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          opacity: 0.95;
          animation: fadeInUp 1s ease-out 0.6s both;
        }

        /* Stats Section - Style Luxe Minimaliste */
        .stats-section {
          background: ${theme.colors.background};
          padding: 4rem 2rem;
          position: relative;
        }

        .stats-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            ${theme.colors.border} 50%,
            transparent 100%
          );
        }

        /* Shortcuts Section - Minimaliste */
        .shortcuts-section {
          background: ${theme.colors.background};
          padding: 2.5rem 2rem;
        }

        .shortcuts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .shortcut-card {
          background: ${theme.colors.cardBg};
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.borderRadius.lg};
          padding: 1.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .shortcut-card:hover {
          transform: translateY(-4px);
          border-color: ${theme.colors.primary};
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
          box-shadow: ${theme.shadows.lg};
        }

        .shortcut-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .shortcut-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: ${theme.borderRadius.md};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .shortcut-card:hover .shortcut-icon-wrapper {
          transform: scale(1.05);
        }

        .shortcut-icon {
          font-size: 1.5rem;
        }

        .shortcut-title {
          font-size: 1.125rem;
          font-weight: 600;
          font-family: ${theme.fonts.heading};
          color: ${theme.colors.text};
        }

        .shortcut-stat {
          display: inline-flex;
          align-items: baseline;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: ${theme.colors.textSecondary};
        }

        .shortcut-stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: ${theme.colors.primary};
        }
          letter-spacing: 0.5px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .stat-card {
          text-align: center;
          padding: 2.5rem 2rem;
          background: ${theme.colors.cardBg};
          border-radius: ${theme.borderRadius.lg};
          border: 1px solid ${theme.colors.border};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary});
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
          border-color: ${theme.colors.primary};
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-number {
          font-size: 3.5rem;
          font-weight: 200;
          color: ${theme.colors.primary};
          margin-bottom: 0.75rem;
          font-family: ${theme.fonts.heading};
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.85rem;
          color: ${theme.colors.textSecondary};
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 500;
        }

        /* Categories Section - Minimaliste */
        .categories-section {
          padding: 3rem 2rem;
          background: ${theme.colors.surface};
        }

        .section-title {
          text-align: center;
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 400;
          font-family: ${theme.fonts.heading};
          color: ${theme.colors.text};
          margin-bottom: 2.5rem;
          letter-spacing: 0.02em;
        }

        .section-subtitle {
          text-align: center;
          font-size: 0.875rem;
          color: ${theme.colors.textSecondary};
          margin-top: -1.5rem;
          margin-bottom: 2.5rem;
          font-weight: 300;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.25rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .category-card {
          background: ${theme.colors.cardBg};
          border-radius: ${theme.borderRadius.lg};
          padding: 1.5rem;
          transition: all 0.3s ease;
          border: 1px solid ${theme.colors.border};
          cursor: pointer;
          text-decoration: none;
          display: block;
        }

        .category-card:hover {
          transform: translateY(-4px);
          border-color: ${theme.colors.primary};
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
        }

        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .category-name {
          font-size: 1.125rem;
          font-weight: 600;
          font-family: ${theme.fonts.heading};
          color: ${theme.colors.text};
        }

        .category-count {
          font-size: 0.875rem;
          font-weight: 600;
          color: ${theme.colors.primary};
        }

        .subcategory-item {
          list-style: none;
          padding: 0.5rem 0;
          color: ${theme.colors.text};
          position: relative;
        }

        .subcategory-item::before {
          content: '◆';
          position: absolute;
          left: -1.5rem;
          color: ${theme.colors.accent};
          font-size: 0.75rem;
        }

        .explore-btn {
          margin-top: 1.5rem;
          width: 100%;
          padding: 0.75rem 1.5rem;
          background: ${theme.colors.primary};
          border: none;
          border-radius: ${theme.borderRadius.md};
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .explore-btn:hover {
          background: ${theme.colors.secondary};
          transform: scale(1.02);
        }

        /* Fournisseurs Section */
        .fournisseurs-section {
          padding: 4rem 2rem;
          background: ${theme.colors.background};
        }

        .map-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          min-height: 500px;
        }

        .fournisseurs-list {
          background: ${theme.colors.cardBg};
          border-radius: ${theme.borderRadius.lg};
          padding: 1.5rem;
          overflow-y: auto;
          max-height: 500px;
        }

        .fournisseur-item {
          padding: 1.25rem;
          border-bottom: 1px solid ${theme.colors.border};
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .fournisseur-item:hover {
          background: ${theme.colors.hover};
          padding-left: 1.5rem;
        }

        .fournisseur-item:last-child {
          border-bottom: none;
        }

        .fournisseur-name {
          font-weight: 600;
          color: ${theme.colors.primary};
          margin-bottom: 0.5rem;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .fournisseur-info {
          font-size: 0.875rem;
          color: ${theme.colors.textSecondary};
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .distance-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.6rem;
          background: ${theme.colors.success + '20'};
          color: ${theme.colors.success};
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid ${theme.colors.success + '40'};
        }

        .location-icon {
          font-size: 0.7rem;
        }

        .map-wrapper {
          background: ${theme.colors.cardBg};
          border-radius: ${theme.borderRadius.lg};
          overflow: hidden;
          box-shadow: ${theme.shadows.md};
          height: 500px;
        }

        /* Products Section */
        .products-section {
          padding: 4rem 2rem;
          background: ${theme.colors.surface};
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .product-card {
          background: ${theme.colors.cardBg};
          border-radius: ${theme.borderRadius.lg};
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: 1px solid ${theme.colors.border};
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
          border-color: ${theme.colors.primary};
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-image {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-info {
          padding: 1.5rem;
        }

        .product-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: ${theme.colors.text};
          margin-bottom: 0.5rem;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: ${theme.colors.primary};
        }

        .product-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.85rem;
          background: ${theme.colors.success};
          border-radius: ${theme.borderRadius.full};
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(4px);
        }

        .product-badge-promo {
          background: ${theme.colors.error};
        }

        .product-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background: ${theme.colors.background};
        }

        /* CTA Section - Style Luxe Minimaliste */
        .cta-section {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
          color: #FFFFFF;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.1) 100%
          );
          z-index: 0;
        }

        .cta-section > * {
          position: relative;
          z-index: 1;
        }

        .cta-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 300;
          font-family: ${theme.fonts.heading};
          margin-bottom: 1.5rem;
          color: #FFFFFF;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .cta-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          margin-bottom: 3rem;
          color: #FFFFFF;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          font-weight: 300;
          letter-spacing: 0.03em;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-btn {
          padding: 1rem 2.5rem;
          background: #FFFFFF;
          color: ${theme.colors.primary};
          border: 2px solid #FFFFFF;
          border-radius: ${theme.borderRadius.full};
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.4s ease;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        .cta-btn:hover {
          background: transparent;
          color: #FFFFFF;
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }

        .cta-btn-secondary {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.8);
          color: #FFFFFF;
        }

        .cta-btn-secondary:hover {
          background: #FFFFFF;
          color: ${theme.colors.primary};
          border-color: #FFFFFF;
        }

        /* Animations */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .map-container {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 3rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1.125rem;
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 2rem;
          }
        }

        /* Loading Spinner */
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .spinner {
          border: 4px solid ${theme.colors.border};
          border-top: 4px solid ${theme.colors.primary};
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        {/* Video Background */}
        <div className="video-background">
          <video autoPlay muted loop playsInline>
               <source 
      src={`${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/videos/HomeLaProvidence.mp4`}
      type="video/mp4" 
    />
          </video>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-ornament">⚜</div>
          <h1 className="hero-title">La Providence</h1>
          <p className="hero-subtitle">Du terroir à votre table</p>
          <p className="hero-tagline">Artisans · Producteurs Locaux · Savoir-Faire Français</p>

          {/* Stats dans le hero */}
          <div style={{
            display: 'flex',
            gap: '3rem',
            marginTop: '3rem',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div key="stat-produits" style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '300',
                color: '#FFFFFF',
                marginBottom: '0.25rem',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}>
                {stats.total_produits}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.85)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              }}>
                Produits
              </div>
            </div>
            <div key="separator-1" style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent)',
            }} />
            <div key="stat-fournisseurs" style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '300',
                color: '#FFFFFF',
                marginBottom: '0.25rem',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}>
                {stats.total_fournisseurs}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.85)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              }}>
                Producteurs
              </div>
            </div>
            <div key="separator-2" style={{
              width: '1px',
              height: '40px',
              background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent)',
            }} />
            <div key="stat-categories" style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '300',
                color: '#FFFFFF',
                marginBottom: '0.25rem',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}>
                {stats.total_categories}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.85)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
              }}>
                Catégories
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shortcuts Section */}
      <section className="shortcuts-section">
        <div className="shortcuts-grid">
          <Link href="/commande" className="shortcut-card">
            <div className="shortcut-header">
              <div
                className="shortcut-icon-wrapper"
                style={{ backgroundColor: theme.colors.primary + '15' }}
              >
                <FaShoppingCart
                  className="shortcut-icon"
                  style={{ color: theme.colors.primary }}
                />
              </div>
              <h3 className="shortcut-title">Mes Commandes</h3>
            </div>
          </Link>

          <Link href="/fournisseurs" className="shortcut-card">
            <div className="shortcut-header">
              <div
                className="shortcut-icon-wrapper"
                style={{ backgroundColor: theme.colors.secondary + '15' }}
              >
                <FaTruck
                  className="shortcut-icon"
                  style={{ color: theme.colors.secondary }}
                />
              </div>
              <h3 className="shortcut-title">Nos Fournisseurs</h3>
            </div>
            <div className="shortcut-stat">
              <span className="shortcut-stat-value">{stats.total_fournisseurs}</span>
              <span>Producteurs</span>
            </div>
          </Link>

          <Link href="/produits" className="shortcut-card">
            <div className="shortcut-header">
              <div
                className="shortcut-icon-wrapper"
                style={{ backgroundColor: theme.colors.accent + '15' }}
              >
                <FaBoxes
                  className="shortcut-icon"
                  style={{ color: theme.colors.accent }}
                />
              </div>
              <h3 className="shortcut-title">Nos Produits</h3>
            </div>
            <div className="shortcut-stat">
              <span className="shortcut-stat-value">{stats.total_produits}</span>
              <span>Produits · {stats.total_categories} Catégories</span>
            </div>
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* Categories Section */}
          <section className="categories-section">
            <h2 className="section-title">Nos Catégories</h2>
            <div className="categories-grid">
              {categories.map((categorie) => (
                <Link
                  key={categorie.pk}
                  href={`/produits?categorie=${categorie.slug}`}
                  className="category-card"
                >
                  <div className="category-header">
                    <h3 className="category-name">
                      {categorie.nom}
                    </h3>
                    <span className="category-count">
                      {categorie.nb_produits}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Fournisseurs Section */}
          <section className="fournisseurs-section">
            <h2 className="section-title">Nos Producteurs Locaux</h2>
            {userLocation && (
              <p className="section-subtitle">
                📍 Triés par proximité • Votre position détectée
              </p>
            )}
            <div className="map-container">
              <div className="fournisseurs-list">
                {sortedFournisseurs.slice(0, 24).map((fournisseur: any, index: number) => (
                  <div key={fournisseur.pk || fournisseur.id || `fournisseur-${index}`} className="fournisseur-item">
                    <div className="fournisseur-name">
                      <span>{fournisseur.nom}</span>
                      {fournisseur.distance !== undefined && (
                        <span className="distance-badge">
                          📍 {fournisseur.distance < 1
                            ? `${(fournisseur.distance * 1000).toFixed(0)}m`
                            : `${fournisseur.distance.toFixed(1)}km`
                          }
                        </span>
                      )}
                    </div>
                    <div className="fournisseur-info">
                      {[
                        fournisseur.metier && `🎨 ${fournisseur.metier}`,
                        fournisseur.metier && fournisseur.ville && ' ',
                        fournisseur.ville && `• ${fournisseur.ville}`
                      ].filter(Boolean).join('')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="map-wrapper">
                <MapComponent fournisseurs={fournisseurs} />
              </div>
            </div>
          </section>

          {/* Nouveautés Section */}
          {produitsNouveautes.length > 0 && (
            <section className="products-section">
              <h2 className="section-title">Nos Nouveautés</h2>
              <div className="products-grid">
                {produitsNouveautes.map((produit, index) => (
                  <Link key={produit.pk || produit.numero_unique || `nouveau-${index}`} href={`/produit/${produit.numero_unique}`}>
                    <div className="product-card">
                      <div className="product-image-wrapper">
                        <span
                          className="product-badge"
                          style={{ color: getContrastColor(theme.colors.success) }}
                        >
                          ✨ Nouveau
                        </span>
                        {produit.image ? (
                          <img
                            src={produit.image}
                            alt={produit.nom}
                            className="product-image"
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem',
                            color: theme.colors.textSecondary,
                            opacity: 0.3
                          }}>
                            🍽️
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{produit.nom}</h3>
                        <div className="product-price">{produit.ttc?.toFixed(2)} €</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Promotions Section */}
          {produitsPromos.length > 0 && (
            <section className="products-section" style={{background: theme.colors.background}}>
              <h2 className="section-title">Nos Promotions</h2>
              <div className="products-grid">
                {produitsPromos.map((produit) => (
                  <Link key={produit.pk} href={`/produit/${produit.numero_unique}`}>
                    <div className="product-card">
                      <div className="product-image-wrapper">
                        <span
                          className="product-badge product-badge-promo"
                          style={{ color: getContrastColor(theme.colors.error) }}
                        >
                          🏷️ Promo
                        </span>
                        {produit.image ? (
                          <img
                            src={produit.image}
                            alt={produit.nom}
                            className="product-image"
                          />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem',
                            color: theme.colors.textSecondary,
                            opacity: 0.3
                          }}>
                            🍽️
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{produit.nom}</h3>
                        <div className="product-price">{produit.ttc?.toFixed(2)} €</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Commencez votre expérience</h2>
        <p className="cta-subtitle">
          Découvrez nos produits authentiques et soutenez les producteurs locaux
        </p>
        <div className="cta-buttons">
          <Link href="/produits" className="cta-btn">
            Découvrir les produits
          </Link>
          <Link href="/fournisseurs" className="cta-btn cta-btn-secondary">
            Rencontrer les producteurs
          </Link>
        </div>
      </section>
    </div>
  );
}
