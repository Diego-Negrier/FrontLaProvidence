import React from 'react';
import { useRouter } from 'next/router';
import styles from './ProduitDetail.module.css'; // Assure-toi d'importer le fichier CSS

const ProduitDetail: React.FC = () => {
    const router = useRouter();
    const { numeros_unique } = router.query; // Récupérer l'ID du produit depuis l'URL

    return (
        <div className={styles.productDetailContainer}>
            <h1>Détails du produit #{numeros_unique}</h1>
            {/* Ici, vous pouvez afficher les détails du produit */}
        </div>
    );
};

export default ProduitDetail;