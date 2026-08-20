const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
const hero = document.querySelector<HTMLElement>('.studio-hero');
const title = document.querySelector<HTMLElement>('.studio-hero__title');
const GRID_W = 96;
const GRID_H = 40;
const SPRING_K = 0.08;
const DAMPING = 0.9;
const DT = 0.1;
const FORCE = 8;

if (hero && precisePointer.matches && !reducedMotion.matches) {
  hero.addEventListener('pointermove', ({ clientX, clientY }) => {
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty('--studio-hero-x', `${clientX - bounds.left}px`);
    hero.style.setProperty('--studio-hero-y', `${clientY - bounds.top}px`);
  });
}

const initPageFluid = () => {
  if (!precisePointer.matches || reducedMotion.matches) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'studio-page-fluid';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: 'low-power'
  });
  if (!gl) return;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };

  const vertex = compile(gl.VERTEX_SHADER, `#version 300 es
    in vec2 aPosition;
    out vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `);
  const fragment = compile(gl.FRAGMENT_SHADER, `#version 300 es
    precision highp float;
    in vec2 vUv;
    out vec4 outColor;
    uniform vec2 uResolution;
    uniform vec2 uPointer;
    uniform float uTime;
    uniform float uEnergy;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      mat2 rotation = mat2(0.8, 0.6, -0.6, 0.8);
      for (int octave = 0; octave < 4; octave++) {
        value += amplitude * noise(p);
        p = rotation * p * 2.03 + 0.17;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {
      float aspect = uResolution.x / max(uResolution.y, 1.0);
      vec2 p = vUv;
      p.x *= aspect;
      vec2 drift = vec2(uTime * 0.025, -uTime * 0.018);
      vec2 turbulence = vec2(
        fbm(p * 1.65 + drift),
        fbm(p * 1.65 + drift + vec2(4.7, 1.9))
      );
      float current = fbm(p * 2.15 + turbulence * 1.85 - drift * 0.7);
      float filament = smoothstep(0.54, 0.88, current);

      vec2 pointer = uPointer;
      pointer.x *= aspect;
      vec2 delta = p - pointer;
      float radius = exp(-dot(delta, delta) * 5.5);
      float wake = radius * uEnergy;
      float ripple = 0.5 + 0.5 * sin(length(delta) * 22.0 - uTime * 1.8 + current * 5.0);

      float alpha = filament * 0.075 + wake * (0.055 + ripple * 0.07);
      vec3 amber = vec3(0.969, 0.710, 0.0);
      vec3 ember = vec3(0.55, 0.18, 0.02);
      vec3 color = mix(ember, amber, smoothstep(0.42, 0.9, current));
      outColor = vec4(color * alpha, alpha);
    }
  `);
  if (!vertex || !fragment) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  const position = gl.getAttribLocation(program, 'aPosition');
  const resolution = gl.getUniformLocation(program, 'uResolution');
  const pointer = gl.getUniformLocation(program, 'uPointer');
  const time = gl.getUniformLocation(program, 'uTime');
  const energy = gl.getUniformLocation(program, 'uEnergy');
  const buffer = gl.createBuffer();
  if (position < 0 || !resolution || !pointer || !time || !energy || !buffer) return;

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  document.body.prepend(canvas);

  let targetX = 0.5;
  let targetY = 0.46;
  let currentX = targetX;
  let currentY = targetY;
  let pointerEnergy = 0;
  let elapsed = 0;
  let lastTimestamp = 0;
  let lastRendered = 0;
  let frame = 0;
  let running = false;

  const resize = () => {
    const scale = Math.min(devicePixelRatio, 1.25);
    canvas.width = Math.max(1, Math.round(innerWidth * scale));
    canvas.height = Math.max(1, Math.round(innerHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const render = (timestamp: number) => {
    if (!running) return;
    frame = requestAnimationFrame(render);
    if (timestamp - lastRendered < 33) return;
    if (lastTimestamp) elapsed += Math.min(timestamp - lastTimestamp, 50) / 1000;
    lastTimestamp = timestamp;
    lastRendered = timestamp;
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    pointerEnergy *= 0.955;
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform2f(pointer, currentX, 1 - currentY);
    gl.uniform1f(time, elapsed);
    gl.uniform1f(energy, pointerEnergy);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const syncRendering = () => {
    const shouldRun = !document.hidden;
    if (shouldRun === running) return;
    running = shouldRun;
    lastTimestamp = 0;
    if (running) frame = requestAnimationFrame(render);
    else cancelAnimationFrame(frame);
  };

  addEventListener('pointermove', ({ clientX, clientY }) => {
    targetX = clientX / innerWidth;
    targetY = clientY / innerHeight;
    pointerEnergy = Math.min(1, pointerEnergy + 0.24);
  });
  addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncRendering);
  resize();
  syncRendering();
};

initPageFluid();

if (title && !reducedMotion.matches) {
  let glyphIndex = 0;
  for (const line of title.querySelectorAll<HTMLElement>('.studio-title-line')) {
    const characters = Array.from(line.textContent ?? '');
    line.replaceChildren(...characters.map((character) => {
      const glyph = document.createElement('span');
      glyph.className = 'studio-title-glyph';
      glyph.textContent = character === ' ' ? '\u00a0' : character;
      glyph.style.setProperty('--studio-glyph-delay', `${90 + glyphIndex * 43}ms`);
      glyph.style.setProperty('--studio-smoke-y', glyphIndex % 2 ? '-0.16em' : '0.16em');
      glyph.style.setProperty('--studio-smoke-y-soft', glyphIndex % 2 ? '0.08em' : '-0.08em');
      glyphIndex += 1;
      return glyph;
    }));
  }

  title.classList.add('is-resolved');
  setTimeout(() => {
    document.body.classList.add('studio-hero-complete');
    dispatchEvent(new Event('studio-hero-complete'));
  }, 2900);

  let scrollFrame = 0;
  const updateTitleOnScroll = () => {
    scrollFrame = 0;
    const progress = Math.min(scrollY / 420, 1);
    title.style.setProperty('--studio-title-shift', `${progress * -10}px`);
    title.style.setProperty('--studio-title-spacing', `${-0.03 - progress * 0.012}em`);
  };
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateTitleOnScroll);
  }, { passive: true });
}

