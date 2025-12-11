"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PanierService, type Panier, type LignePanier } from '@/app/services';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { getContrastColor } from '@/app/utils/colorUtils';

export default function PanierPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [panier, setPanier] = useState<Panier | null>(null);
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
      loadPanier();
    }
  }, [isAuthenticated]);

  const loadPanier = async () => {
    try {
      setError(null);
      console.log('[Panier] Début du chargement du panier...');
      const data = await PanierService.getPanier();
      console.log('[Panier] Données reçues:', data);
      setPanier(data);
    } catch (error: any) {
      console.error('[Panier] Erreur lors du chargement du panier:', error);
      console.error('[Panier] Message d\'erreur:', error.message);

      // Si l'erreur est une erreur d'authentification, rediriger vers login
      if (error.message && error.message.includes('session a expiré')) {
        router.push('/login?redirect=/panier');
        return;
      }

      setError(error.message || 'Impossible de charger le panier');
    } finally {
      setLoading(false);
    }
  };

  const handleModifierQuantite = async (ligneId: number, nouvelleQuantite: number) => {
    try {
      if (nouvelleQuantite <= 0) {
        await PanierService.retirerProduit(ligneId);
      } else {
        await PanierService.modifierQuantite(ligneId, nouvelleQuantite);
      }
      await loadPanier();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification de la quantité');
    }
  };

  const handleSupprimerLigne = async (ligneId: number) => {
    try {
      await PanierService.retirerProduit(ligneId);
      await loadPanier();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleValiderPanier = () => {
    // Vérifier que le panier n'est pas vide
    if (!panier || panier.lignes.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    // Passer à l'étape suivante du tunnel (Information)
    router.push('/checkout/information');
  };

  // Afficher un loader pendant la vérification d'authentification
  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderLeftColor: theme.colors.primary, borderRightColor: theme.colors.primary, borderBottomColor: theme.colors.primary, borderTopColor: 'transparent' }} />
          <p className="mt-4" style={{ color: theme.colors.textSecondary }}>Chargement du panier...</p>
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
          <button onClick={loadPanier} className="px-6 py-3 rounded-full font-semibold transition-all hover:scale-105" style={{ backgroundColor: theme.colors.primary, color: getContrastColor(theme.colors.primary) }}>Réessayer</button>
        </div>
      </div>
    );
  }

  const lignes = panier?.lignes || [];
  const total = panier?.total_ttc ? Number(panier.total_ttc) : lignes.reduce((sum, ligne) => {
    const sousTotal = Number(ligne.sous_total_ttc) || 0;
    return sum + sousTotal;
  }, 0);

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '2rem 1rem',
      backgroundColor: theme.colors.background
    }}>
      {/* En-tête */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: theme.colors.primary,
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          fontFamily: theme.fonts.heading,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          🛒 Mon Panier
        </h1>
        {lignes.length > 0 && (
          <p style={{
            color: theme.colors.textSecondary,
            fontSize: '1rem'
          }}>
            {lignes.length} article{lignes.length > 1 ? 's' : ''} dans votre panier
          </p>
        )}
      </div>

      {lignes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: theme.colors.cardBg,
          border: `2px solid ${theme.colors.border}`,
          borderRadius: '16px'
        }}>
          <div style={{
            fontSize: '6rem',
            marginBottom: '1.5rem',
            opacity: 0.5
          }}>🛒</div>
          <h2 style={{
            color: theme.colors.text,
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.75rem'
          }}>
            Votre panier est vide
          </h2>
          <p style={{
            color: theme.colors.textSecondary,
            fontSize: '1.1rem',
            marginBottom: '2rem'
          }}>
            Découvrez nos produits et commencez vos achats
          </p>
          <Link
            href="/produits"
            style={{
              display: 'inline-block',
              backgroundColor: theme.colors.primary,
              color: getContrastColor(theme.colors.primary),
              padding: '1rem 2rem',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem'
        }}>
          <style>{`
            @media (min-width: 1024px) {
              .panier-grid {
                grid-template-columns: 2fr 1fr;
              }
            }
          `}</style>
          <div className="panier-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem'
          }}>
            {/* Liste des produits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {lignes.map((ligne, index) => (
                <div
                  key={ligne.id}
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    border: `2px solid ${theme.colors.border}`,
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    gap: '1.5rem',
                    transition: 'all 0.3s ease',
                    animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s both`,
                    flexWrap: 'wrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.primary}30`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Image produit */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: theme.colors.background,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {ligne.produit_image ? (
                      <img
                        src={ligne.produit_image}
                        alt={ligne.produit_nom}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem'
                      }}>
                        📦
                      </div>
                    )}
                  </div>

                  {/* Informations produit */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{
                      color: theme.colors.text,
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      marginBottom: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {ligne.produit_nom}
                    </h3>
                    <p style={{
                      color: theme.colors.textSecondary,
                      fontSize: '0.95rem',
                      marginBottom: '1rem'
                    }}>
                      Prix unitaire: <span style={{ fontWeight: '600', color: theme.colors.text }}>
                        {ligne.prix_unitaire_ttc ? Number(ligne.prix_unitaire_ttc).toFixed(2) : '0.00'} €
                      </span>
                    </p>

                  {/* Contrôles de quantité */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: theme.colors.background,
                    border: `2px solid ${theme.colors.border}`,
                    borderRadius: '50px',
                    padding: '0.25rem'
                  }}>
                    <button
                      onClick={() => handleModifierQuantite(ligne.id, ligne.quantite - 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: theme.colors.error + '20',
                        color: theme.colors.error,
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        lineHeight: '1'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.error;
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.error + '20';
                        e.currentTarget.style.color = theme.colors.error;
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      −
                    </button>
                    <span style={{
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      color: theme.colors.text,
                      minWidth: '2.5rem',
                      textAlign: 'center',
                      padding: '0 0.5rem'
                    }}>
                      {ligne.quantite}
                    </span>
                    <button
                      onClick={() => handleModifierQuantite(ligne.id, ligne.quantite + 1)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: theme.colors.success,
                        color: 'white',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        lineHeight: '1'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.success}60`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      +
                    </button>
                  </div>
                  </div>

                  {/* Prix et actions */}
                  <div style={{
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    minWidth: '150px'
                  }}>
                    <div style={{
                      color: theme.colors.primary,
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem'
                    }}>
                      {ligne.sous_total_ttc ? Number(ligne.sous_total_ttc).toFixed(2) : '0.00'} €
                    </div>
                    <button
                      onClick={() => handleSupprimerLigne(ligne.id)}
                      style={{
                        backgroundColor: theme.colors.error,
                        color: getContrastColor(theme.colors.error),
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
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
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Récapitulatif */}
            <div style={{
              position: 'sticky',
              top: '1rem'
            }}>
              <div style={{
                backgroundColor: theme.colors.cardBg,
                border: `2px solid ${theme.colors.border}`,
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h2 style={{
                  color: theme.colors.primary,
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  💰 Récapitulatif
                </h2>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: theme.colors.background,
                    borderRadius: '8px'
                  }}>
                    <span style={{
                      color: theme.colors.textSecondary,
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Sous-total HT
                    </span>
                    <span style={{
                      color: theme.colors.text,
                      fontWeight: 'bold'
                    }}>
                      {panier?.total_ht ? Number(panier.total_ht).toFixed(2) : '0.00'} €
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: theme.colors.background,
                    borderRadius: '8px'
                  }}>
                    <span style={{
                      color: theme.colors.textSecondary,
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      TVA
                    </span>
                    <span style={{
                      color: theme.colors.text,
                      fontWeight: 'bold'
                    }}>
                      {panier?.total_tva ? Number(panier.total_tva).toFixed(2) : '0.00'} €
                    </span>
                  </div>

                  <div style={{
                    height: '2px',
                    backgroundColor: theme.colors.border,
                    margin: '0.5rem 0'
                  }} />

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '1rem',
                    backgroundColor: theme.colors.primary + '20',
                    border: `2px solid ${theme.colors.primary}`,
                    borderRadius: '12px'
                  }}>
                    <span style={{
                      color: theme.colors.text,
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}>
                      Total TTC
                    </span>
                    <span style={{
                      color: theme.colors.primary,
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}>
                      {total.toFixed(2)} €
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleValiderPanier}
                  style={{
                    width: '100%',
                    backgroundColor: theme.colors.success,
                    color: getContrastColor(theme.colors.success),
                    border: 'none',
                    borderRadius: '12px',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                >
                  ✓ Valider le panier
                </button>

                <Link
                  href="/produits"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    backgroundColor: theme.colors.background,
                    color: theme.colors.textSecondary,
                    padding: '0.75rem',
                    borderRadius: '12px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.primary + '10';
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.background;
                    e.currentTarget.style.color = theme.colors.textSecondary;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ← Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
