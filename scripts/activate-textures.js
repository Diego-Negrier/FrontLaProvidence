const fs = require('fs');
const path = require('path');

const COMPONENT_PATH = path.join(__dirname, '../app/components/Village3D/Buildings/AbbaySaintPierreMoissacRealistic.tsx');

console.log('🎨 Activation des textures dans le composant...\n');

// Lire le fichier
let content = fs.readFileSync(COMPONENT_PATH, 'utf8');

// Vérifier si les textures sont déjà activées
if (content.includes('const textures = useTexture({')) {
  console.log('✅ Les textures sont déjà activées !');
  process.exit(0);
}

// Code à insérer après "const SCALE = 0.2;"
const textureLoadingCode = `
  // Chargement des textures photographiques
  const textures = useTexture({
    // Pierre romane
    stoneRoman: '/textures/moissac/stone_roman_diffuse.jpg',
    stoneRomanNormal: '/textures/moissac/stone_roman_normal.jpg',
    stoneRomanRoughness: '/textures/moissac/stone_roman_roughness.jpg',

    // Brique gothique
    brickGothic: '/textures/moissac/brick_gothic_diffuse.jpg',
    brickGothicNormal: '/textures/moissac/brick_gothic_normal.jpg',

    // Marbre colonnes
    marble: '/textures/moissac/marble_diffuse.jpg',
    marbleNormal: '/textures/moissac/marble_normal.jpg',

    // Tuiles de toit
    roofTile: '/textures/moissac/roof_tile_diffuse.jpg',
  });

  // Configuration des textures
  Object.entries(textures).forEach(([key, texture]) => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      // Répétition selon le type
      if (key.includes('stone') || key.includes('brick')) {
        texture.repeat.set(3, 3);
      } else if (key.includes('marble')) {
        texture.repeat.set(1, 1);
      } else if (key.includes('roof')) {
        texture.repeat.set(4, 4);
      }

      // Qualité maximale
      texture.anisotropy = 16;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  });
`;

// Insérer après "const SCALE = 0.2;"
content = content.replace(
  'const SCALE = 0.2;',
  `const SCALE = 0.2;\n${textureLoadingCode}`
);

// Mettre à jour les matériaux pour utiliser les textures
const materialUpdates = {
  'stoneRoman: new THREE.MeshStandardMaterial({': `stoneRoman: new THREE.MeshStandardMaterial({
      map: textures.stoneRoman,
      normalMap: textures.stoneRomanNormal,
      roughnessMap: textures.stoneRomanRoughness,`,

  'brickGothic: new THREE.MeshStandardMaterial({': `brickGothic: new THREE.MeshStandardMaterial({
      map: textures.brickGothic,
      normalMap: textures.brickGothicNormal,`,

  'marble: new THREE.MeshStandardMaterial({': `marble: new THREE.MeshStandardMaterial({
      map: textures.marble,
      normalMap: textures.marbleNormal,`,

  'roofTile: new THREE.MeshStandardMaterial({': `roofTile: new THREE.MeshStandardMaterial({
      map: textures.roofTile,`,
};

// Appliquer les mises à jour
for (const [search, replace] of Object.entries(materialUpdates)) {
  content = content.replace(search, replace);
}

// Écrire le fichier modifié
fs.writeFileSync(COMPONENT_PATH, content, 'utf8');

console.log('✅ Textures activées avec succès !');
console.log('\n📋 Modifications appliquées :');
console.log('   ✓ Chargement des textures via useTexture');
console.log('   ✓ Configuration de la répétition et qualité');
console.log('   ✓ Application aux matériaux (stone, brick, marble, roof)');
console.log('\n🚀 Lancez le serveur pour voir le résultat :');
console.log('   npm run dev');
