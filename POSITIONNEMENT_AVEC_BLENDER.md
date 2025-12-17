# 🎨 Positionner vos Bâtiments avec Blender

## 🎯 Deux Méthodes de Positionnement

Vous avez **2 options** pour positionner vos bâtiments :

### Option 1 : Fichier de Configuration (Rapide) ⚡
- Modifier `buildingsLayout.ts`
- Voir le résultat immédiatement dans le navigateur
- **Idéal pour** : Ajustements rapides, tests

### Option 2 : Blender (Visuel) 🎨
- Positionner visuellement dans Blender
- Exporter toute la scène en un seul GLB
- **Idéal pour** : Layout complexe, visualisation 3D complète

---

## 🎨 MÉTHODE BLENDER (Recommandée pour village complet)

### Étape 1 : Créer votre scène dans Blender

#### 1.1 Ouvrir Blender et préparer la scène

```
1. Ouvrir Blender
2. Supprimer le cube par défaut (X → Supprimer)
3. File → Import → glTF 2.0 (.glb)
4. Sélectionner votre premier modèle (maison.glb)
```

#### 1.2 Importer tous vos modèles

```
File → Import → glTF 2.0 (.glb)
↓
Sélectionner : maison.glb
↓
File → Import → glTF 2.0 (.glb)
↓
Sélectionner : eglise.glb
↓
... (répéter pour tous vos modèles)
```

**Résultat** : Tous vos modèles sont dans la scène Blender, empilés au centre.

#### 1.3 Positionner vos bâtiments VISUELLEMENT

**Navigation Blender** :
```
🖱️ Molette : Zoom in/out
🖱️ Clic molette + Glisser : Pivoter la vue
Shift + Clic molette + Glisser : Déplacer la vue
```

**Déplacer un bâtiment** :
```
1. Clic gauche sur le bâtiment pour le sélectionner (surbrillance orange)
2. Appuyer sur G (pour "Grab" = Déplacer)
3. Déplacer la souris
4. Clic gauche pour confirmer

OU avec axes :
- G puis X : Déplacer sur l'axe X uniquement
- G puis Y : Déplacer sur l'axe Y uniquement
- G puis Z : Déplacer sur l'axe Z uniquement
```

**Rotation** :
```
1. Sélectionner le bâtiment
2. Appuyer sur R (pour "Rotate")
3. Appuyer sur Z (pour rotation sur l'axe Z - rotation horizontale)
4. Taper un nombre : 45 (pour 45°) ou 90 (pour 90°)
5. Entrée pour confirmer
```

**Échelle** :
```
1. Sélectionner le bâtiment
2. Appuyer sur S (pour "Scale")
3. Déplacer la souris (ou taper un nombre : 2 pour doubler, 0.5 pour réduire de moitié)
4. Clic gauche pour confirmer
```

#### 1.4 Exemple de disposition dans Blender

```
Vue de dessus (Numpad 7) :

           Maison 3
               |
               |
Maison 2 --- Église --- Maison 1
               |
               |
           Maison 4
```

**Comment créer ça** :
```
1. Église au centre [0, 0, 0]
   - Ne pas la bouger

2. Maison 1 à droite
   - Sélectionner Maison 1
   - G puis X
   - Déplacer à droite
   - Clic gauche

3. Maison 2 à gauche
   - Sélectionner Maison 2
   - G puis X
   - Déplacer à gauche
   - Clic gauche

4. Maison 3 en haut
   - Sélectionner Maison 3
   - G puis Y
   - Déplacer en haut
   - Clic gauche

5. Maison 4 en bas
   - Sélectionner Maison 4
   - G puis Y
   - Déplacer en bas
   - Clic gauche
```

### Étape 2 : Organiser la scène

#### 2.1 Créer une hiérarchie propre (IMPORTANT)

Dans le **Outliner** (panneau en haut à droite) :

```
1. Clic droit dans l'espace vide → New Collection
2. Nommer : "Village"
3. Glisser-déposer tous vos bâtiments dans "Village"
```

**Résultat** :
```
Scene Collection
└── Village
    ├── Eglise
    ├── Maison_1
    ├── Maison_2
    ├── Maison_3
    └── Maison_4
```

