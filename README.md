# GitHub Pages : choisir la branche à publier

Le dépôt propose **deux modes alternatifs** pour un seul site `https://albuter99.github.io/poc1/`. La configuration Pages est globale au dépôt.

### Publier le POC expérimental (sans Actions)

1. Ouvrir **Settings > Pages** du dépôt GitHub.
2. Dans **Build and deployment > Source**, choisir **Deploy from a branch**.
3. Dans **Branch**, choisir `prototype-excel-multilingue-es-en`, puis **/ (root)**, et cliquer **Save**.
4. Une fois GitHub Pages mis à jour, accéder à `https://albuter99.github.io/poc1/relations.html` pour le modèle de données ou à l'accueil pour le POC.

Les fichiers nécessaires sont déjà dans cette branche, y compris `data/stats.json`, `.nojekyll` et les fragments du corpus Excel. Aucun workflow de déploiement n'est requis dans cette branche.

### Revenir au POC principal (avec Actions)

1. Ouvrir **Settings > Pages**.
2. Remplacer **Deploy from a branch** par **GitHub Actions**.
3. Ouvrir **Actions > Deploy GitHub Pages** et lancer **Run workflow**, branche **main**, si un déploiement n'est pas déclenché automatiquement.
4. Le fichier `.github/workflows/pages.yml` de `main` génère les statistiques puis publie le POC original.

Attention : les deux modes ne publient **pas simultanément** deux URL différentes. Changer de source remplace le site accessible à l'adresse Pages du dépôt, mais ne modifie ni ne fusionne les branches. Le contenu principal reste dans `main`.

---

## Contrôle des données et des maillons (12/11/2026)

Le corpus Excel expérimental est conservé dans `data/excel-indexations-00.json` à `data/excel-indexations-14.json`. Son contrôle complet couvre **5 839 indexations**, dont **4 203 chaînes structurées** et **1 636 textes libres Objet**. Les **992 textes Objet** autrefois découpés à tort ont été réunis en un maillon chacun. Les **162 libellés structurés** comportant des séparateurs non canoniques ont été harmonisés et **3 maillons structurés** ont été nettoyés de sauts de ligne parasites.

- `original_text` est la source conservée sans changement, y compris les notes de type « Activité ou produit visés » lorsqu'elles y figurent.
- `indexation_text_fr` est le libellé français canonique de l'indexation, avec ` - ` entre les maillons structurés.
- `maillons_fr` conserve chaque terme structuré dans un élément distinct. Pour `Objet`, tout le texte libre reste un élément unique, même lorsqu'il contient des tirets et des noms d'affaires.
- Les **986 textes libres Objet** contenant un tiret espacé et les **61 sauts de ligne internes** de texte libre sont conservés intentionnellement. **Aucun terme structuré** ne contient un séparateur de maillons reconnu ni de saut de ligne interne.
- La segmentation reste exploratoire : elle ne certifie pas la validation métier des termes/chaînes MDM.

Audit reproductible : `python scripts/check_corpus_segments.py`. Un workflow GitHub Actions vérifie la segmentation à chaque modification des JSON concernés. Rapport : `data/segmentation-audit.json`.

---

# Poc1 · Rama experimental multilingüe y Excel

## Inicio con doble clic (Windows)

1. Descargar el **ZIP de la rama experimental**: [Download ZIP](https://github.com/albuter99/poc1/archive/refs/heads/prototype-excel-multilingue-es-en.zip).
2. **Extraer todo** el ZIP en una carpeta normal. No iniciar los archivos desde dentro del ZIP.
3. Abrir **`INICIAR_POC.bat`** con doble clic.
4. El navegador abrirá automáticamente `http://127.0.0.1:8765/relations.html`.
5. Para detener el servidor, abrir **`DETENER_POC.bat`** o cerrar la ventana del servidor.

**Requisito:** Python 3 instalado en Windows. No requiere Node.js ni instalar dependencias Python. La visualización utiliza ficheros incluidos en el ZIP. El procesamiento de un archivo .xlsx seleccionado manualmente puede requerir acceso a la biblioteca XLSX alojada externamente.

La rama original `main` y la web pública continúan sin modificaciones. Los datos del Excel se distribuyen en varios archivos JSON de esta rama experimental.

---

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
