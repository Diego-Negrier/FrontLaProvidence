import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VILLAGE_SHOPS } from '../../config/villageConfig';
import type { Fournisseur, Produit } from '../../services/types';
import type { Shop } from '../../types/village';

// Fonction pour créer un stand manuel procédural
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
  metadata?: { shopId?: number; fournisseurId?: number; nom?: string }
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

export async function placeObjects(
  scene: THREE.Scene,
  textures: { texPave: THREE.Texture },
  fournisseurs: Fournisseur[] = [],
  produits: Produit[] = []
) {
  console.log('[Village3D] Placement des objets avec', fournisseurs.length, 'fournisseurs et', produits.length, 'produits');

  // Créer le sol
  createGround(scene, textures.texPave);

  // Charger l'église
  try {
    await loadGLBModel(
      scene,
      '/models/eglise.glb',
      { x: 0, y: 0, z: -40 },
      1,
      0
    );
  } catch (error) {
    console.error('Erreur lors du chargement de l\'église:', error);
  }

  // Charger les maisons
  const maisonPositions = [
    { x: -22, z: -10, rotation: 0 },
    { x: 22, z: -10, rotation: Math.PI },
    { x: -26, z: 12, rotation: Math.PI / 4 },
    { x: 26, z: 12, rotation: -Math.PI / 4 }
  ];

  for (const pos of maisonPositions) {
    try {
      await loadGLBModel(
        scene,
        '/models/3houses.glb',
        { x: pos.x, y: 0, z: pos.z },
        0.3,
        pos.rotation
      );
    } catch (error) {
      console.error(`Erreur lors du chargement d'une maison à (${pos.x}, ${pos.z}):`, error);
    }
  }

  // Mapper les fournisseurs aux shops
  const shopsAvecFournisseurs = mapFournisseursToShops(fournisseurs, produits);

  // Créer les étals de marché procéduraux avec les données des fournisseurs
  console.log('[Village3D] Création de', shopsAvecFournisseurs.length, 'shops procéduraux');

  // Position initiale du client/caméra (point de vue par défaut)
  const clientX = 0;
  const clientZ = 15; // Position de départ de la caméra

  for (const shop of shopsAvecFournisseurs) {
    try {
      // Calculer la rotation pour que le stand soit orienté VERS LE CLIENT
      // Le stand regarde vers la position initiale de la caméra
      const dx = clientX - shop.position[0];
      const dz = clientZ - shop.position[2];
      const rotation = Math.atan2(dx, dz);

      // Créer un stand procédural
      const stallGroup = createProceduralStall(
        scene,
        shop.position[0],
        shop.position[2],
        rotation,
        shop.nom,
        shop.produits.length
      );

      // Ajouter les métadonnées pour l'interaction
      (stallGroup as any).userData = {
        shopId: shop.id,
        nom: shop.nom,
        produits: shop.produits,
        artisan: shop.artisan
      };

      console.log(`[Village3D] Shop créé: ${shop.nom} (orienté vers client) avec ${shop.produits.length} produits`);
    } catch (error) {
      console.error(`Erreur lors de la création du shop ${shop.nom}:`, error);
    }
  }

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
