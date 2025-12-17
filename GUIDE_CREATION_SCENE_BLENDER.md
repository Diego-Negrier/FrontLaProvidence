# 🏰 Guide Complet : Créer une Scène 3D Immersive avec Blender

## 📋 Table des Matières
1. [Vue d'ensemble](#vue-densemble)
2. [Étape 1 : Préparer vos modèles Blender](#étape-1--préparer-vos-modèles-blender)
3. [Étape 2 : Exporter correctement](#étape-2--exporter-correctement)
4. [Étape 3 : Organiser vos fichiers](#étape-3--organiser-vos-fichiers)
5. [Étape 4 : Configurer les chemins](#étape-4--configurer-les-chemins)
6. [Étape 5 : Créer les composants](#étape-5--créer-les-composants)
7. [Étape 6 : Composer la scène](#étape-6--composer-la-scène)
8. [Étape 7 : Tester et affiner](#étape-7--tester-et-affiner)
9. [Exemples de scènes complètes](#exemples-de-scènes-complètes)

---

## Vue d'ensemble

Votre projet est maintenant **prêt pour recevoir des modèles Blender**. Voici le workflow complet :

```
Blender → Export GLB → Copier dans /public/models/ → Configurer → Utiliser dans Scene3D
```

**Ce que vous avez déjà** :
- ✅ `Scene3DClean.tsx` - Scène propre qui affiche votre maison
- ✅ `BuildingBase.tsx` - Composant réutilisable pour tous les modèles
- ✅ `config/modelPaths.ts` - Gestion centralisée des chemins
- ✅ `config/positions.ts` - Gestion des positions et échelles

---

## Étape 1 : Préparer vos modèles Blender

### 1.1 Télécharger des modèles existants

**Sites recommandés** (voir `OU_TROUVER_MODELES_3D.md`) :

```
🏆 Sketchfab
   https://sketchfab.com/search?q=medieval+house&type=models&features=downloadable

🎯 Poly Pizza (rapide)
   https://poly.pizza/

📦 Quaternius (packs complets)
   https://quaternius.com/packs.html
```

**Critères de sélection** :
- ✅ Format GLB ou GLTF
- ✅ Licence gratuite (CC0 ou Personal Use)
- ✅ Taille raisonnable (< 5 MB par modèle)
- ✅ Style cohérent (medieval fantasy)

### 1.2 Créer vos propres modèles (optionnel)

Si vous voulez créer dans Blender :

```bash
# 1. Télécharger Blender
https://www.blender.org/download/

# 2. Tutoriels rapides
- "Blender Medieval House Tutorial" sur YouTube
- "Low Poly Modeling for Games" (plus rapide à charger)
```

**Conseils de modélisation** :
- Gardez le nombre de polygones bas (< 10,000 faces)
- Utilisez des textures simples
- Échelle réaliste : 1 unité Blender = 1 mètre
- Origine au centre de la base du modèle

---

## Étape 2 : Exporter correctement

### 2.1 Dans Blender

```
1. Sélectionner votre modèle
2. File → Export → glTF 2.0 (.glb)
3. Paramètres importants :
   ✅ Format: glTF Binary (.glb)
   ✅ Include: Selected Objects
   ✅ Transform: +Y Up
   ✅ Geometry: Apply Modifiers
   ✅ Compression: Draco (optionnel, réduit la taille)
```

### 2.2 Nommage des fichiers

**Convention** :
```
maison_medievale_1.glb
maison_medievale_2.glb
eglise_village.glb
stand_marche_fruits.glb
fontaine_centrale.glb
```

**Règles** :
- Minuscules
- Underscore au lieu d'espaces
- Descriptif et clair
- Numéros pour variantes

---

## Étape 3 : Organiser vos fichiers

### 3.1 Structure des dossiers

```
public/
└── models/
    └── buildings/
        └── blender/
            ├── maison.glb              ← Votre modèle actuel
            ├── maison_medievale_1.glb  ← Nouveaux modèles
            ├── maison_medievale_2.glb
            ├── maison_medievale_3.glb
            ├── eglise.glb
            ├── forge.glb
            ├── moulin.glb
            └── fontaine.glb
    └── vendors/
        └── blender/
            ├── stand_marche_1.glb
            ├── stand_marche_2.glb
            └── chariot_marchand.glb
    └── environment/
        └── blender/
            ├── arbre_1.glb
            ├── arbre_2.glb
            ├── rocher_1.glb
            └── pont.glb
```

### 3.2 Copier vos fichiers

```bash
# Depuis votre dossier de téléchargements
cp ~/Downloads/maison_medievale_1.glb public/models/buildings/blender/
cp ~/Downloads/eglise.glb public/models/buildings/blender/
cp ~/Downloads/stand_marche.glb public/models/vendors/blender/
```

---

## Étape 4 : Configurer les chemins

### 4.1 Ajouter dans `config/modelPaths.ts`

```typescript
export const MODEL_PATHS = {
  buildings: {
    // Maisons
    maison1: '/models/buildings/blender/maison_medievale_1.glb',
    maison2: '/models/buildings/blender/maison_medievale_2.glb',
    maison3: '/models/buildings/blender/maison_medievale_3.glb',

    // Bâtiments publics
    eglise: '/models/buildings/blender/eglise.glb',
    forge: '/models/buildings/blender/forge.glb',
    moulin: '/models/buildings/blender/moulin.glb',
    fontaine: '/models/buildings/blender/fontaine.glb',
  },

  vendors: {
    standMarche1: '/models/vendors/blender/stand_marche_1.glb',
    standMarche2: '/models/vendors/blender/stand_marche_2.glb',
    chariot: '/models/vendors/blender/chariot_marchand.glb',
  },

  environment: {
    arbre1: '/models/environment/blender/arbre_1.glb',
    arbre2: '/models/environment/blender/arbre_2.glb',
    rocher1: '/models/environment/blender/rocher_1.glb',
    pont: '/models/environment/blender/pont.glb',
  }
} as const;
```

---

## Étape 5 : Créer les composants

### 5.1 Composant simple (sans variantes)

**Fichier** : `app/components/Village3D/Buildings/Blender/Eglise.tsx`

```typescript
import { BuildingBase, preloadModel } from '../BuildingBase';
import { MODEL_PATHS } from '../../config/modelPaths';

interface EgliseProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
}

export function Eglise({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick
}: EgliseProps) {
  return (
    <BuildingBase
      modelPath={MODEL_PATHS.buildings.eglise}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    />
  );
}

// Précharger le modèle
preloadModel(MODEL_PATHS.buildings.eglise);
```

### 5.2 Composant avec variantes

**Fichier** : `app/components/Village3D/Buildings/Blender/MaisonMedievale.tsx`

```typescript
import { BuildingBase, preloadModel } from '../BuildingBase';
import { MODEL_PATHS } from '../../config/modelPaths';

interface MaisonMedievaleProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  variant?: 1 | 2 | 3;
  onClick?: () => void;
}

export function MaisonMedievale({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  variant = 1,
  onClick
}: MaisonMedievaleProps) {
  // Sélectionner le modèle selon la variante
  let modelPath: string;
  switch (variant) {
    case 1:
      modelPath = MODEL_PATHS.buildings.maison1;
      break;
    case 2:
      modelPath = MODEL_PATHS.buildings.maison2;
      break;
    case 3:
      modelPath = MODEL_PATHS.buildings.maison3;
      break;
    default:
      modelPath = MODEL_PATHS.buildings.maison1;
  }

  return (
    <BuildingBase
      modelPath={modelPath}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    />
  );
}

// Précharger tous les modèles
preloadModel(MODEL_PATHS.buildings.maison1);
preloadModel(MODEL_PATHS.buildings.maison2);
preloadModel(MODEL_PATHS.buildings.maison3);
```

### 5.3 Composant cliquable (pour ouvrir modal produits)

**Fichier** : `app/components/Village3D/Vendors/Blender/StandMarche.tsx`

```typescript
import { BuildingBase, preloadModel } from '../../Buildings/BuildingBase';
import { MODEL_PATHS } from '../../config/modelPaths';

interface StandMarcheProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  categorieId: number;
  categorieNom: string;
  onFournisseurClick: (id: number, nom: string) => void;
}

export function StandMarche({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  categorieId,
  categorieNom,
  onFournisseurClick
}: StandMarcheProps) {
  return (
    <BuildingBase
      modelPath={MODEL_PATHS.vendors.standMarche1}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={() => onFournisseurClick(categorieId, categorieNom)}
    />
  );
}

preloadModel(MODEL_PATHS.vendors.standMarche1);
```

---

## Étape 6 : Composer la scène

### 6.1 Scène simple (ce que vous avez actuellement)

**Fichier** : `Scene3DClean.tsx`

```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MaisonMedievale } from './Buildings/Blender/MaisonMedievale';
import { Eglise } from './Buildings/Blender/Eglise';

export default function Scene3DClean({ onFournisseurClick }: Props) {
  return (
    <Canvas camera={{ position: [20, 15, 20], fov: 60 }} shadows>
      {/* Lumières */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4a7c34" />
      </mesh>

      {/* Village */}
      <group position={[0, 0, 0]}>
        {/* Église au centre */}
        <Eglise position={[0, 0, 0]} scale={2} />

        {/* Maisons autour */}
        <MaisonMedievale position={[8, 0, 0]} variant={1} scale={1.5} />
        <MaisonMedievale position={[-8, 0, 0]} variant={2} scale={1.5} rotation={[0, Math.PI, 0]} />
        <MaisonMedievale position={[0, 0, 8]} variant={3} scale={1.5} rotation={[0, -Math.PI/2, 0]} />
        <MaisonMedievale position={[0, 0, -8]} variant={1} scale={1.5} rotation={[0, Math.PI/2, 0]} />
      </group>

      <OrbitControls />
    </Canvas>
  );
}
```

### 6.2 Scène avec stands de marché (avec API)

```typescript
import { StandMarche } from './Vendors/Blender/StandMarche';
import { API_CATEGORIES } from './config/categories';

export default function Scene3DMarche({ onFournisseurClick }: Props) {
  return (
    <Canvas camera={{ position: [20, 15, 20], fov: 60 }} shadows>
      {/* Lumières et sol... */}

      {/* Place du marché */}
      <group position={[15, 0, 0]}>
        <StandMarche
          position={[0, 0, 0]}
          categorieId={API_CATEGORIES.fruitsLegumes}
          categorieNom="Fruits & Légumes"
          onFournisseurClick={onFournisseurClick}
          scale={1.2}
        />

        <StandMarche
          position={[5, 0, 0]}
          categorieId={API_CATEGORIES.fromages}
          categorieNom="Fromages"
          onFournisseurClick={onFournisseurClick}
          scale={1.2}
        />

        <StandMarche
          position={[10, 0, 0]}
          categorieId={API_CATEGORIES.boulangerie}
          categorieNom="Boulangerie"
          onFournisseurClick={onFournisseurClick}
          scale={1.2}
        />
      </group>

      <OrbitControls />
    </Canvas>
  );
}
```

### 6.3 Scène immersive complète

```typescript
import { MaisonMedievale } from './Buildings/Blender/MaisonMedievale';
import { Eglise } from './Buildings/Blender/Eglise';
import { Forge } from './Buildings/Blender/Forge';
import { StandMarche } from './Vendors/Blender/StandMarche';
import { Arbre } from './Environment/Blender/Arbre';
import { Pont } from './Environment/Blender/Pont';
import { API_CATEGORIES } from './config/categories';

export default function Scene3DImmersive({ onFournisseurClick }: Props) {
  return (
    <Canvas camera={{ position: [30, 20, 30], fov: 60 }} shadows>
      {/* Lumières */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 20, 10]} intensity={1.8} castShadow />
      <hemisphereLight args={['#87CEEB', '#4a7c34', 0.3]} />

      {/* Sol avec texture herbe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#4a7c34" roughness={0.9} />
      </mesh>

      {/* CENTRE VILLAGE - Place de l'église */}
      <group position={[0, 0, 0]}>
        <Eglise position={[0, 0, 0]} scale={3} />

        {/* Fontaine devant l'église */}
        <Fontaine position={[0, 0, 6]} scale={1.5} />
      </group>

      {/* QUARTIER RÉSIDENTIEL - Nord */}
      <group position={[0, 0, -15]}>
        <MaisonMedievale position={[0, 0, 0]} variant={1} scale={2} />
        <MaisonMedievale position={[8, 0, 0]} variant={2} scale={1.8} rotation={[0, Math.PI/4, 0]} />
        <MaisonMedievale position={[-8, 0, 0]} variant={3} scale={1.8} rotation={[0, -Math.PI/4, 0]} />
        <MaisonMedievale position={[0, 0, -8]} variant={1} scale={2} rotation={[0, Math.PI, 0]} />
      </group>

      {/* QUARTIER ARTISANS - Sud */}
      <group position={[0, 0, 15]}>
        <Forge
          position={[0, 0, 0]}
          scale={2.5}
          categorieId={API_CATEGORIES.forge}
          onFournisseurClick={onFournisseurClick}
        />
        <Charpentier
          position={[10, 0, 0]}
          scale={2.5}
          categorieId={API_CATEGORIES.charpentier}
          onFournisseurClick={onFournisseurClick}
        />
      </group>

      {/* PLACE DU MARCHÉ - Est */}
      <group position={[20, 0, 0]}>
        {/* Rangée de stands */}
        <StandMarche
          position={[0, 0, 0]}
          categorieId={API_CATEGORIES.fruitsLegumes}
          categorieNom="Fruits & Légumes"
          onFournisseurClick={onFournisseurClick}
          scale={1.5}
        />
        <StandMarche
          position={[0, 0, 5]}
          categorieId={API_CATEGORIES.fromages}
          categorieNom="Fromages"
          onFournisseurClick={onFournisseurClick}
          scale={1.5}
        />
        <StandMarche
          position={[0, 0, 10]}
          categorieId={API_CATEGORIES.boulangerie}
          categorieNom="Boulangerie"
          onFournisseurClick={onFournisseurClick}
          scale={1.5}
        />
      </group>

      {/* ENVIRONNEMENT - Arbres */}
      <group>
        <Arbre position={[-15, 0, -10]} variant={1} scale={2} />
        <Arbre position={[-12, 0, -15]} variant={2} scale={2.2} />
        <Arbre position={[-18, 0, -12]} variant={1} scale={1.8} />
        <Arbre position={[15, 0, 12]} variant={2} scale={2} />
        <Arbre position={[18, 0, 15]} variant={1} scale={2.3} />
      </group>

      {/* PONT sur rivière */}
      <Pont position={[-10, 0, 0]} rotation={[0, Math.PI/2, 0]} scale={2} />

      <OrbitControls />
    </Canvas>
  );
}
```

---

## Étape 7 : Tester et affiner

### 7.1 Checklist de test

```
✅ Les modèles se chargent-ils ?
✅ Les ombres s'affichent-elles correctement ?
✅ La performance est-elle fluide (60 FPS) ?
✅ Les clics sur les stands fonctionnent-ils ?
✅ Les échelles sont-elles cohérentes ?
✅ Les rotations sont-elles correctes ?
```

### 7.2 Outils de débogage

**Dans le navigateur** :
```javascript
// Console du navigateur (F12)
// Voir les erreurs de chargement de modèles
```

**Performance** :
```typescript
// Ajouter Stats pour voir les FPS
import { Stats } from '@react-three/drei';

<Canvas>
  <Stats />
  {/* Votre scène */}
</Canvas>
```

### 7.3 Ajustements courants

**Le modèle est trop grand/petit** :
```typescript
// Ajuster le scale
<Eglise scale={5} />  // Plus grand
<Eglise scale={0.5} /> // Plus petit
```

**Le modèle est à l'envers** :
```typescript
// Rotation sur l'axe X
<Eglise rotation={[Math.PI, 0, 0]} />
```

**Le modèle ne s'affiche pas** :
```typescript
// Vérifier le chemin dans modelPaths.ts
// Vérifier que le fichier GLB existe dans /public/models/
// Regarder la console (F12) pour les erreurs
```

**Performance lente** :
```typescript
// Réduire le nombre de modèles
// Utiliser des modèles low-poly
// Activer Draco compression à l'export Blender
```

---

## Exemples de scènes complètes

### Exemple 1 : Village compact (débutant)

```typescript
export default function VillageCompact({ onFournisseurClick }: Props) {
  return (
    <Canvas camera={{ position: [15, 10, 15], fov: 60 }} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4a7c34" />
      </mesh>

      {/* Église centrale */}
      <Eglise position={[0, 0, 0]} scale={2} />

      {/* 4 maisons en cercle */}
      <MaisonMedievale position={[6, 0, 0]} variant={1} scale={1.5} />
      <MaisonMedievale position={[-6, 0, 0]} variant={2} scale={1.5} />
      <MaisonMedievale position={[0, 0, 6]} variant={3} scale={1.5} />
      <MaisonMedievale position={[0, 0, -6]} variant={1} scale={1.5} />

      <OrbitControls />
    </Canvas>
  );
}
```

### Exemple 2 : Village avec marché (intermédiaire)

```typescript
export default function VillageMarche({ onFournisseurClick }: Props) {
  return (
    <Canvas camera={{ position: [25, 15, 25], fov: 60 }} shadows>
      {/* Lumières */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[15, 15, 10]} intensity={1.6} castShadow />

      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#4a7c34" />
      </mesh>

      {/* Zone résidentielle */}
      <group position={[-10, 0, 0]}>
        <MaisonMedievale position={[0, 0, 0]} variant={1} scale={2} />
        <MaisonMedievale position={[0, 0, 8]} variant={2} scale={2} />
        <MaisonMedievale position={[0, 0, -8]} variant={3} scale={2} />
      </group>

      {/* Église */}
      <Eglise position={[0, 0, 0]} scale={2.5} />

      {/* Place du marché */}
      <group position={[10, 0, 0]}>
        <StandMarche
          position={[0, 0, 0]}
          categorieId={145}
          categorieNom="Fruits & Légumes"
          onFournisseurClick={onFournisseurClick}
        />
        <StandMarche
          position={[5, 0, 0]}
          categorieId={146}
          categorieNom="Fromages"
          onFournisseurClick={onFournisseurClick}
        />
        <StandMarche
          position={[10, 0, 0]}
          categorieId={147}
          categorieNom="Boulangerie"
          onFournisseurClick={onFournisseurClick}
        />
      </group>

      <OrbitControls />
    </Canvas>
  );
}
```

### Exemple 3 : Village immersif complet (avancé)

Voir section 6.3 ci-dessus.

---

## 🎯 Résumé des étapes

```
1. Télécharger/créer modèles → Sketchfab, Poly Pizza, Blender
2. Exporter en GLB → File → Export → glTF 2.0
3. Copier dans /public/models/ → Organisation par type
4. Configurer modelPaths.ts → Ajouter les chemins
5. Créer composants → BuildingBase + préchargement
6. Composer la scène → Positionner les éléments
7. Tester → Vérifier chargement, performance, clics
```

---

## 📚 Ressources

- **Blender** : https://www.blender.org/download/
- **Sketchfab** : https://sketchfab.com/search?q=medieval+village
- **Poly Pizza** : https://poly.pizza/
- **Three.js docs** : https://threejs.org/docs/
- **React Three Fiber** : https://docs.pmnd.rs/react-three-fiber/

---

## ❓ FAQ

**Q : Combien de modèles puis-je ajouter ?**
R : Dépend de la complexité. Commencez avec 10-15 modèles, testez la performance.

**Q : Mes modèles ne s'affichent pas ?**
R : Vérifiez 1) Le chemin dans modelPaths.ts, 2) Le fichier existe dans /public/, 3) La console (F12) pour erreurs.

**Q : Comment ajuster l'échelle ?**
R : Testez avec différentes valeurs de `scale` (0.5, 1, 2, 3...). Chaque modèle peut avoir une échelle différente.

**Q : Les APIs marchent toujours ?**
R : Oui ! Tant que vous utilisez les IDs de `config/categories.ts` et `onFournisseurClick`, tout fonctionne.

**Q : Comment ajouter de la végétation ?**
R : Créez un composant `Arbre.tsx` similaire à `MaisonMedievale.tsx`, puis positionnez plusieurs instances.

---

**Votre projet est maintenant prêt pour créer une expérience 3D immersive avec Blender ! 🏰**
