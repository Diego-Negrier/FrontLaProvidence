'use client';

import { useEffect, useRef } from 'react';
import {
  initScene,
  loadHDRI,
  setupLights,
  loadTextures,
  setupResponsive,
  createOrbitControls,
} from '../utils/scene';
import { placeObjects } from '../utils/objects';
import { setupFPSControls } from '../utils/controls';
import { setupMinimap, renderMinimap } from '../utils/minimap';

export default function VillageScene() {
  const containerRef = useRef(null);
  const minimapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !minimapRef.current) return;

    let animationId;
    let cleanupControls;
    let cleanupResize;

    const initializeScene = async () => {
      const { scene, camera, renderer } = initScene(containerRef.current);

      loadHDRI(scene);
      setupLights(scene);

      const textures = loadTextures();

      // Charger les objets de manière asynchrone
      await placeObjects(scene, textures);

      const orbit = createOrbitControls(camera, renderer);
      const fpsControls = setupFPSControls(camera);
      cleanupControls = fpsControls.cleanup;

      const { miniCam, miniRenderer } = setupMinimap(scene, minimapRef.current);

      cleanupResize = setupResponsive(camera, renderer);

      function animate() {
        animationId = requestAnimationFrame(animate);

        orbit.update();
        fpsControls.controlsFPS();

        renderer.render(scene, camera);
        renderMinimap(scene, miniCam, miniRenderer);
      }

      animate();

      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        if (cleanupControls) cleanupControls();
        if (cleanupResize) cleanupResize();
        renderer.dispose();
        miniRenderer.dispose();
        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    };

    let cleanup;
    initializeScene().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />
      <canvas
        ref={minimapRef}
        style={{
          position: 'fixed',
          right: '10px',
          top: '10px',
          width: '200px',
          height: '200px',
          border: '3px solid white',
          zIndex: 10,
        }}
      />
    </>
  );
}
