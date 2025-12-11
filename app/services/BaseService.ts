import type { ApiError } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8007";

console.log("[CONFIG] 🌐 URL de base de l'API:", API_URL);

if (!API_URL) {
  throw new Error("L'URL de l'API (NEXT_PUBLIC_API_URL) n'est pas configurée.");
}

export class BaseService {
  protected baseURL: string;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Méthode générique pour faire des appels API
   */
  protected async fetchApi<T = any>(
    endpoint: string,
    options: RequestInit = {},
    includeToken: boolean = true
  ): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem("session_token") : null;

    if (includeToken && !token) {
      throw new Error("Le token d'authentification est manquant.");
    }

    const url = `${this.baseURL}/${endpoint.replace(/^\//, '')}`;
    console.log(`[BaseService] 📤 ${options.method || 'GET'} ${url}`, {
      includeToken,
      hasToken: !!token,
      endpoint,
      body: options.body
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(includeToken && token ? { Authorization: `Token ${token}` } : {}),
          ...options.headers,
        },
      });

      const contentType = response.headers.get("content-type");
      console.log(`[BaseService] 📥 Response:`, {
        status: response.status,
        statusText: response.statusText,
        contentType,
        ok: response.ok
      });

      // Si la réponse n'est pas OK
      if (!response.ok) {
        // Gérer spécifiquement l'erreur 401 (Non autorisé)
        if (response.status === 401) {
          console.error('[API] Erreur 401 - Token invalide ou expiré');
          // Nettoyer le localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('session_token');
            localStorage.removeItem('user_pk');

            // Rediriger vers la page de login après un court délai
            setTimeout(() => {
              window.location.href = '/login?message=session_expired';
            }, 100);
          }
          throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
        }

        // Essayer de parser le JSON de l'erreur
        if (contentType && contentType.includes("application/json")) {
          const errorData: ApiError = await response.json().catch(() => ({
            error: `Erreur HTTP ${response.status}`
          }));
          const errorMessage = errorData.error || `Erreur HTTP ${response.status}`;
          const errorDetails = errorData.details || [];
          throw new Error(`${errorMessage}${errorDetails.length > 0 ? '. Détails : ' + JSON.stringify(errorDetails) : ''}`);
        } else {
          // Si ce n'est pas du JSON, récupérer le texte
          const errorText = await response.text();
          throw new Error(`Erreur HTTP ${response.status}: ${errorText.substring(0, 200)}`);
        }
      }

      // Si la réponse est OK
      if (response.status === 204 || response.status === 205) {
        return null as T;
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data;
      }

      // Si ce n'est pas du JSON mais la réponse est OK
      const text = await response.text();
      throw new Error(`Réponse inattendue (pas de JSON). Contenu: ${text.substring(0, 200)}`);

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Erreur réseau ou de connexion: ${String(error)}`);
    }
  }

  /**
   * Méthode GET
   */
  protected async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    includeToken: boolean = true
  ): Promise<T> {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.fetchApi<T>(url, { method: 'GET' }, includeToken);
  }

  /**
   * Méthode POST
   */
  protected async post<T = any>(
    endpoint: string,
    data?: any,
    includeToken: boolean = true
  ): Promise<T> {
    return this.fetchApi<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      includeToken
    );
  }

  /**
   * Méthode PUT
   */
  protected async put<T = any>(
    endpoint: string,
    data?: any,
    includeToken: boolean = true
  ): Promise<T> {
    return this.fetchApi<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      includeToken
    );
  }

  /**
   * Méthode PATCH
   */
  protected async patch<T = any>(
    endpoint: string,
    data?: any,
    includeToken: boolean = true
  ): Promise<T> {
    return this.fetchApi<T>(
      endpoint,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      includeToken
    );
  }

  /**
   * Méthode DELETE
   */
  protected async delete<T = any>(
    endpoint: string,
    includeToken: boolean = true
  ): Promise<T> {
    return this.fetchApi<T>(
      endpoint,
      { method: 'DELETE' },
      includeToken
    );
  }

  /**
   * Récupère le token depuis le localStorage
   */
  protected getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("session_token");
    }
    return null;
  }

  /**
   * Récupère le client ID depuis le localStorage
   */
  protected getClientId(): number | null {
    if (typeof window !== 'undefined') {
      const pk = localStorage.getItem("user_pk");
      if (!pk) {
        console.error('[BaseService] user_pk non trouvé dans le localStorage');
        console.log('[BaseService] Contenu du localStorage:', {
          session_token: localStorage.getItem("session_token") ? 'présent' : 'absent',
          user_pk: 'absent'
        });
      }
      return pk ? Number(pk) : null;
    }
    return null;
  }
}
