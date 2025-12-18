import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VILLAGE_SHOPS, VILLAGE_CATEGORIES, type CategoryConfig, type SubCategoryConfig } from '../../config/villageConfig';
import type { Fournisseur, Produit } from '../../services/types';
import type { Shop } from '../../types/village';

// Fonction pour créer un stand de catégorie avec emoji
function createCategoryStall(
  scene: THREE.Scene,
  x: number,
  z: number,
  rotation: number,
  category: CategoryConfig
) {
  const stallGroup = new THREE.Group();

  // Couleurs en fonction de la catégorie
  const colors = [
    0x8b4513, // Brun
    0x2d5016, // Vert foncé
    0xdaa520, // Or
    0x4a90e2, // Bleu
    0xe74c3c, // Rouge
    0x9b59b6, // Violet
    0xf39c12, // Orange
    0x1abc9c, // Turquoise
    0x34495e, // Gris
    0xe67e22  // Orange foncé
  ];

  const woodColor = colors[category.id % colors.length] || 0x8b4513;
  const canvasColor = 0xf4e4c1;

  // Poteaux d'angle plus larges pour un stand de catégorie
  const postGeometry = new THREE.BoxGeometry(0.15, 3, 0.15);
  const postMaterial = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.8 });

  const positions = [
    [-1.5, 1.5, -0.75],
    [1.5, 1.5, -0.75],
    [-1.5, 1.5, 0.75],
    [1.5, 1.5, 0.75]
  ];

  positions.forEach(([px, py, pz]) => {
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(px, py, pz);
    post.castShadow = true;
    stallGroup.add(post);
  });

  // Toit en toile plus grand
  const roofGeometry = new THREE.BoxGeometry(3.5, 0.15, 2);
  const roofMaterial = new THREE.MeshStandardMaterial({ color: canvasColor, roughness: 0.9 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 3, 0);
  roof.castShadow = true;
  stallGroup.add(roof);

  // Comptoir
  const counterGeometry = new THREE.BoxGeometry(3, 0.15, 1.2);
  const counterMaterial = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.7 });
  const counter = new THREE.Mesh(counterGeometry, counterMaterial);
  counter.position.set(0, 1, 0.4);
  counter.castShadow = true;
  counter.receiveShadow = true;
  stallGroup.add(counter);

  // Support du comptoir
  const supportGeometry = new THREE.BoxGeometry(0.15, 1, 0.15);
  [-1.2, 0, 1.2].forEach(px => {
    const support = new THREE.Mesh(supportGeometry, postMaterial);
    support.position.set(px, 0.5, 0.4);
    support.castShadow = true;
    stallGroup.add(support);
  });

  // Enseigne avec emoji et nom de catégorie
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    canvas.width = 1024;
    canvas.height = 256;

    // Fond blanc
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Emoji
    ctx.font = 'bold 100px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(category.emoji, 150, canvas.height / 2);

    // Nom de la catégorie
    ctx.fillStyle = '#2d1810';
    ctx.font = 'bold 50px Arial';
    ctx.fillText(category.nom, 600, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const signGeometry = new THREE.PlaneGeometry(3.5, 0.9);
    const signMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 3.5, 0);
    stallGroup.add(sign);
  }

  // Afficher quelques icônes sur le comptoir (représentant les sous-catégories)
  const subCatCount = Math.min(category.sousCategories.length, 5);
  for (let i = 0; i < subCatCount; i++) {
    const itemGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const itemMaterial = new THREE.MeshStandardMaterial({
      color: colors[(category.id + i) % colors.length],
      roughness: 0.6
    });
    const item = new THREE.Mesh(itemGeometry, itemMaterial);
    item.position.set((i - subCatCount / 2) * 0.6, 1.3, 0.4);
    item.castShadow = true;
    stallGroup.add(item);
  }

  stallGroup.position.set(x, 0, z);
  stallGroup.rotation.y = rotation;

  // Donner un nom au groupe pour le debugging
  stallGroup.name = `CategoryStall_${category.id}`;

  scene.add(stallGroup);

  console.log(`[createCategoryStall] Stand créé: ${category.emoji} ${category.nom}, children:`, stallGroup.children.length);

  return stallGroup;
}

// Fonction pour créer un stand manuel procédural (ancienne version)
function createProceduralStall(scene: THREE.Scene, x: number, z: number, rotation: number, name: string, productCount: number) {
  const stallGroup = new THREE.Group();

  // Structure en bois du stand
  const woodColor = 0x8b4513;
  const canvasColor = 0xf4e4c1;

  // Poteaux d'angle
  const postGeometry = new THREE.BoxGeometry(0.1, 2.5, 0.1);
  const postMaterial = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.8 });

  const positions = [
    [-1, 1.25, -0.5],
    [1, 1.25, -0.5],
    [-1, 1.25, 0.5],
    [1, 1.25, 0.5]
  ];

  positions.forEach(([px, py, pz]) => {
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(px, py, pz);
    post.castShadow = true;
    stallGroup.add(post);
  });

  // Toit en toile
  const roofGeometry = new THREE.BoxGeometry(2.4, 0.1, 1.4);
  const roofMaterial = new THREE.MeshStandardMaterial({ color: canvasColor, roughness: 0.9 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 2.5, 0);
  roof.castShadow = true;
  stallGroup.add(roof);

  // Comptoir
  const counterGeometry = new THREE.BoxGeometry(2, 0.1, 0.8);
  const counterMaterial = new THREE.MeshStandardMaterial({ color: woodColor, roughness: 0.7 });
  const counter = new THREE.Mesh(counterGeometry, counterMaterial);
  counter.position.set(0, 0.9, 0.3);
  counter.castShadow = true;
  counter.receiveShadow = true;
  stallGroup.add(counter);

  // Support du comptoir
  const supportGeometry = new THREE.BoxGeometry(0.1, 0.9, 0.1);
  [-0.8, 0, 0.8].forEach(px => {
    const support = new THREE.Mesh(supportGeometry, postMaterial);
    support.position.set(px, 0.45, 0.3);
    support.castShadow = true;
    stallGroup.add(support);
  });

  // Enseigne avec le nom
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    canvas.width = 512;
    canvas.height = 128;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#2d1810';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const signGeometry = new THREE.PlaneGeometry(2, 0.5);
    const signMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 2.8, 0);
    stallGroup.add(sign);
  }

  // Afficher les produits sur le comptoir
  for (let i = 0; i < Math.min(productCount, 3); i++) {
    const productGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const productMaterial = new THREE.MeshStandardMaterial({
      color: [0xdaa520, 0xff6347, 0x90ee90][i % 3],
      roughness: 0.6
    });
    const product = new THREE.Mesh(productGeometry, productMaterial);
    product.position.set((i - 1) * 0.5, 1.1, 0.3);
    product.castShadow = true;
    stallGroup.add(product);
  }

  stallGroup.position.set(x, 0, z);
  stallGroup.rotation.y = rotation;

  scene.add(stallGroup);
  return stallGroup;
}

export function createGround(scene: THREE.Scene, texPave: THREE.Texture) {
  // Sol principal avec texture pavée - COLLISIONS ACTIVÉES
  const sol = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({
      map: texPave,
      roughness: 0.8,
      metalness: 0.2
    })
  );
  sol.rotation.x = -Math.PI / 2;
  sol.position.y = 0;
  sol.receiveShadow = true;
  // Rendre le sol physique (invisible mais solide)
  (sol as any).userData.isGround = true;
  scene.add(sol);

  // Place centrale circulaire
  const placeCentrale = new THREE.Mesh(
    new THREE.CircleGeometry(25, 64),
    new THREE.MeshStandardMaterial({
      color: 0xc9b697,
      roughness: 0.7,
      metalness: 0.1
    })
  );
  placeCentrale.rotation.x = -Math.PI / 2;
  placeCentrale.position.y = 0.05;
  placeCentrale.receiveShadow = true;
  scene.add(placeCentrale);

  // Bordures décoratives autour de la place
  const borderGeometry = new THREE.TorusGeometry(25, 0.3, 16, 100);
  const borderMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b7355,
    roughness: 0.6,
    metalness: 0.3
  });
  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  border.rotation.x = Math.PI / 2;
  border.position.y = 0.1;
  border.castShadow = true;
  scene.add(border);

  // Chemins radiaux depuis la place centrale
  const pathMaterial = new THREE.MeshStandardMaterial({
    color: 0xa89078,
    roughness: 0.75,
    metalness: 0.15
  });

  const pathPositions = [
    { x: 0, z: -40, rotation: 0 },     // Vers l'église
    { x: -22, z: -10, rotation: 0.6 }, // Vers maison gauche
    { x: 22, z: -10, rotation: -0.6 }, // Vers maison droite
    { x: -26, z: 12, rotation: 1 },    // Vers maison arrière gauche
    { x: 26, z: 12, rotation: -1 }     // Vers maison arrière droite
  ];

  pathPositions.forEach(pos => {
    const distance = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
    const path = new THREE.Mesh(
      new THREE.PlaneGeometry(4, distance - 25),
      pathMaterial
    );
    path.rotation.x = -Math.PI / 2;
    path.rotation.z = pos.rotation;
    const midX = pos.x / 2;
    const midZ = pos.z / 2;
    path.position.set(midX, 0.02, midZ);
    path.receiveShadow = true;
    scene.add(path);
  });

  // Ajout de quelques détails: petites pierres décoratives
  const stoneGeometry = new THREE.SphereGeometry(0.5, 16, 16);
  const stoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x696969,
    roughness: 0.9,
    metalness: 0.1
  });

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    stone.position.set(
      Math.cos(angle) * 26,
      0.25,
      Math.sin(angle) * 26
    );
    stone.scale.set(
      0.8 + Math.random() * 0.4,
      0.6 + Math.random() * 0.3,
      0.8 + Math.random() * 0.4
    );
    stone.castShadow = true;
    stone.receiveShadow = true;
    scene.add(stone);
  }
}

// Fonction pour créer un champ de blé
export function createWheatField(scene: THREE.Scene, x: number, z: number, width: number, depth: number) {
  const fieldGroup = new THREE.Group();

  // Sol du champ
  const fieldGround = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      roughness: 0.9,
      metalness: 0.1
    })
  );
  fieldGround.rotation.x = -Math.PI / 2;
  fieldGround.receiveShadow = true;
  fieldGroup.add(fieldGround);

  // Plants de blé (instances)
  const wheatGeometry = new THREE.ConeGeometry(0.1, 1, 4);
  const wheatMaterial = new THREE.MeshStandardMaterial({
    color: 0xdaa520,
    roughness: 0.8
  });

  const rows = Math.floor(depth / 1);
  const cols = Math.floor(width / 1);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const wheat = new THREE.Mesh(wheatGeometry, wheatMaterial);
      wheat.position.set(
        -width / 2 + (j * width / cols) + Math.random() * 0.3,
        0.5,
        -depth / 2 + (i * depth / rows) + Math.random() * 0.3
      );
      wheat.rotation.z = (Math.random() - 0.5) * 0.2;
      wheat.castShadow = true;
      fieldGroup.add(wheat);
    }
  }

  fieldGroup.position.set(x, 0, z);
  scene.add(fieldGroup);
}

