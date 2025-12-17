import { Shop, ShopType, ProductCategory, VillageLayout } from '@/app/types/village';

export const VILLAGE_LAYOUT: VillageLayout = {
  porteForifiee: [0, 0, 30],
  routePavee: [
    [0, 0, 25],
    [0, 0, 15],
    [0, 0, 5],
    [0, 0, -5]
  ],
  placeMarche: [0, 0, 0],
  quartierArtisans: [-15, 0, -10],
  quartierLuxe: [15, 0, -10],
  abbaye: [0, 0, -30]
};

// Configuration des catégories avec emojis
export interface CategoryConfig {
  id: number;
  nom: string;
  emoji: string;
  description: string;
  position: [number, number, number];
  sousCategories: SubCategoryConfig[];
}

export interface SubCategoryConfig {
  id: number;
  nom: string;
  emoji: string;
  description: string;
  categorieId: number;
}

export const VILLAGE_CATEGORIES: CategoryConfig[] = [
  // HABITAT AUTONOME PREMIUM
  {
    id: 1,
    nom: 'Habitat Autonome Premium',
    emoji: '🏡',
    description: 'Habitat écologique, autonome et de prestige',
    position: [-10, 0, 0],
    sousCategories: [
      { id: 1, nom: 'Maisons Passives', emoji: '🏠', description: 'Maisons à très haute performance énergétique', categorieId: 1 },
      { id: 2, nom: 'Villas Autonomes', emoji: '🏘️', description: 'Villas haut de gamme autonomes en énergie', categorieId: 1 },
      { id: 3, nom: 'Architecture Écologique', emoji: '🌿', description: 'Conception architecturale durable', categorieId: 1 },
      { id: 4, nom: 'Tiny House Luxe', emoji: '🏕️', description: 'Habitat compact de haute qualité', categorieId: 1 },
    ]
  },

  // MATÉRIAUX NOBLES ET LOCAUX
  {
    id: 2,
    nom: 'Matériaux Nobles et Locaux',
    emoji: '🌳',
    description: 'Matériaux naturels, durables et de proximité',
    position: [-5, 0, 0],
    sousCategories: [
      { id: 5, nom: 'Bois Massif Local', emoji: '🪵', description: 'Bois de la région', categorieId: 2 },
      { id: 6, nom: 'Chêne Français', emoji: '🌰', description: 'Chêne de nos forêts françaises', categorieId: 2 },
      { id: 7, nom: 'Chanvre Français', emoji: '🌾', description: 'Chanvre cultivé en France', categorieId: 2 },
      { id: 8, nom: 'Terre Crue', emoji: '🏺', description: 'Terre locale non cuite', categorieId: 2 },
      { id: 9, nom: 'Pierre Naturelle', emoji: '🪨', description: 'Pierres de carrières locales', categorieId: 2 },
      { id: 10, nom: 'Marbre', emoji: '⚪', description: 'Marbre français et européen', categorieId: 2 },
    ]
  },

  // ÉNERGIE AUTONOME
  {
    id: 3,
    nom: 'Énergie Autonome',
    emoji: '⚡',
    description: 'Solutions pour l\'autonomie énergétique',
    position: [0, 0, 0],
    sousCategories: [
      { id: 11, nom: 'Solaire Premium', emoji: '☀️', description: 'Panneaux photovoltaïques haut rendement', categorieId: 3 },
      { id: 12, nom: 'Batteries Intelligentes', emoji: '🔋', description: 'Stockage d\'énergie nouvelle génération', categorieId: 3 },
      { id: 13, nom: 'Éoliennes Design', emoji: '💨', description: 'Petit éolien esthétique', categorieId: 3 },
      { id: 14, nom: 'Poêles Haut Rendement', emoji: '🔥', description: 'Chauffage au bois haute performance', categorieId: 3 },
      { id: 15, nom: 'Domotique Énergétique', emoji: '🏠', description: 'Gestion intelligente de l\'énergie', categorieId: 3 },
    ]
  },

  // EAU ET TRAITEMENT LOCAL
  {
    id: 4,
    nom: 'Eau et Traitement Local',
    emoji: '💧',
    description: 'Gestion autonome et traitement de l\'eau',
    position: [5, 0, 0],
    sousCategories: [
      { id: 16, nom: 'Filtration Haut de Gamme', emoji: '🔬', description: 'Systèmes de filtration avancés', categorieId: 4 },
      { id: 17, nom: 'Osmose Inverse', emoji: '💎', description: 'Purification maximale de l\'eau', categorieId: 4 },
      { id: 18, nom: 'Récupération d\'Eau', emoji: '🌧️', description: 'Collecte et stockage eau de pluie', categorieId: 4 },
      { id: 19, nom: 'Purification Naturelle', emoji: '🌿', description: 'Traitement écologique de l\'eau', categorieId: 4 },
    ]
  },

  // AUTONOMIE ALIMENTAIRE
  {
    id: 5,
    nom: 'Autonomie Alimentaire',
    emoji: '🌱',
    description: 'Produire son alimentation locale et saine',
    position: [10, 0, 0],
    sousCategories: [
      { id: 20, nom: 'Potagers Terroir', emoji: '🥬', description: 'Potagers productifs et esthétiques', categorieId: 5 },
      { id: 21, nom: 'Serres Premium', emoji: '🏡', description: 'Serres de culture haut de gamme', categorieId: 5 },
      { id: 22, nom: 'Outils Artisans', emoji: '🛠️', description: 'Outils de jardin professionnels', categorieId: 5 },
      { id: 23, nom: 'Verger Régional', emoji: '🍎', description: 'Arbres fruitiers locaux', categorieId: 5 },
      { id: 24, nom: 'Ruches Locales', emoji: '🐝', description: 'Apiculture naturelle', categorieId: 5 },
      { id: 25, nom: 'Poulaillers Premium', emoji: '🐔', description: 'Poulaillers design et fonctionnels', categorieId: 5 },
    ]
  },

  // PLANTES & VÉGÉTAUX
  {
    id: 6,
    nom: 'Plantes & Végétaux',
    emoji: '🌿',
    description: 'Plantes, arbres et végétaux pour l\'autonomie',
    position: [-10, 0, -10],
    sousCategories: [
      { id: 26, nom: 'Semences Anciennes', emoji: '🌾', description: 'Graines anciennes et variétés paysannes', categorieId: 6 },
      { id: 27, nom: 'Légumes Anciens', emoji: '🥕', description: 'Légumes traditionnels et variétés oubliées', categorieId: 6 },
      { id: 28, nom: 'Aromatiques Régionales', emoji: '🌿', description: 'Herbes aromatiques du terroir', categorieId: 6 },
      { id: 29, nom: 'Fruitiers Anciens', emoji: '🍏', description: 'Arbres fruitiers variétés anciennes', categorieId: 6 },
      { id: 30, nom: 'Arbres Locaux', emoji: '🌳', description: 'Essences locales pour haies', categorieId: 6 },
      { id: 31, nom: 'Plantes Médicinales', emoji: '🌸', description: 'Plantes à vertus thérapeutiques', categorieId: 6 },
    ]
  },

  // ARTISANAT LOCAL PREMIUM
  {
    id: 7,
    nom: 'Artisanat Local Premium',
    emoji: '🎨',
    description: 'Créations artisanales de qualité',
    position: [-5, 0, -10],
    sousCategories: [
      { id: 32, nom: 'Menuiserie', emoji: '🪚', description: 'Créations bois sur-mesure', categorieId: 7 },
      { id: 33, nom: 'Métallerie', emoji: '⚒️', description: 'Ferronnerie et métallerie d\'art', categorieId: 7 },
      { id: 34, nom: 'Céramique', emoji: '🏺', description: 'Poterie et céramique artisanale', categorieId: 7 },
      { id: 35, nom: 'Cuir', emoji: '👜', description: 'Maroquinerie artisanale', categorieId: 7 },
      { id: 36, nom: 'Vannerie', emoji: '🧺', description: 'Travail de l\'osier', categorieId: 7 },
      { id: 37, nom: 'Tissage', emoji: '🧶', description: 'Textiles tissés main', categorieId: 7 },
    ]
  },

  // ART DE VIVRE LOCAL
  {
    id: 8,
    nom: 'Art de Vivre Local',
    emoji: '🏡',
    description: 'Décoration et accessoires authentiques',
    position: [0, 0, -10],
    sousCategories: [
      { id: 38, nom: 'Décoration Naturelle', emoji: '🌿', description: 'Objets déco en matériaux naturels', categorieId: 8 },
      { id: 39, nom: 'Mobilier Sur-Mesure', emoji: '🪑', description: 'Meubles créés par artisans locaux', categorieId: 8 },
      { id: 40, nom: 'Luminaires Artisanaux', emoji: '💡', description: 'Éclairage artisanal et design', categorieId: 8 },
      { id: 41, nom: 'Parfums de Maison', emoji: '🕯️', description: 'Senteurs naturelles et locales', categorieId: 8 },
      { id: 42, nom: 'Accessoires Nobles', emoji: '🎁', description: 'Petits objets de qualité', categorieId: 8 },
    ]
  },

  // GASTRONOMIE DU TERROIR
  {
    id: 9,
    nom: 'Gastronomie du Terroir',
    emoji: '🍷',
    description: 'Produits gastronomiques d\'exception',
    position: [5, 0, -10],
    sousCategories: [
      { id: 43, nom: 'Boulangerie Artisanale', emoji: '🥖', description: 'Pain au levain et viennoiseries', categorieId: 9 },
      { id: 44, nom: 'Pâtisserie Fine', emoji: '🧁', description: 'Gâteaux et pâtisseries artisanales', categorieId: 9 },
      { id: 45, nom: 'Fromagerie Fermière', emoji: '🧀', description: 'Fromages fermiers au lait cru', categorieId: 9 },
      { id: 46, nom: 'Boucherie Locale', emoji: '🥩', description: 'Viandes d\'éleveurs locaux', categorieId: 9 },
      { id: 47, nom: 'Charcuterie Artisanale', emoji: '🥓', description: 'Saucissons, jambons et terrines', categorieId: 9 },
      { id: 48, nom: 'Poissonnerie', emoji: '🐟', description: 'Poissons frais et fruits de mer', categorieId: 9 },
      { id: 49, nom: 'Primeur Bio', emoji: '🥕', description: 'Fruits et légumes bio du terroir', categorieId: 9 },
      { id: 50, nom: 'Épicerie Fine', emoji: '🫙', description: 'Huiles, condiments et conserves', categorieId: 9 },
      { id: 51, nom: 'Vins & Spiritueux', emoji: '🍷', description: 'Vins de vignerons et spiritueux', categorieId: 9 },
      { id: 52, nom: 'Champagne Bio', emoji: '🍾', description: 'Champagnes et effervescents premium', categorieId: 9 },
      { id: 53, nom: 'Miel & Produits de la Ruche', emoji: '🍯', description: 'Miels, pollen, propolis', categorieId: 9 },
      { id: 54, nom: 'Café Torréfié', emoji: '☕', description: 'Torréfaction artisanale sur place', categorieId: 9 },
      { id: 55, nom: 'Thés & Tisanes', emoji: '🍵', description: 'Thés biologiques et tisanes locales', categorieId: 9 },
      { id: 56, nom: 'Chocolaterie', emoji: '🍫', description: 'Chocolat bean-to-bar artisanal', categorieId: 9 },
      { id: 57, nom: 'Confiserie Artisanale', emoji: '🍬', description: 'Bonbons et confiseries maison', categorieId: 9 },
      { id: 58, nom: 'Crémerie & Laiterie', emoji: '🥛', description: 'Lait, beurre et crème fermiers', categorieId: 9 },
    ]
  },

  // EXPÉRIENCE & PROXIMITÉ
  {
    id: 10,
    nom: 'Expérience & Proximité',
    emoji: '🌍',
    description: 'Rencontres, découvertes et expériences locales',
    position: [10, 0, -10],
    sousCategories: [
      { id: 51, nom: 'Circuit Court', emoji: '🚜', description: 'Achat direct producteur', categorieId: 10 },
      { id: 52, nom: 'Rencontre Producteurs', emoji: '👨‍🌾', description: 'Échanges avec les artisans', categorieId: 10 },
      { id: 53, nom: 'Visite Atelier', emoji: '🛠️', description: 'Découverte des ateliers', categorieId: 10 },
      { id: 54, nom: 'Découverte Terroir', emoji: '🍷', description: 'Expériences gastronomiques', categorieId: 10 },
      { id: 55, nom: 'Produits Régionaux', emoji: '🏡', description: 'Sélection de produits du territoire', categorieId: 10 },
    ]
  },
];

