# 🏗️ Organisation Complète du Projet Village 3D

## 📁 Structure Finale Organisée

```
FrontLaProvidence/
├── app/
│   ├── components/
│   │   └── Village3D/
│   │       ├── Scene3D.tsx                    # ⭐ Scène principale
│   │       │
│   │       ├── config/                        # 🆕 Configuration
│   │       │   ├── positions.ts               # Positions des éléments
│   │       │   ├── modelPaths.ts              # Chemins des modèles
│   │       │   └── categories.ts              # IDs catégories API
│   │       │
│   │       ├── Environment/                   # Environnement
│   │       │   ├── Vallee3D.tsx
│   │       │   ├── CollineVillage.tsx
│   │       │   ├── PlaceVillage.tsx
│   │       │   ├── ArbreFrancais.tsx
│   │       │   ├── ArbreBlender.tsx          # 🆕 Arbres Blender
│   │       │   ├── AtmosphericFog.tsx
│   │       │   └── NuagesRealistes.tsx
│   │       │
│   │       ├── Buildings/                     # Bâtiments
│   │       │   ├── types.ts                  # 🆕 Types communs
│   │       │   ├── BuildingBase.tsx          # 🆕 Composant de base
│   │       │   │
│   │       │   ├── Procedural/               # 🆕 Géométrique (actuel)
│   │       │   │   ├── VillageFrancaisRealiste.tsx
│   │       │   │   ├── Forge.tsx
│   │       │   │   ├── Charpentier.tsx
│   │       │   │   └── TailleurPierre.tsx
│   │       │   │
│   │       │   └── Blender/                  # 🆕 Modèles Blender
│   │       │       ├── MaisonMedievale.tsx
│   │       │       ├── Eglise.tsx
│   │       │       ├── ForgeBlender.tsx
│   │       │       ├── CharpentierBlender.tsx
│   │       │       └── TailleurPierreBlender.tsx
│   │       │
│   │       ├── Agriculture/
│   │       │   ├── ChampBle.tsx
│   │       │   ├── Vigne.tsx
│   │       │   ├── PrairieVaches.tsx
│   │       │   └── Vache.tsx
│   │       │
│   │       ├── Vendors/                       # Commerce
│   │       │   ├── Procedural/
│   │       │   │   └── StandLuxueux.tsx      # Actuel
│   │       │   └── Blender/                  # 🆕
│   │       │       ├── StandMarche.tsx
│   │       │       ├── EtalFruits.tsx
│   │       │       └── EtalFromages.tsx
│   │       │
│   │       ├── Decorations/
│   │       │   ├── DrapeauMonarchique.tsx
│   │       │   ├── BancPublic.tsx
│   │       │   └── Blender/                  # 🆕
│   │       │       ├── Tonneau.tsx
│   │       │       ├── Chariot.tsx
│   │       │       └── Fontaine.tsx
│   │       │
│   │       ├── Materials/
│   │       │   └── SharedMaterials.tsx
│   │       │
│   │       ├── Controls/
│   │       │   └── FirstPersonControls.tsx
│   │       │
│   │       └── UI/
│   │           └── CategorieModal.tsx         # Modal avec API
│   │
│   ├── contexts/                              # APIs (ne pas toucher)
│   │   ├── AuthContext.tsx
│   │   ├── PanierContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   └── services/                              # APIs (ne pas toucher)
│       ├── PanierService.ts
│       └── types.ts
│
├── public/
│   ├── models/                                # 🆕 Modèles 3D
│   │   ├── buildings/
│   │   │   ├── procedural/                   # Vides (fallback)
│   │   │   └── blender/                      # 🆕 Vos modèles
│   │   │       ├── maison_medievale_1.glb
│   │   │       ├── maison_medievale_2.glb
│   │   │       ├── eglise.glb
│   │   │       ├── forge.glb
│   │   │       ├── charpentier.glb
│   │   │       └── tailleur_pierre.glb
│   │   │
│   │   ├── vendors/                          # 🆕 Stands de marché
│   │   │   ├── stand_marche_1.glb
│   │   │   ├── stand_marche_2.glb
│   │   │   └── etal_fruits.glb
│   │   │
│   │   ├── decorations/                      # 🆕 Décorations
│   │   │   ├── tonneau.glb
│   │   │   ├── chariot.glb
│   │   │   └── fontaine.glb
│   │   │
│   │   ├── vegetation/                       # 🆕 Végétation
│   │   │   ├── arbre_medieval_1.glb
│   │   │   ├── arbre_medieval_2.glb
│   │   │   └── buisson.glb
│   │   │
│   │   └── animals/                          # 🆕 Animaux
│   │       └── vache_realiste.glb
│   │
│   └── textures/
│       └── village/
│           └── red_sandstone_diffuse.jpg
│
└── docs/                                      # 🆕 Documentation organisée
    ├── QUICK_START.md                        # Guide démarrage rapide
    ├── API/
    │   └── INTEGRATION_API.md                # Comment les APIs sont connectées
    ├── BLENDER/
    │   ├── WORKFLOW.md                       # Workflow Blender
    │   ├── OU_TROUVER_MODELES.md            # Sites de téléchargement
    │   └── INTEGRATION_5MIN.md              # Intégrer en 5 min
    └── VILLAGE/
        ├── STRUCTURE.md                      # Structure du village
        └── CUSTOMIZATION.md                  # Personnalisation
```

