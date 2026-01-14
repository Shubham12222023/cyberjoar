import type { Feature, Polygon, LineString, Point } from 'geojson';

export type ShapeType = 'polygon' | 'rectangle' | 'circle' | 'linestring';

export interface DrawnFeature {
    id: string;
    type: ShapeType;
    // For circles, we might store center + radius, but for GeoJSON consistency we use a Polygon approximation (mostly).
    // However, we can store metadata.
    geometry: Feature<Polygon | LineString | Point>['geometry'];
    properties: {
        radius?: number; // Only for circles
        createdAt: number;
        [key: string]: any;
    };
}

export interface AppState {
    features: DrawnFeature[];
    selectedTool: ShapeType | null;
    limits: Record<ShapeType, number>;
    addFeature: (feature: DrawnFeature) => void;
    removeFeature: (id: string) => void;
    setSelectedTool: (tool: ShapeType | null) => void;
    updateLimits: (limits: Record<ShapeType, number>) => void;
}
