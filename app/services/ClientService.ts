import { BaseService } from './BaseService';

export interface Client {
  pk: number;
  id: number;
  username: string;
  email: string;
  prenom?: string;
  nom?: string;
  telephone?: string;
  adresse_livraison: AdresseLivraison[];
  adresse_facturation: AdresseFacturation[];
  [key: string]: any;
}

export interface Adresse {
  pk?: number;
  id?: number;
  adresse: string;
  ville: string;
  codePostal?: string;
  code_postal?: string;
  pays: string;
}

export type AdresseLivraison = Adresse;
export type AdresseFacturation = Adresse;

export interface PasswordChangeData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

type AdresseType = 'livraison' | 'facturation';

class ClientsServiceClass extends BaseService {
  private readonly ENDPOINTS = {
    client: (pk: number) => `/api/${pk}/parametre/`,
    adressesLivraison: (pk: number) => `/api/client/update/${pk}/adresse_livraison/`,
    adresseLivraison: (pk: number, adressePk: number) => 
      `/api/client/update/${pk}/adresse_livraison/${adressePk}/`,
    adressesFacturation: (pk: number) => `/api/client/update/${pk}/adresse_facturation/`,
    adresseFacturation: (pk: number, adressePk: number) => 
      `/api/client/update/${pk}/adresse_facturation/${adressePk}/`,
    password: (pk: number) => `/api/client/update/${pk}/password/`,
  } as const;

  /**
   * Normalise les données d'adresse (camelCase -> snake_case)
   */
  private normalizeAdresseData(adresse: Partial<Adresse>): any {
    const normalized: any = {};
    
    if (adresse.adresse !== undefined) normalized.adresse = adresse.adresse;
    if (adresse.ville !== undefined) normalized.ville = adresse.ville;
    if (adresse.pays !== undefined) normalized.pays = adresse.pays;
    if (adresse.code_postal !== undefined || adresse.codePostal !== undefined) {
      normalized.code_postal = adresse.code_postal || adresse.codePostal;
    }

    return normalized;
  }

  /**
   * Gestion centralisée des erreurs
   */
  private handleError(operation: string, error: any): never {
    const message = error.message || `Erreur lors de ${operation}`;
    console.error(`Erreur - ${operation}:`, error);
    throw new Error(message);
  }

  /**
   * Valide et récupère l'ID client
   */
  private validateClientId(clientId?: number): number {
    const pk = clientId || this.getClientId();
    if (!pk) {
      throw new Error("L'identifiant du client est introuvable.");
    }
    return pk;
  }

  // ============================================
  // CLIENT
  // ============================================

  /**
   * Récupère les informations complètes d'un client
   * GET /api/<pk_client>/parametre/
   */
  async getClient(clientId?: number): Promise<Client> {
    try {
      const pk = this.validateClientId(clientId);
      return await this.get<Client>(this.ENDPOINTS.client(pk));
    } catch (error: any) {
      this.handleError('récupération du client', error);
    }
  }

  /**
   * Met à jour les paramètres généraux du client
   * PUT /api/<pk_client>/parametre/
   */
  async updateClient(data: Partial<Client>, clientId?: number): Promise<Client> {
    try {
      const pk = this.validateClientId(clientId);
      return await this.put<Client>(this.ENDPOINTS.client(pk), data);
    } catch (error: any) {
      this.handleError('mise à jour du client', error);
    }
  }

  // ============================================
  // ADRESSES - Méthodes génériques
  // ============================================

  /**
   * Récupère toutes les adresses d'un type donné
   */
  private async getAdresses<T extends Adresse>(
    type: AdresseType,
    clientId?: number
  ): Promise<T[]> {
    try {
      const pk = this.validateClientId(clientId);
      const endpoint = type === 'livraison'
        ? this.ENDPOINTS.adressesLivraison(pk)
        : this.ENDPOINTS.adressesFacturation(pk);
      
      return await this.get<T[]>(endpoint);
    } catch (error: any) {
      this.handleError(`récupération des adresses de ${type}`, error);
    }
  }