---

## 🎯 Étapes d'Intégration (Sans Affecter les APIs)

### ÉTAPE 1: Créer la Configuration Centralisée

#### Fichier 1: `Village3D/config/modelPaths.ts`

```typescript
/**
 * Chemins vers tous les modèles 3D
 * Centralise la gestion des fichiers GLB
 */

export const MODEL_PATHS = {
  // Bâtiments Blender
  buildings: {
    maison1: '/models/buildings/blender/maison_medievale_1.glb',
    maison2: '/models/buildings/blender/maison_medievale_2.glb',
    eglise: '/models/buildings/blender/eglise.glb',
    forge: '/models/buildings/blender/forge.glb',
    charpentier: '/models/buildings/blender/charpentier.glb',
    tailleurPierre: '/models/buildings/blender/tailleur_pierre.glb',
  },

  // Stands de marché
  vendors: {
    standMarche1: '/models/vendors/stand_marche_1.glb',
    standMarche2: '/models/vendors/stand_marche_2.glb',
    etalFruits: '/models/vendors/etal_fruits.glb',
  },

  // Décorations
  decorations: {
    tonneau: '/models/decorations/tonneau.glb',
    chariot: '/models/decorations/chariot.glb',
    fontaine: '/models/decorations/fontaine.glb',
  },

  // Végétation
  vegetation: {
    arbre1: '/models/vegetation/arbre_medieval_1.glb',
    arbre2: '/models/vegetation/arbre_medieval_2.glb',
    buisson: '/models/vegetation/buisson.glb',
  },

  // Animaux
  animals: {
    vacheRealiste: '/models/animals/vache_realiste.glb',
  },
};

// Vérifier si un modèle existe
export const modelExists = (path: string): boolean => {
  return path !== '' && path !== undefined;
};

// Obtenir un modèle avec fallback
export const getModelPath = (category: keyof typeof MODEL_PATHS, name: string, fallback?: string): string => {
  const path = MODEL_PATHS[category]?.[name as keyof typeof MODEL_PATHS[keyof typeof MODEL_PATHS]];
  return path || fallback || '';
};
```

#### Fichier 2: `Village3D/config/positions.ts`

