"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Inscription.module.css';
import { AuthService } from '@/app/services';
import { useAuth } from '@/app/contexts/AuthContext';
import type { InscriptionData } from '@/app/services/types';

const Inscription = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        if (password.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        setLoading(true);

        try {
            // Créer le compte avec les données obligatoires et optionnelles
            const inscriptionData: InscriptionData = {
                username,
                email,
                password,
                password_confirm: confirmPassword,
                ...(prenom && { prenom }),
                ...(nom && { nom }),
                ...(telephone && { telephone }),
            };

            await AuthService.inscription(inscriptionData);

            // Connecter automatiquement l'utilisateur après l'inscription
            await login(username, password);

            // Rediriger vers la page d'accueil
            router.push('/');
        } catch (error: any) {
            console.error('Erreur lors de l\'inscription:', error);
            if (error.message.includes('username')) {
                setError('Ce nom d\'utilisateur est déjà utilisé.');
            } else if (error.message.includes('email')) {
                setError('Cet email est déjà utilisé.');
            } else {
                setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.containerLogin}>
            <div className={styles.wrapperLogin}>
                <h2 className={styles.title}>Inscription</h2>
                {error && <div className={styles.error}>{error}</div>}
                {loading ? (
                    <div className={styles.loading}>Création de votre compte...</div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div>
                            <label htmlFor="username" className={styles.label}>Nom d'utilisateur</label>
                            <input
                                id="username"
                                className={styles.input}
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Entrez votre nom d'utilisateur"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                                id="email"
                                className={styles.input}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="prenom" className={styles.label}>Prénom (optionnel)</label>
                            <input
                                id="prenom"
                                className={styles.input}
                                type="text"
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                placeholder="Votre prénom"
                            />
                        </div>

                        <div>
                            <label htmlFor="nom" className={styles.label}>Nom (optionnel)</label>
                            <input
                                id="nom"
                                className={styles.input}
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                placeholder="Votre nom"
                            />
                        </div>

                        <div>
                            <label htmlFor="telephone" className={styles.label}>Téléphone (optionnel)</label>
                            <input
                                id="telephone"
                                className={styles.input}
                                type="tel"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                placeholder="06 12 34 56 78"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className={styles.label}>Mot de passe (min. 8 caractères)</label>
                            <input
                                id="password"
                                className={styles.input}
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                placeholder="Entrez votre mot de passe"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirmer le mot de passe</label>
                            <input
                                id="confirmPassword"
                                className={styles.input}
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                placeholder="Confirmez votre mot de passe"
                            />
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            S'inscrire
                        </button>
                    </form>
                )}
                <div className={styles.registerLink}>
                    <p>Déjà un compte ? <Link href="/login">Se connecter</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Inscription;

