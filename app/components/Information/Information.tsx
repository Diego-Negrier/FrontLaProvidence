"use client";

import React, { useEffect, useState } from 'react';
import styles from './Information.module.css';
import { useRouter } from 'next/navigation';
import { ClientService, type Client, type AdresseLivraison, type AdresseFacturation, type Panier, type LignePanier } from "@/app/services";
import { apiUrl } from "@/app/config/api";
import { usePanier } from "@/app/contexts/PanierContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import { FaCheck, FaPen, FaTimes, FaShoppingCart, FaMapMarkerAlt, FaTruck, FaCreditCard } from 'react-icons/fa';
import Link from "next/link";

const Information = () => {
  const { panier } = usePanier();
  const { theme } = useTheme();
  const [client, setClient] = useState<Client | null>(null);
  const [adressesFacturation, setAdressesFacturation] = useState<any[]>([]);
  const [adressesLivraison, setAdressesLivraison] = useState<any[]>([]);
  const [selectedAdresseLivraison, setSelectedAdresseLivraison] = useState<string | null>(null);
  const [selectedAdresseFacturation, setSelectedAdresseFacturation] = useState<string | null>(null);
  const [FormNouvelleAdresse, setNouvelleAdresse] = useState({
    adresse: '',
    code_postal: '',
    ville: '',
    pays: '',
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [adresseType, setAdresseType] = useState<'livraison' | 'facturation' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Récupérer les informations client et les adresses
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await ClientService.getClient();
        setClient(clientData);

        // Mapper correctement les adresses avec code_postal
        if (clientData.adresse_facturation && Array.isArray(clientData.adresse_facturation)) {
          const facturation = clientData.adresse_facturation.map((adresse: AdresseFacturation) => ({
            pk: adresse.pk,
            adresse: adresse.adresse,
            code_postal: adresse.code_postal,
            ville: adresse.ville,
            pays: adresse.pays,
          }));
          setAdressesFacturation(facturation);
        }

        if (clientData.adresse_livraison && Array.isArray(clientData.adresse_livraison)) {
          const livraison = clientData.adresse_livraison.map((adresse: AdresseLivraison) => ({
            pk: adresse.pk,
            adresse: adresse.adresse,
            code_postal: adresse.code_postal,
            ville: adresse.ville,
            pays: adresse.pays,
          }));
          setAdressesLivraison(livraison);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des informations client.");
      }
    };
    fetchClient();
  }, []);

  const calculateTotal = (panier: Panier | null): number =>
    panier?.lignes.reduce((total, item) => {
      const prixUnitaire = Number(item.prix_unitaire || item.prix || 0);
      return total + prixUnitaire * (item.quantite || 0);
    }, 0) || 0;

  const calculatePoidsTotal = (panier: Panier | null): number =>
    panier?.lignes.reduce((totalPoids, item) => {
      const poids = typeof item.produit === 'object' && item.produit?.poids
        ? parseFloat(String(item.produit.poids))
        : parseFloat(String(item.poids || '0')) || 0;
      return totalPoids + poids * (item.quantite || 0);
    }, 0) || 0;

  // Calculer le total TTC (prix avec TVA)
  const calculateTotalTTC = (panier: Panier | null): number =>
    panier?.lignes.reduce((totalTTC, item) => {
      const prixUnitaire = Number(item.prix_unitaire || item.prix || 0);
      const tva = typeof item.produit === 'object' && item.produit?.tva !== undefined
        ? Number(item.produit.tva)
        : Number(item.tva || 0);
      const prixTTC = prixUnitaire * (1 + tva / 100);
      return totalTTC + prixTTC * (item.quantite || 0);
    }, 0) || 0;

  // Calculer le total de la TVA
  const calculateTotalTVA = (panier: Panier | null): number =>
    panier?.lignes.reduce((totalTVA, item) => {
      const prixUnitaire = Number(item.prix_unitaire || item.prix || 0);
      const tva = typeof item.produit === 'object' && item.produit?.tva !== undefined
        ? Number(item.produit.tva)
        : Number(item.tva || 0);
      const prixTTC = prixUnitaire * (1 + tva / 100);
      const tvaProduit = prixTTC - prixUnitaire;
      return totalTVA + tvaProduit * (item.quantite || 0);
    }, 0) || 0;
  const handleLivraison = () => {
    if (!selectedAdresseLivraison || !selectedAdresseFacturation) {
      alert("Veuillez sélectionner une adresse de facturation et de livraison avant de continuer.");
      return;
    }

    const commande = {
      client: client?.nom || null,
      pk_client: client?.pk,
      adresseLivraison: adressesLivraison.find(adresse => String(adresse.pk) === selectedAdresseLivraison),
      adresseFacturation: adressesFacturation.find(adresse => String(adresse.pk) === selectedAdresseFacturation),
      panier: panier?.lignes || [],
      poids: calculatePoidsTotal(panier),
      total: calculateTotalTTC(panier),
    };

    try {
      localStorage.setItem('commande', JSON.stringify(commande));
      router.push('/checkout/livraison');
    } catch (err) {
      setError("Erreur lors de la sauvegarde de la commande.");
    }
  };
  // Fonction de modification de l'adresse
  const handleModifierAdresse = (adressePk: number) => {
    // Trouver l'adresse à modifier parmi les adresses de livraison et de facturation
    const adresseToModify = adressesLivraison.find(adresse => adresse.pk === adressePk)
      || adressesFacturation.find(adresse => adresse.pk === adressePk);

    if (adresseToModify) {
      // Vérifier si l'adresse est de type 'livraison' ou 'facturation'
      if (adressesLivraison.some(adresse => adresse.pk === adressePk)) {
        setAdresseType('livraison');
      } else if (adressesFacturation.some(adresse => adresse.pk === adressePk)) {
        setAdresseType('facturation');
      }

      // Remplir les champs du formulaire avec l'adresse sélectionnée
      setNouvelleAdresse({
        adresse: adresseToModify.adresse,
        code_postal: adresseToModify.code_postal,
        ville: adresseToModify.ville,
        pays: adresseToModify.pays,
      });

      // Ouvrir le popup pour modifier l'adresse
      setIsPopupOpen(true);
    }
  };
  const handleSupprimerAdresse = async (adressePk: number, type: string) => {
    try {
      let adresseToDelete = null;
  
      // Trouver l'adresse à supprimer en fonction du type
      if (type === 'livraison') {
        adresseToDelete = adressesLivraison.find(adresse => adresse.pk === adressePk);
      } else if (type === 'facturation') {
        adresseToDelete = adressesFacturation.find(adresse => adresse.pk === adressePk);
      }
  
      // Si l'adresse n'est pas trouvée, afficher une erreur
      if (!adresseToDelete) {
        alert("Adresse introuvable.");
        return;
      }
  
      // Suppression de l'adresse via API
      if (type === 'livraison') {
        await ClientService.deleteAdresseLivraison(adressePk);  // Suppression côté backend
      } else if (type === 'facturation') {
        await ClientService.deleteAdresseFacturation(adressePk);  // Suppression côté backend
      }
  
      // Mettre à jour les listes d'adresses après la suppression
      if (type === 'livraison') {
        setAdressesLivraison(prevState => prevState.filter(adresse => adresse.pk !== adressePk));
      } else if (type === 'facturation') {
        setAdressesFacturation(prevState => prevState.filter(adresse => adresse.pk !== adressePk));
      }
  
      // Confirmation de la suppression
      alert("Adresse supprimée avec succès.");
    } catch (err) {
      console.error("Erreur lors de la suppression de l'adresse:", err);
      alert("Une erreur est survenue lors de la suppression de l'adresse.");
    }
  };

  const handleAjouterAdresse = async () => {
    // Vérification des champs nécessaires
    if (!FormNouvelleAdresse.adresse || !FormNouvelleAdresse.code_postal || !FormNouvelleAdresse.ville || !FormNouvelleAdresse.pays) {
      alert("Veuillez remplir tous les champs de l'adresse.");
      return; // Empêche l'envoi de la demande si des champs sont manquants
    }

    try {
      // Déterminer le type d'adresse et envoyer les données au backend
      if (adresseType === 'livraison') {
        const nouvelleAdresse = await ClientService.addAdresseLivraison(FormNouvelleAdresse);

        setAdressesLivraison((prevState) => [
          ...prevState,
          nouvelleAdresse
        ]);
      } else if (adresseType === 'facturation') {
        const nouvelleAdresse = await ClientService.addAdresseFacturation(FormNouvelleAdresse);

        setAdressesFacturation((prevState) => [
          ...prevState,
          nouvelleAdresse
        ]);
      }
      // Réinitialiser le formulaire après l'ajout de l'adresse
      setNouvelleAdresse({
        adresse: '',
        code_postal: '',
        ville: '',
        pays: '',
      });


      setIsPopupOpen(false); // Fermer le popup après l'ajout
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'adresse :", err);
      setError("Une erreur est survenue lors de l'ajout de l'adresse.");
    }
  };
  const handleChangeAdresse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNouvelleAdresse((prevState) => ({
      ...prevState,
      [name]: value,  // Mettre à jour l'état en fonction du nom du champ
    }));
  };

  // Fonction pour gérer la modification ou la sélection des adresses
  const handleSelectionAdresse = (type: 'livraison' | 'facturation', adressePk: string) => {
    if (type === 'livraison') {
      setSelectedAdresseLivraison(adressePk);
    } else if (type === 'facturation') {
      setSelectedAdresseFacturation(adressePk);
    }
  };
  return (
    <div className={styles.informationContainer} style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}>
      <div className={styles.ContainerLigne}>
        <div className={styles.leftColumn}>
          <div className={styles.SynthesePanier} style={{ backgroundColor: theme.colors.cardBg }}>
            <h2 style={{ color: theme.colors.primary }}>
              <FaShoppingCart /> Synthèse du Panier
            </h2>
            <table className={styles.TableInformation}>
              <thead style={{ backgroundColor: theme.colors.surface }}>
                <tr>
                  <th style={{ color: theme.colors.textSecondary }}>Image</th>
                  <th style={{ color: theme.colors.textSecondary }}>Produit</th>
                  <th style={{ color: theme.colors.textSecondary }}>Prix</th>
                  <th style={{ color: theme.colors.textSecondary }}>Quantité</th>
                  <th style={{ color: theme.colors.textSecondary }}>Poids</th>
                  <th style={{ color: theme.colors.textSecondary }}>Sous-total</th>
                </tr>
              </thead>
              <tbody>
                {panier?.lignes.map((item: any) => {
                  // Gérer le cas où produit est un objet ou une string
                  const produitNom = typeof item.produit === 'object' && item.produit?.nom
                    ? item.produit.nom
                    : item.produit_nom || item.produit || 'Produit';

                  const produitImage = typeof item.produit === 'object' && item.produit?.image_principale
                    ? item.produit.image_principale
                    : item.image || item.produit_image || null;

                  const produitPoids = typeof item.produit === 'object' && item.produit?.poids
                    ? item.produit.poids
                    : item.poids || '0';

                  const produitTVA = typeof item.produit === 'object' && item.produit?.tva
                    ? item.produit.tva
                    : item.tva || 0;

                  return (
                    <tr key={item.numero_unique || item.id} style={{ backgroundColor: theme.colors.background }}>
                      <td>
                        {produitImage ? (
                          <img
                            src={`${apiUrl}${produitImage.replace(/^\/+/, '')}`}
                            alt={produitNom}
                          />
                        ) : (
                          <i className="fa fa-archive" style={{ fontSize: '2rem', color: theme.colors.textSecondary }}></i>
                        )}
                      </td>
                      <td style={{ color: theme.colors.text }}>{produitNom}</td>
                      <td style={{ color: theme.colors.text, fontWeight: 500 }}>{item.prix_unitaire?.toFixed(2)} €</td>
                      <td style={{ color: theme.colors.text }}>{item.quantite}</td>
                      <td style={{ color: theme.colors.textSecondary }}>{produitPoids} kg</td>
                      <td style={{ color: theme.colors.primary, fontWeight: 600 }}>{(item.prix_unitaire * (1 + produitTVA / 100) * item.quantite).toFixed(2)} €</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ padding: '1rem', backgroundColor: theme.colors.surface, borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ color: theme.colors.text, marginBottom: '0.5rem' }}>Poids total : <strong>{calculatePoidsTotal(panier).toFixed(2)} kg</strong></p>
              <p style={{ color: theme.colors.text, marginBottom: '0.5rem' }}>Total (HT) : <strong>{calculateTotal(panier).toFixed(2)} €</strong></p>
              <p style={{ color: theme.colors.text }}>Total TVA : <strong>{calculateTotalTVA(panier).toFixed(2)} €</strong></p>
            </div>
            <h2 className={styles.TotalProduit} style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
              Total TTC : {calculateTotalTTC(panier).toFixed(2)} €
            </h2>
          </div>
        </div>

        <div className={styles.rightColumn}>
          {/* Liste des adresses */}
          {['Livraison', 'Facturation'].map(type => {
            const adresses = type === 'Livraison' ? adressesLivraison : adressesFacturation;
            const selectedAdresse = type === 'Livraison' ? selectedAdresseLivraison : selectedAdresseFacturation;
            const setSelectedAdresse = type === 'Livraison' ? setSelectedAdresseLivraison : setSelectedAdresseFacturation;

            return (
              <div className={styles.Adresse} key={type} style={{ backgroundColor: theme.colors.cardBg, border: `2px solid ${theme.colors.border}`, borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h2 style={{ color: theme.colors.primary, fontSize: '1.5rem', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaMapMarkerAlt /> Adresse de {type}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setAdresseType(type.toLowerCase() as 'livraison' | 'facturation');
                      setIsPopupOpen(true);
                    }}
                    style={{
                      backgroundColor: theme.colors.success,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span style={{ fontSize: '1.2rem' }}>➕</span> Ajouter
                  </button>
                </div>
                <p style={{
                  color: theme.colors.textSecondary,
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                  backgroundColor: theme.colors.background,
                  padding: '0.75rem',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${theme.colors.primary}`
                }}>
                  💡 {type === 'Livraison'
                    ? 'Sélectionnez l\'adresse où vous souhaitez recevoir votre commande.'
                    : 'Sélectionnez l\'adresse qui apparaîtra sur votre facture.'}
                </p>
                {adresses.length > 0 ? adresses.map((adresse) => (
                  <div
                    key={adresse.pk}
                    className={styles.radioContainer}
                    style={{
                      backgroundColor: selectedAdresse === String(adresse.pk) ? theme.colors.primary + '15' : theme.colors.background,
                      border: selectedAdresse === String(adresse.pk) ? `3px solid ${theme.colors.primary}` : `2px solid ${theme.colors.border}`,
                      borderRadius: '10px',
                      padding: '1rem',
                      marginBottom: '0.75rem',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onClick={() => {
                      setSelectedAdresse(selectedAdresse === String(adresse.pk) ? null : String(adresse.pk));
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                      <input
                        type="checkbox"
                        id={`adresse-${type.toLowerCase()}-${adresse.pk}`}
                        name={`adresse-${type.toLowerCase()}`}
                        value={adresse.pk}
                        className={styles.radioInput}
                        checked={selectedAdresse === String(adresse.pk)}
                        onChange={() => {}}
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          accentColor: theme.colors.primary,
                          marginTop: '0.2rem'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <label
                          htmlFor={`adresse-${type.toLowerCase()}-${adresse.pk}`}
                          className={styles.radioLabel}
                          style={{
                            color: theme.colors.text,
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            fontWeight: selectedAdresse === String(adresse.pk) ? '600' : '400'
                          }}
                        >
                          📍 {adresse.adresse}
                          <br />
                          <span style={{ color: theme.colors.textSecondary, fontSize: '0.9rem' }}>
                            {adresse.code_postal} {adresse.ville}, {adresse.pays}
                          </span>
                        </label>
                        {selectedAdresse === String(adresse.pk) && (
                          <div style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: theme.colors.success + '20',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            color: theme.colors.success,
                            fontWeight: '600'
                          }}>
                            ✓ Adresse sélectionnée
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSupprimerAdresse(adresse.pk, type.toLowerCase());
                        }}
                        className={styles.deleteButton}
                        title="Supprimer cette adresse"
                        style={{
                          backgroundColor: theme.colors.error + '15',
                          color: theme.colors.error,
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = theme.colors.error;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = theme.colors.error + '15';
                          e.currentTarget.style.color = theme.colors.error;
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div style={{
                    color: theme.colors.textSecondary,
                    fontStyle: 'italic',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    backgroundColor: theme.colors.background,
                    borderRadius: '8px',
                    border: `2px dashed ${theme.colors.border}`
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
                    <p>Aucune adresse de {type.toLowerCase()} enregistrée.</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      Cliquez sur "➕ Ajouter" pour en créer une.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      <div>
        <button onClick={handleLivraison} style={{ backgroundColor: theme.colors.primary, color: 'white' }}>
           <FaTruck /> Continuer vers la Livraison
        </button>
      </div>

      {isPopupOpen && (
        <div className={styles.popupOverlay} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className={styles.popupContent} style={{
            backgroundColor: theme.colors.cardBg,
            border: `2px solid ${theme.colors.border}`,
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%'
          }}>
            <button
              onClick={() => setIsPopupOpen(false)}
              className={styles.closeButton}
              title="Fermer"
              style={{
                color: theme.colors.text,
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              <FaTimes />
            </button>

            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ color: theme.colors.primary, fontSize: '1.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <FaMapMarkerAlt /> Nouvelle Adresse
              </h2>
              <p style={{ color: theme.colors.textSecondary, fontSize: '0.9rem' }}>
                {adresseType === 'livraison' ? '📦 Adresse de livraison' : '📄 Adresse de facturation'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ color: theme.colors.text, fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem' }}>
                  🏠 Adresse complète <span style={{ color: theme.colors.error }}>*</span>
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={FormNouvelleAdresse.adresse}
                  onChange={handleChangeAdresse}
                  placeholder="Ex: 123 Rue de la Paix"
                  required
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    border: `2px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                />
              </div>

              <div>
                <label style={{ color: theme.colors.text, fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem' }}>
                  📮 Code postal <span style={{ color: theme.colors.error }}>*</span>
                </label>
                <input
                  type="text"
                  name="code_postal"
                  value={FormNouvelleAdresse.code_postal}
                  onChange={handleChangeAdresse}
                  placeholder="Ex: 75001"
                  required
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    border: `2px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                />
              </div>

              <div>
                <label style={{ color: theme.colors.text, fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem' }}>
                  🏙️ Ville <span style={{ color: theme.colors.error }}>*</span>
                </label>
                <input
                  type="text"
                  name="ville"
                  value={FormNouvelleAdresse.ville}
                  onChange={handleChangeAdresse}
                  placeholder="Ex: Paris"
                  required
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    border: `2px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                />
              </div>

              <div>
                <label style={{ color: theme.colors.text, fontWeight: '600', marginBottom: '0.5rem', display: 'block', fontSize: '0.9rem' }}>
                  🌍 Pays <span style={{ color: theme.colors.error }}>*</span>
                </label>
                <input
                  type="text"
                  name="pays"
                  value={FormNouvelleAdresse.pays}
                  onChange={handleChangeAdresse}
                  placeholder="Ex: France"
                  required
                  style={{
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    border: `2px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    width: '100%',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                  onBlur={(e) => e.target.style.borderColor = theme.colors.border}
                />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setIsPopupOpen(false)}
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  border: `2px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.border}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.colors.background}
              >
                ❌ Annuler
              </button>
              <button
                onClick={handleAjouterAdresse}
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.success,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <FaCheck /> Enregistrer l'adresse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Information;