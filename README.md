# poc1
Process Mock-up

## Statistiques du dashboard (Python)

Les indicateurs sont calculés **exclusivement par Python** dans `scripts/build_stats.py` et produits sous forme de `data/stats.json` à chaque déploiement GitHub Pages. Le navigateur ne calcule pas ces indicateurs : il affiche seulement les résultats pré-calculés dans des vignettes compactes et des fenêtres détaillées.

Pour recalculer en local :

```bash
python3 scripts/build_stats.py
python3 -m http.server 8000
```

Le script est autonome, sans dépendances externes, et ne modifie pas `chains.json`.

**Définitions :** un mot-clé distinct correspond à un libellé exact, accents compris. Un *maillon distinct* est provisoirement une paire ordonnée de termes voisins. Les chaînes distinctes sont les séquences complètes uniques. La longueur est le nombre de termes de la chaîne et le domaine est dérivé du premier niveau.

**Limites :** la répartition par langue (LNG), les maillons orphelins et les synonymes/variantes sont signalés « À compléter », car le modèle de données ne contient pas les référentiels nécessaires. Ne pas interpréter ces absences comme des zéros. Les dates de création sont fictives. Les chaînes enregistrées dans le `localStorage` du navigateur ne sont **pas** incluses dans les indicateurs Python tant qu'elles ne sont pas ajoutées dans le JSON du dépôt et redéployées.



## Mode démonstration : sauvegarde immédiate et analyses Python

Le bouton **Sauvegarder** enregistre directement la nouvelle chaîne dans le stockage local du navigateur, sans GitHub Issues ni étape de validation. Les nouvelles chaînes sont accessibles immédiatement dans le répertoire, l'arborescence et le graphe.

Le tableau de bord utilise le même algorithme de statistiques Python dans deux contextes : GitHub Actions génère `data/stats.json` à partir des données publiques versionnées ; pour les nouvelles chaînes locales, Pyodide exécute directement `scripts/build_stats.py` dans le navigateur et recalcule les indicateurs. Pyodide est chargé depuis un CDN lors du premier calcul local, ce qui nécessite une connexion internet et peut prendre un moment. Aucun programme n'est à installer.

**Limite importante pour la présentation :** les chaînes ajoutées localement restent sur ce navigateur et ne se synchronisent pas entre utilisateurs ni appareils. Ce mode est adapté à une démonstration individuelle, mais une application multi-utilisateur avec des données partagées nécessitera un service de persistance sécurisé (backend + authentification). Les données réelles et confidentielles ne doivent pas être enregistrées dans ce prototype public.
