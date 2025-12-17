# 🚨 PROBLÈME IDENTIFIÉ : Modèle Trop Lourd

## ⚠️ Le Problème

Votre fichier `maison.glb` fait **98 MB** !

Pour une application web, c'est **beaucoup trop lourd** :
- ✅ Taille recommandée : **< 5 MB** par modèle
- 🟡 Taille acceptable : **5-10 MB**
- ❌ Taille problématique : **> 10 MB**
- 🔴 Votre fichier : **98 MB** (20x trop gros !)

**Résultat** :
- Lag important
- Chargement très lent
- Consommation mémoire élevée
- 5 maisons = 490 MB à charger !

---

## ✅ SOLUTIONS (par ordre de priorité)

### Solution 1 : Réduire la Taille du Modèle (URGENT)

#### Option A : Dans Blender (Recommandé)

**1. Réduire le nombre de polygones**

```
1. Ouvrir maison.glb dans Blender
2. Sélectionner le modèle
3. Ajouter un Modifier "Decimate"
   - Ratio: 0.1 (garder 10% des faces)
   - Ou Ratio: 0.2 (garder 20%)
4. Appliquer le modifier
5. Exporter → glTF Binary (.glb)
6. Nouveau fichier devrait faire ~5-10 MB
```

**Détails** :
```
Panneau de droite → Add Modifier → Generate → Decimate
- Decimate Type: Collapse
- Ratio: 0.1 (commencer bas, augmenter si trop pixelisé)
- Apply
- File → Export → glTF 2.0 (.glb)
```

**2. Réduire la taille des textures**

Si votre modèle a des textures 4K ou 8K :

```
1. Dans Blender, aller dans Shading
2. Sélectionner chaque texture
3. Image → Resize
4. Réduire à 1024x1024 (ou 2048x2048 max)
5. Image → Save
6. Exporter le modèle
```

**3. Utiliser la compression Draco**

```
À l'export Blender :
File → Export → glTF 2.0 (.glb)

Paramètres :
✅ Compression: Draco
✅ Draco mesh compression level: 10 (maximum)

Cela peut réduire de 50-90% la taille !
```

#### Option B : En Ligne (Rapide mais qualité réduite)

**Outil : glTF Transform**

```bash
# Installer l'outil
npm install -g @gltf-transform/cli

# Optimiser le fichier
cd /Users/diego-negrier/SynologyDrive/APPLICATION_PROJET/ProjetLaProvidence/FrontLaProvidence/public/models/buildings/blender/

gltf-transform optimize maison.glb maison_optimized.glb \
  --texture-size 1024 \
  --compress draco
```

**Outil Web : gltf.report**

```
1. Aller sur https://gltf.report/
2. Glisser-déposer maison.glb
3. Voir les statistiques
4. Télécharger la version optimisée
```

---

### Solution 2 : Réduire le Nombre de Maisons

En attendant d'optimiser le modèle, **réduisez à 1-2 maisons** :

**Modifier** : `buildingsLayout.ts`

```typescript
export const VILLAGE_LAYOUT: BuildingConfig[] = [
  // Garder seulement 1 maison pour tester
  {
    name: "Maison Test",
    modelPath: '/models/buildings/blender/maison.glb',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1
  },

  // Commenter les autres
  /*
  {
    name: "Maison Est 1",
    ...
  },
  */
];
```

---

### Solution 3 : Désactiver les Ombres Temporairement

**Modifier** : `Scene3DClean.tsx` ligne 78

```typescript
export default function Scene3DClean({ visitMode = 'orbit' }: Scene3DCleanProps) {
  return (
    <Canvas
      camera={{ position: [10, 5, 10], fov: 60 }}
      // shadows  ← COMMENTER CETTE LIGNE
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance"
      }}
    >
```

Et ligne 88-89 :
```typescript
<directionalLight
  position={[10, 10, 5]}
  intensity={1.5}
  // castShadow  ← COMMENTER
  shadow-mapSize-width={1024}
```

---

### Solution 4 : Lazy Loading (Chargement Progressif)

Charger les maisons une par une au lieu de toutes en même temps :

**Créer** : `Scene3DLazy.tsx`

