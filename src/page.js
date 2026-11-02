import gsap from 'gsap';

// Page plein écran qui s'ouvre depuis une carte agrandie et s'y replie à la fermeture.
export function createPage(root, { onAction }) {
  const bg = root.querySelector('.page__bg');
  const ghost = root.querySelector('.page__ghost');
  const scroller = root.querySelector('.page__scroll');
  let returnFocus = null;

  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (el) onAction(el.dataset.action);
  });

  const insetFrom = (r) =>
    `inset(${r.top}px ${root.clientWidth - r.left - r.width}px ${root.clientHeight - r.top - r.height}px ${r.left}px round 4px)`;

  const placeGhost = (r) => Object.assign(ghost.style, {
    left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`,
  });

  const items = () => scroller.querySelectorAll('[data-reveal]');
  // focus sur la page elle-même (Tab mène ensuite au bouton retour) sans afficher d'anneau sur le bouton
  const focusClose = () => scroller.focus({ preventScroll: true });

  // Boutons du haut : couleurs papier au-dessus de l'étude de cas,
  // cachés quand on descend, de retour dès qu'on remonte
  let lastScroll = 0;
  function updateBar() {
    const bar = scroller.querySelector('.page__bar');
    if (!bar) return;
    const y = scroller.scrollTop;
    const barH = bar.offsetHeight;
    const paper = scroller.querySelector('.case')?.getBoundingClientRect();
    const onPaper = !!paper && paper.top <= barH && paper.bottom > barH;
    bar.classList.toggle('is-paper', onPaper);
    bar.classList.toggle('is-hidden', y > lastScroll && y > window.innerHeight * 0.5);
    lastScroll = y;
  }
  scroller.addEventListener('scroll', updateBar, { passive: true });

  // chaque bloc apparaît quand il entre dans l'écran (par vagues, dans l'ordre)
  let observer = null;
  function revealOnScroll() {
    observer?.disconnect();
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target);
        if (!visible.length) return;
        visible.forEach((el) => observer.unobserve(el));
        gsap.to(visible, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 });
      },
      { root: scroller, threshold: 0.12 }
    );
    items().forEach((el) => observer.observe(el));
  }

  function render({ theme, html, image }) {
    root.style.setProperty('--p-bg', theme.color);
    root.style.setProperty('--p-ink', theme.ink);
    scroller.innerHTML = html;
    scroller.querySelectorAll('[data-poster]').forEach((img) => { img.src = image; });
    ghost.src = image;
    scroller.scrollTop = 0;
    lastScroll = 0;
  }

  return {
    // La carte (au rect donné) s'étend en plein écran, puis le contenu apparaît
    async open({ theme, html, image, rect, instant = false }) {
      returnFocus = document.activeElement;
      render({ theme, html, image });
      bg.style.backgroundColor = '';
      placeGhost(rect);
      root.inert = false;
      root.classList.add('is-open');
      gsap.set(items(), { opacity: 0, y: 40 });
      gsap.set(ghost, { opacity: 1, scale: 1 });

      const d = instant ? 0 : 1;
      await gsap.timeline()
        .fromTo(bg, { clipPath: insetFrom(rect) }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 0.85 * d, ease: 'power3.inOut' })
        .to(ghost, { opacity: 0, scale: 0.96, duration: 0.5 * d, ease: 'power2.out' }, 0.25 * d)
        .add(revealOnScroll, 0.55 * d);
      focusClose();
    },

    // Le contenu disparaît et la page se replie sur la carte
    async close(rect) {
      observer?.disconnect();
      placeGhost(rect);
      await gsap.timeline()
        .to(scroller, { opacity: 0, duration: 0.3, ease: 'power2.in' })
        .to(bg, { clipPath: insetFrom(rect), duration: 0.8, ease: 'power3.inOut' })
        .to(ghost, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }, '<0.3');
      root.classList.remove('is-open');
      root.inert = true;
      gsap.set(scroller, { opacity: 1 });
      returnFocus?.focus({ preventScroll: true });
    },

    // Change de contenu sans quitter la page (projet suivant)
    async swap({ theme, html, image }) {
      observer?.disconnect();
      await gsap.to(scroller, { opacity: 0, duration: 0.3, ease: 'power2.in' });
      gsap.to(bg, { backgroundColor: theme.color, duration: 0.6, ease: 'power2.inOut' });
      render({ theme, html, image });
      gsap.set(items(), { opacity: 0, y: 40 });
      gsap.set(scroller, { opacity: 1 });
      revealOnScroll();
      focusClose();
    },
  };
}
