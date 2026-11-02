// Dessine l'affiche d'un projet sur un canvas (sert de texture 3D et d'image dans la page projet).
export const CARD_PX = { w: 1024, h: 1365 };

const motifs = {
  sun(g, W, H, p) {
    g.fillStyle = p.accent;
    g.beginPath();
    g.arc(W * 0.6, H * 0.37, W * 0.3, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = p.ink;
    g.fillRect(64, H * 0.37, W - 128, 4);
    g.beginPath();
    g.arc(W * 0.24, H * 0.56, 44, 0, Math.PI * 2);
    g.fill();
  },
  arch(g, W, H, p) {
    const drawArch = (w, top, bottom) => {
      const x = (W - w) / 2;
      g.beginPath();
      g.moveTo(x, bottom);
      g.lineTo(x, top + w / 2);
      g.arc(W / 2, top + w / 2, w / 2, Math.PI, 0);
      g.lineTo(x + w, bottom);
      g.closePath();
    };
    g.fillStyle = p.accent;
    drawArch(W * 0.56, H * 0.15, H * 0.63);
    g.fill();
    g.strokeStyle = p.ink;
    g.lineWidth = 5;
    drawArch(W * 0.38, H * 0.25, H * 0.63);
    g.stroke();
  },
  grid(g, W, H, p) {
    g.fillStyle = p.accent;
    const cols = 5, rows = 6;
    const x0 = 150, x1 = W - 150, y0 = 230, y1 = H * 0.62;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const r = 12 + 30 * (0.5 + 0.5 * Math.sin(i * 0.9 + j * 1.3));
        g.beginPath();
        g.arc(x0 + ((x1 - x0) * i) / (cols - 1), y0 + ((y1 - y0) * j) / (rows - 1), r, 0, Math.PI * 2);
        g.fill();
      }
    }
  },
  wave(g, W, H, p) {
    g.strokeStyle = p.accent;
    g.lineWidth = 16;
    g.lineCap = 'round';
    for (let k = 0; k < 9; k++) {
      const y0 = 230 + k * 56;
      g.beginPath();
      for (let x = 64; x <= W - 64; x += 8) {
        const y = y0 + Math.sin(x * 0.011 + k * 0.55) * 38;
        x === 64 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
    }
  },
  stripes(g, W, H, p) {
    const cx = W / 2, cy = H * 0.39, r = W * 0.33;
    g.save();
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.clip();
    g.translate(cx, cy);
    g.rotate(-0.5);
    g.fillStyle = p.accent;
    for (let y = -r * 1.5; y < r * 1.5; y += 60) g.fillRect(-r * 1.5, y, r * 3, 30);
    g.restore();
    g.strokeStyle = p.ink;
    g.lineWidth = 5;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.stroke();
  },
  // ampoule brutaliste, rayons rouges (inventions)
  bulb(g, W, H, p) {
    const cx = W * 0.5, cy = H * 0.3, r = W * 0.17;
    g.strokeStyle = p.accent;
    g.lineWidth = 14;
    g.lineCap = 'butt';
    for (let i = 0; i < 9; i++) {
      const a = Math.PI + (i / 8) * Math.PI;
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * (r + 40), cy + Math.sin(a) * (r + 40));
      g.lineTo(cx + Math.cos(a) * (r + 100), cy + Math.sin(a) * (r + 100));
      g.stroke();
    }
    g.fillStyle = p.ink;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fill();
    g.fillRect(cx - r * 0.55, cy + r * 0.6, r * 1.1, r * 0.9);
    g.fillStyle = p.color;
    for (let i = 0; i < 3; i++) g.fillRect(cx - r * 0.55, cy + r * 0.95 + i * r * 0.25, r * 1.1, 8);
    g.fillStyle = p.accent;
    g.fillRect(cx - 6, cy - r * 0.45, 12, r * 0.95);
  },
  // porte entrouverte d'où filtre la lumière (escape game)
  door(g, W, H, p) {
    // tout reste au-dessus du titre, qui tient souvent sur deux lignes
    const x = W * 0.33, y = H * 0.12, w = W * 0.32, h = H * 0.4;
    // halo de lumière au sol
    g.fillStyle = p.accent;
    g.globalAlpha = 0.18;
    g.beginPath();
    g.moveTo(x + w * 0.55, y + h);
    g.lineTo(x + w, y + h);
    g.lineTo(W - 60, H * 0.56);
    g.lineTo(x + w * 0.25, H * 0.56);
    g.closePath();
    g.fill();
    g.globalAlpha = 1;
    // ouverture éclairée
    g.fillRect(x + w * 0.55, y, w * 0.45, h);
    // battant de la porte, en perspective
    g.fillStyle = p.ink;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + w * 0.55, y + h * 0.06);
    g.lineTo(x + w * 0.55, y + h * 0.94);
    g.lineTo(x, y + h);
    g.closePath();
    g.fill();
    g.fillStyle = p.color;
    g.beginPath();
    g.arc(x + w * 0.45, y + h * 0.52, 12, 0, Math.PI * 2);
    g.fill();
    // chambranle
    g.strokeStyle = p.ink;
    g.lineWidth = 8;
    g.strokeRect(x, y, w, h);
  },
  // pokéball en gros pixels, façon Game Boy
  pixel(g, W, H, p) {
    const size = 34;
    const cols = 17;
    const x0 = (W - cols * size) / 2;
    const y0 = H * 0.12;
    const c = (cols - 1) / 2;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < cols; j++) {
        const d = Math.hypot(i - c, j - c);
        if (d > c + 0.3) continue;
        const outline = d > c - 1.1;
        const band = Math.abs(j - c) < 0.9;
        const button = d < 2.4;
        const buttonRing = d < 3.4 && !button;
        let fill = j < c ? p.accent : '#D8EC9A';
        if (outline || band || buttonRing) fill = p.ink;
        if (button) fill = '#F4FCE8';
        g.fillStyle = fill;
        g.fillRect(x0 + i * size, y0 + j * size, size - 3, size - 3);
      }
    }
  },
  peaks(g, W, H, p) {
    // les sommets restent au-dessus du titre (qui peut tenir sur deux lignes)
    const base = H * 0.5;
    const peaks = [
      [W * 0.06, W * 0.34, W * 0.6, H * 0.26],
      [W * 0.36, W * 0.66, W * 0.96, H * 0.15],
      [W * 0.6, W * 0.82, W * 1.04, H * 0.32],
    ];
    for (const [left, top, right, y] of peaks) {
      g.fillStyle = p.ink;
      g.beginPath();
      g.moveTo(left, base);
      g.lineTo(top, y);
      g.lineTo(right, base);
      g.closePath();
      g.fill();
      // neige au sommet
      const k = 0.24;
      g.fillStyle = p.accent;
      g.beginPath();
      g.moveTo(top + (left - top) * k, y + (base - y) * k);
      g.lineTo(top, y);
      g.lineTo(top + (right - top) * k, y + (base - y) * k);
      g.lineTo(top + (right - top) * k * 0.4, y + (base - y) * k * 0.75);
      g.lineTo(top, y + (base - y) * k * 0.95);
      g.lineTo(top + (left - top) * k * 0.5, y + (base - y) * k * 0.7);
      g.closePath();
      g.fill();
    }
    g.fillStyle = p.accent;
    g.beginPath();
    g.arc(W * 0.2, H * 0.17, 46, 0, Math.PI * 2);
    g.fill();
  },
  spiral(g, W, H, p) {
    const cx = W * 0.52, cy = H * 0.37;
    g.strokeStyle = p.accent;
    g.lineWidth = 14;
    g.lineCap = 'round';
    g.beginPath();
    for (let a = 0; a < Math.PI * 9; a += 0.04) {
      const r = 8 + a * 12.5;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      a === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
    g.stroke();
    g.fillStyle = p.ink;
    g.beginPath();
    g.arc(cx, cy, 22, 0, Math.PI * 2);
    g.fill();
  },
  letter(g, W, H, p) {
    g.fillStyle = p.accent;
    g.font = 'italic 400 1150px "Instrument Serif"';
    g.textBaseline = 'alphabetic';
    g.fillText(p.title[0], W * 0.1, H * 0.76);
  },
};

