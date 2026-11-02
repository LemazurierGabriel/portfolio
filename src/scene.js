import * as THREE from 'three';
import gsap from 'gsap';
import { createPaperMaterial } from './paperMaterial.js';
import { getCardCanvas } from './cardTexture.js';

const CARD_W = 3;
const CARD_H = 4;
const HOME_SPACING = CARD_W + 0.9;

const damp = (current, target, lambda, dt) => current + (target - current) * (1 - Math.exp(-lambda * dt));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};
// position relative dans une boucle : résultat dans [-size/2, size/2[
const wrapCentered = (v, size) => {
  const w = ((v % size) + size) % size;
  return w >= size / 2 ? w - size : w;
};
const wait = (s) => new Promise((resolve) => gsap.delayedCall(s, resolve));

function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.filter = 'blur(22px)';
  g.fillStyle = 'rgba(40, 30, 20, 0.55)';
  g.fillRect(56, 50, 144, 156);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Deux ensembles de cartes en papier :
 * - home  : les sections du portfolio, en carrousel horizontal
 * - works : les projets, en tourbillon autour d'un axe vertical
 */
export function createScene({ container, sections, projects, reduceMotion, onActive, onSelect }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // sur mobile, 1,5 suffit pour du papier net et allège beaucoup le rendu
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 760 ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // la vérification synchrone des shaders bloque la compilation en arrière-plan : seulement en dev
  renderer.debug.checkShaderErrors = import.meta.env.DEV;
  container.appendChild(renderer.domElement);
  const canvasEl = renderer.domElement;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

  const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H, 60, 80);
  const shadowGeometry = new THREE.PlaneGeometry(5.3, 6.6);
  const shadowTexture = makeShadowTexture();
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

  const textures = new Map();
  function cardTexture(item, index, set) {
    const key = `${set}-${index}`;
    if (!textures.has(key)) {
      const canvas = getCardCanvas(item, index, key);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = maxAnisotropy;
      textures.set(key, { canvas, texture, image: null });
    }
    return textures.get(key);
  }

  // slot : place dans la boucle (plusieurs exemplaires d'une même carte peuvent tourner)
  function makeCard(item, index, set, seed, slot) {
    const { texture } = cardTexture(item, index, set);

    const material = createPaperMaterial(texture, { seed, halfSize: { x: CARD_W / 2, y: CARD_H / 2 } });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 1;

    const shadow = new THREE.Mesh(
      shadowGeometry,
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    );
    shadow.position.set(0.15, -0.25, -0.5);

    const group = new THREE.Group();
    group.add(shadow, mesh);
    scene.add(group);

    const sign = index % 2 ? 1 : -1;
    const startFlat = set === 'home' && reduceMotion;
    return {
      item, index, slot, set, group, mesh, shadow, material,
      u: 0,
      crumple: startFlat ? 0 : 1,
      intro: set === 'home' && !reduceMotion ? 1 : 0,
      force: 0,
      fade: 0,
      hover: 0,
      openT: 0,
      swirl: set === 'works' ? 1 : 0,
      spin: sign,
      tilt: sign * (0.015 + ((index * 0.37) % 1) * 0.02),
    };
  }

  // l'accueil tourne sur au moins 8 emplacements, pour que la boucle reste hors champ
  // et que les cartes arrivent froissées par les bords avant de se déplier
  const homeSlots = sections.length * Math.ceil(8 / sections.length);
  const sets = {
    // cartes de l'accueil créées par petits lots au démarrage (voir `ready`)
    home: [],
    // les cartes projets ne sont pas nécessaires au premier affichage :
    // elles sont préparées une par une pendant les temps morts (voir prepareWorks)
    works: [],
  };
  const opened = { home: null, works: null };

  function addWorkCard() {
    const i = sets.works.length;
    if (i >= projects.length) return false;
    const card = makeCard(projects[i], i, 'works', i * 5.17 + 40.3, i);
    card.group.visible = false;
    sets.works.push(card);
    allCards.push(card);
    return true;
  }

  // toutes les cartes projets, tout de suite (ouverture du tourbillon)
  function ensureWorks() {
    while (addWorkCard());
  }

  // une carte par temps mort, pour ne jamais bloquer le navigateur longtemps ;
  // on attend la première interaction (ou 10 s) pour ne pas ralentir le chargement
  function prepareWorks() {
    const events = ['pointerdown', 'pointermove', 'wheel', 'keydown', 'touchstart'];
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      events.forEach((type) => window.removeEventListener(type, start));
      prepareWorksNow();
    };
    events.forEach((type) => window.addEventListener(type, start, { passive: true }));
    setTimeout(start, 10000);
  }

  function prepareWorksNow() {
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200));
    // dessin de l'affiche, puis envoi de sa texture au GPU, chacun dans son propre temps mort
    const next = () =>
      idle(() => {
        if (!addWorkCard()) return;
        const card = sets.works[sets.works.length - 1];
        idle(() => { renderer.initTexture(card.material.uniforms.uMap.value); next(); }, { timeout: 4000 });
      }, { timeout: 4000 });
    next();
  }

  // l'exemplaire de la carte le plus proche du centre
  const nearestCard = (set, index) =>
    sets[set].filter((c) => c.index === index).sort((a, b) => Math.abs(a.u) - Math.abs(b.u))[0];
  const allCards = [];
  // position courante / visée, en « index de carte »
  const nav = {
    home: { pos: 0, target: 0, active: -1 },
    works: { pos: 0, target: 0, active: -1 },
  };

  let view = 'home'; // ensemble qui reçoit les interactions
  let interactive = true;
  let worksShown = false;
  let paused = false;
  let halfWidth = 1;
  let isNarrow = false;
  // taille mémorisée : la relire à chaque image forcerait un recalcul de mise en page
  let viewW = 1;
  let viewH = 1;

  function resize() {
    const w = (viewW = container.clientWidth);
    const h = (viewH = container.clientHeight);
    renderer.setSize(w, h);
    camera.aspect = w / h;
    isNarrow = camera.aspect < 0.8;
    camera.position.z = isNarrow ? 15 : 12;
    camera.updateProjectionMatrix();
    halfWidth = tanHalfFov * camera.position.z * camera.aspect;
  }

  // Taille et profondeur de la carte agrandie (elle tient dans l'écran, centrée)
  function openMetrics() {
    const w = viewW;
    const h = viewH;
    const cardH = Math.min(h * 0.84, (w * 0.86 * CARD_H) / CARD_W);
    const cardW = (cardH * CARD_W) / CARD_H;
    const z = camera.position.z - CARD_H / (2 * tanHalfFov * (cardH / h));
    return { z, rect: { left: (w - cardW) / 2, top: (h - cardH) / 2, width: cardW, height: cardH } };
  }

  // ----- Poses -----

  function homePose(card) {
    const u = wrapCentered(card.slot - nav.home.pos, sets.home.length);
    const x = u * HOME_SPACING;
    const h = card.hover;
    card.u = u;
    return {
      x,
      y: h * 0.08,
      z: -Math.abs(x) * 0.18 + h * 0.35,
      ry: -x * 0.045,
      rz: card.tilt * (1 - h),
      scale: 1,
      // les cartes se froissent en sortant de l'écran et se déplient en y entrant
      crumple: smoothstep(halfWidth - CARD_W * 0.35, halfWidth + CARD_W * 0.7, Math.abs(x)),
      fade: 0,
    };
  }

  function workPose(card, openZ) {
    const n = sets.works.length;
    const u = wrapCentered(card.index - nav.works.pos, n);
    const R = isNarrow ? 3 : 4.6;
    const sw = card.swirl; // 1 = aspirée au centre du tourbillon, 0 = à sa place sur la spirale
    const theta = u * ((Math.PI * 2) / n) + sw * (Math.PI * 3 + Math.abs(u) * 0.8);
    const radius = R * (1 - 0.07 * u) * (1 - sw * 0.88);
    const h = card.hover;
    const z = Math.cos(theta) * radius - R * (1 - sw);
    card.u = u;
    return {
      x: Math.sin(theta) * radius,
      // pas vertical de la spirale + axe incliné : le fond du tourbillon remonte
      y: (-u * (isNarrow ? 1.5 : 1.45) - z * 0.22) * (1 - sw),
      z: z + sw * (openZ - 1.5) + h * 0.4,
      ry: Math.sin(theta) * 0.6 + sw * theta,
      rz: -u * 0.07,
      scale: (1 - 0.7 * sw) * (1 - 0.12 * Math.min(Math.abs(u), 2)),
      crumple: Math.max(sw, smoothstep(2.2, 2.8, Math.abs(u))),
      fade: smoothstep(2.3, 2.95, Math.abs(u)),
    };
  }

  // ----- Interaction -----

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered = null;
  let pointerDown = false;
  let dragging = false;
  let startX = 0, startY = 0, startTarget = 0, lastValue = 0, lastT = 0, flick = 0;
  let snapTimer = 0;

  const worldPerPx = () => (halfWidth * 2) / viewW;

  function snap(set, direction = 0) {
    const k = nav[set].target;
    nav[set].target = direction > 0 ? Math.ceil(k - 0.1) : direction < 0 ? Math.floor(k + 0.1) : Math.round(k);
  }

  function pick(e) {
    const r = canvasEl.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const candidates = sets[view].filter((c) => c.group.visible);
    const hit = raycaster.intersectObjects(candidates.map((c) => c.mesh), false)[0];
    return hit ? candidates.find((c) => c.mesh === hit.object) : null;
  }

  function dragValue(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    return view === 'home'
      ? startTarget - (dx * worldPerPx()) / HOME_SPACING
      : startTarget - (dx + dy) / 240;
  }

  canvasEl.addEventListener('pointerdown', (e) => {
    if (!interactive) return;
    pointerDown = true;
    dragging = false;
    startX = e.clientX;
    startY = e.clientY;
    startTarget = lastValue = nav[view].target;
    lastT = performance.now();
    flick = 0;
    canvasEl.setPointerCapture(e.pointerId);
  });

  canvasEl.addEventListener('pointermove', (e) => {
    if (pointerDown) {
      if (!dragging && Math.hypot(e.clientX - startX, e.clientY - startY) > 6) {
        dragging = true;
        hovered = null;
        canvasEl.style.cursor = 'grabbing';
      }
      if (dragging) {
        const value = dragValue(e);
        const now = performance.now();
        flick = (value - lastValue) / Math.max(now - lastT, 1);
        lastValue = value;
        lastT = now;
        nav[view].target = value;
      }
      return;
    }
    if (!interactive) return;
    hovered = pick(e);
    canvasEl.style.cursor = hovered ? 'pointer' : 'grab';
  });

  const endPointer = (e) => {
    if (!pointerDown) return;
    pointerDown = false;
    if (dragging) {
      dragging = false;
      nav[view].target += flick * 120;
      snap(view, Math.sign(nav[view].target - startTarget));
      canvasEl.style.cursor = 'grab';
      return;
    }
    if (e.type === 'pointerup' && interactive) {
      const card = pick(e);
      if (card) onSelect(card.set, card.index);
    }
  };
  canvasEl.addEventListener('pointerup', endPointer);
  canvasEl.addEventListener('pointercancel', endPointer);
  canvasEl.addEventListener('pointerleave', () => { if (!pointerDown) hovered = null; });

  canvasEl.addEventListener(
    'wheel',
    (e) => {
      if (!interactive) return;
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const set = view;
      nav[set].target += delta * (set === 'home' ? 0.002 : 0.003);
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => snap(set, Math.sign(delta)), 140);
    },
    { passive: false }
  );

  // ----- Boucle de rendu -----

  const timer = new THREE.Timer();

  function tick(time) {
    timer.update(time);
    const dt = Math.min(timer.getDelta(), 0.05);
    for (const set of ['home', 'works']) {
      const s = nav[set];
      s.pos = damp(s.pos, s.target, dragging && view === set ? 16 : 6, dt);
    }
    const openZ = openMetrics().z;
    const bend = THREE.MathUtils.clamp((nav.home.target - nav.home.pos) * HOME_SPACING * 0.08, -0.5, 0.5);

    for (const card of allCards) {
      if (card.set === 'works' && !worksShown) {
        card.group.visible = false;
        continue;
      }
      const isHovered = card === hovered && interactive && card.set === view;
      card.hover = damp(card.hover, isHovered ? 1 : 0, 10, dt);
      const b = card.set === 'home' ? homePose(card) : workPose(card, openZ);
      const t = card.openT;

      card.crumple = damp(card.crumple, Math.max(card.intro, b.crumple * (1 - t), card.force), 6, dt);
      const c = card.crumple;

      card.group.position.set(lerp(b.x, 0, t), lerp(b.y, 0, t), lerp(b.z, openZ, t));
      card.group.rotation.set(0, lerp(b.ry, 0, t), lerp(b.rz, 0, t));
      card.group.scale.setScalar(lerp(b.scale, 1, t));
      card.mesh.rotation.set(c * 0.5 * card.spin, c * 0.35, c * 1.6 * card.spin);

      const opacity = (1 - card.fade) * (1 - b.fade * (1 - t));
      card.group.visible = opacity > 0.002;
      const u = card.material.uniforms;
      u.uCrumple.value = c;
      u.uBend.value = card.set === 'home' ? bend * (1 - t) : 0;
      u.uOpacity.value = opacity;
      card.shadow.material.opacity = 0.55 * (1 - 0.7 * c) * opacity * (1 - t);
      card.shadow.scale.setScalar(1 - 0.6 * c);
    }

    if (interactive) {
      const s = nav[view];
      const n = sets[view].length;
      const active = sets[view][((Math.round(s.pos) % n) + n) % n].index;
      if (active !== s.active) {
        s.active = active;
        onActive(view, active);
      }
    }

    if (!paused) renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize);
  canvasEl.style.cursor = 'grab';

  // Démarrage découpé en petites tâches pour ne pas figer la page :
  // shaders compilés en arrière-plan, puis une texture envoyée au GPU par tâche.
  const nextTask = () => new Promise((resolve) => setTimeout(resolve, 0));
  const ready = (async () => {
    for (let slot = 0; slot < homeSlots; slot++) {
      const i = slot % sections.length;
      const card = makeCard(sections[i], i, 'home', slot * 7.31 + 1.7, slot);
      sets.home.push(card);
      allCards.push(card);
      if (slot % 2) await nextTask();
    }
    await renderer.compileAsync(scene, camera);
    for (const { texture } of textures.values()) {
      renderer.initTexture(texture);
      await nextTask();
    }
    renderer.initTexture(shadowTexture);
  })()
    .catch(() => {})
    .then(() => requestAnimationFrame(tick));

  // ----- Transitions -----

  // Agrandit une carte au centre ; résout avec sa position à l'écran
  function openCard(set, index, { instant = false } = {}) {
    const cards = sets[set];
    const card = nearestCard(set, index);
    opened[set] = card;
    interactive = false;
    hovered = null;
    nav[set].target = Math.round(nav[set].pos + card.u);
    const d = instant ? 0 : 1;
    gsap.killTweensOf(cards, 'force,fade,openT,intro');
    cards.forEach((c) => { c.intro = 0; });
    if (instant) card.crumple = 0;
    gsap.to(cards.filter((c) => c !== card), {
      force: 1, fade: 1, duration: 0.7 * d, ease: 'power2.in', stagger: 0.03 * d,
    });
    gsap.to(card, { force: 0, fade: 0, duration: 0.3 * d });
    return new Promise((resolve) => {
      gsap.to(card, {
        openT: 1,
        duration: 1 * d,
        ease: 'power3.inOut',
        onComplete: () => resolve(openMetrics().rect),
      });
    });
  }

  // Ramène la carte agrandie à sa place et déplie ses voisines
  function closeCard(set) {
    const cards = sets[set];
    const card = opened[set] ?? nearestCard(set, nav[set].active);
    opened[set] = null;
    paused = false;
    gsap.killTweensOf(cards, 'force,fade,openT');
    gsap.to(card, { openT: 0, duration: 0.95, ease: 'power3.inOut' });
    gsap.to(card, { force: 0, fade: 0, duration: 0.5 });
    gsap.to(cards.filter((c) => c !== card), {
      force: 0, fade: 0, duration: 0.9, delay: 0.3, ease: 'power2.out', stagger: 0.05,
    });
    return wait(0.95).then(() => {
      view = set;
      interactive = true;
    });
  }

  // La carte « Projets » s'agrandit, se froisse, et les projets en jaillissent en tourbillon
  async function openWorks(homeIndex, { instant = false } = {}) {
    ensureWorks();
    await openCard('home', homeIndex, { instant });
    const d = instant ? 0 : 1;
    const home = opened.home;
    worksShown = true;
    nav.works.pos = nav.works.target = Math.round(nav.works.target);
    sets.works.forEach((c) => {
      Object.assign(c, { swirl: 1, crumple: 1, force: 0, fade: 0, openT: 0, intro: 0, hover: 0 });
      c.u = wrapCentered(c.index - nav.works.pos, sets.works.length);
    });
    gsap.to(home, { force: 1, fade: 1, duration: 0.6 * d, ease: 'power2.in' });
    const order = [...sets.works].sort((a, b) => Math.abs(a.u) - Math.abs(b.u));
    await new Promise((resolve) => {
      gsap.to(order, {
        swirl: 0, duration: 1.8 * d, ease: 'power3.out', stagger: 0.09 * d, delay: 0.2 * d, onComplete: resolve,
      });
    });
    view = 'works';
    interactive = true;
  }

  // Les projets sont aspirés par le tourbillon, la carte « Projets » se redéplie
  async function closeWorks(homeIndex) {
    interactive = false;
    hovered = null;
    const home = opened.home ?? nearestCard('home', homeIndex);
    gsap.killTweensOf(sets.works);
    const order = [...sets.works].sort((a, b) => Math.abs(b.u) - Math.abs(a.u));
    gsap.to(order, { swirl: 1, duration: 1.1, ease: 'power3.in', stagger: 0.05 });
    gsap.to(sets.works, { fade: 1, duration: 0.35, delay: 1 });
    gsap.to(home, { force: 0, fade: 0, duration: 0.9, delay: 0.9, ease: 'power2.out' });
    await wait(1.5);
    worksShown = false;
    await closeCard('home');
  }

  // Remplace la carte agrandie sans animation (page « projet suivant »)
  function swapCard(set, index) {
    const cards = sets[set];
    gsap.killTweensOf(cards, 'force,fade,openT,intro');
    const card = nearestCard(set, index);
    opened[set] = card;
    cards.forEach((c) => {
      const isCard = c === card;
      Object.assign(c, { openT: isCard ? 1 : 0, force: isCard ? 0 : 1, fade: isCard ? 0 : 1, crumple: isCard ? 0 : 1, intro: 0 });
    });
    nav[set].pos = nav[set].target = card.slot;
    nav[set].active = index;
    onActive(set, index);
  }

  return {
    // résolu quand les cartes de l'accueil sont prêtes et la première image affichée
    ready,
    activeIndex: (set) => nav[set].active,

    intro() {
      ready.then(() => {
        prepareWorks();
        if (reduceMotion) return;
        sets.home.forEach((c) => { c.u = wrapCentered(c.slot - nav.home.pos, sets.home.length); });
        const order = [...sets.home].sort((a, b) => Math.abs(a.u) - Math.abs(b.u));
        gsap.to(order, { intro: 0, duration: 1.2, ease: 'power3.out', stagger: 0.08, delay: 0.1 });
      });
    },

    step(set, direction) {
      if (!interactive || view !== set) return;
      nav[set].target = Math.round(nav[set].target) + direction;
    },

    cardImage(set, index) {
      if (set === 'works') ensureWorks();
      const entry = cardTexture(null, index, set);
      entry.image ??= entry.canvas.toDataURL('image/jpeg', 0.9);
      return entry.image;
    },

    openRect: () => openMetrics().rect,
    setPaused(value) { paused = value; },
    openCard,
    closeCard,
    openWorks,
    closeWorks,
    swapCard,
  };
}
