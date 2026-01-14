import React, { useState, useEffect, useCallback } from 'react';
import { useMapEvents, Circle, Rectangle, Polygon, Polyline } from 'react-leaflet';
import type { LatLng } from 'leaflet';
import { useStore } from '../../store/useStore';
import * as turf from '@turf/turf';
import { validateFeature, getCirclePolygon, createFeature } from '../../utils/geoUtils';

export const DrawManager: React.FC = () => {
    const { selectedTool, addFeature, features, limits } = useStore();

    const [points, setPoints] = useState<LatLng[]>([]);
    const [currentMousePos, setCurrentMousePos] = useState<LatLng | null>(null);

    const resetDraw = useCallback(() => {
        setPoints([]);
        setCurrentMousePos(null);
    }, []);

    useEffect(() => {
        resetDraw();
    }, [selectedTool, resetDraw]);

    const handleFinishDraw = async () => {
        if (!selectedTool) return;

        let geometry: any = null;
        let options: any = {};

        // 1. Construct Geometry based on points & tool
        if (selectedTool === 'circle' && points.length === 1 && currentMousePos) {
            const center = points[0];
            const dist = center.distanceTo(currentMousePos);
            geometry = getCirclePolygon([center.lng, center.lat], dist).geometry;
            options.radius = dist;
        } else if (selectedTool === 'rectangle' && points.length === 1 && currentMousePos) {
            const b1 = points[0];
            const b2 = currentMousePos;
            const bbox = [
                Math.min(b1.lng, b2.lng),
                Math.min(b1.lat, b2.lat),
                Math.max(b1.lng, b2.lng),
                Math.max(b1.lat, b2.lat)
            ];
            geometry = turf.bboxPolygon(bbox as any).geometry;
        } else if (selectedTool === 'polygon' && points.length >= 3) {
            const coords = points.map(p => [p.lng, p.lat]);
            coords.push(coords[0]); // Close ring
            geometry = turf.polygon([coords]).geometry;
        } else if (selectedTool === 'linestring' && points.length >= 2) {
            const coords = points.map(p => [p.lng, p.lat]);
            geometry = turf.lineString(coords).geometry;
        }

        if (!geometry) return;

        // 2. Validate Constraints
        const currentCount = features.filter(f => f.type === selectedTool).length;
        if (currentCount >= limits[selectedTool]) {
            alert(`Limit reached for ${selectedTool}. Max is ${limits[selectedTool]}.`);
            resetDraw();
            return;
        }

        if (selectedTool !== 'linestring') {
            const validation = validateFeature({ type: 'Feature', properties: {}, geometry }, features);
            if (!validation.isValid) {
                alert(validation.error);
                resetDraw();
                return;
            } else if (validation.trimmedGeometry) {
                geometry = validation.trimmedGeometry;
            }
        }

        const newFeature = createFeature(selectedTool, geometry, options);
        addFeature(newFeature);
        resetDraw();
    };

    useMapEvents({
        click: (e) => {
            if (!selectedTool) return;

            const newPoint = e.latlng;

            if (selectedTool === 'circle' || selectedTool === 'rectangle') {
                if (points.length === 0) {
                    setPoints([newPoint]);
                } else {
                    // Finish
                    // We need to trigger finish with the *current* state.
                    // Since we can't reliably call handleFinishDraw with fresh state here without refs or effects, 
                    // we'll rely on the fact that if points.length is 1, next click is finish.
                    // BUT handleFinishDraw uses `currentMousePos` which tracks mousemove.
                    // On click, `currentMousePos` is where we clicked.
                    // So we can assume `currentMousePos` matches `e.latlng` roughly.
                    // However, better to just call it.
                    // We rely on 'currentMousePos' state being up to date.
                    handleFinishDraw();
                }
            } else if (selectedTool === 'polygon' || selectedTool === 'linestring') {
                setPoints(prev => [...prev, newPoint]);
            }
        },
        mousemove: (e) => {
            if (!selectedTool) return;
            setCurrentMousePos(e.latlng);
        },
        dblclick: (e) => {
            if (selectedTool === 'polygon' || selectedTool === 'linestring') {
                e.originalEvent.stopPropagation();
                handleFinishDraw();
            }
        }
    });

    if (!selectedTool || points.length === 0 || !currentMousePos) return null;

    return (
        <>
            {selectedTool === 'circle' && (
                <Circle
                    center={points[0]}
                    radius={points[0].distanceTo(currentMousePos)}
                    pathOptions={{ color: 'blue', dashArray: '5, 5' }}
                />
            )}
            {selectedTool === 'rectangle' && (
                <Rectangle
                    bounds={[[points[0].lat, points[0].lng], [currentMousePos.lat, currentMousePos.lng]]}
                    pathOptions={{ color: 'blue', dashArray: '5, 5' }}
                />
            )}
            {selectedTool === 'polygon' && (
                <>
                    <Polygon positions={[...points, currentMousePos]} pathOptions={{ color: 'blue', dashArray: '5, 5' }} />
                    {points.map((p, i) => <Circle key={i} center={p} radius={3} pathOptions={{ color: 'blue' }} />)}
                </>
            )}
            {selectedTool === 'linestring' && (
                <Polyline positions={[...points, currentMousePos]} pathOptions={{ color: 'blue', dashArray: '5, 5' }} />
            )}
        </>
    );
};
