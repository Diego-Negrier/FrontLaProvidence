const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const TEXTURE_DIR = path.join(__dirname, '../public/textures/village');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(TEXTURE_DIR)) {
  fs.mkdirSync(TEXTURE_DIR, { recursive: true });
}

console.log('🏰 Téléchargement des textures photo-réalistes pour le village français...\n');

// Textures PBR de haute qualité (1K pour performance optimale)
const TEXTURES = [
  // Grès rouge type Collonges-la-Rouge
  {
    name: 'red_sandstone_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/red_brick_03/red_brick_03_diff_1k.jpg',
    description: 'Grès rouge (diffuse)'
  },
  {
    name: 'red_sandstone_normal.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/red_brick_03/red_brick_03_nor_gl_1k.jpg',
    description: 'Grès rouge (normal)'
  },
  {
    name: 'red_sandstone_roughness.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/red_brick_03/red_brick_03_rough_1k.jpg',
    description: 'Grès rouge (roughness)'
  },

  // Ardoise pour toits
  {
    name: 'slate_roof_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/roof_slates_02/roof_slates_02_diff_1k.jpg',
    description: 'Ardoise toit (diffuse)'
  },
  {
    name: 'slate_roof_normal.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/roof_slates_02/roof_slates_02_nor_gl_1k.jpg',
    description: 'Ardoise toit (normal)'
  },

  // Bois ancien patiné
  {
    name: 'old_wood_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wooden_planks_old/wooden_planks_old_diff_1k.jpg',
    description: 'Bois ancien (diffuse)'
  },
  {
    name: 'old_wood_normal.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/wooden_planks_old/wooden_planks_old_nor_gl_1k.jpg',
    description: 'Bois ancien (normal)'
  },

  // Pierre calcaire claire
  {
    name: 'limestone_diffuse.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/limestone_floor/limestone_floor_diff_1k.jpg',
    description: 'Calcaire clair (diffuse)'
  },
  {
    name: 'limestone_normal.jpg',
    url: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/limestone_floor/limestone_floor_nor_gl_1k.jpg',
    description: 'Calcaire clair (normal)'
  },
];

function downloadFile(url, destPath, description) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);

    console.log(`⬇️  ${description}...`);

    const request = protocol.get(url, (response) => {
      // Gérer les redirections
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
        file.close();
        fs.unlinkSync(destPath);
        console.log(`   ↪️  Redirection vers ${response.headers.location}`);
        downloadFile(response.headers.location, destPath, description)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      let downloaded = 0;
      const totalSize = parseInt(response.headers['content-length'], 10);

      response.on('data', (chunk) => {
        downloaded += chunk.length;
        if (totalSize) {
          const percent = ((downloaded / totalSize) * 100).toFixed(0);
          process.stdout.write(`\r   📊 ${percent}% (${(downloaded / 1024).toFixed(0)} KB)`);
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(destPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`\r   ✅ Téléchargé: ${sizeKB} KB\n`);
        resolve();
      });
    });

    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
      }
      reject(err);
    });

    request.setTimeout(30000, () => {
      request.abort();
      reject(new Error('Timeout'));
    });
  });
}

async function downloadAllTextures() {
  console.log('🎨 Source: Polyhaven (textures PBR gratuites)\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const texture of TEXTURES) {
    const destPath = path.join(TEXTURE_DIR, texture.name);

    // Vérifier si le fichier existe déjà et est valide
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 50000) { // Plus de 50KB = fichier valide
        console.log(`⏭️  ${texture.description} - Déjà téléchargé (${(stats.size / 1024).toFixed(1)} KB)\n`);
        skipCount++;
        continue;
      } else {
        // Supprimer le fichier corrompu
        fs.unlinkSync(destPath);
      }
    }

    try {
      await downloadFile(texture.url, destPath, texture.description);
      successCount++;
    } catch (error) {
      console.log(`\r   ❌ Erreur: ${error.message}\n`);
      failCount++;
    }

    // Pause de 800ms entre chaque téléchargement (éviter surcharge serveur)
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 RÉSUMÉ:\n');
  console.log(`   ✅ Téléchargés: ${successCount}`);
  console.log(`   ⏭️  Ignorés: ${skipCount}`);
  console.log(`   ❌ Échecs: ${failCount}`);
  console.log(`\n📁 Dossier: public/textures/village/\n`);

  if (failCount > 0) {
    console.log('⚠️  Certains téléchargements ont échoué.');
    console.log('   Relancez le script ou téléchargez manuellement depuis:');
    console.log('   https://polyhaven.com/textures\n');
  }

  if (successCount > 0 || skipCount === TEXTURES.length) {
    console.log('🚀 PROCHAINE ÉTAPE:\n');
    console.log('   npm run dev\n');
    console.log('   Puis accédez à http://localhost:3007\n');
  }
}

downloadAllTextures().catch((error) => {
  console.error('\n❌ ERREUR FATALE:', error);
  process.exit(1);
});
