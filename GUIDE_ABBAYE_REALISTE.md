# 🏰 Guide : Abbaye Saint-Pierre de Moissac Ultra-Réaliste

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Installation rapide](#installation-rapide)
3. [Utilisation basique](#utilisation-basique)
4. [Ajout de textures photo-réalistes](#ajout-de-textures-photo-réalistes)
5. [Optimisation des performances](#optimisation-des-performances)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Vue d'ensemble

Vous disposez maintenant de **2 versions** de l'Abbaye Saint-Pierre de Moissac :

### Version 1 : `AbbaySaintPierreMoissac` (Actuelle)
- ✅ Géométrie détaillée avec dimensions réelles
- ✅ Matériaux PBR de base (couleurs)
- ✅ Prête à l'emploi
- ⚡ Performante
- 📦 Légère (pas de textures externes)

### Version 2 : `AbbaySaintPierreMoissacRealistic` (Nouvelle)
- ✨ **ULTRA-RÉALISTE** avec textures photographiques
- 🎨 Support des normal maps (relief 3D)
- 💎 Matériaux PBR avancés
- 📸 Utilise de vraies photos de Moissac
- 🚀 Optimisée pour le rendu réaliste

---

## ⚡ Installation rapide

### Étape 1 : Installer la dépendance
```bash
npm install @react-three/drei
```

### Étape 2 : Utiliser le composant réaliste

Remplacez dans `Scene3D.tsx` :

**Avant** :
```tsx
import { AbbaySaintPierreMoissac } from './Buildings/AbbaySaintPierreMoissac';

<AbbaySaintPierreMoissac
  position={[0, 0, -30]}
  onClick={() => onFournisseurClick?.(9, "Abbaye Saint-Pierre de Moissac")}
/>
```

**Après** :
```tsx
import { AbbaySaintPierreMoissacRealistic } from './Buildings/AbbaySaintPierreMoissacRealistic';

<AbbaySaintPierreMoissacRealistic
  position={[0, 0, -30]}
  onClick={() => onFournisseurClick?.(9, "Abbaye Saint-Pierre de Moissac")}
/>
```

---

## 📸 Ajout de textures photo-réalistes

### Option A : Utiliser Google Street View (Gratuit)

1. **Ouvrez Google Maps** : https://maps.google.com
2. **Cherchez** : "Abbaye Saint-Pierre de Moissac"
3. **Activez Street View** : Cliquez sur le bonhomme jaune
4. **Capturez les photos** :
   - Pierre romane blonde (façade ouest)
   - Brique gothique rouge (chœur)
   - Portail sud sculpté (tympan)
   - Colonnes du cloître

### Option B : Télécharger des textures PBR

Sites gratuits recommandés :

1. **Polyhaven** 🌟 RECOMMANDÉ
   ```
   https://polyhaven.com/textures
   Cherchez : "limestone", "marble", "medieval brick"
   ```

2. **AmbientCG**
   ```
   https://ambientcg.com/
   Catégories : Stone > Limestone, Marble
   ```

3. **3D Textures**
   ```
   https://3dtextures.me/
   Filtre : Stone, Brick
   ```

### Structure des fichiers textures

Placez vos fichiers dans :
```
/public/textures/moissac/
├── stone_roman_diffuse.jpg      (Photo couleur de pierre)
├── stone_roman_normal.jpg       (Relief de la pierre)
├── stone_roman_roughness.jpg    (Rugosité)
├── brick_gothic_diffuse.jpg
├── brick_gothic_normal.jpg
├── tympan_diffuse.jpg           (Photo du portail sculpté)
├── tympan_normal.jpg
├── marble_diffuse.jpg
└── README.md                     (Guide détaillé)
```

### Résolutions recommandées

| Élément | Résolution minimale | Résolution optimale |
|---------|---------------------|---------------------|
| Pierre | 1024x1024px | 2048x2048px |
| Brique | 1024x1024px | 2048x2048px |
| Tympan sculpté | 2048x2048px | **4096x4096px** |
| Colonnes | 1024x1024px | 2048x2048px |
| Chapiteaux | 1024x1024px | 2048x2048px |

---

## 🎨 Activation des textures dans le code

### Étape 1 : Importer useTexture

Dans `AbbaySaintPierreMoissacRealistic.tsx`, ajoutez en haut du composant :

```typescript
export function AbbaySaintPierreMoissacRealistic({ position, onClick }) {
  // AJOUTEZ CECI 👇
  const textures = useTexture({
    stoneRoman: '/textures/moissac/stone_roman_diffuse.jpg',
    stoneNormal: '/textures/moissac/stone_roman_normal.jpg',
    stoneRoughness: '/textures/moissac/stone_roman_roughness.jpg',

    brickGothic: '/textures/moissac/brick_gothic_diffuse.jpg',
    brickNormal: '/textures/moissac/brick_gothic_normal.jpg',

    tympan: '/textures/moissac/tympan_diffuse.jpg',
    tympanNormal: '/textures/moissac/tympan_normal.jpg',

    marble: '/textures/moissac/marble_diffuse.jpg',
  });

  // Configuration des textures
  Object.values(textures).forEach(texture => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2); // Ajustez selon besoin
    }
  });

  // ... reste du code
}
```

### Étape 2 : Appliquer les textures aux matériaux

Modifiez la section `materials` :

```typescript
const materials = useMemo(() => ({
  stoneRoman: new THREE.MeshStandardMaterial({
    map: textures.stoneRoman,           // ✅ Texture photo
    normalMap: textures.stoneNormal,    // ✅ Relief 3D
    roughnessMap: textures.stoneRoughness, // ✅ Rugosité
    roughness: 0.85,
    metalness: 0.05,
  }),

  brickGothic: new THREE.MeshStandardMaterial({
    map: textures.brickGothic,
    normalMap: textures.brickNormal,
    roughness: 0.9,
    metalness: 0.02,
  }),

  // ... autres matériaux
}), [textures]);
```

---

## 🚀 Optimisation des performances

### 1. Compression des textures

Avant d'ajouter vos textures, compressez-les :

**En ligne (gratuit)** :
- https://tinypng.com/ (PNG)
- https://compressjpeg.com/ (JPEG)

**Taux de compression recommandé** : 70-80%

### 2. Utiliser des textures adaptées

```typescript
// ❌ Mauvais - Texture trop lourde
const texture = useTexture('/textures/tympan_8k.jpg'); // 15 MB !

// ✅ Bon - Texture optimisée
const texture = useTexture('/textures/tympan_2k.jpg');  // 500 KB
```

### 3. Lazy Loading

Enveloppez le composant dans `Suspense` :

```tsx
import { Suspense } from 'react';

<Suspense fallback={<LoadingSpinner />}>
  <AbbaySaintPierreMoissacRealistic position={[0, 0, -30]} />
</Suspense>
```

### 4. Level of Detail (LOD)

Pour les très grandes scènes :

```tsx
import { Lod } from '@react-three/drei';

<Lod>
  <AbbaySaintPierreMoissacRealistic position={[0, 0, -30]} />
  {/* Version simplifiée pour vue lointaine */}
  <AbbaySaintPierreMoissac position={[0, 0, -30]} />
</Lod>
```

---

## 🔧 Troubleshooting

### Problème 1 : Les textures ne s'affichent pas

**Solution** :
1. Vérifiez que les fichiers existent dans `/public/textures/moissac/`
2. Vérifiez les chemins (sensibles à la casse)
3. Ouvrez la console navigateur (F12) pour voir les erreurs

```typescript
// Console devrait afficher :
// ✅ THREE.TextureLoader: Loaded /textures/moissac/stone_roman_diffuse.jpg
```

### Problème 2 : Performances lentes

**Solutions** :
1. Réduisez la résolution des textures (2048px → 1024px)
2. Compressez les images
3. Utilisez le format JPEG au lieu de PNG (plus léger)
4. Activez le cache :

```typescript
const textures = useTexture({
  stone: '/textures/moissac/stone_roman_diffuse.jpg',
}, {
  cache: true // ✅ Active le cache
});
```

### Problème 3 : Textures floues ou pixelisées

**Solution** :
```typescript
// Configurez le filtrage
texture.minFilter = THREE.LinearMipmapLinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.anisotropy = 16; // Maximum de qualité
```

### Problème 4 : Erreur "useTexture is not defined"

**Solution** :
```bash
# Installez la dépendance manquante
npm install @react-three/drei
```

---

## 📊 Comparaison des versions

| Caractéristique | Version Standard | Version Réaliste |
|----------------|------------------|------------------|
| Géométrie | ✅ Détaillée | ✅ Détaillée |
| Dimensions authentiques | ✅ 64m | ✅ 64m |
| Matériaux PBR | ✅ Basique | ✅ Avancé |
| Textures photos | ❌ Couleurs | ✅ Vraies photos |
| Normal maps | ❌ Non | ✅ Oui |
| Rugosité réaliste | ⚠️ Approximation | ✅ Carte de rugosité |
| Poids (sans textures) | ~50 KB | ~60 KB |
| Poids (avec textures) | 50 KB | ~5-10 MB |
| Performance | 🚀 Excellente | ⚡ Bonne |
| Rendu visuel | 😊 Bien | 🤩 Exceptionnel |

---

## 🎬 Exemples d'utilisation

### Exemple 1 : Version basique (sans textures)

```tsx
<AbbaySaintPierreMoissacRealistic
  position={[0, 0, -30]}
  onClick={(e) => console.log('Abbaye cliquée!')}
/>
```

### Exemple 2 : Avec textures complètes

```tsx
<Suspense fallback={<Loader />}>
  <AbbaySaintPierreMoissacRealistic
    position={[0, 0, -30]}
    onClick={handleClick}
  />
</Suspense>
```

### Exemple 3 : Switcher entre les versions

```tsx
const [useRealistic, setUseRealistic] = useState(true);

{useRealistic ? (
  <AbbaySaintPierreMoissacRealistic position={[0, 0, -30]} />
) : (
  <AbbaySaintPierreMoissac position={[0, 0, -30]} />
)}

<button onClick={() => setUseRealistic(!useRealistic)}>
  {useRealistic ? 'Mode Standard' : 'Mode Réaliste'}
</button>
```

---

## 📚 Ressources supplémentaires

### Documentation
- Three.js Textures : https://threejs.org/docs/#api/en/textures/Texture
- React Three Fiber : https://docs.pmnd.rs/react-three-fiber
- @react-three/drei : https://github.com/pmndrs/drei

### Tutoriels PBR
- PBR Guide : https://learnopengl.com/PBR/Theory
- Material Properties : https://marmoset.co/posts/basic-theory-of-physically-based-rendering/

### Outils
- Normal Map Generator : https://cpetry.github.io/NormalMap-Online/
- Texture Compressor : https://tinypng.com/
- PBR Texture Generator : https://www.materialmaker.org/

---

## ✅ Checklist de déploiement

- [ ] `@react-three/drei` installé
- [ ] Textures ajoutées dans `/public/textures/moissac/`
- [ ] Textures compressées (< 2 MB par fichier)
- [ ] Code mis à jour avec `useTexture`
- [ ] Composant enveloppé dans `Suspense`
- [ ] Test sur navigateur (Chrome, Firefox, Safari)
- [ ] Performance vérifiée (60 FPS minimum)
- [ ] Version mobile testée

---

## 🎯 Prochaines étapes

1. **Téléchargez des textures** depuis Polyhaven ou Street View
2. **Placez-les** dans `/public/textures/moissac/`
3. **Activez les textures** dans le code (suivez le guide ci-dessus)
4. **Testez** le rendu
5. **Ajustez** les paramètres si nécessaire

---

## 💬 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez la console navigateur (F12)
2. Consultez le README dans `/public/textures/moissac/`
3. Vérifiez que toutes les dépendances sont installées

---

**Bon développement ! 🏰✨**
