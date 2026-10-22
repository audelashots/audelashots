# Au-delà des shots — galerie

Site statique HTML/CSS/JS, conçu pour être publié gratuitement sur GitHub Pages. Aucun framework, aucune installation.

## Aperçu du site
- Design éditorial sombre et sobre, avec un accent chaud et des typographies de secours système.
- Collections organisées par jeu puis par série ou sujet (décor, personnage, portrait, etc.).
- Sélection courte de jeux mis en avant, bibliothèque complète avec recherche, et affichage des collections du jeu choisi uniquement. Black Flag Resynced et ARC RAIDERS sont actuellement mis en avant.
- Filtres par jeu, affichage des photos en grand, navigation précédente/suivante et téléchargement lorsque l’image est disponible.
- Filigrane textuel discret sur les photos affichées; les téléchargements restent les fichiers originaux.
- Responsive mobile/ordinateur, navigation clavier et focus restauré dans la visionneuse.
- Aucun framework, aucune police distante ni aucun service externe requis.

## Mettre la galerie à jour

Les textes et collections sont dans `index.html`; les styles sont dans `styles.css`; le comportement des filtres et de la visionneuse est dans `script.js`. Pour les mises à jour courantes, modifiez seulement le HTML : aucun outil de compilation ni changement JavaScript n'est nécessaire.

### Ajouter une photo à une série existante
1. Placez une version optimisée de la photo dans le dossier de la série, par exemple `assets/photos/arc-raiders/ville-enfouie/03.jpg`.
2. Dans `index.html`, copiez un bouton `.photo-card` de cette série et collez-le dans son bloc `.photo-grid`.
3. Sur le nouveau bouton, adaptez `data-src` (chemin relatif depuis la racine du site), `data-title`, `data-game` et `data-series`. Le texte dans `.photo-caption` est le titre affiché sous la vignette.
4. Les compteurs se mettent à jour automatiquement. Si le fichier manque ou si le chemin est incorrect, la vignette indique qu'une capture est à ajouter et aucun téléchargement n'est proposé.

La collection **ARC RAIDERS — Ville Enfouie** contient actuellement 10 photos et **Stella Montis** en contient 7. **Assassin's Creed Black Flag Resynced** contient 15 photos dans une collection, identifiées par série (Chinchorro, Eleuthera, Gibara, Serranilla et Temple maya).

### Ajouter une série, un sujet ou un nouveau jeu
1. Créez un dossier pour les photos, avec des noms simples en minuscules, par exemple `assets/photos/arc-raiders/portraits/` ou `assets/photos/mon-nouveau-jeu/portraits/`.
2. Dans `index.html`, copiez une section `<section class="collection">` complète et placez-la à côté des autres collections.
3. Donnez à la section un `id` unique pour son raccourci, un `data-collection` unique, un `data-game` stable (identifiant sans espaces) et un `data-game-name` lisible. Les collections du même jeu doivent partager les mêmes valeurs `data-game` et `data-game-name`.
4. Modifiez le titre `<h3>`, le nom de série dans chaque `data-series`, puis ajoutez les boutons photo nécessaires avec leurs chemins `data-src`, titres et légendes.
5. Pour montrer ce jeu directement dans la sélection courte de la page, ajoutez `data-featured="true"` à sa section `.collection`. Un seul marquage sur l’une de ses séries suffit. Les quatre premiers jeux marqués sont affichés à l’accueil; les autres restent accessibles via **Voir tous les jeux** et sa recherche. Si aucun jeu n’est marqué, les trois premiers jeux du HTML servent de sélection initiale.
6. Enregistrez et rechargez le site : les jeux, le nombre de séries et les photos sont calculés automatiquement. Le premier jeu mis en avant est ouvert par défaut. Il n'est pas nécessaire de modifier `script.js`.

Une collection peut représenter un décor, des portraits, un personnage, une ambiance ou tout autre thème. Pour ajouter une photo, dupliquez uniquement un bouton `.photo-card`; pour ajouter une série ou un jeu, dupliquez une section `.collection`.

### Modifier les textes
- Intro et titres des sections : modifiez le texte directement dans `index.html`.
- Nom d'une série : changez son `<h3>`; il sera repris automatiquement dans l'index d'accueil.
- Nom d'un jeu : changez `data-game-name` sur chaque collection du jeu et le texte de son `collection-kicker`.
- Titre d'une photo : changez `data-title` et le texte de `.photo-caption` sur son bouton.
- Présentation et lien Instagram : modifiez le bloc `#apropos` et les URL Instagram dans `index.html`.

Le filigrane « AU-DELÀ DES SHOTS · @AUDELASHOTS » est superposé à l'affichage, sans modifier les fichiers. Il identifie les images et peut décourager une réutilisation sans crédit, mais ne bloque pas les captures d'écran ni le retrait du filigrane. Le lien Télécharger récupère l'image originale référencée par `data-src`, sans filigrane. Tout fichier publié sur GitHub Pages est public.

**Conseil qualité :** gardez une version web optimisée (JPEG/WebP, largeur souvent 2000–3000 px) et archivez vos captures originales ailleurs. GitHub impose une limite recommandée de 1 Go par dépôt et les dépôts ont des limites de taille de fichier ; évitez d'y stocker des fichiers gigantesques.

## Publier sur GitHub Pages
1. Créez un dépôt GitHub, par exemple `audelashots`.
2. Envoyez `index.html`, `styles.css`, `script.js` et le dossier `assets/` à la racine du dépôt.
3. Ouvrez **Settings → Pages**.
4. Dans **Build and deployment**, choisissez **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
5. Attendez la fin du déploiement. L'adresse sera généralement `https://VOTRE-PSEUDO.github.io/audelashots/`. Pour un dépôt nommé exactement `VOTRE-PSEUDO.github.io`, l'adresse sera `https://VOTRE-PSEUDO.github.io/`.

## Personnalisation
- Instagram : le lien `https://www.instagram.com/audelashots/` est déjà ajouté.
- Pas de backend : GitHub Pages sert les fichiers statiques. Les photos sont publiques ; ne publiez que les images que vous souhaitez rendre accessibles.
