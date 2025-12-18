'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Charger le composant VillageScene dynamiquement pour éviter les problèmes SSR
const VillageScene = dynamic(() => import('./components/VillageScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#87CEEB',
      fontSize: '24px',
      color: '#fff'
    }}>
      Chargement du village 3D...
    </div>
  )
});

export default function Village3DPage() {
  return (
    <Suspense fallback={
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#87CEEB',
        fontSize: '24px',
        color: '#fff'
      }}>
        Chargement du village 3D...
      </div>
    }>
      <VillageScene />
    </Suspense>
  );
}
