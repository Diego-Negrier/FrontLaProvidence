"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import styles from "./Paiement.module.css";
import { StripeService } from "../../services/StripeService";
import { usePanier } from "@/app/contexts/PanierContext";

// Formulaire de paiement Stripe
const CheckoutForm: React.FC<{
  clientSecret: string;
  paymentIntentId: string;
  totalGlobal: number;
}> = ({ clientSecret, paymentIntentId, totalGlobal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { setPanier } = usePanier();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Confirmer le paiement avec Stripe
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message || "Une erreur est survenue");
        setLoading(false);
        return;
      }

      // Récupérer les informations de livraison
      const selectedLivreur = JSON.parse(
        localStorage.getItem("selectedLivreur") || "{}"
      );

      // Confirmer le paiement côté serveur et créer la commande
      const result = await StripeService.confirmPayment(
        paymentIntentId,
        selectedLivreur.id
      );

      if (result.success) {
        setMessage("Paiement réussi ! Votre commande a été créée.");

        // Nettoyer le localStorage
        localStorage.removeItem("selectedLivreur");
        localStorage.removeItem("current_panier_id");
        localStorage.removeItem("totalCommande");
        localStorage.removeItem("commande");
        localStorage.removeItem("panier");

        // Réinitialiser le panier
        setPanier(null);

        // Rediriger vers la page de confirmation
        setTimeout(() => {
          router.push("/commande");
        }, 2000);
      } else {
        setError("Erreur lors de la création de la commande");
      }
    } catch (err: any) {
      console.error("Erreur paiement:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.CarteContainer}>
      <h3>Paiement sécurisé</h3>

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
        <PaymentElement />
      </div>

      {error && (
        <div className={styles.ErrorMessage}>
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className={styles.SuccessMessage}>
          <p>{message}</p>
        </div>
      )}

      <div className={styles.PaymentSummary}>
        <div className={styles.SummaryRow}>
          <span>Total à payer</span>
          <strong>{totalGlobal.toFixed(2)} €</strong>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={styles.PayButton}
      >
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
  );
};

// Composant principal Paiement
const PaiementStripe: React.FC = () => {
  const router = useRouter();
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [commande, setCommande] = useState<any>(null);
  const [totalGlobal, setTotalGlobal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger Stripe et créer le PaymentIntent
  useEffect(() => {
    const initStripe = async () => {
      try {
        console.log("🔄 Initialisation de Stripe...");

        // Récupérer la clé publique Stripe
        const publicKey = await StripeService.getPublicKey();
        console.log("✅ Clé publique récupérée");

        // Charger Stripe avec la clé publique
        const stripe = await loadStripe(publicKey);
        setStripePromise(stripe);
        console.log("✅ Stripe chargé");

        // Récupérer la commande depuis le localStorage
        const storedCommande = localStorage.getItem("commande");
        console.log("📦 Commande stockée:", storedCommande ? "Trouvée" : "Non trouvée");

        if (!storedCommande) {
          setError("Aucune commande trouvée. Veuillez recommencer.");
          setLoading(false);
          return;
        }

        const parsedCommande = JSON.parse(storedCommande);
        setCommande(parsedCommande);
        console.log("✅ Commande parsée:", parsedCommande);

        const total =
          parsedCommande.total + (parsedCommande.livreur?.prix_livraison || 0);
        setTotalGlobal(total);
        console.log("💰 Total:", total);

        // Créer le PaymentIntent
        console.log("🔄 Création du PaymentIntent...");
        const result = await StripeService.createPaymentIntent(
          parsedCommande.pk_client,
          total
        );

        console.log("📋 Résultat PaymentIntent:", result);

        if (result.success) {
          setClientSecret(result.client_secret);
          setPaymentIntentId(result.payment_intent_id);
          console.log("✅ PaymentIntent créé avec succès");
        } else {
          setError("Erreur lors de la création du paiement");
          console.error("❌ Échec création PaymentIntent");
        }
      } catch (err: any) {
        console.error("❌ Erreur initialisation:", err);
        setError(err.message || "Erreur lors de l'initialisation du paiement");
      } finally {
        setLoading(false);
        console.log("✅ Chargement terminé");
      }
    };

    initStripe();
  }, []);

  if (loading) {
    return (
      <div className={styles.paiementContainer}>
        <div className={styles.paiementCart} style={{ gridTemplateColumns: '1fr' }}>
          <div className={styles.PaiementCartBancaire}>
            <div className={styles.CarteContainer}>
              <h3>Chargement du paiement...</h3>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="loading"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.paiementContainer}>
        <div className={styles.paiementCart} style={{ gridTemplateColumns: '1fr' }}>
          <div className={styles.PaiementCartBancaire}>
            <div className={styles.ErrorMessage}>
              <p>{error}</p>
              <button onClick={() => router.push("/checkout/livraison")}>
                Retour à la livraison
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  {commande.adresseLivraison.adresse},{" "}
                  {commande.adresseLivraison.ville},
                  {commande.adresseLivraison.code_postal},{" "}
                  {commande.adresseLivraison.pays}
                </p>

                <h3>Adresse de Facturation :</h3>
                <p>
                  {commande.adresseFacturation.adresse},{" "}
                  {commande.adresseFacturation.ville},
                  {commande.adresseFacturation.code_postal},{" "}
                  {commande.adresseFacturation.pays}
                </p>
              </div>

              <div className={styles.PaiementPanier}>
                <h3>Panier :</h3>
                <ul>
                  {commande.panier.map((item: any, index: number) => {
                    const imageUrl = item.image || item.produit_image || '/images/default-product.png';
                    const produitNom = item.produit?.nom || item.produit_nom || 'Produit';
                    const prixUnitaire = item.prix_unitaire_ttc || item.prix_unitaire || item.produit?.prix_ttc || 0;
                    return (
                      <li key={index} className={styles.PanierItem}>
                        {produitNom} - {prixUnitaire.toFixed(2)}€ x {item.quantite}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className={styles.PaiementResume}>
                <h3>
                  Frais de Livraison :{" "}
                  {commande.livreur?.prix_livraison.toFixed(2)} €
                </h3>
              </div>
            </div>
          </>
        )}

        <div className={styles.PaiementCartBancaire}>
          {loading ? (
            <div className={styles.CarteContainer}>
              <h3>Initialisation du paiement...</h3>
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="loading"></div>
                <p style={{ marginTop: '1rem', color: 'var(--color-textSecondary)' }}>
                  Connexion au système de paiement sécurisé...
                </p>
              </div>
            </div>
          ) : clientSecret && stripePromise && paymentIntentId ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: '#0055A4',
                    colorText: '#1A1A1A',
                    colorDanger: '#DC3545',
                    fontFamily: 'system-ui, sans-serif',
                    borderRadius: '0.75rem',
                  },
                },
              }}
            >
              <CheckoutForm
                clientSecret={clientSecret}
                paymentIntentId={paymentIntentId}
                totalGlobal={totalGlobal}
              />
            </Elements>
          ) : (
            <div className={styles.CarteContainer}>
              <h3 style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>
                ⚠ Erreur de chargement
              </h3>
              <div className={styles.ErrorMessage}>
                <p>Impossible de charger le système de paiement</p>
                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Détails techniques :
                  {!clientSecret && " Client secret manquant."}
                  {!stripePromise && " Stripe non chargé."}
                  {!paymentIntentId && " Payment Intent manquant."}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaiementStripe;
