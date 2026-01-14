# Project Walkthrough & Explanation Guide

This guide breaks down the development of the Map Drawing Application into logical steps. You can use this to explain the project to others or recreate it from scratch.

## 1. Project Initialization & Architecture
**Goal**: Setup a modern, type-safe environment.

- **Choice of Stack**:
  - **Framework**: Use **Vite + React + TypeScript** for speed and type safety.
  - **Styling**: **Tailwind CSS** for rapid, utility-first styling without writing custom CSS files.
  - **Icons**: **Lucide React** for consistent UI icons.
  - **State**: **Zustand** because it's simpler than Redux for this scale.
  - **Map**: **React-Leaflet** (wrapper around Leaflet) + **Turf.js** (for math/geometry).

**Steps**:
1. Scaffold project: `npm create vite@latest my-app -- --template react-ts`
2. Install deps: `npm install leaflet react-leaflet @turf/turf zustand tailwindcss ...`
3. Configure Tailwind (v4 or v3) in `src/index.css`.

---

## 2. Defining the Data Model (Types)
**Goal**: Agree on what a "Feature" looks like.

We define a robust structure in `src/types/index.ts`.
- **`ShapeType`**: enum ('polygon', 'circle', 'rectangle', 'linestring').
- **`DrawnFeature`**: The core object containing:
  - `id`: unique string (UUID).
  - `geometry`: GeoJSON geometry (Point, Polygon, LineString).
  - `properties`: Metadata (like radius for circles, which GeoJSON polygons don't strictly have).

**Why?** Good typing prevents 90% of bugs later.

---

## 3. State Management (Zustand)
**Goal**: A single source of truth for the app.

We create a store in `src/store/useStore.ts`.
- **State**:
  - `features`: Array of `DrawnFeature`.
  - `selectedTool`: What is the user actively drawing?
  - `limits`: Configuration for max shapes.
- **Actions**: `addFeature`, `removeFeature`, `setSelectedTool`.

**Why?** This lets the Sidebar (UI) and the Map (Canvas) talk to each other without messy prop drilling.

---

## 4. The Geometry Engine (Turf.js)
**Goal**: Handle the "Math" of spatial constraints.

This is the most complex part, located in `src/utils/geoUtils.ts`.

**Key Concepts**:
- **Trimming**: If Shape A overlaps Shape B, we want `Shape A - Shape B`.
- **Enclosure**: If Shape A is inside Shape B, or Shape B is inside Shape A, we BLOCK it.

**The `validateFeature` Function**:
1. Iterate through all existing features.
2. Check **Boolean Contains**:
   - `turf.booleanContains(existing, new)` -> New is inside Old? -> Error.
   - `turf.booleanContains(new, existing)` -> Old is inside New? -> Error.
3. Check **Intersection**:
   - `turf.intersect(new, existing)` determines if they touch/overlap.
   - If they do, use `turf.difference(new, existing)` to cut away the overlapping part.
   - Update the geometry of the "New" shape to be this cut version.

---

## 5. Map Interaction (DrawManager)
**Goal**: Capture user clicks and convert them into geometry.

The `DrawManager.tsx` component is an invisible layer on the map.
- **Events**: Uses `useMapEvents` to listen for `click`, `mousemove`, `dblclick`.
- **Logic**:
  - **Click 1**: Start drawing (save point A).
  - **Mouse Move**: Update user preview (drag effect).
  - **Click 2** (for Circle/Rect) or **DBL Click** (for Poly/Line): Finish drawing.
- **Conversion**:
  - Converts raw Leaflet `LatLng` points into GeoJSON via Turf.
  - E.g., A Circle is converted to a Polygon with 64 sides (`turf.circle`).
- **Validation Call**: Before adding to store, calls `validateFeature`. If valid, adds to store.

---

## 6. Rendering & UI
**Goal**: Show the data to the user.

- **FeatureRenderer**:
  - Subscribes to `features` from the store.
  - Maps them to `<GeoJSON />` components.
  - Adds a `<Popup />` for deletion.
- **Sidebar**:
  - A comprehensive UI to switch tools.
  - Toggles `selectedTool` in the store.
  - Export button: standard JavaScript `JSON.stringify` + `Blob` to download file.

---

## 7. Polishing
**Goal**: Make it feel professional.

- **Glassmorphism**: Added backdrop-blur to Sidebar.
- **Cursors**: Changed cursor to 'crosshair' when drawing (standard Leaflet behavior or CSS).
- **Notifications**: Standard `alert` used for simplicity, but could be Toast notifications.

---

## Summary for Presentation
1. **Setup**: "We built a React app."
2. **State**: "We used a centralized store for our shapes."
3. **Logic**: "We used Turf.js to handle the complex math of overlaps and collisions."
4. **Interaction**: "We built a custom drawing manager to handle user clicks."
5. **Result**: "A robust, verifiable spatial drawing tool."
