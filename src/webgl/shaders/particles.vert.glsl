attribute vec3 aPositionB;
attribute float aRandom;

uniform float uTime;
uniform float uMorph;
uniform float uScatter;
uniform vec3 uPointer;
uniform float uPointerStrength;
uniform float uSize;
uniform float uPixelRatio;
uniform float uGlobalAlpha;

varying float vAlpha;
varying float vMix;

//
// Simplex 3D noise — Ashima Arts / Stefan Gustavson (MIT)
//
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 1.0 / 7.0;
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
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  // Morph between the two target shapes
  vec3 pos = mix(position, aPositionB, uMorph);

  // Slow "breathing" drift
  float n = snoise(pos * 0.9 + uTime * 0.12);
  pos += normalize(pos) * n * 0.3;

  // Pointer repulsion with smooth falloff
  vec3 toPointer = pos - uPointer;
  float dist = length(toPointer);
  float force = smoothstep(1.6, 0.0, dist) * uPointerStrength;
  pos += normalize(toPointer + vec3(0.0001)) * force * 0.7;

  // Scatter outward as the hero scrolls away
  pos += normalize(pos) * (1.0 + aRandom * 2.5) * uScatter * 5.0;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  gl_PointSize = uSize * uPixelRatio * (0.5 + aRandom) * (6.0 / -mvPosition.z);

  vAlpha = (1.0 - uScatter) * (0.035 + 0.09 * aRandom) * uGlobalAlpha;
  vMix = smoothstep(0.25, 0.9, snoise(pos * 0.5 + 40.0) + aRandom * 0.3);
}
