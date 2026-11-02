import './style.css';
import gsap from 'gsap';
import { projects } from './projects.js';
import { sections } from './content.js';
import { createScene } from './scene.js';
import { createPage } from './page.js';
import { projectTemplate, sectionTemplate } from './templates.js';
import { getCardCanvas } from './cardTexture.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) gsap.globalTimeline.timeScale(2.5);

const pad = (n) => String(n).padStart(2, '0');
const PROJECTS_CARD = sections.findIndex((s) => s.id === 'projets');

await Promise.all([
  document.fonts.load('800 200px "Inter Tight"'),
  document.fonts.load('italic 400 100px "Instrument Serif"'),
  document.fonts.load('500 30px "Inter"'),
]).catch(() => {});

// affiches de l'accueil dessinées une par une, en rendant la main au navigateur entre chaque
const nextTask = () => new Promise((resolve) => setTimeout(resolve, 0));
for (const [i, section] of sections.entries()) {
  await nextTask();
  getCardCanvas(section, i, `home-${i}`);
}
await nextTask();

// ----- Interface -----

const site = document.getElementById('site');
const homeChrome = document.querySelectorAll('.site-header, .site > .hud');
const worksUi = document.getElementById('works-ui');
const hud = Object.fromEntries(
  ['home', 'works'].map((set) => [set, {
    kicker: document.getElementById(`${set}-kicker`),
    title: document.getElementById(`${set}-title`),
    counter: document.getElementById(`${set}-counter`),
  }])
);

function showActive(set, index) {
  const list = set === 'home' ? sections : projects;
  const item = list[index];
  const ui = hud[set];
  ui.kicker.textContent = `N°${pad(index + 1)} · ${item.category}`;
  ui.counter.textContent = `${pad(index + 1)} / ${pad(list.length)}`;
  ui.title.textContent = item.title;
  gsap.fromTo(ui.title, { yPercent: 105 }, { yPercent: 0, duration: 0.7, ease: 'power3.out', overwrite: true });
}

const fadeIn = (els, delay = 0) => gsap.to(els, { opacity: 1, duration: 0.8, delay, ease: 'power2.out', overwrite: true });
const fadeOut = (els) => gsap.to(els, { opacity: 0, duration: 0.4, ease: 'power2.out', overwrite: true });

// seule la couche visible reçoit le focus et les clics
function setLayer(view) {
  site.inert = view !== 'home';
  worksUi.inert = view !== 'works';
}

// ----- Routes -----
// #/  ·  #/projets  ·  #/projets/<slug>  ·  #/a-propos  ·  #/parcours  ·  #/contact

const sectionRoute = (i) => (sections[i].id === 'projets' ? '#/projets' : `#/${sections[i].id}`);
const projectRoute = (i) => `#/projets/${projects[i].slug}`;

