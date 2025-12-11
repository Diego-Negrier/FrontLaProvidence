"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useTheme } from '@/app/contexts/ThemeContext';
import { PanierService, CommandesService } from '@/app/services';

export default function DebugAuthPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const [localStorageData, setLocalStorageData] = useState<any>({});
  const [testPanierResult, setTestPanierResult] = useState<string>('');
  const [testCommandesResult, setTestCommandesResult] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalStorageData({
        session_token: localStorage.getItem('session_token'),
        user_pk: localStorage.getItem('user_pk'),
      });
    }
  }, []);

  const testPanier = async () => {
    try {
      setTestPanierResult('Chargement...');
      const data = await PanierService.getPanier();
      setTestPanierResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setTestPanierResult(`ERREUR: ${error.message}`);
    }
  };

  const testCommandes = async () => {
    try {
      setTestCommandesResult('Chargement...');
      const data = await CommandesService.getCommandes();
      setTestCommandesResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setTestCommandesResult(`ERREUR: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8" style={{ color: theme.colors.primary }}>
        🔍 Debug Authentification & API
      </h1>

      {/* État d'authentification */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>État d'authentification</h2>
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="font-bold">isLoading:</span>
            <span style={{ color: isLoading ? theme.colors.warning : theme.colors.success }}>
              {isLoading ? 'Oui' : 'Non'}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">isAuthenticated:</span>
            <span style={{ color: isAuthenticated ? theme.colors.success : theme.colors.error }}>
              {isAuthenticated ? 'Oui' : 'Non'}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">User:</span>
            <span>{user ? JSON.stringify(user, null, 2) : 'null'}</span>
          </div>
        </div>
      </div>

      {/* LocalStorage */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>LocalStorage</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto" style={{ color: '#000' }}>
          {JSON.stringify(localStorageData, null, 2)}
        </pre>
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <span className="font-bold">session_token présent:</span>
            <span style={{ color: localStorageData.session_token ? theme.colors.success : theme.colors.error }}>
              {localStorageData.session_token ? 'Oui' : 'Non'}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">user_pk présent:</span>
            <span style={{ color: localStorageData.user_pk ? theme.colors.success : theme.colors.error }}>
              {localStorageData.user_pk ? 'Oui' : 'Non'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Panier */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>Test API Panier</h2>
        <button
          onClick={testPanier}
          className="px-6 py-3 rounded-lg font-bold mb-4"
          style={{ backgroundColor: theme.colors.primary, color: 'white' }}
        >
          Tester getPanier()
        </button>
        {testPanierResult && (
          <pre className="bg-gray-100 p-4 rounded overflow-auto" style={{ color: '#000' }}>
            {testPanierResult}
          </pre>
        )}
      </div>

      {/* Test Commandes */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>Test API Commandes</h2>
        <button
          onClick={testCommandes}
          className="px-6 py-3 rounded-lg font-bold mb-4"
          style={{ backgroundColor: theme.colors.primary, color: 'white' }}
        >
          Tester getCommandes()
        </button>
        {testCommandesResult && (
          <pre className="bg-gray-100 p-4 rounded overflow-auto" style={{ color: '#000' }}>
            {testCommandesResult}
          </pre>
        )}
      </div>

      {/* Informations */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: theme.colors.surface, border: `1px solid ${theme.colors.border}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Vérifiez que vous êtes authentifié (isAuthenticated = Oui)</li>
          <li>Vérifiez que session_token et user_pk sont présents dans le localStorage</li>
          <li>Cliquez sur "Tester getPanier()" pour voir la réponse de l'API</li>
          <li>Cliquez sur "Tester getCommandes()" pour voir la réponse de l'API</li>
          <li>Si vous voyez "L'identifiant du client est introuvable", cela signifie que user_pk n'est pas dans localStorage</li>
          <li>Si vous voyez "401" ou "session a expiré", reconnectez-vous</li>
        </ol>
      </div>
    </div>
  );
}
