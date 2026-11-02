// Cartes de l'accueil — une carte par section du portfolio.
// La carte « projets » ouvre le tourbillon des projets ; les autres ouvrent une page.
export const sections = [
  {
    id: 'projets',
    title: 'Projets',
    category: 'Six travaux choisis',
    year: '2024—26',
    color: '#E4572E',
    ink: '#1B1A17',
    accent: '#F2C14E',
    motif: 'spiral',
  },
  {
    id: 'a-propos',
    title: 'À propos',
    category: 'Qui je suis',
    year: 'Bio',
    color: '#2B4BA0',
    ink: '#F1EDE6',
    accent: '#EFA3B8',
    motif: 'arch',
  },
  {
    id: 'parcours',
    title: 'Parcours',
    category: 'Études & expériences',
    year: 'CV',
    color: '#F2C14E',
    ink: '#1B1A17',
    accent: '#2F6B4F',
    motif: 'wave',
  },
  {
    id: 'contact',
    title: 'Contact',
    category: 'Travaillons ensemble',
    year: 'Dispo',
    color: '#1B1A17',
    ink: '#F1EDE6',
    accent: '#E4572E',
    motif: 'letter',
  },
];

// Textes d'exemple — à remplacer par les tiens.
export const about = {
  lead: "Je m'appelle Gabriel, étudiant en 2e année de BUT MMI à l'IUT de Troyes, développeur front-end et designer. Je dessine des interfaces, puis je les code moi-même — pour que ce qui est imaginé soit vraiment ce qui arrive à l'écran.",
  facts: [
    ['Formation', 'BUT MMI (2e année) — IUT de Troyes'],
    ['Disponibilité', 'Stage de 2e année'],
    ['Langues', 'Français, anglais'],
    ['Me joindre', '<a href="#/contact">Écrire un message</a>'],
  ],
  sections: [
    { title: 'Ce que je fais', text: "Des sites et des interfaces qui se remarquent sans se compliquer : une mise en page soignée, des animations qui ont un sens, et un code propre qui tient la route sur ordinateur comme sur mobile. Ce portfolio en est un bon exemple — chaque carte, chaque pli de papier est fait main, en code." },
    { title: 'Ma façon de travailler', text: "Comprendre d'abord ce qu'on veut dire, esquisser vite, puis passer rapidement au navigateur pour tester en vrai. Je préfère une idée simple bien exécutée à dix effets qui se battent pour l'attention, et je garde toujours un œil sur la performance et l'accessibilité." },
    { title: 'Ce que je cherche', text: "Mon stage de 2e année de BUT MMI, au sein d'une équipe qui fait attention aux détails — studio, agence ou produit — pour apprendre auprès de gens exigeants, contribuer à de vrais projets et continuer à progresser des deux côtés : design et développement." },
  ],
  // à ajuster : ne garde que ce que tu maîtrises vraiment
  skills: ['HTML & CSS', 'JavaScript', 'React', 'Three.js & WebGL', 'Animation (GSAP)', 'Figma', "Design d'interface", 'Responsive & accessibilité'],
};

export const parcours = [
  {
    years: '2025 — 2028',
    title: 'BUT MMI — 2e année',
    place: 'IUT de Troyes — Métiers du Multimédia et de l’Internet',
    text: "Formation entre développement web, design graphique, UX, audiovisuel et gestion de projet. C'est là que je combine le code et le design au quotidien.",
  },
  {
    years: 'Étés 2025 & 2026',
    title: 'Animateur en colonie de vacances',
    place: 'Séjours d’été — titulaire du BAFA',
    text: "Encadrer des groupes d'enfants, préparer et animer des activités, travailler en équipe et gérer l'imprévu au quotidien. Une vraie école de l'organisation et de la responsabilité.",
  },
  {
    years: '2025',
    title: 'Baccalauréat général',
    place: 'Spécialités mathématiques et NSI',
    text: "Numérique et sciences informatiques (NSI) et mathématiques en terminale, physique-chimie en première. Mes premières vraies lignes de code.",
  },
];

export const contact = {
  lead: "Un projet, une question, ou simplement envie d'échanger ? Écris-moi, je réponds sous 48 h.",
  email: 'bonjour@exemple.fr',
  socials: [
    { label: 'GitHub', url: '#' },
    { label: 'LinkedIn', url: '#' },
    { label: 'Instagram', url: '#' },
  ],
};
