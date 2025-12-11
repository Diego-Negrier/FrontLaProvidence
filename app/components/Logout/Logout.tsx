"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const LogoutOnTokenExpiration = () => {
    const { logout } = useAuth();
    const router = useRouter();
    useEffect(() => {
        const interval = setInterval(() => {
            const tokenExpiration = localStorage.getItem('token_expiration');
            if (tokenExpiration && new Date(tokenExpiration) < new Date()) {
              // Token expiré, effectuer la déconnexion
              localStorage.removeItem('session_token');
              localStorage.removeItem('token_expiration');
              router.push('/login'); // Redirection après déconnexion
            }
          }, 1000 * 60); // Vérifier toutes les minutes (ajustez selon vos besoins)
      
          return () => clearInterval(interval); // Nettoyage à la fin
    }, [logout, router]);

    return null; // Aucun rendu visuel nécessaire
};

export default LogoutOnTokenExpiration;