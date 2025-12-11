'use client';
import { useEffect, useState } from 'react';
import styles from './Commande.module.css';
import StatutCommandeChronologie from './StatutCommandeChronologie';
import StatutProduitChronologie from './StatutProduitsChronologie';

import { getCommandes, Commande, CommandeData,LignePanier,Statut,Produit,apiUrl } from "../context/apiService";



const Commandes = () => {
  // Déclarations des états
  const [commandesEnCours, setCommandesEnCours] = useState<Commande[] | null>(null);
  const [historiqueCommandes, setHistoriqueCommandes] = useState<Commande[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCommande, setActiveCommande] = useState<number | null>(null);
  const [statutsProduit, setStatutsProduit] = useState<Statut[]>([]);
  const [statutsCommande, setStatutsCommande] = useState<Statut[]>([]);

  // Fonction pour formater la date
  function formaterDate(date: string): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Votre code qui doit s'exécuter côté client ici
      // Par exemple, ajouter un attribut dynamiquement
      // ou charger un script tiers.
      
      // Si vous devez ajouter un attribut à body :
      document.body.setAttribute('cz-shortcut-listen', 'true');
    }
  }, []);  // Cette dépendance vide signifie que l'effet ne s'exécute qu'une seule fois
  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const CommandeData = await getCommandes(); // Appel à la fonction getCommandes
        console.log("Données reçues : ", CommandeData);
        
        // Vérifier si les commandes en cours ou l'historique des commandes sont vides
        if (CommandeData.commandes_en_cours && CommandeData.historique_commandes) {
          if (CommandeData.commandes_en_cours.length === 0 && CommandeData.historique_commandes.length === 0) {
            return; // Sortir de la fonction si aucune commande
          }
  
          setCommandesEnCours(CommandeData.commandes_en_cours);
          setHistoriqueCommandes(CommandeData.historique_commandes);
        } else {
          throw new Error("Les données de commandes sont manquantes ou mal formatées.");
        }
  
        // Vérifier et affecter les statuts produits et commandes
        if (CommandeData.produits_statut_liste && CommandeData.commandes_statut_liste) {
          setStatutsProduit(CommandeData.produits_statut_liste);
          setStatutsCommande(CommandeData.commandes_statut_liste);
        } else {
          throw new Error("Les statuts produits ou commandes sont manquants.");
        }
      } catch (error) {
        setError("Erreur lors de la récupération des commandes.");
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCommandes(); // Lancer la récupération des commandes lors du montage du composant
  }, []);

  if (loading) return <p>Chargement des commandes...</p>;
  if (error) return <p>{error}</p>;

  const toggleVolet = (id: number) => {
    setActiveCommande(activeCommande === id ? null : id);
  };

  return (
    <div className={styles.commandeContainer}>
      <div className={styles.SectionCommandes}>
      <h1>Commandes en cours</h1>
      {commandesEnCours && commandesEnCours.length > 0 ? (
        commandesEnCours.map((commande: Commande) => (
          <div key={commande.id} className={styles.commandeItem}>
            <h2>Commande #{commande.id}</h2>
            <p><strong>Date :</strong> {formaterDate(commande.date_commande)}</p>
            <p><strong>Statut :</strong> {commande.statut}</p>
            <p><strong>Total :</strong> {commande.total} €</p>
            <p><strong>Livraison :</strong> {commande.livreur}</p>
            <StatutCommandeChronologie statut={commande.statut} />

            <h3>Les Produits commandés:</h3>
            <button
              className={styles.toggleButton}
              onClick={() => toggleVolet(commande.id)}
            >
              <i className={activeCommande === commande.id ? 'fa fa-minus' : 'fa fa-cart-plus'} />
            </button>

              {activeCommande === commande.id && (

              <div className={styles.volet}>

                <ul>
                  {commande.produits?.map((produit, index) => (
                    <div key={index} className={styles.produit}>
                      <div className={styles.produitCommande}>
                        {produit.image && (
                          <img
                            src={`${apiUrl}${produit.image.replace(/^\/+/, '')}`}
                            alt={produit.nom}
                            className={styles.produitImage}
                          />
                        )}

                        <strong>{produit.nom}</strong>
                        <p>Quantité : {produit.quantite}</p>
                        <p>Prix unitaire : {produit.prix} €</p>
                        <p>Total : {produit.quantite * produit.prix} €</p>
                        <p>Statut : {produit.statut}</p>
                      </div>

                      <div className={styles.ProduitChronologie}>
                        <StatutProduitChronologie statut={produit.statut} />
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Aucune commande en cours.</p>
      )}
    </div>
    <div className={styles.SectionCommandes}>
    <h1>Historique des commandes </h1>
      {historiqueCommandes.length > 0 ? (
        historiqueCommandes.map((commande) => (
          <div key={commande.id} className={styles.commandeItem}>
            <h3>Commande #{commande.id}</h3>
            <p><strong>Date :</strong> {formaterDate(commande.date_commande)}</p>
            <p><strong>Total :</strong> {commande.total} €</p>
            <p><strong>Livraison :</strong> {commande.livreur}</p>
            <ul>
              {commande.produits?.map((produit:Produit, index) => (
                <li key={index}>
                  <strong>{produit.nom}</strong> - {produit.quantite} x {produit.prix} €
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Aucune commande terminée.</p>
      )}
    </div>
    </div>

  );
};

export default Commandes;