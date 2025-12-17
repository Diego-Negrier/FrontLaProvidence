import { Product, Shop, ShopType, ProductCategory } from '@/app/types/village';

export const PRODUCTS: Product[] = [
  // PRODUITS DU TERROIR - Fruits & Légumes
  {
    id: 1,
    nom: 'Pommes du Verger',
    description: 'Pommes fraîches cultivées localement',
    prix: 3.50,
    categorie: ProductCategory.TERROIR,
    shopType: ShopType.MARCHE,
    stock: 50,
    enVedette: true
  },
  {
    id: 2,
    nom: 'Tomates du Potager',
    description: 'Tomates mûries au soleil',
    prix: 4.20,
    categorie: ProductCategory.TERROIR,
    shopType: ShopType.MARCHE,
    stock: 35
  },
  {
    id: 3,
    nom: 'Carottes Bio',
    description: 'Carottes biologiques croquantes',
    prix: 2.80,
    categorie: ProductCategory.TERROIR,
    shopType: ShopType.MARCHE,
    stock: 45
  },

  // PRODUITS DU TERROIR - Fromages & Charcuterie
  {
    id: 4,
    nom: 'Fromage de Chèvre Affiné',
    description: 'Fromage artisanal affiné 3 mois',
    prix: 12.50,
    categorie: ProductCategory.TERROIR,
    shopType: ShopType.MARCHE,
    stock: 25,
    enVedette: true
  },
  {
    id: 5,
    nom: 'Comté 18 mois',
    description: 'Fromage Comté vieilli',
    prix: 18.90,
    categorie: ProductCategory.TERROIR,
    shopType: ShopType.MARCHE,
    stock: 15
  },
  {
    id: 6,
    nom: 'Saucisson Artisanal',
    description: 'Saucisson sec traditionnel',
    prix: 15.00,
    categorie: ProductCategory.TERROIR,
    shopType: ShopType.MARCHE,
    stock: 30
  },

  // PRODUITS DU TERROIR - Vins & Miels
  {
    id: 7,
    nom: 'Vin Rouge du Terroir',
    description: 'Cuvée millésimée 2020',
    prix: 25.00,
    categorie: ProductCategory.TERROIR,
    shopType: ShopType.MARCHE,
    stock: 40,
    enVedette: true
  },
  {
    id: 8,
    nom: 'Miel de Lavande',
    description: 'Miel artisanal de lavande',
    prix: 8.50,
    categorie: ProductCategory.TERROIR,
    shopType: ShopType.MARCHE,
    stock: 50
  },
  {
    id: 9,
    nom: 'Vin Blanc Chardonnay',
    description: 'Vin blanc sec et fruité',
    prix: 22.00,
    categorie: ProductCategory.TERROIR,
    shopType: ShopType.MARCHE,
    stock: 35
  },

  // PRODUITS CONSTRUCTION - Forge
  {
    id: 10,
    nom: 'Clous Forgés',
    description: 'Clous en fer forgé (pack de 100)',
    prix: 45.00,
    categorie: ProductCategory.CONSTRUCTION,
    shopType: ShopType.FORGERON,
    stock: 100
  },
  {
    id: 11,
    nom: 'Fer à Cheval',
    description: 'Fer à cheval artisanal',
    prix: 35.00,
    categorie: ProductCategory.CONSTRUCTION,
    shopType: ShopType.FORGERON,
    stock: 50,
    enVedette: true
  },
  {
    id: 12,
    nom: 'Grille Décorative',
    description: 'Grille en fer forgé sur mesure',
    prix: 450.00,
    categorie: ProductCategory.CONSTRUCTION,
    shopType: ShopType.FORGERON,
    stock: 10
  },

  // PRODUITS CONSTRUCTION - Charpentier
  {
    id: 13,
    nom: 'Planches de Chêne',
    description: 'Planches massives de chêne (2m)',
    prix: 85.00,
    categorie: ProductCategory.CONSTRUCTION,
    shopType: ShopType.CHARPENTIER,
    stock: 75,
    enVedette: true
  },
  {
    id: 14,
    nom: 'Poutres de Charpente',
    description: 'Poutres en bois massif (4m)',
    prix: 120.00,
    categorie: ProductCategory.CONSTRUCTION,
    shopType: ShopType.CHARPENTIER,
    stock: 40
  },
  {
    id: 15,
    nom: 'Volets en Bois',
    description: 'Volets artisanaux sur mesure',
    prix: 350.00,
    categorie: ProductCategory.CONSTRUCTION,
    shopType: ShopType.CHARPENTIER,
    stock: 20
  },

  // PRODUITS CONSTRUCTION - Tailleur de Pierre
  {
    id: 16,
    nom: 'Pierre de Taille',
    description: 'Blocs de pierre taillée (50x50cm)',
    prix: 95.00,
    categorie: ProductCategory.CONSTRUCTION,
    shopType: ShopType.TAILLEUR_PIERRE,
    stock: 200,
    enVedette: true
  },
  {
    id: 17,
    nom: 'Chaux Hydraulique',
    description: 'Sac de chaux 25kg',
    prix: 28.00,
    categorie: ProductCategory.CONSTRUCTION,
    shopType: ShopType.TAILLEUR_PIERRE,
    stock: 150
  },
  {
    id: 18,
    nom: 'Tuiles en Ardoise',
    description: 'Ardoise naturelle (m²)',
    prix: 65.00,
    categorie: ProductCategory.CONSTRUCTION,
    shopType: ShopType.TAILLEUR_PIERRE,
    stock: 300
  },

  // PRODUITS LUXE - Orfèvre
  {
    id: 19,
    nom: 'Collier en Or',
    description: 'Collier artisanal en or 18 carats',
    prix: 1250.00,
    categorie: ProductCategory.LUXE,
    shopType: ShopType.ORFEVRE,
    stock: 5,
    enVedette: true
  },
  {
    id: 20,
    nom: 'Bague Sertie',
    description: 'Bague ornée de pierres précieuses',
    prix: 850.00,
    categorie: ProductCategory.LUXE,
    shopType: ShopType.ORFEVRE,
    stock: 8
  },

  // PRODUITS LUXE - Drapier
  {
    id: 21,
    nom: 'Tapisserie Royale',
    description: 'Tapisserie tissée à la main',
    prix: 2500.00,
    categorie: ProductCategory.LUXE,
    shopType: ShopType.DRAPIER,
    stock: 3,
    enVedette: true
  },
  {
    id: 22,
    nom: 'Velours Précieux',
    description: 'Étoffe de velours bleu royal (mètre)',
    prix: 180.00,
    categorie: ProductCategory.LUXE,
    shopType: ShopType.DRAPIER,
    stock: 25
  },

  // PRODUITS PRESTIGE - Abbaye
  {
    id: 23,
    nom: 'Édition Manuscrite Enluminée',
    description: 'Manuscrit médiéval unique',
    prix: 5000.00,
    categorie: ProductCategory.PRESTIGE,
    shopType: ShopType.ABBAYE,
    stock: 1,
    enVedette: true
  },
  {
    id: 24,
    nom: 'Reliquaire Sacré',
    description: 'Reliquaire en or et argent',
    prix: 8500.00,
    categorie: ProductCategory.PRESTIGE,
    shopType: ShopType.ABBAYE,
    stock: 1,
    enVedette: true
  },
  {
    id: 25,
    nom: 'Calice Royal',
    description: 'Calice en argent massif',
    prix: 3200.00,
    categorie: ProductCategory.PRESTIGE,
    shopType: ShopType.ABBAYE,
    stock: 2
  }
];