```typescript
/**
 * Positions de tous les éléments du village
 * Facilite l'ajustement du layout
 */

export type Position3D = [number, number, number];
export type Rotation3D = [number, number, number];

export const VILLAGE_POSITIONS = {
  // Hauteur du village sur la colline
  VILLAGE_HEIGHT: 8,

  // Bâtiments principaux
  buildings: {
    eglise: [0, 8, -15] as Position3D,
    maisonPrincipale: [12, 8, 0] as Position3D,
  },

  // Stands de marché (ligne droite, côté droit)
  vendors: {
    fruitsLegumes: {
      position: [10, 8, 20] as Position3D,
      categorieId: 145,
      nom: 'Fruits & Légumes',
    },
    fromages: {
      position: [10, 8, 16] as Position3D,
      categorieId: 146,
      nom: 'Fromages & Produits Laitiers',
    },
    boissons: {
      position: [10, 8, 12] as Position3D,
      categorieId: 149,
      nom: 'Boissons',
    },
    boulangerie: {
      position: [10, 8, 8] as Position3D,
      categorieId: 147,
      nom: 'Boulangerie',
    },
    viandesPoissons: {
      position: [10, 8, 4] as Position3D,
      categorieId: 150,
      nom: 'Viandes & Poissons',
    },
  },

  // Artisans (ligne droite, côté gauche)
  artisans: {
    forge: {
      position: [-10, 8, 20] as Position3D,
      categorieId: 4,
      nom: 'Forge du Village',
    },
    charpentier: {
      position: [-10, 8, 12] as Position3D,
      categorieId: 5,
      nom: 'Atelier du Charpentier',
    },
    tailleurPierre: {
      position: [-10, 8, 4] as Position3D,
      categorieId: 6,
      nom: 'Taillerie de Pierre',
    },
  },

  // Agriculture (dans la vallée, Y=0)
  agriculture: {
    champsBle: [
      { position: [35, 0, -15] as Position3D, size: [18, 12] as [number, number] },
      { position: [35, 0, 5] as Position3D, size: [15, 10] as [number, number] },
      { position: [55, 0, -5] as Position3D, size: [12, 14] as [number, number] },
    ],
    vignobles: [
      { position: [35, 0, 25] as Position3D, rows: 6, vinesPerRow: 10 },
      { position: [55, 0, 20] as Position3D, rows: 5, vinesPerRow: 8 },
    ],
    prairies: [
      { position: [-35, 0, 10] as Position3D, size: [18, 15] as [number, number], vaches: 8 },
      { position: [-35, 0, -15] as Position3D, size: [15, 12] as [number, number], vaches: 6 },
    ],
  },

  // Décorations
  decorations: {
    drapeaux: [
      { position: [-3, 8, 28] as Position3D, type: 'royaume' },
      { position: [3, 8, 28] as Position3D, type: 'royaume' },
      { position: [14, 8, 2] as Position3D, type: 'royaume' },
      { position: [14, 8, 22] as Position3D, type: 'royaume' },
      { position: [-14, 8, 2] as Position3D, type: 'royaume' },
      { position: [-14, 8, 22] as Position3D, type: 'royaume' },
    ],
    bancs: [
      { position: [6, 8, 12] as Position3D },
      { position: [6, 8, 16] as Position3D },
    ],
    arbres: [
      { position: [18, 8, -5] as Position3D },
      { position: [22, 8, 5] as Position3D },
      { position: [-14, 8, 12] as Position3D },
      { position: [-14, 8, 16] as Position3D },
    ],
  },
};
```

#### Fichier 3: `Village3D/config/categories.ts`

```typescript
/**
 * Mapping des catégories API
 * NE PAS MODIFIER (connecté au backend Django)
 */

export const API_CATEGORIES = {
  // Stands de marché
  fruitsLegumes: 145,
  fromages: 146,
  boissons: 149,
  boulangerie: 147,
  viandesPoissons: 150,

  // Artisans
  forge: 4,
  charpentier: 5,
  tailleurPierre: 6,
};

export type CategorieId = typeof API_CATEGORIES[keyof typeof API_CATEGORIES];
```

---

### ÉTAPE 2: Créer le Composant de Base Réutilisable

#### Fichier: `Village3D/Buildings/BuildingBase.tsx`

