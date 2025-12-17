import * as THREE from 'three';

export function setupMinimap(scene, canvas) {
  const miniCam = new THREE.OrthographicCamera(-50, 50, 50, -50, 1, 500);
  miniCam.position.set(0, 120, 0);
  miniCam.lookAt(0, 0, 0);

  const miniRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  miniRenderer.setSize(200, 200);

  return { miniCam, miniRenderer };
}

export function renderMinimap(scene, miniCam, miniRenderer) {
  miniRenderer.render(scene, miniCam);
}
