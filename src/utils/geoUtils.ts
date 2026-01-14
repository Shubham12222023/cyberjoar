import * as turf from '@turf/turf';
import type { Feature, Polygon, LineString, Position, MultiPolygon } from 'geojson';
import { v4 as uuidv4 } from 'uuid';
import type { DrawnFeature, ShapeType } from '../types';

export const createFeature = (
    type: ShapeType,
    geometry: Feature<Polygon | LineString>['geometry'],
    options: any = {}
): DrawnFeature => {
    return {
        id: uuidv4(),
        type,
        geometry,
        properties: {
            createdAt: Date.now(),
            ...options,
        },
    };
};

export const validateFeature = (
    newFeature: Feature<Polygon | MultiPolygon>,
    existingFeatures: DrawnFeature[]
): { isValid: boolean; error?: string; trimmedGeometry?: Feature<Polygon | MultiPolygon>['geometry'] } => {

    const existingPolys = existingFeatures.filter(
        (f) => f.type !== 'linestring'
    ) as DrawnFeature[];

    let currentGeometry = newFeature.geometry;

    for (const existing of existingPolys) {
        const existingGeom = existing.geometry as Polygon | MultiPolygon;

        // Check if new fully encloses existing
        const newIsInsideOld = turf.booleanContains(existingGeom, currentGeometry);
        if (newIsInsideOld) {
            return { isValid: false, error: 'New shape is fully inside an existing shape.' };
        }

        const oldIsInsideNew = turf.booleanContains(currentGeometry, existingGeom);
        if (oldIsInsideNew) {
            return { isValid: false, error: 'New shape fully encloses an existing shape.' };
        }

        // Check Overlap
        // Turf 7: intersect takes FeatureCollection
        const overlap = turf.intersect(turf.featureCollection([
            turf.feature(currentGeometry),
            turf.feature(existingGeom)
        ]));

        if (overlap) {
            // Logic: Subtract existing from New
            // Turf 7: difference takes FeatureCollection
            const diff = turf.difference(turf.featureCollection([
                turf.feature(currentGeometry),
                turf.feature(existingGeom)
            ]));

            if (!diff) {
                return { isValid: false, error: 'Shape is fully overlapping.' };
            }

            currentGeometry = diff.geometry as Polygon | MultiPolygon;
        }
    }

    return { isValid: true, trimmedGeometry: currentGeometry };
};

export const getCirclePolygon = (center: Position, radiusInMeters: number): Feature<Polygon> => {
    return turf.circle(center, radiusInMeters / 1000, { steps: 64, units: 'kilometers' });
};
