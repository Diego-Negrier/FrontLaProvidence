# 🏰 Village avec Église - Configuration Actuelle

## ✅ Église Ajoutée avec Succès !

Votre village comprend maintenant :
- **1 Église centrale** (au centre, 2x plus grande)
- **6 Maisons** disposées autour de l'église

## 🗺️ Plan du Village

```
Vue de dessus :

           Nord ↑
                |

    Maison N1       Maison N2
        🏠              🏠
          \            /
           \          /
            \        /
             \      /

Maison O1 🏠 --- ⛪ ÉGLISE --- 🏠 Maison E1
                 (Centre)

             /      \
            /        \
           /          \
          /            \
        🏠              🏠
    Maison S1       Maison S2

                |
                ↓
             Sud
```

## 📍 Positions Exactes

| Bâtiment | Position [X, Y, Z] | Rotation | Description |
|----------|-------------------|----------|-------------|
| **Église** | `[0, 0, 0]` | 0° | Centre du village, 2x plus grande |
| Maison Est | `[8, 0, 0]` | -90° | À droite, face à l'église |
| Maison Ouest | `[-8, 0, 0]` | 90° | À gauche, face à l'église |
| Maison Nord 1 | `[-6, 0, -8]` | 45° | Derrière à gauche |
| Maison Nord 2 | `[6, 0, -8]` | -45° | Derrière à droite |
| Maison Sud 1 | `[-6, 0, 10]` | -30° | Devant à gauche |
| Maison Sud 2 | `[6, 0, 10]` | 30° | Devant à droite |

## 🎮 Navigation

**Contrôles de la caméra** :
- 🖱️ **Clic + Glisser** : Pivoter autour du village
- 🔍 **Molette** : Zoomer / Dézoomer
- **Clic droit + Glisser** : Déplacer la vue

**Vue recommandée** :
```
Position caméra : [10, 5, 10]
Distance : 15-20 unités
Angle : 45° pour voir l'ensemble
```

## 📊 Performance

**Fichiers chargés** :
- `eglise.glb` : **1.3 MB** ✅
- `maison.glb` : **9.3 MB** ✅
- **Total** : ~58 MB (1 église + 6 maisons)

**Attendu** :
- Chargement : 4-6 secondes
- FPS : 60 (fluide)
- Pas de lag ✅

## 🎨 Modifier le Layout

### Déplacer l'Église

**Dans** : `buildingsLayout.ts` ligne 38-44

```typescript
{
  name: "Église Centrale",
  modelPath: '/models/buildings/blender/eglise.glb',
  position: [0, 0, 0],     // ← Modifier X, Y, Z
  rotation: [0, 0, 0],      // ← Modifier rotation
  scale: 2                  // ← Modifier taille (1-3)
},
```

**Exemples** :
```typescript
// Plus grande
scale: 3

// Vers le nord
position: [0, 0, -10]

// Rotation 90°
rotation: [0, Math.PI / 2, 0]
```

### Ajouter Plus de Maisons

**Copier-coller ce bloc** à la ligne 95 :

```typescript
{
  name: "Maison Supplémentaire 1",
  modelPath: '/models/buildings/blender/maison.glb',
  position: [12, 0, 5],
  rotation: [0, -Math.PI / 3, 0],
  scale: 1
},
```

### Créer un Cercle de Maisons

**Utiliser le pattern** :

```typescript
import { PLACEMENT_PATTERNS } from './config/buildingsLayout';

// Dans VILLAGE_LAYOUT, ajouter :
...PLACEMENT_PATTERNS.circle(12, 8).map((pos, i) => ({
  name: `Maison Cercle ${i + 1}`,
  modelPath: '/models/buildings/blender/maison.glb',
  ...pos
}))
```

## 🔧 Ajustements Rapides

### Si l'Église est Trop Grande

```typescript
scale: 1.5  // Au lieu de 2
```

### Si les Maisons Sont Trop Proches

