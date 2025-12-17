# 🚀 Quick Start: Blender en 10 Minutes

## Objectif
Intégrer votre premier modèle 3D Blender dans le village en 10 minutes.

---

## Option 1: Télécharger un Modèle (5 minutes) ⚡

### 1. Aller sur Sketchfab
- Site: https://sketchfab.com/3d-models?features=downloadable&sort_by=-likeCount
- Rechercher: "medieval house free"
- Filtrer: ✅ Downloadable, ✅ Free

### 2. Télécharger
- Cliquer sur un modèle qui vous plaît
- Bouton "Download 3D Model"
- Format: **Auto (glTF)**
- Dézipper le fichier

### 3. Placer dans le Projet
```bash
# Le fichier .glb est dans le dossier téléchargé
# Le copier vers:
/public/models/buildings/medieval_house.glb
```

### 4. Créer le Composant

Fichier déjà créé: `Village3D/Buildings/MaisonBlender.tsx`

Modifier juste le chemin si nécessaire:
```typescript
const { scene } = useGLTF('/models/buildings/medieval_house.glb');
```

### 5. Ajouter au Village

Dans `Scene3D.tsx`, ajouter l'import:
```typescript
import { MaisonBlender } from './Buildings/MaisonBlender';
```

Dans la scène (après ligne 132):
```typescript
{/* Maison depuis Blender */}
<MaisonBlender position={[0, 8, -10]} scale={2} />
```

### 6. Voir le Résultat
```bash
npm run dev
```

✅ **C'est tout!** Vous avez intégré votre premier modèle Blender!

---

## Option 2: Créer dans Blender (10 minutes) 🎨

### 1. Télécharger Blender
- https://www.blender.org/download/
- Installer (glisser dans Applications)

### 2. Lancer et Créer

**Supprimer le cube**:
```
Clic sur le cube → X → Delete
```

**Créer une maison simple**:
```
Shift + A → Mesh → Cube (les murs)
S → 2 (agrandir)
S → Z → 2 (étirer en hauteur)

Shift + A → Mesh → Cone (le toit)
G → Z → 4 (monter au-dessus)
S → 2 (agrandir)
```

**Ajouter de la couleur**:
```
Onglet Material Properties (icône boule orange)
+ New
Base Color → Rouge/Brun
```

### 3. Exporter

```
File → Export → glTF 2.0 (.glb)

Paramètres:
✅ Format: GLB
✅ +Y Up

Nom: maison_medievale.glb
Destination: /public/models/buildings/
```

### 4. Utiliser (même que Option 1, étapes 4-6)

---

## 🎯 Raccourcis Blender Essentiels

| Touche | Action |
|--------|--------|
| **Molette souris** | Tourner la vue |
| **Shift + Molette** | Déplacer la vue |
| **G** | Move (déplacer) |
| **S** | Scale (agrandir/réduire) |
| **R** | Rotate (tourner) |
| **X, Y, Z** | Contraindre à un axe (après G/S/R) |
| **Shift + A** | Ajouter un objet |
| **X** | Supprimer |
| **Tab** | Passer en Edit Mode |

---

## 📁 Structure des Dossiers

```
public/
└── models/
    ├── buildings/          # Bâtiments
    │   ├── maison_medievale.glb
    │   ├── medieval_house.glb
    │   └── forge.glb
    ├── animals/            # Animaux
    │   └── vache_realiste.glb
    ├── vegetation/         # Arbres, plantes
    │   └── arbre_detaille.glb
    └── decorations/        # Accessoires
        └── tonneau.glb
```

---

## ✅ Checklist Rapide

- [ ] Dossiers `/public/models/` créés ✅ (déjà fait)
- [ ] Blender téléchargé OU modèle Sketchfab téléchargé
- [ ] Fichier .glb dans `/public/models/buildings/`
- [ ] `MaisonBlender.tsx` créé ✅ (déjà fait)
- [ ] Import ajouté dans `Scene3D.tsx`
- [ ] `<MaisonBlender position={[x, y, z]} />` ajouté
- [ ] `npm run dev` lancé
- [ ] Visible dans le navigateur!

---

## 🆘 Problèmes Courants

### Le modèle n'apparaît pas:
```typescript
// Vérifier le chemin (sensible à la casse):
useGLTF('/models/buildings/medieval_house.glb')

// Pas:
useGLTF('/models/buildings/Medieval_House.glb')
```

### Le modèle est trop grand/petit:
```typescript
<MaisonBlender position={[0, 8, 0]} scale={0.5} /> // Plus petit
<MaisonBlender position={[0, 8, 0]} scale={2} />   // Plus grand
```

### Le modèle est dans le mauvais sens:
```typescript
<MaisonBlender
  position={[0, 8, 0]}
  rotation={[0, Math.PI / 2, 0]}  // Tourner de 90°
/>
```

### Erreur "Cannot find module":
```bash
# Vérifier que le fichier existe:
ls public/models/buildings/

# Vérifier @react-three/drei installé:
npm install @react-three/drei
```

---

## 🎬 Vidéos Recommandées (YouTube)

1. **"Blender Beginner Tutorial - Part 1"** by Blender Guru (20 min)
2. **"Export Blender to Three.js"** (10 min)
3. **"Medieval House Blender Tutorial"** (30 min)

---

## 📞 Aide

Si vous êtes bloqué, vérifiez:
1. Le fichier .glb existe dans `/public/models/`
2. Le chemin dans `useGLTF()` est correct
3. `npm install @react-three/drei` est fait
4. Le serveur dev est relancé (`npm run dev`)

---

**Prêt?** Choisissez Option 1 (télécharger) ou Option 2 (créer) et lancez-vous! 🚀

**Temps estimé**:
- Option 1: 5-10 minutes
- Option 2: 10-20 minutes
