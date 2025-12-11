# 🔧 Guide de dépannage CSS

## Problème : Les styles ne s'affichent pas correctement

### ✅ Solutions appliquées

1. **Tailwind CSS configuré**
   - `tailwind.config.js` créé
   - `postcss.config.js` créé
   - Directives @tailwind ajoutées dans globals.css

2. **Variables CSS corrigées**
   - Toutes les anciennes variables remplacées par les nouvelles
   - Format: `var(--color-*)` au lieu de `var(--font-*)`

3. **ThemeProvider corrigé**
   - Suppression du blocage de rendu `if (!mounted)`
   - Les variables CSS sont injectées au chargement

4. **Cache nettoyé**
   - Dossier `.next` supprimé

### 🚀 Comment vérifier que ça fonctionne

1. **Ouvrir http://localhost:3007**

2. **Vérifier dans DevTools (F12)**
   ```javascript
   // Console
   getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
   // Devrait retourner: #0055A4 (bleu France)
   ```

3. **Changer de thème**
   - Cliquer sur le sélecteur de thème en haut à droite
   - La page devrait changer de couleurs immédiatement

### 📝 Si ça ne fonctionne toujours pas

#### Option 1: Hard Refresh
```bash
# Dans le navigateur:
Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows/Linux)
```

#### Option 2: Rebuild complet
```bash
cd /Users/diego-negrier/SynologyDrive/APPLICATION_PROJET/ProjetLaProvidence/FrontLaProvidence
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

#### Option 3: Vérifier que Tailwind compile
```bash
npx tailwindcss -i ./app/globals.css -o ./test-output.css --watch
```

### 🎨 Thèmes disponibles

- **France** 🇫🇷 - Bleu/Blanc/Rouge tricolore
- **Royauté** 👑 - Violet royal et or
- **Église** ⛪ - Rouge cardinal et beige
- **Nature** 🌿 - Vert forêt et terre

### 📁 Fichiers importants

- `app/globals.css` - Styles globaux + Tailwind
- `app/contexts/ThemeContext.tsx` - Gestion des thèmes
- `app/layout.tsx` - Layout principal avec ThemeProvider
- `tailwind.config.js` - Configuration Tailwind
- `postcss.config.js` - Configuration PostCSS

### 🐛 Debug

Si les styles ne s'appliquent pas, vérifier dans l'ordre:

1. Le fichier `globals.css` est-il importé dans `layout.tsx` ? ✅
2. Les variables CSS sont-elles définies dans `:root` ? ✅
3. Le ThemeProvider enveloppe-t-il bien l'application ? ✅
4. Tailwind est-il installé ? ✅
5. Le cache `.next` a-t-il été vidé ? ✅

### 💡 Astuce

Pour voir les variables CSS appliquées en temps réel:
```javascript
// Dans la console du navigateur
Object.entries(getComputedStyle(document.documentElement))
  .filter(([key]) => key.startsWith('--color'))
  .forEach(([key, value]) => console.log(key, ':', value))
```
