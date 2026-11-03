# Poc1 · MDM - Gestion de chaînes de référence

Prototype de démonstration avec données fictives, publié par GitHub Pages.

## Fonctionnalités

- Création en quatre étapes, en sélectionnant directement un niveau de l'arborescence, puis les termes, les dates et zéro ou plusieurs types d'indexation.
- Recherche par terme ou référence, filtres multisélection des types d'indexation et états `HI - Historique`, `VA - Validé`, `EC - En cours`.
- Répertoire triable en ordre croissant ou décroissant depuis les en-têtes des colonnes.
- Crayon par chaîne pour modifier les types d'indexation, les dates de validité et l'état. `Date dernière modification` est générée automatiquement lors de chaque modification. La `Date de défaut` reste vide lorsqu'elle n'est pas définie.
- Exploration arborescente et graphe des relations.
- Tableau de bord avec sept statistiques calculées uniquement en Python : termes distincts, nombre total de termes (occurrences), chaînes distinctes, longueur minimale et maximale des chaînes, longueur par langue (en attente de données LNG), répartition par type d'indexation et nombre de chaînes créées ce mois-ci. Une chaîne ayant plusieurs types contribue à chacun d'eux.

## Statistiques Python

Le script `scripts/build_stats.py` produit `data/stats.json` lors du déploiement GitHub Pages. Après la création ou modification d'une chaîne locale, Pyodide exécute le **même** code Python dans le navigateur pour recalculer les indicateurs sans serveur supplémentaire. Le chargement initial de Pyodide requiert une connexion Internet.

Pour produire les statistiques localement :

```bash
python3 scripts/build_stats.py
python3 -m http.server 8000
```

Les dates `created_at` de la base de démonstration sont fictives. `Nouvelles entrées ce mois` compte les chaînes dont la date de création est dans le mois actuel, en UTC, sans pourcentage. Les langues LNG ne sont pas renseignées par chaîne et l'indicateur correspondant reste indisponible.

## Sauvegarde et limites

Le bouton `Sauvegarder` ainsi que l'édition au crayon enregistrent automatiquement les changements dans `localStorage`, sur le navigateur actif. Les changements sont restaurés au rechargement du site, y compris pour les chaînes initiales du JSON. Ils ne sont **ni synchronisés** entre ordinateurs, ni écrits dans GitHub ou dans l'instance institutionnelle MDM.

Cette architecture sert aux démonstrations. Une application partagée en production nécessiterait un backend authentifié, une persistence centrale, des contrôles d'accès et un audit. N'utilisez pas de données personnelles ou institutionnelles confidentielles dans ce prototype.
