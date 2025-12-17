'use client';

import { useEffect, useRef, useState } from 'react';
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
import { FournisseursService } from '../../services/FournisseursService';
import { ProduitsService } from '../../services/ProduitsService';
import type { Fournisseur, Produit } from '../../services/types';
import CategorieModal from './CategorieModal';
import { VILLAGE_CATEGORIES, type CategoryConfig } from '../../config/villageConfig';
import * as THREE from 'three';

export default function VillageScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Charger les données depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('[Village3D] Chargement des données API...');
        const [fournisseursData, produitsData] = await Promise.all([
          FournisseursService.getFournisseurs(),
          ProduitsService.getProduits()
        ]);

        console.log('[Village3D] Fournisseurs chargés:', fournisseursData.length);
        console.log('[Village3D] Produits chargés:', produitsData.length);

        setFournisseurs(fournisseursData);
        setProduits(produitsData);
        setLoading(false);
      } catch (err) {
        console.error('[Village3D] Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données du marché');
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

    const initializeScene = async () => {
      const { scene, camera, renderer } = initScene(containerRef.current!);

      loadHDRI(scene);
      setupLights(scene);

      const textures = loadTextures();

      // Charger les objets avec les données des fournisseurs et produits
      await placeObjects(scene, textures, fournisseurs, produits);

      const orbit = createOrbitControls(camera, renderer);
      const fpsControls = setupFPSControls(camera);
      cleanupControls = fpsControls.cleanup;

      const { miniCam, miniRenderer } = setupMinimap(scene, minimapRef.current!);

      cleanupResize = setupResponsive(camera, renderer);

      // Raycaster pour détecter les clics sur les stands
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let hoveredStall: THREE.Group | null = null;

      // Fonction pour détecter le stand survolé
      const handleMouseMove = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        // Réinitialiser le stand précédent
        if (hoveredStall) {
          hoveredStall.children.forEach(child => {
            if ((child as THREE.Mesh).material) {
              const mesh = child as THREE.Mesh;
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.emissive) {
                mat.emissive.setHex(0x000000);
              }
            }
          });
          hoveredStall = null;
          renderer.domElement.style.cursor = 'default';
        }

        if (intersects.length > 0) {
          let object = intersects[0].object;
          let depth = 0;

          while (object && depth < 10) {
            if (object.userData && (object.userData.type === 'category' || object.userData.type === 'subcategory')) {
              hoveredStall = object as THREE.Group;
              // Illuminer légèrement le stand survolé
              hoveredStall.children.forEach(child => {
                if ((child as THREE.Mesh).material) {
                  const mesh = child as THREE.Mesh;
                  const mat = mesh.material as THREE.MeshStandardMaterial;
                  if (mat.emissive) {
                    mat.emissive.setHex(0x444444);
                  }
                }
              });
              renderer.domElement.style.cursor = 'pointer';
              break;
            }
            object = object.parent as THREE.Object3D;
            depth++;
          }
        }
      };

      const handleClick = (event: MouseEvent) => {
        console.log('[VillageScene] 🖱️ Clic détecté');

        // Calculer la position normalisée de la souris
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        console.log('[VillageScene] Position souris normalisée:', mouse.x, mouse.y);

        // Mettre à jour le raycaster
        raycaster.setFromCamera(mouse, camera);

        // Trouver les intersections avec tous les objets
        const intersects = raycaster.intersectObjects(scene.children, true);

        console.log('[VillageScene] Nombre d\'intersections:', intersects.length);

        if (intersects.length > 0) {
          console.log('[VillageScene] Premier objet intersecté:', intersects[0].object.type, intersects[0].object.name);

          // Chercher le stand parent avec userData
          let object = intersects[0].object;
          let foundCategory = false;
          let depth = 0;

          // Remonter dans la hiérarchie pour trouver le groupe du stand
          while (object && !foundCategory && depth < 10) {
            console.log(`[VillageScene] Niveau ${depth}:`, object.type, 'userData:', object.userData);

            // Gérer les stands de sous-catégories
            if (object.userData && object.userData.type === 'subcategory') {
              console.log('[VillageScene] ✅ Sous-catégorie trouvée:', object.userData.subCategory);
              // Créer une "catégorie temporaire" qui ne contient que cette sous-catégorie
              const tempCategory = {
                ...object.userData.parentCategory,
                sousCategories: [object.userData.subCategory]
              };
              setSelectedCategory(tempCategory);
              setShowModal(true);
              foundCategory = true;
              break;
            }
            // Gérer les anciennes catégories (compatibilité)
            else if (object.userData && object.userData.type === 'category') {
              console.log('[VillageScene] ✅ Catégorie trouvée:', object.userData.category);
              setSelectedCategory(object.userData.category);
              setShowModal(true);
              foundCategory = true;
              break;
            }
            object = object.parent as THREE.Object3D;
            depth++;
          }

          if (!foundCategory) {
            console.log('[VillageScene] ❌ Aucune catégorie trouvée après remontée de', depth, 'niveaux');
          }
        } else {
          console.log('[VillageScene] ❌ Aucune intersection détectée');
        }
      };

      renderer.domElement.addEventListener('click', handleClick);
      renderer.domElement.addEventListener('mousemove', handleMouseMove);

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
        renderer.domElement.removeEventListener('click', handleClick);
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
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
  }, [containerRef, minimapRef, loading, fournisseurs, produits]);

  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#87CEEB',
        fontSize: '20px',
        color: '#fff'
      }}>
        Chargement du village français...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#87CEEB',
        fontSize: '20px',
        color: '#fff'
      }}>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Réessayer
        </button>
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
          top: '10px',
          width: '200px',
          height: '200px',
          border: '3px solid white',
          zIndex: 10,
        }}
      />

      {/* Panneau d'informations */}
      <div style={{
        position: 'fixed',
        left: '10px',
        top: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '15px',
        borderRadius: '8px',
        zIndex: 10,
        maxWidth: '300px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#333' }}>
          🏘️ Village 3D - Marché
        </h3>
        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
          <strong>{VILLAGE_CATEGORIES.length}</strong> catégories
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
          <strong>{VILLAGE_CATEGORIES.reduce((sum, cat) => sum + cat.sousCategories.length, 0)}</strong> sous-catégories
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
          <strong>{produits.length}</strong> produits disponibles
        </p>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
          <p style={{ margin: '3px 0' }}>🖱️ Clic sur stand: Explorer catégorie</p>
          <p style={{ margin: '3px 0' }}>🖱️ Clic droit: Rotation</p>
          <p style={{ margin: '3px 0' }}>⌨️ ZQSD: Déplacement</p>
          <p style={{ margin: '3px 0' }}>🖱️ Molette: Zoom</p>
        </div>
      </div>

      {/* Modal des catégories */}
      {showModal && selectedCategory && (
        <CategorieModal
          isOpen={showModal}
          category={selectedCategory}
          onClose={() => {
            setShowModal(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </>
  );
}
