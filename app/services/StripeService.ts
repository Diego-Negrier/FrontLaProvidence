import { BaseService } from './BaseService';

interface PaymentIntentResponse {
  success: boolean;
  client_secret: string;
  payment_intent_id: string;
  montant: number;
  devise: string;
}

interface ConfirmPaymentResponse {
  success: boolean;
  commande_id: number;
  numero_commande: string;
  montant: number;
  payment_status: string;
}

interface PublicKeyResponse {
  publishable_key: string;
}

class StripeServiceClass extends BaseService {
  /**
   * Récupère la clé publique Stripe
   * GET /api/paiement/cle-publique/
   */
  async getPublicKey(): Promise<string> {
    try {
      const response = await this.get<PublicKeyResponse>('api/paiement/cle-publique/', {}, false);
      return response.publishable_key;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de la clé publique Stripe:', error.message);
      throw new Error(error.message || 'Erreur de récupération de la clé Stripe');
    }
  }

  /**
   * Crée un PaymentIntent pour le panier du client
   * POST /api/<pk_client>/paiement/creer-intent/
   *
   * @param clientId - ID du client (optionnel, utilise l'ID stocké si non fourni)
   * @param montant - Montant du paiement (optionnel, utilise le total du panier si non fourni)
   * @param devise - Devise du paiement (par défaut 'eur')
   */
  async createPaymentIntent(
    clientId?: number,
    montant?: number,
    devise: string = 'eur'
  ): Promise<PaymentIntentResponse> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      const body: any = { devise };
      if (montant !== undefined) {
        body.montant = montant;
      }

      return await this.post<PaymentIntentResponse>(
        `api/${pk}/paiement/creer-intent/`,
        body
      );
    } catch (error: any) {
      console.error('Erreur lors de la création du PaymentIntent:', error.message);
      throw new Error(error.message || 'Erreur de création du paiement');
    }
  }

  /**
   * Confirme le paiement et crée la commande
   * POST /api/<pk_client>/paiement/confirmer/
   *
   * @param paymentIntentId - ID du PaymentIntent Stripe
   * @param livreurId - ID du livreur (optionnel)
   * @param pointRelaisId - ID du point relais (optionnel)
   * @param clientId - ID du client (optionnel, utilise l'ID stocké si non fourni)
   */
  async confirmPayment(
    paymentIntentId: string,
    livreurId?: number,
    pointRelaisId?: number,
    clientId?: number
  ): Promise<ConfirmPaymentResponse> {
    try {
      const pk = clientId || this.getClientId();
      if (!pk) {
        throw new Error("L'identifiant du client est introuvable.");
      }

      const body: any = {
        payment_intent_id: paymentIntentId
      };

      if (livreurId !== undefined) {
        body.livreur_id = livreurId;
      }

      if (pointRelaisId !== undefined) {
        body.point_relais_id = pointRelaisId;
      }

      return await this.post<ConfirmPaymentResponse>(
        `api/${pk}/paiement/confirmer/`,
        body
      );
    } catch (error: any) {
      console.error('Erreur lors de la confirmation du paiement:', error.message);
      throw new Error(error.message || 'Erreur de confirmation du paiement');
    }
  }
}

export const StripeService = new StripeServiceClass();
