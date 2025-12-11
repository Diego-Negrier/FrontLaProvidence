"use client";

import { useEffect, useState } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { getContrastColor } from '@/app/utils/colorUtils';
import { FournisseursService } from '@/app/services';
import type { Fournisseur } from '@/app/services/types';

export default function FournisseursPage() {
  const { theme } = useTheme();
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFournisseurs();
  }, []);

  const loadFournisseurs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FournisseursService.getFournisseurs();
      setFournisseurs(data);
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error);
      setError('Impossible de charger les fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  const filteredFournisseurs = fournisseurs.filter(f =>
    f.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.ville?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.metier?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent" style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }} />
          <p className="mt-4 text-lg" style={{ color: theme.colors.textSecondary }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header moderne avec espacement généreux */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-6 p-4 rounded-2xl" style={{ backgroundColor: theme.colors.primary + '10' }}>
            <span className="text-5xl">👨‍🌾</span>
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{
              color: theme.colors.text,
              fontFamily: theme.fonts.heading,
              letterSpacing: '-0.02em'
            }}
          >
            Nos Fournisseurs
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: theme.colors.textSecondary, lineHeight: '1.6' }}>
            Découvrez les artisans et producteurs locaux qui font la qualité de nos produits
          </p>
        </div>

        {/* Barre de recherche minimaliste */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un fournisseur, une ville, un métier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl text-lg transition-all focus:outline-none focus:ring-2"
              style={{
                backgroundColor: theme.colors.surface,
                border: `2px solid ${theme.colors.border}`,
                color: theme.colors.text,
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
              }}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Contenu */}
        {error ? (
          <div className="text-center py-20">
            <div className="mb-6 text-6xl">⚠️</div>
            <p className="text-2xl mb-8" style={{ color: theme.colors.error }}>{error}</p>
            <button
              onClick={loadFournisseurs}
              className="px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: theme.colors.primary,
                color: getContrastColor(theme.colors.primary),
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Réessayer
            </button>
          </div>
        ) : filteredFournisseurs.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6 text-7xl">👨‍🌾</div>
            <p className="text-2xl" style={{ color: theme.colors.textSecondary }}>
              {searchQuery ? `Aucun fournisseur trouvé pour "${searchQuery}"` : 'Aucun fournisseur disponible'}
            </p>
          </div>
        ) : (
          <>
            {/* Nombre de résultats */}
            <div className="mb-8 text-center">
              <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
                {filteredFournisseurs.length} fournisseur{filteredFournisseurs.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Grille de fournisseurs - design minimaliste */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFournisseurs.map((fournisseur) => (
                <div
                  key={fournisseur.pk}
                  className="group p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* En-tête minimaliste */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: theme.colors.primary + '15' }}
                      >
                        {fournisseur.metier?.toLowerCase().includes('agriculteur') ? '🌾' :
                         fournisseur.metier?.toLowerCase().includes('boulanger') ? '🥖' :
                         fournisseur.metier?.toLowerCase().includes('fromager') ? '🧀' :
                         fournisseur.metier?.toLowerCase().includes('viticulteur') ? '🍷' :
                         fournisseur.metier?.toLowerCase().includes('maraîcher') || fournisseur.metier?.toLowerCase().includes('maraicher') ? '🥕' :
                         '👨‍🌾'}
                      </div>
                      <h3
                        className="text-2xl font-bold flex-1"
                        style={{
                          color: theme.colors.text,
                          fontFamily: theme.fonts.heading
                        }}
                      >
                        {fournisseur.nom}
                      </h3>
                    </div>

                    {fournisseur.metier && (
                      <p
                        className="text-sm font-medium px-3 py-1.5 rounded-lg inline-block"
                        style={{
                          backgroundColor: theme.colors.primary + '10',
                          color: theme.colors.primary
                        }}
                      >
                        {fournisseur.metier}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  {fournisseur.description && (
                    <p
                      className="mb-6 text-sm leading-relaxed line-clamp-3"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {fournisseur.description}
                    </p>
                  )}

                  {/* Informations de contact - style minimaliste */}
                  <div className="space-y-3">
                    {fournisseur.ville && (
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📍</span>
                        <span className="text-sm" style={{ color: theme.colors.text }}>
                          {fournisseur.ville}{fournisseur.code_postal && ` ${fournisseur.code_postal}`}
                        </span>
                      </div>
                    )}

                    {fournisseur.telephone && (
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📞</span>
                        <a
                          href={`tel:${fournisseur.telephone}`}
                          className="text-sm hover:underline transition-all"
                          style={{ color: theme.colors.primary }}
                        >
                          {fournisseur.telephone}
                        </a>
                      </div>
                    )}

                    {fournisseur.email && (
                      <div className="flex items-center gap-3">
                        <span className="text-lg">✉️</span>
                        <a
                          href={`mailto:${fournisseur.email}`}
                          className="text-sm hover:underline transition-all truncate"
                          style={{ color: theme.colors.primary }}
                        >
                          {fournisseur.email}
                        </a>
                      </div>
                    )}

                    {fournisseur.site_web && (
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🌐</span>
                        <a
                          href={`https://${fournisseur.site_web.replace(/^https?:\/\//, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline transition-all truncate"
                          style={{ color: theme.colors.primary }}
                        >
                          Visiter le site
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
