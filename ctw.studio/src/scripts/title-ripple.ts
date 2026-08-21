const noOp = () => {};

export const mountTitleRipple = (heading: HTMLElement, source: HTMLCanvasElement) => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionPreference = document.documentElement.dataset.motionPreference ?? 'system';
  const motionReduced = motionPreference === 'reduced' || (motionPreference !== 'full' && reducedMotion.matches);
  const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
  if (motionReduced || !precisePointer.matches) return noOp;

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: 'low-power'
  });
  if (!gl) return noOp;

  const compile = (type: number, shaderSource: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, shaderSource);
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
      vec4 redSample = texture2D(uImage, vUv + offset + direction * split);
      vec4 blueSample = texture2D(uImage, vUv + offset - direction * split);
      float alpha = max(base.a, max(redSample.a, blueSample.a));
      vec3 color = vec3(redSample.r, base.g, blueSample.b);
      color += vec3(0.12, 0.0, 0.0) * max(0.0, redSample.a - base.a);
      color += vec3(0.0, 0.04, 0.18) * max(0.0, blueSample.a - base.a);
      color = min(color, vec3(alpha));
      gl_FragColor = vec4(color, alpha);
    }
  `);
  if (!vertex || !fragment) return noOp;

  const program = gl.createProgram();
  if (!program) return noOp;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return noOp;

  const position = gl.getAttribLocation(program, 'aPosition');
  const pointerUniform = gl.getUniformLocation(program, 'uPointer');
  const aspectUniform = gl.getUniformLocation(program, 'uAspect');
  const strengthUniform = gl.getUniformLocation(program, 'uStrength');
  const timeUniform = gl.getUniformLocation(program, 'uTime');
  const imageUniform = gl.getUniformLocation(program, 'uImage');
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  if (position < 0 || !pointerUniform || !aspectUniform || !strengthUniform || !timeUniform || !imageUniform || !buffer || !texture) return noOp;

  canvas.className = 'studio-title-ripple';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.rippleActive = 'false';
  heading.append(canvas);

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.uniform1i(imageUniform, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  let active = false;
  let disposed = false;
  let targetX = 0.5;
  let targetY = 0.5;
  let currentX = 0.5;
  let currentY = 0.5;
  let energy = 0;
  let frame = 0;
  let refreshFrame = 0;

  const uploadSource = () => {
    const bounds = source.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio, 1.5);
    canvas.style.setProperty('--ctw-canvas-smoke-overscan', source.style.getPropertyValue('--ctw-canvas-smoke-overscan'));
    canvas.width = Math.max(1, Math.round(bounds.width * scale));
    canvas.height = Math.max(1, Math.round(bounds.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(aspectUniform, bounds.width / Math.max(bounds.height, 1));
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  };

  const draw = (time: number) => {
    frame = 0;
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    energy *= 0.94;
    gl.uniform2f(pointerUniform, currentX, currentY);
    gl.uniform1f(strengthUniform, energy);
    gl.uniform1f(timeUniform, time / 1000);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (active && !document.hidden && (energy > 0.01 || Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.002)) {
      frame = requestAnimationFrame(draw);
    }
  };

  const startDrawing = () => {
    if (!frame && !document.hidden) frame = requestAnimationFrame(draw);
  };

  const setPointer = ({ clientX, clientY }: PointerEvent) => {
    const sourceBounds = source.getBoundingClientRect();
    const headingBounds = heading.getBoundingClientRect();
    targetX = (clientX - sourceBounds.left) / sourceBounds.width;
    targetY = 1 - (clientY - sourceBounds.top) / sourceBounds.height;
    canvas.dataset.rippleX = (clientX - headingBounds.left).toFixed(1);
    canvas.dataset.rippleY = (clientY - headingBounds.top).toFixed(1);
  };

  const activate = (event: PointerEvent) => {
    if (event.pointerType === 'touch') {
      deactivate();
      return;
    }
    setPointer(event);
    if (!active) {
      uploadSource();
      currentX = targetX;
      currentY = targetY;
      active = true;
      canvas.dataset.rippleActive = 'true';
      canvas.classList.add('is-active');
      heading.classList.add('is-title-ripple-active');
    }
    energy = Math.min(1, Math.max(0.78, energy + 0.42));
    startDrawing();
  };

  const deactivate = () => {
    active = false;
    energy = 0;
    cancelAnimationFrame(frame);
    frame = 0;
    canvas.dataset.rippleActive = 'false';
    canvas.classList.remove('is-active');
    heading.classList.remove('is-title-ripple-active');
  };

  const onVisibilityChange = () => {
    if (document.hidden) deactivate();
    else uploadSource();
  };
  const scheduleRefresh = () => {
    deactivate();
    if (refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      if (!disposed && !document.hidden) uploadSource();
    });
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') deactivate();
  };
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'touch') deactivate();
  };
  const onScroll = () => {
    if (active) deactivate();
  };
  const resizeObserver = new ResizeObserver(scheduleRefresh);

  uploadSource();
  heading.addEventListener('pointerenter', activate);
  heading.addEventListener('pointermove', activate);
  heading.addEventListener('pointerdown', onPointerDown);
  heading.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibilityChange);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', scheduleRefresh);
  resizeObserver.observe(heading);

  return () => {
    disposed = true;
    deactivate();
    cancelAnimationFrame(refreshFrame);
    refreshFrame = 0;
    resizeObserver.disconnect();
    heading.removeEventListener('pointerenter', activate);
    heading.removeEventListener('pointermove', activate);
    heading.removeEventListener('pointerdown', onPointerDown);
    heading.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', scheduleRefresh);
    gl.deleteBuffer(buffer);
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    canvas.remove();
  };
};
