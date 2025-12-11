# 🏛️ Page d'accueil Luxe Client - La Providence

## 📋 Vue d'ensemble

J'ai créé une nouvelle page d'accueil moderne et luxueuse pour le front-end client qui met en valeur :
- ✅ **Les catégories hiérarchiques** (Catégorie > Sous-catégorie > Sous-sous-catégorie)
- ✅ **Les producteurs locaux** avec une carte interactive Leaflet
- ✅ **Les produits nouveautés** et **promotions**
- ✅ **Un design premium** inspiré du luxe et du terroir local
- ✅ **Des statistiques en temps réel** (produits, producteurs, catégories)

---

## 🎨 Caractéristiques principales

### 1. Hero Section avec Statistiques
- **Vidéo de fond** (HomeLaProvidence.mp4)
- Overlay sombre pour améliorer la lisibilité
- Titre majestueux avec effets d'animation
- **Statistiques en temps réel** :
  - Nombre total de produits
  - Nombre de producteurs
  - Nombre de catégories

### 2. Section Catégories Hiérarchiques
- **Grille responsive** adaptable (1 à 3 colonnes selon l'écran)
- **Cartes élégantes** avec :
  - Nom de la catégorie et nombre de produits
  - Liste des sous-catégories (4 premières + compteur)
  - Bouton "Explorer" avec animation
- **Effet hover** : Élévation 3D et bordure dorée

### 3. Carte Interactive des Producteurs
- **Carte Leaflet** affichant les producteurs français
- **Marqueurs personnalisés** avec icône personnalisée (emoji blé)
- **Liste latérale** des producteurs avec :
  - Nom, métier, ville
  - Scrollable si plus de 12 producteurs
- **Interaction** : Clic sur un marqueur ouvre une popup avec infos

### 4. Carrousels de Produits
- **Nouveautés** : 6 premiers produits
- **Promotions** : 6 produits suivants avec badge rouge
- **Design** : Cartes produits avec image, prix, catégorie
- **Responsive** : S'adapte automatiquement à la taille d'écran

### 5. Call to Action Final
- Design impactant sur fond dégradé
- 2 boutons principaux :
  - "Découvrir les produits"
  - "Rencontrer les producteurs"

---

## 🚀 Installation et Configuration

### Étape 1 : Installation des dépendances back-end

Aucune nouvelle dépendance Python n'est requise. Les modifications utilisent Django REST Framework déjà installé.

### Étape 2 : Migrations de la base de données

Aucune migration n'est nécessaire car nous utilisons les modèles existants.

### Étape 3 : Tester les nouveaux endpoints API

Vérifiez que les nouveaux endpoints fonctionnent :

```bash
# Backend
cd ApiLaProvidence/back
python manage.py runserver

# Testez les endpoints (dans un autre terminal)
curl http://localhost:8000/api/categories
curl http://localhost:8000/api/fournisseurs
```

### Étape 4 : Vérifier la vidéo de fond

La vidéo `HomeLaProvidence.mp4` a été copiée dans le dossier `public/` du front-end. Assurez-vous qu'elle existe :

```bash
ls -lh FrontLaProvidence/public/HomeLaProvidence.mp4
```

Si le fichier n'existe pas, copiez-le depuis le back-end :

```bash
cp ApiLaProvidence/back/web/static/image/HomeLaProvidence.mp4 FrontLaProvidence/public/
```

### Étape 5 : Lancer le front-end

```bash
cd FrontLaProvidence
npm install  # Si pas déjà fait
npm run dev
```

Puis accédez à `http://localhost:3000` pour voir la nouvelle page d'accueil.

---

## 📁 Fichiers créés/modifiés

### Back-end (Django)

#### 1. `/ApiLaProvidence/back/api/serializers.py`
**Ajouté** : Serializers pour les catégories avec hiérarchie complète
```python
- SousSousCategorieSerializer
- SousCategorieSerializer
- CategorieSerializer
```

#### 2. `/ApiLaProvidence/back/api/views.py`
**Ajouté** : Vues API pour catégories et fournisseurs publics
```python
- categories_view()  # GET /api/categories
- fournisseurs_view()  # GET /api/fournisseurs
```

#### 3. `/ApiLaProvidence/back/api/urls.py`
**Ajouté** : Routes pour les nouveaux endpoints
```python
path('categories', categories_view, name='categories')
path('fournisseurs', fournisseurs_view, name='fournisseurs')
```

### Front-end (Next.js)

#### 1. `/FrontLaProvidence/app/services/CategoriesService.ts`
**Nouveau fichier** : Service pour récupérer les catégories
```typescript
getCategories(): Promise<Categorie[]>
```

#### 2. `/FrontLaProvidence/app/services/FournisseursService.ts`
**Nouveau fichier** : Service pour récupérer les fournisseurs
```typescript
getFournisseurs(): Promise<Fournisseur[]>
```

#### 3. `/FrontLaProvidence/app/services/types.ts`
**Modifié** : Types mis à jour pour catégories et fournisseurs
```typescript
- SousSousCategorie
- SousCategorie
- Categorie (avec souscategories)
- Fournisseur (avec coordonnées GPS)
```

#### 4. `/FrontLaProvidence/app/services/index.ts`
**Modifié** : Export des nouveaux services
```typescript
export { CategoriesService }
export { FournisseursService }
```

#### 5. `/FrontLaProvidence/app/page.tsx`
**Remplacé** : Nouvelle page d'accueil luxe complète
- Hero section avec animations
- Section statistiques
- Grille de catégories
- Carte interactive des producteurs
- Carrousels de produits (nouveautés et promos)
- Section CTA

#### 6. `/FrontLaProvidence/app/components/MapComponent.tsx`
**Nouveau fichier** : Composant carte Leaflet
- Chargement dynamique de Leaflet (évite SSR)
- Marqueurs personnalisés
- Popups avec infos producteurs
- Gestion des coordonnées manquantes

#### 7. `/FrontLaProvidence/app/page_old.tsx`
**Backup** : Ancienne version de la page d'accueil

---

## 🎨 Personnalisation

### Couleurs

Les couleurs sont définies avec CSS-in-JS :
```css
--color-gold: #c9a961;           /* Or */
--color-dark-gold: #a68840;      /* Or foncé */
--color-deep-blue: #1e3a5f;     /* Bleu profond */
--color-cream: #f8f6f0;          /* Crème */
--color-light-cream: #faf8f2;   /* Crème clair */
--color-brown: #2c2416;          /* Marron */
```

Pour changer la palette, modifiez ces valeurs dans `page.tsx`.

### Nombre d'éléments affichés

Dans `page.tsx`, modifiez les limites :
```typescript
setCategories(categoriesData.slice(0, 6));      // ← Changer 6
setFournisseurs(fournisseursData.slice(0, 12)); // ← Changer 12
setProduitsNouveautes(produitsData.slice(0, 6)); // ← Changer 6
```

### Style de la carte

Dans `MapComponent.tsx`, modifiez l'URL de la tuile Leaflet :
```typescript
// Style actuel : Voyager (élégant)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', ...)

// Alternatives :
// Style sombre (luxe)
'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

// Style clair
'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
```

---

## 🗺️ Configuration de la carte

### Ajouter les coordonnées des producteurs

Pour que les producteurs apparaissent à leur vraie position :

1. **Via l'admin Django** :
   - Aller sur `/admin/fournisseur/fournisseur/`
   - Éditer un fournisseur
   - Remplir `latitude` et `longitude`

2. **Automatiquement via géocodage** :
   Utilisez le script de géocodage du README back-end.

### Carte sans coordonnées

Si les producteurs n'ont pas de coordonnées, ils sont placés **aléatoirement en France** pour démonstration. C'est géré automatiquement dans `MapComponent.tsx`.

---

## 📱 Responsive Design

La page est entièrement responsive :

- **Desktop (>1024px)** : Grille 3 colonnes, carte à côté de la liste
- **Tablet (768-1024px)** : Grille 2 colonnes, carte empilée
- **Mobile (<768px)** : Grille 1 colonne, navigation verticale

---

## 🔧 Dépannage

### Problème : La carte ne s'affiche pas

1. Vérifiez la console du navigateur (F12) pour les erreurs
2. Assurez-vous que Leaflet se charge correctement
3. Vérifiez que le composant est importé dynamiquement (SSR désactivé)

### Problème : Les catégories ne s'affichent pas

1. Vérifiez que le back-end tourne : `http://localhost:8000/api/categories`
2. Vérifiez qu'il y a des catégories actives dans la base de données
3. Ouvrez la console du navigateur pour voir les erreurs

### Problème : CORS errors

Si vous voyez des erreurs CORS, ajoutez dans `back/back/settings.py` :
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Problème : Produits ne se chargent pas

1. Testez l'API : `http://localhost:8000/api/magasin`
2. Vérifiez que des produits actifs existent en base
3. Consultez la console du navigateur

---

## 🎯 Prochaines améliorations possibles

### Fonctionnalités avancées

1. **Filtre en temps réel** par catégorie, prix, label
2. **Animation d'entrée au scroll** (AOS.js, Framer Motion)
3. **Carrousel automatique** avec Swiper.js
4. **Recherche en temps réel** dans les produits
5. **Mode sombre** pour l'interface

### Backend

1. **Endpoint pour nouveautés** : `/api/magasin/nouveautes`
2. **Endpoint pour promotions** : `/api/magasin/promotions`
3. **Filtrage avancé** : prix, labels, régions
4. **Pagination** pour grandes listes

### SEO

1. Métadonnées dynamiques avec Next.js metadata API
2. Schema.org pour les produits
3. Sitemap XML
4. Open Graph tags

---

## 📚 Technologies utilisées

### Back-end
- **Django REST Framework** : API endpoints
- **Django ORM** : Queries optimisées (prefetch_related, select_related)

### Front-end
- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Type safety
- **Leaflet 1.9.4** : Carte interactive
  - Documentation : https://leafletjs.com/
- **CSS-in-JS** : Styled JSX pour le styling
- **CSS Grid & Flexbox** : Layout responsive

---

## 🎨 Palette de couleurs

| Couleur | Hex | Usage |
|---------|-----|-------|
| Or | `#c9a961` | Accents, boutons, badges |
| Or foncé | `#a68840` | Hover, bordures |
| Bleu profond | `#1e3a5f` | Titres, fonds sombres |
| Crème | `#f8f6f0` | Fonds clairs, cartes |
| Crème clair | `#faf8f2` | Backgrounds alternatifs |
| Marron | `#2c2416` | Textes foncés, overlay |

---

## 🎉 Résumé

Vous disposez maintenant d'une page d'accueil client :
- ✅ Moderne et luxueuse
- ✅ Affichant les catégories hiérarchiques
- ✅ Avec carte interactive des producteurs
- ✅ Incluant nouveautés et promotions
- ✅ Responsive et performante
- ✅ Facile à personnaliser
- ✅ Intégrée avec l'API back-end

La page utilise le même style visuel que la page fournisseur mais avec une orientation client/consommateur pour permettre la découverte et l'achat de produits locaux !

---

## 📝 Différences avec la page fournisseur

| Aspect | Page Fournisseur | Page Client |
|--------|------------------|-------------|
| **Technologie** | Django templates | Next.js/React |
| **Vidéo de fond** | Oui (HomeLaProvidence.mp4) | Oui (HomeLaProvidence.mp4) ✅ |
| **Style** | Server-side rendering | Client-side rendering |
| **Carte** | Leaflet inline | Composant React séparé |
| **Navigation** | Liens Django | Next.js Link |
| **Styling** | CSS externe | CSS-in-JS (styled-jsx) |
| **Thème** | Couleurs fixes | Système de thème dynamique ✅ |

---

## 📞 Support

Pour toute question ou personnalisation :
1. Consultez ce README
2. Vérifiez les commentaires dans le code
3. Testez les exemples fournis
4. Consultez la documentation Leaflet pour la carte
