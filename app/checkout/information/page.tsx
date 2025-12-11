// app/information/page.tsx
"use client"; // Indique que ce composant est un Client Component

import React, { useState } from 'react';
import Information from '../../components/Information/Information'; // Chemin correct vers le composant Information
import MenuTunnel from '../../components/MenuTunnel/MenuTunnel'; // Importer MenuTunnel

const InformationPage: React.FC = () => {
    // État pour suivre l'étape actuelle dans le tunnel de paiement
    const [currentStep, setCurrentStep] = useState(2); // Étape 2 pour les informations

    // Fonction pour passer à l'étape suivante

    return (
        <div>
            <MenuTunnel currentStep={currentStep} /> {/* Afficher le menu tunnel */}
            <Information />
        </div>
    );
};

export default InformationPage;