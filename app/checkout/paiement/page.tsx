// app/paiement/page.tsx
"use client"; // Indique que ce composant est un Client Component

import React, { useState } from 'react';
import PaiementStripe from '../../components/Paiement/PaiementStripe'; // Nouveau composant Stripe
import MenuTunnel from '../../components/MenuTunnel/MenuTunnel'; // Importer MenuTunnel

const PaiementPage: React.FC = () => {
    // État pour suivre l'étape actuelle dans le tunnel de paiement
    const [currentStep, setCurrentStep] = useState(4); // Étape 4 pour le paiement



    return (
        <div>
            <MenuTunnel currentStep={currentStep} /> {/* Afficher le menu tunnel */}
            <PaiementStripe  /> {/* Nouveau composant avec intégration Stripe */}
        </div>
    );
};

export default PaiementPage;