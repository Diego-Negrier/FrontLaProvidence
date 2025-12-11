import { BaseService } from './BaseService';
import type { Categorie, SousCategorie, SousSousCategorie } from './types';

class CategoriesServiceClass extends BaseService {
  /**
   * Récupère la liste de toutes les catégories avec leurs sous-catégories
   * GET /api/categories
   */
  async getCategories(): Promise<Categorie[]> {
    try {
      const categories = await this.get<Categorie[]>('api/categories', {}, false);
      return Array.isArray(categories) ? categories : [];
    } catch (error: any) {
      console.error("Erreur lors de la récupération des catégories:", error.message);
      return [];
    }
  }
}

export const CategoriesService = new CategoriesServiceClass();
