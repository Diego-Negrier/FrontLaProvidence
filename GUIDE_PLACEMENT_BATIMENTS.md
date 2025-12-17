# 🏠 Guide de Placement des Bâtiments

## ✅ Améliorations apportées

### 1. Performance Optimisée
- ✅ Réduction du lag avec optimisation GPU
- ✅ Résolution d'ombres réduite (2048 → 1024)
- ✅ Nombre de maisons réduit (7 → 5) pour fluidité
- ✅ Memoization des clones de modèles
- ✅ Damping activé pour contrôles fluides

### 2. Système de Positionnement Facile
- ✅ Fichier de configuration `buildingsLayout.ts`
- ✅ Modification simple sans toucher au code React
- ✅ Présets de rotation (NORTH, SOUTH, EAST, WEST...)
- ✅ Patterns de placement (cercle, grille, ligne)

---

## 📍 Comment Placer Vos Bâtiments

### Méthode Simple (Recommandée)

**1. Ouvrir le fichier de configuration**
```
app/components/Village3D/config/buildingsLayout.ts
```

**2. Ajouter un nouveau bâtiment**

Copiez ce modèle à la fin du tableau `VILLAGE_LAYOUT`:

```typescript
{
  name: "Ma Nouvelle Maison",
  modelPath: '/models/buildings/blender/maison.glb',
  position: [10, 0, 10], // X, Y, Z
  rotation: [0, Math.PI / 2, 0], // Rotation 90°
  scale: 1.5 // 150% de la taille
},
```

**3. Ajuster les valeurs**

#### Position [X, Y, Z]:
```
X: gauche (-) ← → droite (+)
Y: bas (-) ↓ ↑ haut (+)  - Généralement 0 pour le sol
Z: arrière (-) ↓ ↑ avant (+)
```

**Exemples**:
- `[0, 0, 0]` = Centre
- `[5, 0, 0]` = 5 unités à droite du centre
- `[-5, 0, 0]` = 5 unités à gauche du centre
- `[0, 0, 10]` = 10 unités vers l'avant
- `[10, 0, -10]` = Coin arrière-droit

#### Rotation [X, Y, Z]:
```
Math.PI / 4 = 45°
Math.PI / 2 = 90°
Math.PI = 180°
```

**Présets disponibles** (dans `buildingsLayout.ts`):
```typescript
import { ROTATIONS } from './config/buildingsLayout';

// Utiliser un preset:
rotation: ROTATIONS.NORTH  // Face au nord
rotation: ROTATIONS.EAST   // Face à l'est
rotation: ROTATIONS.NE     // Face au nord-est (45°)
```

#### Scale (échelle):
```
0.5 = Moitié de la taille
1.0 = Taille normale
2.0 = Double taille
```

---

## 🎯 Exemples Pratiques

### Exemple 1: Ajouter une maison à droite

```typescript
{
  name: "Maison Droite",
  modelPath: '/models/buildings/blender/maison.glb',
  position: [8, 0, 0],
  rotation: [0, -Math.PI / 2, 0], // Face à gauche
  scale: 1
},
```

### Exemple 2: Ajouter une grande église au centre

```typescript
{
  name: "Église Centrale",
  modelPath: '/models/buildings/blender/eglise.glb',
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: 2.5 // 2.5x plus grande
},
```

### Exemple 3: Créer une rangée de maisons

```typescript
// Maison 1
{
  name: "Rangée 1",
  modelPath: '/models/buildings/blender/maison.glb',
  position: [0, 0, 10],
  rotation: [0, 0, 0],
  scale: 1
},
// Maison 2
{
  name: "Rangée 2",
  modelPath: '/models/buildings/blender/maison.glb',
  position: [5, 0, 10],
  rotation: [0, 0, 0],
  scale: 1
},
// Maison 3
{
  name: "Rangée 3",
  modelPath: '/models/buildings/blender/maison.glb',
  position: [10, 0, 10],
  rotation: [0, 0, 0],
  scale: 1
},
```

---

## 🔄 Patterns de Placement Automatiques

### Pattern 1: Cercle de bâtiments

```typescript
import { PLACEMENT_PATTERNS } from './config/buildingsLayout';

// Générer 8 positions en cercle, rayon 15
const circlePositions = PLACEMENT_PATTERNS.circle(15, 8);

// Utiliser dans VILLAGE_LAYOUT:
...circlePositions.map((pos, i) => ({
  name: `Maison Cercle ${i + 1}`,
  modelPath: '/models/buildings/blender/maison.glb',
  ...pos
}))
```

### Pattern 2: Grille régulière

```typescript
// Grille 4x4 avec espacement de 6 unités
const gridPositions = PLACEMENT_PATTERNS.grid(4, 4, 6);

...gridPositions.map((pos, i) => ({
  name: `Maison Grille ${i + 1}`,
  modelPath: '/models/buildings/blender/maison.glb',
  ...pos
}))
```

### Pattern 3: Ligne de stands de marché

```typescript
// 5 stands alignés sur l'axe X
const linePositions = PLACEMENT_PATTERNS.line(5, 4, 'x');

...linePositions.map((pos, i) => ({
  name: `Stand ${i + 1}`,
  modelPath: '/models/vendors/blender/stand.glb',
  ...pos
}))
```

---

## 🎨 Organisation par Quartiers

**Recommandation**: Organisez vos bâtiments par zones

