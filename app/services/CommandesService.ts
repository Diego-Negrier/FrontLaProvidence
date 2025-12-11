import { BaseService } from './BaseService';
import type { Commande, CommandeData, CreateCommandeData } from './types';

class CommandesServiceClass extends BaseService {
  /**
   * Récupère toutes les commandes d'un client
   * GET /api/<pk_client>/commandes
   */
  async getCommandes(clientId?: number): Promise<CommandeData> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }
      return await this.get<CommandeData>(`api/${pk}/commandes/`);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des commandes:", error.message);
      throw new Error(error.message || "Erreur de récupération des commandes");
    }
  }

  /**
   * Récupère les détails d'une commande spécifique
   * GET /api/<pk_client>/commandes/<pk_commande>
   */
  async getCommandeDetail(commandeId: number, clientId?: number): Promise<Commande> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }
      return await this.get<Commande>(`api/${pk}/commandes/${commandeId}/`);
    } catch (error: any) {
      console.error(`Erreur lors de la récupération de la commande ${commandeId}:`, error.message);
      throw new Error(error.message || "Erreur de récupération de la commande");
    }
  }

  /**
   * Crée une nouvelle commande à partir du panier actuel
   * POST /api/<pk_client>/commandes
   */
  async createCommande(commandeData: CreateCommandeData, clientId?: number): Promise<Commande> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      return await this.post<Commande>(`api/${pk}/commandes/`, commandeData);
    } catch (error: any) {
      console.error("Erreur lors de la création de la commande:", error.message);
      throw new Error(error.message || "Erreur de création de la commande");
    }
  }

  /**
   * Annule une commande (si le statut le permet)
   * PUT /api/<pk_client>/commandes/<pk_commande>
   */
  async annulerCommande(commandeId: number, clientId?: number): Promise<Commande> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      return await this.put<Commande>(`api/${pk}/commandes/${commandeId}/`, {
        statut: 'ANNULEE'
      });
    } catch (error: any) {
      console.error("Erreur lors de l'annulation de la commande:", error.message);
      throw new Error(error.message || "Erreur d'annulation");
    }
  }

  /**
   * Filtre les commandes par statut
   */
  filterCommandesByStatut(commandes: Commande[], statut: string): Commande[] {
    return commandes.filter(commande => commande.statut === statut);
  }

  /**
   * Filtre les commandes en cours
   */
  getCommandesEnCours(commandeData: CommandeData): Commande[] {
    return commandeData.commandes_en_cours;
  }

  /**
   * Récupère l'historique des commandes
   */
  getHistoriqueCommandes(commandeData: CommandeData): Commande[] {
    return commandeData.historique_commandes;
  }

  /**
   * Calcule le total d'une commande
   */
  calculateTotal(commande: Commande): number {
    if (commande.lignes) {
      return commande.lignes.reduce((total, ligne) => {
        return total + (ligne.prix_unitaire * ligne.quantite);
      }, 0);
    }
    return commande.total;
  }

  /**
   * Vérifie si une commande peut être annulée
   */
  canBeCancelled(commande: Commande): boolean {
    const cancelableStatuts = ['EN_ATTENTE', 'CONFIRMEE'];
    return cancelableStatuts.includes(commande.statut);
  }

  /**
   * Récupère le libellé d'un statut
   */
  getStatutLabel(statutKey: string, commandeData: CommandeData): string {
    const statut = commandeData.commandes_statut_liste.find(s => s.key === statutKey);
    return statut ? statut.label : statutKey;
  }
}

export const CommandesService = new CommandesServiceClass();
