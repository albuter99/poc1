# Essai Excel et multilinguisme ES/EN

Cette branche est indépendante de `main`. Le site GitHub Pages publié depuis `main` reste inchangé.

## Sécurité des données

Le classeur de travail **n'est pas inclus** dans cette branche. Le dépôt GitHub `albuter99/poc1` est public : toutes ses branches et tous leurs fichiers sont publics également. Ne commitez ni le classeur, ni ses lignes, ni les données JSON produites à partir du classeur sans autorisation institutionnelle explicite. Les exemples du POC restent fictifs.

## Analyse de la structure du classeur

Feuille principale : 5 839 lignes et 14 colonnes renseignées.

| Champ Excel | Destination logique envisagée |
| --- | --- |
| `LNS_DOCUMENT` | Identifiant source du document |
| `TYPE_DOCUMENT`, `JUR_COD`, `ANNEE`, `ORDRE`, `APR_COD`, `NUM_SUITE`, `NATPRO_COD`, `NUM_PRO`, `PRO_COD` | Métadonnées d'un document ou d'une procédure, conservées séparément |
| `TYPE_INDEX` | Type d'indexation de l'association document / chaîne d'indexation |
| `CHAINE_ID` | Identifiant source de la chaîne d'indexation, **pas automatiquement** l'identifiant d'une chaîne de référence |
| `CHAINE_INDEX_ORDRE` | Ordre de l'indexation dans le document |
| `CHAINE_INDEX` | Texte source de la chaîne d'indexation |

Résultats de profilage du fichier fourni : **5 839 identifiants** `CHAINE_ID`, **5 003 libellés** `CHAINE_INDEX` distincts, **2 780 documents** `LNS_DOCUMENT`, **5 types** `TYPE_INDEX`. Ces agrégats ne sont pas des données source et ne permettent pas à eux seuls d'inférer le nombre de chaînes de référence gouvernées dans MDM.

Les cinq types observés sont : `Objet`, `Mots-clés (Greffe)`, `Indicateurs Décision`, `Descripteur du préexamen`, `Indicateur du préexamen`.

### Modèle cible, à tester

1. `documents` : document source et métadonnées.
2. `indexation_entries` : une ligne par `CHAINE_ID`, avec `document_id`, `type_indexation`, `ordre` et contenu original.
3. `reference_chains` : uniquement les chaînes de référence identifiées et validées comme telles, sans supposer que chaque `CHAINE_INDEX` en est une.
4. `chain_links` : liens entre une entrée d'indexation et zéro ou une chaîne de référence reconnue, sans supprimer le texte additionnel.
5. `terms`, `term_translations`, `maillons` : termes réutilisables, traductions et ordre dans les chaînes de référence structurées.

La séparation au caractère ` - ` ne suffit pas pour tous les contenus. Certains sont du texte libre ou comportent des passages multilignes. Conserver systématiquement la valeur `CHAINE_INDEX` originale.

## Multilinguisme

La langue de l'interface et celle des données sont **deux choses différentes**. La version française d'origine reste la source, et on prépare des variantes `es` et `en` par terme ou par texte libre complet, sans traduction automatique implicite.

Exemple de représentation (entièrement fictif) :

```json
{
  "term_id": "DEMO-TERM-001",
  "labels": {
    "fr": "Exemple",
    "es": "Ejemplo",
    "en": "Example"
  },
  "translation_status": {
    "es": "validated",
    "en": "validated"
  }
}
```

Pour les chaînes structurées : traduire les `term_id` dans leur ordre; la référence et les identifiants ne changent pas. Pour les chaînes d'indexation en texte libre : traduire le texte complet, et non chaque fragment supposé séparé par un tiret.

**Il n'y a pas de traductions ES/EN dans le fichier fourni.** Ne jamais afficher une traduction inventée comme étant validée.

## Ordre de travail proposé

