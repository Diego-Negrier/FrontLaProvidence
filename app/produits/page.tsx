"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProduitsService, CategoriesService, type Produit, type Categorie, type SousCategorie, type SousSousCategorie } from '@/app/services';
import { useTheme } from '@/app/contexts/ThemeContext';
import { getContrastColor } from '@/app/utils/colorUtils';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

// Fonction pour obtenir l'icône du produit - utilise l'icône du backend
const getProduitIcon = (produit: Produit): string => {
  // Utiliser l'icône calculée par le backend si disponible
  if (produit.icone_produit) {
    return produit.icone_produit;
  }

  // Fallback sur les attributs si pas d'icône du backend
  if (produit.est_bio) return '🌱';
  if (produit.est_local) return '🏡';
  if (produit.est_nouveaute) return '✨';
  if (produit.en_promotion) return '🏷️';
  return '📦'; // Icône par défaut
};

export default function ProduitsPage() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
  const [selectedSubSubCategoryId, setSelectedSubSubCategoryId] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [expandedSubCategories, setExpandedSubCategories] = useState<Set<number>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProduits();
  }, [searchQuery, produits, selectedCategoryId, selectedSubCategoryId, selectedSubSubCategoryId]);

  const loadData = async () => {
    try {
      setError(null);
      const [produitsData, categoriesData] = await Promise.all([
        ProduitsService.getProduits(),
        CategoriesService.getCategories()
      ]);
      setProduits(Array.isArray(produitsData) ? produitsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setFilteredProduits(Array.isArray(produitsData) ? produitsData : []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Impossible de charger les données. Veuillez réessayer plus tard.');
      setProduits([]);
      setCategories([]);
      setFilteredProduits([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProduits = () => {
    let filtered = [...produits];

    // Filtre par catégorie
    if (selectedSubSubCategoryId) {
      filtered = filtered.filter(p => p.soussouscategorie === selectedSubSubCategoryId);
    } else if (selectedSubCategoryId) {
      filtered = filtered.filter(p => p.souscategorie === selectedSubCategoryId);
    } else if (selectedCategoryId) {
      filtered = filtered.filter(p => p.categorie === selectedCategoryId);
    }

    // Filtre par recherche
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(produit =>
        produit.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        produit.description_courte?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProduits(filtered);
  };

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSubCategory = (subCategoryId: number) => {
    const newExpanded = new Set(expandedSubCategories);
    if (newExpanded.has(subCategoryId)) {
      newExpanded.delete(subCategoryId);
    } else {
      newExpanded.add(subCategoryId);
    }
    setExpandedSubCategories(newExpanded);
  };

  const selectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(null);
    setSelectedSubSubCategoryId(null);
  };

  const selectSubCategory = (subCategoryId: number) => {
    setSelectedSubCategoryId(subCategoryId);
    setSelectedSubSubCategoryId(null);
  };

  const selectSubSubCategory = (subSubCategoryId: number) => {
    setSelectedSubSubCategoryId(subSubCategoryId);
  };

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setSelectedSubSubCategoryId(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: theme.colors.background }}>
      {/* Effet de fond futuriste avec gradients animés */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${theme.colors.primary}15 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, ${theme.colors.secondary}15 0%, transparent 50%),
                       radial-gradient(circle at 40% 90%, ${theme.colors.accent}10 0%, transparent 50%)`,
        }}
      />

      <div className="container py-12 relative z-10">
        {/* Header futuriste avec glassmorphism */}
        <div className="mb-16 text-center relative">
          {/* Effet de glow derrière l'icône */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-50"
            style={{ backgroundColor: theme.colors.primary }}
          />

          <div
            className="inline-block mb-6 p-6 rounded-3xl backdrop-blur-xl relative"
            style={{
              backgroundColor: theme.colors.cardBg + 'CC',
              boxShadow: `0 8px 32px ${theme.colors.primary}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
              border: `1px solid ${theme.colors.border}80`
            }}
          >
            <span className="text-6xl">🛒</span>
          </div>

          <h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text"
            style={{
              color: theme.colors.text,
              fontFamily: theme.fonts.heading,
              letterSpacing: '-0.02em',
              textShadow: `0 2px 20px ${theme.colors.primary}30`
            }}
          >
            Notre Catalogue
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: theme.colors.textSecondary, lineHeight: '1.6' }}>
            Découvrez tous nos produits frais et de qualité
          </p>

          {/* Ligne séparatrice futuriste */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px flex-1 max-w-xs" style={{
              background: `linear-gradient(to right, transparent, ${theme.colors.primary}40, transparent)`
            }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
            <div className="h-px flex-1 max-w-xs" style={{
              background: `linear-gradient(to right, transparent, ${theme.colors.primary}40, transparent)`
            }} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div
                className="inline-block animate-spin rounded-full h-16 w-16 border-4"
                style={{
                  borderColor: theme.colors.primary,
                  borderTopColor: 'transparent'
                }}
              />
              <p className="mt-4 text-lg" style={{ color: theme.colors.textSecondary }}>Chargement...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="mb-6 text-6xl">⚠️</div>
            <p className="text-2xl mb-8" style={{ color: theme.colors.error }}>
              {error}
            </p>
            <button
              onClick={loadData}
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
        ) : (
          <div className="flex gap-6">
            {/* Sidebar des catégories avec glassmorphism */}
            <aside
              className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
              style={{
                flexShrink: 0,
              }}
            >
              <div
                className="sticky top-24 rounded-3xl overflow-hidden backdrop-blur-xl"
                style={{
                  backgroundColor: theme.colors.cardBg + 'E6',
                  boxShadow: `0 8px 32px ${theme.colors.primary}10, inset 0 1px 0 rgba(255,255,255,0.05)`,
                  border: `1px solid ${theme.colors.border}60`,
                }}
              >
                {/* Header avec dégradé subtil */}
                <div
                  className="p-6 pb-4 relative"
                  style={{
                    borderBottom: `1px solid ${theme.colors.border}40`,
                    background: `linear-gradient(135deg, ${theme.colors.primary}08 0%, transparent 100%)`
                  }}
                >
                  {/* Accent ligne supérieure */}
                  <div
                    className="absolute top-0 left-6 right-6 h-0.5 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${theme.colors.primary}, transparent)`
                    }}
                  />

                  <div className="flex items-center justify-between mb-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-6 rounded-full"
                        style={{
                          background: `linear-gradient(180deg, ${theme.colors.primary}, ${theme.colors.secondary})`
                        }}
                      />
                      <h2
                        className="text-lg font-bold"
                        style={{ color: theme.colors.text, fontFamily: theme.fonts.heading }}
                      >
                        Catégories
                      </h2>
                    </div>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="md:hidden p-2 rounded-xl transition-all hover:bg-opacity-10 hover:rotate-90"
                      style={{
                        color: theme.colors.textSecondary,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <FaTimes size={18} />
                    </button>
                  </div>

                  {/* Bouton reset avec effet futuriste */}
                  {(selectedCategoryId || selectedSubCategoryId || selectedSubSubCategoryId || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] hover:shadow-lg group relative overflow-hidden"
                      style={{
                        backgroundColor: theme.colors.surface + 'CC',
                        color: theme.colors.textSecondary,
                        border: `1px solid ${theme.colors.border}60`,
                      }}
                    >
                      {/* Effet de shine au hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${theme.colors.primary}15, transparent)`,
                          transform: 'translateX(-100%)',
                          animation: 'shine 1.5s infinite'
                        }}
                      />
                      <span className="relative z-10">✕ Tout effacer</span>
                    </button>
                  )}
                </div>

                {/* Liste des catégories - scrollable */}
                <div className="p-3 space-y-0.5 max-h-[calc(100vh-320px)] overflow-y-auto" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: `${theme.colors.border} transparent`
                }}>
                  {categories.map((category) => (
                    <div key={category.pk}>
                      {/* Catégorie principale - minimaliste */}
                      <div
                        className="group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:translate-x-1"
                        style={{
                          borderLeft: selectedCategoryId === category.pk ? `3px solid ${theme.colors.primary}` : '3px solid transparent',
                          color: selectedCategoryId === category.pk ? theme.colors.primary : theme.colors.text,
                        }}
                        onClick={() => {
                          selectCategory(category.pk);
                          toggleCategory(category.pk);
                        }}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <span className="font-medium text-sm truncate">{category.nom}</span>
                          <span
                            className="text-xs flex-shrink-0"
                            style={{
                              color: theme.colors.textSecondary,
                              opacity: 0.6
                            }}
                          >
                            {category.nb_produits}
                          </span>
                        </div>
                        {category.souscategories && category.souscategories.length > 0 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleCategory(category.pk); }}
                            className="flex-shrink-0 p-1 transition-transform"
                            style={{
                              color: theme.colors.textSecondary,
                              transform: expandedCategories.has(category.pk) ? 'rotate(0deg)' : 'rotate(-90deg)'
                            }}
                          >
                            <FaChevronDown size={10} />
                          </button>
                        )}
                      </div>

                      {/* Sous-catégories - minimaliste */}
                      {expandedCategories.has(category.pk) && category.souscategories && (
                        <div className="ml-3 mt-0.5 space-y-0.5">
                          {category.souscategories.map((subCategory) => (
                            <div key={subCategory.pk}>
                              <div
                                className="group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all hover:translate-x-1"
                                style={{
                                  borderLeft: selectedSubCategoryId === subCategory.pk ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
                                  color: selectedSubCategoryId === subCategory.pk ? theme.colors.primary : theme.colors.textSecondary,
                                }}
                                onClick={() => {
                                  selectSubCategory(subCategory.pk);
                                  toggleSubCategory(subCategory.pk);
                                }}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="text-xs truncate">{subCategory.nom}</span>
                                  <span
                                    className="text-xs flex-shrink-0"
                                    style={{
                                      color: theme.colors.textSecondary,
                                      opacity: 0.5,
                                      fontSize: '0.65rem'
                                    }}
                                  >
                                    {subCategory.nb_produits}
                                  </span>
                                </div>
                                {subCategory.soussouscategories && subCategory.soussouscategories.length > 0 && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); toggleSubCategory(subCategory.pk); }}
                                    className="flex-shrink-0 p-1 transition-transform"
                                    style={{
                                      color: theme.colors.textSecondary,
                                      transform: expandedSubCategories.has(subCategory.pk) ? 'rotate(0deg)' : 'rotate(-90deg)'
                                    }}
                                  >
                                    <FaChevronDown size={8} />
                                  </button>
                                )}
                              </div>

                              {/* Sous-sous-catégories - minimaliste */}
                              {expandedSubCategories.has(subCategory.pk) && subCategory.soussouscategories && (
                                <div className="ml-3 mt-0.5 space-y-0.5">
                                  {subCategory.soussouscategories.map((subSubCategory) => (
                                    <div
                                      key={subSubCategory.pk}
                                      className="group flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer transition-all hover:translate-x-1"
                                      style={{
                                        borderLeft: selectedSubSubCategoryId === subSubCategory.pk ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
                                        color: selectedSubSubCategoryId === subSubCategory.pk ? theme.colors.primary : theme.colors.textSecondary,
                                      }}
                                      onClick={() => selectSubSubCategory(subSubCategory.pk)}
                                    >
                                      <span className="text-xs truncate">{subSubCategory.nom}</span>
                                      <span
                                        className="text-xs flex-shrink-0 ml-2"
                                        style={{
                                          color: theme.colors.textSecondary,
                                          opacity: 0.4,
                                          fontSize: '0.6rem'
                                        }}
                                      >
                                        {subSubCategory.nb_produits}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Contenu principal */}
            <main className="flex-1 min-w-0">
              {/* Barre de recherche et toggle sidebar avec effets futuristes */}
              <div className="mb-8 flex gap-4 items-center">
                {!isSidebarOpen && (
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="px-6 py-4 rounded-2xl font-semibold transition-all hover:scale-105 hover:shadow-2xl backdrop-blur-sm group relative overflow-hidden"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: getContrastColor(theme.colors.primary),
                      boxShadow: `0 8px 24px ${theme.colors.primary}40`
                    }}
                  >
                    {/* Effet de shine */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                        transform: 'skewX(-20deg)',
                        animation: 'shimmer 2s infinite'
                      }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      📂 Catégories
                    </span>
                  </button>
                )}
                <div className="flex-1 relative group">
                  {/* Effet de glow au focus */}
                  <div
                    className="absolute -inset-0.5 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}40, ${theme.colors.secondary}40)`
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl text-lg transition-all focus:outline-none backdrop-blur-sm relative"
                    style={{
                      backgroundColor: theme.colors.surface + 'E6',
                      border: `2px solid ${theme.colors.border}60`,
                      color: theme.colors.text,
                      boxShadow: `0 4px 16px ${theme.colors.primary}05, inset 0 1px 0 rgba(255,255,255,0.05)`
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.primary + '80';
                      e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.primary}15, inset 0 1px 0 rgba(255,255,255,0.1)`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.border + '60';
                      e.currentTarget.style.boxShadow = `0 4px 16px ${theme.colors.primary}05, inset 0 1px 0 rgba(255,255,255,0.05)`;
                    }}
                  />
                  <div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-xl backdrop-blur-sm transition-all"
                    style={{
                      backgroundColor: theme.colors.primary + '15'
                    }}
                  >
                    <span className="text-xl">🔍</span>
                  </div>
                </div>
              </div>

              {/* Résultats */}
              {filteredProduits.length === 0 ? (
                <div className="text-center py-20">
                  <div className="mb-6 text-7xl">📦</div>
                  <p className="text-2xl" style={{ color: theme.colors.textSecondary }}>
                    {searchQuery || selectedCategoryId
                      ? 'Aucun produit trouvé avec ces critères'
                      : 'Aucun produit disponible pour le moment'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <p className="text-lg" style={{ color: theme.colors.textSecondary }}>
                      {filteredProduits.length} produit{filteredProduits.length > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProduits.map((produit) => (
                      <Link
                        key={produit.pk}
                        href={`/produit/${produit.numero_unique}`}
                        className="group block rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm relative"
                        style={{
                          backgroundColor: theme.colors.cardBg + 'F2',
                          boxShadow: `0 4px 16px ${theme.colors.primary}08, 0 2px 4px rgba(0,0,0,0.02)`,
                          border: `1px solid ${theme.colors.border}60`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = `0 12px 40px ${theme.colors.primary}20, 0 4px 12px rgba(0,0,0,0.08)`;
                          e.currentTarget.style.borderColor = theme.colors.primary + '40';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = `0 4px 16px ${theme.colors.primary}08, 0 2px 4px rgba(0,0,0,0.02)`;
                          e.currentTarget.style.borderColor = theme.colors.border + '60';
                        }}
                      >
                        {/* Effet de gradient au hover sur le bord */}
                        <div
                          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.secondary}10)`,
                            zIndex: 0
                          }}
                        />
                        {/* Image avec badges */}
                        <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: theme.colors.background }}>
                          {/* Badge icône dynamique */}
                          <div
                            className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full backdrop-blur-sm"
                            style={{
                              backgroundColor: theme.colors.primary + 'E6',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            }}
                          >
                            <span className="text-xl">{getProduitIcon(produit)}</span>
                          </div>

                          {/* Badge promo */}
                          {produit.en_promotion && parseFloat(produit.pourcentage_promotion) > 0 && (
                            <div
                              className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                              style={{
                                backgroundColor: theme.colors.error + 'E6',
                                color: getContrastColor(theme.colors.error),
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                              }}
                            >
                              -{produit.pourcentage_promotion}%
                            </div>
                          )}

                          {produit.image_principale ? (
                            <img
                              src={produit.image_principale}
                              alt={produit.nom}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                              {getProduitIcon(produit)}
                            </div>
                          )}
                        </div>

                        {/* Contenu */}
                        <div className="p-6">
                          <h3
                            className="font-bold text-xl mb-3 group-hover:underline line-clamp-1"
                            style={{
                              color: theme.colors.text,
                              fontFamily: theme.fonts.heading
                            }}
                          >
                            {produit.nom}
                          </h3>
                          {produit.description_courte && (
                            <p
                              className="text-sm mb-3 line-clamp-2"
                              style={{ color: theme.colors.textSecondary }}
                            >
                              {produit.description_courte}
                            </p>
                          )}

                          {/* Prix et stock */}
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className="text-2xl font-bold"
                              style={{ color: theme.colors.primary }}
                            >
                              {((parseFloat(produit.prix_ht) * (1 + parseFloat(produit.tva) / 100))).toFixed(2)} €
                            </span>
                            {produit.stock_actuel > 0 ? (
                              <span
                                className="text-xs px-2 py-1 rounded-full font-semibold"
                                style={{
                                  backgroundColor: theme.colors.success + '20',
                                  color: theme.colors.success,
                                }}
                              >
                                En stock
                              </span>
                            ) : (
                              <span
                                className="text-xs px-2 py-1 rounded-full font-semibold"
                                style={{
                                  backgroundColor: theme.colors.error + '20',
                                  color: theme.colors.error,
                                }}
                              >
                                Rupture
                              </span>
                            )}
                          </div>

                          {/* Badges supplémentaires */}
                          <div className="flex flex-wrap gap-2">
                            {produit.est_bio && (
                              <span
                                className="text-xs px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: theme.colors.success + '20',
                                  color: theme.colors.success,
                                }}
                              >
                                🌱 Bio
                              </span>
                            )}
                            {produit.est_local && (
                              <span
                                className="text-xs px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: theme.colors.primary + '20',
                                  color: theme.colors.primary,
                                }}
                              >
                                🏡 Local
                              </span>
                            )}
                            {produit.est_nouveaute && (
                              <span
                                className="text-xs px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: theme.colors.warning + '20',
                                  color: theme.colors.warning,
                                }}
                              >
                                ✨ Nouveau
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
