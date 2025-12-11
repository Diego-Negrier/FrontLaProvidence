"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommandesService } from '../services';
import { useTheme } from '@/app/contexts/ThemeContext';
import { getContrastColor } from '@/app/utils/colorUtils';
import type { Commande } from '@/app/services/types';

const CommandesPage: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      const data = await CommandesService.getCommandes();
      const toutesCommandes = [
        ...(data.commandes_en_cours || []),
        ...(data.historique_commandes || [])
      ];
      setCommandes(toutesCommandes);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des commandes:', err);
      setError(err.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatutInfo = (statut: string) => {
    const statutMap: { [key: string]: { label: string; icon: string; color: string } } = {
      'en_attente': { label: 'En attente', icon: '⏳', color: theme.colors.warning },
      'en_preparation': { label: 'En préparation', icon: '📦', color: '#2196F3' },
      'en_cours': { label: 'En cours', icon: '🔄', color: '#2196F3' },
      'en_livraison': { label: 'En livraison', icon: '🚚', color: '#FF9800' },
      'livree': { label: 'Livrée', icon: '✅', color: theme.colors.success },
      'terminee': { label: 'Terminée', icon: '✅', color: theme.colors.success },
      'annulee': { label: 'Annulée', icon: '❌', color: theme.colors.error },
    };
    return statutMap[statut] || { label: statut, icon: '📋', color: theme.colors.textSecondary };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-transparent" style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }} />
          <p className="mt-4 text-lg" style={{ color: theme.colors.textSecondary }}>Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.colors.background }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6 text-6xl">⚠️</div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>Erreur</h2>
          <p className="mb-8" style={{ color: theme.colors.textSecondary }}>{error}</p>
          <button
            onClick={() => router.push('/produits')}
            className="px-8 py-4 rounded-2xl font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: theme.colors.primary,
              color: getContrastColor(theme.colors.primary)
            }}
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header moderne */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-6 p-4 rounded-2xl" style={{ backgroundColor: theme.colors.primary + '10' }}>
            <span className="text-5xl">📦</span>
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{
              color: theme.colors.text,
              fontFamily: theme.fonts.heading,
              letterSpacing: '-0.02em'
            }}
          >
            Mes Commandes
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: theme.colors.textSecondary, lineHeight: '1.6' }}>
            Retrouvez l'historique et le suivi de toutes vos commandes
          </p>
        </div>

        {/* Liste des commandes */}
        {commandes.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6 text-7xl">🛒</div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: theme.colors.text }}>Aucune commande</h2>
            <p className="text-xl mb-8" style={{ color: theme.colors.textSecondary }}>
              Vous n'avez pas encore passé de commande
            </p>
            <button
              onClick={() => router.push('/produits')}
              className="px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: theme.colors.primary,
                color: getContrastColor(theme.colors.primary),
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <>
            {/* Nombre de commandes */}
            <div className="mb-8 text-center">
              <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
                {commandes.length} commande{commandes.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Grille de commandes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {commandes.map((commande) => {
                const statutInfo = getStatutInfo(commande.statut);
                return (
                  <div
                    key={commande.pk || commande.id}
                    className="p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    style={{
                      backgroundColor: theme.colors.cardBg,
                      border: `1px solid ${theme.colors.border}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                    onClick={() => router.push(`/commande/${commande.id || commande.pk}`)}
                  >
                    {/* Header de la carte */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3
                          className="text-2xl font-bold mb-2"
                          style={{
                            color: theme.colors.text,
                            fontFamily: theme.fonts.heading
                          }}
                        >
                          #{commande.numero_commande}
                        </h3>
                        <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                          {new Date(commande.date_commande).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Badge statut */}
                      <div
                        className="px-4 py-2 rounded-xl flex items-center gap-2 font-medium"
                        style={{
                          backgroundColor: statutInfo.color + '15',
                          color: statutInfo.color
                        }}
                      >
                        <span className="text-lg">{statutInfo.icon}</span>
                        <span>{statutInfo.label}</span>
                      </div>
                    </div>

                    {/* Date de livraison estimée */}
                    {commande.date_livraison_estimee && (
                      <div className="mb-4 flex items-center gap-2" style={{ color: theme.colors.textSecondary }}>
                        <span className="text-lg">🚚</span>
                        <span className="text-sm">
                          Livraison prévue le {new Date(commande.date_livraison_estimee).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}

                    {/* Séparateur */}
                    <div className="my-6" style={{ borderTop: `1px solid ${theme.colors.border}` }} />

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm mb-1" style={{ color: theme.colors.textSecondary }}>Montant total</p>
                        <p className="text-3xl font-bold" style={{ color: theme.colors.primary }}>
                          {parseFloat(commande.montant_total_ttc).toFixed(2)} €
                        </p>
                      </div>

                      <button
                        className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                        style={{
                          backgroundColor: theme.colors.primary + '15',
                          color: theme.colors.primary
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/commande/${commande.id || commande.pk}`);
                        }}
                      >
                        Voir les détails →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bouton continuer les achats */}
            <div className="text-center">
              <button
                onClick={() => router.push('/produits')}
                className="px-8 py-4 rounded-2xl text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  border: `2px solid ${theme.colors.border}`
                }}
              >
                Continuer mes achats
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommandesPage;
