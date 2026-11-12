# Poc1 · Branche Excel + multilinguisme ES/EN

Branche : `prototype-excel-multilingue-es-en`. **La branche `main` et le site GitHub Pages existant sont inchangés.**

## Dataset Excel publié sur cette branche

L'utilisateur a confirmé que le corpus fourni peut être publié. Les données issues du classeur sont maintenant réellement incluses dans les fichiers `data/excel-documents.json` et `data/excel-indexations-00.json` à `data/excel-indexations-14.json`. Le manifeste `data/excel-manifest.json` indique comment les charger.

| Mesure | Valeur |
| --- | ---: |
| Entrées de chaînes d'indexation | **5 839** |
| Identifiants `CHAINE_ID` différents | **5 839** |
| Documents source `LNS_DOCUMENT` | **2 780** |
| Textes `CHAINE_INDEX` différents | **5 003** |
| Types `TYPE_INDEX` | **5** |

Les types présents sont : `Descripteur du préexamen` (835), `Indicateur du préexamen` (592), `Objet` (1 636), `Mots-clés (Greffe)` (1 634), `Indicateurs Décision` (1 142).

**Le classeur XLSX original n'est pas commité.** Les champs textuels, identifiants et relations nécessaires à la démonstration sont présents dans les JSON de cette branche. Toute personne qui accède au dépôt public peut les consulter.

## Modèle de données et terminologie

La page **[relations.html](../relations.html)** charge automatiquement la totalité du dataset et propose un schéma de tables avec des lignes de relation, un répertoire paginé, recherche, filtres par type, fiches et navigation entre les enregistrements :

- **DOCUMENTS** : une ligne par document et ses attributs source.
- **INDEXATION_CHAINS** : une ligne par `CHAINE_ID`, liée à son document, son `TYPE_INDEX` et sa position `CHAINE_INDEX_ORDRE`.
- **INDEX_TYPES** : catalogue des cinq types d'indexation observés.
- **TEXT_CANDIDATES** : les 5 003 libellés distincts, identifiés comme candidats et non comme référentiel MDM validé.
- **CANDIDATE_CHAIN_TERMS** et **CANDIDATE_TERMS** : segmentation exploratoire des libellés. Les textes multilignes ou sans séparateur ` - ` sont conservés en une unité de texte libre.
- **REFERENCE_CHAINS, CHAIN_TERMS, TERMS, TERM_TRANSLATIONS, CHAIN_INDEX_TYPES, DOCUMENT_TRANSLATIONS, INDEX_TYPE_TRANSLATIONS** : emplacements du modèle de données cible. Les associations non documentées dans Excel ne sont **pas inventées**.

**Attention :** `CHAINE_ID` est un identifiant de chaîne d'indexation dans le corpus. Il ne devient pas automatiquement l'identifiant d'une chaîne de référence dans MDM. Les segments séparés par des tirets ne sont que des *candidats*, pas des maillons validés. La structure des tables cible est donc visible, mais les relations gouvernées absentes du fichier source restent volontairement non renseignées.

### Colonnes source préservées

`LNS_DOCUMENT`, `TYPE_DOCUMENT`, `JUR_COD`, `ANNEE`, `ORDRE`, `APR_COD`, `NUM_SUITE`, `NATPRO_COD`, `NUM_PRO`, `PRO_COD`, `TYPE_INDEX`, `CHAINE_ID`, `CHAINE_INDEX_ORDRE`, `CHAINE_INDEX`.

Le modèle conserve les métadonnées documentaires dans DOCUMENTS et les informations d'indexation dans INDEXATION_CHAINS ; aucun doublon ou texte répétitif n'est supprimé du corpus source.

## Langues FR, ES et EN

Le français est la langue source. La langue de l'interface est distincte de la langue des données.

- Dans le POC fictif (`index.html`), le sélecteur **FR / ES / EN** et le bouton **Traductions** permettent de saisir des traductions locales et d'afficher celles qui existent dans l'arborescence et le répertoire.
- Dans le visualiseur relationnel (`relations.html`), l'éditeur permet de saisir des libellés ES/EN pour les types d'indexation et les termes candidats. Ils sont conservés uniquement dans `localStorage` de ce navigateur.
- **Aucune traduction automatique ni version officielle ES/EN n'est contenue dans le fichier Excel.** Les champs sans traduction restent en français.

## Tester le modèle

GitHub Pages publie actuellement `main`, et **non** cette branche. Pour consulter l'expérience Excel sans toucher au POC existant :

```bash
git clone https://github.com/albuter99/poc1.git
cd poc1
git switch prototype-excel-multilingue-es-en
python -m http.server 8000
```

Ouvrir **http://localhost:8000/relations.html** pour le corpus Excel, ou **http://localhost:8000/index.html** pour les fonctionnalités historiques avec les données fictives.

`relations.html` charge les données depuis `data/excel-manifest.json`, puis tous les fragments indexation et les documents. Une sélection de fichier permet aussi d'ouvrir un autre XLSX ou JSON local. La lecture directe XLSX utilise la bibliothèque SheetJS chargée depuis un CDN.

## Retour à l'original

Pour retrouver l'ancienne version du code dans votre clone :

```bash
git switch main
```

Le site public déjà publié sur GitHub Pages reste à l'adresse habituelle ; aucune fusion n'est réalisée.

## Points à valider avant un MVP

- Définition métier des vraies chaînes de référence et de leurs maillons ; éventuelle identification des textes libres.
- Correspondance entre une entrée d'indexation du corpus et une chaîne de référence MDM.
- Nature et cardinalité des associations avec les types d'indexation.
- Versioning, statuts, règles de création des maillons et traduction validée des libellés.
- Tests de non-régression des statistiques, recherche, arbre, CRUD et exports sur les entités cible.

Le schéma correspond à une **preuve de concept relationnelle exploratoire**, pas à un modèle de données métier validé par le TJUE.
