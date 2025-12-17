const https = require('https');
const fs = require('fs');
const path = require('path');

// Dossier de destination
const TEXTURE_DIR = path.join(__dirname, '../public/textures/moissac');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(TEXTURE_DIR)) {
  fs.mkdirSync(TEXTURE_DIR, { recursive: true });
}

// URLs des textures gratuites depuis Polyhaven
const TEXTURES = [
  {
    name: 'stone_roman_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/sandstone_blocks/sandstone_blocks_diff_2k.jpg',
    description: 'Pierre romane blonde'
  },
  {
    name: 'stone_roman_normal.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/sandstone_blocks/sandstone_blocks_nor_gl_2k.jpg',
    description: 'Normal map pierre'
  },
  {
    name: 'stone_roman_roughness.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/sandstone_blocks/sandstone_blocks_rough_2k.jpg',
    description: 'Roughness pierre'
  },
  {
    name: 'brick_gothic_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/medieval_blocks/medieval_blocks_diff_2k.jpg',
    description: 'Brique gothique'
  },
  {
    name: 'brick_gothic_normal.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/medieval_blocks/medieval_blocks_nor_gl_2k.jpg',
    description: 'Normal map brique'
  },
  {
    name: 'marble_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/white_marble_01/white_marble_01_diff_2k.jpg',
    description: 'Marbre colonnes'
  },
  {
    name: 'marble_normal.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/white_marble_01/white_marble_01_nor_gl_2k.jpg',
    description: 'Normal map marbre'
  },
  {
    name: 'roof_tile_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/roof_tiles_03/roof_tiles_03_diff_2k.jpg',
    description: 'Tuiles de toit'
  }
];

// Fonction de téléchargement
function downloadFile(url, dest, description) {
  return new Promise((resolve, reject) => {
    console.log(`📥 Téléchargement: ${description}...`);

    const file = fs.createWriteStream(dest);

    https.get(url, (response) => {
      // Gérer les redirections
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);

          file.on('finish', () => {
            file.close();
            console.log(`   ✅ ${description} téléchargé !`);
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      } else {
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`   ✅ ${description} téléchargé !`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });

    file.on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// Télécharger toutes les textures
async function downloadAllTextures() {
  console.log('🏰 Téléchargement des textures pour l\'Abbaye de Moissac...\n');

  for (const texture of TEXTURES) {
    const destPath = path.join(TEXTURE_DIR, texture.name);

    // Ne pas télécharger si le fichier existe déjà
    if (fs.existsSync(destPath)) {
      console.log(`⏭️  ${texture.description} existe déjà`);
      continue;
    }

    try {
      await downloadFile(texture.url, destPath, texture.description);
      // Petit délai pour ne pas surcharger le serveur
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Erreur lors du téléchargement de ${texture.description}:`, error.message);
    }
  }

  console.log('\n✨ Téléchargement terminé !');
  console.log(`📁 Les textures sont dans : ${TEXTURE_DIR}`);
  console.log('\n🔧 Prochaine étape : Lancez le script d\'activation des textures');
  console.log('   npm run activate-textures');
}

// Lancer le téléchargement
downloadAllTextures().catch(console.error);
