import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";


const DEFAULT_COLORS = ["#E4CFAE", "#C9A87C"];
const WAIT = 0;
const DELAY = 1;
const CUT = 2;
const IGNITE = 3;
const GROW = 4;
const REST = 5;
const SEED = 0.04;
const CUT_TIME = 0.34;
const MAX_GLITCHES = 4;
const HIDDEN = "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))";

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));
const finite = (value, fallback) =>
  Number.isFinite(value) ? value : fallback;
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

const EASINGS = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  smooth: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  gentle: (t) => 0.5 - 0.5 * Math.cos(Math.PI * t),
  linear: (t) => t,
};

const random = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const scratchColor = new THREE.Color();

const parseColor = (value) => {
  const text = value.trim().toLowerCase();
  if (!text || text === "transparent" || text === "none" || text === "auto") return null;
  const rgba = /^rgba?\(([^)]+)\)$/.exec(text);
  if (rgba) {
    const parts = rgba[1].split(/[\s,/]+/).filter(Boolean).map((part) => Number.parseFloat(part));
    const alpha = parts.length > 3 && Number.isFinite(parts[3]) ? clamp(parts[3], 0, 1) : 1;
    return [[(parts[0] ?? 0) / 255, (parts[1] ?? 0) / 255, (parts[2] ?? 0) / 255], alpha];
  }
  try {
    scratchColor.setStyle(text, THREE.NoColorSpace);
  } catch {
    return null;
  }
  return [[scratchColor.r, scratchColor.g, scratchColor.b], 1];
};

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const toSrgb = (c) =>
  c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - 0.055;

const toLch = ([r, g, b]) => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
};

