#!/bin/bash

# Script d'optimisation du modèle 3D
# Réduit la taille du fichier maison.glb de 98 MB à ~5-10 MB

echo "🔧 Optimisation du modèle 3D..."
echo ""

cd public/models/buildings/blender/

# Vérifier si gltf-transform est installé
if ! command -v gltf-transform &> /dev/null
then
    echo "📦 Installation de gltf-transform..."
    npm install -g @gltf-transform/cli
    echo ""
fi

# Vérifier la taille avant
echo "📊 Taille AVANT optimisation:"
ls -lh maison.glb | awk '{print "   " $5 " - " $9}'
echo ""

# Optimiser le fichier
echo "⚙️  Optimisation en cours..."
gltf-transform optimize maison.glb maison_optimized.glb \
  --texture-size 1024 \
  --compress draco

echo ""
echo "✅ Optimisation terminée!"
echo ""

# Vérifier la taille après
echo "📊 Résultat:"
echo "   AVANT: $(ls -lh maison.glb | awk '{print $5}')"
echo "   APRÈS: $(ls -lh maison_optimized.glb | awk '{print $5}')"
echo ""

# Demander si on remplace
read -p "Remplacer maison.glb par la version optimisée ? (o/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Oo]$ ]]
then
    echo "💾 Sauvegarde de l'original..."
    mv maison.glb maison_original_98MB.glb
    mv maison_optimized.glb maison.glb
    echo "✅ Fichier remplacé!"
    echo "   Original sauvegardé: maison_original_98MB.glb"
else
    echo "ℹ️  Fichier optimisé disponible: maison_optimized.glb"
    echo "   Pour l'utiliser, modifiez buildingsLayout.ts"
fi

echo ""
echo "🎉 Terminé! Rechargez la page pour voir le résultat."
