import { BaseService } from './BaseService';
import type {
  Client,
  UpdateClientInfoData,
  UpdateAdresseData,
  PasswordUpdateData,
  Adresse
} from './types';

class ClientsServiceClass extends BaseService {
  /**
   * Récupère les détails d'un client
   * GET /api/<pk_client>/parametre
   */
  async getClient(clientId?: number): Promise<Client> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }
      return await this.get<Client>(`api/${pk}/parametre`);
    } catch (error: any) {
      console.error("Erreur lors de la récupération du client:", error.message);
      throw new Error(error.message || "Erreur de récupération du client");
    }
  }

  /**
   * Met à jour les informations du client
   * PUT /api/<pk_client>/parametre
   */
  async updateClientInfo(data: UpdateClientInfoData, clientId?: number): Promise<Client> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }
      return await this.put<Client>(`api/${pk}/parametre`, data);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du client:", error.message);
      throw new Error(error.message || "Erreur de mise à jour");
    }
  }

  // ============================================
  // ADRESSES DE FACTURATION
  // ============================================

  /**
   * Ajoute une nouvelle adresse de facturation
   * POST /api/client/update/<pk_client>/adresse_facturation/
   */
  async addAdresseFacturation(adresseData: UpdateAdresseData, clientId?: number): Promise<Adresse> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      return await this.post<Adresse>(
        `/api/client/update/${pk}/adresse_facturation/`,
        {
          adresse: adresseData.adresse,
          code_postal: adresseData.codePostal,
          ville: adresseData.ville,
          pays: adresseData.pays,
        }
      );
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'adresse de facturation:", error.message);
      throw new Error(error.message || "Erreur d'ajout de l'adresse");
    }
  }

  /**
   * Met à jour une adresse de facturation existante
   * PUT /api/client/update/<pk_client>/adresse_facturation/<adresse_id>/
   */
  async updateAdresseFacturation(
    adresseId: number,
    adresseData: UpdateAdresseData,
    clientId?: number
  ): Promise<Adresse> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      return await this.put<Adresse>(
        `/api/client/update/${pk}/adresse_facturation/${adresseId}/`,
        {
          adresse: adresseData.adresse,
          code_postal: adresseData.codePostal,
          ville: adresseData.ville,
          pays: adresseData.pays,
        }
      );
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'adresse de facturation:", error.message);
      throw new Error(error.message || "Erreur de mise à jour de l'adresse");
    }
  }

  /**
   * Supprime une adresse de facturation
   * DELETE /api/client/<pk_client>/delete_address_facturation/<adresse_id>/
   */
  async deleteAdresseFacturation(adresseId: number, clientId?: number): Promise<void> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      await this.delete<void>(`/api/client/${pk}/delete_address_facturation/${adresseId}/`);
      console.log("Adresse de facturation supprimée avec succès.");
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'adresse de facturation:", error.message);
      throw new Error(error.message || "Erreur de suppression");
    }
  }

  // ============================================
  // ADRESSES DE LIVRAISON
  // ============================================

  /**
   * Ajoute une nouvelle adresse de livraison
   * POST /api/client/update/<pk_client>/adresse_livraison/
   */
  async addAdresseLivraison(adresseData: UpdateAdresseData, clientId?: number): Promise<Adresse> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      return await this.post<Adresse>(
        `/api/client/update/${pk}/adresse_livraison/`,
        {
          adresse: adresseData.adresse,
          code_postal: adresseData.codePostal,
          ville: adresseData.ville,
          pays: adresseData.pays,
        }
      );
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'adresse de livraison:", error.message);
      throw new Error(error.message || "Erreur d'ajout de l'adresse");
    }
  }

  /**
   * Met à jour une adresse de livraison existante
   * PUT /api/client/update/<pk_client>/adresse_livraison/<adresse_id>/
   */
  async updateAdresseLivraison(
    adresseId: number,
    adresseData: UpdateAdresseData,
    clientId?: number
  ): Promise<Adresse> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      return await this.put<Adresse>(
        `/api/client/update/${pk}/adresse_livraison/${adresseId}/`,
        {
          adresse: adresseData.adresse,
          code_postal: adresseData.codePostal,
          ville: adresseData.ville,
          pays: adresseData.pays,
        }
      );
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'adresse de livraison:", error.message);
      throw new Error(error.message || "Erreur de mise à jour de l'adresse");
    }
  }

  /**
   * Supprime une adresse de livraison
   * DELETE /api/client/<pk_client>/delete_address_livraison/<adresse_id>/
   */
  async deleteAdresseLivraison(adresseId: number, clientId?: number): Promise<void> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      await this.delete<void>(`/api/client/${pk}/delete_address_livraison/${adresseId}/`);
      console.log("Adresse de livraison supprimée avec succès.");
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'adresse de livraison:", error.message);
      throw new Error(error.message || "Erreur de suppression");
    }
  }

  // ============================================
  // MOT DE PASSE
  // ============================================

  /**
   * Met à jour le mot de passe du client
   * PUT /api/client/update/password/<pk_client>/
   */
  async updatePassword(data: PasswordUpdateData, clientId?: number): Promise<any> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      const response = await this.put<any>(`/api/client/update/password/${pk}/`, data);
      console.log('Mot de passe mis à jour avec succès');
      return response;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error.message);
      throw new Error(error.message || "Erreur de mise à jour du mot de passe");
    }
  }

  // ============================================
  // FOURNISSEURS
  // ============================================

  /**
   * Récupère les fournisseurs du client
   * GET /api/<pk_client>/fournisseurs
   */
  async getFournisseurs(clientId?: number): Promise<any[]> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }
      return await this.get<any[]>(`api/${pk}/fournisseurs`);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des fournisseurs:", error.message);
      throw new Error(error.message || "Erreur de récupération des fournisseurs");
    }
  }
}

export const ClientsService = new ClientsServiceClass();
