# MOT-CLES: original y vista experimental publicadas simultáneamente

GitHub Pages debe estar configurado con **Source: GitHub Actions**.

- Web original (código y datos de `main`): https://albuter99.github.io/poc1/
- Web experimental (datos multilingües y estructura relacional): https://albuter99.github.io/poc1/experimental/
- Modelo de datos experimental: https://albuter99.github.io/poc1/experimental/relations.html

`.github/workflows/pages.yml` en `main` genera las estadísticas originales, incorpora una copia estática de esta rama en `/experimental/` y publica ambas vistas juntas, sin mezclarlas. Cada cambio en esta rama dispara `refresh-experimental-preview.yml`, que solicita un nuevo despliegue del workflow principal.

La fuente de Pages es única para el repositorio. **No seleccionar Deploy from a branch**, pues reemplazaría el despliegue combinado. El despliegue requiere que GitHub Pages siga habilitado en modo GitHub Actions; revisar en Settings > Pages y Actions si la URL experimental no aparece.

---

## Contrôle des données et des maillons (12/11/2026)

Le corpus expérimental conserve désormais **4 203 indexations structurées** après la suppression de **1 636 entrées de texte libre Objet**. Cela représente **3 485 chaînes textuelles distinctes**, **12 341 termes structurés distincts** et **33 121 occurrences ordonnées de maillons**.

- `original_text` conserve le texte source des indexations structurées sans modification.
- `indexation_text_fr` utilise ` - ` comme séparateur canonique.
- `maillons_fr` contient les termes structurés distincts par position.
- Les séparateurs typographiques avec espaces (tirets `-`, `−`, `–`, `—` et variantes) et les sauts de ligne ont été vérifiés. **0 erreur technique** constatée dans les contrôles appliqués.
- Les tirets internes sans espaces peuvent faire partie de mots composés et ne sont pas automatiquement utilisés comme séparateurs.
- Les termes restent des candidats exploratoires, non validés métier en MDM.

Audit : `data/segmentation-audit.json`. Vérification : `python scripts/check_corpus_segments.py`. Le script `scripts/remove_free_text.py` assure la suppression reproductible des textes libres et les contrôles complémentaires. Les traductions ES/EN constituent une étape distincte.

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
