# NeoMap Draw

A modern React application for drawing and managing spatial features on an OpenStreetMap layer.
This application enforces strict spatial constraints (non-overlapping polygons) and allows exporting data to GeoJSON.

## Features

- **Map Rendering**: OpenStreetMap tiles via Leaflet.
- **Drawing Tools**: Draw Circles, Rectangles, Polygons, and LineStrings.
- **Constraints Management**:
  - **Non-overlapping**: New polygons that overlap existing ones are automatically trimmed.
  - **Enclosure Prevention**: Shapes cannot be drawn fully inside existing ones, and vice versa.
  - **LineStrings Exception**: LineStrings can freely cross other shapes.
- **Dynamic Configuration**: Adjustable limits for the number of shapes per type.
- **Export**: Download all drawn features as a valid GeoJSON FeatureCollection.

## Technologies

- **Frontend**: React 18+, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **Map Library**: Leaflet, React-Leaflet
- **Spatial Logic**: Turf.js
- **State Management**: Zustand

## Setup & Run

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd task
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

The application uses **Turf.js** for spatial analysis.

### Overlap Handling
When a user finishes drawing a generic polygon (Polygon, Rectangle, or Circle):
1. **Validation**: The new shape is checked against all existing polygonal features.
2. **Enclosure Check**:
   - If `turf.booleanContains(existing, new)` is true, the new shape is rejected (blocked).
   - If `turf.booleanContains(new, existing)` is true, the new shape is rejected (blocked).
3. **Intersection & Trimming**:
   - If `turf.intersect(new, existing)` is found, we calculate the difference using `turf.difference(new, existing)`.
   - The result becomes the new geometry.
   - This process repeats for all overlapping existing shapes.
   - If at any point the geometry disappears (fully covered), the shape is rejected.

### Circles & Rectangles
- **Circles** are approximated as Geodesic Polygons using `turf.circle`. They are stored as Polygons in the GeoJSON but tagged with a `radius` property.
- **Rectangles** are converted to Polygons defined by their bounding box.

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
        "radius": 500.23  // Present if it was drawn as a circle
      }
    }
  ]
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