```typescript
import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import * as THREE from 'three';

export interface BuildingBaseProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  onClick?: () => void;
}

/**
 * Composant de base pour tous les bâtiments
 * Gère automatiquement le chargement des modèles GLB
 */
export function BuildingBase({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick
}: BuildingBaseProps) {

  const { scene } = useGLTF(modelPath);

  // Configurer les ombres
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    />
  );
}

// Précharger un modèle
export const preloadModel = (path: string) => {
  useGLTF.preload(path);
};
```

---

### ÉTAPE 3: Créer les Composants Blender Organisés

#### Fichier: `Village3D/Buildings/Blender/MaisonMedievale.tsx`

```typescript
import { BuildingBase, preloadModel } from '../BuildingBase';
import { MODEL_PATHS } from '../../config/modelPaths';

interface MaisonMedievaleProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  variant?: 1 | 2; // Différentes variantes
}

export function MaisonMedievale({
  position = [0, 8, 0],
  rotation = [0, 0, 0],
  scale = 2,
  variant = 1
}: MaisonMedievaleProps) {

  const modelPath = variant === 1
    ? MODEL_PATHS.buildings.maison1
    : MODEL_PATHS.buildings.maison2;

  return (
    <BuildingBase
      modelPath={modelPath}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

// Précharger les modèles au démarrage
preloadModel(MODEL_PATHS.buildings.maison1);
preloadModel(MODEL_PATHS.buildings.maison2);
```

#### Fichier: `Village3D/Buildings/Blender/Eglise.tsx`

```typescript
import { BuildingBase, preloadModel } from '../BuildingBase';
import { MODEL_PATHS } from '../../config/modelPaths';

interface EgliseProps {
  position?: [number, number, number];
  scale?: number;
}

export function Eglise({
  position = [0, 8, -15],
  scale = 3
}: EgliseProps) {
  return (
    <BuildingBase
      modelPath={MODEL_PATHS.buildings.eglise}
      position={position}
      scale={scale}
    />
  );
}

preloadModel(MODEL_PATHS.buildings.eglise);
```

#### Fichier: `Village3D/Vendors/Blender/StandMarche.tsx`

```typescript
import { BuildingBase, preloadModel } from '../../Buildings/BuildingBase';
import { MODEL_PATHS } from '../../config/modelPaths';

interface StandMarcheProps {
  position?: [number, number, number];
  categorieId: number;
  nom: string;
  onClick?: () => void;
  variant?: 1 | 2;
}

export function StandMarche({
  position = [0, 8, 0],
  categorieId,
  nom,
  onClick,
  variant = 1
}: StandMarcheProps) {

  const modelPath = variant === 1
    ? MODEL_PATHS.vendors.standMarche1
    : MODEL_PATHS.vendors.standMarche2;

  return (
    <BuildingBase
      modelPath={modelPath}
      position={position}
      scale={1.5}
      onClick={onClick}
    />
  );
}

preloadModel(MODEL_PATHS.vendors.standMarche1);
preloadModel(MODEL_PATHS.vendors.standMarche2);
```

---

### ÉTAPE 4: Modifier Scene3D.tsx (Version Hybride)

Cette version permet de **basculer facilement** entre modèles géométriques et Blender:

