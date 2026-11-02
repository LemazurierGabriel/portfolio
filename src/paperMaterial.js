import * as THREE from 'three';

// Bruit simplex 3D (Ashima Arts / Stefan Gustavson, licence MIT)
const simplex = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x * 34.0) + 10.0) * x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const vertexShader = /* glsl */ `
uniform float uCrumple;
uniform float uBend;
uniform float uSeed;
uniform vec2 uHalfSize;
varying vec2 vUv;
varying vec3 vViewPos;
${simplex}
float hash(float n){ return fract(sin(n) * 43758.5453123); }

void main() {
  vUv = uv;
  vec3 p = position;

  // 0 au centre, 1 dans les coins : le centre se déplie en premier
  float dn = length(p.xy / uHalfSize) * 0.7071;
  float local = clamp(uCrumple * 1.6 - (1.0 - dn) * 0.6, 0.0, 1.0);
  local = local * local * (3.0 - 2.0 * local);

  // plis droits : somme de « V » le long de lignes aléatoires, comme une vraie feuille froissée
  float folds = 0.0;
  for (int k = 0; k < 12; k++) {
    float fk = float(k) * 1.618 + uSeed * 13.0;
    float a = hash(fk) * 6.2831;
    vec2 dir = vec2(cos(a), sin(a));
    float o = (hash(fk + 1.7) - 0.5) * 2.4;
    float amp = (hash(fk + 3.1) - 0.5) * 0.5;
    folds += amp * abs(dot(p.xy, dir) - o);
  }

  vec3 q = p * 1.4 + uSeed;
  float ridge = (1.0 - abs(snoise(q))) + 0.5 * (1.0 - abs(snoise(q * 2.7 + 5.0)));
  vec2 jitter = vec2(snoise(q + 11.0), snoise(q + 23.0));
  float dome = sqrt(max(0.0, 1.0 - dn * dn));

  vec3 ball = p;
  ball.xy = p.xy * 0.3 + jitter * 0.2;
  ball.z = (dome - 0.55) * 1.2 + folds * 0.35 + (ridge - 0.9) * 0.3;
  p = mix(p, ball, local);

  // la feuille plie légèrement quand on fait glisser le carrousel
  p.z -= abs(uBend) * p.x * p.x * 0.12;
  p.z += uBend * p.x * 0.06;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uMap;
uniform float uOpacity;
uniform vec3 uBack;
varying vec2 vUv;
varying vec3 vViewPos;

float grain(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  // normale par facette : donne les arêtes nettes du papier froissé
  vec3 n = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
  if (dot(n, -vViewPos) < 0.0) n = -n;
  vec3 L = normalize(vec3(-0.35, 0.55, 0.76));
  float shade = clamp(0.38 + 0.62 * max(dot(n, L), 0.0) / L.z, 0.0, 1.12);

  vec3 base = gl_FrontFacing ? texture2D(uMap, vUv).rgb : uBack;
  base *= 0.985 + 0.03 * grain(floor(vUv * 900.0));
  gl_FragColor = vec4(base * shade, uOpacity);
  #include <colorspace_fragment>
}
`;

export function createPaperMaterial(map, { seed, halfSize }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uCrumple: { value: 1 },
      uBend: { value: 0 },
      uOpacity: { value: 1 },
      uSeed: { value: seed },
      uHalfSize: { value: new THREE.Vector2(halfSize.x, halfSize.y) },
      uBack: { value: new THREE.Color('#E9E3D8') },
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
  });
}
