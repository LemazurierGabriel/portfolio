import { defineConfig } from 'vite';

// Le CSS (≈ 12 Ko) est intégré directement dans le HTML de production :
// il ne bloque plus le premier affichage avec une requête séparée.
const inlineCss = {
  name: 'inline-css',
  apply: 'build',
  enforce: 'post',
  generateBundle(_, bundle) {
    const html = Object.values(bundle).find((file) => file.fileName === 'index.html');
    if (!html) return;
    for (const [name, file] of Object.entries(bundle)) {
      if (!name.endsWith('.css')) continue;
      const link = new RegExp(`<link[^>]*href="/${name}"[^>]*>`);
      html.source = html.source.replace(link, () => `<style>${file.source}</style>`);
      delete bundle[name];
    }
  },
};

export default defineConfig({
  plugins: [inlineCss],
});
