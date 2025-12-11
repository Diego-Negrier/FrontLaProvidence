"use client"; // Indique que ce composant est un Client Component

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './ProduitDetail.module.css';
import { getProduitDetail,apiUrl, Produit, Panier, LignePanier } from "../context/apiService";
import { usePanier } from "../context/PanierContext";
import { useRouter } from 'next/navigation';

const ProduitDetail: React.FC = () => {
    const { ajouterProduit, soustraireProduit } = usePanier();
    const [showPlusOne, setShowPlusOne] = useState(false);
    const [animations, setAnimations] = useState<{ [key: string]: boolean }>({});
    const { numero_unique } = useParams<{ numero_unique: string }>(); // Récupérer l'identifiant du produit depuis l'URL
    const { panier, setPanier } = usePanier(); // Vous pouvez avoir setPanier pour mettre à jour le panier
    const [produit, setProduitDetail] = useState<Produit | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(0);
    const router = useRouter();

    // Récupération des détails du produit
    useEffect(() => {
        const fetchProduitDetails = async () => {
            if (numero_unique) {
                try {
                    const produitData = await getProduitDetail(numero_unique);
                    setProduitDetail(produitData);
                } catch (error) {
                    setError("Erreur lors de la récupération des détails du produit.");
                    console.error("Erreur:", error);
                }
            }
        };
        fetchProduitDetails();
    }, [numero_unique]);

    // Récupérer la quantité du produit dans le panier
    const getQuantitePanier = (produitId: string) => {
        const panierItem = panier?.lignes.find((item:LignePanier) => item.numero_unique === produitId);
        return panierItem ? panierItem.quantite : 0;
    };

 // Gérer l'ajout du produit dans le panier
 const handleAjoutProduit = async (produitId: string) => {
    try {
        await ajouterProduit(produitId);

        // Animation +1
        setAnimations((prev) => ({ ...prev, [produitId]: true }));
        setShowPlusOne(true);
        setTimeout(() => setShowPlusOne(false), 500);

        // Assurez-vous que le panier est défini et contient une propriété `lignes`
        const panierActuel = panier || { lignes: [] }; // Si `panier` est null, initialisez-le avec un objet vide

        const produitExistant = panierActuel.lignes.find((item: LignePanier) => item.numero_unique === produitId);

        let updatedPanier;
        if (produitExistant) {
            updatedPanier = {
                ...panierActuel,
                lignes: panierActuel.lignes.map((item: LignePanier) =>
                    item.numero_unique === produitId
                        ? { ...item, quantite: item.quantite + 1 }
                        : item
                ),
            };
        } else {
            updatedPanier = {
                ...panierActuel,
                lignes: [
                    ...panierActuel.lignes,
                    { numero_unique: produitId, quantite: 1, produit: 'Produit ' + produitId },
                ],
            };
        }

        // Mise à jour du panier avec updatedPanier

    } catch (error) {
        console.error("Erreur lors de l'ajout au panier :", error);
    }
};


// Gérer la suppression du produit dans le panier
const handleRemoveProduit = async (produitId: string) => {
    try {
        await soustraireProduit(produitId);
        setAnimations((prev) => ({ ...prev, [produitId]: true }));
        setShowPlusOne(true);
        setTimeout(() => setShowPlusOne(false), 500);

        if (panier) {
            const produitExistant = panier.lignes.find((item: LignePanier) => item.numero_unique === produitId);

            let updatedPanier;
            if (produitExistant) {
                if (produitExistant.quantite > 1) {
                    // Si la quantité est supérieure à 1, on la décrémente
                    updatedPanier = {
                        ...panier,
                        lignes: panier.lignes.map((item: LignePanier) =>
                            item.numero_unique === produitId
                                ? { ...item, quantite: item.quantite - 1 }
                                : item
                        ),
                    };
                } else {
                    // Si la quantité est 1, on supprime le produit du panier
                    updatedPanier = {
                        ...panier,
                        lignes: panier.lignes.filter((item: LignePanier) => item.numero_unique !== produitId),
                    };
                }

                // Mise à jour du panier
            }
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du produit du panier :", error);
    }
};

if (!produit) return <p>Chargement...</p>; // Si le produit n'est pas encore chargé
    const quantite = getQuantitePanier(produit.numero_unique); // Quantité dans le panier
    const redirectToBoutique = () => router.push('/produits');

    return (
        <div className={styles.productDetailContainer} 
        style={{ 
            background: produit.grande_image 
              ? `url(${apiUrl}${produit.grande_image.replace(/^\/+/, '')}) no-repeat center/cover` 
              : 'white' 
          }}>
            <div className={styles.productInfoContainer}>
            {produit.image ? (
              <img
                src={`${apiUrl}${produit.image.replace(/^\/+/, '')}`}
                alt={produit.nom}
                className={styles.produitImage}
              />
            ) : (
              <div className={styles.produitIconFallback}>
                <span className={styles.produitIconEmoji}>
                  {produit.icone_produit || '📦'}
                </span>
              </div>
            )}
            <div className={styles.productTextContainer}>
                    <h1 className={styles.productTitle}>
                        {produit.nom || 'Image produit'}
                        <span className={styles.produitNumero}> {produit.numero_unique}</span>
                    </h1>
                    <p className={styles.productDescription}>Description : {produit.description}</p>
                    <p className={styles.productPrice}>Prix : {produit.prix ? Number(produit.prix).toFixed(2) : '0.00'} €</p>

                    {/* Affichage des boutons pour ajouter et soustraire des produits */}
                    <div className={styles.quantityContainer}>
          

                        <button 
                            onClick={() => handleRemoveProduit(produit.numero_unique)} 
                            disabled={quantite <= 0}
                        >
                            -
                        </button>
                  {/* Affichage de la quantité du produit dans le panier */}
                  <span className={styles.quantityDisplay}>
                            {quantite}
                        </span> 
                        <button 
                            onClick={() => handleAjoutProduit(produit.numero_unique)} 
                            disabled={produit.stock <= 0}
                        >
                            +
                        </button>

      
                    </div>


                    {produit.stock <= 0 && <p className={styles.outOfStock}>Rupture de stock</p>}<br></br>
                    <button className="boutiqueButton" onClick={redirectToBoutique}>
              <i className="fas fa-box-open"></i> Boutique
            </button><br />
                </div>
    
            </div>
        </div>
    );
};

export default ProduitDetail;