---
published: true
title: PLAN-EO
description: A practical geospatial visualization solution using COGTIFF, MapLibre, and Svelte. Static deployment on GitHub Pages eliminates server costs while maintaining performance and scalability for academic research.
date: 2025-10-15
coverImage: images/cover.avif
displayCover: true
tags:
  - GIS
  - MapLibre
  - Svelte
  - COGTIFF
  - Geospatial
categories:
  - Project
  - Research Project
---

# Geospatial Data Visualization with COGTIFF, MapLibre, and Svelte

Geospatial data visualization in academic research faces a constant challenge: building efficient, scalable solutions with limited budgets. Earlier iterations of this project considered private, server-dependent mapping solutions. They offered robust functionality but came with significant complexity and costs. The project initially used Shiny R to render maps, which worked well for vector data (points, lines) but struggled with raster datasets like satellite imagery or elevation models. The result was slow performance and poor integration between data types.

Traditional geospatial visualization comes with trade-offs. Private solutions offer features but lock you into expensive infrastructure and proprietary systems. Shiny R is popular in academic workflows, but it struggled here. It handled vector data well enough, but adding large raster datasets proved cumbersome. Maps either loaded slowly or couldn't properly integrate raster and vector layers together.

The requirements were straightforward: handle both data types efficiently, scale with demand, keep costs minimal, and remain accessible to the research community. COGTIFF files, MapLibre, and Svelte turned out to be the answer.

**Cloud Optimized GeoTIFF (COGTIFF)** is a web-optimized format where files are tiled for efficient streaming. Browsers can request only the specific tiles they need for the current view, which drastically reduces data transfer. **MapLibre**, an open-source WebGL mapping library, renders these raster datasets alongside vector points efficiently. **Svelte** provides the UI layer with minimal overhead since it compiles to vanilla JavaScript.

![Architecture diagram showing the static deployment stack](./images/architecture.avif)

The entire application runs as a static site hosted on **GitHub Pages**, which means zero server costs and simple deployment. No backend, no compute instances, just static files served directly to browsers.

Academic budgets are tight. By deploying statically on GitHub Pages, there's no need for dedicated servers, cloud instances, or proprietary platforms. COGTIFF files are accessed directly by browsers without backend processing. The result is a high-performance mapping application at essentially zero cost.

COGTIFF's tiled structure means only the relevant portions of a dataset are fetched, keeping bandwidth low and load times fast even for massive files. MapLibre's WebGL rendering handles both raster layers and vector overlays smoothly. Svelte keeps the UI responsive regardless of how many users access the map. Whether it's a single researcher or a classroom of students, the performance stays consistent.

This approach aligns with the **FAIR principles** (Findable, Accessible, Interoperable, Reusable) for research data. The app is findable and accessible through a GitHub Pages URL. Data stored in the open COGTIFF standard works with various tools and platforms. The entire stack is open-source, so anyone can fork the repository and adapt it. It's designed to be reused and built upon by the research community.

Earlier versions used a Dockerized setup with TiTiler for dynamic tiling. While TiTiler is powerful, it added unnecessary complexity here. COGTIFF files already have built-in tiling, and MapLibre can render them directly in the browser. Removing the server-side tiling step simplified the architecture without losing functionality. Svelte's small footprint keeps the app fast and maintainable with no runtime overhead.

Geospatial tools often come with high costs, which limits their use in research settings. This approach provides advanced functionality without the price tag. Researchers spend more time analyzing data instead of managing infrastructure. Academic institutions get a practical blueprint for implementing powerful geospatial tools.

The dashboard includes an LLM-powered agent that lets users query filtered geospatial data using natural language. Instead of manually exploring datasets, researchers can ask questions and get insights directly from the data they've filtered on the map. This makes the platform more accessible to users who may not be familiar with traditional GIS query tools.

![LLM agent interface for querying filtered geospatial data](./images/agent.avif)

The code is available in the [app folder of the repository](https://github.com/MINE-DD/dashboard/tree/main/app). I moved away from Docker Compose and TiTiler to a simpler static deployment that's easier to maintain. The repository is open for anyone to fork and adapt for their own geospatial projects.

This project evolved from considering private solutions and Shiny R to finding a more efficient path with COGTIFF, MapLibre, and Svelte. The goal was to build something practical, accessible, and maintainable for academic research. The result shows that advanced geospatial tools don't require expensive infrastructure or complex server setups.
