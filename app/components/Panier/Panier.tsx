"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import eventEmitter from "../context//eventEmitter";
import { useRouter } from 'next/navigation';
import styles from './Panier.module.css';

import { usePanier } from "@/app/contexts/PanierContext";
import { ClientService, type Client, type AdresseLivraison, type AdresseFacturation, type Panier, type LignePanier } from "@/app/services";


interface PanierContextType {
    panier: any;
    ajouterProduit: (produitId: string) => void;
    soustraireProduit: (produitId: string) => void;
    supprimerProduit: (produitId: string) => void;
    viderPanier: () => void;
    loading: boolean;
}

const PanierContext = createContext<PanierContextType | null>(null);





const Panier: React.FC = () => {
    const { panier, ajouterProduit, soustraireProduit, supprimerProduit, viderPanier, loading } = usePanier();
    const [notification, setNotification] = useState<string | null>(null);
    const router = useRouter();
    const [produits, setProduits] = useState<Produit[]>([]);


    const handlePanier = () => {
        router.push('information'); // Navigation vers la page de récapitulatif
    };
    // Fonction pour calculer le total

    const calculateTotalHT = (panier: PanierInterface | null): number => {
        return panier?.lignes.reduce((total: number, item: any) => {
            const prixUnitaire = Number(item.prix_unitaire || item.prix || 0);
            const quantite = item.quantite || 0;

            return total + prixUnitaire * quantite;
        }, 0) || 0;
    };

    const calculateTotalTTC = (panier: PanierInterface | null): number => {
        return panier?.lignes.reduce((total: number, item: any) => {
            const prixUnitaire = Number(item.prix_unitaire || item.prix || 0);
            const tva = Number(item.tva || 0);
            const quantite = item.quantite || 0;
            const prixTTC = prixUnitaire * (1 + tva / 100);

            return total + prixTTC * quantite;
        }, 0) || 0;
    };

    const calculatePoidsTotal = (panier: PanierInterface | null): number => {
        return panier?.lignes.reduce((totalPoids: number, item: any) => {
            const poids = parseFloat(String(item.poids || '0')) || 0;
            const quantite = item.quantite || 0;

            return totalPoids + poids * quantite;
        }, 0) || 0;
    };

    const calculateTotalTVA = (panier: PanierInterface | null): number => {
        return panier?.lignes.reduce((total: number, item: any) => {
            const prixUnitaire = Number(item.prix_unitaire || item.prix || 0);
            const tva = Number(item.tva || 0);
            const quantite = item.quantite || 0;
            const prixTTC = prixUnitaire * (1 + tva / 100);
            const montantTVA = prixTTC - prixUnitaire;

            return total + montantTVA * quantite;
        }, 0) || 0;
    };
    return (
        <div className={styles.ContainerPanier}>
            <div className={styles.PanierCart}>
                <h1>Votre Panier</h1>
                {panier && panier.lignes.length === 0 ? (
                    <p>Votre panier est vide.</p>
                ) : (


                    <ul className={styles.cartItems}>

                        {panier?.lignes.map((ligne: LignePanier, index: number) => (
                            <li key={index} className={styles.cartItem}>
                                <div className={styles.cartIteDetailEtAction}>
                                    {/* Image du produit */}
                                    <div className={styles.cartItemActionsImage}>
                                        <div className={styles.cartItemImage} >
                                            <img src={`${apiUrl}${ligne.image.replace(/^\/+/, '')}`} alt={ligne.produit || "Produit"} className={styles.cartProduitImage} />
                                        </div>
                                        <div className={styles.cartItemActions} >

                                            {/* Bouton pour soustraire la quantité, désactivé si la quantité est 1 ou moins */}
                                            <button onClick={() => soustraireProduit(ligne.numero_unique)} disabled={ligne.quantite <= 1}><i className="fas fa-minus"></i> </button>

                                            {/* Quantité actuelle du produit */}
                                            <span className={styles.QuantiteProduit}>{ligne.quantite}</span>
                                            {/* Bouton pour ajouter une quantité */}

                                            <button onClick={() => ajouterProduit(ligne.numero_unique)}><i className="fas fa-plus"></i></button>
                                        </div>
                                    </div>

                                    <div className={styles.cartItemDetails}>

                                        {/* Nom du produit */}
                                        <h3 className={styles.cartItemTitreProduit}>{ligne.produit}</h3>

                                        {/* Référence du produit */}
                                        <p className={styles.Reference}>(Réf: {ligne.numero_unique})</p>

                                        {/* Détails de la tarification */}
                                        <span className={styles.QuantitePrix}>{ligne.quantite} x {ligne.prix} €</span>

                                        <strong className={styles.Reference}>Total HT : {Number(ligne.quantite * ligne.prix)}€</strong>

                                        <strong className={styles.Reference}>TVA : {Number(ligne.tva).toFixed(0)}%</strong>

                                        <strong className={styles.TotalProduit}>Total TTC {ligne.ttc } €</strong>

                                    </div>

                                    {/* Bouton pour supprimer le produit du panier */}
                                    <button className={styles.removeButton}
                                        onClick={() => supprimerProduit(ligne.numero_unique)}>×
                                    </button>
                                </div>

                            </li>
                        ))}
                    </ul>
                )}
   

                <div className={styles.cartSummary}>
                    <div >
                        <button onClick={viderPanier} >
                            <i className="fa fas fa-trash" title="ViderPanier"></i> Vider le Panier
                        </button>
                    </div>
                    <div className={styles.QuantitePrix}>Poids : {calculatePoidsTotal(panier).toFixed(2)} (en kg)</div>
                    <div className={styles.QuantitePrix}>Total HT : {calculateTotalHT(panier).toFixed(2)} € </div>
                    <div className={styles.QuantitePrix}>Total Hors TVA :{calculateTotalTVA(panier).toFixed(2)} € </div>

                    <h3 className="TotalProduit" >Total TTC :{calculateTotalTTC(panier).toFixed(2)} €</h3>
                    <div  >

                        <button onClick={handlePanier} >
                        <i className="fa fas fa-box" title="Commandes"></i> Commander
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Panier;