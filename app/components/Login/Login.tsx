"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Login.module.css';
import { useAuth } from '@/app/contexts/AuthContext';



const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const router = useRouter();
    const { login } = useAuth(); // Utilisation de login du contexte Auth

    useEffect(() => {
      const inputElement = document.getElementById('usernameOrEmail');
      if (inputElement) {
        inputElement.focus();
      }

      // Vérifier si on arrive depuis une erreur de session expirée
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const message = urlParams.get('message');
        if (message === 'session_expired') {
          setInfoMessage('Votre session a expiré. Veuillez vous reconnecter.');
        }
      }
    }, []);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
          await login(usernameOrEmail, password);
          // Rediriger vers la page d'accueil après connexion réussie
          router.push('/');
      } catch (err: any) {
          console.error('Login error:', err);
          setError('Échec de la connexion. Vérifiez vos identifiants.');
      } finally {
          setLoading(false);
      }
  };
  
    return (
      <div className={styles.containerLogin}>
        <div className={styles.wrapperLogin}>
          <h2>Connexion</h2>
          {infoMessage && <div className={styles.info} style={{ backgroundColor: '#FFF3CD', color: '#856404', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{infoMessage}</div>}
          {error && <div className={styles.error}>{error}</div>}
          {loading ? (
            <div className={styles.loading}>Chargement...</div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <label htmlFor="usernameOrEmail">Nom d'utilisateur ou Email</label>
              <input
                type="text"
                id="usernameOrEmail"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
                placeholder="Entrez votre nom d'utilisateur ou email"
              />
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Entrez votre mot de passe"
              />
              <button type="submit" className={styles.submitButton}>Se connecter</button>
            </form>
          )}
          <div className={styles.registerLink}>
            <p>Pas de compte ? <Link href="/inscription">Inscrivez-vous ici</Link></p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Login;