// Fonction pour créer un champ de tournesols
export function createSunflowerField(scene: THREE.Scene, x: number, z: number, width: number, depth: number) {
  const fieldGroup = new THREE.Group();

  // Sol du champ
  const fieldGround = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({
      color: 0x6b4423,
      roughness: 0.9,
      metalness: 0.1
    })
  );
  fieldGround.rotation.x = -Math.PI / 2;
  fieldGround.receiveShadow = true;
  fieldGroup.add(fieldGround);

  // Plants de tournesol
  const rows = Math.floor(depth / 2);
  const cols = Math.floor(width / 2);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const sunflower = new THREE.Group();

      // Tige
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x2d5016 })
      );
      stem.position.y = 0.75;
      sunflower.add(stem);

      // Fleur (disque central)
      const center = new THREE.Mesh(
        new THREE.CircleGeometry(0.3, 16),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      center.rotation.x = -Math.PI / 2;
      center.position.y = 1.5;
      sunflower.add(center);

      // Pétales
      const petalGeometry = new THREE.CircleGeometry(0.15, 8);
      const petalMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });

      for (let p = 0; p < 8; p++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        const angle = (p / 8) * Math.PI * 2;
        petal.position.set(
          Math.cos(angle) * 0.35,
          1.5,
          Math.sin(angle) * 0.35
        );
        petal.rotation.x = -Math.PI / 2;
        sunflower.add(petal);
      }

      sunflower.position.set(
        -width / 2 + (j * width / cols) + Math.random() * 0.5,
        0,
        -depth / 2 + (i * depth / rows) + Math.random() * 0.5
      );

      sunflower.children.forEach(child => {
        if ((child as THREE.Mesh).isMesh) child.castShadow = true;
      });

      fieldGroup.add(sunflower);
    }
  }

  fieldGroup.position.set(x, 0, z);
  scene.add(fieldGroup);
}

// Fonction pour créer un vignoble
export function createVineyard(scene: THREE.Scene, x: number, z: number, width: number, depth: number) {
  const fieldGroup = new THREE.Group();

  // Sol du vignoble
  const fieldGround = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.9,
      metalness: 0.1
    })
  );
  fieldGround.rotation.x = -Math.PI / 2;
  fieldGround.receiveShadow = true;
  fieldGroup.add(fieldGround);

  // Rangées de vignes
  const rows = Math.floor(depth / 3);
  const cols = Math.floor(width / 1.5);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const vine = new THREE.Group();

      // Poteau
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a3728 })
      );
      post.position.y = 0.6;
      vine.add(post);

      // Feuillage
      const foliageGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const foliageMaterial = new THREE.MeshStandardMaterial({
        color: 0x2d5016,
        roughness: 0.9
      });

      for (let f = 0; f < 3; f++) {
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(
          (Math.random() - 0.5) * 0.4,
          0.5 + f * 0.3,
          (Math.random() - 0.5) * 0.4
        );
        foliage.scale.set(
          0.8 + Math.random() * 0.4,
          0.8 + Math.random() * 0.4,
          0.8 + Math.random() * 0.4
        );
        foliage.castShadow = true;
        vine.add(foliage);
      }

      // Grappes de raisin
      const grapeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const grapeMaterial = new THREE.MeshStandardMaterial({
        color: 0x722f37,
        roughness: 0.6
      });

      for (let g = 0; g < 2; g++) {
        const grape = new THREE.Mesh(grapeGeometry, grapeMaterial);
        grape.position.set(
          (Math.random() - 0.5) * 0.3,
          0.4 + Math.random() * 0.3,
          (Math.random() - 0.5) * 0.3
        );
        grape.castShadow = true;
        vine.add(grape);
      }

      vine.position.set(
        -width / 2 + (j * width / cols),
        0,
        -depth / 2 + (i * depth / rows)
      );

      fieldGroup.add(vine);
    }
  }

  fieldGroup.position.set(x, 0, z);
  scene.add(fieldGroup);
}

