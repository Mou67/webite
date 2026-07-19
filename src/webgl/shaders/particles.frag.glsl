uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vAlpha;
varying float vMix;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float mask = smoothstep(0.5, 0.12, d);
  if (mask < 0.01) discard;

  vec3 color = mix(uColorA, uColorB, vMix);
  gl_FragColor = vec4(color, mask * vAlpha);
}
