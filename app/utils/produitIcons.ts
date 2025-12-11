/**
 * Utilitaire pour obtenir l'icône intelligente d'un produit
 * basé sur son nom et ses catégories
 */

export interface ProduitForIcon {
  nom: string;
  description_courte?: string;
  image_principale?: string | null;
  est_bio?: boolean;
  est_local?: boolean;
  est_nouveaute?: boolean;
  en_promotion?: boolean;
}

/**
 * Mapping intelligent des mots-clés vers des emojis
 * Organisé par catégorie pour une meilleure reconnaissance
 */
const PRODUCT_ICONS: Record<string, string[]> = {
  // Fruits
  '🍎': ['pomme', 'golden', 'gala', 'reinette'],
  '🍊': ['orange', 'mandarine', 'clémentine', 'agrume'],
  '🍋': ['citron', 'lime'],
  '🍌': ['banane', 'plantain'],
  '🍇': ['raisin', 'vigne'],
  '🍓': ['fraise', 'framboise'],
  '🍑': ['pêche', 'abricot', 'nectarine'],
  '🍒': ['cerise'],
  '🍐': ['poire', 'williams'],
  '🥝': ['kiwi'],
  '🍉': ['pastèque', 'melon'],
  '🥭': ['mangue'],
  '🍍': ['ananas'],

  // Légumes
  '🥕': ['carotte'],
  '🥔': ['pomme de terre', 'patate'],
  '🧅': ['oignon', 'échalote'],
  '🧄': ['ail'],
  '🥒': ['concombre', 'cornichon'],
  '🥬': ['salade', 'laitue', 'endive', 'mâche', 'roquette'],
  '🥦': ['brocoli', 'chou-fleur', 'chou'],
  '🍅': ['tomate'],
  '🌶️': ['piment', 'poivron'],
  '🫑': ['poivron'],
  '🥑': ['avocat'],
  '🍆': ['aubergine'],
  '🌽': ['maïs'],
  '🥗': ['mesclun', 'mix'],

  // Pain et boulangerie
  '🥖': ['baguette', 'pain', 'ficelle'],
  '🥐': ['croissant', 'viennoiserie'],
  '🥯': ['bagel'],
  '🍞': ['pain de mie', 'pain complet', 'pain de campagne'],
  '🧇': ['gaufre'],
  '🥞': ['crêpe', 'pancake'],

  // Pâtisserie
  '🍰': ['gâteau', 'tarte', 'pâtisserie'],
  '🧁': ['cupcake', 'muffin'],
  '🍪': ['cookie', 'biscuit', 'sablé'],
  '🎂': ['génoise'],

  // Produits laitiers
  '🥛': ['lait', 'yaourt', 'yogourt'],
  '🧀': ['fromage', 'comté', 'camembert', 'brie', 'roquefort', 'chèvre', 'emmental', 'gruyère'],
  '🧈': ['beurre', 'crème'],

  // Viandes et poissons
  '🥩': ['viande', 'bœuf', 'boeuf', 'steak', 'côte'],
  '🍗': ['poulet', 'volaille', 'canard', 'dinde'],
  '🥓': ['bacon', 'lard', 'jambon'],
  '🍖': ['côtelette', 'agneau', 'mouton'],
  '🐟': ['poisson', 'truite', 'saumon'],
  '🦐': ['crevette', 'gambas'],
  '🦞': ['homard', 'langouste'],
  '🦑': ['calamar', 'encornet', 'seiche'],
  '🦪': ['huître', 'coquillage'],

  // Œufs
  '🥚': ['œuf', 'oeuf'],

  // Pâtes et céréales
  '🍝': ['pâte', 'spaghetti', 'tagliatelle', 'penne', 'fusilli', 'macaroni'],
  '🍚': ['riz', 'risotto'],
  '🥣': ['céréale', 'muesli', 'flocon'],

  // Sauces et condiments
  '🫙': ['sauce', 'ketchup', 'mayonnaise', 'moutarde', 'confiture'],
  '🫗': ['huile', 'vinaigre', 'vinaigrette'],
  '🍯': ['miel'],
  '🧂': ['sel', 'épice', 'poivre'],

  // Conserves
  '🥫': ['conserve', 'boîte', 'haricot'],

  // Boissons
  '🧃': ['jus', 'nectar'],
  '☕': ['café', 'expresso'],
  '🍵': ['thé', 'tisane', 'infusion'],
  '🥤': ['soda', 'limonade'],
  '💧': ['eau', 'minérale', 'gazeuse'],
  '🍷': ['vin', 'rouge', 'blanc', 'rosé'],
  '🍺': ['bière'],
  '🥂': ['champagne', 'mousseux'],
  '🍾': ['cidre'],

  // Snacks et sucreries
  '🍫': ['chocolat', 'cacao'],
  '🍬': ['bonbon', 'sucette'],
  '🍭': ['lollipop'],
  '🍩': ['donut', 'beignet'],
  '🥜': ['cacahuète', 'arachide', 'noisette', 'amande', 'noix'],
  '🍿': ['pop-corn', 'maïs soufflé'],

  // Plats préparés
  '🍕': ['pizza'],
  '🌮': ['taco', 'burrito'],
  '🌯': ['wrap'],
  '🥙': ['kebab', 'sandwich'],
  '🥪': ['sandwich'],
  '🌭': ['hot dog', 'saucisse'],
  '🍔': ['burger', 'hamburger'],
  '🍟': ['frite'],
  '🥗': ['salade composée'],
  '🍲': ['soupe', 'potage', 'bouillon'],

  // Desserts
  '🍨': ['glace', 'sorbet', 'crème glacée'],
  '🍧': ['granité'],
  '🍮': ['flan', 'crème caramel'],
  '🍰': ['cheesecake'],

  // Fruits secs
  '🌰': ['châtaigne', 'marron'],
  '🥥': ['noix de coco', 'coco'],

  // Herbes et aromates
  '🌿': ['herbe', 'persil', 'basilic', 'coriandre', 'menthe', 'thym', 'romarin'],
};

/**
 * Fonction principale pour obtenir l'icône intelligente d'un produit
 * @param produit - Les informations du produit
 * @returns L'emoji correspondant au produit
 */
export function getSmartProduitIcon(produit: ProduitForIcon): string {
  // Si le produit a une image, on retourne l'icône par défaut
  if (produit.image_principale && produit.image_principale !== '📦') {
    return '📦'; // Ne sera pas utilisé car l'image sera affichée
  }

  // Normaliser le nom du produit pour la recherche
  const normalizedName = produit.nom.toLowerCase();
  const normalizedDesc = produit.description_courte?.toLowerCase() || '';
  const searchText = `${normalizedName} ${normalizedDesc}`;

  // Chercher une correspondance dans le mapping
  for (const [emoji, keywords] of Object.entries(PRODUCT_ICONS)) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return emoji;
      }
    }
  }

  // Fallback basé sur les attributs du produit
  if (produit.est_bio) return '🌱';
  if (produit.est_local) return '🏡';
  if (produit.est_nouveaute) return '✨';
  if (produit.en_promotion) return '🏷️';

  // Icône par défaut
  return '📦';
}

/**
 * Fonction pour obtenir l'icône d'un produit (ancien système)
 * Conservée pour compatibilité
 */
export function getProduitIcon(produit: ProduitForIcon): string {
  return getSmartProduitIcon(produit);
}

/**
 * Fonction pour vérifier si une URL d'image est valide
 */
export function isValidImageUrl(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return false;
  if (imageUrl === '📦') return false;
  return imageUrl.startsWith('http://') || imageUrl.startsWith('https://');
}
