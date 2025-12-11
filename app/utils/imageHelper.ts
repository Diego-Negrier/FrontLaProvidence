/**
 * Helper pour gérer les images de produits avec fallback
 */

/**
 * Vérifie si l'image_principale est une URL valide ou une icône
 * @param imagePrincipale - L'URL de l'image ou une icône (ex: "📦")
 * @returns true si c'est une URL valide, false si c'est une icône
 */
export const isValidImageUrl = (imagePrincipale: string | null): boolean => {
  if (!imagePrincipale) return false;

  // Vérifier si c'est une URL (commence par http:// ou https://)
  return imagePrincipale.startsWith('http://') || imagePrincipale.startsWith('https://');
};

/**
 * Récupère l'icône par défaut pour un produit sans image
 * @param imagePrincipale - La valeur du champ image_principale
 * @returns L'icône à afficher (ex: "📦")
 */
export const getDefaultIcon = (imagePrincipale: string | null): string => {
  // Si c'est déjà une icône (emoji), la retourner
  if (imagePrincipale && !isValidImageUrl(imagePrincipale)) {
    return imagePrincipale;
  }
  // Sinon retourner l'icône par défaut
  return "📦";
};

/**
 * Composant helper pour afficher une image de produit avec fallback
 * Usage:
 *
 * const ImageProduit = ({ produit }: { produit: Produit }) => {
 *   if (isValidImageUrl(produit.image_principale)) {
 *     return (
 *       <img
 *         src={produit.image_principale}
 *         alt={produit.nom}
 *         onError={(e) => {
 *           // Si l'image ne charge pas, afficher l'icône
 *           e.currentTarget.style.display = 'none';
 *           const parent = e.currentTarget.parentElement;
 *           if (parent) {
 *             parent.innerHTML = `<div class="flex items-center justify-center text-6xl">${getDefaultIcon(produit.image_principale)}</div>`;
 *           }
 *         }}
 *       />
 *     );
 *   } else {
 *     return (
 *       <div className="flex items-center justify-center text-6xl">
 *         {getDefaultIcon(produit.image_principale)}
 *       </div>
 *     );
 *   }
 * };
 */

/**
 * Crée un objet de style pour afficher une image ou une icône
 * @param imagePrincipale - L'URL de l'image ou une icône
 * @returns Objet de style React
 */
export const getImageStyle = (imagePrincipale: string | null) => {
  if (isValidImageUrl(imagePrincipale)) {
    return {
      backgroundImage: `url(${imagePrincipale})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
  };
};
