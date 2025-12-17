import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function initScene(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 3, 15);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

export function loadHDRI(scene) {
  const loader = new THREE.TextureLoader();
  loader.load('/textures/hdri.jpg', (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;
    scene.background = hdr;
  });
}

export function setupLights(scene) {
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

export function setupResponsive(camera, renderer) {
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

export function createOrbitControls(camera, renderer) {
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.enablePan = false;
  return orbit;
}