#### 2.2 Vérifier l'échelle

**Important** : Dans Blender, 1 unité = 1 mètre

```
- Petite maison : ~3-5 unités de large
- Grande église : ~10-15 unités de large
- Distance entre bâtiments : 5-10 unités minimum
```

### Étape 3 : Exporter toute la scène

#### 3.1 Sélectionner tout

```
1. Dans le Outliner, clic sur "Village"
2. OU : A (pour tout sélectionner)
```

#### 3.2 Exporter en GLB

```
File → Export → glTF 2.0 (.glb)

Paramètres IMPORTANTS :
✅ Format: glTF Binary (.glb)
✅ Include: Selected Objects (OU Visible Objects)
✅ Transform: +Y Up
✅ Geometry:
   - Apply Modifiers ✅
   - UVs ✅
   - Normals ✅
✅ Compression: Draco (optionnel)

Nom du fichier : village_complet.glb
```

#### 3.3 Copier dans votre projet

```bash
cp ~/Downloads/village_complet.glb /Users/diego-negrier/SynologyDrive/APPLICATION_PROJET/ProjetLaProvidence/FrontLaProvidence/public/models/buildings/blender/
```

### Étape 4 : Utiliser dans votre projet

#### Option A : Scène complète (1 seul fichier GLB)

**Créer** : `app/components/Village3D/VillageComplet.tsx`

```typescript
import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';

function VillageModel() {
  const { scene } = useGLTF('/models/buildings/blender/village_complet.glb');

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={clonedScene} />;
}

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#4A7C2E" />
    </mesh>
  );
}

export default function VillageComplet() {
  return (
    <Canvas camera={{ position: [20, 15, 20], fov: 60 }} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={1024}
      />

      <Suspense fallback={null}>
        <Ground />
        <VillageModel />
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}

// Précharger
useGLTF.preload('/models/buildings/blender/village_complet.glb');
```

**Utiliser dans** `app/immersion/page.tsx` :

```typescript
const Scene3D = dynamic(() => import('@/app/components/Village3D/VillageComplet'), {
  ssr: false
});
```

#### Option B : Garder les fichiers séparés

Si vous préférez garder les modèles séparés, utilisez le système `buildingsLayout.ts` existant.

---

## 📐 Astuces Blender pour Positionnement

### 1. Utiliser la grille comme référence

```
View → Toggle Overlays (icône grille en haut à droite)
```

Chaque carré de la grille = 1 unité

### 2. Positionnement précis avec coordonnées

```
1. Sélectionner un bâtiment
2. Appuyer sur N (ouvre le panneau latéral)
3. Onglet "Item"
4. Modifier Location X, Y, Z manuellement
```

**Exemple** :
```
Location:
  X: 5.0   (5 mètres à droite)
  Y: 0.0   (au centre)
  Z: 0.0   (au niveau du sol)

Rotation:
  X: 0°
  Y: 0°
  Z: 45°   (rotation de 45° sur place)

Scale:
  X: 1.5
  Y: 1.5
  Z: 1.5   (150% de la taille)
```

### 3. Dupliquer un bâtiment

```
1. Sélectionner le bâtiment
2. Shift + D (Duplicate)
3. Déplacer
4. Clic gauche pour confirmer
```

### 4. Alignement automatique

**Aligner sur la grille** :
```
1. Sélectionner le bâtiment
2. Mesh → Snap → Selection to Grid
```

**Aligner plusieurs bâtiments** :
```
1. Sélectionner tous les bâtiments (Shift + Clic gauche sur chacun)
2. Object → Align Objects → Align Location → X Axis
```

### 5. Vue de dessus pour placement

```
Numpad 7 : Vue de dessus (Top)
Numpad 1 : Vue de face (Front)
Numpad 3 : Vue de côté (Right)
Numpad 0 : Vue caméra
```

---

## 🎯 Workflow Recommandé

### Pour un village simple (5-10 bâtiments)

**Utiliser** : `buildingsLayout.ts`
- Plus rapide
- Plus flexible
- Chargement plus rapide

### Pour un village complexe (20+ bâtiments)

