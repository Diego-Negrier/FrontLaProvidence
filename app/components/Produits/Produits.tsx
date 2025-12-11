"use client";
import { useRouter } from 'next/navigation';

import React, { useState, useEffect } from "react";
import eventEmitter from "../context/eventEmitter";
import styles from "./Produits.module.css"; // Importer le fichier CSS
import { getProduit, Produit,apiUrl, Panier, LignePanier,} from "../context/apiService";
import { usePanier } from "../context/PanierContext";
import Link from 'next/link';

const Produits: React.FC = () => {
  
  const [showPlusOne, setShowPlusOne] = useState(false); // État pour gérer l'animation
  const [animations, setAnimations] = useState<{ [key: string]: boolean }>({}); // Suivi des animations pour chaque produit
  const [isClient, setIsClient] = useState(false); // Pour vérifier si on est sur le client
  const [produits, setProduits] = useState<Produit[]>([]);
  const { panier, ajouterProduit, soustraireProduit, supprimerProduit, viderPanier, loading } = usePanier(); // Pas besoin de déclarer un autre panier ici
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  // Récupération des produits
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const produitData = await getProduit();
        setProduits(produitData);
      } catch (error) {
        setError("Erreur lors de la récupération des produits.");
        console.error(error);
      }
    };
    fetchProduits();
  }, []);

  useEffect(() => {
    // S'assurer que nous sommes sur le client avant d'utiliser `localStorage`
    setIsClient(true);
    // Récupérer le token de session dans le localStorage
    const sessionToken = localStorage.getItem("session_token");
    setToken(sessionToken);
  }, []);

  const handleAjoutProduit = async (produitId: string) => {
    const token = localStorage.getItem("session_token");
    if (!token) {
      return; // Arrêter la fonction si l'utilisateur n'est pas connecté
    }
  
    try {
      // Ajout du produit au panier via la fonction context
      await ajouterProduit(produitId);
  
      // Déclencher l'animation +1 pour le produit
      setAnimations((prev) => ({ ...prev, [produitId]: true }));
      setShowPlusOne(true);
      setTimeout(() => setShowPlusOne(false), 500); // Cacher après 1s
  
      // Vérification de l'existence du produit dans le panier et mise à jour
      const produitExistant = panier?.lignes.some((item: LignePanier) => item.numero_unique === produitId);
  
      if (produitExistant) {
        // Si le produit existe déjà, on laisse `ajouterProduit` gérer la mise à jour
        console.log(`Produit ${produitId} mis à jour dans le panier !`);
      } else {
        // Sinon, vous pouvez ajouter un nouveau produit au panier
        console.log(`Produit ${produitId} ajouté au panier !`);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  };
  
  return (
    <div className={styles.produitsContainer}>
      {message && <div className="successMessage">{message}</div>}

      {produits.map((produit) => {
        // Vérification de la présence du token pour chaque produit
        const isUserLoggedIn = token !== null;
        
        const panierItem = panier?.lignes
          ? panier.lignes.find((item: LignePanier) => item.numero_unique === produit.numero_unique)
          : null;

        const quantite = panierItem ? panierItem.quantite : 0;

        return (
          <div key={produit.numero_unique} className={styles.produitCard}>
            {/* Affichage du message si l'utilisateur n'est pas connecté pour chaque produit */}
            {!isUserLoggedIn && (
              <p className={styles.loginReminder}>
                Vous devez être connecté pour ajouter ce produit au panier.{" "}
                <Link href="/login">Se connecter</Link>
              </p>
            )}

            {produit.stock <= 3 && produit.stock > 0 && (
              <p className={styles.stockWarning}>
                Attention : Il ne reste plus que {produit.stock} exemplaire
                {produit.stock === 1 ? "" : "s"} en stock !
              </p>
            )}

            <div className={styles.produitImageContainer}>
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
            </div>

            <h3 className={styles.produitNom}>
              {produit.nom} - <span className={styles.produitNumero}>{produit.numero_unique}</span>
            </h3>

            <p className={styles.produitPoids}>
              {quantite} x {produit.poids} <span className={styles.eng}>(en kg)</span>
            </p>

            <p className={styles.produitDescription}>{produit.description}</p>
            <p className={styles.produitPrix}>{produit.prix ? Number(produit.prix).toFixed(2) : '0.00'}€</p>

            <div className={styles.produitActions}>
            <Link href={`/produit/${produit.numero_unique}`}>
              Voir plus d'infos
            </Link>
            <div className={styles.buttonWrapper}>
              <button
                onClick={() => handleAjoutProduit(produit.numero_unique)} // Ajout au panier
                disabled={produit.stock <= 0 || !isUserLoggedIn}  // Disable si pas connecté ou produit en rupture de stock
                style={{
                  cursor: produit.stock <= 0 || !isUserLoggedIn ? "not-allowed" : "pointer",
                  backgroundColor: !isUserLoggedIn
                    ? "#EEECE8"  // Couleur si l'utilisateur n'est pas connecté
                    : produit.stock <= 0
                    ? "#D4AF37"  // Couleur si rupture de stock
                    : "#556B2F", // Couleur si produit disponible
                  color: !isUserLoggedIn
                    ? "#000"  // Texte gris si l'utilisateur n'est pas connecté
                    : produit.stock <= 0
                    ? "#fff"  // Texte gris si rupture de stock
                    : "#fff",    // Texte blanc si produit disponible
                }}
              >
                {!isUserLoggedIn
                  ?                 <Link href="/login">Se connecter</Link>
                  // Texte pour l'utilisateur non connecté
                  : produit.stock > 0
                  ? "Ajouter au panier"  // Texte si produit disponible
                  : "Rupture de stock"}  
              </button>
              {animations[produit.numero_unique] && (
                <div className={styles.plusOne}>+1</div>
              )}
              {panierItem && panierItem.quantite > 0 && (
                <span className="quantityBadgeProduits">
                  {panierItem.quantite}
                </span>
              )}
            </div>
          </div>
          </div>
        );
      })}
    </div>
  );
};

export default Produits;