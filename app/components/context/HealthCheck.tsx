"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const checkServerAvailability = async () => {
    try {
        const res = await fetch("/api/health-check"); // Utilisez une API de santé de votre serveur
        if (!res.ok) {
            throw new Error('Server not reachable');
        }
    } catch (error) {
        console.error('Server is down:', error);
        // Nettoyez le localStorage si le serveur est inaccessible
        localStorage.removeItem('user_email');
        localStorage.removeItem('session_token');
        localStorage.removeItem('user_pk');
        localStorage.removeItem('token_expiration');
        return false;
    }
    return true;
};

const useServerCheck = () => {
    const router = useRouter();

    useEffect(() => {
        const checkConnection = async () => {
            const serverAvailable = await checkServerAvailability();
            if (!serverAvailable) {
                // Si le serveur est hors ligne, redirigez vers la page de connexion
                router.push('/login');
            }
        };

        checkConnection();
        // Vérification périodique (par exemple, toutes les 5 minutes)
        const interval = setInterval(checkConnection, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage
    }, [router]);
};

export default useServerCheck;