// Fonction utilitaire pour charger un modèle GLB
export function loadGLBModel(
  scene: THREE.Scene,
  modelPath: string,
  position: { x: number; y: number; z: number },
  scale: number = 1,
  rotation: number = 0,
  metadata?: { shopId?: number; fournisseurId?: number; nom?: string; isClickable?: boolean; type?: string }
): Promise<THREE.Group> {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Configurer la position
        model.position.set(position.x, position.y, position.z);

        // Configurer l'échelle
        model.scale.set(scale, scale, scale);

        // Configurer la rotation
        if (rotation !== 0) {
          model.rotation.y = rotation;
        }

        // Ajouter les métadonnées
        if (metadata) {
          (model as any).userData = metadata;
        }

        // Activer les ombres pour tous les meshes du modèle
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(model);
        resolve(model);
      },
      (progress) => {
        // Optionnel: suivi du chargement
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Chargement ${modelPath}: ${percent.toFixed(2)}%`);
      },
      (error) => {
        console.error('Erreur de chargement du modèle:', error);
        reject(error);
      }
    );
  });
}

// Mapper les fournisseurs aux shops du village
function mapFournisseursToShops(fournisseurs: Fournisseur[], produits: Produit[]): Shop[] {
  return VILLAGE_SHOPS.map((shop, index) => {
    // Assigner un fournisseur à chaque shop (cyclique si moins de fournisseurs que de shops)
    const fournisseur = fournisseurs[index % fournisseurs.length];

    // Filtrer les produits par fournisseur
    const produitsDuShop = fournisseur
      ? produits.filter(p => {
          const fournisseurId = p.pk_fournisseur || p.fournisseur;
          const fournisseurPk = (fournisseur as any).pk_fournisseur || (fournisseur as any).pk;
          return fournisseurId === fournisseurPk;
        })
      : [];

    return {
      ...shop,
      produits: produitsDuShop as any,
      artisan: fournisseur ? {
        nom: (fournisseur as any).nom_fournisseur || (fournisseur as any).nom || 'Artisan',
        metier: (fournisseur as any).email_fournisseur || (fournisseur as any).email || '',
        histoire: `Fournisseur depuis ${(fournisseur as any).date_creation ? new Date((fournisseur as any).date_creation).getFullYear() : 'longtemps'}`
      } : shop.artisan
    };
  });
}

// Fonction pour créer un stand de sous-catégorie AMÉLIORÉ
function createSubCategoryStall(
  x: number,
  z: number,
  rotation: number,
  subCategory: any,
  color: number,
  fournisseurs: Fournisseur[] = [],
  produits: Produit[] = []
) {
  const stallGroup = new THREE.Group();
  const scale = 1.8; // Augmenter la taille globale de 80%

  // Couleurs médiévales authentiques
  const woodColor = new THREE.Color(color).multiplyScalar(0.7); // Bois vieilli plus sombre
  const accentColor = new THREE.Color(color).offsetHSL(0, -0.3, -0.1); // Couleur patinée
  const stoneColor = 0x8b7355; // Pierre médiévale

  // BASE EN PIERRE MÉDIÉVALE (pavés)
  const baseGeometry = new THREE.BoxGeometry(3 * scale, 0.3, 2.2 * scale);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: stoneColor,
    roughness: 0.95,
    metalness: 0,
    bumpScale: 0.02
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(0, 0.15, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  stallGroup.add(base);

  // Ajout de pavés individuels (détail médiéval)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      const stone = new THREE.Mesh(
        new THREE.BoxGeometry(0.9 * scale, 0.05, 0.9 * scale),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(stoneColor).offsetHSL(0, 0, Math.random() * 0.1 - 0.05),
          roughness: 0.95
        })
      );
      stone.position.set(
        (i - 1) * 0.95 * scale,
        0.32,
        (j - 0.5) * 0.95 * scale
      );
      stone.castShadow = true;
      stone.receiveShadow = true;
      stallGroup.add(stone);
    }
  }

  // Poteaux en bois médiéval massif (plus épais et texturés)
  const postGeometry = new THREE.CylinderGeometry(0.15 * scale, 0.18 * scale, 3.8 * scale, 8);
  const postMaterial = new THREE.MeshStandardMaterial({
    color: 0x5d4e37, // Bois sombre médiéval
    roughness: 0.9,
    metalness: 0
  });

  const positions = [
    [-1.3 * scale, 1.9 * scale, -0.8 * scale],
    [1.3 * scale, 1.9 * scale, -0.8 * scale],
    [-1.3 * scale, 1.9 * scale, 0.8 * scale],
    [1.3 * scale, 1.9 * scale, 0.8 * scale]
  ];

  positions.forEach(([px, py, pz]) => {
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(px, py, pz);
    post.castShadow = true;

    // Ajouter des anneaux de fer forgé médiéval
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.18 * scale, 0.03 * scale, 8, 16),
        new THREE.MeshStandardMaterial({
          color: 0x2f2f2f, // Fer forgé noir
          roughness: 0.7,
          metalness: 0.8
        })
      );
      ring.position.set(px, 0.8 + i * 1.2, pz);
      ring.rotation.x = Math.PI / 2;
      ring.castShadow = true;
      stallGroup.add(ring);
    }

    stallGroup.add(post);
  });

  // TOIT EN CHAUME MÉDIÉVAL (forme incurvée)
  const roofGeometry = new THREE.CylinderGeometry(0, 3.2 * scale, 0.8 * scale, 4);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0xc9a861, // Chaume doré
    roughness: 0.95,
    metalness: 0
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 4 * scale, 0);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  stallGroup.add(roof);

  // Base du toit en bois
  const roofBaseGeometry = new THREE.BoxGeometry(3.3 * scale, 0.2 * scale, 2.4 * scale);
  const roofBase = new THREE.Mesh(roofBaseGeometry, new THREE.MeshStandardMaterial({
    color: 0x5d4e37,
    roughness: 0.85
  }));
  roofBase.position.set(0, 3.6 * scale, 0);
  roofBase.castShadow = true;
  stallGroup.add(roofBase);

  // Poutres apparentes médiévales
  for (let i = -1; i <= 1; i++) {
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(0.1 * scale, 0.15 * scale, 2.5 * scale),
      new THREE.MeshStandardMaterial({
        color: 0x3e2f1f,
        roughness: 0.9
      })
    );
    beam.position.set(i * 1.1 * scale, 3.7 * scale, 0);
    beam.castShadow = true;
    stallGroup.add(beam);
  }

  // COMPTOIR EN BOIS MASSIF MÉDIÉVAL
  const counterGeometry = new THREE.BoxGeometry(2.8 * scale, 0.25 * scale, 1.3 * scale);
  const counterMaterial = new THREE.MeshStandardMaterial({
    color: 0x6b4f34, // Bois foncé usé
    roughness: 0.85,
    metalness: 0
  });
  const counter = new THREE.Mesh(counterGeometry, counterMaterial);
  counter.position.set(0, 1.35 * scale, 0.45 * scale);
  counter.castShadow = true;
  counter.receiveShadow = true;
  stallGroup.add(counter);

  // Bord décoratif du comptoir (sculpté)
  const edgeGeometry = new THREE.BoxGeometry(2.85 * scale, 0.1 * scale, 0.15 * scale);
  const edge = new THREE.Mesh(edgeGeometry, new THREE.MeshStandardMaterial({
    color: 0x8b6f47,
    roughness: 0.8
  }));
  edge.position.set(0, 1.25 * scale, 1.15 * scale);
  edge.castShadow = true;
  stallGroup.add(edge);

  // Supports du comptoir (poteaux sculptés)
  const supportGeometry = new THREE.CylinderGeometry(0.12 * scale, 0.15 * scale, 1.35 * scale, 8);
  [-1.2 * scale, 0, 1.2 * scale].forEach(px => {
    const support = new THREE.Mesh(supportGeometry, new THREE.MeshStandardMaterial({
      color: 0x5d4e37,
      roughness: 0.9
    }));
    support.position.set(px, 0.675 * scale, 0.45 * scale);
    support.castShadow = true;

    // Anneau décoratif en fer
    const decorRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.15 * scale, 0.02 * scale, 8, 16),
      new THREE.MeshStandardMaterial({
        color: 0x2f2f2f,
        roughness: 0.7,
        metalness: 0.8
      })
    );
    decorRing.position.set(px, 0.9 * scale, 0.45 * scale);
    decorRing.rotation.x = Math.PI / 2;
    decorRing.castShadow = true;
    stallGroup.add(decorRing);

    stallGroup.add(support);
  });

  // PANNEAU DE FOND EN BOIS MÉDIÉVAL avec motif
  const backPanelGeometry = new THREE.BoxGeometry(2.9 * scale, 2.7 * scale, 0.12);
  const backPanelMaterial = new THREE.MeshStandardMaterial({
    color: woodColor,
    roughness: 0.85,
    metalness: 0
  });
  const backPanel = new THREE.Mesh(backPanelGeometry, backPanelMaterial);
  backPanel.position.set(0, 1.6 * scale, -0.85 * scale);
  backPanel.castShadow = true;
  backPanel.receiveShadow = true;
  stallGroup.add(backPanel);

  // Bordure décorative du panneau (style médiéval)
  const borderThickness = 0.08 * scale;
  const borderMaterial = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.75,
    metalness: 0.1
  });

  // Bordures verticales
  [-1.45 * scale, 1.45 * scale].forEach(x => {
    const border = new THREE.Mesh(
      new THREE.BoxGeometry(borderThickness, 2.8 * scale, 0.08),
      borderMaterial
    );
    border.position.set(x, 1.6 * scale, -0.79 * scale);
    border.castShadow = true;
    stallGroup.add(border);
  });

  // Bordures horizontales
  [-1.35 * scale, 1.35 * scale].forEach(y => {
    const border = new THREE.Mesh(
      new THREE.BoxGeometry(2.98 * scale, borderThickness, 0.08),
      borderMaterial
    );
    border.position.set(0, y, -0.79 * scale);
    border.castShadow = true;
    stallGroup.add(border);
  });

  // Croix décorative centrale (style médiéval)
  const crossMaterial = new THREE.MeshStandardMaterial({
    color: 0x2f2f2f,
    roughness: 0.6,
    metalness: 0.7
  });

  // Barre verticale de la croix
  const verticalCross = new THREE.Mesh(
    new THREE.BoxGeometry(0.06 * scale, 0.8 * scale, 0.05),
    crossMaterial
  );
  verticalCross.position.set(0, 1.6 * scale, -0.74 * scale);
  verticalCross.castShadow = true;
  stallGroup.add(verticalCross);

  // Barre horizontale de la croix
  const horizontalCross = new THREE.Mesh(
    new THREE.BoxGeometry(0.6 * scale, 0.06 * scale, 0.05),
    crossMaterial
  );
  horizontalCross.position.set(0, 1.8 * scale, -0.74 * scale);
  horizontalCross.castShadow = true;
  stallGroup.add(horizontalCross);

  // ENSEIGNE MÉDIÉVALE style parchemin
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    canvas.width = 1600;
    canvas.height = 480;

    // Fond parchemin médiéval (texture vieillie)
    const parchmentGradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    parchmentGradient.addColorStop(0, '#f4e8d0');
    parchmentGradient.addColorStop(0.7, '#e8d9bb');
    parchmentGradient.addColorStop(1, '#d4c5a9');
    ctx.fillStyle = parchmentGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Effet vieilli (taches)
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = '#8b7355';
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 40 + 10,
        0, Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Bordure décorative médiévale
    ctx.strokeStyle = '#5d4e37';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Bordure intérieure dorée
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 6;
    ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

    // Coins décoratifs (fleurs de lys stylisées)
    ctx.fillStyle = '#8b6f47';
    const corners = [
      [60, 60], [canvas.width - 60, 60],
      [60, canvas.height - 60], [canvas.width - 60, canvas.height - 60]
    ];
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
    });

    // Emoji avec ombre
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.font = 'bold 180px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(subCategory.emoji, 280, canvas.height / 2);

    // Nom de la catégorie (police médiévale)
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#2d1810';
    ctx.font = 'bold 85px Georgia, serif';
    ctx.fillText(subCategory.nom, 950, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const signGeometry = new THREE.PlaneGeometry(4.5 * scale, 1.35 * scale);
    const signMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 5.2 * scale, 0); // Monter l'enseigne au-dessus du toit
    stallGroup.add(sign);

    // Support de l'enseigne (chaînes en fer forgé)
    [-2 * scale, 2 * scale].forEach(x => {
      const chain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02 * scale, 0.02 * scale, 1.2 * scale, 8),
        new THREE.MeshStandardMaterial({
          color: 0x2f2f2f,
          roughness: 0.6,
          metalness: 0.9
        })
      );
      chain.position.set(x, 4.6 * scale, 0);
      chain.castShadow = true;
      stallGroup.add(chain);
    });
  }

  // PRODUITS sur le comptoir - adaptés à la catégorie (3 produits avec prix)
  const productCount = 3;

  // Définir les produits selon la catégorie
  let productShapes: Array<{geometry: THREE.BufferGeometry, color: number}> = [];

  if (subCategory.nom.includes('Boulangerie') || subCategory.emoji === '🥖') {
    // Pains et viennoiseries
    productShapes = [
      { geometry: new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 0.8 * scale, 8), color: 0xdaa520 }, // Baguette
      { geometry: new THREE.SphereGeometry(0.25 * scale, 8, 8), color: 0xc19a6b }, // Pain rond
      { geometry: new THREE.BoxGeometry(0.3 * scale, 0.2 * scale, 0.3 * scale), color: 0xe0b589 }, // Pain de mie
      { geometry: new THREE.TorusGeometry(0.2 * scale, 0.08 * scale, 8, 12), color: 0xf4a460 }, // Couronne
      { geometry: new THREE.ConeGeometry(0.2 * scale, 0.3 * scale, 3), color: 0xd2691e }, // Croissant
      { geometry: new THREE.CylinderGeometry(0.15 * scale, 0.18 * scale, 0.4 * scale, 8), color: 0xcd853f }, // Brioche
    ];
  } else if (subCategory.nom.includes('Fromage') || subCategory.emoji === '🧀') {
    // Fromages
    productShapes = [
      { geometry: new THREE.CylinderGeometry(0.3 * scale, 0.3 * scale, 0.15 * scale, 12), color: 0xfff8dc }, // Camembert
      { geometry: new THREE.BoxGeometry(0.4 * scale, 0.2 * scale, 0.4 * scale), color: 0xffebcd }, // Fromage carré
      { geometry: new THREE.ConeGeometry(0.25 * scale, 0.35 * scale, 8), color: 0xfaf0e6 }, // Pyramide
      { geometry: new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 0.5 * scale, 12), color: 0xfaebd7 }, // Bûche
      { geometry: new THREE.SphereGeometry(0.2 * scale, 8, 8), color: 0xf5f5dc }, // Boule
      { geometry: new THREE.TorusGeometry(0.2 * scale, 0.1 * scale, 8, 12), color: 0xfffacd }, // Couronne
    ];
  } else if (subCategory.nom.includes('Boucherie') || subCategory.nom.includes('Viande') || subCategory.emoji === '🥩') {
    // Viandes
    productShapes = [
      { geometry: new THREE.BoxGeometry(0.4 * scale, 0.15 * scale, 0.3 * scale), color: 0x8b0000 }, // Steak
      { geometry: new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 0.5 * scale, 8), color: 0xa52a2a }, // Saucisson
      { geometry: new THREE.SphereGeometry(0.2 * scale, 8, 8), color: 0xdc143c }, // Viande hachée
      { geometry: new THREE.BoxGeometry(0.35 * scale, 0.2 * scale, 0.25 * scale), color: 0xb22222 }, // Rôti
      { geometry: new THREE.CylinderGeometry(0.15 * scale, 0.15 * scale, 0.6 * scale, 8), color: 0x8b4513 }, // Merguez
      { geometry: new THREE.BoxGeometry(0.3 * scale, 0.25 * scale, 0.3 * scale), color: 0xcd5c5c }, // Pièce de viande
    ];
  } else if (subCategory.nom.includes('Maraîcher') || subCategory.nom.includes('Légumes') || subCategory.emoji === '🥕') {
    // Fruits et légumes
    productShapes = [
      { geometry: new THREE.SphereGeometry(0.2 * scale, 8, 8), color: 0xff6347 }, // Tomate
      { geometry: new THREE.CylinderGeometry(0.1 * scale, 0.15 * scale, 0.5 * scale, 8), color: 0xff8c00 }, // Carotte
      { geometry: new THREE.SphereGeometry(0.25 * scale, 8, 8), color: 0x32cd32 }, // Salade
      { geometry: new THREE.BoxGeometry(0.3 * scale, 0.2 * scale, 0.25 * scale), color: 0x9acd32 }, // Courgette
      { geometry: new THREE.SphereGeometry(0.18 * scale, 8, 8), color: 0xffa500 }, // Orange
      { geometry: new THREE.SphereGeometry(0.22 * scale, 8, 8), color: 0xff0000 }, // Pomme
    ];
  } else if (subCategory.nom.includes('Épicerie') || subCategory.nom.includes('Vin') || subCategory.emoji === '🍷') {
    // Bouteilles et bocaux
    productShapes = [
      { geometry: new THREE.CylinderGeometry(0.12 * scale, 0.12 * scale, 0.8 * scale, 8), color: 0x8b0000 }, // Vin rouge
      { geometry: new THREE.CylinderGeometry(0.12 * scale, 0.12 * scale, 0.8 * scale, 8), color: 0xf5deb3 }, // Vin blanc
      { geometry: new THREE.CylinderGeometry(0.15 * scale, 0.15 * scale, 0.5 * scale, 8), color: 0xdaa520 }, // Huile
      { geometry: new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 0.4 * scale, 8), color: 0xff6347 }, // Confiture
      { geometry: new THREE.CylinderGeometry(0.12 * scale, 0.12 * scale, 0.7 * scale, 8), color: 0x556b2f }, // Huile d'olive
      { geometry: new THREE.CylinderGeometry(0.15 * scale, 0.15 * scale, 0.45 * scale, 8), color: 0xffd700 }, // Miel
    ];
  } else if (subCategory.nom.includes('Produits Transformés') || subCategory.nom.includes('Traiteur') || subCategory.emoji === '🍝') {
    // Pâtes, plats préparés et produits transformés
    productShapes = [
      { geometry: new THREE.CylinderGeometry(0.12 * scale, 0.12 * scale, 0.5 * scale, 8), color: 0xffd700 }, // Paquet de pâtes
      { geometry: new THREE.TorusGeometry(0.2 * scale, 0.06 * scale, 8, 12), color: 0xffe4b5 }, // Pâtes en spirale
      { geometry: new THREE.BoxGeometry(0.35 * scale, 0.15 * scale, 0.35 * scale), color: 0xff8c00 }, // Burger box
      { geometry: new THREE.CylinderGeometry(0.25 * scale, 0.25 * scale, 0.15 * scale, 12), color: 0xdaa520 }, // Pizza
      { geometry: new THREE.BoxGeometry(0.3 * scale, 0.2 * scale, 0.4 * scale), color: 0xf4a460 }, // Plat préparé
      { geometry: new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 0.4 * scale, 8), color: 0xffb347 }, // Bocal conserve
    ];
  } else if (subCategory.nom.includes('Café') || subCategory.nom.includes('Thé') || subCategory.emoji === '☕') {
    // Café, thé, chocolat
    productShapes = [
      { geometry: new THREE.CylinderGeometry(0.15 * scale, 0.15 * scale, 0.5 * scale, 8), color: 0x8b4513 }, // Paquet café
      { geometry: new THREE.BoxGeometry(0.3 * scale, 0.4 * scale, 0.2 * scale), color: 0x654321 }, // Boîte thé
      { geometry: new THREE.BoxGeometry(0.35 * scale, 0.25 * scale, 0.2 * scale), color: 0x3e2723 }, // Tablette chocolat
      { geometry: new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 0.4 * scale, 8), color: 0xa0522d }, // Bocal café
      { geometry: new THREE.BoxGeometry(0.25 * scale, 0.3 * scale, 0.15 * scale), color: 0x4e342e }, // Sachet thé
      { geometry: new THREE.CylinderGeometry(0.12 * scale, 0.12 * scale, 0.6 * scale, 8), color: 0x6f4e37 }, // Pot chocolat
    ];
  } else if (subCategory.nom.includes('Spécialités') || subCategory.nom.includes('Terroir') || subCategory.emoji === '🏔️') {
    // Spécialités régionales (catégorie 152)
    productShapes = [
      { geometry: new THREE.CylinderGeometry(0.18 * scale, 0.18 * scale, 0.4 * scale, 8), color: 0xb8860b }, // Bocal spécialité
      { geometry: new THREE.BoxGeometry(0.3 * scale, 0.25 * scale, 0.25 * scale), color: 0xdaa520 }, // Paquet régional
      { geometry: new THREE.CylinderGeometry(0.15 * scale, 0.15 * scale, 0.5 * scale, 8), color: 0xcd853f }, // Produit de montagne
      { geometry: new THREE.BoxGeometry(0.35 * scale, 0.2 * scale, 0.3 * scale), color: 0xd2691e }, // Spécialité locale
      { geometry: new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 0.35 * scale, 8), color: 0xf4a460 }, // Terroir
      { geometry: new THREE.BoxGeometry(0.25 * scale, 0.3 * scale, 0.25 * scale), color: 0xdeb887 }, // Produit local
    ];
  } else if (subCategory.nom.includes('Poisson') || subCategory.nom.includes('Mer') || subCategory.emoji === '🐟') {
    // Poissonnerie & Produits de la Mer (catégorie 153)
    productShapes = [
      { geometry: new THREE.BoxGeometry(0.5 * scale, 0.15 * scale, 0.25 * scale), color: 0x4682b4 }, // Filet de poisson
      { geometry: new THREE.SphereGeometry(0.18 * scale, 8, 8), color: 0xff6347 }, // Crabe
      { geometry: new THREE.ConeGeometry(0.15 * scale, 0.4 * scale, 8), color: 0xffa07a }, // Coquillage
      { geometry: new THREE.BoxGeometry(0.4 * scale, 0.2 * scale, 0.3 * scale), color: 0x87ceeb }, // Poisson entier
      { geometry: new THREE.CylinderGeometry(0.12 * scale, 0.12 * scale, 0.5 * scale, 8), color: 0xff7f50 }, // Homard
      { geometry: new THREE.SphereGeometry(0.15 * scale, 8, 8), color: 0xf0e68c }, // Huîtres
    ];
  } else if (subCategory.nom.includes('Volaille') || subCategory.nom.includes('Œuf') || subCategory.emoji === '🐓') {
    // Volailles & Œufs (catégorie 154)
    productShapes = [
      { geometry: new THREE.BoxGeometry(0.4 * scale, 0.3 * scale, 0.35 * scale), color: 0xf5deb3 }, // Poulet
      { geometry: new THREE.SphereGeometry(0.15 * scale, 8, 8), color: 0xfaebd7 }, // Œuf
      { geometry: new THREE.BoxGeometry(0.35 * scale, 0.25 * scale, 0.3 * scale), color: 0xdaa520 }, // Canard
      { geometry: new THREE.SphereGeometry(0.12 * scale, 8, 8), color: 0xfff8dc }, // Petit œuf
      { geometry: new THREE.BoxGeometry(0.45 * scale, 0.35 * scale, 0.4 * scale), color: 0xd2b48c }, // Dinde
      { geometry: new THREE.BoxGeometry(0.25 * scale, 0.25 * scale, 0.15 * scale), color: 0xffe4c4 }, // Boîte œufs
    ];
  } else if (subCategory.nom.includes('Pâtisserie') || subCategory.nom.includes('Confiserie') || subCategory.emoji === '🍰') {
    // Pâtisserie & Confiserie (catégorie 155)
    productShapes = [
      { geometry: new THREE.CylinderGeometry(0.25 * scale, 0.25 * scale, 0.3 * scale, 12), color: 0xffb6c1 }, // Gâteau
      { geometry: new THREE.BoxGeometry(0.3 * scale, 0.25 * scale, 0.3 * scale), color: 0xffd700 }, // Tarte
      { geometry: new THREE.SphereGeometry(0.12 * scale, 8, 8), color: 0xff69b4 }, // Bonbon
      { geometry: new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 0.25 * scale, 12), color: 0xffe4e1 }, // Pâtisserie
      { geometry: new THREE.BoxGeometry(0.35 * scale, 0.2 * scale, 0.25 * scale), color: 0xffc0cb }, // Éclair
      { geometry: new THREE.ConeGeometry(0.15 * scale, 0.3 * scale, 8), color: 0xffb3de }, // Cornet
    ];
  } else {
    // Produits génériques pour les autres catégories
    productShapes = [
      { geometry: new THREE.BoxGeometry(0.3 * scale, 0.3 * scale, 0.3 * scale), color: 0xdaa520 },
      { geometry: new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 0.4 * scale, 8), color: 0xff6347 },
      { geometry: new THREE.SphereGeometry(0.2 * scale, 8, 8), color: 0x90ee90 },
      { geometry: new THREE.BoxGeometry(0.25 * scale, 0.35 * scale, 0.25 * scale), color: 0x8b4513 },
      { geometry: new THREE.CylinderGeometry(0.15 * scale, 0.15 * scale, 0.5 * scale, 8), color: 0xffd700 },
      { geometry: new THREE.BoxGeometry(0.35 * scale, 0.25 * scale, 0.3 * scale), color: 0x4682b4 },
    ];
  }

  // Placer les produits sur le comptoir
  for (let i = 0; i < Math.min(productCount, productShapes.length); i++) {
    const { geometry, color } = productShapes[i];
    const productMaterial = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.6,
      metalness: 0.2
    });
    const product = new THREE.Mesh(geometry, productMaterial);

    // Position sur le comptoir - espacés sur toute la largeur
    // Le comptoir fait 2.6 * scale de large, donc on limite à 2.4 * scale pour laisser une marge
    const counterWidth = 2.4 * scale; // Largeur utilisable du comptoir
    const spacing = counterWidth / (productCount + 0.5); // Espacement dynamique basé sur le nombre de produits
    const offsetX = (i - (productCount - 1) / 2) * spacing;

    product.position.set(
      offsetX,
      1.5 * scale, // Légèrement plus haut pour être bien visible
      0.5 * scale  // Un peu plus vers l'avant
    );

    // Orientation des produits selon leur forme
    if (geometry instanceof THREE.CylinderGeometry) {
      // Pour les cylindres (bouteilles, baguettes, saucissons)
      // Les coucher sur le côté sauf pour les bouteilles qui doivent rester debout
      if (subCategory.nom.includes('Épicerie') || subCategory.nom.includes('Vin')) {
        // Bouteilles : rester debout (pas de rotation)
        product.rotation.y = Math.random() * Math.PI * 2;
      } else {
        // Pains, saucissons : coucher sur le côté
        product.rotation.z = Math.PI / 2;
        product.rotation.y = Math.random() * Math.PI * 2;
      }
    } else if (geometry instanceof THREE.TorusGeometry) {
      // Couronnes : à plat sur le comptoir
      product.rotation.x = Math.PI / 2;
    } else if (geometry instanceof THREE.ConeGeometry) {
      // Cônes (croissants, pyramides de fromage) : coucher sur le côté
      product.rotation.z = Math.PI / 2;
      product.rotation.y = Math.random() * Math.PI;
    } else {
      // Cubes et sphères : rotation aléatoire
      product.rotation.y = Math.random() * Math.PI * 2;
    }

    product.castShadow = true;
    product.receiveShadow = true;
    stallGroup.add(product);
  }

  // ========================================
  // PANNEAU DE FERMETURE SI PAS DE PRODUITS
  // ========================================
  // Filtrer les produits de cette sous-catégorie
  const subcategoryProducts = produits.filter(p => {
    // Vérifier si le produit appartient à cette sous-catégorie
    const productCategoryId = p.souscategorie || p.categorie;
    const subcatId = (subCategory as any).pk || (subCategory as any).id;
    return productCategoryId === subcatId;
  });

  console.log(`[Stand ${subCategory.nom}] Produits trouvés: ${subcategoryProducts.length}`);

  // Si aucun produit, ajouter un panneau FERMÉ
  if (subcategoryProducts.length === 0) {
    const closedCanvas = document.createElement('canvas');
    const closedCtx = closedCanvas.getContext('2d');
    if (closedCtx) {
      closedCanvas.width = 1800;
      closedCanvas.height = 1000;

      // Fond en bois sombre (fermé)
      const woodGradient = closedCtx.createLinearGradient(0, 0, 0, closedCanvas.height);
      woodGradient.addColorStop(0, '#3e2f1f');
      woodGradient.addColorStop(0.5, '#2d1810');
      woodGradient.addColorStop(1, '#1a0f0a');
      closedCtx.fillStyle = woodGradient;
      closedCtx.fillRect(0, 0, closedCanvas.width, closedCanvas.height);

      // Texture bois (lignes verticales)
      closedCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      closedCtx.lineWidth = 3;
      for (let i = 0; i < 20; i++) {
        const x = (i / 20) * closedCanvas.width;
        closedCtx.beginPath();
        closedCtx.moveTo(x, 0);
        closedCtx.lineTo(x + Math.random() * 50 - 25, closedCanvas.height);
        closedCtx.stroke();
      }

      // Bordure clouée (style médiéval)
      closedCtx.strokeStyle = '#1a0f0a';
      closedCtx.lineWidth = 20;
      closedCtx.strokeRect(10, 10, closedCanvas.width - 20, closedCanvas.height - 20);

      // Clous décoratifs en fer
      const nailPositions = [
        // Coins
        [50, 50], [closedCanvas.width - 50, 50],
        [50, closedCanvas.height - 50], [closedCanvas.width - 50, closedCanvas.height - 50],
        // Milieux
        [closedCanvas.width / 2, 50], [closedCanvas.width / 2, closedCanvas.height - 50],
        [50, closedCanvas.height / 2], [closedCanvas.width - 50, closedCanvas.height / 2]
      ];

      nailPositions.forEach(([nx, ny]) => {
        // Tête du clou
        closedCtx.fillStyle = '#2f2f2f';
        closedCtx.beginPath();
        closedCtx.arc(nx, ny, 25, 0, Math.PI * 2);
        closedCtx.fill();

        // Reflet du clou
        closedCtx.fillStyle = '#4a4a4a';
        closedCtx.beginPath();
        closedCtx.arc(nx - 5, ny - 5, 8, 0, Math.PI * 2);
        closedCtx.fill();
      });

      // Chaînes en croix (fermé avec cadenas)
      closedCtx.strokeStyle = '#2f2f2f';
      closedCtx.lineWidth = 30;
      closedCtx.lineCap = 'round';

      // Chaîne diagonale 1
      closedCtx.beginPath();
      closedCtx.moveTo(200, 200);
      closedCtx.lineTo(closedCanvas.width - 200, closedCanvas.height - 200);
      closedCtx.stroke();

      // Chaîne diagonale 2
      closedCtx.beginPath();
      closedCtx.moveTo(closedCanvas.width - 200, 200);
      closedCtx.lineTo(200, closedCanvas.height - 200);
      closedCtx.stroke();

      // Maillons de chaîne (détails)
      closedCtx.strokeStyle = '#1a1a1a';
      closedCtx.lineWidth = 25;
      for (let i = 0; i < 8; i++) {
        const t = i / 7;
        const x1 = 200 + (closedCanvas.width - 400) * t;
        const y1 = 200 + (closedCanvas.height - 400) * t;
        closedCtx.beginPath();
        closedCtx.arc(x1, y1, 40, 0, Math.PI * 2);
        closedCtx.stroke();
      }

      // Cadenas au centre
      const lockX = closedCanvas.width / 2;
      const lockY = closedCanvas.height / 2;

      // Corps du cadenas
      closedCtx.fillStyle = '#3a3a3a';
      closedCtx.fillRect(lockX - 100, lockY - 50, 200, 150);

      // Reflet métallique
      const lockGradient = closedCtx.createLinearGradient(lockX - 100, lockY, lockX + 100, lockY);
      lockGradient.addColorStop(0, '#2a2a2a');
      lockGradient.addColorStop(0.5, '#5a5a5a');
      lockGradient.addColorStop(1, '#2a2a2a');
      closedCtx.fillStyle = lockGradient;
      closedCtx.fillRect(lockX - 90, lockY - 40, 180, 130);

      // Anse du cadenas
      closedCtx.strokeStyle = '#3a3a3a';
      closedCtx.lineWidth = 40;
      closedCtx.beginPath();
      closedCtx.arc(lockX, lockY - 80, 80, Math.PI, 0, false);
      closedCtx.stroke();

      // Trou de serrure
      closedCtx.fillStyle = '#1a1a1a';
      closedCtx.beginPath();
      closedCtx.arc(lockX, lockY + 20, 25, 0, Math.PI * 2);
      closedCtx.fill();
      closedCtx.fillRect(lockX - 12, lockY + 20, 24, 50);

      // Texte "FERMÉ" au-dessus
      closedCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      closedCtx.shadowBlur = 15;
      closedCtx.shadowOffsetX = 5;
      closedCtx.shadowOffsetY = 5;
      closedCtx.fillStyle = '#ff4444';
      closedCtx.font = 'bold 180px Georgia, serif';
      closedCtx.textAlign = 'center';
      closedCtx.textBaseline = 'middle';
      closedCtx.fillText('FERMÉ', closedCanvas.width / 2, 150);

      // Sous-texte explicatif
      closedCtx.shadowBlur = 8;
      closedCtx.fillStyle = '#cccccc';
      closedCtx.font = 'italic 60px Georgia, serif';
      closedCtx.fillText('Aucun produit disponible', closedCanvas.width / 2, closedCanvas.height - 120);

      // Créer le mesh du panneau fermé
      const closedTexture = new THREE.CanvasTexture(closedCanvas);
      const closedSignGeometry = new THREE.PlaneGeometry(3.8 * scale, 2.1 * scale);
      const closedSignMaterial = new THREE.MeshStandardMaterial({
        map: closedTexture,
        side: THREE.DoubleSide,
        roughness: 0.9,
        metalness: 0.1
      });
      const closedSign = new THREE.Mesh(closedSignGeometry, closedSignMaterial);

      // Positionner le panneau au centre du stand, devant
      closedSign.position.set(0, 2 * scale, 0.8 * scale);
      closedSign.rotation.y = 0;
      closedSign.castShadow = true;
      closedSign.receiveShadow = true;

      // Marquer comme non cliquable (fermé)
      closedSign.userData = {
        type: 'closed',
        isClickable: false,
        message: 'Ce stand est actuellement fermé - Aucun produit disponible'
      };

      stallGroup.add(closedSign);

      console.log(`  🔒 Panneau FERMÉ ajouté (pas de produits)`);
    }
  }

  // FILTRER LES FOURNISSEURS PAR CATÉGORIE avec produits
  const fournisseursAvecProduitsCategorie = fournisseurs.filter(f => {
    const fournisseurId = (f as any).pk || (f as any).id;
    return produits.some(p => {
      const produitFournisseur = p.fournisseur || p.pk_fournisseur;
      const productCategoryId = p.souscategorie || p.categorie;
      const subcatId = (subCategory as any).pk || (subCategory as any).id;
      return produitFournisseur === fournisseurId && productCategoryId === subcatId;
    });
  });

  console.log(`[Stand ${subCategory.nom}] Fournisseurs avec produits: ${fournisseursAvecProduitsCategorie.length}/${fournisseurs.length}`);

  // PANCARTE DES FOURNISSEURS (style parchemin médiéval amélioré)
  const supplierCanvas = document.createElement('canvas');
  const supplierCtx = supplierCanvas.getContext('2d');
  if (supplierCtx) {
    supplierCanvas.width = 1400;
    supplierCanvas.height = 900;

    // Fond parchemin avec dégradé radial
    const parchmentGradient = supplierCtx.createRadialGradient(
      supplierCanvas.width / 2, supplierCanvas.height / 2, 100,
      supplierCanvas.width / 2, supplierCanvas.height / 2, 800
    );
    parchmentGradient.addColorStop(0, '#f4e8d0');
    parchmentGradient.addColorStop(0.5, '#e8dcc0');
    parchmentGradient.addColorStop(1, '#d4c5a9');
    supplierCtx.fillStyle = parchmentGradient;
    supplierCtx.fillRect(0, 0, supplierCanvas.width, supplierCanvas.height);

    // Effet vieilli (taches aléatoires)
    supplierCtx.fillStyle = 'rgba(139, 90, 43, 0.05)';
    for (let i = 0; i < 20; i++) {
      supplierCtx.beginPath();
      supplierCtx.arc(
        Math.random() * supplierCanvas.width,
        Math.random() * supplierCanvas.height,
        Math.random() * 40 + 10,
        0, Math.PI * 2
      );
      supplierCtx.fill();
    }

    // Bordure double (bois + dorée)
    supplierCtx.strokeStyle = '#5d4e37'; // Bois
    supplierCtx.lineWidth = 10;
    supplierCtx.strokeRect(15, 15, supplierCanvas.width - 30, supplierCanvas.height - 30);

    supplierCtx.strokeStyle = '#b8860b'; // Or
    supplierCtx.lineWidth = 5;
    supplierCtx.strokeRect(25, 25, supplierCanvas.width - 50, supplierCanvas.height - 50);

    // Coins décoratifs (fleurs de lys)
    const corners = [
      [40, 40], [supplierCanvas.width - 40, 40],
      [40, supplierCanvas.height - 40], [supplierCanvas.width - 40, supplierCanvas.height - 40]
    ];
    supplierCtx.fillStyle = '#b8860b';
    corners.forEach(([cx, cy]) => {
      supplierCtx.beginPath();
      supplierCtx.arc(cx, cy, 12, 0, Math.PI * 2);
      supplierCtx.fill();
    });

    // Titre "Fournisseurs" - PLUS GRAND ET LISIBLE
    supplierCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    supplierCtx.shadowBlur = 6;
    supplierCtx.shadowOffsetX = 3;
    supplierCtx.shadowOffsetY = 3;
    supplierCtx.fillStyle = '#1a0f0a';
    supplierCtx.font = 'bold 90px Georgia, serif';
    supplierCtx.textAlign = 'center';
    supplierCtx.textBaseline = 'top';
    supplierCtx.fillText('Fournisseurs', supplierCanvas.width / 2, 70);

    // Liste des fournisseurs (max 3 pour éviter surcharge)
    const maxSuppliers = 3;
    const suppliersList = fournisseursAvecProduitsCategorie.slice(0, maxSuppliers);

    supplierCtx.font = 'bold 60px Georgia, serif'; // TEXTE PLUS GROS
    supplierCtx.shadowBlur = 3;
    supplierCtx.shadowOffsetX = 2;
    supplierCtx.shadowOffsetY = 2;

    let yOffset = 220;
    const lineHeight = 120;

    if (suppliersList.length === 0) {
      supplierCtx.fillStyle = '#666';
      supplierCtx.font = 'italic 50px Georgia, serif';
      supplierCtx.fillText('Aucun fournisseur', supplierCanvas.width / 2, yOffset + 60);
    } else {
      suppliersList.forEach((supplier: Fournisseur) => {
        // Puce décorative PLUS GROSSE
        supplierCtx.fillStyle = '#b8860b';
        supplierCtx.beginPath();
        supplierCtx.arc(140, yOffset + 30, 12, 0, Math.PI * 2);
        supplierCtx.fill();

        // Nom du fournisseur - TEXTE PLUS GROS ET CONTRASTÉ
        supplierCtx.fillStyle = '#1a0f0a'; // Couleur plus foncée pour meilleure lisibilité
        supplierCtx.textAlign = 'left';
        const nomFournisseur = (supplier as any).nom_fournisseur || (supplier as any).nom || 'Fournisseur';
        supplierCtx.fillText(nomFournisseur, 180, yOffset);

        yOffset += lineHeight;
      });

      // Indication s'il y a plus de fournisseurs
      if (fournisseurs.length > maxSuppliers) {
        supplierCtx.fillStyle = '#666';
        supplierCtx.font = 'italic 35px Georgia, serif';
        supplierCtx.textAlign = 'center';
        supplierCtx.fillText(
          `et ${fournisseurs.length - maxSuppliers} autre(s)...`,
          supplierCanvas.width / 2,
          yOffset + 20
        );
      }
    }

    // Créer la texture et le mesh
    const supplierTexture = new THREE.CanvasTexture(supplierCanvas);
    const supplierSignGeometry = new THREE.PlaneGeometry(1.6 * scale, 1.1 * scale); // Plus petit pour le pied
    const supplierSignMaterial = new THREE.MeshStandardMaterial({
      map: supplierTexture,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.1
    });
    const supplierSign = new THREE.Mesh(supplierSignGeometry, supplierSignMaterial);

    // Positionner la pancarte fournisseurs AU PIED du stand (devant)
    supplierSign.position.set(0, 0.6 * scale, 1.3 * scale); // Au pied, devant le stand
    supplierSign.rotation.y = 0; // Face à la caméra
    supplierSign.castShadow = true;
    supplierSign.receiveShadow = true;

    // Rendre la pancarte cliquable
    supplierSign.userData = {
      type: 'suppliers',
      suppliers: fournisseurs,
      isClickable: true
    };

    stallGroup.add(supplierSign);

    // Support en bois pour la pancarte au sol (2 poteaux)
    for (let i = -1; i <= 1; i += 2) {
      const support = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 1.2 * scale, 8),
        new THREE.MeshStandardMaterial({
          color: 0x4a2511, // Bois
          roughness: 0.8
        })
      );
      support.position.set(i * 0.7 * scale, 0.6 * scale, 1.3 * scale);
      support.castShadow = true;
      stallGroup.add(support);
    }
  }

  stallGroup.position.set(x, 0, z);
  stallGroup.rotation.y = rotation;
  stallGroup.name = `CategoryStall_${subCategory.id}_${subCategory.nom}`;

  return stallGroup;
}

// Fonction pour créer une pancarte fournisseurs (réutilisable)
function createSupplierSign(fournisseurs: Fournisseur[], scale: number = 1.8) {
  const supplierCanvas = document.createElement('canvas');
  const supplierCtx = supplierCanvas.getContext('2d');
  if (!supplierCtx) return null;

  supplierCanvas.width = 1200;
  supplierCanvas.height = 800;

  // Fond parchemin avec dégradé radial
  const parchmentGradient = supplierCtx.createRadialGradient(
    supplierCanvas.width / 2, supplierCanvas.height / 2, 100,
    supplierCanvas.width / 2, supplierCanvas.height / 2, 800
  );
  parchmentGradient.addColorStop(0, '#f4e8d0');
  parchmentGradient.addColorStop(0.5, '#e8dcc0');
  parchmentGradient.addColorStop(1, '#d4c5a9');
  supplierCtx.fillStyle = parchmentGradient;
  supplierCtx.fillRect(0, 0, supplierCanvas.width, supplierCanvas.height);

  // Effet vieilli
  supplierCtx.fillStyle = 'rgba(139, 90, 43, 0.05)';
  for (let i = 0; i < 20; i++) {
    supplierCtx.beginPath();
    supplierCtx.arc(
      Math.random() * supplierCanvas.width,
      Math.random() * supplierCanvas.height,
      Math.random() * 40 + 10,
      0, Math.PI * 2
    );
    supplierCtx.fill();
  }

  // Bordure double
  supplierCtx.strokeStyle = '#5d4e37';
  supplierCtx.lineWidth = 10;
  supplierCtx.strokeRect(15, 15, supplierCanvas.width - 30, supplierCanvas.height - 30);
  supplierCtx.strokeStyle = '#b8860b';
  supplierCtx.lineWidth = 5;
  supplierCtx.strokeRect(25, 25, supplierCanvas.width - 50, supplierCanvas.height - 50);

  // Coins décoratifs
  const corners = [
    [40, 40], [supplierCanvas.width - 40, 40],
    [40, supplierCanvas.height - 40], [supplierCanvas.width - 40, supplierCanvas.height - 40]
  ];
  supplierCtx.fillStyle = '#b8860b';
  corners.forEach(([cx, cy]) => {
    supplierCtx.beginPath();
    supplierCtx.arc(cx, cy, 12, 0, Math.PI * 2);
    supplierCtx.fill();
  });

  // Titre "Fournisseurs"
  supplierCtx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  supplierCtx.shadowBlur = 4;
  supplierCtx.shadowOffsetX = 2;
  supplierCtx.shadowOffsetY = 2;
  supplierCtx.fillStyle = '#3e2f1f';
  supplierCtx.font = 'bold 70px Georgia, serif';
  supplierCtx.textAlign = 'center';
  supplierCtx.textBaseline = 'top';
  supplierCtx.fillText('Fournisseurs', supplierCanvas.width / 2, 80);

  // Liste des fournisseurs (max 3)
  const maxSuppliers = 3;
  const suppliersList = fournisseurs.slice(0, maxSuppliers);

  supplierCtx.font = '45px Georgia, serif';
  supplierCtx.shadowBlur = 2;
  supplierCtx.shadowOffsetX = 1;
  supplierCtx.shadowOffsetY = 1;

  let yOffset = 180;
  const lineHeight = 90;

  if (suppliersList.length === 0) {
    supplierCtx.fillStyle = '#666';
    supplierCtx.font = 'italic 40px Georgia, serif';
    supplierCtx.fillText('Aucun fournisseur', supplierCanvas.width / 2, yOffset + 60);
  } else {
    suppliersList.forEach((supplier: Fournisseur) => {
      supplierCtx.fillStyle = '#b8860b';
      supplierCtx.beginPath();
      supplierCtx.arc(120, yOffset + 20, 8, 0, Math.PI * 2);
      supplierCtx.fill();

      supplierCtx.fillStyle = '#3e2f1f';
      supplierCtx.textAlign = 'left';
      const nomFournisseur = (supplier as any).nom_fournisseur || (supplier as any).nom || 'Fournisseur';
      supplierCtx.fillText(nomFournisseur, 150, yOffset);

      yOffset += lineHeight;
    });

    if (fournisseurs.length > maxSuppliers) {
      supplierCtx.fillStyle = '#666';
      supplierCtx.font = 'italic 35px Georgia, serif';
      supplierCtx.textAlign = 'center';
      supplierCtx.fillText(
        `et ${fournisseurs.length - maxSuppliers} autre(s)...`,
        supplierCanvas.width / 2,
        yOffset + 20
      );
    }
  }

  const supplierTexture = new THREE.CanvasTexture(supplierCanvas);
  return supplierTexture;
}

// Fonction utilitaire pour créer un panneau FERMÉ
function createClosedSign(scale: number = 1.8): THREE.Mesh {
  const closedCanvas = document.createElement('canvas');
  const closedCtx = closedCanvas.getContext('2d');

  if (!closedCtx) {
    throw new Error('Cannot create canvas context');
  }

  closedCanvas.width = 1800;
  closedCanvas.height = 1000;

  // Fond en bois sombre (fermé)
  const woodGradient = closedCtx.createLinearGradient(0, 0, 0, closedCanvas.height);
  woodGradient.addColorStop(0, '#3e2f1f');
  woodGradient.addColorStop(0.5, '#2d1810');
  woodGradient.addColorStop(1, '#1a0f0a');
  closedCtx.fillStyle = woodGradient;
  closedCtx.fillRect(0, 0, closedCanvas.width, closedCanvas.height);

  // Texture bois (lignes verticales)
  closedCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  closedCtx.lineWidth = 3;
  for (let i = 0; i < 20; i++) {
    const x = (i / 20) * closedCanvas.width;
    closedCtx.beginPath();
    closedCtx.moveTo(x, 0);
    closedCtx.lineTo(x + Math.random() * 50 - 25, closedCanvas.height);
    closedCtx.stroke();
  }

  // Bordure clouée (style médiéval)
  closedCtx.strokeStyle = '#1a0f0a';
  closedCtx.lineWidth = 20;
  closedCtx.strokeRect(10, 10, closedCanvas.width - 20, closedCanvas.height - 20);

  // Clous décoratifs en fer
  const nailPositions = [
    [50, 50], [closedCanvas.width - 50, 50],
    [50, closedCanvas.height - 50], [closedCanvas.width - 50, closedCanvas.height - 50],
    [closedCanvas.width / 2, 50], [closedCanvas.width / 2, closedCanvas.height - 50],
    [50, closedCanvas.height / 2], [closedCanvas.width - 50, closedCanvas.height / 2]
  ];

  nailPositions.forEach(([nx, ny]) => {
    closedCtx.fillStyle = '#2f2f2f';
    closedCtx.beginPath();
    closedCtx.arc(nx, ny, 25, 0, Math.PI * 2);
    closedCtx.fill();

    closedCtx.fillStyle = '#4a4a4a';
    closedCtx.beginPath();
    closedCtx.arc(nx - 5, ny - 5, 8, 0, Math.PI * 2);
    closedCtx.fill();
  });

  // Chaînes en croix
  closedCtx.strokeStyle = '#2f2f2f';
  closedCtx.lineWidth = 30;
  closedCtx.lineCap = 'round';
  closedCtx.beginPath();
  closedCtx.moveTo(200, 200);
  closedCtx.lineTo(closedCanvas.width - 200, closedCanvas.height - 200);
  closedCtx.stroke();
  closedCtx.beginPath();
  closedCtx.moveTo(closedCanvas.width - 200, 200);
  closedCtx.lineTo(200, closedCanvas.height - 200);
  closedCtx.stroke();

  // Cadenas au centre
  const lockX = closedCanvas.width / 2;
  const lockY = closedCanvas.height / 2;

  closedCtx.fillStyle = '#3a3a3a';
  closedCtx.fillRect(lockX - 100, lockY - 50, 200, 150);

  const lockGradient = closedCtx.createLinearGradient(lockX - 100, lockY, lockX + 100, lockY);
  lockGradient.addColorStop(0, '#2a2a2a');
  lockGradient.addColorStop(0.5, '#5a5a5a');
  lockGradient.addColorStop(1, '#2a2a2a');
  closedCtx.fillStyle = lockGradient;
  closedCtx.fillRect(lockX - 90, lockY - 40, 180, 130);

  closedCtx.strokeStyle = '#3a3a3a';
  closedCtx.lineWidth = 40;
  closedCtx.beginPath();
  closedCtx.arc(lockX, lockY - 80, 80, Math.PI, 0, false);
  closedCtx.stroke();

  closedCtx.fillStyle = '#1a1a1a';
  closedCtx.beginPath();
  closedCtx.arc(lockX, lockY + 20, 25, 0, Math.PI * 2);
  closedCtx.fill();
  closedCtx.fillRect(lockX - 12, lockY + 20, 24, 50);

  // Texte "FERMÉ"
  closedCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  closedCtx.shadowBlur = 15;
  closedCtx.shadowOffsetX = 5;
  closedCtx.shadowOffsetY = 5;
  closedCtx.fillStyle = '#ff4444';
  closedCtx.font = 'bold 180px Georgia, serif';
  closedCtx.textAlign = 'center';
  closedCtx.textBaseline = 'middle';
  closedCtx.fillText('FERMÉ', closedCanvas.width / 2, 150);

  // Sous-texte
  closedCtx.shadowBlur = 8;
  closedCtx.fillStyle = '#cccccc';
  closedCtx.font = 'italic 60px Georgia, serif';
  closedCtx.fillText('Aucun produit disponible', closedCanvas.width / 2, closedCanvas.height - 120);

  // Créer le mesh
  const closedTexture = new THREE.CanvasTexture(closedCanvas);
  const closedSignGeometry = new THREE.PlaneGeometry(3.8 * scale, 2.1 * scale);
  const closedSignMaterial = new THREE.MeshStandardMaterial({
    map: closedTexture,
    side: THREE.DoubleSide,
    roughness: 0.9,
    metalness: 0.1
  });
  const closedSign = new THREE.Mesh(closedSignGeometry, closedSignMaterial);

  closedSign.position.set(0, 2 * scale, 0.8 * scale);
  closedSign.rotation.y = 0;
  closedSign.castShadow = true;
  closedSign.receiveShadow = true;

  closedSign.userData = {
    type: 'closed',
    isClickable: false,
    message: 'Ce stand est actuellement fermé - Aucun produit disponible'
  };

  return closedSign;
}

// Fonction pour créer un atelier de charpentier AMÉLIORÉ
function createCarpenterWorkshop(x: number, z: number, rotation: number, category: any, fournisseurs: Fournisseur[] = [], produits: Produit[] = []) {
  const building = new THREE.Group();
  const scale = 1.6;

  const woodColor = 0x8b4513;
  const roofColor = 0x654321;

  // Charger les textures
  const textureLoader = new THREE.TextureLoader();
  const pierreTexture = textureLoader.load('/textures/pierre.jpg');
  pierreTexture.wrapS = pierreTexture.wrapT = THREE.RepeatWrapping;
  pierreTexture.repeat.set(2, 2);
  const drapeauTexture = textureLoader.load('/textures/drapeaux.jpg');

  // Murs du bâtiment PLUS GRANDS avec texture pierre
  const wallGeometry = new THREE.BoxGeometry(5 * scale, 4 * scale, 4.5 * scale);
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: pierreTexture,
    color: 0xaaaaaa, // Teinte neutre pour la texture
    roughness: 0.9,
    metalness: 0.1
  });
  const walls = new THREE.Mesh(wallGeometry, wallMaterial);
  walls.position.set(0, 2 * scale, 0);
  walls.castShadow = true;
  walls.receiveShadow = true;
  building.add(walls);

  // Toit à deux pentes
  const roofGeometry = new THREE.ConeGeometry(3.6 * scale, 2 * scale, 4);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: roofColor,
    roughness: 0.9
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 5 * scale, 0);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  building.add(roof);

  // Porte PLUS GRANDE
  const doorGeometry = new THREE.BoxGeometry(1.2 * scale, 2.4 * scale, 0.2);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a2511,
    roughness: 0.7
  });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 1.2 * scale, 2.25 * scale);
  door.castShadow = true;
  building.add(door);

  // Fenêtres PLUS GRANDES
  const windowGeometry = new THREE.BoxGeometry(1 * scale, 1 * scale, 0.15);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x87ceeb,
    roughness: 0.3,
    metalness: 0.5
  });
  [-1.6 * scale, 1.6 * scale].forEach(px => {
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(px, 2.4 * scale, 2.25 * scale);
    building.add(window);
  });

  // Enseigne PLUS GRANDE
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    canvas.width = 1536;
    canvas.height = 384;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f5f5f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    ctx.font = 'bold 160px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(category.emoji, 220, canvas.height / 2);

    ctx.fillStyle = '#2d1810';
    ctx.font = 'bold 72px Arial';
    ctx.fillText(category.nom, 900, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const signGeometry = new THREE.PlaneGeometry(5 * scale, 1.2 * scale);
    const signMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 5.2 * scale, 2.3 * scale);
    building.add(sign);
  }

  // Vérifier s'il y a des produits pour ce bâtiment
  const buildingProducts = produits.filter(p => {
    const productCategoryId = p.souscategorie || p.categorie;
    const categoryId = (category as any).pk || (category as any).id;
    return productCategoryId === categoryId;
  });

  console.log(`[Atelier ${category.nom}] Produits trouvés: ${buildingProducts.length}`);

  // Si aucun produit, afficher panneau FERMÉ
  if (buildingProducts.length === 0) {
    const closedSign = createClosedSign(scale);
    closedSign.position.set(0, 2.5 * scale, 2.3 * scale);
    building.add(closedSign);
    console.log(`  🔒 Panneau FERMÉ ajouté sur l'atelier`);
  }

  // Filtrer les fournisseurs qui ont des produits dans cette catégorie
  const fournisseursAvecProduits = fournisseurs.filter(f => {
    const fournisseurId = (f as any).pk || (f as any).id;
    return produits.some(p => {
      const produitFournisseur = p.fournisseur || p.pk_fournisseur;
      const productCategoryId = p.souscategorie || p.categorie;
      const categoryId = (category as any).pk || (category as any).id;
      return produitFournisseur === fournisseurId && productCategoryId === categoryId;
    });
  });

  console.log(`[Atelier ${category.nom}] Fournisseurs avec produits: ${fournisseursAvecProduits.length}/${fournisseurs.length}`);

  // PANCARTE FOURNISSEURS AU PIED du bâtiment (uniquement ceux avec produits)
  const supplierTexture = createSupplierSign(fournisseursAvecProduits, scale);
  if (supplierTexture && fournisseursAvecProduits.length > 0) {
    const supplierSignGeometry = new THREE.PlaneGeometry(1.6 * scale, 1.1 * scale);
    const supplierSignMaterial = new THREE.MeshStandardMaterial({
      map: supplierTexture,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.1
    });
    const supplierSign = new THREE.Mesh(supplierSignGeometry, supplierSignMaterial);
    supplierSign.position.set(0, 0.6 * scale, 2.8 * scale); // Devant le bâtiment
    supplierSign.rotation.y = 0;
    supplierSign.castShadow = true;
    supplierSign.receiveShadow = true;

    // Rendre cliquable
    supplierSign.userData = {
      type: 'suppliers',
      suppliers: fournisseursAvecProduits,
      isClickable: true
    };

    building.add(supplierSign);

    // Supports en bois
    for (let i = -1; i <= 1; i += 2) {
      const support = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 1.2 * scale, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a2511, roughness: 0.8 })
      );
      support.position.set(i * 0.7 * scale, 0.6 * scale, 2.8 * scale);
      support.castShadow = true;
      building.add(support);
    }
  }

  // DRAPEAUX sur le toit avec texture
  // Mât principal au sommet
  const poleGeometry = new THREE.CylinderGeometry(0.05 * scale, 0.05 * scale, 2.5 * scale, 8);
  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a2511,
    roughness: 0.8
  });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(0, 6.5 * scale, 0);
  pole.castShadow = true;
  building.add(pole);

  // Drapeau avec texture
  const flagGeometry = new THREE.PlaneGeometry(1.2 * scale, 0.8 * scale);
  const flagMaterial = new THREE.MeshStandardMaterial({
    map: drapeauTexture,
    side: THREE.DoubleSide,
    transparent: true
  });
  const flag = new THREE.Mesh(flagGeometry, flagMaterial);
  flag.position.set(0.6 * scale, 7.3 * scale, 0);
  flag.castShadow = true;
  building.add(flag);

  building.position.set(x, 0, z);
  building.rotation.y = rotation;
  building.name = `CarpenterWorkshop_${category.id}`;

  return building;
}

