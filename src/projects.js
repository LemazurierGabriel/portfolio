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
      { src: '/projets/caf-fougeres/accueil.jpeg', alt: "Page d'accueil du site CAF Fougères, avec le titre « Grimper, c'est vivre autrement » sur un fond de roche animé" },
      { src: '/projets/caf-fougeres/activites.jpeg', alt: 'Page Activités : horaires des séances en salle par jour et par public' },
      { src: '/projets/caf-fougeres/connexion.jpeg', alt: "Page de connexion à l'espace membre" },
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
      { src: '/projets/pokedia/accueil.jpeg', alt: "Page d'accueil de Pokédia : Pikachu en pixel art sur l'écran vert de la Game Boy, avec un bouton Start Adventure" },
      { src: '/projets/pokedia/galerie.jpeg', alt: 'Galerie façon Pokédex : cartes numérotées avec le nom et le type de chaque Pokémon' },
      { src: '/projets/pokedia/donnees.jpeg', alt: 'Tableau des données des Pokémon, triable et avec recherche' },
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
      { src: '/projets/director-scape/accueil.jpeg', alt: "Page d'accueil de Director Scape : bannière d'un open space des années 70 plongé dans la pénombre" },
      { src: '/projets/director-scape/pitch.jpeg', alt: "Présentation de l'expérience, avec les boutons S'inscrire et Découvrir le concept à côté d'une photo de salon d'entreprise rétro" },
      { src: '/projets/director-scape/concept.jpeg', alt: 'Page Concept : pitch et détails pratiques avec pictogrammes' },
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
      { src: '/projets/inventeurs/accueil.jpeg', alt: "Page d'accueil « Les Inventeurs Célèbres » : grand titre blanc sur bandeau noir, menu à onglets et citation d'Edison" },
      { src: '/projets/inventeurs/catalogue.jpeg', alt: "Catalogue en grille : photos d'archives en noir et blanc, année, catégorie en rouge et inventeur" },
      { src: '/projets/inventeurs/recherche.jpeg', alt: 'Résultats de recherche pour Tesla : moteur à courant alternatif, bobine Tesla, dynamo et radio' },
    ],
  },
  {
    slug: 'echo',
    title: 'Écho',
    category: 'Expérience interactive',
    year: '2024',
    color: '#EFA3B8',
    ink: '#1B1A17',
    accent: '#2B4BA0',
    motif: 'stripes',
    role: 'Creative coding',
    tools: ['WebGL', 'Web Audio'],
    url: null,
    summary:
      "Une installation web où chaque visiteur laisse une trace sonore et visuelle, qui se mêle à celles des précédents.",
    sections: [
      { title: 'Le défi', text: "Rendre une expérience collective sensible et poétique, sans compte ni inscription." },
      { title: "L'approche", text: "Des motifs génératifs qui réagissent au micro et une mémoire partagée des passages." },
    ],
  },
  {
    slug: 'nuit-blanche',
    title: 'Nuit Blanche',
    category: 'Direction artistique',
    year: '2024',
    color: '#1B1A17',
    ink: '#F1EDE6',
    accent: '#E4572E',
    motif: 'letter',
    role: 'Affiches & motion',
    tools: ['After Effects', 'InDesign'],
    url: null,
    summary:
      "Série d'affiches et d'animations pour un festival nocturne : une typographie monumentale qui se révèle à la lumière.",
    sections: [
      { title: 'Le défi', text: "Créer une campagne reconnaissable de loin, la nuit, dans la rue comme sur écran." },
      { title: "L'approche", text: "Une lettre géante par affiche, des contrastes forts et des animations courtes pensées pour les réseaux." },
    ],
  },
];