function parseRoute() {
  const [first, second] = location.hash.replace(/^#\/?/, '').split('/');
  if (first === 'projets') {
    const index = projects.findIndex((p) => p.slug === second);
    return index >= 0 ? { view: 'work', index } : { view: 'works' };
  }
  const index = sections.findIndex((s) => s.id === first && s.id !== 'projets');
  return index >= 0 ? { view: 'section', index } : { view: 'home' };
}

function go(hash) {
  if (location.hash === hash) sync();
  else location.hash = hash;
}

// ----- Scène et page -----

const scene = createScene({
  container: document.getElementById('stage'),
  sections,
  projects,
  reduceMotion,
  onActive: showActive,
  onSelect: (set, i) => go(set === 'home' ? sectionRoute(i) : projectRoute(i)),
});
await nextTask();

const page = createPage(document.getElementById('page'), {
  onAction(action) {
    if (action === 'close') go(current.view === 'work' ? '#/projets' : '#/');
    if (action === 'next' && current.view === 'work') {
      history.replaceState(null, '', projectRoute((current.index + 1) % projects.length));
      sync();
    }
  },
});

// ----- Transitions entre vues -----

let current = { view: 'home' };

const projectPage = (i) => ({
  theme: projects[i],
  html: projectTemplate(projects[i], i, projects),
  image: scene.cardImage('works', i),
});

async function openSection(i) {
  setLayer('section');
  fadeOut(homeChrome);
  const rect = await scene.openCard('home', i);
  await page.open({
    theme: sections[i],
    html: sectionTemplate(sections[i], i, sections.length),
    image: scene.cardImage('home', i),
    rect,
  });
  scene.setPaused(true);
  current = { view: 'section', index: i };
}

async function closeSection() {
  scene.setPaused(false);
  await page.close(scene.openRect());
  fadeIn(homeChrome, 0.4);
  await scene.closeCard('home');
  current = { view: 'home' };
  setLayer('home');
}

async function openWorks() {
  setLayer('none');
  fadeOut(homeChrome);
  await scene.openWorks(PROJECTS_CARD);
  current = { view: 'works' };
  setLayer('works');
  fadeIn(worksUi);
}

async function closeWorks() {
  setLayer('none');
  fadeOut(worksUi);
  await scene.closeWorks(PROJECTS_CARD);
  current = { view: 'home' };
  setLayer('home');
  fadeIn(homeChrome);
}

async function openWork(i) {
  setLayer('none');
  fadeOut(worksUi);
  const rect = await scene.openCard('works', i);
  await page.open({ ...projectPage(i), rect });
  scene.setPaused(true);
  current = { view: 'work', index: i };
}

async function closeWork() {
  scene.setPaused(false);
  await page.close(scene.openRect());
  fadeIn(worksUi, 0.4);
  await scene.closeCard('works');
  current = { view: 'works' };
  setLayer('works');
}

async function swapWork(i) {
  scene.swapCard('works', i);
  await page.swap(projectPage(i));
  current = { view: 'work', index: i };
}

// Avance d'une transition vers la route visée ; renvoie false une fois arrivé
async function stepTowards(target) {
  const { view, index } = current;
  if (view === 'work') {
    if (target.view !== 'work') return closeWork().then(() => true);
    if (target.index === index) return false;
    return swapWork(target.index).then(() => true);
  }
  if (view === 'section') {
    if (target.view === 'section' && target.index === index) return false;
    return closeSection().then(() => true);
  }
  if (view === 'works') {
    if (target.view === 'works') return false;
    if (target.view === 'work') return openWork(target.index).then(() => true);
    return closeWorks().then(() => true);
  }
  if (target.view === 'home') return false;
  if (target.view === 'section') return openSection(target.index).then(() => true);
  return openWorks().then(() => true);
}

let busy = false;
async function sync() {
  if (busy) return;
  busy = true;
  try {
    // les transitions ont besoin des cartes : on attend que la scène soit prête
    await scene.ready;
    while (await stepTowards(parseRoute()));
  } finally {
    busy = false;
  }
}

window.addEventListener('hashchange', sync);

// ----- Clavier et boutons -----

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && current.view !== 'home') {
    go(current.view === 'work' ? '#/projets' : '#/');
    return;
  }
  if (busy || (current.view !== 'home' && current.view !== 'works')) return;
  const set = current.view;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); scene.step(set, 1); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); scene.step(set, -1); }
  if (e.key === 'Enter' && (e.target === document.body || e.target.id === 'stage')) {
    const i = scene.activeIndex(set);
    go(set === 'home' ? sectionRoute(i) : projectRoute(i));
  }
});

for (const set of ['home', 'works']) {
  document.getElementById(`${set}-prev`).addEventListener('click', () => scene.step(set, -1));
  document.getElementById(`${set}-next`).addEventListener('click', () => scene.step(set, 1));
}

await nextTask();

// plan du site pour les lecteurs d'écran
const sitemap = document.getElementById('sitemap');
const links = [
  ...sections.map((s, i) => [sectionRoute(i), s.title]),
  ...projects.map((p, i) => [projectRoute(i), `Projet : ${p.title}`]),
];
sitemap.innerHTML = links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('');

// ----- Démarrage -----

// (l'entrée de l'en-tête est une animation CSS : elle démarre avant même le chargement du JS)
scene.intro();
setTimeout(sync, reduceMotion ? 0 : 900);
