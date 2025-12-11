import { BaseService } from './BaseService';
import type { Fournisseur } from './types';

class FournisseursServiceClass extends BaseService {
  /**
   * Récupère la liste de tous les fournisseurs
   * GET /api/fournisseurs
   */
  async getFournisseurs(): Promise<Fournisseur[]> {
    try {
      const fournisseurs = await this.get<Fournisseur[]>('api/fournisseurs', {}, false);
      return Array.isArray(fournisseurs) ? fournisseurs : [];
    } catch (error: any) {
      console.error("Erreur lors de la récupération des fournisseurs:", error.message);
      return [];
    }
  }
}

export const FournisseursService = new FournisseursServiceClass();
