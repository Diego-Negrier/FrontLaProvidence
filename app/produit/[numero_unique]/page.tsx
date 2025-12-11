"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProduitsService, PanierService, type Produit } from '@/app/services';
import { useTheme } from '@/app/contexts/ThemeContext';

// Fonction pour vérifier si une URL d'image est valide
const isValidImageUrl = (imageUrl: string | null | undefined): boolean => {
  if (!imageUrl) return false;
  return imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
};

// Fonction pour obtenir l'icône d'un produit (utilise l'icône du backend)
const getProductIcon = (produit: Produit): string => {
  // Utiliser l'icône intelligente calculée par le backend si disponible
  if (produit.icone_produit) {
    return produit.icone_produit;
  }
  // Icône par défaut
  return '📦';
};

export default function ProduitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useTheme();

  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantite, setQuantite] = useState(1);
  const [ajoutPanierLoading, setAjoutPanierLoading] = useState(false);
  const [ajoutPanierSuccess, setAjoutPanierSuccess] = useState(false);

  const numeroUnique = params?.numero_unique as string;

  useEffect(() => {
    if (numeroUnique) {
      loadProduit();
    }
  }, [numeroUnique]);

  const loadProduit = async () => {
    try {
      setError(null);
      const produits = await ProduitsService.getProduits();
      const found = produits.find(p => p.numero_unique === numeroUnique);

      if (found) {
        setProduit(found);
      } else {
        setError('Produit non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du produit:', error);
      setError('Impossible de charger le produit');
    } finally {
      setLoading(false);
    }
  };

  const handleAjouterAuPanier = async () => {
    if (!produit) return;

    try {
      setAjoutPanierLoading(true);
      setAjoutPanierSuccess(false);

      const token = localStorage.getItem('session_token');
      if (!token) {
        router.push('/login');
        return;
      }

      await PanierService.ajouterProduit(produit.id, quantite);
      setAjoutPanierSuccess(true);

      setTimeout(() => {
        setAjoutPanierSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l ajout au panier:', error);
      alert('Erreur lors de l ajout au panier. Veuillez réessayer.');
    } finally {
      setAjoutPanierLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  if (error || !produit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="mb-4 text-6xl">⚠️</div>
          <p className="text-xl mb-4" style={{ color: theme.colors.error }}>{error || 'Produit non trouvé'}</p>
          <Link href="/produits" className="inline-block px-6 py-3 rounded-full font-semibold transition-all hover:scale-105" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const prixTTC = parseFloat(produit.prix_ht) * (1 + parseFloat(produit.tva) / 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-2 text-sm" style={{ color: theme.colors.textSecondary }}>
        <Link href="/" className="hover:underline">Accueil</Link><span>/</span>
        <Link href="/produits" className="hover:underline">Produits</Link><span>/</span>
        <span style={{ color: theme.colors.text }}>{produit.nom}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square rounded-lg overflow-hidden" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
          {isValidImageUrl(produit.image_principale) ? (
            <img
              src={produit.image_principale!}
              alt={produit.nom}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Si l'image ne charge pas, afficher l'icône intelligente
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-9xl" style="background-color: ${theme.colors.background}">${getProductIcon(produit)}</div>`;
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-9xl" style={{ backgroundColor: theme.colors.background }}>
              {getProductIcon(produit)}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}>{produit.nom}</h1>
          
          <div className="flex gap-2 mb-4">
            {produit.est_bio && <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: theme.colors.success, color: 'white' }}>🌱 Bio</span>}
            {produit.est_local && <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: theme.colors.secondary, color: 'white' }}>🇫🇷 Local</span>}
            {produit.est_nouveaute && <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: theme.colors.warning, color: 'white' }}>✨ Nouveauté</span>}
          </div>

          {produit.description_courte && <p className="text-lg mb-4" style={{ color: theme.colors.text }}>{produit.description_courte}</p>}

          <div className="mb-6">
            <div className="text-4xl font-bold mb-2" style={{ color: theme.colors.primary }}>{prixTTC.toFixed(2)} €</div>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>Prix HT: {produit.prix_ht} € | TVA: {produit.tva}%</div>
          </div>

          <div className="mb-6">
            {produit.stock_actuel > 0 ? (
              <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: theme.colors.success, color: 'white' }}>✓ En stock ({produit.stock_actuel} disponibles)</span>
            ) : (
              <span className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: theme.colors.error, color: 'white' }}>✗ Rupture de stock</span>
            )}
          </div>

          {produit.stock_actuel > 0 && (
            <>
              <div className="mb-6">
                <label className="block mb-2 font-semibold" style={{ color: theme.colors.text }}>Quantité</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantite(Math.max(1, quantite - 1))} className="w-10 h-10 rounded-full font-bold transition-all hover:scale-110" style={{ backgroundColor: theme.colors.surface, border: `2px solid ${theme.colors.border}`, color: theme.colors.text }}>-</button>
                  <input type="number" min="1" max={produit.stock_actuel} value={quantite} onChange={(e) => setQuantite(Math.max(1, Math.min(produit.stock_actuel, parseInt(e.target.value) || 1)))} className="w-20 text-center px-4 py-2 rounded-lg font-bold" style={{ backgroundColor: theme.colors.surface, border: `2px solid ${theme.colors.border}`, color: theme.colors.text }} />
                  <button onClick={() => setQuantite(Math.min(produit.stock_actuel, quantite + 1))} className="w-10 h-10 rounded-full font-bold transition-all hover:scale-110" style={{ backgroundColor: theme.colors.surface, border: `2px solid ${theme.colors.border}`, color: theme.colors.text }}>+</button>
                </div>
              </div>

              <button onClick={handleAjouterAuPanier} disabled={ajoutPanierLoading} className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: ajoutPanierSuccess ? theme.colors.success : theme.colors.primary, color: 'white' }}>
                {ajoutPanierLoading ? 'Ajout en cours...' : ajoutPanierSuccess ? '✓ Ajouté au panier' : '🛒 Ajouter au panier'}
              </button>
            </>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4">
            {produit.poids && <div><div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Poids</div><div style={{ color: theme.colors.text }}>{produit.poids} {produit.unite_mesure}</div></div>}
            {produit.origine && <div><div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Origine</div><div style={{ color: theme.colors.text }}>{produit.origine}</div></div>}
            {produit.fournisseur_nom && <div><div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Fournisseur</div><div style={{ color: theme.colors.text }}>{produit.fournisseur_nom}</div></div>}
            {produit.code_barre && <div><div className="text-sm font-semibold mb-1" style={{ color: theme.colors.textSecondary }}>Code barre</div><div style={{ color: theme.colors.text }}>{produit.code_barre}</div></div>}
          </div>
        </div>
      </div>

      {produit.description_longue && (
        <div className="mt-12 p-6 rounded-lg" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.primary, fontFamily: theme.fonts.heading }}>Description détaillée</h2>
          <p style={{ color: theme.colors.text, lineHeight: '1.8' }}>{produit.description_longue}</p>
        </div>
      )}
    </div>
  );
}