export const SHOPS_WITH_PRODUCTS: Shop[] = [
  {
    id: 1,
    nom: 'Étal de Fruits & Légumes',
    type: ShopType.MARCHE,
    categorie: ProductCategory.TERROIR,
    position: [-5, 0, 0],
    description: 'Fruits et légumes frais cultivés dans nos terres fertiles',
    produits: PRODUCTS.filter(p => p.id >= 1 && p.id <= 3),
    artisan: {
      nom: 'Pierre le Maraîcher',
      metier: 'Maraîcher',
      histoire: 'Cultivateur passionné depuis trois générations, Pierre connaît chaque parcelle de son potager et sélectionne les meilleurs produits pour vous.'
    }
  },
  {
    id: 2,
    nom: 'Fromagerie & Charcuterie',
    type: ShopType.MARCHE,
    categorie: ProductCategory.TERROIR,
    position: [5, 0, 0],
    description: 'Fromages affinés et charcuterie artisanale de nos montagnes',
    produits: PRODUCTS.filter(p => p.id >= 4 && p.id <= 6),
    artisan: {
      nom: 'Marie la Fromagère',
      metier: 'Fromagère',
      histoire: 'Maître affineur depuis 20 ans, Marie perpétue les traditions ancestrales de fabrication fromagère avec passion et excellence.'
    }
  },
  {
    id: 3,
    nom: 'Cave à Vins & Miels',
    type: ShopType.MARCHE,
    categorie: ProductCategory.TERROIR,
    position: [0, 0, 3],
    description: 'Vins de nos vignobles et miels de nos ruches',
    produits: PRODUCTS.filter(p => p.id >= 7 && p.id <= 9),
    artisan: {
      nom: 'Jacques le Vigneron',
      metier: 'Vigneron & Apiculteur',
      histoire: 'Passionné de viticulture et d\'apiculture, Jacques cultive ses vignes et entretient ses ruches avec un savoir-faire transmis de père en fils.'
    }
  },
  {
    id: 4,
    nom: 'Forge du Village',
    type: ShopType.FORGERON,
    categorie: ProductCategory.CONSTRUCTION,
    position: [-15, 0, -8],
    description: 'Ferronnerie et outils forgés pour vos constructions',
    produits: PRODUCTS.filter(p => p.id >= 10 && p.id <= 12),
    artisan: {
      nom: 'Bertrand le Forgeron',
      metier: 'Maître Forgeron',
      histoire: 'Le feu de sa forge brûle depuis l\'aube. Bertrand façonne le fer avec une maîtrise incomparable acquise au fil de décennies.'
    }
  },
  {
    id: 5,
    nom: 'Atelier du Charpentier',
    type: ShopType.CHARPENTIER,
    categorie: ProductCategory.CONSTRUCTION,
    position: [-12, 0, -12],
    description: 'Bois de charpente et menuiserie de qualité',
    produits: PRODUCTS.filter(p => p.id >= 13 && p.id <= 15),
    artisan: {
      nom: 'Guillaume le Charpentier',
      metier: 'Maître Charpentier',
      histoire: 'Artisan du bois de père en fils, Guillaume connaît chaque essence et sélectionne les meilleurs bois pour vos ouvrages.'
    }
  },
  {
    id: 6,
    nom: 'Taillerie de Pierre',
    type: ShopType.TAILLEUR_PIERRE,
    categorie: ProductCategory.CONSTRUCTION,
    position: [-18, 0, -12],
    description: 'Pierre de taille, chaux et matériaux nobles',
    produits: PRODUCTS.filter(p => p.id >= 16 && p.id <= 18),
    artisan: {
      nom: 'Thomas le Tailleur',
      metier: 'Maître Tailleur de Pierre',
      histoire: 'Bâtisseur des plus belles demeures du royaume, Thomas façonne la pierre avec une précision millimétrique.'
    }
  },
  {
    id: 7,
    nom: "Atelier de l'Orfèvre",
    type: ShopType.ORFEVRE,
    categorie: ProductCategory.LUXE,
    position: [15, 0, -8],
    description: 'Objets précieux et parures raffinées',
    produits: PRODUCTS.filter(p => p.id >= 19 && p.id <= 20),
    artisan: {
      nom: 'Édouard le Maître Orfèvre',
      metier: 'Orfèvre Joaillier',
      histoire: 'Créateur de pièces uniques pour la noblesse, Édouard travaille l\'or et les pierres précieuses avec un art consommé.'
    }
  },
  {
    id: 8,
    nom: 'Draperie Royale',
    type: ShopType.DRAPIER,
    categorie: ProductCategory.LUXE,
    position: [18, 0, -12],
    description: 'Étoffes précieuses et tapisseries',
    produits: PRODUCTS.filter(p => p.id >= 21 && p.id <= 22),
    artisan: {
      nom: 'Catherine la Drapière',
      metier: 'Maître Drapier',
      histoire: 'Tisseuse des plus beaux tissus du royaume, Catherine crée des étoffes d\'exception pour les grandes maisons.'
    }
  },
  {
    id: 9,
    nom: "L'Abbaye Royale",
    type: ShopType.ABBAYE,
    categorie: ProductCategory.PRESTIGE,
    position: [0, 0, -30],
    description: 'Collections exclusives et trésors royaux',
    produits: PRODUCTS.filter(p => p.id >= 23 && p.id <= 25),
    artisan: {
      nom: 'Frère Antoine',
      metier: 'Gardien du Patrimoine',
      histoire: 'Conservateur des trésors royaux et reliques sacrées, Frère Antoine veille sur le patrimoine ancestral du royaume.'
    }
  }
];

// Helper function to get products by shop ID
export function getProductsByShopId(shopId: number): Product[] {
  const shop = SHOPS_WITH_PRODUCTS.find(s => s.id === shopId);
  return shop?.produits || [];
}

// Helper function to get shop by ID
export function getShopById(shopId: number): Shop | undefined {
  return SHOPS_WITH_PRODUCTS.find(s => s.id === shopId);
}

// Helper function to get products by category
export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter(p => p.categorie === category);
}

// Helper function to get featured products
export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.enVedette);
}
