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
    blogUrl: 'https://ctwux.medium.com/639cc6664dc2',
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
    headline: 'Showcasing Research Impact',
    description: `Interactive portfolio platform empowering researchers through innovative, open, and sustainable research software. A showcase of the Netherlands eScience Center's projects, people, and impact.`,
    coverImage: 'projects/nlesc-portfolio/cover.avif',
    gridSpan: 1,
    liveUrl: 'https://nlesc.ctwhome.com/',
    tags: ['SvelteKit', 'Research', 'Portfolio'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/nlesc-portfolio/cover.avif', caption: 'Netherlands eScience Center portfolio' }
    ]
  },
  {
    id: 'plan-eo',
    title: 'PlanEO',
    date: '2025-10-15',
    client: 'Netherlands eScience Center',
    category: 'Geospatial',
    headline: 'Earth Observation Made Practical',
    description: `A practical geospatial visualization solution using Cloud Optimized GeoTIFF (COGTIFF), MapLibre, and Svelte. Static deployment on GitHub Pages eliminates server costs while maintaining performance for academic research.

The platform includes an LLM-powered agent for natural language queries and follows FAIR principles for data accessibility.`,
    coverImage: 'projects/plan-eo/cover.avif',
    gridSpan: 3,
    liveUrl: null,
    tags: ['GIS', 'MapLibre', 'Svelte', 'COGTIFF'],
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
    headline: 'Machine Learning Meets Manuscripts',
    description: `Collens is a dynamic web-based tool designed for scholars to compare textual variants with annotations. Using machine learning, it offers an efficient workflow for analyzing multiple versions of literary and scholarly documents.

The tool supports TEI/XML-encoded texts, side-by-side variant comparison, annotation-aware alignment, and offline-first storage via IndexedDB. Built with SvelteKit, TypeScript, and TailwindCSS.`,
    coverImage: 'projects/collaite/cover.avif',
    gridSpan: 1,
    liveUrl: 'https://collaite.github.io/collens',
    repoUrl: 'https://github.com/collaite/collens',
    tags: ['ML', 'Digital Humanities', 'SvelteKit', 'NLP'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/collaite/cover.avif', caption: 'Collens — Intelligent text comparison' },
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
    headline: 'Understanding Play Through Wearables',
    description: `SmartPlay is an Android Wear OS application designed for children to measure and understand play behaviors by collecting real-time data using advanced wearable technology. In collaboration with developmental psychology and human-media interaction experts, this project bridges life sciences and social sciences.

The app provides researchers with a rich dataset comprising both objective sensor data and subjective input from the children themselves, addressing the challenge of capturing the nuances of play behavior and its impact on emotional, social, and physical development.`,
    coverImage: 'projects/smartplay/cover.avif',
    gridSpan: 1,
    liveUrl: null,
    repoUrl: 'https://github.com/ctwhome/SmartPlay',
    tags: ['WearOS', 'Android', 'Research', 'Child Development'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/smartplay/cover.avif', caption: 'SmartPlay WearOS application' }
    ]
  },
  {
    id: 'faivor',
    title: 'FAIVOR',
    date: '2024-01-01',
    client: 'Netherlands eScience Center',
    category: 'Healthcare AI',
    headline: 'Fair and Validated AI for Healthcare',
    description: `FAIR machine learning validation framework for healthcare applications. Ensuring AI models used in clinical contexts are responsible, reproducible, and explainable.

The project establishes validation protocols and governance frameworks for ML systems operating in sensitive healthcare environments.`,
    coverImage: null,
    gradientFrom: '#10b981',
    gradientTo: '#06b6d4',
    gridSpan: 1,
    liveUrl: 'https://research-software-directory.org/projects/faivor',
    tags: ['ML', 'FAIR', 'Healthcare', 'Validation'],
    institution: 'Netherlands eScience Center',
    gallery: []
  },
  {
    id: 'ruisdael-observatory',
    title: 'Ruisdael Observatory',
    date: '2023-11-29',
    client: 'TU Delft · KNMI',
    category: 'Climate Science',
    headline: 'Seeing the Atmosphere in Real Time',
    description: `A dynamic 3D volumetric rendering on the web for large data. Created in collaboration with the Ruisdael Observatory at TU Delft, pulling data from atmospheric instruments and processing it with DALES — a model that simulates atmospheric boundary layer physics.

The goal: an interactive platform to study time-lapses between measured cloud points, bringing atmospheric science to the browser. The rendering pipeline converts compressed Zarr data into interactive 3D volumes, with timeline playback for studying atmospheric evolution over time.`,
    coverImage: 'projects/ruisdael-observatory/cover.avif',
    gridSpan: 4,
    liveUrl: 'https://ruisdael.ctwhome.com',
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
    headline: 'Clarity for Climate Policy',
    description: `UI/UX redesign of the Carbon Budget Explorer, targeting policymakers who need to make sense of complex climate data. The challenge: simplify without losing scientific nuance.

The redesign introduced a new logotype, simplified information architecture, and improved visual hierarchy — making the tool accessible to non-technical stakeholders while preserving data integrity.`,
    coverImage: 'projects/carbon-budget-explorer/cover.avif',
    gridSpan: 4,
    liveUrl: null,
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
    headline: 'Your Daily Knowledge Companion',
    description: `Personal knowledge management and daily journaling application. A modern note-taking tool designed for researchers and knowledge workers who need structure without friction.

Built with SvelteKit, featuring local-first storage, markdown editing, and daily reflection prompts.`,
    coverImage: 'projects/notidian/cover.avif',
    gridSpan: 3,
    liveUrl: 'https://notidian.com',
    tags: ['SvelteKit', 'PKM', 'Productivity'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/notidian/cover.avif', caption: 'Notidian — daily knowledge management' }
    ]
  },
  {
    id: 'ideasdiamond',
    title: 'IdeasDiamond',
    date: '2023-01-01',
    client: 'CTW Studio',
    category: 'Creativity Tool',
    headline: 'From Scattered Thoughts to Structured Plans',
    description: `Visual brainstorming and idea management platform. Transform scattered thoughts into structured, actionable plans through spatial thinking and visual organization.`,
    coverImage: 'projects/ideasdiamond/cover.avif',
    gridSpan: 1,
    liveUrl: 'https://ideasdiamond.com',
    tags: ['SvelteKit', 'Creativity', 'Productivity'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/ideasdiamond/cover.avif', caption: 'IdeasDiamond — visual brainstorming' }
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
    headline: 'Clinical Images, Annotated',
    description: `Eshmun is a standalone, robust medical image analysis tool developed with C++, Qt, and VTK. Part of the FEDMix project (Fusible Evolutionary Deep Neural Network Mixture Learning), it provides cross-platform clinical image annotation and analysis for Mac, Windows, and Linux.`,
    coverImage: 'projects/fedmix-clinical-viewer/cover.avif',
    gridSpan: 1,
    liveUrl: null,
    repoUrl: 'https://github.com/FEDMix/eshmun',
    tags: ['C++', 'Qt', 'VTK', 'Medical Imaging'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/fedmix-clinical-viewer/cover.avif', caption: 'Eshmun — medical image analysis' }
    ]
  },
  {
    id: 'nl-rse',
    title: 'NL-RSE Website',
    date: '2021-06-10',
    client: 'NL-RSE Community',
    category: 'Community Platform',
    headline: 'Connecting Research Software Engineers',
    description: `A complete structure and content redesign for the Netherlands Group of Research Software Engineers website. In collaboration with Lieke de Boer and the NL-RSE community, this portal provides a central hub for everything related to Research Software Engineers in the Netherlands.

Built with NuxtJS and Nuxt Content, featuring an RSE Feed, custom animations, and a performance-first experience. The site serves as the primary gateway for the Dutch research software engineering community.`,
    coverImage: 'projects/nl-rse/cover.avif',
    gridSpan: 1,
    liveUrl: 'https://nl-rse.org',
    tags: ['NuxtJS', 'Community', 'Web Design'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/nl-rse/cover.avif', caption: 'NL-RSE community website redesign' }
    ]
  },
  {
    id: 'receipt',
    title: 'Receipt',
    date: '2020-10-08',
    client: 'Horizon 2020 EU',
    category: 'Climate Visualization',
    headline: 'Climate Storylines for Action',
    description: `The "Climate Storylines" platform is dedicated to sharing insights on climate change through narrative approaches. It features storylines crafted to elucidate the impacts and challenges associated with climate change in a relatable manner.

Developed the UI from scratch with a focus on seamless user experience between scenes, the platform provides resources and a network for dialogue and engagement among stakeholders. Through its unique storytelling approach, it aims to foster understanding and prompt action towards a more sustainable future.`,
    coverImage: 'projects/receipt/cover.avif',
    gridSpan: 1,
    liveUrl: null,
    tags: ['3D Visualization', 'Climate Change', 'Web', 'Research'],
    institution: 'Netherlands eScience Center',
    gallery: [
      { type: 'image', src: 'projects/receipt/cover.avif', caption: 'Climate Storylines platform' }
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
    headline: 'The New Pomodoro Timer',
    description: `Diamond Productivity Method — a 55-minute focus timer designed to replace the traditional Pomodoro technique. Research suggests that 25-minute Pomodoro sessions are too short for deep work, while procrastination actually improves creativity.

FocusDiamond uses diamond-shaped timers of 55 minutes per session to boost productivity, helping users achieve and master their productivity routine.`,
    coverImage: null,
    gradientFrom: '#8b5cf6',
    gradientTo: '#ec4899',
    gridSpan: 1,
    liveUrl: 'https://focusdiamond.app/',
    repoUrl: 'https://github.com/ctwhome/pure-diamond-method',
    tags: ['Web', 'Productivity', 'PWA'],
    institution: null,
    gallery: []
  },
  {
    id: 'pioneering-pwa',
    title: 'Pioneering PWAs with AR',
    date: '2017-07-13',
    client: 'Research Prototype',
    category: 'XR · Progressive Web',
    headline: 'Augmented Reality in the Browser',
    description: `A groundbreaking Progressive Web App prototype that capitalized on the full potential of PWA technology when it was freshly introduced. A blend of cutting-edge tech and responsive design, this prototype showcased the enormous potential of PWAs.

Key highlights include a unified codebase using HTML, ReactJS, and CSS for all devices, augmented reality capabilities leveraging AR.js for mobile experiences, and full hardware and touch support ensuring a native app-like feel.`,
    coverImage: 'projects/pioneering-pwa/cover.avif',
    gridSpan: 1,
    liveUrl: null,
    tags: ['PWA', 'AR.js', 'ReactJS', 'XR'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/pioneering-pwa/cover.avif', caption: 'Progressive Web App with AR capabilities' }
    ]
  },
  {
    id: 'illustrated-portfolio',
    title: 'Illustrated Portfolio',
    date: '2014-01-01',
    client: 'CTW Studio',
    category: 'Design · Portfolio',
    headline: 'A Decade of Creative Work',
    description: `A comprehensive illustrated portfolio documenting projects and creative work up until 2014, spanning web design, native applications, and UX design across multiple industries and platforms.`,
    coverImage: 'projects/illustrated-portfolio/cover.avif',
    gridSpan: 1,
    liveUrl: null,
    tags: ['Web', 'Design', 'Native App'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/illustrated-portfolio/cover.avif', caption: 'Illustrated portfolio collection' }
    ]
  },
  {
    id: 'leaplearn',
    title: 'LeapLearn',
    date: '2013-07-11',
    client: 'Research Project',
    category: 'Gesture Recognition',
    headline: 'Programming Gestures in 3D',
    description: `An application focused on gesture recognition technology utilizing Leap Motion. It provides a platform where users can program and interpret new gestures in three dimensions, connecting them with various system actions.

The application supports customization of interaction experiences through End User Development techniques and Programming by Examples. Featuring an intuitive interface and a modified $1 recognition algorithm, LeapLearn offers precise hand gesture interpretation, representing a step towards personalized and natural user interaction.`,
    coverImage: 'projects/leaplearn/cover.avif',
    gridSpan: 1,
    liveUrl: null,
    tags: ['3D Visualization', 'Three.js', 'Leap Motion', 'Gesture'],
    institution: null,
    gallery: [
      { type: 'image', src: 'projects/leaplearn/cover.avif', caption: 'LeapLearn gesture recognition interface' }
    ]
  },
];
