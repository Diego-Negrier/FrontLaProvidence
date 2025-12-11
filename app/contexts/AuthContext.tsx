"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '@/app/services';

interface User {
  pk: number;
  username: string;
  email: string;
  prenom?: string;
  nom?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur au montage du composant
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('session_token');
      const userPk = localStorage.getItem('user_pk');

      if (token && userPk) {
        // Vérifier que le token est valide en appelant l'API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clients/${userPk}/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser({
            pk: userData.pk,
            username: userData.user?.username || userData.email,
            email: userData.email,
            prenom: userData.prenom,
            nom: userData.nom,
          });
        } else {
          // Token invalide, nettoyer le localStorage
          localStorage.removeItem('session_token');
          localStorage.removeItem('user_pk');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_pk');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await AuthService.login(username, password);
      console.log('[AuthContext] Réponse de login:', response);

      // Vérifier si on a reçu un token et un client_id
      const clientId = response.client_id || (response as any).user_pk;

      if (response.token && clientId) {
        localStorage.setItem('session_token', response.token);
        localStorage.setItem('user_pk', clientId.toString());
        console.log('[AuthContext] Token et user_pk enregistrés:', { token: response.token.substring(0, 10) + '...', user_pk: clientId });

        // Charger les informations complètes de l'utilisateur
        await loadUser();
      } else {
        console.error('[AuthContext] Réponse de connexion invalide:', response);
        throw new Error('Réponse de connexion invalide');
      }
    } catch (error) {
      console.error('[AuthContext] Erreur lors de la connexion:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      // Nettoyer le localStorage d'abord
      const token = localStorage.getItem('session_token');
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_pk');
      setUser(null);

      // Essayer de se déconnecter côté serveur uniquement si on a un token
      if (token) {
        AuthService.logout().catch((error) => {
          console.error('Erreur lors de la déconnexion côté serveur (ignorée):', error);
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