```typescript
// Augmenter les distances
position: [10, 0, 0]   // Au lieu de [8, 0, 0]
position: [-10, 0, 0]  // Au lieu de [-8, 0, 0]
```

### Ajouter une Place/Fontaine au Centre

```typescript
{
  name: "Place Centrale",
  modelPath: '/models/buildings/blender/fontaine.glb', // Si vous avez une fontaine
  position: [0, 0, 5],  // Devant l'église
  rotation: [0, 0, 0],
  scale: 1
},
```

## 📁 Fichiers Modifiés

✅ `buildingsLayout.ts` :
- Église au centre
- 6 maisons repositionnées autour

✅ `Scene3DClean.tsx` :
- Préchargement de `eglise.glb`

## 🎯 Prochaines Étapes

### 1. Tester le Village

```
Rechargez : http://localhost:3000/immersion

Vous devriez voir :
✅ Église au centre (grande)
✅ 6 maisons autour
✅ Chargement fluide
✅ Pas de lag
```

### 2. Ajouter Plus de Détails

**Télécharger des modèles** :
- Fontaine pour la place
- Arbres pour décorer
- Chemins/routes
- Marché/stands

**Sites recommandés** :
- Poly Pizza : `https://poly.pizza/` (low-poly)
- Sketchfab : Medieval village assets

### 3. Optimiser Nouveaux Modèles

**Commande** :
```bash
cd public/models/buildings/blender/
gltf-transform optimize nouveau_modele.glb nouveau_modele_optimized.glb \
  --texture-size 512 \
  --simplify 0.3 \
  --compress draco
```

## 💡 Astuces

### Rotation Rapide

```typescript
// Toutes les maisons face à l'église
rotation: [0, angleVersEglise, 0]

// Exemple pour maison à droite [8, 0, 0]
rotation: [0, -Math.PI / 2, 0]  // Face vers la gauche (église)
```

### Variété dans les Tailles

```typescript
scale: 0.8 + Math.random() * 0.4  // Entre 0.8 et 1.2
```

### Alignement sur Grille

```typescript
// Pour placer facilement
// Grille de 2 unités :
position: [0, 0, 0]    // Centre
position: [2, 0, 0]    // 1 case à droite
position: [4, 0, 0]    // 2 cases à droite
position: [0, 0, 2]    // 1 case devant
```

## 🎨 Disposition Alternative : Village Linéaire

Si vous préférez un village en ligne (rue principale) :

```typescript
export const VILLAGE_LAYOUT: BuildingConfig[] = [
  // Église au bout de la rue
  {
    name: "Église",
    modelPath: '/models/buildings/blender/eglise.glb',
    position: [0, 0, -15],
    rotation: [0, 0, 0],
    scale: 2
  },

  // Rue avec maisons de chaque côté
  // Côté gauche
  { name: "Maison 1G", modelPath: '/models/buildings/blender/maison.glb',
    position: [-5, 0, -10], rotation: [0, Math.PI / 2, 0], scale: 1 },
  { name: "Maison 2G", modelPath: '/models/buildings/blender/maison.glb',
    position: [-5, 0, -5], rotation: [0, Math.PI / 2, 0], scale: 1 },
  { name: "Maison 3G", modelPath: '/models/buildings/blender/maison.glb',
    position: [-5, 0, 0], rotation: [0, Math.PI / 2, 0], scale: 1 },

  // Côté droit
  { name: "Maison 1D", modelPath: '/models/buildings/blender/maison.glb',
    position: [5, 0, -10], rotation: [0, -Math.PI / 2, 0], scale: 1 },
  { name: "Maison 2D", modelPath: '/models/buildings/blender/maison.glb',
    position: [5, 0, -5], rotation: [0, -Math.PI / 2, 0], scale: 1 },
  { name: "Maison 3D", modelPath: '/models/buildings/blender/maison.glb',
    position: [5, 0, 0], rotation: [0, -Math.PI / 2, 0], scale: 1 },
];
```

---

**Votre village avec église est prêt ! 🎉**

Rechargez la page `/immersion` pour voir le résultat.
