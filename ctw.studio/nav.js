/**
 * Shared navigation component for CTW Studio.
 *
 * Usage: <script src="/nav.js" data-base="/" data-active="workshop"></script>
 *
 * data-base:   Path prefix to root (e.g. "/" from root, "../" from subdirs)
 * data-active:  Which nav link to highlight: "workshop", "work", "founder"
 */
(function () {
  const script = document.currentScript;
  const base = script.getAttribute('data-base') || '/';
  const active = script.getAttribute('data-active') || '';

  // Inject nav CSS
  const style = document.createElement('style');
  style.textContent = `
    .frost-nav { position: fixed; left: 0; right: 0; top: 0; z-index: 50; }
    .frost-glass {
      position: absolute; inset: 0;
      --extended-by: 100px;
      bottom: calc(-1 * var(--extended-by));
      --filter: blur(24px);
      -webkit-backdrop-filter: var(--filter);
      backdrop-filter: var(--filter);
      pointer-events: none;
      --cutoff: calc(100% - var(--extended-by));
      -webkit-mask-image: linear-gradient(to bottom, black 0, black var(--cutoff), transparent var(--cutoff));
      mask-image: linear-gradient(to bottom, black 0, black var(--cutoff), transparent var(--cutoff));
    }
    .frost-glass-edge {
      position: absolute; z-index: -1; left: 0; right: 0;
      --extended-by: 80px; --offset: 20px; --thickness: 2px;
      height: calc(var(--extended-by) + var(--offset));
      top: calc(100% - var(--offset) + var(--thickness));
      --filter: blur(60px) saturate(140%) brightness(1.2);
      -webkit-backdrop-filter: var(--filter);
      backdrop-filter: var(--filter);
      pointer-events: none;
      -webkit-mask-image: linear-gradient(to bottom, black 0, black var(--offset), transparent var(--offset));
      mask-image: linear-gradient(to bottom, black 0, black var(--offset), transparent var(--offset));
    }
    .nav-link { position: relative; }
    .nav-link::after {
      content: ''; position: absolute; bottom: -4px; left: 0; width: 100%; height: 2px;
      background: linear-gradient(90deg, rgba(247, 181, 0, 0.9), transparent);
      transform: scaleX(0); transform-origin: left; transition: transform 0.25s ease;
    }
    .nav-link:hover::after { transform: scaleX(1); }
    /* Nav glitch effect */
    .glitch-sm { position: relative; display: inline-block; }
    .glitch-sm::before,
    .glitch-sm::after {
      content: attr(data-text);
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      overflow: hidden;
      pointer-events: none;
      background: #000;
      clip-path: inset(0 0 100% 0);
    }
    .glitch-sm::before { color: #0ff; text-shadow: 1px 0 #0ff; }
    .glitch-sm::after { color: #f0a; text-shadow: -1px 0 #f0a; }
    .glitch-sm:hover::before { animation: glitch-sm-1 0.5s 1 linear; }
    .glitch-sm:hover::after { animation: glitch-sm-2 0.5s 1 linear; }
    @keyframes glitch-sm-1 {
      0% { clip-path: inset(0 0 100% 0); }
      15% { clip-path: inset(10% -2px 50% 0); transform: translate(-3px, -1px) skewX(-1deg); }
      30% { clip-path: inset(55% -2px 5% 0); transform: translate(4px, 1px) skewX(2deg); }
      45% { clip-path: inset(0% -2px 65% 0); transform: translate(-2px, 1px) skewX(-1deg); }
      60% { clip-path: inset(40% -2px 20% 0); transform: translate(3px, -1px) skewX(1deg); }
      75% { clip-path: inset(70% -2px 0% 0); transform: translate(-4px, 1px) skewX(-2deg); }
      90% { clip-path: inset(20% -2px 50% 0); transform: translate(2px, -1px) skewX(1deg); }
      100% { clip-path: inset(0 0 100% 0); transform: translate(0) skewX(0); }
    }
    @keyframes glitch-sm-2 {
      0% { clip-path: inset(0 0 100% 0); }
      15% { clip-path: inset(45% -2px 15% 0); transform: translate(3px, 1px) skewX(1deg); }
      30% { clip-path: inset(5% -2px 60% 0); transform: translate(-4px, -1px) skewX(-2deg); }
      45% { clip-path: inset(60% -2px 0% 0); transform: translate(2px, 1px) skewX(1deg); }
      60% { clip-path: inset(15% -2px 45% 0); transform: translate(-3px, -1px) skewX(-1deg); }
      75% { clip-path: inset(75% -2px 0% 0); transform: translate(4px, 1px) skewX(2deg); }
      90% { clip-path: inset(30% -2px 35% 0); transform: translate(-2px, 1px) skewX(-1deg); }
      100% { clip-path: inset(0 0 100% 0); transform: translate(0) skewX(0); }
    }
  `;
  document.head.appendChild(style);

  // Build nav links
  const links = [
    { id: 'workshop', href: base + 'workshop/', label: 'AI Workshop', glitch: true },
    { id: 'work', href: base + 'portfolio/', label: 'Work' },
    { id: 'founder', href: base + '#about', label: 'Founder', classes: 'hidden md:block' },
  ];

  const linkHTML = links.map(l => {
    const isActive = active === l.id ? ' text-white' : '';
    const extraClasses = l.classes ? ' ' + l.classes : '';
    if (l.glitch) {
      return `<a href="${l.href}" class="nav-link glitch-sm${isActive}${extraClasses}" data-text="${l.label}">${l.label}</a>`;
    }
    return `<a href="${l.href}" class="nav-link${isActive}${extraClasses}">${l.label}</a>`;
  }).join('\n        ');

  const contactHref = base + '#contact';

  // Insert nav
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.className = 'frost-nav';
  nav.innerHTML = `
    <div class="frost-glass"></div>
    <div class="frost-glass-edge"></div>
    <div class="max-w-[1700px] mx-auto px-6 py-5 md:py-6 flex items-center justify-between relative">
      <a href="${base}" class="flex items-center gap-2.5">
        <img src="${base}favicon.png" alt="CTW Studio" class="w-9 h-9 md:w-10 md:h-10">
        <span class="text-lg font-semibold tracking-tight">CTW<span class="text-amber-400">.</span>studio</span>
      </a>
      <div class="flex items-center gap-4 md:gap-8 text-sm md:text-base text-gray-300">
        ${linkHTML}
        <a href="${contactHref}" class="border border-amber-400 text-amber-400 px-4 py-2 rounded-full font-medium hover:bg-amber-400 hover:text-black transition-colors">Contact</a>
      </div>
    </div>
  `;

  document.body.prepend(nav);
})();
