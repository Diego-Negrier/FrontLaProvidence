/**
 * Configuration de l'API
 */

export const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8007';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: 'api/login/',
  LOGOUT: 'api/logout/',
  REGISTER: 'api/inscription/',

  // Client
  CLIENT_DETAIL: (pk: number) => `api/clients/${pk}/`,
  CLIENT_PARAMS: (pk: number) => `api/${pk}/parametre/`,

  // Panier
  PANIER: (pk: number) => `api/${pk}/panier/`,
  LIGNE_PANIER: (pkClient: number, pkLigne: number) => `api/${pkClient}/panier/${pkLigne}/`,

  // Produits
  PRODUITS: 'api/magasin/',
  PRODUIT_DETAIL: (pk: number) => `api/magasin/${pk}/`,

  // Commandes
  COMMANDES: (pk: number) => `api/${pk}/commandes/`,
  COMMANDE_DETAIL: (pkClient: number, pkCommande: number) => `api/${pkClient}/commandes/${pkCommande}/`,

  // Paiement Stripe
  STRIPE_PUBLIC_KEY: 'api/paiement/cle-publique/',
  STRIPE_CREATE_INTENT: (pk: number) => `api/${pk}/paiement/creer-intent/`,
  STRIPE_CONFIRM: (pk: number) => `api/${pk}/paiement/confirmer/`,
  STRIPE_WEBHOOK: 'api/paiement/webhook/',

  // Categories
  CATEGORIES: 'api/categories/',

  // Fournisseurs
  FOURNISSEURS: 'api/fournisseurs/',
};
