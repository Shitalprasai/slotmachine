/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface SideFlamesProps {
  position: 'left' | 'right';
  intensity?: 'normal' | 'high';
}

/**
 * Real WebGL Fire Effect Canvas based on the user's fast glowing fire shader.
 * Flanks the 3D Slot Cabinet with real burning, flickering fire and sparks.
 */
export const SideFlames: React.FC<SideFlamesProps> = ({ position, intensity = 'normal' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      preserveDrawingBuffer: false,
    }) ||
      canvas.getContext('experimental-webgl', {
        alpha: true,
        antialias: false,
        depth: false,
      })) as WebGLRenderingContext | null;

    if (!gl) return;

    let animId: number | null = null;
    let running = true;

    const resize = () => {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(30, Math.floor(rect.width * 1.2));
      const h = Math.max(100, Math.floor(rect.height * 1.2));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Exact Vertex Shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Exact Fragment Shader with user's fast glowing fire math + side feathering
    const fragmentShaderSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_is_left;
      uniform float u_intensity_boost;

      float rand(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = rand(i);
        float b = rand(i + vec2(1.0, 0.0));
        float c = rand(i + vec2(0.0, 1.0));
        float d = rand(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;

        // Map coordinates for side flame column
        vec2 coord = uv * vec2(2.8, 4.5);
        coord.y -= u_time * 3.5;

        float n = fbm(coord);
        float flameShape = (1.0 - uv.y) * 1.5 - n;

        // Side feathering: fade towards outer screen edge so fire emerges from the cabinet
        float sideMask = 1.0;
        if (u_is_left > 0.5) {
          // Left side: uv.x=0 is outer left, uv.x=1 is next to cabinet
          sideMask = smoothstep(0.0, 0.45, uv.x);
        } else {
          // Right side: uv.x=0 is next to cabinet, uv.x=1 is outer right
          sideMask = smoothstep(1.0, 0.55, uv.x);
        }

        flameShape *= sideMask;
        float intensity = smoothstep(0.0, 0.6, flameShape) * u_intensity_boost;

        // User's boosted color multipliers for intense glowing fire
        vec3 col = vec3(
          intensity * 2.2,
          intensity * intensity * 1.4,
          intensity * intensity * intensity * 0.4
        );

        // User's flickering sparks near the base
        if (uv.y < 0.35) {
          col = mix(col, vec3(1.2, 1.0, 0.6), (0.35 - uv.y) * 3.3 * rand(uv + u_time * 2.0));
        }

        gl_FragColor = vec4(col, min(1.0, intensity * 1.2));
      }
    `;

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Full quad buffer
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uIsLeft = gl.getUniformLocation(program, 'u_is_left');
    const uBoost = gl.getUniformLocation(program, 'u_intensity_boost');

    gl.uniform1f(uIsLeft, position === 'left' ? 1.0 : 0.0);
    gl.uniform1f(uBoost, intensity === 'high' ? 1.25 : 1.05);

    const startTime = performance.now();

    const render = (now: number) => {
      if (!running) return;
      const t = (now - startTime) * 0.001;

      gl.useProgram(program);
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      running = false;
      ro.disconnect();
      if (animId !== null) cancelAnimationFrame(animId);
      try {
        if (buf) gl.deleteBuffer(buf);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        if (program) gl.deleteProgram(program);
      } catch {
        // Safe disposal
      }
    };
  }, [position, intensity]);

  return (
    <div
      className={`absolute -top-4 -bottom-4 ${
        position === 'left'
          ? '-left-8 sm:-left-12 md:-left-16 lg:-left-20'
          : '-right-8 sm:-right-12 md:-right-16 lg:-right-20'
      } w-10 sm:w-14 md:w-20 lg:w-24 pointer-events-none z-10 overflow-visible select-none`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none filter drop-shadow-[0_0_16px_rgba(255,90,0,0.9)] drop-shadow-[0_0_32px_rgba(220,38,38,0.55)]"
        style={{
          transform: position === 'left' ? 'scaleX(1)' : 'scaleX(-1)',
        }}
      />
    </div>
  );
};
