"use client";
import React, { useState, useEffect } from 'react';
import styles from './Parametre.module.css';
import { ClientsService, type Client, type AdresseLivraison as AdresseLivraisonType } from '@/app/services';

interface AdresseLivraison {
  pk?: number;
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
}

const AdresseLivraison = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [adressesLivraison, setAdressesLivraison] = useState<AdresseLivraison[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formAdressesLivraison, setFormAdressesLivraison] = useState<AdresseLivraison>({
    adresse: '',
    code_postal: '',
    ville: '',
    pays: '',
  });

  // Charger les adresses de livraison au montage
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        setError(null);

        const pk = localStorage.getItem('user_pk');
        if (!pk) {
          setError('Utilisateur non trouvé. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }

        // Récupérer les données du client
        const clientData = await ClientsService.getClient(Number(pk));
        setClient(clientData);

        // Mapper les adresses de livraison
        if (clientData.adresse_livraison && Array.isArray(clientData.adresse_livraison)) {
          const livraison = clientData.adresse_livraison.map(adresse => ({
            pk: adresse.pk,
            adresse: adresse.adresse,
            code_postal: adresse.code_postal,
            ville: adresse.ville,
            pays: adresse.pays,
          }));
          setAdressesLivraison(livraison);
        }

      } catch (err) {
        console.error('Erreur lors de la récupération des informations client:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des informations client.');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, []);

  // Gestion des changements dans le formulaire
  const handleChangeLivraison = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    // Mapper les noms de champs du formulaire aux noms attendus par l'API
    const fieldMapping: { [key: string]: string } = {
      'adresse': 'adresse',
      'codePostal': 'code_postal',
      'ville': 'ville',
      'pays': 'pays'
    };

    const apiFieldName = fieldMapping[name] || name;

    setFormAdressesLivraison(prevState => ({
      ...prevState,
      [apiFieldName]: value,
    }));
  };

  // Soumission du formulaire pour AJOUTER une adresse
  const handleAdresseLivraison = async (event: React.FormEvent) => {
    event.preventDefault();

    // Réinitialiser les messages
    setError(null);
    setSuccess(null);

    // Validation des champs
    if (!formAdressesLivraison.adresse?.trim() || 
        !formAdressesLivraison.code_postal?.trim() || 
        !formAdressesLivraison.ville?.trim() || 
        !formAdressesLivraison.pays?.trim()) {
      setError('Veuillez remplir tous les champs de l\'adresse de livraison.');
      return;
    }

    // Validation du code postal (exemple pour France)
    const codePostalRegex = /^\d{5}$/;
    if (!codePostalRegex.test(formAdressesLivraison.code_postal)) {
      setError('Le code postal doit contenir 5 chiffres.');
      return;
    }

    try {
      setIsSubmitting(true);

      const pk = localStorage.getItem('user_pk');
      if (!pk) {
        setError('Utilisateur non trouvé.');
        return;
      }

      // Préparer les données pour l'API
      const adresseData = {
        adresse: formAdressesLivraison.adresse.trim(),
        codePostal: formAdressesLivraison.code_postal.trim(),
        ville: formAdressesLivraison.ville.trim(),
        pays: formAdressesLivraison.pays.trim(),
      };

      // ✅ Utiliser addAdresseLivraison pour créer une nouvelle adresse
      const nouvelleAdresse = await ClientsService.addAdresseLivraison(adresseData, Number(pk));

      // Ajouter la nouvelle adresse à la liste
      setAdressesLivraison((prevState) => [
        ...prevState,
        {
          pk: nouvelleAdresse.pk,
          adresse: nouvelleAdresse.adresse,
          code_postal: nouvelleAdresse.code_postal,
          ville: nouvelleAdresse.ville,
          pays: nouvelleAdresse.pays,
        }
      ]);

      // Réinitialiser le formulaire
      setFormAdressesLivraison({
        adresse: '',
        code_postal: '',
        ville: '',
        pays: '',
      });

      setSuccess('Adresse de livraison ajoutée avec succès !');

      // Faire disparaître le message après 5 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout de l\'adresse de livraison.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Suppression d'une adresse
  const handleLivraisonAddressDelete = async (adresseId: number) => {
    if (!adresseId) {
      setError('ID de l\'adresse invalide.');
      return;
    }

    // Confirmation avant suppression
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse de livraison ?')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      const storedPk = localStorage.getItem('user_pk');
      if (!storedPk) {
        setError('ID utilisateur non trouvé.');
        return;
      }

      // Appel de la fonction pour supprimer l'adresse
      await ClientsService.deleteAdresseLivraison(adresseId, Number(storedPk));

      // Mise à jour de la liste des adresses localement
      setAdressesLivraison((prevState) =>
        prevState.filter((address) => address.pk !== adresseId)
      );

      setSuccess('Adresse de livraison supprimée avec succès.');

      // Faire disparaître le message après 5 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'adresse.');
    }
  };

  // ✅ BONUS : Fonction pour MODIFIER une adresse existante
  const handleUpdateAdresse = async (adresseId: number, adresseData: Omit<AdresseLivraison, 'pk'>) => {
    try {
      setError(null);
      setSuccess(null);

      const pk = localStorage.getItem('user_pk');
      if (!pk) {
        setError('Utilisateur non trouvé.');
        return;
      }

      // Utiliser updateAdresseLivraison avec l'ID
      const updatedAdresse = await ClientsService.updateAdresseLivraison(
        adresseId,  // ← ID de l'adresse à modifier
        {
          adresse: adresseData.adresse,
          codePostal: adresseData.code_postal,
          ville: adresseData.ville,
          pays: adresseData.pays,
        },
        Number(pk)
      );

      // Mettre à jour la liste locale
      setAdressesLivraison((prevState) =>
        prevState.map((addr) =>
          addr.pk === adresseId
            ? {
                pk: updatedAdresse.pk,
                adresse: updatedAdresse.adresse,
                code_postal: updatedAdresse.code_postal,
                ville: updatedAdresse.ville,
                pays: updatedAdresse.pays,
              }
            : addr
        )
      );

      setSuccess('Adresse de livraison modifiée avec succès !');

      setTimeout(() => {
        setSuccess(null);
      }, 5000);

    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification de l\'adresse.');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }
  return (
    <div className={styles.adresseLivraisonContainer}>
      {/* Messages d'erreur et de succès */}
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {/* Afficher les adresses de livraison existantes */}
      <div className={styles.existingAddresses}>
        <h4>Adresses de Livraison Existantes</h4>
        {adressesLivraison.length > 0 ? (
          <div className={styles.addressGrid}>
            {adressesLivraison.map((adresse) => (
              <div key={adresse.pk} className={styles.addressCard}>
                <button
                  className={styles.deleteIcon}
                  onClick={() => adresse.pk && handleLivraisonAddressDelete(adresse.pk)}
                  aria-label="Supprimer l'adresse"
                  title="Supprimer cette adresse"
                >
                  &times;
                </button>
                <div className={styles.addressDetailsContainer}>
                  <p className={styles.addressDetails}>
                    <strong>Adresse :</strong> {adresse.adresse || 'Non renseignée'}
                  </p>
                  <p className={styles.addressDetails}>
                    <strong>Code postal :</strong> {adresse.code_postal || 'Non renseigné'}
                  </p>
                  <p className={styles.addressDetails}>
                    <strong>Ville :</strong> {adresse.ville || 'Non renseignée'}
                  </p>
                  <p className={styles.addressDetails}>
                    <strong>Pays :</strong> {adresse.pays || 'Non renseigné'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noAddress}>Aucune adresse de livraison enregistrée.</p>
        )}
      </div>

      {/* Formulaire pour ajouter une nouvelle adresse de livraison */}
      <div className={styles.formSection}>
        <h4>Ajouter une Adresse de Livraison</h4>
        <form onSubmit={handleAdresseLivraison} className={styles.adresseForm}>
          <div className={styles.formGroup}>
            <label htmlFor="adresse_livraison">Adresse *</label>
            <textarea
              id="adresse_livraison"
              name="adresse"
              value={formAdressesLivraison.adresse || ''}
              onChange={handleChangeLivraison}
              placeholder="Numéro et nom de rue"
              required
              disabled={isSubmitting}
              rows={3}
              maxLength={200}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="code_postal_livraison">Code postal *</label>
              <input
                type="text"
                id="code_postal_livraison"
                name="codePostal"
                value={formAdressesLivraison.code_postal || ''}
                onChange={handleChangeLivraison}
                placeholder="75001"
                required
                disabled={isSubmitting}
                maxLength={10}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ville_livraison">Ville *</label>
              <input
                type="text"
                id="ville_livraison"
                name="ville"
                value={formAdressesLivraison.ville || ''}
                onChange={handleChangeLivraison}
                placeholder="Paris"
                required
                disabled={isSubmitting}
                maxLength={100}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="pays_livraison">Pays *</label>
            <input
              type="text"
              id="pays_livraison"
              name="pays"
              value={formAdressesLivraison.pays || ''}
              onChange={handleChangeLivraison}
              placeholder="France"
              required
              disabled={isSubmitting}
              maxLength={100}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ajout en cours...' : 'Ajouter l\'Adresse de Livraison'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdresseLivraison;
