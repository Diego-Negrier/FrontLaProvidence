// Footer.tsx
import React from 'react';
import styles from './Footer.module.css'; // Importez le fichier CSS pour le footer

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} OcciDélice. Tous droits réservés.</p>

        </footer>
    );
};

export default Footer;