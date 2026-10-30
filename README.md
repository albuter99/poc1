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


## Sauvegarder une nouvelle chaîne sans service externe

La création persistante utilise **GitHub Issues + GitHub Actions**, sans Cloudflare, serveur supplémentaire, token dans le navigateur ni installation locale.

1. Depuis Poc1, créez une chaîne et cliquez sur **Sauvegarder**.
2. Une page préremplie `New issue` s'ouvre sur GitHub. Connectez-vous avec **albuter99**.
3. Vérifiez le contenu et cliquez sur **Submit new issue**. Cette confirmation est indispensable : ouvrir simplement la page ne sauvegarde rien.
4. Le workflow `.github/workflows/save-chain.yml` vérifie l'auteur de la demande, contrôle les termes et dates, attribue un nouvel identifiant REF, met à jour `data/chains.json`, recalcule les statistiques **en Python** et publie GitHub Pages.
5. L'issue est commentée et fermée lorsque le workflow réussit. Rechargez Poc1 après le déploiement.

**Sécurité :** le workflow n'enregistre une chaîne que si l'issue a été créée par le propriétaire du dépôt. Les autres issues ne modifient rien. Les données de la demande sont publiques, car le dépôt est public. N'utilisez **que des données fictives et non confidentielles**.

**Brouillons existants :** les entrées créées précédemment et conservées dans `localStorage` restent accessibles comme `LOCAL-xxxx` et apparaissent avec un bouton **Publier**. Elles ne seront pas intégrées au JSON tant que vous n'aurez pas confirmé leur issue. La publication et les statistiques Python ne sont pas instantanées.

**Limites :** le site statique ne peut pas confirmer lui-même que GitHub a accepté l'issue. Les créations issues d'un préfixe qui n'existe pas encore dans le JSON sont rejetées tant que la chaîne parent n'est pas publiée. Le fichier JSON est l'unique source partagée.

