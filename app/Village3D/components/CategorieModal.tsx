'use client';

import { useState, useEffect } from 'react';
import { ProduitsService } from '../../services/ProduitsService';
import { PanierService } from '../../services/PanierService';
import type { Produit } from '../../services/types';

interface CategorieModalProps {
  isOpen: boolean;
  categorieId: number;
  categorieNom: string;
  onClose: () => void;
}

export default function CategorieModal({
  isOpen,
  categorieId,
  categorieNom,
  onClose
}: CategorieModalProps) {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && categorieId) {
      loadProduits();
    }
  }, [isOpen, categorieId]);

  const loadProduits = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les produits par catégorie
      const produitsData = await ProduitsService.getProductsByCategory(categorieId);
      setProduits(produitsData);
    } catch (err) {
      console.error('[CategorieModal] Erreur lors du chargement des produits:', err);
      setError('Impossible de charger les produits');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (produit: Produit) => {
    try {
      const produitId = produit.pk_produit || produit.pk;
      const produitNom = produit.nom_produit || produit.nom;

      setAddingToCart(produitId);

      await PanierService.ajouterArticle({
        pk_produit: produitId,
        quantite: 1
      });

      alert(`${produitNom} ajouté au panier !`);
    } catch (err) {
      console.error('[CategorieModal] Erreur lors de l\'ajout au panier:', err);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setAddingToCart(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          position: 'relative'
        }}
      >
        {/* En-tête */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>
            {categorieNom}
          </h2>
          <button
            onClick={onClose}
            style={{
              fontSize: '2rem',
              color: '#6b7280',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              lineHeight: 1,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            ×
          </button>
        </div>

        {/* Contenu */}
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            Chargement des produits...
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#dc2626'
          }}>
            {error}
          </div>
        ) : produits.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            Aucun produit disponible dans cette catégorie
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {produits.map((produit) => {
              const produitId = produit.pk_produit || produit.pk;
              const produitNom = produit.nom_produit || produit.nom;
              const produitImage = produit.image_produit || produit.image_principale;
              const produitDescription = produit.description_produit || produit.description_courte;
              const produitPrix = produit.prix_produit || parseFloat(produit.prix_ht);

              return (
              <div
                key={produitId}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Image du produit */}
                {produitImage ? (
                  <img
                    src={produitImage}
                    alt={produitNom}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      backgroundColor: '#f3f4f6'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '150px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#9ca3af'
                  }}>
                    Pas d'image
                  </div>
                )}

                {/* Nom du produit */}
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0,
                  lineHeight: 1.3
                }}>
                  {produitNom}
                </h3>

                {/* Description */}
                {produitDescription && (
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: 1.4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {produitDescription}
                  </p>
                )}

                {/* Prix */}
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#059669',
                  marginTop: 'auto'
                }}>
                  {produitPrix ? produitPrix.toFixed(2) : '0.00'} €
                </div>

                {/* Bouton ajouter au panier */}
                <button
                  onClick={() => handleAddToCart(produit)}
                  disabled={addingToCart === produitId}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: addingToCart === produitId ? '#9ca3af' : '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: addingToCart === produitId ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (addingToCart !== produitId) {
                      e.currentTarget.style.backgroundColor = '#047857';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (addingToCart !== produitId) {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }
                  }}
                >
                  {addingToCart === produitId ? 'Ajout...' : 'Ajouter au panier'}
                </button>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
