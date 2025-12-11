import { BaseService } from './BaseService';
import type { Produit } from './types';

class ProduitsServiceClass extends BaseService {
  /**
   * Récupère la liste de tous les produits disponibles
   * GET /api/magasin
   */
  async getProduits(): Promise<Produit[]> {
    try {
      const produits = await this.get<Produit[]>('api/magasin', {}, false);
      // Si l'API retourne null ou undefined, retourner un tableau vide
      return Array.isArray(produits) ? produits : [];
    } catch (error: any) {
      console.error("Erreur lors de la récupération des produits:", error.message);
      // Retourner un tableau vide au lieu de lancer une erreur
      return [];
    }
  }

  /**
   * Récupère les détails d'un produit spécifique
   * GET /api/magasin/<pk_produit>
   */
  async getProduitDetail(produitId: number): Promise<Produit> {
    try {
      return await this.get<Produit>(`api/magasin/${produitId}`, {}, false);
    } catch (error: any) {
      console.error(`Erreur lors de la récupération du produit ${produitId}:`, error.message);
      throw new Error(error.message || "Erreur de récupération du produit");
    }
  }

  /**
   * Récupère les produits pour un client spécifique
   * GET /api/<pk_client>/magasin
   */
  async getProduitsClient(clientId?: number): Promise<Produit[]> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }
      return await this.get<Produit[]>(`api/${pk}/magasin`);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des produits du client:", error.message);
      throw new Error(error.message || "Erreur de récupération des produits");
    }
  }

  /**
   * Récupère les détails d'un produit pour un client spécifique
   * GET /api/<pk_client>/magasin/<pk_produit>
   */
  async getProduitDetailClient(produitId: number, clientId?: number): Promise<Produit> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }
      return await this.get<Produit>(`api/${pk}/magasin/${produitId}`);
    } catch (error: any) {
      console.error(`Erreur lors de la récupération du produit ${produitId} pour le client:`, error.message);
      throw new Error(error.message || "Erreur de récupération du produit");
    }
  }

  /**
   * Recherche des produits par nom, catégorie, etc.
   */
  async searchProduits(query: string): Promise<Produit[]> {
    try {
      return await this.get<Produit[]>('api/magasin', { search: query }, false);
    } catch (error: any) {
      console.error("Erreur lors de la recherche de produits:", error.message);
      throw new Error(error.message || "Erreur de recherche");
    }
  }

  /**
   * Filtre les produits par catégorie
   */
  async getProductsByCategory(categoryId: number): Promise<Produit[]> {
    try {
      return await this.get<Produit[]>('api/magasin', { categorie: categoryId }, false);
    } catch (error: any) {
      console.error("Erreur lors du filtrage par catégorie:", error.message);
      throw new Error(error.message || "Erreur de filtrage");
    }
  }

  /**
   * Filtre les produits par sous-catégorie
   */
  async getProductsBySubCategory(subCategoryId: number): Promise<Produit[]> {
    try {
      return await this.get<Produit[]>('api/magasin', { souscategorie: subCategoryId }, false);
    } catch (error: any) {
      console.error("Erreur lors du filtrage par sous-catégorie:", error.message);
      throw new Error(error.message || "Erreur de filtrage");
    }
  }
}

export const ProduitsService = new ProduitsServiceClass();
