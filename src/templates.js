import { about, parcours, contact } from './content.js';

const pad = (n) => String(n).padStart(2, '0');

const bar = (closeLabel, right) => `
  <header class="page__bar" data-reveal>
    <button type="button" class="pill" data-action="close"><span aria-hidden="true">←</span> ${closeLabel}</button>
    <span class="pill pill--static">${right}</span>
  </header>`;

const hero = (kicker, title) => `
  <div class="page__hero">
    <p class="page__kicker" data-reveal>${kicker}</p>
    <h1 class="page__title" id="page-title" data-reveal>${title}</h1>
  </div>`;

const nextLink = (label, title, href) => `
  <a class="page__next" href="${href}" data-reveal>
    <span class="page__next-label">${label}</span>
    <span class="page__next-title">${title} <span aria-hidden="true">→</span></span>
  </a>`;

// capture dans un cadre de navigateur ; variant : '' | 'right' | 'left'
const shot = (img, host, variant = '') => `
  <figure class="shot ${variant ? `shot--${variant}` : ''}" data-reveal>
    <div class="shot__bar" aria-hidden="true"><i></i><i></i><i></i><span>${host}</span></div>
    <img src="${img.src}" alt="${img.alt}" loading="lazy" decoding="async" />
  </figure>`;

const placeholder = () => `
  <div class="case-placeholder" data-reveal>Visuel à venir</div>`;

const step = (s, i) => `
  <section class="case-step" data-reveal>
    <div class="case-step__head">
      <span class="case-step__num" aria-hidden="true">${pad(i + 1)}</span>
      <h2>${s.title}</h2>
    </div>
    <p>${s.text}</p>
  </section>`;

export function projectTemplate(project, index, projects) {
  const next = projects[(index + 1) % projects.length];
  const images = project.images ?? [];
  const host = project.url ? new URL(project.url).host : `${project.slug}.local`;
  const link = project.url
    ? `<a href="${project.url}" target="_blank" rel="noopener">${host} ↗</a>`
    : 'Bientôt en ligne';

  // la première capture ouvre l'étude de cas, les suivantes s'intercalent entre les étapes
  const [cover, ...rest] = images;
  const steps = project.sections
    .map((s, i) => step(s, i) + (rest[i] ? shot(rest[i], host, i % 2 ? 'left' : 'right') : ''))
    .join('');
  const extra = rest.slice(project.sections.length).map((img) => shot(img, host)).join('');

  return `
    ${bar('Tous les projets', `N°${pad(index + 1)} / ${pad(projects.length)}`)}
    <header class="case-hero">
      <div class="case-hero__text">
        <p class="page__kicker" data-reveal>${project.category} — ${project.year}</p>
        <h1 class="page__title" id="page-title" data-reveal>${project.title}</h1>
        <p class="case-hero__lead" data-reveal>${project.summary}</p>
      </div>
      <figure class="case-hero__poster" data-reveal>
        <img data-poster alt="" />
      </figure>
    </header>

    <article class="case">
      <dl class="case-meta" data-reveal>
        <div><dt>Rôle</dt><dd>${project.role}</dd></div>
        <div><dt>Année</dt><dd>${project.year}</dd></div>
        <div>
          <dt>Outils</dt>
          <dd><ul class="case-tools">${project.tools.map((t) => `<li>${t}</li>`).join('')}</ul></dd>
        </div>
        <div><dt>En ligne</dt><dd>${link}</dd></div>
      </dl>
      ${cover ? shot(cover, host) : placeholder()}
      ${steps}
      ${extra}
    </article>

    <button type="button" class="case-next" data-action="next" style="--n-bg: ${next.color}; --n-ink: ${next.ink}">
      <span class="case-next__label">Projet suivant</span>
      <span class="case-next__title">${next.title} <span class="case-next__arrow" aria-hidden="true">→</span></span>
    </button>`;
}

const sectionBodies = {
  'a-propos': () => `
    <div class="page__grid" data-reveal>
      <p class="page__lead">${about.lead}</p>
      <dl class="page__meta">
        ${about.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
      </dl>
    </div>
    <section class="page__body page__body--spaced" data-reveal>
      ${about.sections.map((s) => `<h2>${s.title}</h2><p>${s.text}</p>`).join('')}
    </section>
    <ul class="chips" data-reveal>
      ${about.skills.map((s) => `<li>${s}</li>`).join('')}
    </ul>
    ${nextLink('Suite', 'Parcours', '#/parcours')}`,

  parcours: () => `
    <ol class="timeline">
      ${parcours
        .map(
          (i) => `
        <li class="timeline__item" data-reveal>
          <span class="timeline__years">${i.years}</span>
          <div>
            <h2>${i.title}</h2>
            <p class="timeline__place">${i.place}</p>
            <p>${i.text}</p>
          </div>
        </li>`
        )
        .join('')}
    </ol>
    ${nextLink('Suite', 'Contact', '#/contact')}`,

  contact: () => `
    <p class="page__lead page__lead--wide" data-reveal>${contact.lead}</p>
    <a class="contact__mail" href="mailto:${contact.email}" data-reveal>${contact.email}</a>
    <ul class="contact__socials" data-reveal>
      ${contact.socials.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label} ↗</a></li>`).join('')}
    </ul>
    ${nextLink('En attendant', 'Voir les projets', '#/projets')}`,
};

export function sectionTemplate(section, index, total) {
  return `
    ${bar('Accueil', `N°${pad(index + 1)} / ${pad(total)}`)}
    ${hero(section.category, section.title)}
    ${sectionBodies[section.id]()}`;
}
