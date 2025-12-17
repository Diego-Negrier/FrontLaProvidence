# Workflow Blender → React Three Fiber

## 📥 Installation

1. **Télécharger Blender**: https://www.blender.org/download/
2. **Installer** (glisser dans Applications sur Mac)
3. **Lancer** et faire le tutoriel intégré (recommandé)

---

## 🎯 Créer un Modèle Simple

### Exemple: Maison Médiévale

#### 1. Nouveau Projet
```
Blender → New → General
Supprimer le cube: X → Delete
```

#### 2. Créer les Murs
```
Shift + A → Mesh → Cube
S (Scale) → 2 (agrandir)
S → Z → 2 (étirer en hauteur)
S → X → 1.5 (largeur)
```

#### 3. Créer le Toit
```
Shift + A → Mesh → Cone
G (Grab/Move) → Z → 4 (monter au-dessus)
S → 1.8 (agrandir pour couvrir les murs)
```

#### 4. Ajouter des Détails
```
Sélectionner les murs
Tab (passer en Edit Mode)
3 (Face Select Mode)
Sélectionner une face (clic)
I (Inset) → bouger souris → clic (créer bordure)
E (Extrude) → -0.2 (enfoncer pour créer porte)
```

#### 5. Ajouter de la Couleur
```
Sortir du Edit Mode: Tab
Onglet Material Properties (icône sphère)
+ New Material
Base Color → choisir couleur rouge/brun
Roughness → 0.9 (moins brillant)
```

---

## 📤 Exporter pour le Web

### Étapes Importantes

1. **Sélectionner tout**: `A`

2. **Appliquer les transformations**:
   ```
   Object → Apply → All Transforms
   ```

3. **Centrer l'origine**:
   ```
   Object → Set Origin → Origin to Geometry
   ```

4. **Exporter**:
   ```
   File → Export → glTF 2.0 (.glb/.gltf)

   Paramètres:
   ✅ Format: GLB (binaire, plus compact)
   ✅ Include: Selected Objects (si besoin)
   ✅ Transform: +Y Up
   ✅ Geometry: Apply Modifiers
   ✅ Materials: Export

   Nom: maison_medievale.glb
   Destination: /public/models/buildings/
   ```

---

## 💻 Utiliser dans React Three Fiber

### 1. Créer le Composant

Fichier: `Village3D/Buildings/MaisonBlender.tsx`

```typescript
import { useGLTF } from '@react-three/drei';

export function MaisonBlender({ position = [0, 0, 0] }) {
  const { scene } = useGLTF('/models/buildings/maison_medievale.glb');

  return (
    <primitive
      object={scene.clone()}
      position={position}
      castShadow
      receiveShadow
    />
  );
}

useGLTF.preload('/models/buildings/maison_medievale.glb');
```

### 2. Importer dans Scene3D.tsx

```typescript
import { MaisonBlender } from './Buildings/MaisonBlender';

// Dans la scène:
<MaisonBlender position={[5, 8, 10]} />
<MaisonBlender position={[10, 8, 15]} />
<MaisonBlender position={[-5, 8, 8]} />
```

---

## 🎨 Tutoriels Blender Recommandés

### Pour Débutants:

1. **Blender Guru - Donut Tutorial** (3h)
   - https://www.youtube.com/watch?v=nIoXOplUvAw
   - Couvre toutes les bases
   - Très bien expliqué

2. **Grant Abbitt - Complete Beginner Guide**
   - https://www.youtube.com/watch?v=jBqYTgaFDxU
   - Série complète pour débuter

### Pour Architecture Médiévale:

1. **Medieval House Tutorial**
   - YouTube: "blender medieval house tutorial"
   - Plusieurs options disponibles

2. **Low Poly Buildings**
   - YouTube: "blender low poly building tutorial"
   - Plus simple, meilleures performances

---

## 🔍 Raccourcis Clavier Essentiels

### Navigation:
- **Molette souris**: Zoom
- **Molette + Shift**: Pan (déplacer)
- **Molette + Clic**: Rotation vue

### Manipulation:
- **G**: Move (Grab)
- **R**: Rotate
- **S**: Scale
- **X, Y, Z** après G/R/S: contraindre à un axe

### Sélection:
- **A**: Tout sélectionner
- **Alt + A**: Tout désélectionner
- **B**: Box select
- **C**: Circle select

### Édition:
- **Tab**: Edit Mode / Object Mode
- **E**: Extrude
- **I**: Inset
- **Ctrl + R**: Loop Cut
- **X**: Delete

