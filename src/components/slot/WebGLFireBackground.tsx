/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface WebGLFireBackgroundProps {
  isSpinning?: boolean;
  winTier?: 'NONE' | 'NORMAL' | 'BIG_WIN' | 'MEGA_WIN' | 'JACKPOT' | null;
  className?: string;
}

export const WebGLFireBackground: React.FC<WebGLFireBackgroundProps> = ({
  isSpinning = false,
  winTier = null,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Speed multiplier for spin/win dynamism (base 3.5 matching user shader)
  const targetSpeedRef = useRef<number>(3.5);
  const currentSpeedRef = useRef<number>(3.5);

  useEffect(() => {
    if (winTier === 'JACKPOT' || winTier === 'MEGA_WIN') {
      targetSpeedRef.current = 5.0;
    } else if (winTier === 'BIG_WIN' || winTier === 'NORMAL') {
      targetSpeedRef.current = 4.2;
    } else if (isSpinning) {
      targetSpeedRef.current = 4.0;
    } else {
      targetSpeedRef.current = 3.5; // Exact base speed specified by user
    }
  }, [isSpinning, winTier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // WebGL context configuration with high performance
    const gl = (canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    }) ||
      canvas.getContext('experimental-webgl', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
      })) as WebGLRenderingContext | null;

    if (!gl) {
      console.warn('WebGL is not supported by your browser/device.');
      return;
    }

    let animId: number | null = null;
    let running = true;

    // Fast resolution update optimized for landscape mobile to prevent any GPU stutter
    const updateDimensions = () => {
      if (!canvas || !gl) return;
      // Cap DPR to 1.5 to guarantee high resolution without mobile GPU lag in landscape
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor((window.innerWidth || document.documentElement.clientWidth || 800) * dpr);
      const h = Math.floor((window.innerHeight || document.documentElement.clientHeight || 600) * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Exact Vertex Shader from user
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Exact Fast Glowing WebGL Fire Effect Fragment Shader from user
    const fragmentShaderSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_speed;

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
        uv.x *= u_resolution.x / u_resolution.y;

        // Increased coordinate scale and FASTER upward time multiplier (3.5 base)
        vec2 coord = uv * vec2(3.0, 5.0);
        coord.y -= u_time * u_speed;

        float n = fbm(coord);

        float flameShape = (1.0 - uv.y) * 1.5 - n;
        float intensity = smoothstep(0.0, 0.6, flameShape);

        // Boosted color multipliers for a much brighter, more intense glow
        vec3 col = vec3(
          intensity * 2.2,
          intensity * intensity * 1.4,
          intensity * intensity * intensity * 0.4
        );

        // Faster, more vivid flickering sparks near the bottom
        if (uv.y < 0.3) {
          col = mix(col, vec3(1.2, 1.0, 0.6), (0.3 - uv.y) * 3.3 * rand(uv + u_time * 2.0));
        }

        gl_FragColor = vec4(col, intensity);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error('Shader compile error:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Alpha blending for seamless transparency over deep casino black background
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Fullscreen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPositionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPositionLocation);
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTimeLocation = gl.getUniformLocation(program, 'u_time');
    const uResolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const uSpeedLocation = gl.getUniformLocation(program, 'u_speed');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let startTime = performance.now();
    let lastTime = startTime;

    const render = (now: number) => {
      if (!running) return;

      const dt = Math.min(0.1, (now - lastTime) * 0.001);
      lastTime = now;

      // Smooth interpolation for speed
      currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * dt * 3.0;

      const currentTime = (now - startTime) * 0.001;

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform1f(uTimeLocation, currentTime);
      gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
      if (uSpeedLocation) {
        gl.uniform1f(uSpeedLocation, currentSpeedRef.current);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      running = false;
      window.removeEventListener('resize', updateDimensions);
      if (animId !== null) cancelAnimationFrame(animId);

      try {
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        if (program) gl.deleteProgram(program);
      } catch {
        // Safe disposal
      }
    };
  }, []);

  return (
    <div
      id="webgl-fire-container"
      className={`fixed inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-10 bg-transparent ${className}`}
    >
      <canvas
        ref={canvasRef}
        id="fireCanvas"
        className="w-full h-full block mix-blend-screen opacity-55 sm:opacity-65 transition-opacity duration-500"
        style={{
          width: '100vw',
          height: '100vh',
        }}
      />
    </div>
  );
};
