// app/livraison/page.tsx
"use client"; // Indique que ce composant est un Client Component

import React, { useState } from 'react';
import Livraison from '../../components/Livraison/Livraison'; // Chemin correct vers le composant Livraison
import MenuTunnel from '../../components/MenuTunnel/MenuTunnel'; // Importer MenuTunnel

const LivraisonPage: React.FC = () => {
    // État pour suivre l'étape actuelle dans le tunnel de paiement
    const [currentStep, setCurrentStep] = useState(3); // Étape 3 pour la livraison

    // Fonction pour passer à l'étape suivante


    return (
        <div>
            <MenuTunnel currentStep={currentStep} /> {/* Afficher le menu tunnel */}
            <Livraison  /> {/* Passer la fonction nextStep au composant Livraison */}
        </div>
    );
};

export default LivraisonPage;