**Utiliser** : Blender + 1 fichier GLB
- Layout visuel complet
- Optimisation automatique
- Meilleure performance (1 seul fichier)

---

## 🔄 Comparaison des Méthodes

| Critère | buildingsLayout.ts | Blender (1 GLB) |
|---------|-------------------|-----------------|
| **Vitesse** | ⚡⚡⚡ Très rapide | 🐌 Plus lent |
| **Visuel** | ❌ Code seulement | ✅ Vue 3D complète |
| **Flexibilité** | ✅ Changements faciles | ❌ Réexport nécessaire |
| **Performance** | 🟡 Moyenne (plusieurs fichiers) | ✅ Meilleure (1 fichier) |
| **Complexité** | 🟢 Simple | 🟡 Moyen (apprendre Blender) |
| **Idéal pour** | Tests, ajustements | Village final, production |

---

## 💡 Workflow Hybride (Recommandé)

Combinez les deux méthodes :

### Phase 1 : Prototypage rapide
```
1. Utiliser buildingsLayout.ts
2. Tester différentes positions rapidement
3. Valider le layout général
```

### Phase 2 : Finalisation dans Blender
```
1. Importer tous les modèles dans Blender
2. Copier les positions depuis buildingsLayout.ts
3. Affiner visuellement
4. Ajouter des détails (arbres, rochers, chemins)
5. Exporter en village_complet.glb
```

### Phase 3 : Optimisation finale
```
1. Tester les performances
2. Si lag : réduire le nombre de polygones dans Blender
3. Appliquer compression Draco à l'export
```

---

## 🎓 Mini-Tutorial Blender (5 minutes)

### Layout d'un village simple

```
1. Ouvrir Blender
2. Supprimer le cube (X → Delete)
3. File → Import → maison.glb (x5)
4. Sélectionner Maison 1 → G → X → 5 → Entrée
5. Sélectionner Maison 2 → G → X → -5 → Entrée
6. Sélectionner Maison 3 → G → Y → 5 → Entrée
7. Sélectionner Maison 4 → G → Y → -5 → Entrée
8. File → Export → glTF 2.0 → village.glb
9. Copier dans /public/models/
10. Utiliser dans votre projet ✅
```

**Temps total** : 5 minutes
**Résultat** : Village avec 5 maisons parfaitement positionnées

---

## 🆘 Problèmes Courants

### Le village est à l'envers après export
```
Solution : À l'export Blender
Transform → +Y Up ✅
```

### Les bâtiments sont trop petits/grands
```
Solution 1 : Dans Blender, tout sélectionner → S → 2 (doubler)
Solution 2 : Dans le code, ajouter scale={2} au composant
```

### Les bâtiments sont sous le sol
```
Solution 1 : Dans Blender, sélectionner tout → G → Z → 1
Solution 2 : Dans le code, position={[0, 1, 0]}
```

### Le fichier GLB est trop gros (> 10 MB)
```
Solution : À l'export Blender
Compression → Draco ✅
Draco compression level : 10
```

---

## 📹 Tutoriels Vidéo Recommandés

**Bases Blender (Français)** :
- "Blender pour débutants" sur YouTube
- "Navigation dans Blender 3D"

**Positionnement 3D** :
- "How to arrange 3D models in Blender"
- "Blender modeling for games"

**Export pour Web** :
- "Export glTF from Blender for Three.js"

---

## 🎯 Raccourcis Clavier Blender (Essentiels)

```
G : Déplacer (Grab)
R : Rotation (Rotate)
S : Échelle (Scale)
X : Supprimer
A : Tout sélectionner
Shift + D : Dupliquer

G + X : Déplacer sur axe X
G + Y : Déplacer sur axe Y
G + Z : Déplacer sur axe Z

Numpad 7 : Vue de dessus
Numpad 1 : Vue de face
Numpad 3 : Vue de côté

N : Panneau propriétés
Tab : Mode édition
```

---

**Maintenant vous pouvez positionner vos bâtiments visuellement avec Blender ! 🎨**

Pour démarrer rapidement, suivez le "Mini-Tutorial Blender (5 minutes)" ci-dessus.
