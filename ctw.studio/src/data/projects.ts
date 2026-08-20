export type GalleryItem =
  | { type: 'image'; src: string; caption?: string; width?: number; height?: number }
  | { type: 'video'; src: string; poster?: string; caption?: string; width?: number; height?: number }
  | { type: 'pair'; src: string; src2: string; caption?: string };

export interface Project {
  id: string;
  title: string;
  date: string;
  client: string;
  category: string;
  headline: string;
  description: string;
  coverImage: string;
  gridSpan: number;
  liveUrl: string | null;
  repoUrl?: string;
  pdfUrl?: string;
  tags: string[];
  institution: string | null;
  gallery: GalleryItem[];
}

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
    id: 'droneatlas',
    title: 'DroneAtlas',
    date: '2026-06-13',
    client: 'Netherlands eScience Center · University of Amsterdam',
    category: 'Geospatial ML · Research software',
    headline: 'Five drone layers over one archaeological site',
    description: `DroneAtlas brings RGB, thermal, multispectral, LiDAR, and elevation layers into one browser map. A team from the Netherlands eScience Center and the University of Amsterdam's 4D Research Lab developed it for archaeological research, with a workflow that can be reused for other drone datasets.

Cloud Optimized GeoTIFFs load in the browser for layered map inspection. Machine-learning-supported anomaly exploration can draw attention to unusual areas, while expert labels remain interpretation rather than automated truth. A dedicated 2D/3D presentation route and static deployment keep the maps easy to share.`,
    coverImage: 'projects/droneatlas/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://droneml.github.io/DroneAtlas/',
    repoUrl: 'https://github.com/DroneML/DroneAtlas',
    tags: ['SvelteKit', 'MapLibre', 'Cloud Optimized GeoTIFF', 'Machine Learning', '3D Visualization'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/droneatlas/cover.avif', caption: 'RGB, thermal, multispectral, LiDAR, and elevation layers aligned over Weesp' },
      { type: 'image', src: 'projects/droneatlas/gallery-1.avif', caption: 'Netherlands case-location overview with 3D drone' },
      { type: 'image', src: 'projects/droneatlas/gallery-2.avif', caption: '2D/3D Weesp map with stacked drone layers and layer controls' }
    ]
  },
  {
    id: 'ajax-visual-intelligence',
    title: 'Visual Intelligence Profile',
    date: '2026-03-07',
    client: 'AFC Ajax · Team Rockstars IT',
    category: 'Sports Analytics · 3D Visualization',
    headline: '3D match playback with player-level viewing metrics',
    description: `Visual Intelligence Profile is an award-winning Ajax Hackathon project. A multidisciplinary team built it in 14 hours at Johan Cruijff ArenA. The prototype reconstructs Ajax vs Fortuna Sittard TF15 tracking as a 22-player 3D scene, using 21 skeleton joints per player at 25fps.

The prototype measures head-to-ball angle, scan rate, and fixation. Those metrics describe viewing behavior, not awareness itself. Live playback, a POV camera, a shared timeline, and player comparisons keep each measurement tied to the moment it came from.`,
    coverImage: 'projects/ajax-visual-intelligence/cover.avif',
    gridSpan: 2,
    liveUrl: null,
    repoUrl: 'https://github.com/El-Machin-Team/football-body-kinematics',
    tags: ['Three.js', 'Python', 'Bun', 'Sports Analytics', '3D Tracking'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/ajax-visual-intelligence/cover.avif', caption: '3D match playback with 22 tracked players and metric panels', width: 1600, height: 1000 },
      { type: 'video', src: 'projects/ajax-visual-intelligence/demo.mp4', poster: 'projects/ajax-visual-intelligence/video-poster.avif', caption: 'Thirty-second walkthrough of 3D match playback and player metrics', width: 1920, height: 1080 },
      { type: 'image', src: 'projects/ajax-visual-intelligence/gallery-1.avif', caption: 'Player comparison charts for head-to-ball angle, scan rate, and fixation', width: 1600, height: 1000 },
      { type: 'image', src: 'projects/ajax-visual-intelligence/gallery-2.avif', caption: 'Pitch playback with player POV and shared timeline', width: 1600, height: 1000 }
    ]
  },
  {
    id: 'data-storytelling',
    title: 'Data Storytelling',
    date: '2025-12-22',
    client: 'Netherlands eScience Center',
    category: 'AI · Research Communication',
    headline: 'Four ways to read one research software record',
    description: `Data Storytelling reads project metadata from the Research Software Directory and presents it in four audience modes: communications, academic, leadership, and quick overview. Projects can also be browsed as cards in a Threlte 3D field.

After an audience mode is selected, Google Gemini streams a narrative from the project record. SvelteKit and Threlte, Three.js for Svelte, keep the source metadata, 3D browsing, and generated text in one browser experience.`,
    coverImage: 'projects/data-storytelling/cover.avif',
    gridSpan: 4,
    liveUrl: 'https://nlesc.github.io/data-storytelling/',
    repoUrl: 'https://github.com/NLeSC/data-storytelling',
    tags: ['AI', 'Three.js', 'SvelteKit', 'Gemini', 'LLM'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/data-storytelling/cover.avif', caption: 'Animated project field behind the Data Storytelling title screen' },
      { type: 'image', src: 'projects/data-storytelling/gallery-1.avif', caption: 'Research software cards arranged in 3D by scientific domain' },
      { type: 'pair', src: 'projects/data-storytelling/gallery-2.avif', src2: 'projects/data-storytelling/gallery-3.avif', caption: 'Audience-mode controls beside generated narrative and source selection' },
      { type: 'image', src: 'projects/data-storytelling/gallery-4.avif', caption: 'Searching “via” across Research Software Directory projects' }
    ]
  },
  {
    id: 'nlesc-portfolio',
    title: 'NLeSC Portfolio',
    date: '2025-12-01',
    client: 'Netherlands eScience Center',
    category: 'Research website',
    headline: 'A browsable catalogue of research software projects',
    description: `NLeSC Portfolio is a public catalogue of Netherlands eScience Center projects, designed for editorial browsing. Project cards and filters make it easy to move through the work and open fuller project stories.

Each story links back to its people, software, and research. Lightweight authoring lets teams add material without taking on a heavy content management process.`,
    coverImage: 'projects/nlesc-portfolio/cover.avif',
    gridSpan: 3,
    liveUrl: '/nlesc/',
    tags: ['Next.js', 'React', 'WebGL', 'Portfolio'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/nlesc-portfolio/cover.avif', caption: 'Netherlands eScience Center portfolio identity and landing screen' },
      { type: 'image', src: 'projects/nlesc-portfolio/live-site.jpg', caption: 'Oversized NLeSC letterforms on the orange landing screen' }
    ]
  },
  {
    id: 'plan-eo',
    title: 'PlanEO',
    date: '2025-10-15',
    client: 'Netherlands eScience Center',
    category: 'Geospatial',
    headline: 'Earth-observation COGs on a static browser map',
    description: `PlanEO is a static browser map for Earth-observation data stored as Cloud Optimized GeoTIFFs. MapLibre and Svelte render the files without a custom geospatial backend.

A natural-language agent works beside the map controls, giving researchers another way to query the loaded data. The deployment remains static while COGs provide the map layers directly.`,
    coverImage: 'projects/plan-eo/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    tags: ['GIS', 'MapLibre', 'Svelte', 'COGTIFF', 'AI Agent'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/plan-eo/cover.avif', caption: 'Global COG map with dataset filters and layer controls' },
      { type: 'pair', src: 'projects/plan-eo/gallery-1.avif', src2: 'projects/plan-eo/gallery-2.avif', caption: 'Map-layer architecture beside the MINE-DD epidemiological data assistant' }
    ]
  },
  {
    id: 'collaite',
    title: 'COLLaiTE',
    date: '2025-01-01',
    client: 'Huygens Institute (KNAW)',
    category: 'Textual Scholarship',
    headline: 'Manuscript variants, aligned side by side',
    description: `COLLaiTE is the research project behind Collens, a web tool for scholars comparing annotated textual variants. It supports TEI/XML texts, side-by-side comparison, annotation-aware alignment, and offline research sessions.

Machine-learning assistance stays inside the reading flow. Scholars drag documents in, compare variants, inspect their alignment, and keep annotations visible while they read.`,
    coverImage: 'projects/collaite/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    repoUrl: 'https://github.com/collaite/collens',
    tags: ['ML', 'Digital Humanities', 'SvelteKit', 'NLP'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/collaite/cover.avif', caption: 'Blueprint-style cover for the Collens comparison tool' },
      { type: 'video', src: 'projects/collaite/drag.mp4', caption: 'Dragging two TEI/XML documents into side-by-side comparison' },
      { type: 'image', src: 'projects/collaite/gallery-1.avif', caption: 'Side-by-side manuscript variant analysis' }
    ]
  },
  {
    id: 'smartplay',
    title: 'SmartPlay',
    date: '2024-10-06',
    client: 'Netherlands eScience Center',
    category: 'Wearable Research',
    headline: 'Recording play on a Wear OS watch',
    description: `SmartPlay is a Wear OS research app for studying children's play. It records real-time GPS, motion, heart-rate, and environmental signals alongside input entered by the children themselves.

The watch keeps participant input brief and glanceable. Data stays on the device and can be extracted offline for privacy-conscious fieldwork.`,
    coverImage: 'projects/smartplay/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    repoUrl: 'https://github.com/ctwhome/SmartPlay',
    tags: ['WearOS', 'Android', 'Research', 'Child Development', 'Sensors'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/smartplay/cover.avif', caption: 'SmartPlay wordmark beside the Wear OS watch' },
      { type: 'image', src: 'projects/smartplay/dashboard.jpg', caption: 'Research dashboard for reviewing activity and play-behavior data' },
      { type: 'pair', src: 'projects/smartplay/workflow.jpg', src2: 'projects/smartplay/sensors.jpg', caption: 'Participant setup sequence beside GPS, heart-rate, motion, and environmental sensors' },
      { type: 'image', src: 'projects/smartplay/dashboard.gif', caption: 'Sensor traces and activity summaries across a recorded day' }
    ]
  },
  {
    id: 'faivor',
    title: 'FAIVOR',
    date: '2024-01-01',
    client: 'Netherlands eScience Center',
    category: 'Healthcare AI',
    headline: 'Validation records for healthcare AI',
    description: `FAIVOR is a FAIR validation platform for medical machine-learning systems. It supports documented validation workflows with provenance, protocols, model outputs, and explainability material for reviewers.`,
    coverImage: 'projects/faivor/cover.jpg',
    gridSpan: 1,
    liveUrl: 'https://research-software-directory.org/projects/faivor',
    tags: ['ML', 'FAIR', 'Healthcare', 'Validation', 'MLOps'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/faivor/cover.jpg', caption: 'FAIVOR project page in the Research Software Directory' },
      { type: 'image', src: 'projects/faivor/details.jpg', caption: 'FAIVOR description, keywords, partners, and software metadata' }
    ]
  },
  {
    id: 'ruisdael-observatory',
    title: 'Ruisdael Observatory',
    date: '2023-11-29',
    client: 'TU Delft · KNMI',
    category: 'Climate Science',
    headline: 'Browser playback for clouds and atmospheric volumes',
    description: `This browser viewer, created with the Ruisdael Observatory at TU Delft, renders measured cloud points and DALES simulation output as 3D volumes.

Compressed Zarr data feeds timeline playback, a map, and cloud-point inspection. Researchers can move through changes in the boundary layer without leaving the browser.`,
    coverImage: 'projects/ruisdael-observatory/cover.avif',
    gridSpan: 4,
    liveUrl: null,
    repoUrl: 'https://github.com/NLeSC/zarrviz',
    tags: ['Three.js', 'WebGL', 'Zarr', 'Climate Science'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/ruisdael-observatory/cover.avif', caption: 'Volumetric cloud rendering in the browser' },
      { type: 'image', src: 'projects/ruisdael-observatory/gallery-1.avif', caption: 'Cloud-radar reference images from the Ruisdael Observatory' },
      { type: 'pair', src: 'projects/ruisdael-observatory/gallery-2.avif', src2: 'projects/ruisdael-observatory/gallery-3.avif', caption: 'Two diagrams of the cloud-point processing pipeline' },
      { type: 'image', src: 'projects/ruisdael-observatory/gallery-4.avif', caption: 'Rastered map tilted inside the 3D cloud scene' }
    ]
  },
  {
    id: 'carbon-budget-explorer',
    title: 'Carbon Budget Explorer',
    date: '2023-10-12',
    client: 'PBL Netherlands',
    category: 'Climate Policy · Design',
    headline: 'Climate pathways, budgets, and uncertainty side by side',
    description: `Carbon Budget Explorer helps policymakers compare climate pathways, remaining carbon budgets, scenario assumptions, and uncertainty. The redesign keeps those differences visible while making navigation and comparisons easier to follow.

Work covered a new logotype, clearer navigation, side-by-side comparison views, and a tighter information hierarchy.`,
    coverImage: 'projects/carbon-budget-explorer/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    repoUrl: 'https://github.com/pbl-nl/website-carbon-budget-explorer',
    tags: ['UI/UX Design', 'Climate Policy', 'Data Visualization'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/carbon-budget-explorer/cover.avif', caption: 'Globe-and-leaf logotype with the stacked Carbon Budget Explorer wordmark' },
      { type: 'image', src: 'projects/carbon-budget-explorer/gallery-1.avif', caption: 'Legacy and revised screens arranged for side-by-side review' },
      { type: 'image', src: 'projects/carbon-budget-explorer/gallery-2.avif', caption: 'Horizontal globe-and-leaf mark on the dark blue identity field' }
    ]
  },
  {
    id: 'notidian',
    title: 'Notidian',
    date: '2023-01-01',
    client: 'CTW Studio',
    category: 'Productivity',
    headline: 'Notes, drawings, and media in folders you own',
    description: `Notidian is a local-first workspace in development for notes, documents, drawings, and media. It is built around user-owned files, fast local interaction, private sync, and a canvas/editor intended to extend into diagrams, presentations, and multimedia work.`,
    coverImage: 'projects/notidian/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://notidian.com',
    tags: ['SvelteKit', 'Tauri', 'Local-first', 'PKM', 'WebGPU'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/notidian/cover.avif', caption: 'Notidian wordmark on a grainy orange field' },
      { type: 'image', src: 'projects/notidian/live-site.jpg', caption: 'Download and browser options on the Notidian product page' }
    ]
  },
  {
    id: 'ideasdiamond',
    title: 'IdeasDiamond',
    date: '2023-01-01',
    client: 'CTW Studio',
    category: 'Creativity Tool',
    headline: 'Visual idea cards for private and public spaces',
    description: `IdeasDiamond organizes ideas as visual cards inside named spaces and categories. People can keep an organization private, invite feedback, or publish selected collections on public pages.

Each space can be customized with its own name, imagery, and structure. The same card format works for personal collections and organization pages.`,
    coverImage: 'projects/ideasdiamond/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://ideasdiamond.com',
    tags: ['SvelteKit', 'Creativity', 'Productivity', 'Community'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/ideasdiamond/cover.avif', caption: 'IdeasDiamond mark over an illustrated yellow cloudscape' },
      { type: 'image', src: 'projects/ideasdiamond/live-site.jpg', caption: 'Public idea feed with category navigation and card previews' },
      { type: 'pair', src: 'projects/ideasdiamond/all-apps.png', src2: 'projects/ideasdiamond/private-organizations.png', caption: 'Community idea feed beside private-organization setup' },
      { type: 'image', src: 'projects/ideasdiamond/make-it-yours.gif', caption: 'Customizing an IdeasDiamond workspace' }
    ]
  },
  {
    id: 'via-appia',
    title: 'Via Appia',
    date: '2022-01-01',
    client: 'Het Valkhof Museum',
    category: 'Digital Humanities',
    headline: 'The Appian Way in point clouds',
    description: `Via Appia is a 3D point-cloud view of the Roman Appian Way for desktop, mobile, and VR. Presented at Het Valkhof Museum in Nijmegen, it connects viewpoints and story pages to years of academic and artistic research.

NuxtJS, ThreeJS, and PotreeJS render the scans. A Git-based content management system supplies the point views and story content.`,
    coverImage: 'projects/via-appia/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://via-appia.netlify.app/',
    repoUrl: 'https://github.com/Via-Appia/via-appia-online-viewer',
    tags: ['3D Visualization', 'VR', 'Point Cloud', 'WebGL'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'video', src: 'projects/via-appia/intro.mp4', caption: 'Camera path through the Sepolcri in Laterizio point cloud' },
      { type: 'image', src: 'projects/via-appia/cover.avif', caption: 'Point cloud visualization of the Appian Way' },
      { type: 'image', src: 'projects/via-appia/gallery-1.avif', caption: 'Historical photos matched with modern photographs' },
      { type: 'pair', src: 'projects/via-appia/gallery-2.avif', src2: 'projects/via-appia/gallery-4.avif', caption: 'Point-cloud sources and Git-managed story content feeding the viewer' },
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
    headline: 'Clinical scans and AI overlays in a desktop viewer',
    description: `Eshmun is a standalone medical image analysis and annotation viewer built for the FEDMix research project: Fusible Evolutionary Deep Neural Network Mixture Learning. The application gives researchers a cross-platform desktop environment for loading clinical scans, inspecting model output, and drawing or reviewing anatomical regions directly on top of medical image slices.

I worked on the research-software product layer, building the clinical imaging flow as a C++/Qt/VTK application for macOS, Windows, and Linux. Researchers can inspect grayscale scans, review color overlays, edit contours, and compare panels before deciding what to make of an experimental model output.`,
    coverImage: 'projects/fedmix-clinical-viewer/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    repoUrl: 'https://github.com/FEDMix/eshmun',
    tags: ['C++', 'Qt', 'VTK', 'Medical Imaging', 'AI Validation'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/fedmix-clinical-viewer/cover.avif', caption: 'Clinical image slice with contour annotations and model-output overlays' },
      { type: 'image', src: 'projects/fedmix-clinical-viewer/overview.jpg', caption: 'Eshmun start screen for opening scans and selecting deformed images' },
      { type: 'pair', src: 'projects/fedmix-clinical-viewer/gallery-1.jpg', src2: 'projects/fedmix-clinical-viewer/gallery-2.jpg', caption: 'Application screens for reviewing medical images and segmentation overlays' },
      { type: 'image', src: 'projects/fedmix-clinical-viewer/gallery-3.jpg', caption: 'Difference view comparing an annotated slice with the deformed image' }
    ]
  },
  {
    id: 'nl-rse',
    title: 'NL-RSE Website',
    date: '2021-06-10',
    client: 'NL-RSE Community',
    category: 'Community website',
    headline: 'A website for Dutch research software engineers',
    description: `Redesigned with Lieke de Boer and the NL-RSE community, this website brings events, resources, community updates, and the RSE feed into a clear editorial structure.

NuxtJS and Nuxt Content generate the static site. Reusable content patterns keep volunteer updates manageable, while custom animations give each section its own pace.`,
    coverImage: 'projects/nl-rse/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://nl-rse.org',
    repoUrl: 'https://github.com/nl-rse/nl-rse.github.io',
    tags: ['NuxtJS', 'Community', 'Web Design', 'Static Site'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/nl-rse/cover.avif', caption: 'NL-RSE tulip mark and Research Software Engineers wordmark' },
      { type: 'image', src: 'projects/nl-rse/live-site.jpg', caption: 'Homepage with community invitation, event card, and RSE feed' },
      { type: 'pair', src: 'projects/nl-rse/design-system.jpg', src2: 'projects/nl-rse/community-page.png', caption: 'Finished NL-RSE page designs beside early website-structure sketches' },
      { type: 'image', src: 'projects/nl-rse/cover-alt.jpg', caption: 'Alternate NL-RSE wordmark on a muted plum field' }
    ]
  },
  {
    id: 'receipt',
    title: 'Receipt',
    date: '2020-10-08',
    client: 'Horizon 2020 EU',
    category: 'Climate Visualization',
    headline: 'Climate storylines built for stakeholder discussion',
    description: `The EU Horizon 2020 RECEIPT project uses climate storylines to explain risks, impacts, and adaptation challenges to stakeholders. Connected scenes combine maps, 3D visuals, explanatory panels, and supporting resources.

I developed the UI from scratch. Scene continuity preserves place and story position as people move between those materials, so a discussion can follow the storyline without losing its thread.`,
    coverImage: 'projects/receipt/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    tags: ['3D Visualization', 'Climate Change', 'Web', 'Research'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/receipt/cover.avif', caption: 'Receipt Stories UI board with welcome, agriculture, and drought screens' },
      { type: 'image', src: 'projects/receipt/image-2.avif', caption: 'Agriculture overview with manifestation and storyline cards' },
      { type: 'pair', src: 'projects/receipt/image-3.png', src2: 'projects/receipt/image-4.png', caption: 'Agriculture summary and storyline cards moving from overview to detail' },
      { type: 'pair', src: 'projects/receipt/image-5.png', src2: 'projects/receipt/image-7.png', caption: 'Project timeline beside the map client and provider diagram' },
      { type: 'image', src: 'projects/receipt/image-8.png', caption: 'RECEIPT globe illustration and project colour palette' }
    ]
  },
  {
    id: 'mistergreen',
    title: 'MisterGreen',
    date: '2019-10-09',
    client: 'MisterGreen Electric',
    category: 'Branding · Web product',
    headline: 'Brand and website for electric leasing',
    description: `As Lead Software Engineer and Designer, I created MisterGreen Electric's logo, palette, typography, and design system, then built those decisions into mistergreen.nl.`,
    coverImage: 'projects/mistergreen/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://mistergreen.nl',
    tags: ['Branding', 'Web Platform', 'Design System'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/mistergreen/cover.avif', caption: 'Blue Tesla and “Build the future of electric lease” campaign graphic' },
      { type: 'image', src: 'projects/mistergreen/gallery-1.avif', caption: 'Logo, type, palette, web screens, and staff clothing on the brand sheet' },
      { type: 'pair', src: 'projects/mistergreen/gallery-3.avif', src2: 'projects/mistergreen/gallery-2.avif', caption: 'Electric-lease hero graphic beside branded staff shirts' },
      { type: 'image', src: 'projects/mistergreen/gallery-4.avif', caption: 'Red electric car emerging from a painted green egg' }
    ]
  },
  {
    id: 'focusdiamond',
    title: 'FocusDiamond',
    date: '2018-07-10',
    client: 'CTW Studio',
    category: 'Productivity',
    headline: 'Focus in 55-minute blocks',
    description: `FocusDiamond pairs 55-minute work blocks with short breaks, a distraction capture list, and a fixed daily structure.

During a session, a capture list holds distractions for later. Named block patterns show focused time and breaks before work starts.`,
    coverImage: 'projects/focusdiamond/cover.jpg',
    gridSpan: 3,
    liveUrl: null,
    tags: ['Web', 'Productivity', 'PWA', 'Focus'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/focusdiamond/cover.jpg', caption: 'Diamond Productivity Method cover with a faceted blue diamond' },
      { type: 'pair', src: 'projects/focusdiamond/session-screen.png', src2: 'projects/focusdiamond/app-flow.png', caption: 'Three diamond modes beside the “made of carbon” campaign line' },
      { type: 'pair', src: 'projects/focusdiamond/timer-interface.png', src2: 'projects/focusdiamond/comparison-table.png', caption: 'Session timers beside the two-to-four-session comparison table' }
    ]
  },
  {
    id: 'pioneering-pwa',
    title: 'Pioneering PWAs with AR',
    date: '2017-07-13',
    client: 'Research Prototype',
    category: 'XR · Progressive Web App',
    headline: 'Augmented reality in a 2017 browser app',
    description: `This 2017 Progressive Web App prototype uses service workers, mobile installability, responsive layouts, and hardware access. HTML, React, CSS, and AR.js keep desktop, tablet, and mobile on one codebase.

The browser app works offline, installs on a device, and opens augmented-reality scenes without a native app.`,
    coverImage: 'projects/pioneering-pwa/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    tags: ['PWA', 'AR.js', 'ReactJS', 'XR', 'Prototype'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/pioneering-pwa/cover.avif', caption: 'Mobile browser switching between a marker image and an AR.js scene' },
      { type: 'image', src: 'projects/pioneering-pwa/ar-demo.avif', caption: 'AR.js marker and rendered tower shown on two phones' },
      { type: 'image', src: 'projects/pioneering-pwa/mobile-flow.png', caption: 'Responsive PWA flow across mobile screens' }
    ]
  },
  {
    id: 'illustrated-portfolio',
    title: 'Illustrated Portfolio',
    date: '2014-01-01',
    client: 'CTW Studio',
    category: 'Design · Portfolio',
    headline: 'Early interface work, collected in one PDF',
    description: `Illustrated Portfolio collects early work through 2014: web design, native app interfaces, UX concepts, visual systems, and freelance and client experiments.

The original PDF preserves the raw illustrated archive as it was assembled at the time.`,
    coverImage: 'projects/illustrated-portfolio/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    pdfUrl: 'projects/illustrated-portfolio/Illustrated_Portfolio_UX_Jesus_Garcia_en_2014.pdf',
    tags: ['Web', 'Design', 'Native App', 'UX Archive'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/illustrated-portfolio/cover.avif', caption: 'Geometric JG monogram on the Front-end and User Experience Engineer cover' },
      { type: 'image', src: 'projects/illustrated-portfolio/archive-preview.jpg', caption: 'Preview of the original illustrated UX portfolio PDF archive' }
    ]
  },
  {
    id: 'leaplearn',
    title: 'LeapLearn',
    date: '2013-07-11',
    client: 'Research Project',
    category: 'Gesture Recognition',
    headline: 'Teaching new 3D gestures by example',
    description: `LeapLearn uses Leap Motion to let people train three-dimensional hand gestures, connect them to system actions, and reuse them without writing low-level recognition code.

The design applies End User Development and Programming by Example. A modified $1 recognizer interprets each gesture while the screens show the recorded 3D motion for review.`,
    coverImage: 'projects/leaplearn/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://ctwhome.github.io/leaplearn.github.io/',
    repoUrl: 'https://github.com/ctwhome/leaplearn',
    pdfUrl: 'projects/leaplearn/leaplearn_garcia_gonzalez.pdf',
    tags: ['3D Visualization', 'Three.js', 'Leap Motion', 'Gesture', 'EUD'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/leaplearn/cover.avif', caption: 'Gesture set, training state, and recorded 3D hand paths' },
      { type: 'image', src: 'projects/leaplearn/foreground.webp', caption: 'Leap Motion project page showing gesture examples and training screens' }
    ]
  }
] satisfies readonly Project[];
