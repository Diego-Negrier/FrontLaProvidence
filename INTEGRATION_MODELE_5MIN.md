# ⚡ Intégrer un Modèle 3D en 5 Minutes Chrono

## 🎯 Mission
Télécharger une maison médiévale et la voir dans votre village en **5 minutes**.

---

## ⏱️ CHRONO: 5 MINUTES

### MINUTE 1-2: Télécharger

**Option Simple (RECOMMANDÉ)**:

1. **Cliquer ici**: https://poly.pizza/?s=medieval
2. **Choisir une maison** (clic sur miniature)
3. **Clic sur "Download GLB"**
4. **Fichier téléchargé!** (généralement `Downloads/model.glb`)

**Option Qualité** (Sketchfab):

1. **Cliquer ici**: https://sketchfab.com/search?q=medieval+house&features=downloadable&sort_by=-likeCount
2. **Choisir un modèle** avec "Download" disponible
3. **Clic "Download 3D Model"**
4. **Format: Auto-detect (glTF)**
5. **Dézipper** le fichier téléchargé
6. **Trouver le .glb** dans le dossier

---

### MINUTE 3: Copier dans le Projet

**Mac/Linux**:
```bash
# Adapter le nom du fichier téléchargé
cp ~/Downloads/model.glb /Users/diego-negrier/SynologyDrive/APPLICATION_PROJET/ProjetLaProvidence/FrontLaProvidence/public/models/buildings/maison_medievale.glb
```

**Windows**:
1. Ouvrir l'explorateur de fichiers
2. Aller dans `Téléchargements`
3. Copier le fichier `model.glb`
4. Coller dans:
   ```
   C:\...\ProjetLaProvidence\FrontLaProvidence\public\models\buildings\
   ```
5. Renommer en `maison_medievale.glb`

---

### MINUTE 4: Modifier le Code

**Ouvrir**: `app/components/Village3D/Buildings/MaisonBlender.tsx`

**Ligne 17**, modifier le chemin:
```typescript
// Avant:
const { scene } = useGLTF('/models/buildings/maison_medievale.glb');

// Après (si vous avez renommé différemment):
const { scene } = useGLTF('/models/buildings/VOTRE_FICHIER.glb');
```

**Ligne 48**, modifier aussi:
```typescript
// Avant:
useGLTF.preload('/models/buildings/maison_medievale.glb');

// Après:
useGLTF.preload('/models/buildings/VOTRE_FICHIER.glb');
```

---

### MINUTE 5: Ajouter au Village

**Ouvrir**: `app/components/Village3D/Scene3D.tsx`

**Ligne 8**, ajouter l'import:
```typescript
import { MaisonBlender } from './Buildings/MaisonBlender';
```

**Ligne 134** (après les arbres), ajouter:
```typescript
{/* Maisons téléchargées */}
<MaisonBlender position={[5, 8, 10]} scale={2} />
<MaisonBlender position={[10, 8, 15]} scale={1.8} />
<MaisonBlender position={[-5, 8, 12]} scale={2.2} />
```

**Sauvegarder le fichier** (Ctrl+S ou Cmd+S)

---

## ✅ VOIR LE RÉSULTAT

**Terminal**:
```bash
npm run dev
```

**Navigateur**:
```
http://localhost:3000/immersion
```

**Zoomer/Dézoomer**: Molette souris
**Tourner**: Clic gauche + bouger

---

## 🎉 SUCCÈS!

Vous devriez voir **3 maisons médiévales** autour du village!

---

## 🔧 Ajustements Rapides

### Le modèle est trop grand:
```typescript
<MaisonBlender position={[5, 8, 10]} scale={0.5} />
// 0.5 = moitié de la taille
```

### Le modèle est trop petit:
```typescript
<MaisonBlender position={[5, 8, 10]} scale={5} />
// 5 = 5 fois plus grand
```

### Le modèle est dans le mauvais sens:
```typescript
<MaisonBlender
  position={[5, 8, 10]}
  rotation={[0, Math.PI / 2, 0]}
  scale={2}
/>
// Rotation de 90 degrés sur l'axe Y
```