// Fonction pour créer un atelier de tailleur de pierre
function createStoneCutterWorkshop(x: number, z: number, rotation: number, category: any) {
  const building = new THREE.Group();

  const stoneColor = 0x808080;
  const roofColor = 0x505050;

  // Murs en pierre
  const wallGeometry = new THREE.BoxGeometry(4.5, 3.5, 4);
  const wallMaterial = new THREE.MeshStandardMaterial({ color: stoneColor, roughness: 0.9 });
  const walls = new THREE.Mesh(wallGeometry, wallMaterial);
  walls.position.set(0, 1.75, 0);
  walls.castShadow = true;
  walls.receiveShadow = true;
  building.add(walls);

  // Toit plat en pierre
  const roofGeometry = new THREE.BoxGeometry(5, 0.3, 4.5);
  const roofMaterial = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.9 });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 3.65, 0);
  roof.castShadow = true;
  building.add(roof);

  // Porte en arc
  const doorGeometry = new THREE.BoxGeometry(1, 2, 0.15);
  const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.7 });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 1, 2);
  door.castShadow = true;
  building.add(door);

  // Blocs de pierre devant l'atelier
  for (let i = 0; i < 3; i++) {
    const blockGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a0a0, roughness: 0.9 });
    const block = new THREE.Mesh(blockGeometry, blockMaterial);
    block.position.set((i - 1) * 1.2, 0.3, 2.8);
    block.castShadow = true;
    building.add(block);
  }

  // Enseigne
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    canvas.width = 1024;
    canvas.height = 256;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 100px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(category.emoji, 150, canvas.height / 2);
    ctx.fillStyle = '#2d1810';
    ctx.font = 'bold 45px Arial';
    ctx.fillText(category.nom, 600, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const signGeometry = new THREE.PlaneGeometry(4, 1);
    const signMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 4.2, 2.2);
    building.add(sign);
  }

  building.position.set(x, 0, z);
  building.rotation.y = rotation;
  building.name = `StoneCutterWorkshop_${category.id}`;

  return building;
}

