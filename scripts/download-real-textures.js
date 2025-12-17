const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const TEXTURE_DIR = path.join(__dirname, '../public/textures/moissac');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(TEXTURE_DIR)) {
  fs.mkdirSync(TEXTURE_DIR, { recursive: true });
}

console.log('📸 Téléchargement de vraies textures photographiques de haute qualité...\n');

// Textures PBR professionnelles de haute qualité (2K)
const TEXTURES = [
  {
    name: 'stone_roman_diffuse.jpg',
    url: 'https://cdn.polyhaven.com/asset_img/primary/sandstone_blocks.png?height=780',
    fallback: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/sandstone_blocks/sandstone_blocks_diff_1k.jpg',
    description: 'Pierre romane blonde (diffuse)'
  },
  {
    name: 'stone_roman_normal.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/sandstone_blocks/sandstone_blocks_nor_gl_1k.jpg',
    description: 'Pierre romane (normal map)'
  },
  {
    name: 'stone_roman_roughness.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/sandstone_blocks/sandstone_blocks_rough_1k.jpg',
    description: 'Pierre romane (roughness)'
  },
  {
    name: 'brick_gothic_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/red_brick_03/red_brick_03_diff_1k.jpg',
    description: 'Brique gothique rouge (diffuse)'
  },
  {
    name: 'brick_gothic_normal.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/red_brick_03/red_brick_03_nor_gl_1k.jpg',
    description: 'Brique gothique (normal map)'
  },
  {
    name: 'marble_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/white_marble_01/white_marble_01_diff_1k.jpg',
    description: 'Marbre blanc colonnes (diffuse)'
  },
  {
    name: 'marble_normal.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/white_marble_01/white_marble_01_nor_gl_1k.jpg',
    description: 'Marbre blanc (normal map)'
  },
  {
    name: 'roof_tile_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/terracotta_roof_tiles/terracotta_roof_tiles_diff_1k.jpg',
    description: 'Tuiles terre cuite (diffuse)'
  }
];

function downloadFile(url, destPath, description) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);

    console.log(`⬇️  Téléchargement: ${description}...`);

    protocol.get(url, (response) => {
      // Gérer les redirections
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        downloadFile(response.headers.location, destPath, description)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`Échec du téléchargement: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(destPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`✅ ${description} - ${sizeKB} KB téléchargé\n`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function downloadAllTextures() {
  console.log('🎨 Téléchargement des textures réalistes depuis Polyhaven...\n');

  for (const texture of TEXTURES) {
    const destPath = path.join(TEXTURE_DIR, texture.name);

    // Vérifier si le fichier existe déjà et a une taille correcte
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 10000) { // Plus de 10KB
        console.log(`⏭️  ${texture.description} existe déjà (${(stats.size / 1024).toFixed(1)} KB)\n`);
        continue;
      } else {
        // Supprimer le fichier corrompu
        fs.unlinkSync(destPath);
      }
    }

    try {
      await downloadFile(texture.url, destPath, texture.description);
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);

      // Essayer l'URL de secours si disponible
      if (texture.fallback) {
        console.log(`🔄 Tentative avec l'URL de secours...`);
        try {
          await downloadFile(texture.fallback, destPath, texture.description);
        } catch (fallbackError) {
          console.log(`❌ Échec: ${fallbackError.message}\n`);
        }
      }
    }

    // Pause de 500ms entre chaque téléchargement
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n✨ Téléchargement terminé !\n');
  console.log('📁 Textures sauvegardées dans: public/textures/moissac/\n');
  console.log('🚀 Prochaine étape: npm run activate-textures');
}

downloadAllTextures().catch(console.error);