const initTitleMesh = (heading: HTMLElement) => {
  const lines = [...heading.querySelectorAll<HTMLElement>('.studio-title-line')];
  if (!lines.length) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'studio-title-mesh';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };

  const vertex = compile(gl.VERTEX_SHADER, `#version 300 es
    in vec2 aPos;
    in vec2 aUv;
    in vec2 aDisp;
    out vec2 vUv;
    out float vMag;
    void main() {
      gl_Position = vec4(aPos + vec2(aDisp.x, 0.0), 0.0, 1.0);
      vUv = aUv;
      vMag = abs(aDisp.x);
    }
  `);
  const fragment = compile(gl.FRAGMENT_SHADER, `#version 300 es
    precision highp float;
    in vec2 vUv;
    in float vMag;
    out vec4 outColor;
    uniform sampler2D uTex;
    uniform float uChroma;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    void main() {
      vec4 base = texture(uTex, vUv);
      if (uChroma > 0.0) {
        float o = uChroma * 0.00500 * clamp(vMag * 8.0, 0.0, 1.0);
        float aOff = texture(uTex, vUv + vec2(o, 0.0)).a;
        float bOff = texture(uTex, vUv - vec2(o, 0.0)).a;
        vec3 col = base.rgb * base.a;
        col += uColorA * max(0.0, aOff - base.a);
        col += uColorB * max(0.0, bOff - base.a);
        float aMax = max(base.a, max(aOff, bOff));
        outColor = vec4(col, aMax);
      } else {
        outColor = base;
      }
    }
  `);
  if (!vertex || !fragment) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, 'aPos');
  const uvLocation = gl.getAttribLocation(program, 'aUv');
  const displacementLocation = gl.getAttribLocation(program, 'aDisp');
  const textLocation = gl.getUniformLocation(program, 'uTex');
  const chromaLocation = gl.getUniformLocation(program, 'uChroma');
  const colorALocation = gl.getUniformLocation(program, 'uColorA');
  const colorBLocation = gl.getUniformLocation(program, 'uColorB');
  if (positionLocation < 0 || uvLocation < 0 || displacementLocation < 0 || !textLocation || !chromaLocation || !colorALocation || !colorBLocation) return;

  const columns = GRID_W;
  const rows = GRID_H;
  const vertexCount = (columns + 1) * (rows + 1);
  const base = new Float32Array(vertexCount * 2);
  const displacement = new Float32Array(vertexCount * 2);
  const velocity = new Float32Array(vertexCount * 2);
  const vertices = new Float32Array(vertexCount * 6);
  const indices: number[] = [];

  for (let row = 0; row <= rows; row += 1) {
    for (let column = 0; column <= columns; column += 1) {
      const index = row * (columns + 1) + column;
      base[index * 2] = column / columns * 2 - 1;
      base[index * 2 + 1] = 1 - row / rows * 2;
      vertices[index * 6 + 2] = column / columns;
      vertices[index * 6 + 3] = row / rows;
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const topLeft = row * (columns + 1) + column;
      const bottomLeft = topLeft + columns + 1;
      indices.push(topLeft, bottomLeft, topLeft + 1, topLeft + 1, bottomLeft, bottomLeft + 1);
    }
  }

  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  const texture = gl.createTexture();
  if (!vertexBuffer || !indexBuffer || !texture) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(uvLocation);
  gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 24, 8);
  gl.enableVertexAttribArray(displacementLocation);
  gl.vertexAttribPointer(displacementLocation, 2, gl.FLOAT, false, 24, 16);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
  gl.uniform1i(textLocation, 0);
  gl.uniform1f(chromaLocation, 0);
  gl.uniform3f(colorALocation, 1, 0, 0);
  gl.uniform3f(colorBLocation, 0, 0, 1);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  heading.append(canvas);

  const updateVertices = () => {
    for (let index = 0; index < vertexCount; index += 1) {
      vertices[index * 6] = base[index * 2];
      vertices[index * 6 + 1] = base[index * 2 + 1];
      vertices[index * 6 + 4] = displacement[index * 2];
      vertices[index * 6 + 5] = displacement[index * 2 + 1];
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
  };

  const draw = () => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    updateVertices();
    gl.useProgram(program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(textLocation, 0);
    gl.uniform1f(chromaLocation, 0);
    gl.uniform3f(colorALocation, 1, 0, 0);
    gl.uniform3f(colorBLocation, 0, 0, 1);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);
  };

  const renderText = () => {
    const bounds = heading.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio, 1.5);
    canvas.width = Math.max(1, Math.round(bounds.width * scale));
    canvas.height = Math.max(1, Math.round(bounds.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);

    const textCanvas = document.createElement('canvas');
    textCanvas.width = canvas.width;
    textCanvas.height = canvas.height;
    const context = textCanvas.getContext('2d');
    if (!context) return;
    context.scale(scale, scale);
    const style = getComputedStyle(heading);
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    context.textBaseline = 'alphabetic';

    for (const line of lines) {
      context.fillStyle = getComputedStyle(line).color;
      const lineBounds = line.getBoundingClientRect();
      const lineMetrics = context.measureText('Hg');
      const baseline = lineBounds.top - bounds.top + lineBounds.height / 2
        + (lineMetrics.actualBoundingBoxAscent - lineMetrics.actualBoundingBoxDescent) / 2;
      for (const glyph of line.querySelectorAll<HTMLElement>('.studio-title-glyph')) {
        const glyphBounds = glyph.getBoundingClientRect();
        const character = glyph.textContent ?? '';
        context.fillText(character, glyphBounds.left - bounds.left, baseline);
      }
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    draw();
    heading.classList.add('has-mesh');
  };

  const cursor = { x: 99, y: 99, px: 99, py: 99, vx: 0, vy: 0, inside: false };
  const onMove = ({ clientX, clientY }: PointerEvent) => {
    const bounds = heading.getBoundingClientRect();
    const x = (clientX - bounds.left) / bounds.width * 2 - 1;
    const y = 1 - (clientY - bounds.top) / bounds.height * 2;
    if (!cursor.inside) {
      cursor.px = x;
      cursor.py = y;
      cursor.inside = true;
    }
    cursor.x = x;
    cursor.y = y;
  };
  const onLeave = () => {
    cursor.inside = false;
    cursor.x = 99;
    cursor.y = 99;
    cursor.vx = 0;
    cursor.vy = 0;
  };
  heading.addEventListener('pointermove', onMove);
  heading.addEventListener('pointerleave', onLeave);

  const tick = () => {
    cursor.vx = cursor.x - cursor.px;
    cursor.vy = cursor.y - cursor.py;
    if (Math.hypot(cursor.vx, cursor.vy) > 0.3) {
      cursor.vx = 0;
      cursor.vy = 0;
    }
    cursor.px = cursor.x;
    cursor.py = cursor.y;

    for (let index = 0; index < vertexCount; index += 1) {
      const offset = index * 2;
      const dx = displacement[offset];
      const dy = displacement[offset + 1];
      const cx = cursor.x - (base[offset] + dx);
      const cy = cursor.y - (base[offset + 1] + dy);
      const proximity = Math.max(0, 1 / (1 + Math.hypot(cx, cy) / 0.05) - 0.1);

      const force = FORCE / 10;
      let vx = velocity[offset] + cursor.vx * force * proximity;
      vx -= dx * SPRING_K;
      vx *= DAMPING;
      velocity[offset] = vx;
      velocity[offset + 1] = 0;
      displacement[offset] = Math.max(-1, Math.min(1, dx + vx * DT));
      displacement[offset + 1] = 0;
    }
    draw();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  document.fonts.ready.then(renderText);
  new ResizeObserver(renderText).observe(heading);
};

const initProductLens = () => {
  if (reducedMotion.matches) return;

  const cards = [...document.querySelectorAll<HTMLElement>('.studio-product')];
  if (!cards.length) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'studio-product__webgl';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power'
  });
  if (!gl) return;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    gl.deleteShader(shader);
    return null;
  };

  const vertex = compile(gl.VERTEX_SHADER, `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `);
  const fragment = compile(gl.FRAGMENT_SHADER, `
    precision mediump float;
    uniform sampler2D uImage;
    uniform vec2 uPointer;
    uniform float uAspect;
    uniform float uStrength;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec2 delta = vUv - uPointer;
      delta.x *= uAspect;
      float distanceToPointer = length(delta);
      float influence = smoothstep(0.42, 0.0, distanceToPointer) * uStrength;
      vec2 direction = normalize(delta + vec2(0.0001));
      direction.x /= uAspect;
      float ripple = sin(distanceToPointer * 38.0 - uTime * 2.8) * 0.0035 * influence;
      vec2 offset = direction * (0.022 * influence + ripple);
      float split = 0.0035 * influence;
      vec4 base = texture2D(uImage, vUv + offset);
      float red = texture2D(uImage, vUv + offset + direction * split).r;
      float blue = texture2D(uImage, vUv + offset - direction * split).b;
      gl_FragColor = vec4(red, base.g, blue, 1.0);
    }
  `);
  if (!vertex || !fragment) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const position = gl.getAttribLocation(program, 'aPosition');
  const pointerUniform = gl.getUniformLocation(program, 'uPointer');
  const aspectUniform = gl.getUniformLocation(program, 'uAspect');
  const strengthUniform = gl.getUniformLocation(program, 'uStrength');
  const timeUniform = gl.getUniformLocation(program, 'uTime');
  const imageUniform = gl.getUniformLocation(program, 'uImage');
  if (position < 0 || !pointerUniform || !aspectUniform || !strengthUniform || !timeUniform || !imageUniform) return;

  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  if (!buffer || !texture) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.uniform1i(imageUniform, 0);

  let activeCard: HTMLElement | null = null;
  let targetX = 0.5;
  let targetY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;
  let energy = 0;
  let frame = 0;

  const draw = (time: number) => {
    frame = 0;
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    energy *= 0.94;
    gl.uniform2f(pointerUniform, currentX, currentY);
    gl.uniform1f(strengthUniform, energy);
    gl.uniform1f(timeUniform, time / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (activeCard && (energy > 0.01 || Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.002)) {
      frame = requestAnimationFrame(draw);
    }
  };

  const startDrawing = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const setPointer = (card: HTMLElement, clientX: number, clientY: number) => {
    const bounds = card.getBoundingClientRect();
    targetX = (clientX - bounds.left) / bounds.width;
    targetY = 1 - (clientY - bounds.top) / bounds.height;
  };

  for (const card of cards) {
    const image = card.querySelector<HTMLImageElement>('img');
    if (!image) continue;

    card.addEventListener('pointerenter', async (event) => {
      activeCard = card;
      setPointer(card, event.clientX, event.clientY);
      if (!image.complete) await image.decode().catch(() => undefined);
      if (activeCard !== card || !image.naturalWidth) return;

      card.append(canvas);
      const bounds = card.getBoundingClientRect();
      const scale = Math.min(devicePixelRatio, 1.5);
      canvas.width = Math.round(bounds.width * scale);
      canvas.height = Math.round(bounds.height * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(aspectUniform, bounds.width / bounds.height);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      currentX = targetX;
      currentY = targetY;
      energy = 0.78;
      canvas.classList.add('is-active');
      startDrawing();
    });

    card.addEventListener('pointermove', (event) => {
      if (activeCard !== card) return;
      setPointer(card, event.clientX, event.clientY);
      energy = Math.min(1, energy + 0.42);
      startDrawing();
    });

    card.addEventListener('pointerleave', () => {
      if (activeCard !== card) return;
      activeCard = null;
      energy = 0;
      canvas.classList.remove('is-active');
    });
  }
};

const initScrollReveals = () => {
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  const elements = document.querySelectorAll<HTMLElement>([
    '.studio-section .ctw-section-number',
    '.studio-section .ctw-heading-lg',
    '.studio-founder',
    '.studio-mission > *',
    '.studio-intro > *',
    '.studio-offerings li',
    '.studio-process details',
    '.studio-products-section .ctw-lede',
    '.studio-product',
    '.studio-notes__cue',
    '.studio-quotes blockquote',
    '.studio-partners',
    '.studio-contact > *',
    '.studio-home .ctw-footer--complete > *'
  ].join(','));
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  elements.forEach((element, index) => {
    element.classList.add('studio-scroll-reveal');
    element.style.setProperty('--studio-reveal-delay', `${index % 4 * 55}ms`);
  });
  const start = () => elements.forEach((element) => observer.observe(element));
  if (document.body.classList.contains('studio-hero-complete')) {
    start();
  } else {
    addEventListener('studio-hero-complete', start, { once: true });
  }
};

initProductLens();
initScrollReveals();
