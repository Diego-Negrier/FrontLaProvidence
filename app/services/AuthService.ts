import { BaseService } from './BaseService';
import type { LoginResponse, InscriptionData, InscriptionResponse } from './types';

class AuthServiceClass extends BaseService {
  /**
   * Connexion d'un utilisateur
   * POST /api/login
   */
  async login(usernameOrEmail: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.post<LoginResponse>(
        'api/login/',
        { username_or_email: usernameOrEmail, password },
        false
      );
      console.log("Réponse de l'API :", response);
      return response;
    } catch (error: any) {
      console.error("Erreur de connexion:", error.message);
      throw new Error(error.message || "Erreur de connexion");
    }
  }

  /**
   * Déconnexion d'un utilisateur
   * POST /api/logout
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Aucun token trouvé pour la déconnexion.');
      }

      const response = await this.post<{ status: string }>(
        'api/logout/',
        { token },
        true
      );

      if (response.status === 'success') {
        console.log('Déconnexion réussie');
      } else {
        throw new Error('Erreur de déconnexion sur le serveur');
      }
    } catch (error: any) {
      console.error("Erreur de déconnexion:", error.message);
      throw new Error(error.message || "Erreur de déconnexion");
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   * POST /api/inscription
   */
  async inscription(data: InscriptionData): Promise<InscriptionResponse> {
    try {
      return await this.post<InscriptionResponse>(
        'api/inscription/',
        data,
        false
      );
    } catch (error: any) {
      console.error("Erreur d'inscription:", error.message);
      throw new Error(error.message || "Erreur d'inscription");
    }
  }
}

export const AuthService = new AuthServiceClass();
