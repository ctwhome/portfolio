---
published: true
title: Data Storytelling
description: An AI-powered platform that transforms research software into compelling narratives. Built with SvelteKit, Three.js, and Google Gemini, it features interactive 3D domain exploration and audience-specific story generation.
date: 2025-12-22
coverImage: images/cover.avif
displayCover: true
tags:
  - AI
  - Three.js
  - Svelte
  - LLM
  - Data Visualization
  - Research Software
categories:
  - Project
  - Research Project
---

# AI-Powered Data Storytelling for Research Software

<a href="https://nlesc.github.io/data-storytelling/" target="_blank" class="btn btn-primary my-3">Open application</a>

Research software often struggles to find its audience. The code works, the science is solid, but communicating its value to different stakeholders remains a challenge. Scientists need technical depth, communications teams need accessible narratives, and leadership needs concise impact summaries. Writing all these versions manually is time-consuming and often gets deprioritized.

This project tackles that problem directly. It's an interactive platform that combines 3D visualization with AI-powered story generation, transforming research software metadata into tailored narratives for different audiences. The goal: make complex research accessible, impactful, and memorable.

## The Challenge

Research Software Engineers (RSEs) produce valuable tools that advance scientific discovery. But these tools need different stories for different people. A funding body wants to know about impact metrics. A journalist wants a human-interest angle. A fellow researcher wants methodological details. Writing each of these manually takes time that could be spent on actual research.

The Research Software Directory (RSD) at the Netherlands eScience Center contains metadata for hundreds of projects. Rich information exists, but it sits in structured formats that don't translate easily into compelling narratives.

## The Solution

The platform pulls project data from the RSD API and presents it through an immersive 3D interface organized by research domain. Users explore projects visually, then generate AI-powered stories tailored to their specific audience needs.

![3D domain exploration interface](./images/3d-exploration.avif)

## Interactive 3D Domain Exploration

The landing experience uses Three.js via Threlte to create distinct visual metaphors for each research domain:

**Life Sciences** renders an animated DNA double helix with orbiting molecular particles. The four base pair colors create an immediately recognizable biological context.

**Environmental Sustainability** displays a wireframe globe surrounded by atmospheric particles. Temperature-based color gradients shift from cool blues to warm reds, visualizing climate data patterns.

**Social Sciences & Humanities** presents a network graph with clustered nodes and flowing connections, representing the interdisciplinary nature of social research.

**Natural Sciences & Engineering** simulates particle physics interactions with dynamic node connections and energy-based visual effects.

Each domain hosts floating project cards that users can click to explore further. The scroll-based navigation provides smooth transitions between sections, with dynamic camera movement responding to user interaction.


## AI Story Generation

The core feature transforms project metadata into polished narratives using Google Gemini. Four audience types address common communication needs:

| Audience | Purpose | Output |
|----------|---------|--------|
| **Communications** | Public outreach, media | 800-1200 word impact-focused narrative |
| **Academic** | Research papers, proposals | 1500-2000 word methodology-rigorous analysis |
| **Internal Review** | Leadership briefings | 1000-1500 word metrics-driven summary |
| **One Pager** | Executive summaries | Under 300 word scannable overview |

Each audience type uses specialized prompts that guide the AI toward appropriate tone, vocabulary, and structure. The communications version emphasizes storytelling and accessibility. The academic version prioritizes methodology and citations. The internal review focuses on metrics and strategic alignment.

![Story generation interface with audience selection](./images/story-generator.avif)

## Context Enrichment

Raw project metadata only tells part of the story. The platform offers two ways to enrich the AI's context:

**Related Software**: The system fetches software from the same research domain and displays direct relationships from the RSD database. Users select relevant projects to include, helping the AI draw connections and highlight ecosystem value.

**Document Upload**: Users can upload PDFs or text files containing additional context like research papers, reports, or documentation. The extracted text feeds directly into the story generation prompt.

This contextual enrichment produces more nuanced, accurate narratives than metadata alone could support.

![Related software selector and file upload](./images/context-enrichment.avif)

## Real-Time Streaming

Story generation uses server-sent events to stream responses in real-time. Users see text appearing progressively rather than waiting for a complete response. This provides immediate feedback and makes the generation process feel responsive even for longer outputs.

## Export Options

Generated stories can be exported in multiple formats:

- **Markdown** with YAML frontmatter containing metadata (timestamp, audience type, project name)
- **PDF** via browser print dialog with professional styling
- **Clipboard** for quick copy-paste into other tools

File naming includes the project name, audience type, and date for easy organization.

## Technical Architecture

The stack prioritizes performance and simplicity:

- **SvelteKit** with Svelte 5 runes for reactive state management
- **Threlte** (Three.js for Svelte) powering the 3D visualizations
- **TailwindCSS** for styling with glassmorphism UI patterns
- **Google Gemini API** for story generation with multiple model options
- **Static deployment** on GitHub Pages with zero server costs

All API calls happen client-side. Users provide their own Gemini API key, stored locally in the browser. No backend infrastructure needed.

```
RSD API → Project Data → 3D Visualization
                              ↓
                        Project Modal
                              ↓
              Context (related software + uploads)
                              ↓
                      Gemini API (streaming)
                              ↓
                    Generated Story → Export
```

## Settings and Customization

A settings panel allows users to configure:

- Gemini API key
- Default audience type
- Model selection (Gemini 2.0 Flash, 2.5 Flash, 3 Flash Preview, 1.5 Pro)
- Temperature (creativity level)
- Maximum token output
- Custom prompts per audience type

Settings persist in localStorage, so preferences carry across sessions.

## Project Search

A search interface filters projects by name and description. Keyboard navigation (arrow keys, enter, escape) makes finding specific projects fast. Selected projects open directly in the detail modal.

![Project search interface](./images/search.avif)

## Why This Matters

Research communication shouldn't be an afterthought. Good storytelling amplifies scientific impact. It helps:

- **Funding bodies** understand return on investment
- **Journalists** find accessible angles for public communication
- **Fellow researchers** discover relevant tools
- **Leadership** make informed strategic decisions

By automating the initial draft, researchers can focus on refinement rather than starting from blank pages. The AI handles structure and tone; humans ensure accuracy and add personal insight.

## Open Source

The entire codebase is available for the research community to use and adapt.

<a href="https://github.com/NLeSC/data-storytelling" target="_blank" class="btn btn-secondary my-3">View Repository</a>

This project is part of the Netherlands eScience Center's Tech Focus Project 2025, exploring how AI and visualization can enhance research software communication. The combination of immersive 3D exploration and intelligent story generation demonstrates that complex research tools deserve compelling narratives, and that creating them doesn't have to be a manual burden.