export const VILLAGE_SHOPS: Shop[] = [
  // PLACE DU MARCHÉ - Produits du terroir
  {
    id: 1,
    nom: 'Étal de Fruits & Légumes',
    type: ShopType.MARCHE,
    categorie: ProductCategory.TERROIR,
    position: [-5, 0, 0],
    description: 'Fruits et légumes frais du terroir',
    produits: [],
    artisan: {
      nom: 'Pierre le Maraîcher',
      metier: 'Maraîcher',
      histoire: 'Cultivateur passionné depuis trois générations'
    }
  },
  {
    id: 2,
    nom: 'Fromagerie & Charcuterie',
    type: ShopType.MARCHE,
    categorie: ProductCategory.TERROIR,
    position: [5, 0, 0],
    description: 'Fromages affinés et charcuterie artisanale',
    produits: [],
    artisan: {
      nom: 'Marie la Fromagère',
      metier: 'Fromagère',
      histoire: 'Maître affineur depuis 20 ans'
    }
  },
  {
    id: 3,
    nom: 'Cave à Vins & Miels',
    type: ShopType.MARCHE,
    categorie: ProductCategory.TERROIR,
    position: [0, 0, 3],
    description: 'Vins de terroir et miels artisanaux',
    produits: [],
    artisan: {
      nom: 'Jacques le Vigneron',
      metier: 'Vigneron',
      histoire: 'Passionné de viticulture et apiculture'
    }
  },

  // QUARTIER DES ARTISANS - Construction
  {
    id: 4,
    nom: 'Forge du Village',
    type: ShopType.FORGERON,
    categorie: ProductCategory.CONSTRUCTION,
    position: [-15, 0, -8],
    description: 'Outils et ferronnerie pour la construction',
    produits: [],
    artisan: {
      nom: 'Bertrand le Forgeron',
      metier: 'Maître forgeron',
      histoire: 'Forge le fer depuis son jeune âge'
    }
  },
  {
    id: 5,
    nom: 'Atelier du Charpentier',
    type: ShopType.CHARPENTIER,
    categorie: ProductCategory.CONSTRUCTION,
    position: [-12, 0, -12],
    description: 'Bois de charpente et menuiserie',
    produits: [],
    artisan: {
      nom: 'Guillaume le Charpentier',
      metier: 'Maître charpentier',
      histoire: 'Artisan du bois de père en fils'
    }
  },
  {
    id: 6,
    nom: 'Taillerie de Pierre',
    type: ShopType.TAILLEUR_PIERRE,
    categorie: ProductCategory.CONSTRUCTION,
    position: [-18, 0, -12],
    description: 'Pierre de taille, chaux et matériaux nobles',
    produits: [],
    artisan: {
      nom: 'Thomas le Tailleur',
      metier: 'Maître tailleur de pierre',
      histoire: 'Bâtisseur des plus belles demeures'
    }
  },

  // QUARTIER LUXE - Produits de prestige
  {
    id: 7,
    nom: "Atelier de l'Orfèvre",
    type: ShopType.ORFEVRE,
    categorie: ProductCategory.LUXE,
    position: [15, 0, -8],
    description: 'Objets précieux et parures raffinées',
    produits: [],
    artisan: {
      nom: 'Édouard le Maître Orfèvre',
      metier: 'Orfèvre joaillier',
      histoire: 'Créateur de pièces uniques pour la noblesse'
    }
  },
  {
    id: 8,
    nom: 'Draperie Royale',
    type: ShopType.DRAPIER,
    categorie: ProductCategory.LUXE,
    position: [18, 0, -12],
    description: 'Étoffes précieuses et tapisseries',
    produits: [],
    artisan: {
      nom: 'Catherine la Drapière',
      metier: 'Maître drapier',
      histoire: 'Tisseuse des plus beaux tissus du royaume'
    }
  },

  // ABBAYE - Prestige & éditions limitées
  {
    id: 9,
    nom: "L'Abbaye Royale",
    type: ShopType.ABBAYE,
    categorie: ProductCategory.PRESTIGE,
    position: [0, 0, -30],
    description: 'Collections exclusives et produits de prestige',
    produits: [],
    artisan: {
      nom: 'Frère Antoine',
      metier: 'Gardien du patrimoine',
      histoire: 'Conservateur des trésors royaux et reliques'
    }
  }
];

export const MEDIEVAL_COLORS = {
  stone: {
    light: '#c2b280',
    medium: '#8b7355',
    dark: '#6b5a47'
  },
  wood: {
    light: '#bfa77a',
    medium: '#8b5a2b',
    dark: '#5c3a1e'
  },
  roof: {
    tiles: '#8b4513',
    slate: '#4a5568'
  },
  market: {
    canvas: '#f4e4c1',
    wood: '#a0522d'
  },
  royal: {
    gold: '#ffd700',
    blue: '#1e3a8a',
    white: '#f8f8f8'
  },
  nature: {
    grass: '#5a7c3e',
    dirt: '#8b7355',
    cobblestone: '#6b7280'
  }
};
