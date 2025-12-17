# 🔍 Diagnostic: Erreur 404 Panier

## 📊 Logs Actuels

```
[17/Dec/2025 11:43:16] "GET /api/categories/" 200 ✅
[17/Dec/2025 11:43:17] "GET /api/magasin/" 200 ✅
[17/Dec/2025 11:43:18] "POST /api/20/panier/" 404 ❌
```

**Analyse**: Les routes `/api/categories/` et `/api/magasin/` fonctionnent, mais `/api/20/panier/` retourne 404.

---

## ✅ Vérifications Effectuées

### 1. Routes Django (Backend)

**Fichier**: `ApiLaProvidence/back/api/urls.py`

**Ligne 45**:
```python
path('<int:pk_client>/panier/', panier_view, name='client-panier'),
```

✅ **Route correctement définie**

### 2. URL Racine

**Fichier**: `ApiLaProvidence/back/back/urls.py`

**Ligne 67**:
```python
path('api/', include('api.urls'))
```

✅ **Inclusion correcte**

**URL finale attendue**: `http://127.0.0.1:8000/api/20/panier/`

### 3. Frontend Service

**Fichier**: `FrontLaProvidence/app/services/PanierService.ts`

**Ligne 15**:
```typescript
return await this.get<Panier>(`api/${pk}/panier/`);
```

✅ **URL correcte** (relative à `http://127.0.0.1:8000`)

---

## 🔍 Causes Possibles

### Hypothèse 1: Client ID 20 n'existe pas

**Test**:
```bash
cd ApiLaProvidence/back
python manage.py shell
```

```python
from clients.models import Client

# Vérifier client ID 20
client = Client.objects.filter(pk=20).first()
print(f"Client 20: {client}")

# Lister tous les clients
clients = Client.objects.all()
for c in clients:
    print(f"ID: {c.pk}, User: {c.user.username if hasattr(c, 'user') else 'N/A'}")
```

**Si None**: Client 20 n'existe pas → Utiliser un ID valide

### Hypothèse 2: Vue panier_view non importée

**Vérifier**: `ApiLaProvidence/back/api/views.py`

La fonction `panier_view` doit exister:
```python
def panier_view(request, pk_client):
    # ...
```

### Hypothèse 3: CORS bloque la requête

**Vérifier**: `ApiLaProvidence/back/back/settings.py`

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Hypothèse 4: URL mal formée (slash final)

Django est sensible aux slashes finaux.

**Test manuel**:
```bash
# Avec slash
curl http://127.0.0.1:8000/api/20/panier/

# Sans slash
curl http://127.0.0.1:8000/api/20/panier
```

---

## 🛠️ Solutions

### Solution 1: Trouver le Bon Client ID

**Dans Django shell**:
```bash
cd ApiLaProvidence/back
python manage.py shell
```

```python
from clients.models import Client

# Trouver tous les clients
clients = Client.objects.all()
if clients.exists():
    premier_client = clients.first()
    print(f"Premier client ID: {premier_client.pk}")
else:
    print("Aucun client dans la base!")
    # Créer un client de test
    from django.contrib.auth.models import User
    user, created = User.objects.get_or_create(
        username='testclient',
        defaults={
            'email': 'test@test.com',
            'first_name': 'Test',
            'last_name': 'Client'
        }
    )
    if created:
        user.set_password('password123')
        user.save()

    client = Client.objects.create(
        user=user,
        nom='Test',
        prenom='Client',
        email='test@test.com'
    )
    print(f"Client créé avec ID: {client.pk}")
```

**Utiliser ce bon ID** dans le frontend:

`app/contexts/AuthContext.tsx`:
```typescript
// Remplacer temporairement l'ID par celui qui existe
const clientId = 1; // ou l'ID trouvé
```

---

### Solution 2: Vérifier la Vue Panier

**Fichier**: `ApiLaProvidence/back/api/views.py`

Rechercher:
```python
def panier_view(request, pk_client):
```

**Si la fonction n'existe pas**, la créer:

