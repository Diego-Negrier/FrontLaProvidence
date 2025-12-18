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

  // FRUITS & LÉGUMES (Backend: Cat 145)
  {
    id: 145,
    nom: 'Fruits & Légumes',
    emoji: '🥕',
    description: 'Fruits et légumes frais du terroir',
    position: [5, 0, -10],
    sousCategories: [
      { id: 43, nom: 'Primeur Bio', emoji: '🥕', description: 'Fruits et légumes bio', categorieId: 145 },
      { id: 44, nom: 'Fruits Frais', emoji: '🍎', description: 'Fruits de saison', categorieId: 145 },
    ]
  },

  // PRODUITS LAITIERS (Backend: Cat 146)
  {
    id: 146,
    nom: 'Produits laitiers',
    emoji: '🧀',
    description: 'Fromages fermiers et produits laitiers',
    position: [10, 0, -10],
    sousCategories: [
      { id: 45, nom: 'Fromagerie', emoji: '🧀', description: 'Fromages fermiers', categorieId: 146 },
      { id: 58, nom: 'Crèmerie', emoji: '🥛', description: 'Lait, beurre et crème', categorieId: 146 },
    ]
  },

  // BOULANGERIE (Backend: Cat 147)
  {
    id: 147,
    nom: 'Boulangerie',
    emoji: '🥖',
    description: 'Pains et viennoiseries artisanales',
    position: [-10, 0, -10],
    sousCategories: [
      { id: 46, nom: 'Boulangerie Artisanale', emoji: '🥖', description: 'Pain au levain', categorieId: 147 },
      { id: 47, nom: 'Viennoiseries', emoji: '🥐', description: 'Croissants et brioches', categorieId: 147 },
      { id: 48, nom: 'Pâtisserie', emoji: '🧁', description: 'Gâteaux et tartes', categorieId: 147 },
    ]
  },

  // ÉPICERIE (Backend: Cat 148)
  {
    id: 148,
    nom: 'Épicerie',
    emoji: '🫙',
    description: 'Produits d\'épicerie fine',
    position: [-5, 0, -10],
    sousCategories: [
      { id: 49, nom: 'Épicerie Fine', emoji: '🫙', description: 'Huiles, condiments et conserves', categorieId: 148 },
      { id: 53, nom: 'Miel & Confiture', emoji: '🍯', description: 'Miels et confitures artisanales', categorieId: 148 },
    ]
  },

  // BOISSONS (Backend: Cat 149)
  {
    id: 149,
    nom: 'Boissons',
    emoji: '🍷',
    description: 'Vins, spiritueux et boissons',
    position: [0, 0, -10],
    sousCategories: [
      { id: 50, nom: 'Vins', emoji: '🍷', description: 'Vins de vignerons', categorieId: 149 },
      { id: 51, nom: 'Spiritueux', emoji: '🥃', description: 'Spiritueux artisanaux', categorieId: 149 },
      { id: 52, nom: 'Champagne', emoji: '🍾', description: 'Champagnes et effervescents', categorieId: 149 },
    ]
  },

  // VIANDES & POISSONS (Backend: Cat 150)
  {
    id: 150,
    nom: 'Viandes & Poissons',
    emoji: '🥩',
    description: 'Viandes, charcuteries et poissons',
    position: [15, 0, -10],
    sousCategories: [
      { id: 54, nom: 'Boucherie', emoji: '🥩', description: 'Viandes d\'éleveurs locaux', categorieId: 150 },
      { id: 55, nom: 'Charcuterie', emoji: '🥓', description: 'Saucissons, jambons et terrines', categorieId: 150 },
      { id: 56, nom: 'Poissonnerie', emoji: '🐟', description: 'Poissons frais', categorieId: 150 },
      { id: 57, nom: 'Volailles', emoji: '🐓', description: 'Volailles fermières', categorieId: 150 },
    ]
  },

  // SURGELÉS (Backend: Cat 151)
  {
    id: 151,
    nom: 'Surgelés',
    emoji: '❄️',
    description: 'Produits surgelés et glaces',
    position: [5, 0, -15],
    sousCategories: [
      { id: 59, nom: 'Plats Préparés', emoji: '🍝', description: 'Plats cuisinés surgelés', categorieId: 151 },
      { id: 60, nom: 'Légumes Surgelés', emoji: '🥦', description: 'Légumes surgelés', categorieId: 151 },
      { id: 61, nom: 'Glaces', emoji: '🍨', description: 'Glaces artisanales', categorieId: 151 },
      { id: 62, nom: 'Surgelés Divers', emoji: '❄️', description: 'Autres produits surgelés', categorieId: 151 },
    ]
  },

  // SNACKS & CONFISERIES (Backend: Cat 152)
  {
    id: 152,
    nom: 'Snacks & Confiseries',
    emoji: '🍬',
    description: 'Bonbons, chocolats et snacks',
    position: [-15, 0, -10],
    sousCategories: [
      { id: 63, nom: 'Confiseries', emoji: '🍬', description: 'Bonbons et confiseries', categorieId: 152 },
      { id: 64, nom: 'Chocolaterie', emoji: '🍫', description: 'Chocolats artisanaux', categorieId: 152 },
    ]
  },

  // BIO & DIÉTÉTIQUE (Backend: Cat 153)
  {
    id: 153,
    nom: 'Bio & Diététique',
    emoji: '🌱',
    description: 'Produits biologiques et diététiques',
    position: [-10, 0, -15],
    sousCategories: [
      { id: 65, nom: 'Produits Bio', emoji: '🌱', description: 'Alimentation biologique', categorieId: 153 },
      { id: 66, nom: 'Compléments', emoji: '💊', description: 'Compléments alimentaires', categorieId: 153 },
    ]
  },

  // MATÉRIAUX DE CONSTRUCTION (Backend: Cat 154)
  {
    id: 154,
    nom: 'Matériaux de Construction',
    emoji: '🏗️',
    description: 'Matériaux pour la construction',
    position: [10, 0, -15],
    sousCategories: [
      { id: 67, nom: 'Matériaux Écologiques', emoji: '🪵', description: 'Bois et matériaux éco-responsables', categorieId: 154 },
      { id: 68, nom: 'Quincaillerie', emoji: '🔨', description: 'Outils et quincaillerie', categorieId: 154 },
    ]
  },

  // ÉNERGIE & ÉCOLOGIE (Backend: Cat 155)
  {
    id: 155,
    nom: 'Énergie & Écologie',
    emoji: '☀️',
    description: 'Solutions énergétiques et écologiques',
    position: [15, 0, -15],
    sousCategories: [
      { id: 69, nom: 'Énergie Solaire', emoji: '☀️', description: 'Panneaux solaires et équipements', categorieId: 155 },
      { id: 70, nom: 'Éco-produits', emoji: '♻️', description: 'Produits écologiques', categorieId: 155 },
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
