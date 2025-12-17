# 🚀 Installation Automatique - Abbaye Réaliste

## ⚡ Installation en 1 commande

Tout est automatisé ! Lancez simplement :

```bash
cd FrontLaProvidence
npm run setup-abbey
```

Cette commande va :
1. ✅ Télécharger les textures photographiques depuis Polyhaven (gratuit)
2. ✅ Les placer dans `/public/textures/moissac/`
3. ✅ Activer automatiquement les textures dans le code
4. ✅ Configurer tous les matériaux PBR

---

## 📋 Installation Étape par Étape (optionnel)

Si vous préférez contrôler chaque étape :

### Étape 1 : Télécharger les textures
```bash
npm run download-textures
```

Télécharge depuis Polyhaven :
- 📸 Pierre romane blonde (diffuse, normal, roughness)
- 📸 Brique gothique (diffuse, normal)
- 📸 Marbre colonnes (diffuse, normal)
- 📸 Tuiles de toit

**Poids total** : ~15 MB
**Temps estimé** : 1-2 minutes

### Étape 2 : Activer les textures
```bash
npm run activate-textures
```

Modifie automatiquement le code pour :
- ✓ Charger les textures avec `useTexture`
- ✓ Configurer la répétition et qualité
- ✓ Appliquer aux matériaux

### Étape 3 : Lancer le serveur
```bash
npm run dev
```

Ouvrez : http://localhost:3007

---

## 🎨 Résultat

Avant l'installation :
- ❌ Couleurs plates
- ❌ Pas de relief
- ❌ Aspect simple

Après l'installation :
- ✅ Textures photographiques réalistes
- ✅ Relief 3D (normal maps)
- ✅ Rugosité authentique
- ✅ Rendu photo-réaliste

---

## 📁 Structure Créée

```
FrontLaProvidence/
├── scripts/
│   ├── download-textures.js     (télécharge les textures)
│   └── activate-textures.js     (active dans le code)
│
├── public/textures/moissac/
│   ├── stone_roman_diffuse.jpg      (2 MB)
│   ├── stone_roman_normal.jpg       (1.5 MB)
│   ├── stone_roman_roughness.jpg    (800 KB)
│   ├── brick_gothic_diffuse.jpg     (2.5 MB)
│   ├── brick_gothic_normal.jpg      (2 MB)
│   ├── marble_diffuse.jpg           (2 MB)
│   ├── marble_normal.jpg            (1.5 MB)
│   └── roof_tile_diffuse.jpg        (2 MB)
│
└── app/components/Village3D/Buildings/
    └── AbbaySaintPierreMoissacRealistic.tsx (modifié automatiquement)
```

---

## 🔧 Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm run setup-abbey` | Installation complète automatique |
| `npm run download-textures` | Télécharge uniquement les textures |
| `npm run activate-textures` | Active uniquement les textures dans le code |
| `npm run dev` | Lance le serveur de développement |

---

## ❓ Problèmes Courants

### Erreur : "Cannot find module 'https'"

**Solution** : Vous utilisez probablement Node.js v18+. C'est normal, le module `https` est intégré.

Si l'erreur persiste :
```bash
npm install
```

### Textures ne s'affichent pas

**Vérifiez** :
1. Les fichiers existent :
   ```bash
   ls public/textures/moissac/
   ```
   Vous devriez voir 8 fichiers .jpg

2. Le composant est activé dans `Scene3D.tsx` :
   ```tsx
   import { AbbaySaintPierreMoissacRealistic } from './Buildings/AbbaySaintPierreMoissacRealistic';
   ```

3. Redémarrez le serveur :
   ```bash
   # Ctrl+C pour arrêter
   npm run dev
   ```

### Performance lente

**Solution** : Réduisez la qualité des textures

1. Ouvrez les textures avec un outil d'image (Photoshop, GIMP)
2. Réduisez la résolution : 2048px → 1024px
3. Sauvegardez en JPG avec qualité 80%

Ou utilisez un outil en ligne :
https://tinypng.com/

### Téléchargement échoue

**Solution** : Téléchargez manuellement depuis Polyhaven

1. Allez sur https://polyhaven.com/textures
2. Cherchez "sandstone blocks" (pierre)
3. Cherchez "medieval blocks" (brique)
4. Cherchez "white marble" (marbre)
5. Téléchargez en 2K JPG
6. Placez dans `/public/textures/moissac/`
7. Renommez selon la structure

---

## 🎓 Personnalisation

### Changer une texture

Remplacez simplement le fichier dans `/public/textures/moissac/`

Exemple : Remplacer la pierre
```bash
# Remplacez stone_roman_diffuse.jpg par votre photo
cp ma_photo_pierre.jpg public/textures/moissac/stone_roman_diffuse.jpg
```

### Ajuster la répétition

Modifiez dans `AbbaySaintPierreMoissacRealistic.tsx` :

```typescript
// Plus de répétition = texture plus petite
texture.repeat.set(5, 5);  // au lieu de (3, 3)

// Moins de répétition = texture plus grande
texture.repeat.set(1, 1);  // au lieu de (3, 3)
```

### Ajuster la qualité

```typescript
// Qualité maximale (plus lourd)
texture.anisotropy = 16;

// Qualité moyenne (plus léger)
texture.anisotropy = 8;
```

---

## 📊 Performance

**Avec textures** :
- Poids chargé : ~15 MB
- FPS : 40-60 (selon GPU)
- Temps de chargement : 2-5 secondes

**Optimisations activées** :
- ✅ Anisotropie pour la netteté
- ✅ Mipmaps pour les performances
- ✅ Compression automatique du navigateur

---

## 🆘 Besoin d'Aide ?

1. Vérifiez la console navigateur (F12)
2. Consultez `GUIDE_ABBAYE_REALISTE.md`
3. Consultez `/public/textures/moissac/README.md`

---

## ✅ Checklist de Vérification

- [ ] Node.js installé (v16+)
- [ ] `npm install` exécuté
- [ ] `npm run setup-abbey` exécuté sans erreur
- [ ] 8 fichiers .jpg dans `/public/textures/moissac/`
- [ ] `npm run dev` lancé
- [ ] Page ouverte sur http://localhost:3007
- [ ] Abbaye visible avec textures réalistes

---

**C'est tout ! Profitez de votre abbaye photo-réaliste ! 🏰✨**
