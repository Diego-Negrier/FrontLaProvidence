import React, { useState, useEffect } from 'react';
import { ClientsService, type Client } from '@/app/services';

const Information = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Charger les données du client au montage du composant
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedPk = localStorage.getItem('user_pk');
        if (!storedPk) {
          setError('Utilisateur non trouvé. Veuillez vous reconnecter.');
          setLoading(false);
          return;
        }

        // Récupérer les informations du client
        const clientData = await ClientsService.getClient(Number(storedPk));
        setClient(clientData);
        setFormData(clientData);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  // Gestion des changements dans les champs de saisie
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData!,
        [name]: value,
      }));
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Réinitialiser les messages
    setError(null);
    setSuccess(null);

    if (!formData) {
      setError('Aucune donnée à soumettre.');
      return;
    }

    // Validation des champs
    if (!formData.prenom?.trim() || !formData.nom?.trim() || !formData.email?.trim()) {
      setError('Tous les champs sont requis.');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    try {
      setIsSubmitting(true);

      const storedPk = localStorage.getItem('user_pk');
      if (!storedPk) {
        setError('Client introuvable. Veuillez vous reconnecter.');
        return;
      }

      // Construire le corps de la requête avec les informations à mettre à jour
      const data = {
        prenom: formData.prenom.trim(),
        nom: formData.nom.trim(),
        email: formData.email.trim(),
      };

      // Appel à la fonction d'update des informations du client
      const updatedClient = await ClientsService.updateClientInfo(data, Number(storedPk));

      // Mettre à jour l'état local avec les nouvelles données
      setClient(updatedClient);
      setFormData(updatedClient);

      // Afficher un message de succès
      setSuccess('Informations mises à jour avec succès !');

      // Optionnel: faire disparaître le message après quelques secondes
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la mise à jour.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="informationContainer">
      {loading ? (
        <div className="loadingContainer">
          <p>Chargement des informations...</p>
        </div>
      ) : (
        <>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit} className="informationForm">
            <div className="formGroup">
              <label htmlFor="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData?.prenom || ''}
                onChange={handleChange}
                placeholder="Prénom"
                required
                disabled={isSubmitting}
                maxLength={50}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData?.nom || ''}
                onChange={handleChange}
                placeholder="Nom"
                required
                disabled={isSubmitting}
                maxLength={50}
              />
            </div>

            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData?.email || ''}
                onChange={handleChange}
                placeholder="Email"
                required
                disabled={isSubmitting}
                maxLength={100}
              />
            </div>

            <button 
              type="submit" 
              className="submitButton"
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Information;