const lchToLinear = ([L, C, h]) => {
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
  const m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
  const s = Math.pow(L - 0.0894841775 * A - 1.291485548 * B, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

const fitLch = (L, C, h) => {
  const inside = (chroma) =>
    lchToLinear([L, chroma, h]).every((channel) => channel >= -0.0005 && channel <= 1.0005);
  if (inside(C)) return [L, C, h];
  let low = 0;
  let high = C;
  for (let i = 0; i < 14; i++) {
    const mid = (low + high) / 2;
    if (inside(mid)) low = mid;
    else high = mid;
  }
  return [L, low, h];
};

const lchToSrgb = (lch) =>
  lchToLinear(lch).map((channel) => clamp(toSrgb(clamp(channel, 0, 1)), 0, 1));

const toHex = (rgb) =>
  `#${rgb.map((channel) => Math.round(clamp(channel, 0, 1) * 255).toString(16).padStart(2, "0")).join("")}`;

const hsl = (hue, saturation, lightness) => {
  const h = (((hue % 360) + 360) % 360) / 360;
  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const channel = (offset) => {
    let t = h + offset;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [channel(1 / 3), channel(0), channel(-1 / 3)];
};

const hueColors = (hue) => {
  const light = hsl(finite(hue, 200) + 15, 0.75, 0.65);
  return [toHex(light.map((channel) => channel * 1.7)), toHex(light)];
};

const legacyDirection = (value) => {
  if (value === "vertical") return "right";
  if (value === "up" || value === "left" || value === "right") return value;
  return "down";
};

const legacyInset = (offset, direction) => {
  const position = clamp(finite(offset, 1), 0, 1);
  return direction === "down" || direction === "left" ? 1 - position : position;
};

const subscribeToMotion = (notify) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

const readMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const vertexShader = `
in vec3 position;
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform vec2 uRes;
uniform float uAxis;
uniform float uFlip;
uniform vec2 uSegment;
uniform vec2 uSpan;
uniform float uInset;
uniform float uMirror;
uniform float uSpread;
uniform float uTaper;
uniform float uLight;
uniform float uRadius;
uniform float uHalo;
uniform float uBloom;
uniform float uGlow;
uniform float uPower;
uniform float uGlass;
uniform float uTime;
uniform float uHum;
uniform float uScale;
uniform vec3 uTubeColor;
uniform vec3 uTubeLch;
uniform vec3 uMidLch;
uniform vec3 uDeepLch;
uniform float uInk;
uniform vec3 uInkTube;
uniform vec3 uInkCore;
uniform vec3 uPastelTube;
uniform vec3 uPastelMid;
uniform vec3 uPastelDeep;
uniform vec3 uBg;
uniform float uBgAlpha;
out vec4 fragColor;

const float PI = 3.14159265359;

vec3 lchToLinear(vec3 lch) {
  vec3 lab = vec3(lch.x, lch.y * cos(lch.z), lch.y * sin(lch.z));
  vec3 lms = mat3(1.0, 1.0, 1.0, 0.3963377774, -0.1055613458, -0.0894841775, 0.2158037573, -0.0638541728, -1.291485548) * lab;
  lms = lms * lms * lms;
  return clamp(mat3(4.0767416621, -1.2684380046, -0.0041960863, -3.3077115913, 2.6097574011, -0.7034186147, 0.2309699292, -0.3413193965, 1.707614701) * lms, 0.0, 1.0);
}

vec3 lchMix(vec3 a, vec3 b, float t) {
  float turn = mod(b.z - a.z + PI, 2.0 * PI) - PI;
  return vec3(mix(a.x, b.x, t), mix(a.y, b.y, t), a.z + turn * t);
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

float hash(float n) {
  return fract(sin(n * 127.1) * 43758.5453);
}

float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  float w = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix((hash(i) * 2.0 - 1.0) * f, (hash(i + 1.0) * 2.0 - 1.0) * (f - 1.0), w) * 2.0;
}

float pour(float along, float depth) {
  if (depth <= 0.0 || uSegment.y <= uSegment.x) return 0.0;
  float from = atan(uSegment.x - along, depth);
  float to = atan(uSegment.y - along, depth);
  float stride = (to - from) / 16.0;
  float centre = 0.5 * (uSpan.x + uSpan.y);
  float extent = max(0.5 * (uSpan.y - uSpan.x), 0.0001);
  float sum = 0.0;
  for (int i = 0; i < 16; i++) {
    float angle = from + (float(i) + 0.5) * stride;
    float r = clamp(abs(along + depth * tan(angle) - centre) / extent, 0.0, 1.0);
    sum += (1.0 - uTaper * r * r) * exp(-uSpread * depth / cos(angle));
  }
  return sum * stride / (2.0 * PI);
}

vec4 tube(float along, float depth, vec2 size) {
  float dv = (depth - uInset) * size.y;
  float du = max(max(uSegment.x - along, along - uSegment.y), 0.0) * size.x;
  float d = length(vec2(du, dv));
  float lit = smoothstep(0.0, 1.0, (uSegment.y - uSegment.x) * size.x / max(uRadius, 1.0));
  float body = exp(-d * d / (uRadius * uRadius)) * lit;
  float halo = exp(-d / uHalo) * (1.0 - smoothstep(5.0 * uHalo, 7.0 * uHalo, d)) * lit;
  float bloom = exp(-d / uBloom) * (1.0 - smoothstep(5.0 * uBloom, 7.0 * uBloom, d)) * lit;
  float gu = max(max(uSpan.x - along, along - uSpan.y), 0.0) * size.x;
  float g = length(vec2(gu, dv)) / max(uRadius, 0.75);
  return vec4(body, halo, bloom, exp(-g * g));
}

float dither(vec2 p) {
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))) - 0.5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float along = mix(uv.x, uv.y, uAxis);
  float depth = mix(uv.y, uv.x, uAxis);
  depth = mix(depth, 1.0 - depth, uFlip);
  vec2 size = mix(uRes, uRes.yx, uAxis);
  float below = depth - uInset;
  float light = pour(along, below) * smoothstep(0.0, uHalo, below * size.y);
  vec4 glass = tube(along, depth, size);
  if (uMirror > 0.5) {
    float back = 1.0 - depth - uInset;
    light += pour(along, back) * smoothstep(0.0, uHalo, back * size.y);
    glass += tube(along, 1.0 - depth, size);
  }
  float shimmer = 1.0 + uHum * 0.05 * noise(along * size.x / (140.0 * uScale) + uTime * 0.23);
  float power = uPower * shimmer;
  float k = light * uLight;
  float a = 1.2 * k;
  float q = k * (a + 1.0 - sqrt((a - 1.0) * (a - 1.0) + 0.01)) * 0.5;
  float grain = dither(gl_FragCoord.xy) / 255.0;

  if (uInk < 0.5) {
    vec3 lch = lchMix(uDeepLch, uMidLch, smoothstep(0.1, 0.95, q));
    lch = lchMix(lch, uTubeLch, smoothstep(0.9, 1.8, q));
    float raw = 0.576 * pow(max(q, 0.000001), 0.625);
    float L = raw < 0.8 ? raw : 0.8 + 0.17 * (1.0 - exp(-(raw - 0.8) / 0.17));
    float C = lch.y * smoothstep(-0.05, 0.36, L) * clamp((1.0 - L) / 0.12, 0.0, 1.0);
    vec3 dome = encode(lchToLinear(vec3(L, C, lch.z)));
    vec3 emission = (uTubeColor * (glass.x * 9.0 + glass.y * 1.3 * uGlow + glass.z * 0.1 * uGlow) + glass.x * glass.x * 2.2) * power;
    emission += mix(uTubeColor, vec3(1.0), 0.6) * glass.w * uGlass;
    vec3 rim = encode(1.0 - exp(-emission));
    vec3 color = 1.0 - (1.0 - dome) * (1.0 - rim);
    if (uBgAlpha > 0.5) {
      fragColor = vec4(clamp(1.0 - (1.0 - uBg) * (1.0 - color) + grain, 0.0, 1.0), 1.0);
    } else {
      float alpha = max(color.r, max(color.g, color.b));
      fragColor = vec4(color / max(alpha, 0.0001), clamp(alpha + grain, 0.0, 1.0));
    }
    return;
  }

  vec3 plch = lchMix(uPastelDeep, uPastelMid, smoothstep(0.15, 0.9, q));
  plch = lchMix(plch, uPastelTube, smoothstep(0.85, 1.8, q));
  vec3 pastel = encode(lchToLinear(plch));
  float amount = q + (glass.y * 0.3 + glass.z * 0.25) * uGlow * power;
  float washCover = pow(1.0 - exp(-amount * 1.5), 1.35) * 0.94;
  float glassCover = glass.w * uGlass * 7.0;
  float tubeCover = 1.0 - exp(-(glass.x * 6.0 + glass.y * glass.y * 0.9 * uGlow) * power);
  float coreCover = (1.0 - exp(-glass.x * 2.0 * power)) * 0.5;
  vec3 ink = pastel * washCover;
  float alpha = washCover;
  ink = encode(lchToLinear(uPastelTube)) * glassCover + ink * (1.0 - glassCover);
  alpha = glassCover + alpha * (1.0 - glassCover);
  ink = uInkTube * tubeCover + ink * (1.0 - tubeCover);
  alpha = tubeCover + alpha * (1.0 - tubeCover);
  ink = uInkCore * coreCover + ink * (1.0 - coreCover);
  alpha = coreCover + alpha * (1.0 - coreCover);
  if (uBgAlpha > 0.5) {
    fragColor = vec4(clamp(uBg * (1.0 - alpha) + ink + grain, 0.0, 1.0), 1.0);
  } else {
    fragColor = vec4(ink / max(alpha, 0.0001), clamp(alpha + grain, 0.0, 1.0));
  }
}
`;

function createNeonReveal(root, stage, contentRef, settingsRef) {
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  stage.appendChild(canvas);

  const settings = () => settingsRef.current;
  const uniforms = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uAxis: { value: 0 },
    uFlip: { value: 1 },
    uSegment: { value: new THREE.Vector2(0.5, 0.5) },
    uSpan: { value: new THREE.Vector2(0, 1) },
    uInset: { value: 0 },
    uMirror: { value: 0 },
    uSpread: { value: 1.5 },
    uTaper: { value: 0.5 },
    uLight: { value: 0 },
    uRadius: { value: 2 },
    uHalo: { value: 8 },
    uBloom: { value: 30 },
    uGlow: { value: 1 },
    uPower: { value: 0 },
    uGlass: { value: 0.05 },
    uTime: { value: 0 },
    uHum: { value: 1 },
    uScale: { value: 1 },
    uTubeColor: { value: new THREE.Vector3(1, 1, 1) },
    uTubeLch: { value: new THREE.Vector3() },
    uMidLch: { value: new THREE.Vector3() },
    uDeepLch: { value: new THREE.Vector3() },
    uInk: { value: 0 },
    uInkTube: { value: new THREE.Vector3() },
    uInkCore: { value: new THREE.Vector3() },
    uPastelTube: { value: new THREE.Vector3() },
    uPastelMid: { value: new THREE.Vector3() },
    uPastelDeep: { value: new THREE.Vector3() },
    uBg: { value: new THREE.Vector3() },
    uBgAlpha: { value: 0 },
  };
  const material = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: false,
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  const scene = new THREE.Scene();
  scene.add(mesh);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  let width = 0;
  let height = 0;
  let ratio = 1;
  let sized = false;
  let colorKey = "";
  let backgroundAt = -10;
  let raf = 0;
  let last = 0;
  let visible = false;
  let seen = false;
  let destroyed = false;
  let lost = false;
  let clock = 0;
  let phase = WAIT;
  let phaseTime = 0;
  let litTime = 0;
  let seed = 7;
  let ignition = { flicks: [], on: 0, attack: 0.3, growAt: 0.4 };
  let tubePower = 0;
  let lightPower = 0;
  let contentAlpha = 0;
  let fraction = SEED;
  let cutPower = 0;
  let cutLight = 0;
  let cutAlpha = 0;
  let cutFraction = 1;
  let maskValue = "";
  let press = null;
  const glitches = [];

  const sideways = () => {
    const direction = settings().direction;
    return direction === "left" || direction === "right";
  };

  const segment = (amount, whole = false) => {
    const s = settings();
    const total = whole ? 1 : clamp(finite(s.length, 0.9), 0.05, 1);
    const lit = total * clamp(amount, 0, 1);
    if (s.origin < 0) return [0, lit];
    if (s.origin > 0) return [1 - lit, 1];
    return [0.5 - lit / 2, 0.5 + lit / 2];
  };

  const buildIgnition = () => {
    const s = settings();
    const flicker = clamp(finite(s.flicker, 1), 0, 2);
    const next = random(seed);
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const count = Math.round(flicker * 2.2);
    const flicks = [];
    let time = 0.06;
    for (let i = 0; i < count; i++) {
      const length = 0.03 + next() * 0.05;
      const amplitude = Math.min(0.32 + 0.5 * ((i + 1) / (count + 1)) + next() * 0.14, 0.92);
      flicks.push([time, length, amplitude]);
      time += length + 0.05 + next() * 0.1;
    }
    const attack = 0.06 + 0.3 * (1 - Math.min(flicker, 1));
    return { flicks, on: time, attack, growAt: time + attack + 0.06 };
  };

  const ignitionPower = (time) => {
    let value = 0;
    for (const [start, length, amplitude] of ignition.flicks) {
      if (time < start) continue;
      const rise = smoothstep(start, start + 0.014, time);
      const fall = time > start + length ? Math.exp(-(time - start - length) / 0.028) : 1;
      value = Math.max(value, amplitude * rise * fall);
    }
    if (time >= ignition.on) {
      const lit = time - ignition.on;
      value = Math.max(value, smoothstep(0, ignition.attack, lit) * (0.86 + 0.14 * (1 - Math.exp(-lit / 0.35))));
    }
    return value;
  };

  const addGlitch = () => {
    const next = random(seed);
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const dips = [];
    let time = 0;
    for (let i = 0; i < 3; i++) {
      dips.push([time, 0.016 + next() * 0.02, (0.92 - i * 0.24) * (0.75 + 0.25 * next())]);
      time += 0.045 + next() * 0.07;
    }
    if (glitches.length >= MAX_GLITCHES) glitches.shift();
    glitches.push({ born: clock, dips });
  };

  const glitchFactor = () => {
    const depth = 0.4 + 0.3 * clamp(finite(settings().flicker, 1), 0, 2);
    let factor = 1;
    for (let i = glitches.length - 1; i >= 0; i--) {
      const age = clock - glitches[i].born;
      if (age > 0.6) {
        glitches.splice(i, 1);
        continue;
      }
      let dip = 0;
      for (const [at, width, amount] of glitches[i].dips) {
        const x = (age - at) / width;
        dip = Math.max(dip, amount * Math.exp(-x * x));
      }
      factor *= 1 - Math.min(dip * depth, 0.95);
    }
    return factor;
  };

  const humFactor = () => {
    const hum = clamp(finite(settings().hum, 1), 0, 2);
    return 1 + hum * (0.025 * Math.sin((clock * Math.PI * 2) / 4.3) + 0.015 * Math.sin((clock * Math.PI * 2) / 1.9 + 1.7));
  };

  const readPage = () => {
    let node = root.parentElement;
    while (node) {
      const match = view.getComputedStyle(node).backgroundColor.match(/rgba?\(([^)]+)\)/);
      if (match) {
        const parts = match[1].split(/[\s,/]+/).filter(Boolean).map((part) => Number.parseFloat(part));
        if (parts.length < 4 || parts[3] > 0.05) return [parts[0] / 255, parts[1] / 255, parts[2] / 255];
      }
      node = node.parentElement;
    }
    return view.matchMedia("(prefers-color-scheme: dark)").matches ? [0.04, 0.04, 0.04] : [1, 1, 1];
  };

  const syncColors = () => {
    const s = settings();
    const explicit = parseColor(s.backgroundColor);
    const page = explicit ? explicit[0] : readPage();
    const opaque = !!explicit && explicit[1] > 0.995;
    const key = [s.colors[0], s.colors[1], page.join(","), opaque].join("|");
    if (key === colorKey) return;
    colorKey = key;
    const ink = 0.2126 * page[0] + 0.7152 * page[1] + 0.0722 * page[2] > 0.55;
    const tube = toLch(parseColor(s.colors[0])?.[0] ?? [1, 0.62, 0.99]);
    const glow = toLch(parseColor(s.colors[1])?.[0] ?? [0.69, 0.39, 0.91]);
    if (tube[1] < 0.02 && glow[1] >= 0.02) tube[2] = glow[2];
    if (glow[1] < 0.02 && tube[1] >= 0.02) glow[2] = tube[2];
    const vivid = fitLch(0.72, tube[1] < 0.02 ? 0 : Math.max(tube[1] * 1.45, 0.16), tube[2]);
    const vividRgb = lchToLinear(vivid).map((channel) => Math.max(channel, 0));
    const peak = Math.max(vividRgb[0], vividRgb[1], vividRgb[2], 0.0001);
    uniforms.uTubeColor.value.set(vividRgb[0] / peak, vividRgb[1] / peak, vividRgb[2] / peak);
    const deep = glow[2] - 0.36;
    const tubeStop = fitLch(0.8, tube[1], tube[2]);
    const midStop = fitLch(0.56, glow[1] < 0.02 ? 0 : Math.max(glow[1], 0.12), glow[2]);
    const deepStop = fitLch(0.3, glow[1] < 0.02 ? 0 : Math.max(glow[1], 0.12) * 0.9, deep);
    uniforms.uTubeLch.value.set(tubeStop[0], tubeStop[1], tubeStop[2]);
    uniforms.uMidLch.value.set(midStop[0], midStop[1], midStop[2]);
    uniforms.uDeepLch.value.set(deepStop[0], deepStop[1], deepStop[2]);
    const inkTube = lchToSrgb(fitLch(0.5, Math.max(tube[1] * 1.5, 0.16), tube[2]));
    const inkCore = lchToSrgb(fitLch(0.84, Math.min(Math.max(tube[1], 0.06), 0.12), tube[2]));
    const pastelTube = fitLch(0.78, Math.max(tube[1], 0.14), tube[2]);
    const pastelMid = fitLch(0.74, Math.max(glow[1], 0.14), glow[2]);
    const pastelDeep = fitLch(0.86, Math.max(Math.min(glow[1], 0.1), 0.07), deep);
    uniforms.uInk.value = ink ? 1 : 0;
    uniforms.uInkTube.value.set(inkTube[0], inkTube[1], inkTube[2]);
    uniforms.uInkCore.value.set(inkCore[0], inkCore[1], inkCore[2]);
    uniforms.uPastelTube.value.set(pastelTube[0], pastelTube[1], pastelTube[2]);
    uniforms.uPastelMid.value.set(pastelMid[0], pastelMid[1], pastelMid[2]);
    uniforms.uPastelDeep.value.set(pastelDeep[0], pastelDeep[1], pastelDeep[2]);
    uniforms.uBg.value.set(page[0], page[1], page[2]);
    uniforms.uBgAlpha.value = opaque ? 1 : 0;
  };

  const readSize = () => {
    const s = settings();
    const nextWidth = Math.round(root.clientWidth);
    const nextHeight = Math.round(root.clientHeight);
    if (nextWidth < 2 || nextHeight < 2) {
      sized = false;
      return false;
    }
    const nextRatio = Math.min(view.devicePixelRatio || 1, clamp(finite(s.dpr, 2), 0.5, 3));
    if (sized && nextWidth === width && nextHeight === height && nextRatio === ratio) return false;
    sized = true;
    width = nextWidth;
    height = nextHeight;
    ratio = nextRatio;
    renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    return true;
  };

  const placeSegment = () => {
    if (phase === GROW) {
      const duration = Math.max(settings().duration, 0.05);
      const ease = EASINGS[settings().easing] ?? EASINGS.out;
      fraction = SEED + (1 - SEED) * ease(clamp(phaseTime / duration, 0, 1));
    } else if (phase === REST) {
      fraction = 1;
    } else if (phase === CUT) {
      fraction = cutFraction;
    } else {
      fraction = SEED;
    }
  };

  const writeMask = () => {
    const content = contentRef.current;
    if (!content) return;
    const s = settings();
    let value = "none";
    if (phase !== REST || contentAlpha < 0.999) {
      if (contentAlpha <= 0.001) {
        value = HIDDEN;
      } else {
        const extent = sideways() ? height : width;
        const [from, to] = segment(fraction, true);
        const feather = clamp(finite(s.feather, 0.15), 0.01, 0.6) * extent;
        const direction = sideways() ? "to top" : "to right";
        const solid = `rgba(0,0,0,${contentAlpha.toFixed(3)})`;
        const clear = "rgba(0,0,0,0)";
        const a = from * extent;
        const b = to * extent;
        value = `linear-gradient(${direction}, ${clear} ${(a - feather).toFixed(1)}px, ${solid} ${a.toFixed(1)}px, ${solid} ${b.toFixed(1)}px, ${clear} ${(b + feather).toFixed(1)}px)`;
      }
    }
    if (value === maskValue) return;
    maskValue = value;
    content.style.setProperty("-webkit-mask-image", value);
    content.style.setProperty("mask-image", value);
  };

  const render = () => {
    if (!sized) return;
    const s = settings();
    if (performance.now() - backgroundAt > 1000) {
      backgroundAt = performance.now();
      syncColors();
    }
    const thickness = clamp(finite(s.thickness, 3), 0.5, 24);
    const glow = clamp(finite(s.glow, 1), 0, 3);
    const u = uniforms;
    const direction = s.direction;
    u.uRes.value.set(width * ratio, height * ratio);
    u.uAxis.value = sideways() ? 1 : 0;
    u.uFlip.value = direction === "down" || direction === "left" ? 1 : 0;
    const [from, to] = segment(fraction);
    const [first, final] = segment(1);
    const depthPx = sideways() ? width : height;
    u.uSegment.value.set(from, to);
    u.uSpan.value.set(first, final);
    u.uInset.value =
      s.offset >= 0 ? clamp(s.offset, 0, 0.45) : clamp(Math.max(finite(s.inset, 24), 0) / Math.max(depthPx, 1), 0, 0.45);
    u.uMirror.value = s.mirrored ? 1 : 0;
    u.uSpread.value = 1.5 / clamp(finite(s.reach, 1), 0.1, 4);
    u.uTaper.value = 0.5;
    u.uLight.value = 4.05 * clamp(finite(s.spill, 1), 0, 3) * clamp(finite(s.intensity, 1), 0, 4) * lightPower;
    u.uRadius.value = Math.max(thickness * 0.5 * ratio, 0.75);
    u.uHalo.value = (1.5 + thickness * 1.2) * (0.6 + 0.4 * glow) * ratio;
    u.uBloom.value = (12 + 16 * glow) * ratio;
    u.uGlow.value = glow;
    u.uPower.value = tubePower * clamp(finite(s.intensity, 1), 0, 4);
    u.uGlass.value = 0.05 * clamp(finite(s.intensity, 1), 0, 4);
    u.uTime.value = clock;
    u.uHum.value = s.reduced ? 0 : clamp(finite(s.hum, 1), 0, 2);
    u.uScale.value = ratio;
    renderer.render(scene, camera);
  };

  const enter = (next) => {
    phase = next;
    phaseTime = 0;
    if (next === IGNITE) {
      ignition = buildIgnition();
      litTime = 0;
      settings().onStart?.();
    } else if (next === REST) {
      settings().onComplete?.();
    }
  };

  const advance = (dt) => {
    const s = settings();
    phaseTime += dt;
    if (phase >= IGNITE) litTime += dt;
    if (phase === WAIT) {
      if (s.trigger === "mount" || (s.trigger === "inView" && seen)) {
        if (s.delay > 0) enter(DELAY);
        else enter(IGNITE);
      }
    } else if (phase === DELAY) {
      if (phaseTime >= s.delay) enter(IGNITE);
    } else if (phase === CUT) {
      if (phaseTime >= CUT_TIME) enter(IGNITE);
    } else if (phase === IGNITE) {
      if (phaseTime >= ignition.growAt) enter(GROW);
    } else if (phase === GROW) {
      if (phaseTime >= Math.max(s.duration, 0.05)) enter(REST);
    }
  };

  const shade = (dt, still) => {
    let tube = 0;
    let light = 0;
    if (phase === CUT) {
      tube = cutPower * Math.exp(-phaseTime / 0.07);
      light = cutLight * Math.exp(-phaseTime / 0.09);
    } else if (phase >= IGNITE) {
      tube = ignitionPower(litTime) * humFactor() * glitchFactor();
      light = tube;
    }
    tubePower = tube;
    if (phase === CUT || still) lightPower = light;
    else lightPower += (light - lightPower) * (1 - Math.exp(-dt / 0.035));
    if (phase === CUT) {
      contentAlpha = cutAlpha * (1 - smoothstep(0, CUT_TIME * 0.85, phaseTime));
    } else if (phase >= IGNITE) {
      contentAlpha = phase === REST ? 1 : smoothstep(ignition.on - 0.1, ignition.on + ignition.attack + 0.2, litTime);
    } else {
      contentAlpha = 0;
    }
  };

  const settle = () => {
    phase = REST;
    phaseTime = 0;
    litTime = 30;
    glitches.length = 0;
    tubePower = humFactor();
    lightPower = tubePower;
    contentAlpha = 1;
  };

  const schedule = () => {
    if (destroyed || lost || !visible || raf) return;
    raf = requestAnimationFrame(frame);
  };

  const frame = (now) => {
    raf = 0;
    if (destroyed || lost) return;
    const s = settings();
    const dt = last && now - last < 100 ? clamp((now - last) / 1000, 0, 0.05) : 1 / 60;
    last = now;
    const still = s.reduced || s.paused;
    if ((s.reduced || (s.paused && phase <= DELAY)) && phase !== REST) settle();
    if (!still) {
      clock += dt;
      advance(dt);
    }
    shade(dt, still);
    placeSegment();
    render();
    writeMask();
    const busy =
      phase !== REST ||
      glitches.length > 0 ||
      Math.abs(lightPower - tubePower) > 0.002 ||
      contentAlpha < 0.999 ||
      clamp(finite(s.hum, 1), 0, 2) > 0;
    const waiting = phase === WAIT && s.trigger !== "mount";
    if (!still && busy && !waiting && !doc.hidden) raf = requestAnimationFrame(frame);
    else last = 0;
  };

  const replay = () => {
    const s = settings();
    if (s.reduced || phase === CUT) return;
    if (phase === WAIT || phase === DELAY) {
      enter(IGNITE);
    } else {
      cutPower = tubePower;
      cutLight = lightPower;
      cutAlpha = contentAlpha;
      cutFraction = fraction;
      glitches.length = 0;
      enter(CUT);
    }
    last = 0;
    schedule();
  };

  const isControl = (target) => {
    const element = target;
    return (
      !!element &&
      typeof element.closest === "function" &&
      !!element.closest("a,button,input,textarea,select,label,summary,[role=button],[contenteditable=true]")
    );
  };

  const onPointerDown = (event) => {
    if (!event.isPrimary || isControl(event.target)) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    press = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
  };

  const onPointerUp = (event) => {
    const current = press;
    press = null;
    if (!current || current.id !== event.pointerId) return;
    if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 10) return;
    if (performance.now() - current.time > 600) return;
    const s = settings();
    if (!s.interactive || s.reduced || s.paused) return;
    if (phase === IGNITE || phase === GROW) {
      addGlitch();
      schedule();
      return;
    }
    replay();
  };

  const onPointerCancel = () => {
    press = null;
  };

  const onVisibility = () => {
    last = 0;
    schedule();
  };

  const onLost = (event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const onRestored = () => {
    lost = false;
    colorKey = "";
    schedule();
  };

  const resizeObserver = new ResizeObserver(() => {
    if (readSize()) {
      placeSegment();
      render();
      writeMask();
      schedule();
    }
  });

  const intersection = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      last = 0;
      schedule();
    },
    { rootMargin: "120px" },
  );

  const threshold = clamp(finite(settings().threshold, 0.3), 0, 1);
  const trigger = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < threshold - 0.001) return;
      seen = true;
      trigger.disconnect();
      last = 0;
      schedule();
    },
    { threshold: [0, threshold] },
  );

  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("pointerup", onPointerUp);
  root.addEventListener("pointercancel", onPointerCancel);
  doc.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);
  resizeObserver.observe(root);
  intersection.observe(root);
  trigger.observe(root);
  if (!settings().intro || settings().reduced) settle();
  readSize();
  syncColors();
  writeMask();

  return {
    sync: () => {
      backgroundAt = -10;
      readSize();
      last = 0;
      if (!raf && visible) {
        const s = settings();
        if ((s.reduced || (s.paused && phase <= DELAY)) && phase !== REST) settle();
        shade(0, true);
        placeSegment();
        render();
        writeMask();
        schedule();
      }
    },
    replay,
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      trigger.disconnect();
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerCancel);
      doc.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

