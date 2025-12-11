import { BaseService } from './BaseService';
import type { Panier, AjoutPanierData } from './types';

class PanierServiceClass extends BaseService {
  /**
   * Récupère le panier actuel de l'utilisateur
   * GET /api/<pk_client>/panier
   */
  async getPanier(clientId?: number): Promise<Panier> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }
      return await this.get<Panier>(`api/${pk}/panier/`);
    } catch (error: any) {
      console.error("Erreur lors de la récupération du panier:", error.message);
      throw new Error(error.message || "Erreur de récupération du panier");
    }
  }

  /**
   * Émet un événement de mise à jour du panier
   * @private
   */
  private emitCartUpdate(count: number): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('cart-updated', {
        detail: { count }
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * Ajoute un produit au panier
   * POST /api/<pk_client>/panier
   */
  async ajouterProduit(produitId: number, quantite: number = 1, clientId?: number): Promise<Panier> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      console.log('[PanierService] Ajout produit:', {
        produitId,
        quantite,
        clientId: pk,
        endpoint: `api/${pk}/panier/`
      });

      const panier = await this.post<Panier>(`api/${pk}/panier/`, {
        produit_id: produitId,
        quantite: quantite,
      });

      // Émettre l'événement de mise à jour avec le nombre total d'items
      this.emitCartUpdate(this.getTotalItems(panier));

      return panier;
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du produit au panier:", error.message);
      throw new Error(error.message || "Erreur d'ajout au panier");
    }
  }

  /**
   * Met à jour la quantité d'une ligne de panier
   * PUT /api/<pk_client>/panier/<pk_ligne>
   */
  async updateLignePanier(ligneId: number, quantite: number, clientId?: number): Promise<any> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      const result = await this.put<any>(`api/${pk}/panier/${ligneId}/`, {
        quantite: quantite,
      });

      // Récupérer le panier mis à jour et émettre l'événement
      const panier = await this.getPanier(pk);
      this.emitCartUpdate(this.getTotalItems(panier));

      return result;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la ligne panier:", error.message);
      throw new Error(error.message || "Erreur de mise à jour");
    }
  }

  /**
   * Modifie la quantité d'une ligne de panier (alias pour la compatibilité)
   * PUT /api/<pk_client>/panier/<pk_ligne>
   */
  async modifierQuantite(ligneId: number, quantite: number, clientId?: number): Promise<any> {
    return this.updateLignePanier(ligneId, quantite, clientId);
  }

  /**
   * Supprime une ligne du panier
   * DELETE /api/<pk_client>/panier/<pk_ligne>
   */
  async supprimerLignePanier(ligneId: number, clientId?: number): Promise<void> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      await this.delete<void>(`api/${pk}/panier/${ligneId}/`);
      console.log("Ligne du panier supprimée avec succès.");

      // Récupérer le panier mis à jour et émettre l'événement
      const panier = await this.getPanier(pk);
      this.emitCartUpdate(this.getTotalItems(panier));
    } catch (error: any) {
      console.error("Erreur lors de la suppression de la ligne panier:", error.message);
      throw new Error(error.message || "Erreur de suppression");
    }
  }

  /**
   * Retire un produit du panier (alias pour la compatibilité)
   * DELETE /api/<pk_client>/panier/<pk_ligne>
   */
  async retirerProduit(ligneId: number, clientId?: number): Promise<void> {
    return this.supprimerLignePanier(ligneId, clientId);
  }

  /**
   * Vide complètement le panier
   * Supprime toutes les lignes du panier
   */
  async viderPanier(clientId?: number): Promise<Panier> {
    try {
      const panier = await this.getPanier(clientId);
      const pk = clientId || this.getClientId();

      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      // Supprime chaque ligne du panier
      for (const ligne of panier.lignes) {
        await this.supprimerLignePanier(ligne.pk || ligne.id, pk);
      }

      // Retourne le panier vide
      return await this.getPanier(pk);
    } catch (error: any) {
      console.error("Erreur lors du vidage du panier:", error.message);
      throw new Error(error.message || "Erreur de vidage du panier");
    }
  }

  /**
   * Incrémente la quantité d'un produit dans le panier
   */
  async incrementerQuantite(ligneId: number, quantiteActuelle: number, clientId?: number): Promise<any> {
    return this.updateLignePanier(ligneId, quantiteActuelle + 1, clientId);
  }

  /**
   * Décrémente la quantité d'un produit dans le panier
   */
  async decrementerQuantite(ligneId: number, quantiteActuelle: number, clientId?: number): Promise<any> {
    if (quantiteActuelle <= 1) {
      // Si la quantité est 1, on supprime la ligne
      await this.supprimerLignePanier(ligneId, clientId);
      return null;
    }
    return this.updateLignePanier(ligneId, quantiteActuelle - 1, clientId);
  }

  /**
   * Calcule le total du panier
   */
  calculateTotal(panier: Panier): number {
    return panier.lignes.reduce((total, ligne) => {
      return total + (ligne.prix_unitaire * ligne.quantite);
    }, 0);
  }

  /**
   * Calcule le nombre total d'articles dans le panier
   */
  getTotalItems(panier: Panier): number {
    return panier.lignes.reduce((total, ligne) => {
      return total + ligne.quantite;
    }, 0);
  }
}

export const PanierService = new PanierServiceClass();
