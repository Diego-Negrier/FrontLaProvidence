# 🏰 Village Français Réaliste - Guide Complet

## ✨ Vue d'ensemble

Votre nouveau village 3D est inspiré de **Collonges-la-Rouge** en Corrèze, l'un des plus beaux villages de France. Il offre un rendu **photo-réaliste et luxueux** pour immerger vos clients dans une expérience authentique.

---

## 🎨 Caractéristiques Principales

### Architecture Authentique

1. **Grès Rouge de Collonges** (#8B3A3A)
   - Pierre bordeaux caractéristique de la région
   - Textures photographiques réelles (678 KB)
   - Normal maps pour relief 3D (933 KB)
   - Roughness maps pour matière réaliste (280 KB)

2. **Maison Noble avec Tourelle** (Poivrière)
   - Tour d'angle cylindrique avec toit conique
   - Flèche dorée au sommet
   - Fenêtres à meneaux en pierre claire
   - Porte en bois massif avec ferrures
   - Linteau sculpté

3. **Église / Chapelle Centrale**
   - Nef en grès rouge
   - Clocher carré avec flèche octogonale
   - Croix dorée au sommet
   - Baies géminées (fenêtres jumelles)
   - Portail roman avec voussures sculptées
   - Vitraux bleus lumineux

4. **Maison à Colombages**
   - Rez-de-chaussée en pierre
   - Étage avec poutres en bois apparentes
   - Croix de Saint-André (diagonales)
   - Toit en ardoise bleue-grise

5. **Place Centrale avec Fontaine**
   - Sol pavé authentique
   - Fontaine octogonale en pierre claire
   - Vasque à deux niveaux
   - Effet d'eau miroir

---

## 📦 Fichiers Créés

```
FrontLaProvidence/
│
├── app/components/Village3D/Buildings/
│   └── VillageFrancaisRealiste.tsx          ← Composant principal
│
├── scripts/
│   └── download-village-textures.js         ← Script de téléchargement
│
├── public/textures/village/
│   ├── red_sandstone_diffuse.jpg            (678 KB) ✅
│   ├── red_sandstone_normal.jpg             (933 KB) ✅
│   ├── red_sandstone_roughness.jpg          (280 KB) ✅
│   ├── slate_roof_diffuse.jpg               (504 KB) ✅
│   └── slate_roof_normal.jpg                (745 KB) ✅
│
└── VILLAGE_REALISTE_GUIDE.md                ← Ce fichier
```

**Total textures téléchargées :** ~3.1 MB de textures PBR professionnelles

---

## 🎯 Éléments Luxueux Intégrés

### Éclairage Cinématique

1. **Lumières dorées chaleureuses**
   - Point lights dorés (#FFD700) sur les maisons nobles
   - Ambiance chaleureuse et accueillante
   - Intensité 1.5, distance 15m

2. **Éclairage d'église**
   - Spot light blanc crème (#FFF8DC)
   - Intensité 2.0, distance 20m
   - Met en valeur l'architecture centrale

3. **Spot sur fontaine**
   - Lumière jaune pâle (#FFFACD)
   - Angle 0.3, penumbra 0.5
   - Crée un point focal luxueux

### Détails Réalistes

- **Vitraux lumineux** : Émissivité bleue (#4169e1) avec intensité 0.4
- **Croix dorée** : Métallique (#FFD700) avec metalness 1.0
- **Fer forgé** : Ferrures noires métalliques (#1A1A1A)
- **Eau de fontaine** : Effet miroir réaliste (metalness 0.9)
- **Ardoise toits** : Textures photographiques avec relief

---

## 🚀 Utilisation

### Commandes NPM

```bash
# Télécharger les textures (optionnel, déjà fait)
npm run download-village

# Lancer le serveur de développement
npm run dev

# Accéder au village
http://localhost:3007
```

### Intégration dans Scene3D

Le village est déjà intégré dans votre scène :

```tsx
<VillageFrancaisRealiste
  position={[0, 0, -10]}
  onClick={() => onFournisseurClick?.(9, "Village Français Authentique")}
/>
```

---

## 🎨 Palette de Couleurs Authentiques

| Élément | Couleur Hex | Description |
|---------|-------------|-------------|
| Grès rouge | `#8B3A3A` | Pierre de Collonges |
| Ardoise toit | `#2F4F4F` | Gris-bleu foncé |
| Bois ancien | `#4A3728` | Brun patiné |
| Calcaire clair | `#E8DCC4` | Beige crème |
| Fer forgé | `#1A1A1A` | Noir métallique |
| Or décoratif | `#FFD700` | Or brillant |
| Vitraux | `#4169e1` | Bleu royal |

---

## ⚙️ Technique : Rendu PBR

### Physically Based Rendering

Tous les matériaux utilisent le rendu **PBR** (Physically Based Rendering) :

```typescript
MeshStandardMaterial {
  map: texture_diffuse,           // Couleur de base
  normalMap: texture_normal,      // Relief 3D
  roughnessMap: texture_roughness, // Aspect mat/brillant
  roughness: 0.85,                // Rugosité
  metalness: 0.05,                // Non-métallique
  envMapIntensity: 0.8            // Reflets environnement
}
```

### Optimisations Qualité

- **Anisotropie** : 16 (maximum netteté)
- **Filtrage** : LinearMipmapLinear (meilleure qualité)
- **Répétition** : 4x4 pour pierre, 8x8 pour ardoise
- **Ombres** : castShadow + receiveShadow sur tous les objets

---

## 📐 Dimensions Réalistes

| Bâtiment | Largeur | Hauteur | Profondeur |
|----------|---------|---------|-----------|
| Maison Noble 1 | 6m | 8m | 5m |
| Tourelle | Ø 1.6m | 6m | - |
| Église Nef | 8m | 8m | 12m |
| Clocher | 4m | 16m | 4m |
| Maison Colombages | 5.5m | 7m | 4.5m |
| Fontaine | Ø 3m | 3.5m | - |

---

## 🎭 Ambiance et Immersion

### Points Forts

✅ **Authenticité** : Architecture fidèle à Collonges-la-Rouge
✅ **Photo-réalisme** : Textures photographiques 2K
✅ **Luxe** : Détails dorés, éclairage cinématique
✅ **Immersion** : Jeu d'ombres et lumières
✅ **Performance** : Optimisé avec textures 1K-2K

### Expérience Client

Le village crée une **immersion totale** avec :
- Ambiance médiévale authentique
- Sensation de luxe français
- Attention aux détails architecturaux
- Éclairage chaleureux et accueillant

---

## 🔧 Personnalisation

### Modifier les Couleurs

Éditez le fichier `VillageFrancaisRealiste.tsx` :

```typescript
const materials = useMemo(() => ({
  redSandstone: new THREE.MeshStandardMaterial({
    color: '#8B3A3A', // ← Changez cette couleur
    roughness: 0.9,
    metalness: 0.05,
  }),
  // ...
}), [textures]);
```

### Ajouter des Bâtiments

Dupliquez et modifiez les groupes existants :

```typescript
<group position={[x, 0, z]}>
  {/* Votre nouveau bâtiment */}
</group>
```

### Ajuster l'Éclairage

Modifiez les lumières en fin de fichier :

```typescript
<pointLight
  position={[-8, 4, -5]}
  intensity={1.5}        // ← Intensité
  color="#FFD700"        // ← Couleur
  distance={15}          // ← Portée
/>
```

---

## 📊 Performance

### Poids Total

- **Géométrie 3D** : ~150 KB
- **Textures** : 3.1 MB (chargées une seule fois)
- **Total en mémoire** : ~3.3 MB

### FPS Attendus

- **GPU moderne** : 60 FPS constant
- **GPU moyen** : 45-60 FPS
- **Mobile** : 30-45 FPS

### Optimisations Actives

✓ Textures compressées JPG
✓ Mipmaps automatiques
✓ Anisotropie limitée à 16
✓ Résolution 1K-2K (pas 4K)
✓ Géométrie optimisée

---

## 🆘 Dépannage

### Les Textures ne Chargent Pas

**Vérifiez** :
```bash
ls public/textures/village/
```

Vous devriez voir 5 fichiers .jpg.

**Re-téléchargez** :
```bash
npm run download-village
```

### Le Village est Invisible

1. Vérifiez la console navigateur (F12)
2. Vérifiez que Scene3D.tsx importe bien VillageFrancaisRealiste
3. Vérifiez la position : `position={[0, 0, -10]}`

### Performance Lente

**Réduire la qualité des textures** :

```typescript
texture.anisotropy = 8; // Au lieu de 16
texture.repeat.set(2, 2); // Au lieu de (4, 4)
```

---

## 🎓 Architecture de Collonges-la-Rouge

### Histoire

Collonges-la-Rouge est un village médiéval de Corrèze, classé parmi les **Plus Beaux Villages de France**. Sa particularité :

- **Grès rouge** : Pierre extraite localement (couleur bordeaux unique)
- **XIIe-XVIe siècles** : Période de construction
- **Tours à poivrières** : Tourelles avec toits coniques
- **Patrimoine** : Architecture préservée depuis 800 ans

### Éléments Reproduits

✅ Grès rouge bordeaux caractéristique
✅ Tours à poivrières (tourelles d'angle)
✅ Toits en ardoise
✅ Fenêtres à meneaux
✅ Colombages (poutres apparentes)
✅ Place centrale avec fontaine
✅ Église avec clocher

---

## 📱 Support

Pour toute question :

1. Consultez ce guide
2. Vérifiez la console navigateur (F12)
3. Consultez les fichiers de code avec commentaires

---

## ✨ Prochaines Étapes

Pour améliorer encore plus le réalisme :

1. **Animations** :
   - Fumée de cheminée
   - Drapeaux qui bougent
   - Eau de fontaine qui coule

2. **Détails supplémentaires** :
   - Volets en bois
   - Enseignes de boutiques
   - Bancs en pierre
   - Lampes à huile

3. **Ambiance sonore** :
   - Sons de cloches
   - Eau qui coule
   - Ambiance de village

4. **Interactions** :
   - Portes qui s'ouvrent
   - Fenêtres cliquables
   - Visite guidée automatique

---

**🏰 Profitez de votre village français authentique et luxueux ! 🇫🇷**