1. Mettre à disposition un import privé/local du classeur et valider les règles de segmentation par type.
2. Vérifier les doublons, la correspondance document / indexation et les exceptions.
3. Introduire les tables logiques ci-dessus sans remplacer `data/chains.json` sur `main`.
4. Intégrer progressivement la vue des traductions ES/EN, le choix de langue des données et les statuts de complétude.
5. Tester les statistiques, filtres, arbre, création, graphe et exports avant toute fusion éventuelle.

## Retour à la version actuelle

Choisir la branche `main` sur GitHub pour retrouver intégralement le POC existant. Aucune fusion ni modification de `main` n'est effectuée ici.

## Prototype disponible sur cette branche

- Un sélecteur FR / ES / EN permet de choisir la langue **des données** séparément de la langue de l'interface.
- Le bouton **Traductions** ouvre un éditeur local pour les termes des chaînes fictives. Les traductions ES/EN se conservent uniquement dans le navigateur.
- L'arborescence et la colonne « Chaîne de référence » du répertoire utilisent les traductions disponibles, avec repli vers le français lorsqu'une traduction manque.
- Le graphe, les statistiques et les contenus importés ne sont pas encore multilingues de bout en bout. Aucune traduction du classeur n'a été présumée.

## Tester l'import sans publication

Lancer localement depuis une copie de cette branche :

```bash
python scripts/import_indexation_xlsx.py "chemin/vers/classeur.xlsx"
```

Le résultat privé est créé sous `private-import/indexation-preview.json`, qui est exclu de Git par `.gitignore`. Il conserve chaque entrée d'indexation et les documents séparément, sans confondre les entrées d'indexation avec les chaînes de référence.

Pour démarrer le POC avec les données fictives (sans importer le fichier Excel) :

```bash
python scripts/build_stats.py
python -m http.server 8000
```

Ouvrir `http://localhost:8000`. GitHub Pages reste configuré pour `main`. Changer de branche dans GitHub ne change pas automatiquement le site public publié.

La page `import-preview.html` peut ouvrir explicitement le JSON local via un sélecteur de fichier et afficher ses entrées par pages de 50 avec recherche et filtre de type. Aucun fichier source n’est incorporé à la branche.

## Nouveau visualiseur relationnel

La page [relations.html](../relations.html) représente les tables et les relations du modèle de données. Elle permet :

- de choisir directement un classeur **.xlsx** ou le JSON préconverti, en local et sans transfert de données ;
- de naviguer de DOCUMENTS à INDEXATION_CHAINS et aux types d'indexation ;
- de parcourir le corpus, rechercher, filtrer, consulter les fiches et les textes répétés ;
- d'identifier les tables de référence/termes/traductions qui ne peuvent pas être remplies de manière fiable à partir des seuls champs du fichier source ;
- d'éditer des variantes ES/EN à titre de démonstration, sans fabriquer de traduction absente du classeur.

**Important :** le classeur n'établit pas à lui seul le lien entre une chaîne d'indexation et une chaîne de référence officiellement validée dans MDM. Ces tables peuvent être vides jusqu'à une validation de ce rapprochement. Le schéma reste volontairement complet.

Pour voir l'application expérimentale, il faut exécuter les fichiers de cette branche via un serveur statique local (par exemple `python -m http.server 8000`) : le site GitHub Pages de production ne publie que `main`.

## Charger le corpus complet dans la branche expérimentale

Le visualiseur `relations.html` charge automatiquement `data/indexation-relational-preview.json` lorsque ce fichier existe sur la branche. Il peut également ouvrir directement le fichier Excel dans le navigateur.

Si la publication du corpus est autorisée, le fichier JSON complet peut être ajouté depuis GitHub en sélectionnant **la branche expérimentale**, puis le dossier `data/`, puis **Add file > Upload files**. Nom attendu : `indexation-relational-preview.json`. Il doit rester absent de `main`. Il contient 5 839 indexations et 2 780 documents, mais aucune traduction ES/EN officielle.

Cette opération publie réellement les enregistrements, car le dépôt est public. L'application charge ensuite ces données automatiquement. Le script local `scripts/import_indexation_xlsx.py` permet de régénérer le même format.
