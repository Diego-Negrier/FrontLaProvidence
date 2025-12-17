import * as THREE from 'three';

interface Keys {
  [key: string]: boolean;
}

export function setupFPSControls(camera: THREE.PerspectiveCamera) {
  const keys: Keys = {};
  const MIN_HEIGHT = 1.5; // Hauteur minimale au-dessus du sol
  const MAX_HEIGHT = 50; // Hauteur maximale

  const handleKeyDown = (e: KeyboardEvent) => {
    keys[e.key] = true;
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    keys[e.key] = false;
  };

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  const controlsFPS = () => {
    const speed = 0.15;

    // Déplacement horizontal
    if (keys['w'] || keys['z']) camera.position.z -= speed;
    if (keys['s']) camera.position.z += speed;
    if (keys['a'] || keys['q']) camera.position.x -= speed;
    if (keys['d']) camera.position.x += speed;

    // Déplacement vertical (optionnel)
    if (keys[' ']) camera.position.y += speed; // Espace pour monter
    if (keys['Shift']) camera.position.y -= speed; // Shift pour descendre

    // Limiter la hauteur de la caméra
    camera.position.y = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, camera.position.y));
  };

  const cleanup = () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  };

  return { controlsFPS, cleanup };
}