// Fonction pour créer une forge AMÉLIORÉE
function createForgeBuilding(x: number, z: number, rotation: number, category: any, fournisseurs: Fournisseur[] = [], produits: Produit[] = []) {
  const building = new THREE.Group();
  const scale = 1.6;

  const brickColor = 0x8b0000;
  const metalColor = 0x2f4f4f;

  // Charger la texture pierre
  const textureLoader = new THREE.TextureLoader();
  const pierreTexture = textureLoader.load('/textures/pierre.jpg');
  pierreTexture.wrapS = pierreTexture.wrapT = THREE.RepeatWrapping;
  pierreTexture.repeat.set(2, 2);

  // Murs en pierre PLUS GRANDS avec texture
  const wallGeometry = new THREE.BoxGeometry(5 * scale, 4.2 * scale, 4.5 * scale);
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: pierreTexture,
    color: 0x886666, // Teinte rougeâtre pour la forge
    roughness: 0.9
  });
  const walls = new THREE.Mesh(wallGeometry, wallMaterial);
  walls.position.set(0, 2.1 * scale, 0);
  walls.castShadow = true;
  walls.receiveShadow = true;
  building.add(walls);

  // Toit en métal PLUS GRAND
  const roofGeometry = new THREE.BoxGeometry(5.6 * scale, 0.25 * scale, 5 * scale);
  const roofMaterial = new THREE.MeshStandardMaterial({
    color: metalColor,
    roughness: 0.5,
    metalness: 0.7
  });
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(0, 4.3 * scale, 0);
  roof.castShadow = true;
  building.add(roof);

  // Cheminée fumante PLUS GRANDE
  const chimneyGeometry = new THREE.CylinderGeometry(0.4 * scale, 0.4 * scale, 2.4 * scale, 12);
  const chimneyMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
    roughness: 0.9
  });
  const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
  chimney.position.set(1.5 * scale, 5.6 * scale, 0);
  chimney.castShadow = true;
  building.add(chimney);

  // Porte en métal PLUS GRANDE
  const doorGeometry = new THREE.BoxGeometry(1.2 * scale, 2.4 * scale, 0.2);
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: metalColor,
    roughness: 0.4,
    metalness: 0.8
  });
  const door = new THREE.Mesh(doorGeometry, doorMaterial);
  door.position.set(0, 1.2 * scale, 2.25 * scale);
  door.castShadow = true;
  building.add(door);

  // Enclume devant la forge PLUS GRANDE
  const anvilBaseGeometry = new THREE.BoxGeometry(0.6 * scale, 0.4 * scale, 0.6 * scale);
  const anvilMaterial = new THREE.MeshStandardMaterial({
    color: 0x2f4f4f,
    roughness: 0.3,
    metalness: 0.9
  });
  const anvilBase = new THREE.Mesh(anvilBaseGeometry, anvilMaterial);
  anvilBase.position.set(-2 * scale, 0.2 * scale, 3.2 * scale);
  anvilBase.castShadow = true;
  building.add(anvilBase);

  const anvilTopGeometry = new THREE.BoxGeometry(0.8 * scale, 0.3 * scale, 0.4 * scale);
  const anvilTop = new THREE.Mesh(anvilTopGeometry, anvilMaterial);
  anvilTop.position.set(-2 * scale, 0.55 * scale, 3.2 * scale);
  anvilTop.castShadow = true;
  building.add(anvilTop);

  // Enseigne PLUS GRANDE
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    canvas.width = 1536;
    canvas.height = 384;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f5f5f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#8b0000';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    ctx.font = 'bold 160px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(category.emoji, 220, canvas.height / 2);

    ctx.fillStyle = '#2d1810';
    ctx.font = 'bold 72px Arial';
    ctx.fillText(category.nom, 900, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const signGeometry = new THREE.PlaneGeometry(5 * scale, 1.2 * scale);
    const signMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, 5 * scale, 2.3 * scale);
    building.add(sign);
  }

  // Vérifier s'il y a des produits pour ce bâtiment
  const forgeProducts = produits.filter(p => {
    const productCategoryId = p.souscategorie || p.categorie;
    const categoryId = (category as any).pk || (category as any).id;
    return productCategoryId === categoryId;
  });

  console.log(`[Forge ${category.nom}] Produits trouvés: ${forgeProducts.length}`);

  // Si aucun produit, afficher panneau FERMÉ
  if (forgeProducts.length === 0) {
    const closedSign = createClosedSign(scale);
    closedSign.position.set(0, 2.5 * scale, 2.3 * scale);
    building.add(closedSign);
    console.log(`  🔒 Panneau FERMÉ ajouté sur la forge`);
  }

  // Filtrer les fournisseurs qui ont des produits dans cette catégorie
  const forgeFournisseursAvecProduits = fournisseurs.filter(f => {
    const fournisseurId = (f as any).pk || (f as any).id;
    return produits.some(p => {
      const produitFournisseur = p.fournisseur || p.pk_fournisseur;
      const productCategoryId = p.souscategorie || p.categorie;
      const categoryId = (category as any).pk || (category as any).id;
      return produitFournisseur === fournisseurId && productCategoryId === categoryId;
    });
  });

  console.log(`[Forge ${category.nom}] Fournisseurs avec produits: ${forgeFournisseursAvecProduits.length}/${fournisseurs.length}`);

  // PANCARTE FOURNISSEURS AU PIED du bâtiment (uniquement ceux avec produits)
  const supplierTexture = createSupplierSign(forgeFournisseursAvecProduits, scale);
  if (supplierTexture && forgeFournisseursAvecProduits.length > 0) {
    const supplierSignGeometry = new THREE.PlaneGeometry(1.6 * scale, 1.1 * scale);
    const supplierSignMaterial = new THREE.MeshStandardMaterial({
      map: supplierTexture,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.1
    });
    const supplierSign = new THREE.Mesh(supplierSignGeometry, supplierSignMaterial);
    supplierSign.position.set(0, 0.6 * scale, 2.8 * scale); // Devant le bâtiment
    supplierSign.rotation.y = 0;
    supplierSign.castShadow = true;
    supplierSign.receiveShadow = true;

    // Rendre cliquable
    supplierSign.userData = {
      type: 'suppliers',
      suppliers: forgeFournisseursAvecProduits,
      isClickable: true
    };

    building.add(supplierSign);

    // Supports en métal (pour la forge)
    for (let i = -1; i <= 1; i += 2) {
      const support = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 1.2 * scale, 8),
        new THREE.MeshStandardMaterial({
          color: metalColor,
          roughness: 0.4,
          metalness: 0.9
        })
      );
      support.position.set(i * 0.7 * scale, 0.6 * scale, 2.8 * scale);
      support.castShadow = true;
      building.add(support);
    }
  }

  // DRAPEAUX sur le toit avec texture (2 drapeaux de chaque côté)
  const drapeauTexture = textureLoader.load('/textures/drapeaux.jpg');

  for (let i = -1; i <= 1; i += 2) {
    // Mât en métal
    const poleGeometry = new THREE.CylinderGeometry(0.05 * scale, 0.05 * scale, 2.2 * scale, 8);
    const poleMaterial = new THREE.MeshStandardMaterial({
      color: metalColor,
      roughness: 0.4,
      metalness: 0.9
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(i * 2.5 * scale, 5.5 * scale, 0);
    pole.castShadow = true;
    building.add(pole);

    // Drapeau avec texture
    const flagGeometry = new THREE.PlaneGeometry(1.1 * scale, 0.7 * scale);
    const flagMaterial = new THREE.MeshStandardMaterial({
      map: drapeauTexture,
      side: THREE.DoubleSide,
      transparent: true
    });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(i * 2.5 * scale + (i * 0.55 * scale), 6.2 * scale, 0);
    flag.castShadow = true;
    building.add(flag);
  }

  building.position.set(x, 0, z);
  building.rotation.y = rotation;
  building.name = `Forge_${category.id}`;

  return building;
}

// Fonction pour créer une organisation logique du village
export function createCategoryStalls(
  scene: THREE.Scene,
  categoriesAPI: any[] = [],
  fournisseurs: Fournisseur[] = [],
  produits: Produit[] = []
) {
  console.log('[Village3D] 🏘️ Création du village thématique');

  // Utiliser les catégories de l'API si disponibles, sinon fallback sur villageConfig
  const useAPICategories = categoriesAPI.length > 0;
  console.log('[Village3D] Source des catégories:', useAPICategories ? 'API' : 'villageConfig');

  // Convertir les catégories API au format attendu
  const categories = useAPICategories
    ? categoriesAPI.map((cat, index) => {
        const converted = {
          id: cat.pk,
          nom: cat.nom,
          emoji: cat.icone || '📦',
          description: cat.description || '',
          position: [0, 0, 0] as [number, number, number],
          sousCategories: (cat.souscategories || []).map((subcat: any) => ({
            id: subcat.pk,
            nom: subcat.nom,
            emoji: subcat.icone || '📁',
            description: subcat.description || '',
            categorieId: cat.pk
          }))
        };

        if (index === 0) {
          console.log('[objects.ts] Première catégorie convertie:', converted);
          console.log('[objects.ts] Nombre de sous-catégories:', converted.sousCategories.length);
          console.log('[objects.ts] Première sous-catégorie:', converted.sousCategories[0]);
        }

        return converted;
      })
    : VILLAGE_CATEGORIES;

  // Organisation en cercle 360° autour de la caméra
  // Ordre logique : alimentation devant, puis sens horaire
  const orderedCategories = [
    // 🍽️ ZONE ALIMENTATION (NORD - Devant) - 11 stands
    ...categories.filter(c => c.nom.includes('Boulangerie')), // 🥖 Pain (145)
    ...categories.filter(c => c.nom.includes('Maraîcher')), // 🥕 Légumes (148)
    ...categories.filter(c => c.nom.includes('Boucherie')), // 🥩 Viandes (147)
    ...categories.filter(c => c.nom.includes('Fromagerie')), // 🧀 Fromage (146)
    ...categories.filter(c => c.nom.includes('Produits Transformés')), // 🍝 Pâtes & Plats (151)
    ...categories.filter(c => c.nom.includes('Épicerie')), // 🍷 Vins (149)
    ...categories.filter(c => c.nom.includes('Café')), // ☕ Boissons (150)
    ...categories.filter(c => c.nom.includes('Spécialités')), // 🏔️ Spécialités régionales (152)
    ...categories.filter(c => c.nom.includes('Poissonnerie')), // 🐟 Poissons (153)
    ...categories.filter(c => c.nom.includes('Volailles')), // 🐓 Volailles & Œufs (154)
    ...categories.filter(c => c.nom.includes('Pâtisserie') && c.nom.includes('Confiserie')), // 🍰 Pâtisserie (155)

    // 🏡 ZONE HABITAT (NORD-EST) - 2 stands
    ...categories.filter(c => c.nom.includes('Habitat') && !c.nom.includes('Autonomie')),
    ...categories.filter(c => c.nom.includes('Eau')),

    // 🏗️ ZONE CONSTRUCTION (EST) - 2 stands
    ...categories.filter(c => c.nom.includes('Matériaux')),
    ...categories.filter(c => c.nom.includes('Énergie')),

    // 🎨 ZONE ARTISANAT (SUD-EST) - 2 stands
    ...categories.filter(c => c.nom.includes('Artisanat Local')),
    ...categories.filter(c => c.nom.includes('Art de Vivre')),

    // 🌱 ZONE NATURE (SUD) - 2 stands
    ...categories.filter(c => c.nom.includes('Autonomie Alimentaire')),
    ...categories.filter(c => c.nom.includes('Plantes')),

    // 🌍 ZONE EXPÉRIENCE (OUEST) - 1 stand
    ...categories.filter(c => c.nom.includes('Expérience')),
  ];

  // Couleurs par type de catégorie
  const categoryColors: { [key: string]: number } = {
    'Boulangerie': 0xdaa520, // Or
    'Fromagerie': 0xffd700, // Or clair
    'Boucherie': 0xff6347, // Rouge
    'Maraîcher': 0x90ee90, // Vert clair
    'Épicerie': 0x722f37, // Bordeaux
    'Café': 0x8b4513, // Brun
    'Produits Transformés': 0xffb347, // Orange clair (pâtes/plats préparés)
    'Spécialités': 0xcd853f, // Peru (spécialités régionales)
    'Poissonnerie': 0x4682b4, // Bleu acier (poissons et fruits de mer)
    'Volailles': 0xf5deb3, // Wheat (volailles et œufs)
    'Pâtisserie': 0xffb6c1, // Rose clair (pâtisserie et confiserie)
    'Habitat': 0x4a90e2, // Bleu
    'Eau': 0x87ceeb, // Bleu ciel
    'Autonomie': 0x2d5016, // Vert foncé
    'Plantes': 0x228b22, // Vert forêt
    'Matériaux': 0x8b7355, // Brun pierre
    'Énergie': 0xffa500, // Orange
    'Artisanat': 0x9b59b6, // Violet
    'Art de Vivre': 0xdda0dd, // Violet clair
    'Expérience': 0x48d1cc, // Turquoise
  };

  let totalStands = 0;
  const radius = 22; // Rayon agrandi pour mieux voir les stands et leurs produits
  const totalCategories = orderedCategories.length;

  // Créer les stands en cercle
  orderedCategories.forEach((category, index) => {
    // Calculer l'angle pour ce stand (répartition uniforme)
    // Commencer à -90° (devant = nord) et aller dans le sens horaire
    const angle = (index / totalCategories) * Math.PI * 2 - Math.PI / 2;

    // Position sur le cercle
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Rotation pour que le stand fasse face au centre (0, 0)
    // On calcule l'angle du vecteur qui pointe vers le centre
    const rotation = Math.atan2(-x, -z);

    // Déterminer la couleur selon le type de catégorie
    let color = 0x8b4513; // Couleur par défaut
    for (const [key, value] of Object.entries(categoryColors)) {
      if (category.nom.includes(key)) {
        color = value;
        break;
      }
    }

    console.log(`${index + 1}/${totalCategories}: ${category.emoji} ${category.nom} - Position: (${x.toFixed(1)}, ${z.toFixed(1)})`);

    try {
      let buildingGroup: THREE.Group;

      // Bâtiments spécialisés selon la catégorie
      if (category.nom.includes('Matériaux') || category.emoji === '🌳') {
        buildingGroup = createCarpenterWorkshop(x, z, rotation, category, fournisseurs, produits);
        console.log(`  🏗️ Atelier de charpentier`);
      } else if (category.nom.includes('Énergie') || category.emoji === '⚡') {
        buildingGroup = createForgeBuilding(x, z, rotation, category, fournisseurs, produits);
        console.log(`  🔥 Forge`);
      } else {
        buildingGroup = createSubCategoryStall(x, z, rotation, category, color, fournisseurs, produits);
      }

      // userData avec la catégorie complète
      const userData = {
        categoryId: category.id,
        category: category,
        type: 'category',
        isClickable: true,
        angle: angle
      };

      // Appliquer userData au groupe parent
      Object.assign(buildingGroup.userData, userData);

      // Propager aux enfants SANS écraser les userData spécifiques existants
      buildingGroup.traverse((child) => {
        if (child !== buildingGroup) {
          // Ne pas écraser si l'enfant a déjà un type spécifique (comme 'suppliers')
          if (!child.userData.type || child.userData.type === 'category') {
            Object.assign(child.userData, userData);
          } else {
            // Garder le type existant mais ajouter les autres propriétés
            const childType = child.userData.type;
            const childSuppliers = child.userData.suppliers;
            const childIsClickable = child.userData.isClickable;
            Object.assign(child.userData, userData);
            // Restaurer les propriétés spécifiques
            child.userData.type = childType;
            if (childSuppliers) child.userData.suppliers = childSuppliers;
            if (childIsClickable !== undefined) child.userData.isClickable = childIsClickable;
          }
        }
      });

      scene.add(buildingGroup);
      totalStands++;

      console.log(`  ✅ Stand ${index + 1} créé`);
    } catch (error) {
      console.error(`  ❌ Erreur pour ${category.nom}:`, error);
    }
  });

  console.log(`\n[Village3D] ✅ ${totalStands} stands créés en cercle (360°)`);
}

export async function placeObjects(
  scene: THREE.Scene,
  textures: { texPave: THREE.Texture },
  fournisseurs: Fournisseur[] = [],
  produits: Produit[] = [],
  categoriesAPI: any[] = [] // Catégories chargées depuis l'API
) {
  console.log('[placeObjects] 🔍 REÇU:');
  console.log('[placeObjects] - fournisseurs.length:', fournisseurs.length);
  console.log('[placeObjects] - produits.length:', produits.length);
  console.log('[placeObjects] - categoriesAPI.length:', categoriesAPI.length);
  console.log('[placeObjects] - categoriesAPI:', categoriesAPI);
  if (categoriesAPI.length > 0) {
    console.log('[placeObjects] - Première catégorie:', categoriesAPI[0]);
    console.log('[placeObjects] - Sous-catégories:', categoriesAPI[0].souscategories);
  }

  // Créer le sol
  createGround(scene, textures.texPave);

  // Créer les stands de catégories avec les données de l'API si disponibles
  createCategoryStalls(scene, categoriesAPI, fournisseurs, produits);

  // Charger l'église au fond du cercle (position 12h - derrière)
  try {
    const egliseRadius = 35; // Plus loin que les stands
    const egliseModel = await loadGLBModel(
      scene,
      '/models/eglise.glb',
      { x: 0, y: 0, z: -egliseRadius }, // Position devant (Nord)
      1.2, // Légèrement plus grande
      Math.PI, // Rotation de 180° pour que l'église fasse face au centre
      { nom: 'Église', isClickable: false, type: 'decoration' } // Marquer comme non-cliquable
    );

    // Propager le userData à tous les enfants de l'église pour éviter les clics
    egliseModel.traverse((child) => {
      Object.assign(child.userData, { isClickable: false, type: 'decoration', nom: 'Église' });
    });

    console.log('[Village3D] ✅ Église positionnée au nord du cercle (non-cliquable)');
  } catch (error) {
    console.error('Erreur lors du chargement de l\'église:', error);
  }

  // Maisons supprimées pour l'instant (focus sur les stands)

  // NE PLUS CRÉER les anciens stands de fournisseurs
  // On garde uniquement les stands de catégories
  console.log('[Village3D] Stands de catégories créés, anciens stands ignorés');

  // Créer les champs autour du village
  createWheatField(scene, -80, -40, 40, 30);
  createWheatField(scene, -80, 20, 40, 35);
  createSunflowerField(scene, 80, -35, 35, 30);
  createSunflowerField(scene, 80, 15, 35, 30);
  createVineyard(scene, -50, 60, 30, 25);
  createVineyard(scene, 0, 65, 35, 25);
  createVineyard(scene, 50, 60, 30, 25);
  createWheatField(scene, 0, -90, 50, 30);
  createSunflowerField(scene, -70, -85, 30, 25);
  createVineyard(scene, 70, -85, 30, 25);

  console.log('[Village3D] Tous les objets ont été placés');
}