```python
from rest_framework.decorators import api_view
from rest_framework.response import Response
from paniers.models import Panier, LignePanier

@api_view(['GET', 'POST'])
def panier_view(request, pk_client):
    """
    GET: Récupère le panier du client
    POST: Ajoute un produit au panier
    """
    try:
        # Récupérer ou créer le panier
        panier, created = Panier.objects.get_or_create(
            client_id=pk_client,
            defaults={'etat': 'en_cours'}
        )

        if request.method == 'GET':
            # Serializer à importer
            from api.serializers import PanierSerializer
            serializer = PanierSerializer(panier)
            return Response(serializer.data)

        elif request.method == 'POST':
            produit_id = request.data.get('produit_id')
            quantite = request.data.get('quantite', 1)

            # Ajouter au panier
            ligne, created = LignePanier.objects.get_or_create(
                panier=panier,
                produit_id=produit_id,
                defaults={'quantite': quantite}
            )

            if not created:
                ligne.quantite += quantite
                ligne.save()

            # Retourner le panier mis à jour
            from api.serializers import PanierSerializer
            serializer = PanierSerializer(panier)
            return Response(serializer.data)

    except Exception as e:
        return Response({'error': str(e)}, status=400)
```

---

### Solution 3: Test Direct de la Route

**Navigateur**:
```
http://127.0.0.1:8000/api/20/panier/
```

**Résultats possibles**:
- **404**: Route introuvable → Problème URL
- **401/403**: Authentification requise → Problème auth
- **500**: Erreur serveur → Voir logs Django
- **JSON**: Fonctionne! → Problème frontend

---

### Solution 4: Activer les Logs Django Détaillés

**Fichier**: `ApiLaProvidence/back/back/settings.py`

Ajouter:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

Relancer Django:
```bash
python manage.py runserver
```

**Les logs afficheront** toutes les requêtes et les erreurs détaillées.

---

## 🚀 Solution Temporaire (Contournement)

En attendant de résoudre le backend, désactiver l'ajout au panier:

**Fichier**: `app/components/Village3D/CategorieModal.tsx`

**Ligne 80-102**, remplacer par:
```typescript
const handleAjouterAuPanier = async (produitId: number) => {
  // SIMULATION TEMPORAIRE
  console.log('🛒 Ajout au panier (simulation):', produitId);

  setAddedProducts(prev => new Set(prev).add(produitId));

  // Feedback visuel
  alert(`Produit ${produitId} ajouté au panier (simulation)`);

  setTimeout(() => {
    setAddedProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(produitId);
      return newSet;
    });
  }, 2000);

  // L'appel API est commenté temporairement
  /*
  if (!isAuthenticated) {
    alert('Vous devez être connecté');
    return;
  }

  try {
    await ajouterProduit(produitId, 1);
    setAddedProducts(prev => new Set(prev).add(produitId));
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(produitId);
        return newSet;
      });
    }, 2000);
  } catch (error) {
    console.error('Erreur ajout panier:', error);
    alert('Erreur lors de l\'ajout au panier');
  }
  */
};
```

---

## 📋 Checklist de Débogage

- [ ] Django serveur lancé (`python manage.py runserver`)
- [ ] Vérifier client ID 20 existe (Django shell)
- [ ] Tester URL directement: `http://127.0.0.1:8000/api/20/panier/`
- [ ] Vérifier logs Django pour erreur détaillée
- [ ] Vérifier `panier_view` existe dans `api/views.py`
- [ ] Vérifier CORS configuré
- [ ] Tester avec cURL ou Postman

---

## 🎯 Prochaines Étapes

1. **Lancer Django en mode debug**:
   ```bash
   cd ApiLaProvidence/back
   python manage.py runserver --verbosity 3
   ```

2. **Ouvrir Django shell** et vérifier client:
   ```bash
   python manage.py shell
   ```
   ```python
   from clients.models import Client
   Client.objects.filter(pk=20).exists()
   ```

3. **Tester route directement** dans navigateur:
   ```
   http://127.0.0.1:8000/api/20/panier/
   ```

4. **Regarder les logs** Django après le test

5. **Partager les logs** pour diagnostic approfondi

---

**Note**: Cette erreur n'empêche pas le village 3D de fonctionner. C'est uniquement l'ajout au panier qui est bloqué temporairement.
