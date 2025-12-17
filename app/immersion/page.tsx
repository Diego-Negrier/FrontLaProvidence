"use client";

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/app/contexts/ThemeContext';
import CategorieModal from '@/app/components/Village3D/CategorieModal';
import { FaExpand, FaCompress, FaArrowLeft, FaInfo, FaWalking, FaEye } from 'react-icons/fa';
import Link from 'next/link';

// Charger le composant 3D propre (uniquement Blender)
const Scene3D = dynamic(() => import('@/app/components/Village3D/Scene3DClean'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
        style={{ borderColor: '#8B6F47', borderTopColor: 'transparent' }}
      />
      <p style={{ fontSize: '1.2rem', color: '#8B6F47' }}>
        Chargement du village 3D...
      </p>
    </div>
  )
});

export default function ImmersionPage() {
  const { theme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState<{ id: number; nom: string } | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [visitMode, setVisitMode] = useState<'orbit' | 'walk'>('orbit');

  // Gérer le plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Écouter les changements de plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Masquer les instructions après quelques secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleFournisseurClick = (id: number, nom: string) => {
    setSelectedFournisseur({ id, nom });
    setShowModal(true);
  };

  const toggleVisitMode = () => {
    setVisitMode(prev => prev === 'orbit' ? 'walk' : 'orbit');
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: theme.colors.background
    }}>
      {/* Barre d'outils */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        gap: '1rem',
        backgroundColor: theme.colors.cardBg + 'dd',
        padding: '0.75rem 1.5rem',
        borderRadius: '50px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        border: `2px solid ${theme.colors.border}`
      }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '25px',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text,
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = theme.colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.colors.text;
            e.currentTarget.style.borderColor = theme.colors.border;
          }}
        >
          <FaArrowLeft />
          Retour
        </Link>

        <button
          onClick={toggleVisitMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '25px',
            backgroundColor: visitMode === 'walk' ? theme.colors.success + '20' : 'transparent',
            border: `1px solid ${visitMode === 'walk' ? theme.colors.success : theme.colors.border}`,
            color: visitMode === 'walk' ? theme.colors.success : theme.colors.text,
            fontWeight: '500',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.success;
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = theme.colors.success;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = visitMode === 'walk' ? theme.colors.success + '20' : 'transparent';
            e.currentTarget.style.color = visitMode === 'walk' ? theme.colors.success : theme.colors.text;
            e.currentTarget.style.borderColor = visitMode === 'walk' ? theme.colors.success : theme.colors.border;
          }}
        >
          {visitMode === 'walk' ? <FaEye /> : <FaWalking />}
          {visitMode === 'walk' ? 'Vue aérienne' : 'Visiter'}
        </button>

        <button
          onClick={() => setShowInstructions(!showInstructions)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '25px',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text,
            fontWeight: '500',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.secondary;
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = theme.colors.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.colors.text;
            e.currentTarget.style.borderColor = theme.colors.border;
          }}
        >
          <FaInfo />
          Aide
        </button>

        <button
          onClick={toggleFullscreen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '25px',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.border}`,
            color: theme.colors.text,
            fontWeight: '500',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = theme.colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.colors.text;
            e.currentTarget.style.borderColor = theme.colors.border;
          }}
        >
          {isFullscreen ? <FaCompress /> : <FaExpand />}
          {isFullscreen ? 'Quitter' : 'Plein écran'}
        </button>
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          backgroundColor: theme.colors.cardBg + 'f0',
          padding: '1.5rem 2rem',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          border: `2px solid ${theme.colors.primary}`,
          maxWidth: '700px',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-in'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: theme.colors.primary,
            marginBottom: '1rem',
            fontFamily: theme.fonts.heading
          }}>
            Bienvenue dans le Village 3D
          </h3>

          {visitMode === 'orbit' ? (
            <div style={{
              color: theme.colors.text,
              fontSize: '0.95rem',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <p><strong>Mode Vue Aérienne</strong></p>
              <p>🖱️ <strong>Souris</strong>: Cliquez et glissez pour pivoter</p>
              <p>🔍 <strong>Molette</strong>: Zoomer / Dézoomer</p>
              <p>👆 <strong>Clic sur un stand/camion</strong>: Voir les produits</p>
              <p>🚶 <strong>Bouton "Visiter"</strong>: Passez en mode promenade!</p>
            </div>
          ) : (
            <div style={{
              color: theme.colors.text,
              fontSize: '0.95rem',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <p><strong>Mode Promenade - Première Personne</strong></p>
              <p>🖱️ <strong>Clic dans l'écran</strong>: Activer les contrôles</p>
              <p>⌨️ <strong>Z/S ou ↑/↓</strong>: Avancer / Reculer</p>
              <p>⌨️ <strong>Q/D ou ←/→</strong>: Gauche / Droite</p>
              <p>🖱️ <strong>Souris</strong>: Regarder autour</p>
              <p>⌨️ <strong>Espace/Shift</strong>: Monter / Descendre</p>
              <p>👆 <strong>Clic sur stand/camion</strong>: Voir produits</p>
            </div>
          )}

          <button
            onClick={() => setShowInstructions(false)}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              borderRadius: '25px',
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 4px 15px ${theme.colors.primary}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            J'ai compris
          </button>
        </div>
      )}

      {/* Indicateur mode visite */}
      {visitMode === 'walk' && (
        <div style={{
          position: 'absolute',
          top: '6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99,
          backgroundColor: theme.colors.success + 'dd',
          padding: '0.5rem 1.5rem',
          borderRadius: '25px',
          color: 'white',
          fontWeight: '600',
          fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(5px)'
        }}>
          🚶 Mode Promenade - Cliquez pour activer les contrôles
        </div>
      )}

      {/* Scène 3D */}
      <Suspense fallback={
        <div style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
            style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }}
          />
        </div>
      }>
        <Scene3D onFournisseurClick={handleFournisseurClick} visitMode={visitMode} />
      </Suspense>

      {/* Modal Catégorie */}
      {showModal && selectedFournisseur && (
        <CategorieModal
          isOpen={showModal}
          categorieId={selectedFournisseur.id}
          categorieNom={selectedFournisseur.nom}
          onClose={() => {
            setShowModal(false);
            setSelectedFournisseur(null);
          }}
        />
      )}
    </div>
  );
}
