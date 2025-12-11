"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CommandesService, type Commande, type LigneCommande } from '@/app/services';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CommandeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const commandeId = params?.id as string;

  // Rediriger vers login si non authentifié
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && commandeId) {
      loadCommande();
    }
  }, [isAuthenticated, commandeId]);

  const loadCommande = async () => {
    try {
      setError(null);
      const data = await CommandesService.getCommandeDetail(parseInt(commandeId));
      setCommande(data);
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error);
      setError('Impossible de charger les détails de la commande');
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  // Ne pas afficher le contenu si non authentifié (en cours de redirection)
  if (!isAuthenticated) {
    return null;
  }

  if (error || !commande) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="mb-4 text-6xl">⚠️</div>
          <p className="text-xl mb-4" style={{ color: theme.colors.error }}>{error || 'Commande non trouvée'}</p>
          <Link href="/commande" className="inline-block px-6 py-3 rounded-full font-semibold transition-all hover:scale-105" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
            Retour aux commandes
          </Link>
        </div>
      </div>
    );
  }

  const statutBadge = getStatutBadge(commande.statut);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm" style={{ color: theme.colors.textSecondary }}>
        <Link href="/" className="hover:underline">Accueil</Link><span>/</span>
        <Link href="/commande" className="hover:underline">Mes commandes</Link><span>/</span>
        <span style={{ color: theme.colors.text }}>#{commande.numero_commande}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold" style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}>
            Commande #{commande.numero_commande}
          </h1>
          <span className="px-6 py-3 rounded-full text-lg font-semibold" style={{ backgroundColor: statutBadge.color, color: 'white' }}>
            {statutBadge.label}
          </span>
        </div>
        <p style={{ color: theme.colors.textSecondary }}>
          Passée le {new Date(commande.date_commande).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à {new Date(commande.date_commande).toLocaleTimeString('fr-FR')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Détails de la commande */}
        <div className="lg:col-span-2 space-y-6">
          {/* Produits */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary }}>Produits commandés</h2>
            
            <div className="space-y-4">
              {commande.lignes?.map((ligne: LigneCommande) => (
                <div key={ligne.id} className="flex gap-4 pb-4" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
                  <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0" style={{ backgroundColor: theme.colors.background }}>
                    {ligne.produit_image ? (
                      <img src={ligne.produit_image} alt={ligne.produit_nom} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold mb-1" style={{ color: theme.colors.text }}>{ligne.produit_nom}</h3>
                    <p className="text-sm mb-2" style={{ color: theme.colors.textSecondary }}>
                      Prix unitaire: {parseFloat(ligne.prix_unitaire_ttc).toFixed(2)} € × {ligne.quantite}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold" style={{ color: theme.colors.primary }}>
                      {parseFloat(ligne.sous_total_ttc).toFixed(2)} €
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adresse de livraison */}
            {commande.adresse_livraison && (
              <div className="p-6 rounded-lg" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: theme.colors.primary }}>
                  📍 Adresse de livraison
                </h3>
                <div style={{ color: theme.colors.text }}>
                  <p>{commande.adresse_livraison.rue}</p>
                  {commande.adresse_livraison.complement && <p>{commande.adresse_livraison.complement}</p>}
                  <p>{commande.adresse_livraison.code_postal} {commande.adresse_livraison.ville}</p>
                  {commande.adresse_livraison.pays && <p>{commande.adresse_livraison.pays}</p>}
                </div>
              </div>
            )}

            {/* Adresse de facturation */}
            {commande.adresse_facturation && (
              <div className="p-6 rounded-lg" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: theme.colors.primary }}>
                  📄 Adresse de facturation
                </h3>
                <div style={{ color: theme.colors.text }}>
                  <p>{commande.adresse_facturation.rue}</p>
                  {commande.adresse_facturation.complement && <p>{commande.adresse_facturation.complement}</p>}
                  <p>{commande.adresse_facturation.code_postal} {commande.adresse_facturation.ville}</p>
                  {commande.adresse_facturation.pays && <p>{commande.adresse_facturation.pays}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Informations de livraison */}
          {commande.date_livraison_estimee && (
            <div className="p-6 rounded-lg" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
              <h3 className="text-lg font-bold mb-3" style={{ color: theme.colors.primary }}>🚚 Informations de livraison</h3>
              <div style={{ color: theme.colors.text }}>
                <p>Date de livraison estimée : <strong>{new Date(commande.date_livraison_estimee).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
                {commande.date_livraison_reelle && (
                  <p className="mt-2">Date de livraison réelle : <strong>{new Date(commande.date_livraison_reelle).toLocaleDateString('fr-FR')}</strong></p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Récapitulatif */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-lg sticky top-4" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.primary }}>Récapitulatif</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span style={{ color: theme.colors.textSecondary }}>Sous-total HT</span>
                <span style={{ color: theme.colors.text }}>{parseFloat(commande.montant_total_ht || '0').toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.colors.textSecondary }}>TVA</span>
                <span style={{ color: theme.colors.text }}>{parseFloat(commande.montant_total_tva || '0').toFixed(2)} €</span>
              </div>
              {commande.frais_livraison && parseFloat(commande.frais_livraison) > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.textSecondary }}>Frais de livraison</span>
                  <span style={{ color: theme.colors.text }}>{parseFloat(commande.frais_livraison).toFixed(2)} €</span>
                </div>
              )}
              {commande.reduction && parseFloat(commande.reduction) > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.success }}>Réduction</span>
                  <span style={{ color: theme.colors.success }}>-{parseFloat(commande.reduction).toFixed(2)} €</span>
                </div>
              )}
              <div className="h-px" style={{ backgroundColor: theme.colors.border }} />
              <div className="flex justify-between text-2xl font-bold">
                <span style={{ color: theme.colors.text }}>Total TTC</span>
                <span style={{ color: theme.colors.primary }}>{parseFloat(commande.montant_total_ttc).toFixed(2)} €</span>
              </div>
            </div>

            {commande.mode_paiement && (
              <div className="mb-6 p-4 rounded" style={{ backgroundColor: theme.colors.background }}>
                <div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Mode de paiement</div>
                <div style={{ color: theme.colors.text }}>{commande.mode_paiement}</div>
              </div>
            )}

            {commande.notes && (
              <div className="mb-6">
                <div className="text-sm font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>Notes</div>
                <p className="text-sm p-3 rounded" style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
                  {commande.notes}
                </p>
              </div>
            )}

            <Link href="/commande" className="block w-full py-3 text-center rounded-lg font-semibold transition-all hover:scale-105" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
              ← Retour aux commandes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
