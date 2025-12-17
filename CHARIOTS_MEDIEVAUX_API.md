# 🛒 Chariots Médiévaux Connectés à l'API

## ✨ Vue d'Ensemble

Système de **chariots médiévaux 3D réalistes** qui chargent automatiquement les produits depuis votre API Django en fonction des **catégories**, **sous-catégories** et **sous-sous-catégories**.

---

## 🎯 Fonctionnalités

### 1. **Chargement Dynamique depuis l'API**
- ✅ Connexion automatique à `http://localhost:8007/api/`
- ✅ Récupération des catégories avec hiérarchie
- ✅ Chargement des produits filtrés par catégorie
- ✅ Maximum 6 produits par chariot
- ✅ Données en temps réel

### 2. **Chariot Médiéval Réaliste 3D**
- ✅ **Plateforme en bois** avec planches détaillées
- ✅ **4 roues** avec rayons et moyeux métalliques
- ✅ **Rebords** sur les 4 côtés
- ✅ **Timon** de traction
- ✅ **Enseigne** avec nom de catégorie
- ✅ **Produits 3D** disposés sur le chariot

### 3. **Couleurs Intelligentes par Catégorie**
Le chariot change de couleur selon la catégorie :

| Catégorie | Couleur Chariot | Hex | Couleur Produits |
|-----------|----------------|-----|------------------|
| Fruits & Légumes | Vert olive | `#6B8E23` | Rouge tomate `#FF6347` |
| Fromages & Charcuterie | Beige | `#DEB887` | Beige/Rouge |
| Vins & Boissons | Rouge vin | `#8B1A1A` | Bordeaux `#722F37` |
| Pain & Boulangerie | Brun pain | `#D2691E` | Tan `#D2B48C` |
| Poissons & Fruits de Mer | Bleu mer | `#4682B4` | Bleu ciel `#87CEEB` |

---

## 📐 Architecture Technique

### Structure des Données API

```typescript
// Catégorie (niveau 1)
interface Categorie {
  pk: number;
  nom: string;
  slug: string;
  description?: string;
  image?: string;
  icone?: string;
  est_active: boolean;
  ordre: number;
  souscategories: SousCategorie[];  // Niveau 2
  nb_produits: number;
}

// Sous-catégorie (niveau 2)
interface SousCategorie {
  pk: number;
  nom: string;
  slug: string;
  soussouscategories: SousSousCategorie[];  // Niveau 3
  nb_produits: number;
}

// Sous-sous-catégorie (niveau 3)
interface SousSousCategorie {
  pk: number;
  nom: string;
  slug: string;
  nb_produits: number;
}

// Produit
interface Produit {
  pk: number;
  nom: string;
  prix_ht: string;
  stock_actuel: number;
  image_principale: string | null;
  categorie: number;           // ID catégorie
  souscategorie: number;        // ID sous-catégorie
  soussouscategorie: number | null;  // ID sous-sous-catégorie
}
```

### Flux de Données

```
1. ChariotMedieval monte avec categorieId
         ↓
2. useEffect() se déclenche
         ↓
3. Fetch vers /api/categories/
         ↓
4. Trouve la catégorie correspondante
         ↓
5. Fetch vers /api/magasin/
         ↓
6. Filtre produits par categorie === categorieId
         ↓
7. Prend les 6 premiers produits
         ↓
8. Affiche sur le chariot 3D
```

---

## 🛠️ Utilisation

### Dans Scene3D.tsx

```typescript
<ChariotMedieval
  position={[-6, 0, 5]}
  categorieId={1}              // ID de la catégorie
  onClick={() => onFournisseurClick?.(1, 'Chariot Fruits')}
/>
```

### Paramètres

- **position** : `[x, y, z]` Position dans la scène 3D
- **categorieId** : `number` ID de la catégorie API
- **onClick** : `function` Callback au clic

---

## 🎨 Composants du Chariot

### 1. Base et Structure

```typescript
// Plateforme principale (2m x 1.5m)
<boxGeometry args={[2, 0.15, 1.5]} />

// 8 planches détaillées
{[...Array(8)].map((_, i) => (
  <boxGeometry args={[0.2, 0.02, 1.5]} />
))}

// 4 rebords (avant, arrière, gauche, droite)
```

### 2. Roues Réalistes

Chaque roue contient :
- **Jante** : Cylindre Ø 30cm
- **Moyeu métallique** : Cylindre Ø 5cm en fer
- **8 rayons** : Barres en bois disposées en étoile
- **Rotation** : Position à 30cm du sol

```typescript
<group position={[-0.7, 0.3, 0.8]}>  // Roue avant gauche
  <cylinderGeometry args={[0.3, 0.3, 0.15, 12]} />
  {/* 8 rayons */}
  {[...Array(8)].map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return <mesh rotation={[0, 0, angle]} />;
  })}
</group>
```

### 3. Enseigne avec Nom Catégorie

```typescript
<group position={[0, 1.8, 0]}>
  {/* Support vertical */}
  <cylinderGeometry args={[0.03, 0.03, 1, 8]} />

  {/* Panneau */}
  <boxGeometry args={[1.5, 0.4, 0.05]} />
  color="#F5DEB3"  // Beige parchemin

  {/* Bordure dorée */}
  <boxGeometry args={[1.55, 0.45, 0.02]} />
  color="#DAA520"  // Or
</group>
```

### 4. Produits Dynamiques

