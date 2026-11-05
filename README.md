# Poc1 · MDM - Gestion de chaînes de référence

Prototype de démonstration avec données fictives, publié par GitHub Pages.

## Fonctionnalités

- Création en quatre étapes, en sélectionnant directement un niveau de l'arborescence, puis les termes, les dates et zéro ou plusieurs types d'indexation.
- Recherche par terme ou référence, filtres multisélection des types d'indexation et états `HI - Historique`, `VA - Validé`, `EC - En cours`.
- Répertoire triable en ordre croissant ou décroissant depuis les en-têtes des colonnes.
- Crayon par chaîne pour modifier les types d'indexation, les dates de validité et l'état. `Date dernière modification` est générée automatiquement lors de chaque modification.
- Exploration arborescente et graphe des relations.
- Tableau de bord avec huit statistiques calculées en Python : nombre de termes différents, nombre total de maillons, nombre de chaînes différentes, distribution des chaînes par nombre de maillons, longueurs minimale et maximale, distribution par type d’indexation et nombre de chaînes créées par mois. La statistique par langue (LNG) n’est pas affichée. Une chaîne ayant plusieurs types est comptée pour chacun.

## Statistiques Python

Le script `scripts/build_stats.py` produit `data/stats.json` lors du déploiement GitHub Pages. Après la création ou modification d'une chaîne locale, Pyodide exécute le **même** code Python dans le navigateur pour recalculer les indicateurs sans serveur supplémentaire. Le chargement initial de Pyodide requiert une connexion Internet.

Pour produire les statistiques localement :

```bash
python3 scripts/build_stats.py
python3 -m http.server 8000
```

Les dates `created_at` de la base de démonstration sont fictives. `Nombre de chaînes créées par mois` montre le nombre créé pendant le mois en cours (UTC) et permet de consulter la répartition mensuelle, sans pourcentage. La distribution par nombre de maillons utilise la profondeur des chaînes, y compris leur niveau racine.

## Sauvegarde et limites

Le bouton `Sauvegarder` ainsi que l'édition au crayon enregistrent automatiquement les changements dans `localStorage`, sur le navigateur actif. Les changements sont restaurés au rechargement du site, y compris pour les chaînes initiales du JSON. Ils ne sont **ni synchronisés** entre ordinateurs, ni écrits dans GitHub ou dans l'instance institutionnelle MDM.

Cette architecture sert aux démonstrations. Une application partagée en production nécessiterait un backend authentifié, une persistence centrale, des contrôles d'accès et un audit. N'utilisez pas de données personnelles ou institutionnelles confidentielles dans ce prototype.
