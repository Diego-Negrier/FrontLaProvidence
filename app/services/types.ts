// ============= AUTH TYPES =============
export interface User {
  pk: number;
  token: string;
  email: string;
  username: string;
}

export interface LoginResponse {
  token: string;
  client_id: number;
  username: string;
  email: string;
}

export interface InscriptionData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  prenom?: string;
  nom?: string;
  telephone?: string;
}

export interface InscriptionResponse {
  token: string;
  client_id: number;
  message: string;
}

// ============= CLIENT TYPES =============
export interface Client {
  pk: number;
  username: string;
  prenom: string;
  nom: string;
  email: string;
  adresse_facturation: Adresse[];
  adresse_livraison: Adresse[];
  image?: string | null;
}

export interface Adresse {
  pk: number;
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
}

export interface UpdateClientInfoData {
  prenom: string;
  nom: string;
  email: string;
}

export interface UpdateAdresseData {
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
}

export interface PasswordUpdateData {
  ancienMotDePasse: string;
  password: string;
}

// ============= PRODUIT TYPES =============
export interface Produit {
  id: number;
  pk: number; // Alias pour compatibilité
  fournisseur_nom: string;
  numero_unique: string;
  code_barre: string | null;
  reference_interne: string;
  nom: string;
  slug: string;
  description_courte: string;
  description_longue: string;
  image_principale: string | null;
  icone_produit?: string; // Icône intelligente calculée par le backend
  prix_ht: string;
  tva: string;
  stock_actuel: number;
  stock_minimum: number;
  en_promotion: boolean;
  pourcentage_promotion: string;
  statut: string;
  est_actif: boolean;
  est_nouveaute: boolean;
  est_bio: boolean;
  est_local: boolean;
  poids: string;
  unite_mesure: string;
  origine: string;
  qr_code: string;
  meta_title: string;
  meta_description: string;
  date_creation: string;
  date_modification: string;
  date_ajout_stock: string | null;
  categorie: number;
  souscategorie: number;
  soussouscategorie: number | null;
  fournisseur: number;
}

export interface SousSousCategorie {
  pk: number;
  nom: string;
  slug: string;
  description?: string;
  icone?: string;
  est_active: boolean;
  ordre: number;
  nb_produits: number;
}

export interface SousCategorie {
  pk: number;
  nom: string;
  slug: string;
  description?: string;
  icone?: string;
  est_active: boolean;
  ordre: number;
  soussouscategories: SousSousCategorie[];
  nb_produits: number;
}

export interface Categorie {
  pk: number;
  nom: string;
  slug: string;
  description?: string;
  image?: string;
  icone?: string;
  est_active: boolean;
  ordre: number;
  souscategories: SousCategorie[];
  nb_produits: number;
}

// ============= PANIER TYPES =============
export interface Panier {
  pk?: number;
  id?: number;
  lignes: LignePanier[];
  session_token?: string;
  total_quantite?: number;
  total?: number;
  total_ht?: string;
  total_tva?: string;
  total_ttc?: string;
  date_creation?: string;
}

export interface LignePanier {
  pk?: number;
  id: number;
  produit?: string | Produit; // Peut être une string ou un objet Produit complet
  produit_id?: number;
  produit_nom?: string;
  produit_image?: string;
  prix?: number;
  prix_unitaire: number;
  prix_unitaire_ttc?: string;
  quantite: number;
  image?: string;
  numero_unique?: string;
  poids?: string;
  stock?: number;
  statut?: string;
  tva?: number;
  ttc?: number;
  sous_total?: number;
  sous_total_ttc?: string;
}

export interface AjoutPanierData {
  produit_id: number;
  quantite?: number;
}

export interface LigneCommande {
  id: number;
  produit_id?: number;
  produit_nom: string;
  produit_image?: string;
  reference_produit?: string;
  quantite: number;
  prix_unitaire: number;
  prix_unitaire_ttc: string;
  sous_total: number;
  sous_total_ttc: string;
  tva?: number;
  poids?: number;
  statut?: string;
}

// ============= COMMANDE TYPES =============
export interface Commande {
  pk?: number;
  id: number;
  numero_commande: string;
  total?: number;
  montant_total_ht?: string;
  montant_total_tva?: string;
  montant_total_ttc: string;
  livreur?: string;
  statut: string;
  date_commande: string;
  date_livraison_estimee?: string;
  client?: number;
  adresse_livraison?: Adresse;
  adresse_facturation?: Adresse;
  lignes?: LignePanier[];
}

export interface CommandeData {
  commandes_en_cours: Commande[];
  historique_commandes: Commande[];
  produits_statut_liste: Statut[];
  commandes_statut_liste: Statut[];
}

export interface Statut {
  key: string;
  label: string;
}

export interface CreateCommandeData {
  adresse_livraison_id: number;
  adresse_facturation_id: number;
  livreur_id: number;
  point_relais_id?: number;
  mode_paiement: string;
}

// ============= LIVRAISON TYPES =============
export interface Livreur {
  pk: number;
  nom_entreprise: string;
  type_service: string;
  prix_livraison: number;
  delai_livraison?: string;
}

export interface PointRelais {
  pk: number;
  nom: string;
  adresse: string;
  code_postal: string;
  ville: string;
  horaires?: string;
}

export interface Tarif {
  pk: number;
  livreur: number;
  poids_min: number;
  poids_max: number;
  prix: number;
}

// ============= FOURNISSEUR TYPES =============
export interface Fournisseur {
  pk: number;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  description?: string;
  site_web?: string;
  latitude?: number;
  longitude?: number;
  metier?: string;
  date_ajoutee?: string;
}

// ============= NAVIGATION TYPES =============
export interface UserInfo {
  ip: string;
  fingerprint: string;
  ClientId: number | null;
  deviceType: string;
  currentURL: string;
  sessionStartTime: number | null;
  sessionEndTime: number | null;
  userAgent: string;
}

// ============= API TYPES =============
export interface ApiError {
  error: string;
  details?: any[];
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}