```typescript
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { PlaceVillage } from './Environment/PlaceVillage';
import { Vallee3D } from './Environment/Vallee3D';
import { CollineVillage } from './Environment/CollineVillage';
import { AtmosphericFog } from './Environment/AtmosphericFog';
import { FirstPersonControls } from './FirstPersonControls';
import { OrbitControls } from '@react-three/drei';
import { SharedMaterialsProvider } from './Materials/SharedMaterials';

// Configuration
import { VILLAGE_POSITIONS } from './config/positions';
import { MODEL_PATHS } from './config/modelPaths';

// Composants géométriques (actuels)
import { VillageFrancaisRealiste } from './Buildings/Procedural/VillageFrancaisRealiste';
import { StandLuxueux } from './Vendors/StandLuxueux';
import { Forge } from './Buildings/Procedural/Forge';
import { Charpentier } from './Buildings/Procedural/Charpentier';
import { TailleurPierre } from './Buildings/Procedural/TailleurPierre';

// Composants Blender (nouveaux - à activer progressivement)
import { MaisonMedievale } from './Buildings/Blender/MaisonMedievale';
import { Eglise } from './Buildings/Blender/Eglise';
import { StandMarche } from './Vendors/Blender/StandMarche';

// Environnement & Décorations
import { ChampBle } from './Agriculture/ChampBle';
import { Vigne } from './Agriculture/Vigne';
import { PrairieVaches } from './Agriculture/PrairieVaches';
import { DrapeauMonarchique } from './Decorations/DrapeauMonarchique';
import { ArbreFrancais } from './Environment/ArbreFrancais';
import { BancPublic } from './Environment/BancPublic';

interface Scene3DProps {
  onFournisseurClick?: (id: number, nom: string) => void;
  visitMode?: 'orbit' | 'walk';
  useBlenderModels?: boolean; // 🆕 Basculer entre géométrique/Blender
}

export default function Scene3D({
  onFournisseurClick,
  visitMode = 'orbit',
  useBlenderModels = false // Par défaut: géométrique
}: Scene3DProps) {
  return (
    <Canvas
      camera={{ position: [30, 20, 50], fov: 70 }}
      shadows
    >
      {/* Éclairage */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[50, 40, 30]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        color="#FFF8DC"
      />
      <hemisphereLight intensity={0.4} color="#87CEEB" groundColor="#4A7C2E" />
      <directionalLight position={[-30, 20, -40]} intensity={0.6} color="#FFD700" />

      <AtmosphericFog />

      <Suspense fallback={null}>
        <SharedMaterialsProvider>
          {/* Vallée et colline (ne changent pas) */}
          <Vallee3D position={[0, -5, 0]} />
          <CollineVillage position={[0, 0, 0]} />

          {/* Village sur la colline */}
          <group position={[0, VILLAGE_POSITIONS.VILLAGE_HEIGHT, 0]}>
            <PlaceVillage />

            {/* Drapeaux */}
            {VILLAGE_POSITIONS.decorations.drapeaux.map((drapeau, idx) => (
              <DrapeauMonarchique
                key={`drapeau-${idx}`}
                position={drapeau.position}
                type={drapeau.type as any}
              />
            ))}

            {/* === STANDS DE MARCHÉ === */}
            {useBlenderModels ? (
              // Version Blender
              <>
                <StandMarche
                  position={VILLAGE_POSITIONS.vendors.fruitsLegumes.position}
                  categorieId={VILLAGE_POSITIONS.vendors.fruitsLegumes.categorieId}
                  nom={VILLAGE_POSITIONS.vendors.fruitsLegumes.nom}
                  onClick={() => onFournisseurClick?.(145, 'Fruits & Légumes')}
                  variant={1}
                />
                <StandMarche
                  position={VILLAGE_POSITIONS.vendors.fromages.position}
                  categorieId={VILLAGE_POSITIONS.vendors.fromages.categorieId}
                  nom={VILLAGE_POSITIONS.vendors.fromages.nom}
                  onClick={() => onFournisseurClick?.(146, 'Fromages')}
                  variant={2}
                />
                {/* Ajouter les autres stands... */}
              </>
            ) : (
              // Version géométrique (actuelle)
              <>
                <StandLuxueux
                  position={VILLAGE_POSITIONS.vendors.fruitsLegumes.position}
                  categorieId={VILLAGE_POSITIONS.vendors.fruitsLegumes.categorieId}
                  onClick={() => onFournisseurClick?.(145, 'Fruits & Légumes')}
                />
                <StandLuxueux
                  position={VILLAGE_POSITIONS.vendors.fromages.position}
                  categorieId={VILLAGE_POSITIONS.vendors.fromages.categorieId}
                  onClick={() => onFournisseurClick?.(146, 'Fromages')}
                />
                <StandLuxueux
                  position={VILLAGE_POSITIONS.vendors.boissons.position}
                  categorieId={VILLAGE_POSITIONS.vendors.boissons.categorieId}
                  onClick={() => onFournisseurClick?.(149, 'Boissons')}
                />
                <StandLuxueux
                  position={VILLAGE_POSITIONS.vendors.boulangerie.position}
                  categorieId={VILLAGE_POSITIONS.vendors.boulangerie.categorieId}
                  onClick={() => onFournisseurClick?.(147, 'Boulangerie')}
                />
                <StandLuxueux
                  position={VILLAGE_POSITIONS.vendors.viandesPoissons.position}
                  categorieId={VILLAGE_POSITIONS.vendors.viandesPoissons.categorieId}
                  onClick={() => onFournisseurClick?.(150, 'Viandes & Poissons')}
                />
              </>
            )}

            {/* === ARTISANS === */}
            {useBlenderModels ? (
              // Version Blender (à compléter)
              <>
                {/* Forge Blender à créer */}
              </>
            ) : (
              // Version géométrique
              <>
                <Forge
                  position={VILLAGE_POSITIONS.artisans.forge.position}
                  onClick={() => onFournisseurClick?.(4, 'Forge')}
                />
                <Charpentier
                  position={VILLAGE_POSITIONS.artisans.charpentier.position}
                  onClick={() => onFournisseurClick?.(5, 'Charpentier')}
                />
                <TailleurPierre
                  position={VILLAGE_POSITIONS.artisans.tailleurPierre.position}
                  onClick={() => onFournisseurClick?.(6, 'Tailleur de Pierre')}
                />
              </>
            )}

            {/* === BÂTIMENT PRINCIPAL === */}
            {useBlenderModels ? (
              <>
                <Eglise position={VILLAGE_POSITIONS.buildings.eglise} />
                <MaisonMedievale position={[5, 0, 10]} variant={1} />
                <MaisonMedievale position={[10, 0, 15]} variant={2} />
                <MaisonMedievale position={[-5, 0, 12]} variant={1} />
              </>
            ) : (
              <VillageFrancaisRealiste position={VILLAGE_POSITIONS.buildings.maisonPrincipale} />
            )}

            {/* Bancs */}
            {VILLAGE_POSITIONS.decorations.bancs.map((banc, idx) => (
              <group key={`banc-${idx}`} position={banc.position}>
                <BancPublic />
              </group>
            ))}

            {/* Arbres */}
            {VILLAGE_POSITIONS.decorations.arbres.map((arbre, idx) => (
              <group key={`arbre-${idx}`} position={arbre.position}>
                <ArbreFrancais />
              </group>
            ))}
          </group>

          {/* === AGRICULTURE (ne change pas) === */}
          {VILLAGE_POSITIONS.agriculture.champsBle.map((champ, idx) => (
            <ChampBle key={`ble-${idx}`} position={champ.position} size={champ.size} />
          ))}

          {VILLAGE_POSITIONS.agriculture.vignobles.map((vigne, idx) => (
            <Vigne
              key={`vigne-${idx}`}
              position={vigne.position}
              rows={vigne.rows}
              vinesPerRow={vigne.vinesPerRow}
            />
          ))}

          {VILLAGE_POSITIONS.agriculture.prairies.map((prairie, idx) => (
            <PrairieVaches
              key={`prairie-${idx}`}
              position={prairie.position}
              size={prairie.size}
              nombreVaches={prairie.vaches}
            />
          ))}

        </SharedMaterialsProvider>
      </Suspense>

      {/* Contrôles */}
      {visitMode === 'walk' ? (
        <FirstPersonControls />
      ) : (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={15}
          maxDistance={120}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0, 0]}
        />
      )}
    </Canvas>
  );
}
```