```typescript
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { VILLAGE_LAYOUT } from './config/buildingsLayout';
import { BuildingBlender } from './Scene3DClean';

function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#4A7C2E" roughness={0.9} />
    </mesh>
  );
}

export default function Scene3DLazy() {
  const [loadedCount, setLoadedCount] = useState(1); // Charger 1 par 1

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadedCount(prev => {
        if (prev >= VILLAGE_LAYOUT.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000); // Charger une maison toutes les 2 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas
      camera={{ position: [10, 5, 10], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />

      <Suspense fallback={null}>
        <Ground />

        {/* Charger progressivement */}
        {VILLAGE_LAYOUT.slice(0, loadedCount).map((building, index) => (
          <BuildingBlender
            key={`${building.name}-${index}`}
            position={building.position}
            rotation={building.rotation}
            scale={building.scale}
            modelPath={building.modelPath}
          />
        ))}
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}
```

---

## 🎯 Plan d'Action Recommandé

### Étape 1 : URGENT - Réduire le fichier (Maintenant)

```bash
# Option rapide : Installer gltf-transform
npm install -g @gltf-transform/cli

# Optimiser
cd /Users/diego-negrier/SynologyDrive/APPLICATION_PROJET/ProjetLaProvidence/FrontLaProvidence/public/models/buildings/blender/

gltf-transform optimize maison.glb maison_light.glb \
  --texture-size 1024 \
  --simplify 0.2 \
  --compress draco

# Vérifier la nouvelle taille
ls -lh maison_light.glb
```

### Étape 2 : Tester avec 1 maison

```typescript
// buildingsLayout.ts - Garder seulement 1 maison
export const VILLAGE_LAYOUT: BuildingConfig[] = [
  {
    name: "Maison Test",
    modelPath: '/models/buildings/blender/maison_light.glb', // ← Nouveau fichier
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1
  }
];
```

### Étape 3 : Si ça marche, augmenter progressivement

Une fois que 1 maison charge rapidement :
- Ajouter 2 maisons
- Tester
- Ajouter 3 maisons
- Tester
- Etc.

---

## 📊 Tailles Recommandées

| Type de Modèle | Taille Idéale | Taille Max |
|----------------|---------------|------------|
| **Petit objet** (pot, chaise) | < 500 KB | 1 MB |
| **Bâtiment simple** (maison) | 1-3 MB | 5 MB |
| **Bâtiment complexe** (église) | 3-5 MB | 10 MB |
| **Scène complète** (village) | 5-10 MB | 20 MB |

**Votre fichier actuel** : 98 MB = **❌ BEAUCOUP TROP**

---

## 🔍 Vérifier la Taille d'un Modèle

### Dans Blender :

```
File → Import → votre_modele.glb
Sélectionner le modèle → N (panneau latéral)
Onglet "Statistics"
- Vertices (Sommets) : < 50,000 recommandé
- Faces (Polygones) : < 20,000 recommandé
```

### En ligne de commande :

```bash
ls -lh maison.glb
# Si > 10 MB → optimiser !
```

---

## 💡 Pourquoi c'est Important

**Calcul pour votre village** :
```
5 maisons × 98 MB = 490 MB à télécharger et charger en mémoire

Avec optimisation :
5 maisons × 3 MB = 15 MB ← Beaucoup mieux !
```

**Impact utilisateur** :
- 98 MB × 5 = 20-30 secondes de chargement sur WiFi
- 3 MB × 5 = 2-3 secondes ← Objectif

---

## 🆘 Si Vous N'Avez Pas Blender

**Option 1 : Trouver un modèle plus léger**

Sites avec filtres de taille :
- Poly Pizza : Modèles low-poly (< 5 MB)
- Sketchfab : Filtre "Downloadable" + "Low-poly"
- Quaternius : Packs optimisés pour le web

**Option 2 : Utiliser l'outil en ligne**

```
1. Aller sur https://products.aspose.app/3d/compress
2. Upload maison.glb
3. Télécharger la version compressée
```

---

## ✅ Checklist

```
□ Vérifier la taille du fichier (ls -lh)
□ Si > 10 MB → optimiser avec gltf-transform OU Blender
□ Réduire à 1 maison dans buildingsLayout.ts
□ Tester le chargement
□ Si fluide → ajouter progressivement plus de maisons
□ Si toujours lent → réduire encore la taille
```

---

**Action immédiate** : Essayez la commande gltf-transform ci-dessus, cela devrait réduire votre fichier à ~5-10 MB et résoudre 90% du problème de lag !
