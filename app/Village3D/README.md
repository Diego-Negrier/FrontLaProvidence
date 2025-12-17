# Village Français - Version Next.js

Un village français 3D interactif créé avec Three.js et Next.js.

## Structure du projet

```
villagefrancais/
├── src/
│   ├── app/
│   │   ├── layout.js        # Layout principal de l'application
│   │   ├── page.js          # Page d'accueil
│   │   └── globals.css      # Styles globaux
│   ├── components/
│   │   └── VillageScene.js  # Composant principal de la scène 3D
│   └── utils/
│       ├── scene.js         # Configuration de la scène, caméra, lumières
│       ├── objects.js       # Création des objets 3D (maisons, église)
│       ├── controls.js      # Contrôles FPS (WASD)
│       └── minimap.js       # Configuration de la minimap
├── public/
│   └── textures/            # Dossier pour les textures
│       ├── hdri.hdr
│       ├── pierre.jpg
│       ├── toit.jpg
│       ├── bois.jpg
│       ├── pave.jpg
│       ├── fenetre.png
│       └── porte.jpg
├── package.json
└── next.config.js

```

## Installation

1. Installez les dépendances :

```bash
npm install
```

2. Assurez-vous d'avoir les textures dans le dossier `public/textures/` :
   - hdri.hdr
   - pierre.jpg
   - toit.jpg
   - bois.jpg
   - pave.jpg
   - fenetre.png
   - porte.jpg

## Démarrage

Lancez le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Contrôles

- **Souris** : Rotation de la caméra (OrbitControls)
- **W/Z** : Avancer
- **S** : Reculer
- **A/Q** : Déplacer à gauche
- **D** : Déplacer à droite

## Fonctionnalités

- Scène 3D avec éclairage HDRI
- Ombres douces en temps réel
- Village avec église et maisons
- Contrôles FPS (clavier) et Orbit (souris)
- Minimap en temps réel (vue du dessus)
- Textures réalistes
- Responsive design

## Technologies utilisées

- **Next.js 14** : Framework React
- **Three.js** : Bibliothèque 3D
- **React 18** : Interface utilisateur
- **OrbitControls** : Contrôles de caméra
- **RGBELoader** : Chargement de textures HDRI

## Build pour production

```bash
npm run build
npm start
```

## Notes

- Ce projet utilise les modules ES6
- Les textures doivent être placées dans le dossier `public/textures/`
- Le composant VillageScene utilise `'use client'` pour s'exécuter côté client uniquement
