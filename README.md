# NeoMap Draw

A React + TypeScript based web application that renders OpenStreetMap tiles and allows users to draw and manage geometrical features such as Polygon, Rectangle, Circle, and Line String.

The application enforces non-overlapping rules for polygonal shapes and supports exporting all drawn features as GeoJSON.

---

## Features

- OpenStreetMap free tile rendering
- Draw Polygon, Rectangle, Circle, and Line String
- Non-overlapping constraint for polygonal shapes
- Auto-trimming of partially overlapping polygons
- Blocking of fully enclosed polygons with error feedback
- GeoJSON export of all drawn features
- Configurable limits for each shape type

---

## Tech Stack

- React.js
- TypeScript
- Vite
- OpenStreetMap
- Turf.js
- Tailwind CSS

---

## Setup & Run Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Shubham12222023/cyberjoar.git
   ```


2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Geometric Logic Explanation

The non-overlapping rule is applied only to polygonal features such as Polygon, Rectangle, and Circle.
When a new polygon is drawn, the system checks for intersection with existing polygonal features.
If a partial overlap is detected, the overlapping area is automatically trimmed and only the valid geometry is rendered.
If a new polygon fully encloses an existing polygon, the action is blocked and an error message is shown.
Line Strings are excluded from overlap constraints and are allowed to cross or overlap freely.

## Sample GeoJSON Export

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "uuid-string",
      "geometry": {
        "type": "Polygon",
        "coordinates": [...]
      },
      "properties": {
        "createdAt": 1715428800000,
        "radius": 500.23
      }
    }
  ]
}
```
> `radius` property is present only for circle geometries.

## Live Demo
https://cyberjoar-map.netlify.app/