```typescript
{produits.map((produit, index) => {
  const row = Math.floor(index / 3);  // 2 rangées
  const col = index % 3;               // 3 colonnes
  const x = -0.6 + col * 0.6;
  const z = -0.4 + row * 0.8;

  return (
    <group position={[x, 0.7 + row * 0.3, z]}>
      {/* Boîte produit */}
      <boxGeometry args={[0.3, 0.3, 0.3]} />

      {/* Étiquette */}
      <boxGeometry args={[0.25, 0.15, 0.01]} />
    </group>
  );
})}
```

---

## 🔌 Intégration API

### Configuration

Fichier : `app/config/api.ts`

```typescript
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8007';

export const API_ENDPOINTS = {
  PRODUITS: 'api/magasin/',
  CATEGORIES: 'api/categories/',
};
```

### Variables d'Environnement

Créez `.env.local` :

```bash
NEXT_PUBLIC_API_URL=http://localhost:8007
```

### Endpoints Utilisés

```
GET /api/categories/
→ Retourne toutes les catégories avec hiérarchie

GET /api/magasin/
→ Retourne tous les produits avec infos catégories
```

---

## 📊 Disposition des Chariots dans la Scène

```
                  VILLAGE FRANÇAIS

                   [Maison Noble]

    Drapeau 👑                    👑 Drapeau

      🛒 Fruits          🛒 Fromages
      (-6, 0, 5)         (6, 0, 5)

               🛒 Vins
              (0, 0, 8)

      🛒 Pain            🛒 Poissons
      (-6, 0, 11)        (6, 0, 11)

    Drapeau ⚜️                     ⚜️ Drapeau

                 [Porte d'Entrée]
```

**5 chariots** au total :
1. Chariot Fruits & Légumes (gauche avant)
2. Chariot Fromages & Charcuterie (droite avant)
3. Chariot Vins & Boissons (centre)
4. Chariot Pain & Boulangerie (gauche arrière)
5. Chariot Poissons & Fruits de Mer (droite arrière)

---

## 🚀 Pour Tester

### 1. Vérifier que l'API Django tourne

```bash
# Dans votre backend Django
python manage.py runserver 8007
```

### 2. Lancer le Front

```bash
cd FrontLaProvidence
npm run dev
```

### 3. Vérifier les Endpoints

```bash
# Test catégories
curl http://localhost:8007/api/categories/

# Test produits
curl http://localhost:8007/api/magasin/
```

### 4. Ouvrir le Village 3D

```
http://localhost:3007
```

Les chariots chargeront automatiquement les données ! 🎉

---

## 🐛 Dépannage

### Les chariots sont vides ?

**Vérifiez** :
1. L'API Django est démarrée sur le port 8007
2. Les endpoints `/api/categories/` et `/api/magasin/` répondent
3. Les catégories ont des ID 1, 2, 3, 4, 5
4. Les produits ont un `categorie` qui correspond

**Console navigateur** (F12) :
```javascript
// Devrait afficher les données chargées
console.log('Catégorie:', categorie);
console.log('Produits:', produits);
```

### Erreur CORS ?

Ajoutez dans votre backend Django `settings.py` :

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3007",
]
```

### Les couleurs ne correspondent pas ?

Modifiez la fonction `getCouleurChariot()` dans `ChariotMedieval.tsx` :

```typescript
const getCouleurChariot = () => {
  if (!categorie) return '#8B4513';

  const nom = categorie.nom.toLowerCase();
  if (nom.includes('votre_categorie')) return '#VOTRE_COULEUR';

  return '#8B4513';
};
```

---

## 📈 Évolutions Futures

### Phase 2 : Filtrage par Sous-Catégorie

```typescript
// Filtrer par sous-catégorie au lieu de catégorie
const produitsCat = allProduits.filter(
  p => p.souscategorie === sousCategorieId
);
```

### Phase 3 : Textures Produits Réelles

```typescript
// Utiliser image_principale du produit
<meshStandardMaterial>
  <texture image={produit.image_principale} />
</meshStandardMaterial>
```

### Phase 4 : Animation de Rotation

```typescript
// Rotation lente des produits
const rotation = useRef(0);
useFrame(() => {
  rotation.current += 0.01;
  meshRef.current.rotation.y = rotation.current;
});
```

### Phase 5 : Tooltip au Survol

```typescript
// Afficher nom et prix au survol
<Html position={[0, 0.5, 0]}>
  <div className="tooltip">
    {produit.nom} - {produit.prix_ht}€
  </div>
</Html>
```

---

## 📝 Exemple Complet

### Créer un Nouveau Chariot

```typescript
// Dans Scene3D.tsx
<ChariotMedieval
  position={[0, 0, 14]}        // Position unique
  categorieId={6}              // Nouvelle catégorie
  onClick={() => {
    console.log('Chariot cliqué !');
    onFournisseurClick?.(6, 'Ma Nouvelle Catégorie');
  }}
/>
```

Le chariot va automatiquement :
1. ✅ Charger la catégorie ID 6
2. ✅ Afficher son nom sur l'enseigne
3. ✅ Charger les produits de cette catégorie
4. ✅ Les disposer sur le chariot
5. ✅ Adapter les couleurs selon le nom

---

## 🎉 Résultat

Votre village 3D a maintenant :
- 🛒 **5 chariots médiévaux** authentiques
- 🔌 **Connexion API** automatique
- 📦 **Produits dynamiques** affichés en 3D
- 🎨 **Couleurs intelligentes** par catégorie
- 🏰 **Ambiance médiévale** immersive
- 👑 **Drapeaux monarchiques** français

**Prêt pour votre e-commerce luxueux !** 🇫🇷🛒✨
