import React, { useState } from 'react';
import styles from './Parametre.module.css';
import { ClientsService } from '@/app/services'; // Correction de l'import

const Password = () => {
  const [ancienMotDePasse, setAncienMotDePasse] = useState<string>('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAncienMotDePasse, setShowAncienMotDePasse] = useState<boolean>(false);
  const [showNouveauMotDePasse, setShowNouveauMotDePasse] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'ancienMotDePasse') setAncienMotDePasse(value);
    if (name === 'password') setNouveauMotDePasse(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Réinitialiser les messages
    setError(null);
    setSuccess(null);

    // Validation des champs
    if (!ancienMotDePasse || !nouveauMotDePasse || !confirmPassword) {
      setError('Tous les champs sont requis.');
      return;
    }

    if (nouveauMotDePasse !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    // Validation de la longueur du mot de passe
    if (nouveauMotDePasse.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    const data = {
      ancienMotDePasse,
      password: nouveauMotDePasse,
    };

    setLoading(true);

    try {
      // Appel à la méthode correcte du service
      const passwordUpdateData = await ClientsService.clients(data);

      if (passwordUpdateData) {
        setSuccess('Mot de passe mis à jour avec succès. Vous allez être déconnecté.');
        
        // Réinitialiser les champs
        setAncienMotDePasse('');
        setNouveauMotDePasse('');
        setConfirmPassword('');

        // Attendre 2 secondes avant de rediriger
        setTimeout(() => {
          // Nettoyer le localStorage si nécessaire
          localStorage.removeItem('user_pk');
          localStorage.removeItem('authToken'); // Ajustez selon votre logique d'authentification
          
          // Rediriger vers la page de connexion
          window.location.href = '/login';
        }, 2000);
      } else {
        setError('Une erreur est survenue lors de la mise à jour du mot de passe.');
      }
    } catch (error: any) {
      console.error('Une erreur s\'est produite:', error);
      
      // Gérer les erreurs spécifiques
      if (error.message.includes('ancien mot de passe')) {
        setError('L\'ancien mot de passe est incorrect.');
      } else if (error.message.includes('identifiant')) {
        setError('Utilisateur non trouvé. Veuillez vous reconnecter.');
      } else {
        setError(error.message || 'Une erreur est survenue lors de la mise à jour du mot de passe.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (field: string) => {
    if (field === 'ancienMotDePasse') {
      setShowAncienMotDePasse(!showAncienMotDePasse);
    } else if (field === 'nouveauMotDePasse') {
      setShowNouveauMotDePasse(!showNouveauMotDePasse);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className={styles.passwordGeneral}>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form onSubmit={handlePasswordChange} className={styles.form}>
        <div className={styles.formGroup}>
          <div className={styles.passwordContainer}>
            <input
              type={showAncienMotDePasse ? 'text' : 'password'}
              id="ancienMotDePasse"
              name="ancienMotDePasse"
              value={ancienMotDePasse}
              onChange={handleChange}
              placeholder="Ancien mot de passe"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => toggleVisibility('ancienMotDePasse')}
              aria-label="Afficher/masquer le mot de passe"
              className={styles.passwordToggleButton}
              disabled={loading}
            >
              {showAncienMotDePasse ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.passwordContainer}>
            <input
              type={showNouveauMotDePasse ? 'text' : 'password'}
              id="nouveauMotDePasse"
              name="password"
              value={nouveauMotDePasse}
              onChange={handleChange}
              placeholder="Nouveau mot de passe"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => toggleVisibility('nouveauMotDePasse')}
              aria-label="Afficher/masquer le mot de passe"
              className={styles.passwordToggleButton}
              disabled={loading}
            >
              {showNouveauMotDePasse ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmationMotDePasse"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirmer le nouveau mot de passe"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => toggleVisibility('confirmPassword')}
              aria-label="Afficher/masquer le mot de passe"
              className={styles.passwordToggleButton}
              disabled={loading}
            >
              {showConfirmPassword ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Chargement...' : 'Mettre à jour le mot de passe'}
        </button>
      </form>
    </div>
  );
};

export default Password;
