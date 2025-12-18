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
import { CategoriesService } from '../../services/CategoriesService';
import type { Fournisseur, Produit, Categorie } from '../../services/types';
import CategorieModal from './CategorieModal';
import FournisseursModal from './FournisseursModal';
import type { CategoryConfig } from '../../config/villageConfig';
import * as THREE from 'three';

export default function VillageScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Fournisseur[]>([]);
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);

  // Charger les données depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('[Village3D] Chargement des données API...');
        const [fournisseursData, produitsData, categoriesData] = await Promise.all([
          FournisseursService.getFournisseurs(),
          ProduitsService.getProduits(),
          CategoriesService.getCategories()
        ]);

        console.log('[Village3D] Fournisseurs chargés:', fournisseursData.length);
        console.log('[Village3D] Produits chargés:', produitsData.length);
        console.log('[Village3D] Catégories chargées:', categoriesData.length);
        console.log('[Village3D] Première catégorie:', categoriesData[0]);

        setFournisseurs(fournisseursData);
        setProduits(produitsData);
        setCategories(categoriesData);
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

      // DEBUG: Vérifier ce qui est passé à placeObjects
      console.log('[VillageScene] 🔍 AVANT placeObjects:');
      console.log('[VillageScene] - fournisseurs.length:', fournisseurs.length);
      console.log('[VillageScene] - produits.length:', produits.length);
      console.log('[VillageScene] - categories.length:', categories.length);
      console.log('[VillageScene] - categories:', categories);
      if (categories.length > 0) {
        console.log('[VillageScene] - Première catégorie:', categories[0]);
        console.log('[VillageScene] - Sous-catégories de la première:', categories[0].souscategories);
      }

      // Charger les objets avec les données des fournisseurs, produits et catégories
      await placeObjects(scene, textures, fournisseurs, produits, categories);

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
        event.preventDefault();
        event.stopPropagation();
        console.log('\n========== 🖱️ CLIC DÉTECTÉ ========== (event:', event.type, ')');

        // Calculer la position normalisée de la souris
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        console.log('Position souris:', { x: mouse.x.toFixed(3), y: mouse.y.toFixed(3) });

        // Mettre à jour le raycaster
        raycaster.setFromCamera(mouse, camera);

        // Trouver les intersections avec tous les objets
        const intersects = raycaster.intersectObjects(scene.children, true);

        console.log(`\n📊 INTERSECTIONS: ${intersects.length} objet(s) détecté(s)`);

        if (intersects.length > 0) {
          // Afficher les 10 premiers objets intersectés
          console.log('\n🔍 Premiers objets intersectés:');
          for (let i = 0; i < Math.min(10, intersects.length); i++) {
            const obj = intersects[i].object;
            console.log(`  ${i}: ${obj.type} "${obj.name}" - userData.type: "${obj.userData?.type || 'undefined'}"`);
          }

          // Chercher parmi toutes les intersections
          for (let intersectIndex = 0; intersectIndex < intersects.length; intersectIndex++) {
            let current: THREE.Object3D | null = intersects[intersectIndex].object;

            console.log(`\n🔎 Analyse intersection #${intersectIndex}:`);

            // Remonter dans la hiérarchie jusqu'à 20 niveaux
            for (let depth = 0; depth < 20 && current; depth++) {
              const userData = current.userData;

              // Afficher TOUS les niveaux pour le debug
              console.log(`  Niveau ${depth}: ${current.type} "${current.name || '(sans nom)'}"`,
                         `| type: "${userData?.type || 'undefined'}"`,
                         `| has category: ${!!userData?.category}`,
                         `| has subCategory: ${!!userData?.subCategory}`,
                         `| has suppliers: ${!!userData?.suppliers}`);

              // Vérifier si on a trouvé une pancarte fournisseurs
              if (userData && userData.type === 'suppliers' && userData.suppliers) {
                console.log('\n✅✅✅ PANCARTE FOURNISSEURS TROUVÉE! ✅✅✅');
                console.log('   Nombre de fournisseurs:', userData.suppliers.length);
                setSelectedSuppliers(userData.suppliers);
                setShowSuppliersModal(true);
                return;
              }

              // Vérifier si on a trouvé un stand de catégorie
              if (userData && userData.type === 'category' && userData.category) {
                console.log('\n✅✅✅ CATÉGORIE TROUVÉE! ✅✅✅');
                console.log('   Nom:', userData.category.nom);
                console.log('   Sous-catégories:', userData.category.sousCategories?.length);
                setSelectedCategory(userData.category);
                setShowModal(true);
                return;
              }

              // Vérifier si on a trouvé un stand de sous-catégorie
              if (userData && userData.type === 'subcategory' && userData.subCategory && userData.parentCategory) {
                console.log('\n✅✅✅ SOUS-CATÉGORIE TROUVÉE! ✅✅✅');
                console.log('   Nom:', userData.subCategory.nom);
                console.log('   Catégorie parente:', userData.parentCategory.nom);

                const categoryWithOneSubCat = {
                  ...userData.parentCategory,
                  sousCategories: [userData.subCategory]
                };

                setSelectedCategory(categoryWithOneSubCat);
                setShowModal(true);
                return;
              }

              current = current.parent;
            }
          }

          console.log('\n❌❌❌ AUCUNE CATÉGORIE TROUVÉE ❌❌❌');
        } else {
          console.log('\n❌ Aucune intersection détectée');
        }
        console.log('=====================================\n');
      };

      // Test : vérifier que l'élément est bien cliquable
      console.log('[VillageScene] 🎯 Attachement des événements de clic...');
      console.log('[VillageScene] Renderer DOM element:', renderer.domElement);

      renderer.domElement.addEventListener('click', handleClick, false);
      renderer.domElement.addEventListener('mousemove', handleMouseMove, false);

      // Test simple : clic sur le canvas
      renderer.domElement.addEventListener('mousedown', (e) => {
        console.log('[VillageScene] 🖱️ MOUSEDOWN détecté!', e.button);
      }, false);

      renderer.domElement.addEventListener('mouseup', (e) => {
        console.log('[VillageScene] 🖱️ MOUSEUP détecté!', e.button);
      }, false);

      console.log('[VillageScene] ✅ Événements attachés');

      function animate() {
        animationId = requestAnimationFrame(animate);

        orbit.update();
        fpsControls.controlsFPS();

        renderer.render(scene, camera);
        renderMinimap(scene, miniCam, miniRenderer);
      }

      animate();

      return () => {
        console.log('[VillageScene] 🧹 Nettoyage...');
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
  }, [containerRef, minimapRef, loading, fournisseurs, produits, categories]);

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
      <div ref={containerRef} style={{
        width: '100%',
        height: 'calc(100vh - 64px)', // 64px = hauteur du header
        marginTop: '64px' // Pousser sous le header
      }} />
      <canvas
        ref={minimapRef}
        style={{
          position: 'fixed',
          right: '10px',
          top: '74px', // 64px header + 10px marge
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
        top: '74px', // 64px header + 10px marge
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
          <strong>{categories.length}</strong> catégories
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
          <strong>{categories.reduce((sum, cat) => sum + (cat.souscategories?.length || 0), 0)}</strong> sous-catégories
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

      {/* Modal des fournisseurs */}
      {showSuppliersModal && selectedSuppliers.length > 0 && (
        <FournisseursModal
          isOpen={showSuppliersModal}
          suppliers={selectedSuppliers}
          onClose={() => {
            setShowSuppliersModal(false);
            setSelectedSuppliers([]);
          }}
        />
      )}
    </>
  );
}