  /**
   * Ajoute une adresse
   */
  private async addAdresse<T extends Adresse>(
    type: AdresseType,
    adresse: Omit<T, 'pk' | 'id'>,
    clientId?: number
  ): Promise<T> {
    try {
      const pk = this.validateClientId(clientId);
      const endpoint = type === 'livraison'
        ? this.ENDPOINTS.adressesLivraison(pk)
        : this.ENDPOINTS.adressesFacturation(pk);
      
      const normalizedData = this.normalizeAdresseData(adresse);
      return await this.post<T>(endpoint, normalizedData);
    } catch (error: any) {
      this.handleError(`ajout de l'adresse de ${type}`, error);
    }
  }

  /**
   * Met à jour une adresse
   */
  private async updateAdresse<T extends Adresse>(
    type: AdresseType,
    adressePk: number,
    adresse: Partial<T>,
    clientId?: number
  ): Promise<T> {
    try {
      const pk = this.validateClientId(clientId);
      const endpoint = type === 'livraison'
        ? this.ENDPOINTS.adresseLivraison(pk, adressePk)
        : this.ENDPOINTS.adresseFacturation(pk, adressePk);
      
      const normalizedData = this.normalizeAdresseData(adresse);
      return await this.put<T>(endpoint, normalizedData);
    } catch (error: any) {
      this.handleError(`mise à jour de l'adresse de ${type}`, error);
    }
  }

  /**
   * Supprime une adresse
   */
  private async deleteAdresse(
    type: AdresseType,
    adressePk: number,
    clientId?: number
  ): Promise<void> {
    try {
      const pk = this.validateClientId(clientId);
      const endpoint = type === 'livraison'
        ? this.ENDPOINTS.adresseLivraison(pk, adressePk)
        : this.ENDPOINTS.adresseFacturation(pk, adressePk);
      
      await this.delete(endpoint);
    } catch (error: any) {
      this.handleError(`suppression de l'adresse de ${type}`, error);
    }
  }

  // ============================================
  // ADRESSES DE LIVRAISON - API publique
  // ============================================

  async getAdressesLivraison(clientId?: number): Promise<AdresseLivraison[]> {
    return this.getAdresses<AdresseLivraison>('livraison', clientId);
  }

  async addAdresseLivraison(
    adresse: Omit<AdresseLivraison, 'pk' | 'id'>,
    clientId?: number
  ): Promise<AdresseLivraison> {
    return this.addAdresse<AdresseLivraison>('livraison', adresse, clientId);
  }

  async updateAdresseLivraison(
    adressePk: number,
    adresse: Partial<AdresseLivraison>,
    clientId?: number
  ): Promise<AdresseLivraison> {
    return this.updateAdresse<AdresseLivraison>('livraison', adressePk, adresse, clientId);
  }

  async deleteAdresseLivraison(adressePk: number, clientId?: number): Promise<void> {
    return this.deleteAdresse('livraison', adressePk, clientId);
  }

  // ============================================
  // ADRESSES DE FACTURATION - API publique
  // ============================================

  async getAdressesFacturation(clientId?: number): Promise<AdresseFacturation[]> {
    return this.getAdresses<AdresseFacturation>('facturation', clientId);
  }

  async addAdresseFacturation(
    adresse: Omit<AdresseFacturation, 'pk' | 'id'>,
    clientId?: number
  ): Promise<AdresseFacturation> {
    return this.addAdresse<AdresseFacturation>('facturation', adresse, clientId);
  }

  async updateAdresseFacturation(
    adressePk: number,
    adresse: Partial<AdresseFacturation>,
    clientId?: number
  ): Promise<AdresseFacturation> {
    return this.updateAdresse<AdresseFacturation>('facturation', adressePk, adresse, clientId);
  }

  async deleteAdresseFacturation(adressePk: number, clientId?: number): Promise<void> {
    return this.deleteAdresse('facturation', adressePk, clientId);
  }

  // ============================================
  // CHANGEMENT DE MOT DE PASSE
  // ============================================

  /**
   * Change le mot de passe du client
   * PUT /api/client/update/<pk_client>/password/
   */
  async changePassword(
    passwordData: PasswordChangeData,
    clientId?: number
  ): Promise<{ message: string }> {
    try {
      const pk = this.validateClientId(clientId);
      return await this.put<{ message: string }>(
        this.ENDPOINTS.password(pk),
        passwordData
      );
    } catch (error: any) {
      this.handleError('changement de mot de passe', error);
    }
  }
}

export const ClientsService = new ClientsServiceClass();
export const ClientService = ClientsService; // Alias pour compatibilité