export const NeonReveal = forwardRef(function NeonReveal(
  {
    colors,
    backgroundColor = "transparent",
    direction = "down",
    expandFrom = "center",
    trigger,
    revealDelay = 0,
    revealDuration = 2500,
    easing = "out",
    thickness,
    glow = 1,
    spill = 1,
    reach,
    intensity = 1,
    feather = 0.15,
    inset,
    length,
    mirrored = false,
    hum = 1,
    flicker = 1,
    interactive = true,
    intro = true,
    paused = false,
    dpr = 2,
    scrollThreshold = 0.3,
    onStart,
    onComplete,
    className,
    style,
    children,
    verticalOffset,
    color,
    barWidth,
    barHeight,
    animateOnScroll = false,
    glowSpread,
  },
  ref,
) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const contentRef = useRef(null);
  const controllerRef = useRef(null);
  const reduced = useSyncExternalStore(subscribeToMotion, readMotion, () => false);
  const resolvedDirection = legacyDirection(direction);
  const [initialMask] = useState(() =>
    intro && !paused ? { WebkitMaskImage: HIDDEN, maskImage: HIDDEN } : {},
  );

  const settings = {
    colors: colors ?? (color !== undefined ? hueColors(color) : DEFAULT_COLORS),
    backgroundColor,
    direction: resolvedDirection,
    origin: expandFrom === "left" ? -1 : expandFrom === "right" ? 1 : 0,
    trigger: trigger ?? (animateOnScroll ? "inView" : "mount"),
    delay: Math.max(finite(revealDelay, 0), 0) / 1000,
    duration: Math.max(finite(revealDuration, 2500), 50) / 1000,
    easing,
    thickness: thickness ?? (barHeight !== undefined ? clamp(finite(barHeight, 0.02) * 150, 1, 12) : 3),
    glow,
    spill,
    reach: reach ?? (glowSpread !== undefined ? 0.5 / Math.max(finite(glowSpread, 0.5), 0.05) : 1),
    intensity,
    feather,
    inset: inset ?? 24,
    offset: inset === undefined && verticalOffset !== undefined ? legacyInset(verticalOffset, resolvedDirection) : -1,
    length: length ?? barWidth ?? 0.9,
    mirrored,
    hum,
    flicker,
    interactive,
    intro,
    paused,
    dpr,
    threshold: scrollThreshold,
    reduced,
    onStart,
    onComplete,
  };
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
    controllerRef.current?.sync();
  });

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const controller = createNeonReveal(root, stage, contentRef, settingsRef);
    controllerRef.current = controller;
    if (!controller && contentRef.current) {
      contentRef.current.style.setProperty("-webkit-mask-image", "none");
      contentRef.current.style.setProperty("mask-image", "none");
    }
    return () => {
      controller?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      replay: () => controllerRef.current?.replay(),
    }),
    [],
  );

  const backgroundValue = backgroundColor.trim().toLowerCase();
  const transparent = !backgroundValue || backgroundValue === "transparent" || backgroundValue === "auto";

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate h-full w-full overflow-hidden", className)}
      style={{ backgroundColor: transparent ? undefined : backgroundColor, ...style }}
    >
      <div ref={stageRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      {children ? (
        <div
          ref={contentRef}
          className="absolute inset-0 z-[1] flex items-center justify-center"
          style={initialMask}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
});

NeonReveal.displayName = "NeonReveal";

export default NeonReveal;
