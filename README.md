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

