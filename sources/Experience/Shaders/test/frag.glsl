uniform float uAlpha;
uniform float uColor;

varying vec2 vUv;

void main()
{
    gl_FragColor = vec4(vUv, 0., 1.);
}