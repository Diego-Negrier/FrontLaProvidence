import React from 'react';
import styles from './Commande.module.css';

interface StatutProduitChronologieProps {
  statut: string; // Statut doit être une chaîne de caractères
}

const StatutProduitChronologie: React.FC<StatutProduitChronologieProps> = ({ statut }) => {
  const statuts = {
    en_attente: "Attente",
    en_cours: "Cours",
    en_livraison: "Livraison",
    terminee: "Terminée",
    annulee: "Annulée",
  };

  // Convertir l'objet `statuts` en un tableau de clés (par exemple : ['en_attente', 'en_cours', ...])
  const statutKeys = Object.keys(statuts);

  // Trouver l'index du statut actuel dans le tableau des statuts
  const statutIndex = statutKeys.indexOf(statut);

  return (
    <div className={styles.timelineContainer}>
      {statutKeys.map((key, index) => (
        <div key={key} className={styles.timelineItem}>
          <div
            className={`${styles.timelineDot} ${index <= statutIndex ? styles.completed : ''}`}
          />
          <p className={`${styles.timelineLabel} ${index <= statutIndex ? styles.completedLabel : ''}`}>
            {statuts[key as keyof typeof statuts]} 
            {/* Accès sécurisé au libellé du statut */}
          </p>
          {/* Ajouter la ligne seulement entre les points */}
          {index < statutKeys.length - 1 && (
            <div className={`${styles.timelineLine} ${index < statutIndex ? styles.completedLine : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
};


export default StatutProduitChronologie;