### Objets:
- **Shift + A**: Add (ajouter objet)
- **Shift + D**: Duplicate

---

## 📦 Télécharger des Modèles Existants

### Sites Gratuits:

1. **Sketchfab** - https://sketchfab.com
   - Filtrer: Free Download
   - Format: GLB/GLTF
   - Recherche: "medieval", "building", "village"

2. **Poly Pizza** - https://poly.pizza
   - Low-poly gratuits
   - Bonne performance

3. **Quaternius** - https://quaternius.com
   - Packs complets gratuits
   - Style cartoon/stylisé

### Comment utiliser:
```
1. Télécharger le modèle (.glb ou .gltf)
2. Placer dans /public/models/
3. Créer composant comme MaisonBlender.tsx
4. Importer dans Scene3D.tsx
```

---

## 🎯 Exemples de Modèles à Créer

### Facile (1-2h):
- ✅ Maison simple (cubes + toit)
- ✅ Tonneau (cylindre modifié)
- ✅ Banc (cubes assemblés)
- ✅ Puits (cylindre + toit)

### Moyen (2-4h):
- ✅ Forge avec cheminée
- ✅ Moulin à vent
- ✅ Fontaine
- ✅ Chariot

### Avancé (4-8h):
- ✅ Église détaillée
- ✅ Château avec tours
- ✅ Animaux avec squelette (rigging)
- ✅ Personnages

---

## 🔧 Optimisation pour le Web

### Réduire le Poids:

1. **Moins de polygones**:
   - Modifier: Add Modifier → Decimate
   - Ratio: 0.5 (réduit de 50%)

2. **Taille de texture**:
   - Max 2048x2048
   - Compresser en JPG si pas de transparence

3. **Fusionner les objets**:
   - Sélectionner plusieurs objets
   - Ctrl + J (join)

### Compression GLB:

Installer gltf-pipeline:
```bash
npm install -g gltf-pipeline

# Compresser
gltf-pipeline -i model.glb -o model_compressed.glb -d
```

---

## 🎬 Workflow Complet - Exemple Réel

### Créer une Vache Réaliste:

#### Option 1: Télécharger
```
1. Sketchfab → "cow low poly free"
2. Télécharger GLB
3. Placer dans /public/models/animals/vache.glb
```

#### Option 2: Créer dans Blender
```
1. Référence: Chercher image "cow side view"
2. Add → Images as Planes (addon à activer)
3. Modeling: Commencer avec cube
4. Tab → Edit Mode
5. Extruder pour créer corps, pattes, tête
6. Smooth Shading: Clic droit → Shade Smooth
7. Subdivision Surface Modifier
8. Export GLB
```

### Utiliser:

```typescript
// Village3D/Agriculture/VacheBlender.tsx
import { useGLTF } from '@react-three/drei';

export function VacheBlender({ position }) {
  const { scene } = useGLTF('/models/animals/vache.glb');
  return <primitive object={scene.clone()} position={position} scale={0.5} />;
}
```

---

## 📚 Ressources Supplémentaires

### Documentation:
- **Blender Manual**: https://docs.blender.org/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber
- **Drei Helpers**: https://github.com/pmndrs/drei

### Addons Blender Utiles:
- **Node Wrangler** (déjà inclus) - Gestion matériaux
- **Bool Tool** - Opérations booléennes
- **LoopTools** - Outils d'édition avancés
- **Archimesh** - Architecture automatique

### Communautés:
- **Blender Artists**: https://blenderartists.org/
- **r/blender** (Reddit)
- **Blender Discord**

---

## ✅ Checklist: Premier Modèle

- [ ] Blender installé
- [ ] Tutoriel Donut complété (optionnel mais recommandé)
- [ ] Premier cube modifié (maison simple)
- [ ] Couleur/matériau ajouté
- [ ] Exporté en GLB dans /public/models/
- [ ] Composant React créé
- [ ] Importé dans Scene3D
- [ ] Visible dans le navigateur!

---

## 🚀 Prochaines Étapes

1. **Semaine 1**: Créer 3 bâtiments simples
2. **Semaine 2**: Télécharger 5 modèles Sketchfab
3. **Semaine 3**: Ajouter textures détaillées
4. **Semaine 4**: Animations (portes, drapeaux)

---

**Conseil**: Commencez SIMPLE! Un cube avec un toit est déjà mieux que les formes géométriques actuelles. Vous améliorerez progressivement.

**Question**: Voulez-vous que je vous montre comment télécharger et intégrer un modèle gratuit depuis Sketchfab en 5 minutes?