### Le modèle est dans le sol:
```typescript
<MaisonBlender position={[5, 10, 10]} scale={2} />
// Augmenter Y (10 au lieu de 8)
```

---

## 🚀 Ajouter Plus de Modèles

### Même Modèle, Positions Différentes:

```typescript
{/* Rangée de maisons */}
<MaisonBlender position={[0, 8, 5]} scale={2} />
<MaisonBlender position={[5, 8, 5]} scale={1.8} rotation={[0, Math.PI / 4, 0]} />
<MaisonBlender position={[10, 8, 5]} scale={2.2} rotation={[0, -Math.PI / 4, 0]} />
<MaisonBlender position={[15, 8, 5]} scale={1.9} />
```

### Différents Modèles:

**Télécharger** 3 maisons différentes:
- `maison1.glb`
- `maison2.glb`
- `maison3.glb`

**Créer** 3 composants:
1. Dupliquer `MaisonBlender.tsx` → `Maison1.tsx`
2. Dupliquer `MaisonBlender.tsx` → `Maison2.tsx`
3. Dupliquer `MaisonBlender.tsx` → `Maison3.tsx`

**Modifier** les chemins dans chaque:
```typescript
// Maison1.tsx
const { scene } = useGLTF('/models/buildings/maison1.glb');

// Maison2.tsx
const { scene } = useGLTF('/models/buildings/maison2.glb');

// Maison3.tsx
const { scene } = useGLTF('/models/buildings/maison3.glb');
```

**Utiliser**:
```typescript
import { Maison1 } from './Buildings/Maison1';
import { Maison2 } from './Buildings/Maison2';
import { Maison3 } from './Buildings/Maison3';

<Maison1 position={[0, 8, 5]} scale={2} />
<Maison2 position={[5, 8, 5]} scale={2} />
<Maison3 position={[10, 8, 5]} scale={2} />
```

---

## 🎯 Mission Suivante: Église

**Répéter le processus** avec une église:

1. **Télécharger**: https://poly.pizza/?s=church
2. **Copier**: `church.glb` → `/public/models/buildings/`
3. **Dupliquer**: `MaisonBlender.tsx` → `Eglise.tsx`
4. **Modifier** chemin: `'/models/buildings/church.glb'`
5. **Ajouter** dans Scene3D:
   ```typescript
   import { Eglise } from './Buildings/Eglise';

   <Eglise position={[0, 8, -15]} scale={3} />
   ```

---

## ⏱️ RÉCAP CHRONO

| Étape | Temps | Cumul |
|-------|-------|-------|
| Télécharger modèle | 2 min | 2 min |
| Copier dans projet | 30 sec | 2.5 min |
| Modifier code | 1 min | 3.5 min |
| Ajouter au village | 1 min | 4.5 min |
| Voir résultat | 30 sec | **5 min** ✅ |

---

## 🆘 Problèmes?

### "Cannot find module"
```bash
# Vérifier que le fichier existe:
ls public/models/buildings/

# Si vide, le fichier n'a pas été copié
```

### Modèle invisible
```typescript
// Augmenter la taille:
<MaisonBlender position={[0, 8, 0]} scale={10} />

// Le modèle est peut-être très petit
```

### Erreur "useGLTF is not defined"
```bash
# Installer @react-three/drei
npm install @react-three/drei

# Relancer
npm run dev
```

### Le serveur ne redémarre pas
```bash
# Arrêter: Ctrl+C
# Relancer:
npm run dev
```

---

## 🎊 BRAVO!

Vous avez intégré votre premier modèle 3D téléchargé!

**Prochaines étapes**:
- [ ] Télécharger 5 maisons différentes
- [ ] Ajouter une église
- [ ] Ajouter 3 stands de marché
- [ ] Remplacer tous les bâtiments géométriques

**Temps total pour 10 modèles**: ~30 minutes

---

**Prêt pour la suite?** → Voir [OU_TROUVER_MODELES_3D.md](OU_TROUVER_MODELES_3D.md)
