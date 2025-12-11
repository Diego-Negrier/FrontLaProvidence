// app/panier/page.tsx
"use client"; // Indique que ce composant est un Client Component

import React, { useState } from 'react';
import Panier from '../../components/Panier/Panier'; // Chemin correct vers le composant Panier
import MenuTunnel from '../../components/MenuTunnel/MenuTunnel'; // Importer MenuTunnel

const PanierPage: React.FC = () => {
    // État pour suivre l'étape actuelle dans le tunnel de paiement
    const [currentStep, setCurrentStep] = useState(1); // Étape 1 pour le panier

    // Fonction pour passer à l'étape suivante

    return (
        <div >
            <MenuTunnel currentStep={currentStep} /> {/* Afficher le menu tunnel */}
            <Panier  /> {/* Passer la fonction nextStep au composant Panier */}
        </div>
    );
};

export default PanierPage;