```typescript
export const VILLAGE_LAYOUT: BuildingConfig[] = [
  // === CENTRE - PLACE DU VILLAGE ===
  {
    name: "Fontaine Centrale",
    modelPath: '/models/buildings/blender/fontaine.glb',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1.5
  },

  // === QUARTIER RÉSIDENTIEL NORD ===
  {
    name: "Maison Nord 1",
    modelPath: '/models/buildings/blender/maison.glb',
    position: [0, 0, -10],
    rotation: ROTATIONS.SOUTH,
    scale: 1
  },
  {
    name: "Maison Nord 2",
    modelPath: '/models/buildings/blender/maison.glb',
    position: [5, 0, -10],
    rotation: ROTATIONS.SOUTH,
    scale: 1
  },

  // === QUARTIER ARTISANS SUD ===
  {
    name: "Forge",
    modelPath: '/models/buildings/blender/forge.glb',
    position: [0, 0, 15],
    rotation: ROTATIONS.NORTH,
    scale: 2
  },

  // === PLACE DU MARCHÉ EST ===
  {
    name: "Stand Fruits",
    modelPath: '/models/vendors/blender/stand.glb',
    position: [15, 0, 0],
    rotation: ROTATIONS.WEST,
    scale: 1.2
  },
];
```

---

## 🚀 Workflow Rapide

### Pour ajouter 1 bâtiment (30 secondes)

```bash
1. Ouvrir buildingsLayout.ts
2. Copier un bloc existant
3. Modifier name, position, rotation, scale
4. Sauvegarder (Ctrl+S)
5. La scène se recharge automatiquement ✨
```

### Pour tester différentes positions (Méthode Rapide)

```typescript
// Ajustez juste les nombres et sauvegardez pour voir le résultat
{
  name: "Test Maison",
  modelPath: '/models/buildings/blender/maison.glb',
  position: [0, 0, 0],  // ← Modifiez ici
  rotation: [0, 0, 0],   // ← Et ici
  scale: 1               // ← Et ici
},
// Sauvegardez, la page se recharge, vous voyez le résultat!
```

---

## 📊 Optimisation de la Performance

### Règles pour éviter le lag:

✅ **FAIRE**:
- Commencer avec 5-10 bâtiments maximum
- Utiliser des modèles low-poly (< 10,000 faces)
- Préférer plusieurs petits modèles à un énorme
- Tester la fluidité après chaque ajout

❌ **ÉVITER**:
- Plus de 20 bâtiments complexes en même temps
- Modèles avec textures 4K (utiliser 1K ou 2K max)
- Trop de sources de lumière (max 3-4)
- Ombres en haute résolution (rester à 1024)

### Si la page lag encore:

**Option 1: Réduire le nombre de bâtiments**
```typescript
// Dans buildingsLayout.ts, commentez certains bâtiments:
/*
{
  name: "Maison temporairement désactivée",
  ...
},
*/
```

**Option 2: Réduire la qualité des ombres**
```typescript
// Dans Scene3DClean.tsx, ligne ~93:
shadow-mapSize-width={512}   // Au lieu de 1024
shadow-mapSize-height={512}  // Au lieu de 1024
```

**Option 3: Désactiver les ombres**
```typescript
// Dans Scene3DClean.tsx, ligne ~78:
<Canvas
  camera={{ position: [10, 5, 10], fov: 60 }}
  // shadows  ← Commentez cette ligne
>
```

---

## 🎯 Checklist Avant d'Ajouter un Bâtiment

```
✅ Le fichier GLB existe dans /public/models/ ?
✅ Le chemin dans modelPath est correct ?
✅ La virgule à la fin du bloc est présente ?
✅ Le nom est unique et descriptif ?
✅ La position ne chevauche pas un autre bâtiment ?
```

---

## 📐 Aide-mémoire des Rotations

```
        Nord (Math.PI)
             ↑
             |
Ouest  ←  [0,0]  →  Est
(-Math.PI/2)  |  (Math.PI/2)
             ↓
        Sud (0)
```

**Angles courants**:
```typescript
0           = Sud (0°)
Math.PI/4   = Sud-Est (45°)
Math.PI/2   = Est (90°)
Math.PI     = Nord (180°)
-Math.PI/2  = Ouest (-90°)
```

---

## 🆘 Dépannage

### Le bâtiment n'apparaît pas
- Vérifier le chemin du GLB dans `modelPath`
- Vérifier que le fichier existe dans `/public/models/`
- Regarder la console (F12) pour les erreurs

### Le bâtiment est trop grand/petit
- Ajuster `scale`: plus petit (0.5) ou plus grand (2)

### Le bâtiment est à l'envers
- Essayer `rotation: [Math.PI, 0, 0]` (flip sur X)

### Le bâtiment est sous le sol
- Ajuster la position Y: `position: [x, 0.5, z]`

### La page lag
- Réduire le nombre de bâtiments
- Utiliser des modèles low-poly
- Réduire shadow-mapSize à 512

---

## 💡 Astuces Pro

1. **Nommage systématique** pour s'y retrouver:
   ```typescript
   name: "Maison_Nord_1"
   name: "Stand_Marche_Fruits"
   name: "Artisan_Forge"
   ```

2. **Variété des échelles** pour plus de réalisme:
   ```typescript
   scale: 0.9 + Math.random() * 0.3  // Entre 0.9 et 1.2
   ```

3. **Petites rotations aléatoires** pour casser la régularité:
   ```typescript
   rotation: [0, Math.random() * Math.PI * 2, 0]  // Rotation aléatoire
   ```

4. **Utiliser des commentaires** pour marquer les zones:
   ```typescript
   // === QUARTIER RÉSIDENTIEL ===
   // === PLACE DU MARCHÉ ===
   // === ZONE ARTISANALE ===
   ```

---

**Maintenant vous pouvez placer vos bâtiments facilement sans lag ! 🎉**

Pour toute question, consultez `GUIDE_CREATION_SCENE_BLENDER.md` pour plus de détails.
