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
