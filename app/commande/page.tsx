"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CommandesService, type Commande } from '@/app/services';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CommandesPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [commandesEnCours, setCommandesEnCours] = useState<Commande[]>([]);
  const [historiqueCommandes, setHistoriqueCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rediriger vers login si non authentifié
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCommandes();
    }
  }, [isAuthenticated]);

  const loadCommandes = async () => {
    try {
      setError(null);
      console.log('[Commandes] Début du chargement des commandes...');
      const data = await CommandesService.getCommandes();
      console.log('[Commandes] Données reçues:', data);

      // Vérifier si les données existent et sont bien structurées
      if (data && typeof data === 'object') {
        setCommandesEnCours(data.commandes_en_cours || []);
        setHistoriqueCommandes(data.historique_commandes || []);
        console.log('[Commandes] Commandes en cours:', data.commandes_en_cours?.length || 0);
        console.log('[Commandes] Historique:', data.historique_commandes?.length || 0);
      } else {
        setCommandesEnCours([]);
        setHistoriqueCommandes([]);
      }
    } catch (error: any) {
      console.error('[Commandes] Erreur lors du chargement des commandes:', error);
      console.error('[Commandes] Message d\'erreur:', error.message);

      // Si l'erreur est une erreur d'authentification, rediriger vers login
      if (error.message && error.message.includes('session a expiré')) {
        router.push('/login?redirect=/commande');
        return;
      }

      setError(error.message || 'Impossible de charger les commandes');
      setCommandesEnCours([]);
      setHistoriqueCommandes([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      'en_attente': { label: 'En attente', color: theme.colors.warning },
      'en_cours': { label: 'En cours', color: theme.colors.primary },
      'en_livraison': { label: 'En livraison', color: theme.colors.secondary },
      'terminee': { label: 'Terminée', color: theme.colors.success },
      'annulee': { label: 'Annulée', color: theme.colors.error },
    };
    return badges[statut as keyof typeof badges] || { label: statut, color: theme.colors.text };
  };

  // Afficher un loader pendant la vérification d'authentification
  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderLeftColor: theme.colors.primary, borderRightColor: theme.colors.primary, borderBottomColor: theme.colors.primary, borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  // Ne pas afficher le contenu si non authentifié (en cours de redirection)
  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="mb-4 text-6xl">⚠️</div>
          <p className="text-xl mb-4" style={{ color: theme.colors.error }}>{error}</p>
          <button onClick={loadCommandes} className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>Réessayer</button>
        </div>
      </div>
    );
  }

  const toutesCommandes = [...commandesEnCours, ...historiqueCommandes];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8" style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}>📦 Mes Commandes</h1>

      {toutesCommandes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 text-6xl">📦</div>
          <p className="text-xl mb-4" style={{ color: theme.colors.textSecondary }}>Vous n avez pas encore passé de commande</p>
          <Link href="/produits" className="inline-block px-6 py-3 rounded-full font-semibold transition-all hover:scale-105" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>Découvrir nos produits</Link>
        </div>
      ) : (
        <>
          {commandesEnCours.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>Commandes en cours</h2>
              <div className="space-y-4">
                {commandesEnCours.map((commande) => {
                  const statutBadge = getStatutBadge(commande.statut);
                  return (
                    <Link key={commande.id} href={`/commande/${commande.id}`} className="block p-6 rounded-lg hover:scale-[1.02] transition-all" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: theme.colors.text }}>Commande #{commande.numero_commande}</h3>
                          <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Passée le {new Date(commande.date_commande).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: statutBadge.color, color: 'white' }}>{statutBadge.label}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Montant total</div>
                          <div className="text-2xl font-bold" style={{ color: theme.colors.primary }}>{parseFloat(commande.montant_total_ttc).toFixed(2)} €</div>
                        </div>

                        {commande.adresse_livraison && (
                          <div>
                            <div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Livraison</div>
                            <div style={{ color: theme.colors.text }}>{commande.adresse_livraison.ville}</div>
                          </div>
                        )}

                        {commande.date_livraison_estimee && (
                          <div>
                            <div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Livraison estimée</div>
                            <div style={{ color: theme.colors.text }}>{new Date(commande.date_livraison_estimee).toLocaleDateString('fr-FR')}</div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 text-sm" style={{ color: theme.colors.textSecondary }}>Cliquez pour voir les détails →</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {historiqueCommandes.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>Historique des commandes</h2>
              <div className="space-y-4">
                {historiqueCommandes.map((commande) => {
                  const statutBadge = getStatutBadge(commande.statut);
                  return (
                    <Link key={commande.id} href={`/commande/${commande.id}`} className="block p-6 rounded-lg hover:scale-[1.02] transition-all" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: theme.colors.text }}>Commande #{commande.numero_commande}</h3>
                          <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Passée le {new Date(commande.date_commande).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: statutBadge.color, color: 'white' }}>{statutBadge.label}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Montant total</div>
                          <div className="text-2xl font-bold" style={{ color: theme.colors.primary }}>{parseFloat(commande.montant_total_ttc).toFixed(2)} €</div>
                        </div>

                        {commande.adresse_livraison && (
                          <div>
                            <div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Livraison</div>
                            <div style={{ color: theme.colors.text }}>{commande.adresse_livraison.ville}</div>
                          </div>
                        )}

                        {commande.date_livraison_estimee && (
                          <div>
                            <div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Livraison estimée</div>
                            <div style={{ color: theme.colors.text }}>{new Date(commande.date_livraison_estimee).toLocaleDateString('fr-FR')}</div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 text-sm" style={{ color: theme.colors.textSecondary }}>Cliquez pour voir les détails →</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
