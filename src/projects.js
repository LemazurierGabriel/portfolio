// Contenu des projets — remplace ces exemples par tes vrais travaux.
// motif : sun | arch | grid | wave | stripes | letter | spiral | peaks (décor de l'affiche)
// images : captures dans public/projets/<slug>/ (optionnel)
export const projects = [
  {
    slug: 'caf-fougeres',
    title: 'CAF Fougères',
    category: 'Site associatif',
    year: '2025',
    color: '#E8500A',
    ink: '#1A1612',
    accent: '#F0ECE4',
    motif: 'peaks',
    role: 'Design & développement, à la demande du club',
    tools: ['HTML / CSS', 'JavaScript', 'WebGL (GLSL)', 'PHP', 'MySQL'],
    url: 'https://caf-fougeres.kesug.com/',
    summary:
      "Le site de la section escalade du Club Alpin Français de Fougères, réalisé à la demande du bureau du club : une vitrine qui donne envie de grimper, et un espace membres qui simplifie la vie des bénévoles.",
    sections: [
      {
        title: 'La demande',
        text: "Le bureau du club voulait un site qui fasse deux choses : présenter clairement la section — activités, horaires, sorties, tarifs — et alléger le travail des bénévoles. J'ai d'abord monté le site avec des contenus d'exemple, puis je l'ai branché sur une vraie base de données : aujourd'hui, c'est le club qui fait vivre les contenus.",
      },
      {
        title: "Ce que j'ai fait",
        text: "J'ai conçu l'identité du site — granite sombre, orange escalade, typographie Oswald — et développé chaque page sans framework : un fond animé en WebGL qui évoque la roche et réagit à la souris, un agenda filtrable, des animations au scroll, le tout responsive.",
      },
      {
        title: 'Côté serveur',
        text: "En PHP et MySQL : inscription et connexion des membres, un agenda que les administrateurs mettent à jour eux-mêmes, et un système de prêt de matériel (cordes, baudriers…) avec vérification du stock disponible. Chaque demande suit son circuit — en attente, validée, empruntée, rendue — depuis un tableau de bord dédié.",
      },
    ],
    images: [
      { src: 'projets/caf-fougeres/accueil.jpeg', alt: "Page d'accueil du site CAF Fougères, avec le titre « Grimper, c'est vivre autrement » sur un fond de roche animé" },
      { src: 'projets/caf-fougeres/activites.jpeg', alt: 'Page Activités : horaires des séances en salle par jour et par public' },
      { src: 'projets/caf-fougeres/connexion.jpeg', alt: "Page de connexion à l'espace membre" },
    ],
  },
  {
    slug: 'pokedia',
    title: 'Pokédia',
    category: 'SAÉ 1.05 — MMI',
    year: '2025',
    color: '#9BBC0F',
    ink: '#0F380F',
    accent: '#306230',
    motif: 'pixel',
    role: 'Projet de cours, en solo',
    tools: ['PHP', 'HTML / CSS', 'JavaScript', 'JSON', 'jQuery DataTables'],
    url: 'http://sae105.mmi25c09.mmi-troyes.fr/index.php',
    summary:
      "Une encyclopédie des 50 premiers Pokémon, entièrement habillée dans l'univers rétro de la Game Boy : écran vert, pixels et typographie 8 bits.",
    sections: [
      {
        title: 'Le sujet',
        text: "Pour la SAÉ 1.05 de première année, il fallait créer un site dynamique en PHP autour d'un jeu de données. J'ai choisi les premiers Pokémon et l'esthétique de la Game Boy, qui n'a rien perdu de son charme.",
      },
      {
        title: "Ce que j'ai fait",
        text: "Les pages sont générées en PHP à partir d'un fichier JSON : une galerie façon Pokédex avec agrandissement des images, et un tableau de données triable et filtrable avec DataTables. Pour l'ambiance, des transitions entre les pages en volets d'écran Game Boy, et un Pikachu qui pousse son cri quand on clique dessus.",
      },
      {
        title: 'Côté serveur',
        text: "Un formulaire de contact qui vérifie les champs et envoie un e-mail de confirmation, et un envoi d'images pour la galerie communautaire, avec contrôle du format et de la taille du fichier.",
      },
    ],
    images: [
      { src: 'projets/pokedia/accueil.jpeg', alt: "Page d'accueil de Pokédia : Pikachu en pixel art sur l'écran vert de la Game Boy, avec un bouton Start Adventure" },
      { src: 'projets/pokedia/galerie.jpeg', alt: 'Galerie façon Pokédex : cartes numérotées avec le nom et le type de chaque Pokémon' },
      { src: 'projets/pokedia/donnees.jpeg', alt: 'Tableau des données des Pokémon, triable et avec recherche' },
    ],
  },
  {
    slug: 'director-scape',
    title: 'Director Scape',
    category: 'SAÉ 2.02 — MMI',
    year: '2026',
    color: '#101513',
    ink: '#F1EDE6',
    accent: '#86F2C4',
    motif: 'door',
    role: 'Développement du site, en équipe',
    tools: ['PHP (MVC)', 'MySQL', 'HTML / CSS', 'JavaScript'],
    url: 'https://sae202.mmi25c09.mmi-troyes.fr/',
    summary:
      "Le site d'un escape game grandeur nature — une nuit enfermé dans une entreprise des années 70. Projet d'équipe : j'ai développé l'ensemble du site à partir des maquettes, des inscriptions jusqu'au back-office.",
    sections: [
      {
        title: 'Le sujet',
        text: "Pour la SAÉ 2.02, notre équipe devait créer un événement et tout son univers. Le scénario : une soirée d'entreprise dans les années 70 qui tourne mal — les employés disparaissent, la porte est fermée, et le patron a posé des pièges. Mes coéquipiers ont pris en charge la direction artistique, les maquettes et la vidéo ; je me suis chargé de transformer ces maquettes en un site complet et fonctionnel.",
      },
      {
        title: "L'expérience joueur",
        text: "Inscription et connexion, création d'une équipe avec choix de la date et du créneau, puis un code d'invitation à partager pour que les coéquipiers la rejoignent. Chacun retrouve son équipe et son score sur son profil, et peut laisser un avis noté sur cinq.",
      },
      {
        title: 'Le back-office',
        text: "Une architecture MVC en PHP avec un routeur maison et une base MySQL. Les administrateurs disposent d'un tableau de bord : suivi des inscrits et des équipes, saisie des scores qui alimentent le classement de l'accueil, et modération des avis avant publication.",
      },
    ],
    images: [
      { src: 'projets/director-scape/accueil.jpeg', alt: "Page d'accueil de Director Scape : bannière d'un open space des années 70 plongé dans la pénombre" },
      { src: 'projets/director-scape/pitch.jpeg', alt: "Présentation de l'expérience, avec les boutons S'inscrire et Découvrir le concept à côté d'une photo de salon d'entreprise rétro" },
      { src: 'projets/director-scape/concept.jpeg', alt: 'Page Concept : pitch et détails pratiques avec pictogrammes' },
    ],
  },
  {
    slug: 'inventeurs',
    title: 'Les Inventeurs',
    category: 'SAÉ 2.03 — MMI',
    year: '2026',
    color: '#F0F0F0',
    ink: '#0A0A0A',
    accent: '#FF1A00',
    motif: 'bulb',
    role: 'Projet de cours, en solo',
    tools: ['PHP', 'MySQL (PDO)', 'HTML / CSS'],
    url: 'https://sae203.mmi25c09.mmi-troyes.fr/',
    summary:
      "Un catalogue des inventeurs qui ont changé le monde, de la presse de Gutenberg au Web, avec un design brutaliste et un back-office complet.",
    sections: [
      {
        title: 'Le sujet',
        text: "Pour la SAÉ 2.03, il fallait construire un site catalogue relié à une base de données, avec une partie publique et une partie d'administration. J'ai choisi les inventeurs célèbres : 21 inventeurs et leurs inventions, de Léonard de Vinci à Tim Berners-Lee.",
      },
      {
        title: 'Le design',
        text: "Une direction graphique brutaliste : noir, blanc et rouge, titres en Anton, textes en Space Mono, bordures épaisses et photos d'archives en noir et blanc. Le site reste lisible sur mobile, avec un menu burger accessible.",
      },
      {
        title: 'Côté serveur',
        text: "Un catalogue généré en PHP depuis MySQL, une recherche par nom ou prénom d'inventeur, et un back-office pour ajouter, modifier et supprimer inventions et inventeurs — avec envoi de photos, contrôle du format et renommage automatique des fichiers.",
      },
    ],
    images: [
      { src: 'projets/inventeurs/accueil.jpeg', alt: "Page d'accueil « Les Inventeurs Célèbres » : grand titre blanc sur bandeau noir, menu à onglets et citation d'Edison" },
      { src: 'projets/inventeurs/catalogue.jpeg', alt: "Catalogue en grille : photos d'archives en noir et blanc, année, catégorie en rouge et inventeur" },
      { src: 'projets/inventeurs/recherche.jpeg', alt: 'Résultats de recherche pour Tesla : moteur à courant alternatif, bobine Tesla, dynamo et radio' },
    ],
  },
  {
    slug: 'paperview',
    title: 'PaperView',
    category: 'Application web — projet perso',
    year: '2026',
    color: '#131722',
    ink: '#D1D4DC',
    accent: '#26A69A',
    motif: 'candles',
    role: 'Conception & développement, en solo',
    tools: ['JavaScript', 'lightweight-charts', 'Supabase', 'Node.js'],
    url: 'https://lemazuriergabriel.github.io/paperview/',
    summary:
      "Un simulateur de trading inspiré de TradingView : 10 000 $ d'argent fictif, mais sur les vrais prix des marchés, avec un classement des joueurs.",
    sections: [
      {
        title: "L'idée",
        text: "Apprendre à trader sans risquer un centime. Les prix sont réels — cryptos en temps réel via Binance, indices, matières premières et actions via Yahoo Finance — mais l'argent est imaginaire, et chaque dollar gagné rapporte des points.",
      },
      {
        title: 'Le moteur de trading',
        text: "Ordres au marché et à cours limité, levier, stop-loss et take-profit, liquidation. L'exécution se veut réaliste : un stop sauté part au prix suivant, et au retour sur la page, les bougies manquées sont rejouées pour déclencher les ordres au bon moment.",
      },
      {
        title: "L'interface",
        text: "Des graphiques en bougies avec lightweight-charts, 12 indicateurs (moyennes mobiles, Bollinger, Ichimoku…) et 14 outils de dessin. Pour les débutants, un tutoriel en 13 étapes et un exercice guidé ; pour les autres, des rangs et un classement en ligne via Supabase.",
      },
    ],
    images: [
      { src: 'projets/paperview/graphique.jpeg', alt: "Interface de PaperView : graphique en bougies du Bitcoin, liste de suivi et panneau d'ordres" },
      { src: 'projets/paperview/indicateurs.jpeg', alt: 'Panneau des indicateurs : moyennes mobiles, Bollinger, VWAP, Ichimoku et SAR parabolique' },
      { src: 'projets/paperview/tutoriel.jpeg', alt: 'Fenêtre de bienvenue du tutoriel : 13 étapes puis un exercice guidé' },
    ],
  },
  {
    slug: 'outlaws-tcg',
    title: 'Outlaws TCG',
    category: 'Application mobile — projet perso',
    year: '2026',
    color: '#0E0E12',
    ink: '#F1EDE6',
    accent: '#F5B70F',
    motif: 'fan',
    role: 'Conception & développement, en solo',
    tools: ['JavaScript', 'PWA', 'Supabase (PostgreSQL)', 'CSS 3D'],
    url: 'https://lemazuriergabriel.github.io/-outlaws-tcg/',
    summary:
      "Un jeu de cartes à collectionner façon Pokémon TCG sur les cartels et gangs qui ont marqué l'histoire : 116 fiches, 25 familles, des boosters à ouvrir et des comptes joueurs.",
    sections: [
      {
        title: 'Le concept',
        text: "Une collection « true crime » : faction, époque, pays et parcours de chaque fiche sont historiques, illustrés par des photos de Wikimedia Commons. Chaque carte est notée sur cinq axes — dangerosité, gloire, argent, criminalité, reconnaissance — qui fixent sa rareté, de Commune à Mythique.",
      },
      {
        title: "L'ouverture de boosters",
        text: "Comme un vrai paquet : on glisse pour déchirer le dossier scellé, puis les cartes se révèlent une à une en 3D, avec un halo selon la rareté et les plus rares gardées pour la fin. Les boosters se rechargent avec le temps, pour donner envie de revenir.",
      },
      {
        title: 'Comptes et sauvegarde',
        text: "Une application installable (PWA) qui fonctionne aussi hors ligne. Avec Supabase, chaque joueur a un compte et sa progression est sauvegardée dans PostgreSQL, protégée par des règles d'accès par utilisateur et synchronisée sur tous ses appareils.",
      },
    ],
    images: [
      { src: 'projets/outlaws/dossiers.jpeg', alt: 'Collection Outlaws : fiches photo de Pablo Escobar, El Chapo et Al Capone avec leur rareté et leur score' },
      { src: 'projets/outlaws/ouvrir.jpeg', alt: "Écran d'ouverture : dossier scellé à déchirer d'un glissement, et choix du type de booster" },
      { src: 'projets/outlaws/familles.jpeg', alt: 'Page Familles : la Cosa Nostra, sa description et ses 36 cartes à recruter' },
    ],
  },
];
