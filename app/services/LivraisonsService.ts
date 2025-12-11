import { BaseService } from './BaseService';
import type { Livreur, PointRelais, Tarif } from './types';

class LivraisonsServiceClass extends BaseService {
  /**
   * Récupère la liste de tous les livreurs disponibles
   * GET /api/livreur/
   */
  async getLivreurs(): Promise<Livreur[]> {
    try {
      const data = await this.get<any[]>('/api/livreur/', {}, false);
      return data.map((livreur: any) => ({
        ...livreur,
        prix_livraison: parseFloat(livreur.prix_livraison),
      }));
    } catch (error: any) {
      console.error("Erreur lors de la récupération des livreurs:", error.message);
      throw new Error(error.message || "Erreur de récupération des livreurs");
    }
  }

  /**
   * Récupère les détails d'un livreur spécifique
   * GET /api/livreur/<pk>/
   */
  async getLivreurDetail(livreurId: number): Promise<Livreur> {
    try {
      const data = await this.get<any>(`/api/livreur/${livreurId}/`, {}, false);
      return {
        ...data,
        prix_livraison: parseFloat(data.prix_livraison),
      };
    } catch (error: any) {
      console.error(`Erreur lors de la récupération du livreur ${livreurId}:`, error.message);
      throw new Error(error.message || "Erreur de récupération du livreur");
    }
  }

  /**
   * Récupère les points relais disponibles
   * GET /point-relais/
   */
  async getPointsRelais(): Promise<PointRelais[]> {
    try {
      return await this.get<PointRelais[]>('/api/point-relais/', {}, false);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des points relais:", error.message);
      throw new Error(error.message || "Erreur de récupération des points relais");
    }
  }

  /**
   * Récupère les points relais par ville
   * GET /api/point-relais/?ville=<ville>
   */
  async getPointsRelaisByVille(ville: string): Promise<PointRelais[]> {
    try {
      return await this.get<PointRelais[]>('/api/point-relais/', { ville }, false);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des points relais:", error.message);
      throw new Error(error.message || "Erreur de récupération des points relais");
    }
  }

  /**
   * Récupère les points relais par code postal
   * GET /api/point-relais/?code_postal=<code_postal>
   */
  async getPointsRelaisByCodePostal(codePostal: string): Promise<PointRelais[]> {
    try {
      return await this.get<PointRelais[]>('/api/point-relais/', { code_postal: codePostal }, false);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des points relais:", error.message);
      throw new Error(error.message || "Erreur de récupération des points relais");
    }
  }

  /**
   * Récupère les détails d'un point relais spécifique
   * GET /api/point-relais/<pk>/
   */
  async getPointRelaisDetail(pointRelaisId: number): Promise<PointRelais> {
    try {
      return await this.get<PointRelais>(`/api/point-relais/${pointRelaisId}/`, {}, false);
    } catch (error: any) {
      console.error(`Erreur lors de la récupération du point relais ${pointRelaisId}:`, error.message);
      throw new Error(error.message || "Erreur de récupération du point relais");
    }
  }

  /**
   * Récupère les tarifs d'un livreur
   * GET /api/livreur/<pk>/tarifs/
   */
  async getTarifsLivreur(livreurId: number): Promise<Tarif[]> {
    try {
      return await this.get<Tarif[]>(`/api/livreur/${livreurId}/tarifs/`, {}, false);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des tarifs:", error.message);
      throw new Error(error.message || "Erreur de récupération des tarifs");
    }
  }

  /**
   * Calcule le prix de livraison en fonction du poids
   */
  calculatePrixLivraison(poids: number, tarifs: Tarif[]): number {
    const tarif = tarifs.find(t => poids >= t.poids_min && poids <= t.poids_max);
    return tarif ? tarif.prix : 0;
  }

  /**
   * Filtre les livreurs par type de service
   */
  filterLivreursByType(livreurs: Livreur[], typeService: string): Livreur[] {
    return livreurs.filter(livreur => livreur.type_service === typeService);
  }

  /**
   * Trouve le livreur le moins cher
   */
  getCheapestLivreur(livreurs: Livreur[]): Livreur | null {
    if (livreurs.length === 0) return null;
    return livreurs.reduce((cheapest, current) =>
      current.prix_livraison < cheapest.prix_livraison ? current : cheapest
    );
  }

  /**
   * Trouve le livreur le plus rapide (basé sur delai_livraison)
   */
  getFastestLivreur(livreurs: Livreur[]): Livreur | null {
    if (livreurs.length === 0) return null;
    return livreurs.reduce((fastest, current) => {
      if (!fastest.delai_livraison) return current;
      if (!current.delai_livraison) return fastest;
      return parseInt(current.delai_livraison) < parseInt(fastest.delai_livraison) ? current : fastest;
    });
  }
}

export const LivraisonsService = new LivraisonsServiceClass();
