import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Paiement.module.css";
import { PanierService, CommandesService } from "@/app/services";
import { usePanier } from "@/app/contexts/PanierContext";
import { useTheme } from "@/app/contexts/ThemeContext";

// Types
interface DetailErreur {
  produit: string;
  quantite_commandee: number;
  stock_disponible: number;
}

interface Adresse {
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
}

interface ProduitPanier {
  produit?: string;
  produit_nom?: string;
  image?: string;
  produit_image?: string;
  prix: number;
  quantite: number;
}

interface Livreur {
  id: number;
  prix_livraison: number;
}

interface Commande {
  pk_client: number;
  client: string;
  adresseLivraison: Adresse;
  adresseFacturation: Adresse;
  panier: ProduitPanier[];
  livreur?: Livreur;
  total: number;
}

const Paiement: React.FC = () => {
  const router = useRouter();
  const { panier, setPanier } = usePanier();
  
  // États
  const [commande, setCommande] = useState<Commande | null>(null);
  const [totalGlobal, setTotalGlobal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<DetailErreur[]>([]);
  
  // Informations de carte (démonstration)
  const [cardNumber] = useState<string>("4111 1111 1111 1111");
  const [expirationDate] = useState<string>("12/25");
  const [cvv] = useState<string>("123");

  // Charger la commande depuis localStorage
  useEffect(() => {
    const chargerCommande = () => {
      const storedCommande = localStorage.getItem("commande");
      if (!storedCommande) {
        setError("Aucune commande trouvée. Veuillez recommencer.");
        return;
      }

      try {
        const parsedCommande: Commande = JSON.parse(storedCommande);
        setCommande(parsedCommande);
        
        const total = parsedCommande.total + (parsedCommande.livreur?.prix_livraison || 0);
        setTotalGlobal(total);
      } catch (error) {
        console.error("Erreur lors de l'analyse de la commande:", error);
        setError("Impossible de charger la commande.");
      }
    };

    chargerCommande();
  }, []);

  // Récupérer le panier
  const fetchPanier = async () => {
    try {
      const panierData = await PanierService.getPanier();
      setPanier(panierData);
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
    }
  };

  // Nettoyer le localStorage après paiement réussi
  const nettoyerLocalStorage = () => {
    const keysToRemove = [
      "selectedLivreur",
      "current_panier_id",
      "totalCommande",
      "commande",
      "panier"
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  // Gérer le paiement
  const handlePaiement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialisation des erreurs
    setError(null);
    setErrorDetails([]);

    // Validation des données
    if (!commande) {
      setError("Données de commande invalides ou manquantes.");
      return;
    }

    const panierIdStr = localStorage.getItem("panier");
    const selectedLivreurStr = localStorage.getItem("selectedLivreur");

    if (!panierIdStr || !selectedLivreurStr) {
      setError("Informations de panier ou livreur manquantes.");
      return;
    }

    try {
      const panierId = JSON.parse(panierIdStr);
      const selectedLivreur = JSON.parse(selectedLivreurStr);

      const commandeData = {
        client_id: commande.pk_client,
        panier_id: panierId,
        livreur_id: selectedLivreur.id,
        total: commande.total,
      };

      setLoading(true);
      
      const result = await CommandesService.createCommande(commandeData);

      // Gestion des erreurs de stock
      if (result.error) {
        const details: DetailErreur[] = result.details || [];
        setErrorDetails(details);
        
        const errorMessages = details.map(
          (detail) =>
            `Produit: ${detail.produit}, Quantité commandée: ${detail.quantite_commandee}, Stock disponible: ${detail.stock_disponible}`
        );

        setError(`Erreur : ${result.error}. Détails : \n${errorMessages.join("\n")}`);
        return;
      }

      // Succès
      alert("Merci pour votre commande ! Votre commande a été traitée avec succès.");
      
      // Nettoyage et redirection
      nettoyerLocalStorage();
      setTotalGlobal(0);
      setPanier(null);
      
      await fetchPanier();
      
      router.push("/produits");
      
    } catch (error: any) {
      console.error("Erreur lors de la création de la commande:", error);
      setError(error.message || "Erreur lors de la création de la commande.");
      
      // Extraction des détails d'erreur si disponibles
      try {
        const errorMessage = error.message || "";
        const detailsIndex = errorMessage.indexOf("Détails : ");
        
        if (detailsIndex !== -1) {
          const detailsStr = errorMessage.substring(detailsIndex + 10);
          const errorData = JSON.parse(detailsStr);
          
          if (Array.isArray(errorData)) {
            setErrorDetails(errorData);
          }
        }
      } catch (parseError) {
        console.error("Erreur lors de l'analyse des détails:", parseError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtenir l'URL de l'image
  const getImageUrl = (item: ProduitPanier): string => {
    const imageUrl = item.image || item.produit_image || '/images/default-product.png';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    
    return imageUrl.startsWith('http') 
      ? imageUrl 
      : `${apiUrl}${imageUrl.replace(/^\/+/, '')}`;
  };

  return (
    <div className={styles.paiementContainer}>
      <div className={styles.paiementCart}>
        {commande && (
          <>
            <div className={styles.PaiementDetail}>
              <h2>Récapitulatif de la commande</h2>

              <div className={styles.PaiementClient}>
                <h3>Client : {commande.client}</h3>
              </div>

              <div className={styles.Adresse}>
                <h3>Adresse de Livraison :</h3>
                <p>
                  {commande.adresseLivraison.adresse}, {commande.adresseLivraison.ville},
                  {commande.adresseLivraison.code_postal}, {commande.adresseLivraison.pays}
                </p>

                <h3>Adresse de Facturation :</h3>
                <p>
                  {commande.adresseFacturation.adresse}, {commande.adresseFacturation.ville},
                  {commande.adresseFacturation.code_postal}, {commande.adresseFacturation.pays}
                </p>
              </div>

              <div className={styles.PaiementPanier}>
                <h3>Panier :</h3>
                <ul>
                  {commande.panier.map((item, index) => (
                    <li key={index} className={styles.PanierItem}>
                      <img
                        src={getImageUrl(item)}
                        alt={item.produit || item.produit_nom || 'Produit'}
                        className={styles.PanierImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/default-product.png';
                        }}
                      />
                      <span>
                        {item.produit || item.produit_nom} - {item.prix.toFixed(2)}€ x {item.quantite}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.PaiementResume}>
                <h3>
                  Frais de Livraison : {(commande.livreur?.prix_livraison || 0).toFixed(2)} €
                </h3>
                <h3 className="TotalProduit">
                  Total à payer : {totalGlobal.toFixed(2)} €
                </h3>
              </div>
            </div>
          </>
        )}

        <div className={styles.PaiementCartBancaire}>
          <form onSubmit={handlePaiement} className={styles.CarteContainer}>
            <h3>Paiement Sécurisé</h3>

            {/* Boutons de paiement express */}
            <div className={styles.ExpressPaymentButtons}>
              <button
                type="button"
                className={styles.ApplePayButton}
                onClick={() => alert('Apple Pay sera intégré prochainement')}
              >
                <span className={styles.ApplePayIcon}></span>
                Apple Pay
              </button>

              <button
                type="button"
                className={styles.GooglePayButton}
                onClick={() => alert('Google Pay sera intégré prochainement')}
              >
                <span className={styles.GooglePayIcon}>G</span>
                Google Pay
              </button>
            </div>

            <div className={styles.Divider}>
              <span>ou payer par carte</span>
            </div>

            <div className={styles.Carte}>
              <div className={styles.CarteHeader}>
                <span>💳 Visa / Mastercard</span>
              </div>

              <div className={styles.CarteDetails}>
                <div className={styles.FormGroup}>
                  <label htmlFor="cardNumber" className={styles.inputLabel}>
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardNumber}
                    className={styles.inputField}
                    placeholder="1234 5678 9012 3456"
                    readOnly
                  />
                </div>

                <div className={styles.CardRow}>
                  <div className={styles.FormGroup}>
                    <label htmlFor="expirationDate" className={styles.inputLabel}>
                      Expiration
                    </label>
                    <input
                      type="text"
                      id="expirationDate"
                      value={expirationDate}
                      className={styles.inputField}
                      placeholder="MM/AA"
                      readOnly
                    />
                  </div>

                  <div className={styles.FormGroup}>
                    <label htmlFor="cvv" className={styles.inputLabel}>
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      value={cvv}
                      className={styles.inputField}
                      placeholder="123"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.PaymentSummary}>
              <div className={styles.SummaryRow}>
                <span>Total à payer</span>
                <strong>{totalGlobal.toFixed(2)} €</strong>
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.PayButton}>
              {loading ? (
                <>
                  <span className={styles.Spinner}></span>
                  Traitement en cours...
                </>
              ) : (
                <>
                  🔒 Payer {totalGlobal.toFixed(2)} €
                </>
              )}
            </button>

            <div className={styles.SecurityBadge}>
              <span>🔐 Paiement 100% sécurisé</span>
            </div>
          </form>
        </div>

        {error && (
          <div className={styles.ErrorMessage}>
            <p>{error.split("Détails :")[0]}</p>
            {errorDetails.length > 0 && (
              <ul>
                {errorDetails.map((detail, index) => (
                  <li key={index} className={styles.ErrorItem}>
                    Produit : <strong>{detail.produit}</strong>
                    <br />
                    <span className={styles.quantite}>
                      Quantité commandée : {detail.quantite_commandee}
                    </span>
                    <br />
                    <span className={styles.stock}>
                      Stock disponible : {detail.stock_disponible}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Paiement;