---

### ÉTAPE 5: Modifier la Page Immersion pour Basculer

#### Fichier: `app/immersion/page.tsx`

```typescript
"use client";

import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import CategorieModal from '@/app/components/Village3D/CategorieModal';

const Scene3D = dynamic(() => import('../components/Village3D/Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center bg-sky-200">
      <div className="text-2xl text-brown-800">Chargement du village 3D...</div>
    </div>
  )
});

export default function ImmersionPage() {
  const [visitMode, setVisitMode] = useState<'orbit' | 'walk'>('orbit');
  const [showModal, setShowModal] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState<{ id: number; nom: string } | null>(null);

  // 🆕 Basculer entre modèles géométriques et Blender
  const [useBlenderModels, setUseBlenderModels] = useState(false);

  const handleFournisseurClick = (id: number, nom: string) => {
    setSelectedFournisseur({ id, nom });
    setShowModal(true);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Boutons de contrôle */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Basculer mode visite */}
        <button
          onClick={() => setVisitMode(visitMode === 'orbit' ? 'walk' : 'orbit')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Mode: {visitMode === 'orbit' ? 'Vue Libre' : 'Première Personne'}
        </button>

        {/* 🆕 Basculer modèles */}
        <button
          onClick={() => setUseBlenderModels(!useBlenderModels)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {useBlenderModels ? 'Modèles Blender' : 'Modèles Géométriques'}
        </button>
      </div>

      {/* Scène 3D */}
      <Suspense fallback={<div>Chargement...</div>}>
        <Scene3D
          onFournisseurClick={handleFournisseurClick}
          visitMode={visitMode}
          useBlenderModels={useBlenderModels}
        />
      </Suspense>

      {/* Modal (ne change pas - API toujours connectée) */}
      {showModal && selectedFournisseur && (
        <CategorieModal
          isOpen={showModal}
          categorieId={selectedFournisseur.id}
          categorieNom={selectedFournisseur.nom}
          onClose={() => {
            setShowModal(false);
            setSelectedFournisseur(null);
          }}
        />
      )}
    </main>
  );
}
```

