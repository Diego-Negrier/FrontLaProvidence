# Guide des Nuages pour la Scène 3D

## Solution Actuelle (Améliorée)
J'ai corrigé les "boules blanches" en créant des nuages réalistes composés de plusieurs sphères superposées avec différentes opacités et tailles. Les nuages sont maintenant plus subtils et naturels.

## Options pour Améliorer les Nuages

### 1. **Solution Simple (Actuelle)**
- ✅ Déjà implémentée
- Nuages composés de 4 sphères par groupe
- Opacité réduite (0.22-0.3)
- `depthWrite={false}` pour éviter les artefacts
- **Avantages**: Performant, simple
- **Inconvénients**: Moins réaliste que les solutions avancées

### 2. **Textures de Nuages (Recommandé)**
Pour des nuages plus réalistes, vous pouvez utiliser des textures:

#### Sites pour télécharger des textures gratuites:
- **Poly Haven** (https://polyhaven.com/textures/sky) - Textures HDR et nuages gratuits
- **Freepik** (https://www.freepik.com/free-photos-vectors/cloud-texture) - Textures PNG
- **Textures.com** - Bibliothèque de textures (compte gratuit limité)
- **AmbientCG** (https://ambientcg.com) - Textures PBR gratuites

#### Comment utiliser:
1. Téléchargez une texture de nuage PNG (fond transparent)
2. Placez-la dans `/public/textures/sky/cloud.png`
3. Modifiez le code pour utiliser la texture (voir exemple ci-dessous)

### 3. **Sky Dome avec HDRI**
Pour un ciel ultra-réaliste avec nuages:

#### Logiciels pour créer/trouver des HDRI:
- **Blender** (gratuit) - Shader Editor pour créer des ciels
- **Terragen** (version gratuite limitée) - Spécialisé dans les paysages
- **HDRI Haven** (https://polyhaven.com/hdris/skies) - HDRI gratuits de ciels réels

#### Comment utiliser:
1. Téléchargez un fichier HDRI (.hdr ou .exr)
2. Utilisez `@react-three/drei` avec `<Environment>`

### 4. **Shaders Personnalisés (Avancé)**
Pour des nuages volumétriques animés:
- **Shader Toy** (https://www.shadertoy.com) - Exemples de shaders de nuages
- Nécessite des connaissances en GLSL

## Exemple de Code avec Texture

```typescript
// Dans Vallee3D.tsx
import { useTexture } from '@react-three/drei';

export function Vallee3D() {
  const cloudTexture = useTexture('/textures/sky/cloud.png');

  return (
    <group>
      {/* Nuages avec texture */}
      {Array.from({ length: 15 }).map((_, i) => (
        <sprite
          key={`cloud-${i}`}
          position={[
            (Math.random() - 0.5) * 200,
            35 + Math.random() * 15,
            (Math.random() - 0.5) * 200
          ]}
          scale={[15 + Math.random() * 10, 8, 1]}
        >
          <spriteMaterial
            map={cloudTexture}
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}
```

## Exemple avec Environment (HDRI)

```typescript
import { Environment } from '@react-three/drei';

// Dans Scene3D.tsx
<Canvas>
  <Environment
    files="/textures/sky/sky.hdr"
    background
  />
  {/* Reste de la scène */}
</Canvas>
```

## Logiciels Recommandés

### Pour Créer des Textures de Nuages:
1. **GIMP** (gratuit) - Filtres cloud et manipulation d'images
2. **Krita** (gratuit) - Pinceaux nuages
3. **Photoshop** - Si vous avez accès

### Pour Créer des Scènes 3D Complètes:
1. **Blender** (gratuit, open-source)
   - Créer des ciels procéduraux
   - Exporter en GLTF/GLB pour Three.js
   - Addon "Sky Texture" intégré

2. **Terragen** (version gratuite)
   - Spécialisé dans les paysages et ciels
   - Rendu photoréaliste
   - Export d'images HDR

3. **World Creator** (payant)
   - Générateur de terrain
   - Atmosphères réalistes

## Installation de Blender (Gratuit)

1. Téléchargez: https://www.blender.org/download/
2. Installez
3. Pour créer un ciel:
   - Ouvrez Blender
   - Allez dans "Shading" workspace
   - Sélectionnez "World"
   - Ajoutez un "Sky Texture" node
   - Configurez les paramètres
   - Render > Render Image
   - Image > Save As > PNG ou EXR

## Modification Rapide Actuelle

Pour ajuster les nuages actuels sans logiciel externe:

### Réduire le nombre de nuages:
Ligne 222: `Array.from({ length: 12 })` → changez 12 à 6 ou 8

### Rendre plus transparents:
Lignes 236, 246, 256, 266: Réduisez `opacity` de 0.3 à 0.15

### Changer la hauteur:
Ligne 225: `const y = 35 + Math.random() * 15;` → augmentez 35 à 45

### Espacer davantage:
Ligne 223-224: Augmentez 180 à 250

## Prochaines Étapes Recommandées

1. **Court terme**: Ajustez les paramètres actuels (ci-dessus)
2. **Moyen terme**: Ajoutez des textures PNG de nuages de Poly Haven
3. **Long terme**: Utilisez un HDRI de ciel complet avec `<Environment>`

---

**Note**: La solution actuelle est déjà bien meilleure que les "boules blanches" initiales. Les nuages sont maintenant composés de plusieurs sphères avec transparence et profondeur, créant un effet plus naturel et subtil.
