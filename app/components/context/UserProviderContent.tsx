"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { logNavigation, UserInfo } from "./apiService";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";

export const UserTracking = createContext<{
  userInfo: UserInfo;
  trackClientActivity: (activity: string) => void;
} | null>(null);

const UserProviderContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth(); // Récupération du contexte Auth
  const pathname = usePathname();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    ip: "",
    fingerprint: "",
    ClientId: null,
    deviceType: "",
    currentURL: typeof window !== "undefined" ? window.location.href : "",
    sessionStartTime: null,
    sessionEndTime: null,
    userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
  });

  const [isClient, setIsClient] = useState(false);

  // Vérifier si le composant est monté côté client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      console.log("Composant monté côté client");
    }
  }, []);

  // Mettre à jour les informations utilisateur si connecté ou déconnecté
  useEffect(() => {
    if (!isClient) return;

    if (isAuthenticated && user) {
      console.log("Utilisateur authentifié :", user);
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        ClientId: user.pk,
      }));
    } else {
      console.log("Utilisateur non authentifié ou anonyme");
      const storedUserPk = localStorage.getItem("user");

      if (storedUserPk) {
        console.log("ID utilisateur trouvé dans localStorage :", storedUserPk);
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          ClientId: parseInt(storedUserPk, 10),
        }));
      } else {
        console.log("Aucun ID utilisateur trouvé, assignation par défaut");
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          ClientId: 1000,
        }));
      }
    }
  }, [isClient, isAuthenticated, user]);

  // Initialiser `sessionStartTime` lors du premier montage
  useEffect(() => {
    if (isClient && !userInfo.sessionStartTime) {
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        sessionStartTime: Date.now(),
      }));
      console.log("Session démarrée à :", Date.now());
    }
  }, [isClient, userInfo.sessionStartTime]);

  // Fonction pour récupérer les informations utilisateur (IP, fingerprint, etc.)
  const getUserInfo = async (): Promise<UserInfo> => {
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();

    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();

    const deviceType = /Mobile|Android|iP(ad|hone)/.test(navigator.userAgent)
      ? "Mobile"
      : "Desktop";

    const newUserInfo = {
      ip: ipData.ip,
      fingerprint: visitorId,
      ClientId: userInfo.ClientId,
      deviceType,
      currentURL: window.location.href,
      sessionStartTime: userInfo.sessionStartTime,
      sessionEndTime: Date.now(),
      userAgent: navigator.userAgent,
    };

    console.log("Informations utilisateur récupérées :", newUserInfo);
    return newUserInfo;
  };

  // Fonction de suivi de l'activité
  const trackClientActivity = useCallback(
    async (activity: string) => {
      if (!userInfo.ClientId) {
        console.log("Aucun ID client trouvé. Suivi annulé.");
        return;
      }

      try {
        console.log("Tracking activité :", activity);
        const newUserInfo = await getUserInfo();

        console.log("Données envoyées pour le suivi :", newUserInfo);
        const response = await logNavigation(newUserInfo);

        if (response.message === "Navigation enregistrée avec succès.") {
          console.log("Activité suivie avec succès :", activity);
        } else {
          throw new Error(
            `Erreur lors de l'enregistrement : ${response.message}`
          );
        }
      } catch (error) {
        console.error("Erreur lors du suivi :", error);
      }
    },
    [userInfo.ClientId]
  );

  // Suivre les changements de route
  useEffect(() => {
    if (!isClient || !pathname || pathname === userInfo.currentURL) {
      console.log("Pas de changement de route détecté.");
      return;
    }

    console.log("Changement de route détecté :", pathname);

    let isMounted = true;

    const trackActivity = async () => {
      try {
        const newUserInfo = await getUserInfo();

        if (isMounted) {
          await trackClientActivity("Page visited");
          console.log("Mise à jour des informations utilisateur après navigation");
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            currentURL: pathname,
            sessionEndTime: Date.now(),
          }));
        }
      } catch (error) {
        console.error("Erreur dans le suivi de route :", error);
      }
    };

    trackActivity();

    return () => {
      isMounted = false;
    };
  }, [isClient, pathname, userInfo.currentURL, trackClientActivity]);

  console.log("Informations utilisateur actuelles :", userInfo);

  return (
    <UserTracking.Provider value={{ userInfo, trackClientActivity }}>
      {children}
    </UserTracking.Provider>
  );
};

export default UserProviderContent;