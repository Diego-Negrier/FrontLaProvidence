'use client';

import { useState, useEffect } from 'react';
import { ProduitsService } from '../../services/ProduitsService';
import { PanierService } from '../../services/PanierService';
import type { Produit } from '../../services/types';
import type { CategoryConfig, SubCategoryConfig } from '../../config/villageConfig';

interface CategorieModalProps {
  isOpen: boolean;
  category?: CategoryConfig;
  onClose: () => void;
}

export default function CategorieModal({
  isOpen,
  category,
  onClose
}: CategorieModalProps) {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryConfig | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Debug: afficher la catégorie reçue
  useEffect(() => {
    if (category) {
      console.log('[CategorieModal] Catégorie reçue:', category);
      console.log('[CategorieModal] Sous-catégories:', category.sousCategories);
      console.log('[CategorieModal] Nombre de sous-catégories:', category.sousCategories?.length);
      if (category.sousCategories && category.sousCategories.length > 0) {
        console.log('[CategorieModal] Première sous-catégorie:', category.sousCategories[0]);
      }
    }
  }, [category]);

  // Charger les produits quand une sous-catégorie est sélectionnée
  useEffect(() => {
    if (selectedSubCategory) {
      loadProduitsForSubCategory(selectedSubCategory.id);
      setImageErrors(new Set()); // Réinitialiser les erreurs d'image
    }
  }, [selectedSubCategory]);

  const loadProduitsForSubCategory = async (subCategoryId: number) => {
    try {
      setLoading(true);
      setError(null);

      // Charger les produits par sous-catégorie
      const produitsData = await ProduitsService.getProductsBySubCategory(subCategoryId);
      console.log('[CategorieModal] Produits chargés:', produitsData);
      console.log('[CategorieModal] Premier produit:', produitsData[0]);
      console.log('[CategorieModal] icone_produit du premier produit:', produitsData[0]?.icone_produit);
      console.log('[CategorieModal] Tous les champs du premier produit:', Object.keys(produitsData[0] || {}));
      setProduits(produitsData);
    } catch (err) {
      console.error('[CategorieModal] Erreur lors du chargement des produits:', err);
      setError('Impossible de charger les produits');
      setProduits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (produit: Produit) => {
    try {
      const produitId = produit.pk_produit || produit.pk;
      const produitNom = produit.nom_produit || produit.nom;

      setAddingToCart(produitId);

      await PanierService.ajouterProduit(produitId, 1);

      alert(`${produitNom} ajouté au panier !`);
    } catch (err) {
      console.error('[CategorieModal] Erreur lors de l\'ajout au panier:', err);
      alert('Erreur lors de l\'ajout au panier');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleBack = () => {
    if (selectedSubCategory) {
      setSelectedSubCategory(null);
      setProduits([]);
    } else {
      onClose();
    }
  };

  if (!isOpen || !category) return null;

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
          maxWidth: '900px',
          width: '90%',
          maxHeight: '85vh',
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
          {selectedSubCategory ? (
            <button
              onClick={handleBack}
              style={{
                fontSize: '1.5rem',
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                marginRight: '0.5rem'
              }}
            >
              ←
            </button>
          ) : null}
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0,
            flex: 1
          }}>
            {selectedSubCategory
              ? `${selectedSubCategory.emoji} ${selectedSubCategory.nom}`
              : `${category.emoji} ${category.nom}`
            }
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

        {/* Description */}
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          {selectedSubCategory ? selectedSubCategory.description : category.description}
        </p>

        {/* Affichage des sous-catégories */}
        {!selectedSubCategory && category.sousCategories && category.sousCategories.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {category.sousCategories.map((subCat) => (
              <div
                key={subCat.id}
                onClick={() => setSelectedSubCategory(subCat)}
                style={{
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ fontSize: '3rem' }}>{subCat.emoji}</div>
                <h3 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.3
                }}>
                  {subCat.nom}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0,
                  textAlign: 'center',
                  lineHeight: 1.4
                }}>
                  {subCat.description}
                </p>
              </div>
            ))}
          </div>
        ) : !selectedSubCategory ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            Aucune sous-catégorie disponible
          </div>
        ) : null}

        {/* Affichage des produits */}
        {selectedSubCategory && (
          <>
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                gap: '1.5rem'
              }}>
                {/* Pancarte "Rupture de stock" */}
                <div style={{
                  backgroundColor: '#fef3c7',
                  border: '4px solid #92400e',
                  borderRadius: '12px',
                  padding: '2rem 3rem',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                  transform: 'rotate(-2deg)',
                  position: 'relative'
                }}>
                  <div style={{
                    fontSize: '4rem',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    📦🚫
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#92400e',
                    textAlign: 'center',
                    fontFamily: 'cursive',
                    lineHeight: 1.3
                  }}>
                    Rupture de stock
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    color: '#78350f',
                    textAlign: 'center',
                    marginTop: '0.5rem'
                  }}>
                    Plus de marchandise disponible
                  </div>

                  {/* Clou décoratif en haut */}
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#78350f',
                    borderRadius: '50%',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }} />
                </div>

                <p style={{
                  fontSize: '0.95rem',
                  color: '#9ca3af',
                  textAlign: 'center',
                  maxWidth: '400px'
                }}>
                  Le commerçant n'a pas encore approvisionné ce stand. Revenez plus tard ! 🛒
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.5rem'
              }}>
                {produits.map((produit) => {
                  const produitId = produit.pk_produit || produit.pk;
                  const produitNom = produit.nom_produit || produit.nom || 'Produit sans nom';
                  const produitImage = produit.image_produit || produit.image_principale;
                  const produitDescription = produit.description_produit || produit.description_courte;
                  const produitPrix = produit.prix_produit || parseFloat(produit.prix_ht);
                  const produitEmoji = produit.icone_produit || selectedSubCategory?.emoji || '📦';
                  const hasImageError = imageErrors.has(produitId);
                  const showImage = produitImage && !hasImageError;

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
                      {showImage ? (
                        <img
                          src={produitImage}
                          alt={produitNom}
                          onError={() => {
                            setImageErrors(prev => new Set(prev).add(produitId));
                          }}
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
                          fontSize: '4rem'
                        }}>
                          {produitEmoji}
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
          </>
        )}
      </div>
    </div>
  );
}
