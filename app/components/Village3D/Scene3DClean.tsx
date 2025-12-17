'use client';

import { useEffect, useRef, useState } from 'react';
import {
  initScene,
  loadHDRI,
  setupLights,
  loadTextures,
  setupResponsive,
  createOrbitControls,
} from '../../Village3D/utils/scene';
import { placeObjects } from '../../Village3D/utils/objects';
import { setupFPSControls } from '../../Village3D/utils/controls';
import { setupMinimap, renderMinimap } from '../../Village3D/utils/minimap';
import { FournisseursService } from '../../services/FournisseursService';
import { ProduitsService } from '../../services/ProduitsService';
import type { Fournisseur, Produit } from '../../services/types';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

interface Scene3DCleanProps {
  onFournisseurClick?: (id: number, nom: string) => void;
  visitMode?: 'orbit' | 'walk';
}

export default function Scene3DClean({ onFournisseurClick, visitMode = 'orbit' }: Scene3DCleanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [fournisseursData, produitsData] = await Promise.all([
          FournisseursService.getFournisseurs(),
          ProduitsService.getProduits()
        ]);

        setFournisseurs(fournisseursData);
        setProduits(produitsData);
        setLoading(false);
      } catch (err) {
        console.error('[Scene3DClean] Erreur lors du chargement des données:', err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Initialiser la scène 3D
  useEffect(() => {
    if (!containerRef.current || !minimapRef.current || loading) return;

    let animationId: number;
    let cleanupControls: (() => void) | undefined;
    let cleanupResize: (() => void) | undefined;
    let pointerLockControls: PointerLockControls | undefined;
    let raycaster: THREE.Raycaster;
    let mouse: THREE.Vector2;

    const initializeScene = async () => {
      const { scene, camera, renderer } = initScene(containerRef.current!);

      loadHDRI(scene);
      setupLights(scene);

      const textures = loadTextures();

      // Charger les objets avec les données des fournisseurs et produits
      await placeObjects(scene, textures, fournisseurs, produits);

      // Contrôles
      const orbit = createOrbitControls(camera, renderer);
      const fpsControls = setupFPSControls(camera);
      cleanupControls = fpsControls.cleanup;

      // Pointer Lock Controls pour le mode walk
      if (visitMode === 'walk') {
        pointerLockControls = new PointerLockControls(camera, renderer.domElement);

        renderer.domElement.addEventListener('click', () => {
          pointerLockControls?.lock();
        });

        // Désactiver OrbitControls en mode walk
        orbit.enabled = false;
      } else {
        orbit.enabled = true;
      }

      // Raycaster pour détecter les clics sur les objets
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      const handleClick = (event: MouseEvent) => {
        // Calculer la position de la souris
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Mettre à jour le raycaster
        raycaster.setFromCamera(mouse, camera);

        // Trouver les intersections
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          const intersected = intersects[0].object;

          // Remonter jusqu'au groupe parent qui contient les métadonnées
          let parent: THREE.Object3D | null = intersected;
          while (parent && !parent.userData.shopId) {
            parent = parent.parent;
          }

          if (parent && parent.userData.shopId && onFournisseurClick) {
            onFournisseurClick(parent.userData.shopId, parent.userData.nom || 'Stand');
          }
        }
      };

      renderer.domElement.addEventListener('click', handleClick);

      const { miniCam, miniRenderer } = setupMinimap(scene, minimapRef.current!);

      cleanupResize = setupResponsive(camera, renderer);

      function animate() {
        animationId = requestAnimationFrame(animate);

        if (visitMode === 'orbit') {
          orbit.update();
        }

        fpsControls.controlsFPS();

        renderer.render(scene, camera);
        renderMinimap(scene, miniCam, miniRenderer);
      }

      animate();

      return () => {
        if (animationId) cancelAnimationFrame(animationId);
        if (cleanupControls) cleanupControls();
        if (cleanupResize) cleanupResize();
        renderer.domElement.removeEventListener('click', handleClick);
        renderer.dispose();
        miniRenderer.dispose();
        if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
        }
      };
    };

    let cleanup: (() => void) | undefined;
    initializeScene().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [containerRef, minimapRef, loading, fournisseurs, produits, visitMode, onFournisseurClick]);

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#87CEEB'
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid rgba(255, 255, 255, 0.3)',
            borderTop: '5px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p>Chargement du village...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />
      <canvas
        ref={minimapRef}
        style={{
          position: 'fixed',
          right: '10px',
          bottom: '10px',
          width: '200px',
          height: '200px',
          border: '3px solid white',
          zIndex: 10,
          borderRadius: '8px'
        }}
      />
    </>
  );
}
