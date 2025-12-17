const fs = require('fs');
const path = require('path');

const TEXTURE_DIR = path.join(__dirname, '../public/textures/moissac');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(TEXTURE_DIR)) {
  fs.mkdirSync(TEXTURE_DIR, { recursive: true });
}

console.log('🎨 Création de textures placeholder pour l\'Abbaye...\n');

// Liste des textures avec leurs couleurs
const textures = [
  { name: 'stone_roman_diffuse.jpg', color: '#c9a98e', desc: 'Pierre romane' },
  { name: 'stone_roman_normal.jpg', color: '#8080ff', desc: 'Normal pierre' },
  { name: 'stone_roman_roughness.jpg', color: '#d0d0d0', desc: 'Roughness pierre' },
  { name: 'brick_gothic_diffuse.jpg', color: '#a0503a', desc: 'Brique gothique' },
  { name: 'brick_gothic_normal.jpg', color: '#8080ff', desc: 'Normal brique' },
  { name: 'marble_diffuse.jpg', color: '#f5f5dc', desc: 'Marbre' },
  { name: 'marble_normal.jpg', color: '#8080ff', desc: 'Normal marbre' },
  { name: 'roof_tile_diffuse.jpg', color: '#8b4513', desc: 'Tuiles' },
];

// Créer une image SVG simple d'1px x 1px avec la couleur
function createPlaceholderSVG(color, name) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" fill="${color}"/>
  <text x="128" y="128" font-family="Arial" font-size="14" fill="#000" text-anchor="middle" opacity="0.5">
    ${name}
  </text>
</svg>`;
}

// Créer chaque texture placeholder
textures.forEach(({ name, color, desc }) => {
  const filePath = path.join(TEXTURE_DIR, name);

  // Supprimer le fichier existant s'il fait moins de 1KB (fichier vide/corrompu)
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size < 1000) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Suppression du fichier corrompu: ${name}`);
    } else {
      console.log(`⏭️  ${desc} existe déjà (${(stats.size / 1024).toFixed(1)} KB)`);
      return;
    }
  }

  // Créer le SVG placeholder
  const svgContent = createPlaceholderSVG(color, desc);
  const svgPath = filePath.replace('.jpg', '.svg');

  fs.writeFileSync(svgPath, svgContent);
  console.log(`✅ ${desc} créé (placeholder SVG)`);
});

console.log('\n✨ Placeholders créés !');
console.log('📝 Note : Ce sont des couleurs temporaires.');
console.log('📥 Téléchargez de vraies textures depuis :');
console.log('   https://polyhaven.com/textures');
console.log('\n🚀 Lancez le serveur : npm run dev');
