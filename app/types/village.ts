export enum ProductCategory {
  TERROIR = 'terroir',
  CONSTRUCTION = 'construction',
  LUXE = 'luxe',
  PRESTIGE = 'prestige'
}

export enum ShopType {
  MARCHE = 'marche',
  FORGERON = 'forgeron',
  CHARPENTIER = 'charpentier',
  TAILLEUR_PIERRE = 'tailleur_pierre',
  ORFEVRE = 'orfevre',
  DRAPIER = 'drapier',
  ABBAYE = 'abbaye'
}

export interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image?: string;
  categorie: ProductCategory;
  shopType: ShopType;
  stock: number;
  enVedette?: boolean;
}

export interface Shop {
  id: number;
  nom: string;
  type: ShopType;
  categorie: ProductCategory;
  position: [number, number, number];
  description: string;
  produits: Product[];
  artisan?: {
    nom: string;
    metier: string;
    histoire: string;
  };
}

export interface VillageLayout {
  porteForifiee: [number, number, number];
  routePavee: Array<[number, number, number]>;
  placeMarche: [number, number, number];
  quartierArtisans: [number, number, number];
  quartierLuxe: [number, number, number];
  abbaye: [number, number, number];
}