// grain dessiné une seule fois sur une petite tuile, puis répété sur chaque affiche
let grainTile = null;
function addGrain(g, W, H) {
  if (!grainTile) {
    const size = 256;
    grainTile = document.createElement('canvas');
    grainTile.width = grainTile.height = size;
    const t = grainTile.getContext('2d');
    for (let i = 0; i < 560; i++) {
      t.fillStyle = i % 2 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)';
      t.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }
  }
  g.fillStyle = g.createPattern(grainTile, 'repeat');
  g.fillRect(0, 0, W, H);
}

function drawTitle(g, W, H, p) {
  const lines = p.title.split(' ');
  g.font = '800 200px "Inter Tight"';
  g.letterSpacing = '-10px';
  const widest = Math.max(...lines.map((l) => g.measureText(l).width));
  const size = Math.min(250, (200 * (W - 128)) / widest);
  g.font = `800 ${size}px "Inter Tight"`;
  g.letterSpacing = `${-size * 0.05}px`;
  g.textBaseline = 'alphabetic';
  const lineHeight = size * 0.86;
  lines.forEach((line, i) => {
    g.fillText(line, 58, H - 150 - (lines.length - 1 - i) * lineHeight);
  });
  g.letterSpacing = '0px';
}

// cache : chaque affiche n'est dessinée qu'une fois (préparée à l'avance par main.js)
const canvases = new Map();
export function getCardCanvas(item, index, key) {
  if (!canvases.has(key)) canvases.set(key, createCardCanvas(item, index));
  return canvases.get(key);
}

// pleine résolution seulement sur les grands écrans haute définition :
// ailleurs, des textures 25 % plus petites suffisent et se chargent bien plus vite
const TEX_SCALE = window.devicePixelRatio > 1.5 && window.innerWidth > 1100 ? 1 : 0.75;

export function createCardCanvas(project, index) {
  const { w: W, h: H } = CARD_PX;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W * TEX_SCALE);
  canvas.height = Math.round(H * TEX_SCALE);
  const g = canvas.getContext('2d');
  // on dessine toujours dans le repère 1024 × 1365, réduit à l'échelle voulue
  g.scale(TEX_SCALE, TEX_SCALE);

  g.fillStyle = project.color;
  g.fillRect(0, 0, W, H);
  g.save();
  motifs[project.motif](g, W, H, project);
  g.restore();
  addGrain(g, W, H);

  g.fillStyle = project.ink;
  g.font = '500 30px "Inter"';
  g.textBaseline = 'top';
  g.fillText(`N°${String(index + 1).padStart(2, '0')}`, 64, 60);
  g.textAlign = 'right';
  g.fillText(project.year, W - 64, 60);
  g.textAlign = 'left';
  g.fillRect(64, 112, W - 128, 3);

  drawTitle(g, W, H, project);

  g.font = 'italic 400 48px "Instrument Serif"';
  g.textBaseline = 'alphabetic';
  g.fillText(project.category, 64, H - 72);

  return canvas;
}
