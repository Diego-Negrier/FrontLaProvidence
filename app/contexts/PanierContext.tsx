"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PanierService, type Panier } from '@/app/services';
import { useAuth } from './AuthContext';

interface PanierContextType {
  panier: Panier | null;
  loading: boolean;
  error: string | null;
  setPanier: (panier: Panier | null) => void;
  rechargerPanier: () => Promise<void>;
  ajouterProduit: (produitId: number, quantite?: number) => Promise<void>;
  modifierQuantite: (ligneId: number, quantite: number) => Promise<void>;
  supprimerLigne: (ligneId: number) => Promise<void>;
  viderPanier: () => Promise<void>;
}

const PanierContext = createContext<PanierContextType | null>(null);

export function PanierProvider({ children }: { children: ReactNode }) {
  const [panier, setPanier] = useState<Panier | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Charger le panier au montage et quand l'utilisateur se connecte
  useEffect(() => {
    if (isAuthenticated) {
      rechargerPanier();
    } else {
      setPanier(null);
    }
  }, [isAuthenticated]);

  const rechargerPanier = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const data = await PanierService.getPanier();
      setPanier(data);
    } catch (err: any) {
      console.error('Erreur lors du chargement du panier:', err);
      setError(err.message || 'Erreur de chargement du panier');
    } finally {
      setLoading(false);
    }
  };

  const ajouterProduit = async (produitId: number, quantite: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await PanierService.ajouterProduit(produitId, quantite);
      setPanier(data);
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout du produit:', err);
      setError(err.message || 'Erreur d\'ajout au panier');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const modifierQuantite = async (ligneId: number, quantite: number) => {
    try {
      setLoading(true);
      setError(null);

      if (quantite <= 0) {
        await PanierService.supprimerLignePanier(ligneId);
      } else {
        await PanierService.modifierQuantite(ligneId, quantite);
      }

      await rechargerPanier();
    } catch (err: any) {
      console.error('Erreur lors de la modification de la quantité:', err);
      setError(err.message || 'Erreur de modification');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const supprimerLigne = async (ligneId: number) => {
    try {
      setLoading(true);
      setError(null);
      await PanierService.supprimerLignePanier(ligneId);
      await rechargerPanier();
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      setError(err.message || 'Erreur de suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const viderPanier = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PanierService.viderPanier();
      setPanier(data);
    } catch (err: any) {
      console.error('Erreur lors du vidage du panier:', err);
      setError(err.message || 'Erreur de vidage du panier');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: PanierContextType = {
    panier,
    loading,
    error,
    setPanier,
    rechargerPanier,
    ajouterProduit,
    modifierQuantite,
    supprimerLigne,
    viderPanier,
  };

  return (
    <PanierContext.Provider value={value}>
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier() {
  const context = useContext(PanierContext);
  if (!context) {
    throw new Error('usePanier doit être utilisé dans un PanierProvider');
  }
  return context;
}
