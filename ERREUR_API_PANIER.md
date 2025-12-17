# 🔧 Fix: Erreur API Panier 404

## ❌ Erreur Actuelle

```
[17/Dec/2025 11:19:45] "POST /api/20/panier/ HTTP/1.1" 404 25
```

**Traduction**: Le frontend tente d'ajouter un produit au panier via `POST /api/20/panier/` mais le backend renvoie une erreur 404 (route introuvable).

---

## 🔍 Cause du Problème

Le client avec l'ID **20** n'existe peut-être pas dans la base de données, OU la route backend n'est pas correctement configurée.

---

## ✅ Solutions

### Solution 1: Vérifier la Route Backend (Django)

1. **Ouvrir le fichier des URLs du backend**:
   ```
   BackendLaProvidence/app/urls.py
   ```

2. **Vérifier que cette route existe**:
   ```python
   from django.urls import path
   from . import views

   urlpatterns = [
       # ... autres routes ...

       # Route pour le panier
       path('api/<int:pk_client>/panier/', views.panier_view, name='panier'),

       # Ou peut-être:
       path('api/panier/', views.panier_view, name='panier'),
   ]
   ```

3. **Si la route manque, l'ajouter**:
   ```python
   path('api/<int:pk_client>/panier/', views.PanierViewSet.as_view({
       'get': 'retrieve',
       'post': 'create',
       'put': 'update',
       'delete': 'destroy'
   }), name='panier'),
   ```

---

### Solution 2: Vérifier que le Client Existe

1. **Dans le terminal Django**:
   ```bash
   cd BackendLaProvidence
   python manage.py shell
   ```

2. **Vérifier l'existence du client**:
   ```python
   from app.models import Client

   # Vérifier si client ID 20 existe
   client = Client.objects.filter(pk=20).first()
   print(client)  # Doit afficher le client, ou None

   # Si None, créer un client de test:
   if not client:
       from django.contrib.auth.models import User
       user = User.objects.first()  # Ou créer un nouvel user
       client = Client.objects.create(
           user=user,
           nom="Test",
           prenom="Client",
           email="test@test.com"
       )
       print(f"Client créé avec ID: {client.pk}")
   ```

---

### Solution 3: Vérifier l'Authentification

Le panier nécessite peut-être une authentification.

1. **Ouvrir les DevTools du navigateur** (F12)
2. **Onglet Network**
3. **Cliquer sur la requête POST `/api/20/panier/`**
4. **Vérifier les Headers**:
   ```
   Authorization: Bearer [token]
   ```

Si le token manque:

**Dans `app/contexts/PanierContext.tsx`**, vérifier:
```typescript
const rechargerPanier = async () => {
  if (!isAuthenticated) return;  // ← Doit être true

  // ...
}
```

---

### Solution 4: Vérifier le Backend en Direct

1. **Lancer le serveur Django**:
   ```bash
   cd BackendLaProvidence
   python manage.py runserver
   ```

2. **Tester la route dans le navigateur**:
   ```
   http://127.0.0.1:8000/api/20/panier/
   ```

3. **Résultats possibles**:

   - **404**: La route n'existe pas → Solution 1
   - **401/403**: Problème d'authentification → Solution 3
   - **500**: Erreur serveur → Voir logs Django
   - **200 + JSON**: Ça marche! Problème frontend

---

### Solution 5: Logs Django Détaillés

1. **Dans `BackendLaProvidence/settings.py`**, activer les logs:
   ```python
   LOGGING = {
       'version': 1,
       'disable_existing_loggers': False,
       'handlers': {
           'console': {
               'class': 'logging.StreamHandler',
           },
       },
       'root': {
           'handlers': ['console'],
           'level': 'INFO',
       },
       'loggers': {
           'django': {
               'handlers': ['console'],
               'level': 'DEBUG',
               'propagate': False,
           },
       },
   }
   ```

2. **Relancer Django**:
   ```bash
   python manage.py runserver
   ```

3. **Les logs afficheront** les requêtes reçues et les erreurs

---

## 🔧 Fix Rapide Frontend (Contournement)

Si le backend n'est pas encore prêt, désactiver temporairement l'ajout au panier:

**Dans `app/components/Village3D/CategorieModal.tsx`**:

```typescript
const handleAjouterAuPanier = async (produitId: number) => {
  if (!isAuthenticated) {
    alert('Vous devez être connecté pour ajouter des produits au panier');
    return;
  }

  // TEMPORAIRE: Simuler l'ajout
  console.log('Produit ajouté (simulation):', produitId);
  alert('Produit ajouté au panier (simulation)');
  setAddedProducts(prev => new Set(prev).add(produitId));

  setTimeout(() => {
    setAddedProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(produitId);
      return newSet;
    });
  }, 2000);

  // Commenter temporairement l'appel API:
  /*
  try {
    await ajouterProduit(produitId, 1);
    // ...
  } catch (error) {
    // ...
  }
  */
};
```

---

## 📋 Checklist de Débogage

- [ ] Backend Django lancé (`python manage.py runserver`)
- [ ] Route `/api/<pk>/panier/` existe dans `urls.py`
- [ ] Client ID 20 existe dans la base de données
- [ ] Utilisateur authentifié (token présent)
- [ ] CORS configuré pour accepter frontend
- [ ] Logs Django activés pour voir erreurs
- [ ] Tester route directement dans navigateur

---

## 🚀 Test de la Route Backend

### Avec cURL:

```bash
# GET - Récupérer le panier
curl -X GET http://127.0.0.1:8000/api/20/panier/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# POST - Ajouter un produit
curl -X POST http://127.0.0.1:8000/api/20/panier/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"produit_id": 123, "quantite": 1}'
```

### Avec Postman/Insomnia:

1. **Créer requête POST**
2. **URL**: `http://127.0.0.1:8000/api/20/panier/`
3. **Headers**:
   ```
   Authorization: Bearer [votre_token]
   Content-Type: application/json
   ```
4. **Body (JSON)**:
   ```json
   {
     "produit_id": 145,
     "quantite": 1
   }
   ```
5. **Send**

---

## 📞 Prochaines Étapes

1. **Vérifier logs Django** pour voir l'erreur exacte
2. **Vérifier que la route existe** dans `urls.py`
3. **Vérifier le client ID 20** dans la base
4. **Tester la route directement** avec cURL ou navigateur
5. **Si toujours 404**, partager le fichier `urls.py` backend

---

## 💡 Note

Cette erreur 404 est **normale** si:
- Le backend n'est pas encore développé pour cette route
- L'API a une structure différente que celle attendue
- Le client n'existe pas

**Ce n'est pas un problème du village 3D**, mais de la connexion backend. Le village et le modal fonctionnent correctement côté frontend!

---

**Besoin d'aide?** Vérifiez d'abord les logs Django, puis le fichier `BackendLaProvidence/app/urls.py`.
