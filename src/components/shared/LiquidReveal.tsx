"use client";
import { useEffect, useRef } from "react";

/**
 * LiquidReveal — the signature WebGL moment.
 *
 * Renders the before/after pair on a GPU plane and reveals the "after" along an
 * organic, noise-displaced edge (instead of a straight line), with a faint
 * "wet paint" sienna sheen riding the boundary. Driven by `getProgress()`
 * (0–100, the same value the DOM slider uses), so the existing drag / keyboard /
 * auto-sweep logic feeds it for free.
 *
 * Purely additive: the canvas starts transparent and only fades in (calling
 * onReady) once both textures are loaded AND WebGL compiled. If anything fails —
 * no WebGL, shader error, slow GPU — it simply stays invisible and the DOM
 * before/after underneath shows through. Mount only on desktop / no
 * reduced-motion (the parent decides).
 */
interface Props {
  beforeSrc: string;
  afterSrc: string;
  getProgress: () => number; // 0..100
  onReady?: () => void;
  className?: string;
}

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform sampler2D uBefore;
uniform sampler2D uAfter;
uniform float uProgress;
uniform float uTime;
uniform float uPlaneAspect;
uniform float uBeforeAspect;
uniform float uAfterAspect;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0,0.0)), c = hash(i + vec2(0.0,1.0)), d = hash(i + vec2(1.0,1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
// object-fit: cover mapping for a texture of a given aspect into the plane
vec2 coverUv(vec2 uv, float planeAspect, float imgAspect){
  vec2 r = vec2(min(planeAspect / imgAspect, 1.0), min(imgAspect / planeAspect, 1.0));
  return uv * r + (1.0 - r) * 0.5;
}
void main(){
  vec2 uvB = coverUv(vUv, uPlaneAspect, uBeforeAspect);
  vec2 uvA = coverUv(vUv, uPlaneAspect, uAfterAspect);

  // Organic vertical boundary: wavy along y, slowly drifting in time.
  float wave = (noise(vec2(vUv.y * 3.0, uTime * 0.12)) - 0.5) * 0.05;
  float fine = (noise(vec2(vUv.y * 9.0, uTime * 0.20 + 5.0)) - 0.5) * 0.018;
  float edge = uProgress + wave + fine;

  float w = 0.012;
  float reveal = smoothstep(edge - w, edge + w, vUv.x);

  vec3 before = texture2D(uBefore, uvB).rgb;
  vec3 after  = texture2D(uAfter,  uvA).rgb;
  vec3 col = mix(before, after, reveal);

  // Wet sienna sheen riding the boundary.
  float band = smoothstep(0.05, 0.0, abs(vUv.x - edge));
  float shimmer = 0.5 + 0.5 * sin(uTime * 2.2 + vUv.y * 22.0);
  col += band * shimmer * vec3(0.16, 0.07, 0.03);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function LiquidReveal({ beforeSrc, afterSrc, getProgress, onReady, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getProgressRef = useRef(getProgress);
  const onReadyRef = useRef(onReady);
  getProgressRef.current = getProgress;
  onReadyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl", { alpha: false, antialias: true, premultipliedAlpha: false }) ||
            canvas.getContext("experimental-webgl", { alpha: false })) as WebGLRenderingContext | null;
    } catch { gl = null; }
    if (!gl) return; // no WebGL → stays transparent, DOM fallback shows
    const glc = gl;

    const compile = (type: number, src: string) => {
      const sh = glc.createShader(type);
      if (!sh) return null;
      glc.shaderSource(sh, src);
      glc.compileShader(sh);
      if (!glc.getShaderParameter(sh, glc.COMPILE_STATUS)) { glc.deleteShader(sh); return null; }
      return sh;
    };
    const vs = compile(glc.VERTEX_SHADER, VERT);
    const fs = compile(glc.FRAGMENT_SHADER, FRAG);
    const prog = glc.createProgram();
    if (!vs || !fs || !prog) return;
    glc.attachShader(prog, vs);
    glc.attachShader(prog, fs);
    glc.linkProgram(prog);
    if (!glc.getProgramParameter(prog, glc.LINK_STATUS)) return;
    glc.useProgram(prog);

    const buf = glc.createBuffer();
    glc.bindBuffer(glc.ARRAY_BUFFER, buf);
    glc.bufferData(glc.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), glc.STATIC_DRAW);
    const posLoc = glc.getAttribLocation(prog, "position");
    glc.enableVertexAttribArray(posLoc);
    glc.vertexAttribPointer(posLoc, 2, glc.FLOAT, false, 0, 0);

    const U = (n: string) => glc.getUniformLocation(prog, n);
    const uProgress = U("uProgress"), uTime = U("uTime"), uPlaneAspect = U("uPlaneAspect");
    const uBeforeAspect = U("uBeforeAspect"), uAfterAspect = U("uAfterAspect");
    glc.uniform1i(U("uBefore"), 0);
    glc.uniform1i(U("uAfter"), 1);

    const makeTex = (unit: number) => {
      const t = glc.createTexture();
      glc.activeTexture(glc.TEXTURE0 + unit);
      glc.bindTexture(glc.TEXTURE_2D, t);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.LINEAR);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.LINEAR);
      glc.texImage2D(glc.TEXTURE_2D, 0, glc.RGBA, 1, 1, 0, glc.RGBA, glc.UNSIGNED_BYTE, new Uint8Array([20, 17, 14, 255]));
      return t;
    };
    const texB = makeTex(0), texA = makeTex(1);

    let beforeAspect = 1, afterAspect = 1, loaded = 0;
    let destroyed = false;
    const loadInto = (src: string, tex: WebGLTexture | null, unit: number, set: (a: number) => void) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (destroyed) return;
        set(img.naturalWidth / Math.max(1, img.naturalHeight));
        glc.activeTexture(glc.TEXTURE0 + unit);
        glc.bindTexture(glc.TEXTURE_2D, tex);
        glc.pixelStorei(glc.UNPACK_FLIP_Y_WEBGL, true);
        glc.texImage2D(glc.TEXTURE_2D, 0, glc.RGBA, glc.RGBA, glc.UNSIGNED_BYTE, img);
        loaded++;
      };
      img.src = src;
    };
    loadInto(beforeSrc, texB, 0, (a) => { beforeAspect = a; });
    loadInto(afterSrc, texA, 1, (a) => { afterAspect = a; });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let planeAspect = 1;
    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      planeAspect = w / h;
      glc.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver((es) => { visible = es[0]?.isIntersecting ?? true; }, { threshold: 0 });
    io.observe(canvas);

    let raf = 0;
    let shown = false;
    let prog01 = getProgressRef.current() / 100;
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const time = (now - t0) / 1000;
      const target = getProgressRef.current() / 100;
      prog01 += (target - prog01) * 0.12;
      glc.uniform1f(uProgress, prog01);
      glc.uniform1f(uTime, time);
      glc.uniform1f(uPlaneAspect, planeAspect);
      glc.uniform1f(uBeforeAspect, beforeAspect);
      glc.uniform1f(uAfterAspect, afterAspect);
      glc.drawArrays(glc.TRIANGLE_STRIP, 0, 4);
      // Reveal the canvas only after a real frame has drawn with both textures,
      // so a stalled RAF / failed draw never flashes an empty box — the DOM
      // slider underneath stays visible instead.
      if (loaded === 2 && !shown) { shown = true; canvas.style.opacity = "1"; onReadyRef.current?.(); }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      glc.deleteProgram(prog);
      glc.deleteShader(vs);
      glc.deleteShader(fs);
      glc.deleteBuffer(buf);
      glc.deleteTexture(texB);
      glc.deleteTexture(texA);
      glc.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [beforeSrc, afterSrc]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ opacity: 0, transition: "opacity 0.6s ease", display: "block" }}
    />
  );
}
