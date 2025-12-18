import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function initScene(container: HTMLElement) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,  // Champ de vision plus large pour mieux voir autour
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  // Positionner la caméra au centre, au niveau du sol, comme un visiteur
  camera.position.set(0, 1.7, 0); // 1.7m = hauteur des yeux d'un humain
  camera.lookAt(0, 1.7, -10); // Regarder droit devant vers les stands

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

export function loadHDRI(scene: THREE.Scene) {
  const loader = new THREE.TextureLoader();
  loader.load('/textures/hdri.jpg', (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;
    scene.background = hdr;
  });
}

export function setupLights(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(30, 50, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  sun.shadow.camera.top = 50;
  sun.shadow.camera.bottom = -50;
  sun.shadow.camera.left = -50;
  sun.shadow.camera.right = 50;
  scene.add(sun);
}

export function loadTextures() {
  const loader = new THREE.TextureLoader();

  const texPierre = loader.load('/textures/pierre.jpg');
  const texToit = loader.load('/textures/toiture.jpg');
  const texBois = loader.load('/textures/bois.jpg');
  const texPave = loader.load('/textures/pave.jpg');
  texPave.wrapS = texPave.wrapT = THREE.RepeatWrapping;
  texPave.repeat.set(50, 50);

  const texFenetre = loader.load('/textures/fenetre.jpg');
  const texPorte = loader.load('/textures/porte.jpg');

  return { texPierre, texToit, texBois, texPave, texFenetre, texPorte };
}

export function setupResponsive(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}

export function createOrbitControls(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.05;
  orbit.enablePan = false; // Désactiver le déplacement latéral

  // Point de visée au niveau des yeux, légèrement devant
  orbit.target.set(0, 1.7, -10);

  // Rotation 360° complète - pas de limite horizontale
  // orbit.minAzimuthAngle et maxAzimuthAngle sont désactivés pour rotation complète

  // Limiter la rotation verticale pour une expérience naturelle
  orbit.minPolarAngle = Math.PI / 4;    // 45 degrés (ne pas trop regarder en haut)
  orbit.maxPolarAngle = Math.PI / 1.8;  // ~100 degrés (ne pas regarder le sol)

  // Limiter le zoom pour rester au niveau du sol
  orbit.minDistance = 5;   // Distance minimale (rester proche)
  orbit.maxDistance = 30;  // Distance maximale (vue d'ensemble locale)

  // Forcer la mise à jour des contrôles
  orbit.update();

  return orbit;
}
