/**
 * Project data for CTW Studio portfolio.
 * Each project includes metadata for grid display and rich detail pages.
 *
 * Gallery items: { type: 'image'|'video'|'pair', src, src2?, caption? }
 * - 'image': full-width image
 * - 'video': full-width HTML5 video
 * - 'pair': two images side-by-side
 */
export const projects = [
  {
    id: 'data-storytelling',
    title: 'Data Storytelling',
    date: '2025-12-22',
    client: 'Netherlands eScience Center',
    category: 'AI · Research Communication',
    headline: 'Stories That Write Themselves',
    description: `Research software often struggles to find its audience. The code works, the science is solid, but communicating its value to different stakeholders remains a challenge.

This platform tackles that directly — combining 3D visualization with AI-powered story generation. It transforms research software metadata from the Research Software Directory into tailored narratives for communications teams, academics, leadership, and quick overviews.

Built with SvelteKit, Threlte (Three.js for Svelte), and Google Gemini API with real-time streaming.`,
    coverImage: 'projects/data-storytelling/cover.avif',
    gridSpan: 4,
    liveUrl: 'https://nlesc.github.io/data-storytelling/',
    repoUrl: 'https://github.com/NLeSC/data-storytelling',
    tags: ['AI', 'Three.js', 'SvelteKit', 'Gemini', 'LLM'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/data-storytelling/cover.avif', caption: 'Immersive 3D domain exploration interface' },
      { type: 'image', src: 'projects/data-storytelling/gallery-1.avif', caption: '3D domain exploration with floating project cards' },
      { type: 'pair', src: 'projects/data-storytelling/gallery-2.avif', src2: 'projects/data-storytelling/gallery-3.avif', caption: 'AI story generation and context enrichment' },
      { type: 'image', src: 'projects/data-storytelling/gallery-4.avif', caption: 'Project search and filtering' }
    ]
  },
  {
    id: 'nlesc-portfolio',
    title: 'NLeSC Portfolio',
    date: '2025-12-01',
    client: 'Netherlands eScience Center',
    category: 'Research Platform',
    headline: 'A living portfolio for open research software',
    description: `A public-facing research software portfolio for the Netherlands eScience Center: part showcase, part discovery surface, and part communications tool. The platform is designed to make project impact visible without forcing research teams into a heavy content-management workflow.

The work focuses on clear project cards, fast browsing, strong visual rhythm, and simple pathways from a project story to the software, people, and research context behind it. It turns an institutional archive into something closer to an editorial product: readable, filterable, and approachable for funders, collaborators, researchers, and the public.`,
    coverImage: 'projects/nlesc-portfolio/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://nlesc.ctwhome.com/',
    tags: ['SvelteKit', 'Research', 'Portfolio', 'Communication'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/nlesc-portfolio/cover.avif', caption: 'Netherlands eScience Center portfolio identity and landing screen' },
      { type: 'image', src: 'projects/nlesc-portfolio/live-site.jpg', caption: 'Live portfolio interface showing research software as editorial project stories' }
    ]
  },
  {
    id: 'plan-eo',
    title: 'PlanEO',
    date: '2025-10-15',
    client: 'Netherlands eScience Center',
    category: 'Geospatial',
    headline: 'Earth observation made practical',
    description: `A practical geospatial visualization solution using Cloud Optimized GeoTIFF, MapLibre, and Svelte. The prototype explores how research teams can publish map-based Earth-observation data without inheriting the cost and maintenance burden of a custom geospatial backend.

The platform combines a static-first deployment model with an LLM-powered agent for natural-language exploration. The goal is a lighter, FAIR-friendly workflow: data remains accessible, maps stay performant in the browser, and researchers can ask questions in human language instead of only through GIS controls.`,
    coverImage: 'projects/plan-eo/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    tags: ['GIS', 'MapLibre', 'Svelte', 'COGTIFF', 'AI Agent'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/plan-eo/cover.avif', caption: 'PlanEO geospatial visualization interface' },
      { type: 'pair', src: 'projects/plan-eo/gallery-1.avif', src2: 'projects/plan-eo/gallery-2.avif', caption: 'System architecture and AI agent integration' }
    ]
  },
  {
    id: 'collaite',
    title: 'COLLaiTE',
    date: '2025-01-01',
    client: 'Huygens Institute (KNAW)',
    category: 'Textual Scholarship',
    headline: 'Machine learning meets manuscripts',
    description: `Collens is a web-based tool for scholars comparing textual variants with annotations. It supports TEI/XML-encoded texts, side-by-side comparison, annotation-aware alignment, and an offline-first workflow for research sessions where the source material should remain close to the scholar.

The product challenge was to make machine-learning assistance feel like a practical scholarly instrument rather than a black box. The interface focuses on direct manipulation: drag documents in, compare variants, inspect alignment, and keep the critical reading workflow visible throughout.`,
    coverImage: 'projects/collaite/cover.avif',
    gridSpan: 1,
    liveUrl: null,
    repoUrl: 'https://github.com/collaite/collens',
    tags: ['ML', 'Digital Humanities', 'SvelteKit', 'NLP'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/collaite/cover.avif', caption: 'Collens — intelligent text comparison' },
      { type: 'video', src: 'projects/collaite/drag.mp4', caption: 'Drag-and-drop document comparison workflow' },
      { type: 'image', src: 'projects/collaite/gallery-1.avif', caption: 'Side-by-side manuscript variant analysis' }
    ]
  },
  {
    id: 'smartplay',
    title: 'SmartPlay',
    date: '2024-10-06',
    client: 'Netherlands eScience Center',
    category: 'Wearable Research',
    headline: 'Understanding play through wearables',
    description: `SmartPlay is a Wear OS research application for studying children's play behavior with real-time sensor data. The project bridges developmental psychology, human-media interaction, and research software engineering: GPS, motion, heart-rate, and environmental signals are captured alongside subjective input from children themselves.

The design challenge was balancing scientific richness with a child-friendly, glanceable watch interface and a privacy-conscious data workflow. The app stores data locally and supports offline extraction, giving researchers a richer picture of play while keeping participant safety and ethics at the center.`,
    coverImage: 'projects/smartplay/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    repoUrl: 'https://github.com/ctwhome/SmartPlay',
    tags: ['WearOS', 'Android', 'Research', 'Child Development', 'Sensors'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/smartplay/cover.avif', caption: 'SmartPlay Wear OS application' },
      { type: 'image', src: 'projects/smartplay/dashboard.jpg', caption: 'Research dashboard for reviewing activity and play-behavior data' },
      { type: 'pair', src: 'projects/smartplay/workflow.jpg', src2: 'projects/smartplay/sensors.jpg', caption: 'Data workflow and sensor streams captured by the wearable app' },
      { type: 'image', src: 'projects/smartplay/dashboard.gif', caption: 'Animated dashboard walkthrough' }
    ]
  },
  {
    id: 'faivor',
    title: 'FAIVOR',
    date: '2024-01-01',
    client: 'Netherlands eScience Center',
    category: 'Healthcare AI',
    headline: 'Governed validation for healthcare AI',
    description: `FAIVOR is a FAIR validation platform for medical machine-learning systems. It helps move healthcare AI from experimental notebooks toward documented, reproducible, and properly governed validation workflows.

The portfolio entry now treats FAIVOR as the trust layer around clinical AI: model outputs need provenance, validation protocols, explainability, and a clear path for reviewers. The work sits between research software, MLOps, and responsible healthcare deployment, where the interface has to communicate confidence without overselling automation.`,
    coverImage: 'projects/faivor/cover.jpg',
    gridSpan: 1,
    liveUrl: 'https://research-software-directory.org/projects/faivor',
    tags: ['ML', 'FAIR', 'Healthcare', 'Validation', 'MLOps'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/faivor/cover.jpg', caption: 'FAIVOR project page in the Research Software Directory' },
      { type: 'image', src: 'projects/faivor/details.jpg', caption: 'FAIVOR software metadata and validation context' }
    ]
  },
  {
    id: 'ruisdael-observatory',
    title: 'Ruisdael Observatory',
    date: '2023-11-29',
    client: 'TU Delft · KNMI',
    category: 'Climate Science',
    headline: 'Seeing the atmosphere in real time',
    description: `A dynamic 3D volumetric rendering experiment for large atmospheric datasets. Created with the Ruisdael Observatory at TU Delft, the viewer explores measured cloud points and DALES simulation output directly in the browser.

The rendering pipeline converts compressed Zarr data into interactive 3D volumes with timeline playback, map context, and cloud-point inspection. It is research software as an instrument: a way for atmospheric scientists to move from static plots toward explorable time-lapses of the boundary layer.`,
    coverImage: 'projects/ruisdael-observatory/cover.avif',
    gridSpan: 4,
    liveUrl: null,
    repoUrl: 'https://github.com/NLeSC/zarrviz',
    tags: ['Three.js', 'WebGL', 'Zarr', 'Climate Science'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/ruisdael-observatory/cover.avif', caption: 'Volumetric cloud rendering in the browser' },
      { type: 'image', src: 'projects/ruisdael-observatory/gallery-1.avif', caption: '3D atmospheric visualization with real-time data' },
      { type: 'pair', src: 'projects/ruisdael-observatory/gallery-2.avif', src2: 'projects/ruisdael-observatory/gallery-3.avif', caption: 'Cloud point processing pipeline and data transformation' },
      { type: 'image', src: 'projects/ruisdael-observatory/gallery-4.avif', caption: 'Map integration with volumetric cloud overlay' }
    ]
  },
  {
    id: 'carbon-budget-explorer',
    title: 'Carbon Budget Explorer',
    date: '2023-10-12',
    client: 'PBL Netherlands',
    category: 'Climate Policy · Design',
    headline: 'Clarity for climate policy',
    description: `UI/UX redesign of the Carbon Budget Explorer for policymakers who need to reason about complex climate pathways without becoming climate-model specialists. The challenge was to simplify the product while preserving the scientific nuance behind carbon budgets, scenarios, and uncertainty.

The redesign introduced a new logotype, cleaner information architecture, stronger comparison views, and a more deliberate visual hierarchy. It makes the tool easier for non-technical stakeholders to scan, discuss, and trust while keeping the underlying data visible.`,
    coverImage: 'projects/carbon-budget-explorer/cover.avif',
    gridSpan: 4,
    liveUrl: null,
    repoUrl: 'https://github.com/pbl-nl/website-carbon-budget-explorer',
    tags: ['UI/UX Design', 'Climate Policy', 'Data Visualization'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/carbon-budget-explorer/cover.avif', caption: 'Redesigned Carbon Budget Explorer interface' },
      { type: 'image', src: 'projects/carbon-budget-explorer/gallery-1.avif', caption: 'Before and after — UI transformation' },
      { type: 'image', src: 'projects/carbon-budget-explorer/gallery-2.avif', caption: 'Detailed design specifications and component library' }
    ]
  },
  {
    id: 'notidian',
    title: 'Notidian',
    date: '2023-01-01',
    client: 'CTW Studio',
    category: 'Productivity',
    headline: 'A local-first workspace for notes, media, and thought',
    description: `Notidian is a workspace-first personal knowledge management app: notes, documents, drawing, media, and daily thinking in one local-first environment. It started from the friction of using Obsidian as a power tool and asks what a calmer, more spatial, more media-native knowledge OS could look like.

The product direction emphasizes user-owned data, fast local interaction, private sync, and a canvas/editor model that can grow from writing into diagrams, presentations, and multimedia work. It is less a note app clone and more a long-term research/product bet on personal operating systems.`,
    coverImage: 'projects/notidian/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://notidian.com',
    tags: ['SvelteKit', 'Tauri', 'Local-first', 'PKM', 'WebGPU'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/notidian/cover.avif', caption: 'Notidian — daily knowledge management' },
      { type: 'image', src: 'projects/notidian/live-site.jpg', caption: 'Public product site for Notidian' },
      { type: 'pair', src: 'projects/notidian/workspace.webp', src2: 'projects/notidian/local-first.webp', caption: 'Workspace-first information architecture and local-first ownership' },
      { type: 'pair', src: 'projects/notidian/drawing.webp', src2: 'projects/notidian/ai.webp', caption: 'Drawing and AI-assisted workflows planned as native workspace primitives' }
    ]
  },
  {
    id: 'ideasdiamond',
    title: 'IdeasDiamond',
    date: '2023-01-01',
    client: 'CTW Studio',
    category: 'Creativity Tool',
    headline: 'From scattered thoughts to shared idea systems',
    description: `IdeasDiamond is a visual ideation and organization platform for turning loose thoughts into structured, actionable plans. It combines brainstorming, categorization, private workspaces, and lightweight publishing so ideas can move from private sparks into something teams can discuss.

The product explores a more playful model for knowledge work: spatial thinking, branded idea spaces, community feedback, and simple app-like containers for projects. The result sits somewhere between a brainstorming canvas, an internal innovation board, and a personal idea operating system.`,
    coverImage: 'projects/ideasdiamond/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://ideasdiamond.com',
    tags: ['SvelteKit', 'Creativity', 'Productivity', 'Community'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/ideasdiamond/cover.avif', caption: 'IdeasDiamond — visual brainstorming' },
      { type: 'image', src: 'projects/ideasdiamond/live-site.jpg', caption: 'Current IdeasDiamond public landing page' },
      { type: 'pair', src: 'projects/ideasdiamond/all-apps.png', src2: 'projects/ideasdiamond/private-organizations.png', caption: 'App-style idea spaces and private organization workflows' },
      { type: 'image', src: 'projects/ideasdiamond/make-it-yours.gif', caption: 'Customizing an IdeasDiamond workspace' }
    ]
  },
  {
    id: 'via-appia',
    title: 'Via Appia',
    date: '2022-01-01',
    client: 'Het Valkhof Museum',
    category: 'Digital Humanities',
    headline: 'Walking the Eternal Road',
    description: `The eternal road that defined the past, present, and future. A 3D interactive point cloud visualizer for the ancient Roman Appian Way — accessible on desktop, mobile, and VR.

Presented at het Valkhof Museum in Nijmegen, this gamified experience connects years of academic and artistic research, offering a refreshing perspective on the 'Regina Viarum'. Visitors follow in the footsteps of millions who have walked there since Roman times.

Built with NuxtJS, ThreeJS, PotreeJS, and a Git-based content management system for dynamic point views and story pages.`,
    coverImage: 'projects/via-appia/cover.avif',
    gridSpan: 1,
    liveUrl: 'https://via-appia.netlify.app/',
    repoUrl: 'https://github.com/Via-Appia/via-appia-online-viewer',
    tags: ['3D Visualization', 'VR', 'Point Cloud', 'WebGL'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'video', src: 'projects/via-appia/intro.mp4', caption: 'Interactive journey through the Via Appia' },
      { type: 'image', src: 'projects/via-appia/cover.avif', caption: 'Point cloud visualization of the Appian Way' },
      { type: 'image', src: 'projects/via-appia/gallery-1.avif', caption: 'Historical photos matched with modern photographs' },
      { type: 'pair', src: 'projects/via-appia/gallery-2.avif', src2: 'projects/via-appia/gallery-4.avif', caption: 'Technology stack and content management architecture' },
      { type: 'image', src: 'projects/via-appia/gallery-3.avif', caption: 'Story pages mapping images to 3D viewpoints' },
      { type: 'pair', src: 'projects/via-appia/gallery-5.avif', src2: 'projects/via-appia/gallery-6.avif', caption: 'Camera path animations and museum installation' }
    ]
  },
  {
    id: 'fedmix-clinical-viewer',
    title: 'FedMix Clinical Viewer',
    date: '2021-07-05',
    client: 'Maastricht University',
    category: 'Medical Imaging',
    headline: 'Desktop tooling for AI-assisted clinical image review',
    description: `Eshmun is a standalone medical image analysis and annotation viewer built for the FEDMix research project: Fusible Evolutionary Deep Neural Network Mixture Learning. The application gives researchers a cross-platform desktop environment for loading clinical scans, inspecting model output, and drawing or reviewing anatomical regions directly on top of medical image slices.

I worked on the research-software product layer: turning clinical-imaging workflows into a robust C++/Qt/VTK application that could be built across macOS, Windows, and Linux. The interface combines grayscale scan inspection, color overlays, contour editing, and multi-panel comparison so experimental AI results can be evaluated by humans instead of staying hidden in notebooks or scripts.

The project sits at the intersection of medical imaging, reproducible research software, and human-in-the-loop AI validation.`,
    coverImage: 'projects/fedmix-clinical-viewer/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    repoUrl: 'https://github.com/FEDMix/eshmun',
    tags: ['C++', 'Qt', 'VTK', 'Medical Imaging', 'AI Validation'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/fedmix-clinical-viewer/cover.avif', caption: 'Clinical image slice with contour annotations and model-output overlays' },
      { type: 'image', src: 'projects/fedmix-clinical-viewer/overview.jpg', caption: 'Eshmun desktop viewer interface from the FEDMix README' },
      { type: 'pair', src: 'projects/fedmix-clinical-viewer/gallery-1.jpg', src2: 'projects/fedmix-clinical-viewer/gallery-2.jpg', caption: 'Application screens for reviewing medical images and segmentation overlays' },
      { type: 'image', src: 'projects/fedmix-clinical-viewer/gallery-3.jpg', caption: 'Multi-panel clinical viewer workflow for image comparison and annotation' }
    ]
  },
  {
    id: 'nl-rse',
    title: 'NL-RSE Website',
    date: '2021-06-10',
    client: 'NL-RSE Community',
    category: 'Community Platform',
    headline: 'A public home for Dutch Research Software Engineers',
    description: `A complete structure and content redesign for the Netherlands Group of Research Software Engineers website. In collaboration with Lieke de Boer and the NL-RSE community, the site became a central hub for events, community updates, resources, and the wider identity of research software engineering in the Netherlands.

The implementation used NuxtJS and Nuxt Content with a performance-first static workflow. The design work focused on making a volunteer-led community feel credible and alive: clear navigation, an RSE feed, custom animations, reusable content patterns, and a maintainable editorial structure.`,
    coverImage: 'projects/nl-rse/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://nl-rse.org',
    repoUrl: 'https://github.com/nl-rse/nl-rse.github.io',
    tags: ['NuxtJS', 'Community', 'Web Design', 'Static Site'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/nl-rse/cover.avif', caption: 'NL-RSE community website redesign' },
      { type: 'image', src: 'projects/nl-rse/live-site.jpg', caption: 'Current NL-RSE community website' },
      { type: 'pair', src: 'projects/nl-rse/design-system.jpg', src2: 'projects/nl-rse/community-page.png', caption: 'Visual design exploration and community page structure' },
      { type: 'image', src: 'projects/nl-rse/cover-alt.jpg', caption: 'Homepage composition and interaction direction' }
    ]
  },
  {
    id: 'receipt',
    title: 'Receipt',
    date: '2020-10-08',
    client: 'Horizon 2020 EU',
    category: 'Climate Visualization',
    headline: 'Climate storylines for action',
    description: `The Climate Storylines platform translated climate-change research into narrative, explorable scenes for the EU Horizon 2020 RECEIPT project. Rather than dropping users into raw datasets, the interface guided them through storylines that explain risks, impacts, and adaptation challenges in a more relatable way.

I developed the UI from scratch with a focus on scene-to-scene continuity: keeping the experience coherent as users moved between maps, 3D visualizations, explanatory panels, and supporting resources. The result was a research communication product designed to make climate impacts easier to discuss with stakeholders.`,
    coverImage: 'projects/receipt/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    tags: ['3D Visualization', 'Climate Change', 'Web', 'Research'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/receipt/cover.avif', caption: 'Climate Storylines platform' },
      { type: 'image', src: 'projects/receipt/image-2.avif', caption: 'Climate Storylines overview screen' },
      { type: 'pair', src: 'projects/receipt/image-3.png', src2: 'projects/receipt/image-4.png', caption: 'Narrative scene design and climate-impact exploration' },
      { type: 'pair', src: 'projects/receipt/image-5.png', src2: 'projects/receipt/image-7.png', caption: 'Supporting interface states and storyline resources' },
      { type: 'image', src: 'projects/receipt/image-8.png', caption: 'Technology and project context for the RECEIPT platform' }
    ]
  },
  {
    id: 'mistergreen',
    title: 'MisterGreen',
    date: '2019-10-09',
    client: 'MisterGreen Electric',
    category: 'Branding · Platform',
    headline: 'Driving Sustainable Mobility',
    description: `A comprehensive branding solution for the Netherlands' leading electric vehicle leasing company. As Lead Software Engineer and Designer, I crafted a distinctive logo, color scheme, and typography that resonated with the eco-conscious ethos of the brand.

The visual identity blends a modern aesthetic with a green narrative, paired with a full-stack web platform at mistergreen.nl. The branding now offers a cohesive identity across all touchpoints, promoting sustainable mobility solutions.`,
    coverImage: 'projects/mistergreen/cover.avif',
    gridSpan: 4,
    liveUrl: 'https://mistergreen.nl',
    tags: ['Branding', 'Web Platform', 'Design System'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/mistergreen/cover.avif', caption: 'MisterGreen Electric brand identity' },
      { type: 'image', src: 'projects/mistergreen/gallery-1.avif', caption: 'Complete branding system — logo, typography, color palette' },
      { type: 'pair', src: 'projects/mistergreen/gallery-3.avif', src2: 'projects/mistergreen/gallery-2.avif', caption: 'Platform design and component system' },
      { type: 'image', src: 'projects/mistergreen/gallery-4.avif', caption: 'Easter campaign — seasonal marketing activation' }
    ]
  },
  {
    id: 'focusdiamond',
    title: 'FocusDiamond',
    date: '2018-07-10',
    client: 'CTW Studio',
    category: 'Productivity',
    headline: 'A sharper focus timer than Pomodoro',
    description: `FocusDiamond is a 55-minute focus timer and productivity method built around deeper work blocks than traditional Pomodoro sessions. The method pairs longer concentration periods with short breaks, a procrastination capture list, and a deliberately opinionated daily structure.

The app was both a product experiment and a personal productivity manifesto: use pressure carefully, protect attention, write down distractions instead of following them, and end the day with visible progress. The dead production and private source links have been removed so the portfolio entry now stands on the actual product artifact instead of sending visitors into 404s.`,
    coverImage: 'projects/focusdiamond/cover.jpg',
    gridSpan: 3,
    liveUrl: null,
    tags: ['Web', 'Productivity', 'PWA', 'Focus'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/focusdiamond/cover.jpg', caption: 'FocusDiamond — 55-minute focus method' },
      { type: 'pair', src: 'projects/focusdiamond/session-screen.png', src2: 'projects/focusdiamond/app-flow.png', caption: 'Diamond session modes and in-app flow' },
      { type: 'pair', src: 'projects/focusdiamond/timer-interface.png', src2: 'projects/focusdiamond/comparison-table.png', caption: 'Timer interface and productivity-method comparison table' }
    ]
  },
  {
    id: 'pioneering-pwa',
    title: 'Pioneering PWAs with AR',
    date: '2017-07-13',
    client: 'Research Prototype',
    category: 'XR · Progressive Web',
    headline: 'Augmented reality in the browser, before it felt normal',
    description: `A 2017 Progressive Web App prototype exploring what the web could do when service workers, mobile installability, responsive layouts, and hardware access were still emerging ideas. The project used HTML, React, CSS, and AR.js to demonstrate one codebase running across desktop, tablet, and mobile.

The point was not only technical feasibility; it was product imagination. The prototype treated the browser as an app platform with offline access, touch-first interaction, and augmented-reality scenes that could run without a native install.`,
    coverImage: 'projects/pioneering-pwa/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    tags: ['PWA', 'AR.js', 'ReactJS', 'XR', 'Prototype'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/pioneering-pwa/cover.avif', caption: 'Progressive Web App with AR capabilities' },
      { type: 'image', src: 'projects/pioneering-pwa/ar-demo.avif', caption: 'AR.js prototype screen' },
      { type: 'image', src: 'projects/pioneering-pwa/mobile-flow.png', caption: 'Responsive PWA flow across mobile screens' }
    ]
  },
  {
    id: 'illustrated-portfolio',
    title: 'Illustrated Portfolio',
    date: '2014-01-01',
    client: 'CTW Studio',
    category: 'Design · Portfolio',
    headline: 'The messy, illustrated archive before the studio became a system',
    description: `An illustrated portfolio collecting the early body of work up to 2014: web design, native app interfaces, UX concepts, visual systems, and freelance/client experiments. It is intentionally more raw than the current studio site — a snapshot of the craft before the process became more mature and product-led.

This entry now links to the original PDF archive so the piece has a concrete artifact, not just a single image. It shows the longer arc: interface design, illustration, product thinking, and the gradual shift from visual execution toward full-stack product building.`,
    coverImage: 'projects/illustrated-portfolio/cover.avif',
    gridSpan: 1,
    liveUrl: null,
    pdfUrl: 'projects/illustrated-portfolio/Illustrated_Portfolio_UX_Jesus_Garcia_en_2014.pdf',
    tags: ['Web', 'Design', 'Native App', 'UX Archive'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/illustrated-portfolio/cover.avif', caption: 'Illustrated portfolio collection' },
      { type: 'image', src: 'projects/illustrated-portfolio/archive-preview.jpg', caption: 'Preview of the original illustrated UX portfolio PDF archive' }
    ]
  },
  {
    id: 'leaplearn',
    title: 'LeapLearn',
    date: '2013-07-11',
    client: 'Research Project',
    category: 'Gesture Recognition',
    headline: 'Teaching computers new gestures in 3D',
    description: `LeapLearn is a gesture-recognition application built around Leap Motion. Users can program new three-dimensional hand gestures by example, connect them to system actions, and customize interaction patterns without writing low-level recognition code.

The project explored End User Development and Programming by Example before natural interaction became mainstream. A modified $1 recognition algorithm powered the gesture interpretation, while the interface focused on making 3D input understandable enough for people to train and reuse their own gestures.`,
    coverImage: 'projects/leaplearn/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://ctwhome.github.io/leaplearn.github.io/',
    repoUrl: 'https://github.com/ctwhome/leaplearn',
    pdfUrl: 'projects/leaplearn/leaplearn_garcia_gonzalez.pdf',
    tags: ['3D Visualization', 'Three.js', 'Leap Motion', 'Gesture', 'EUD'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/leaplearn/cover.avif', caption: 'LeapLearn gesture recognition interface' },
      { type: 'image', src: 'projects/leaplearn/foreground.webp', caption: 'LeapLearn interaction flow and 3D gesture-training interface' }
    ]
  }
];