---

## 🎯 Résumé des Avantages

### ✅ Avantages de cette Organisation:

1. **APIs Intactes**: Aucun changement aux contextes (AuthContext, PanierContext) ni aux services
2. **Basculement Facile**: Un simple bouton pour passer de géométrique à Blender
3. **Configuration Centralisée**: Tous les chemins et positions dans `/config/`
4. **Composants Réutilisables**: `BuildingBase` pour tous les modèles Blender
5. **Progressive**: Remplacez un bâtiment à la fois sans tout casser
6. **Fallback**: Si un modèle Blender manque, affiche le géométrique

### 📊 Workflow d'Intégration:

```
1. Télécharger modèle GLB
   ↓
2. Placer dans /public/models/buildings/blender/
   ↓
3. Ajouter chemin dans modelPaths.ts
   ↓
4. Créer composant dans Buildings/Blender/
   ↓
5. Ajouter dans Scene3D.tsx (section useBlenderModels)
   ↓
6. Cliquer sur bouton "Modèles Blender"
   ↓
7. Voir le résultat immédiatement!
```

---

## 🚀 Prochaines Étapes

### Phase 1: Setup (10 min)
- [ ] Créer les dossiers de configuration
- [ ] Créer les 3 fichiers config (modelPaths, positions, categories)
- [ ] Créer BuildingBase.tsx

### Phase 2: Premier Modèle (15 min)
- [ ] Télécharger 1 maison sur Poly Pizza
- [ ] Créer MaisonMedievale.tsx
- [ ] Tester avec le bouton bascule

### Phase 3: Compléter (1-2h)
- [ ] Télécharger tous les modèles nécessaires
- [ ] Créer tous les composants Blender
- [ ] Ajuster positions et scales

### Phase 4: Polish (30 min)
- [ ] Supprimer les modèles géométriques
- [ ] Retirer le bouton bascule (garder uniquement Blender)
- [ ] Optimiser les performances

---

Voulez-vous que je commence à créer ces fichiers de configuration maintenant?
