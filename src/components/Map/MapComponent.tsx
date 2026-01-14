import React, { useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DrawManager } from './DrawManager';
import { FeatureRenderer } from './FeatureRenderer';
import { useStore } from '../../store/useStore';

export const MapComponent: React.FC = () => {
    const { removeFeature } = useStore();

    // Listen for custom delete event from Popups (Leaflet popups are outside React tree context usually, so this is a hacky but effective bridge)
    useEffect(() => {
        const handler = (e: any) => {
            removeFeature(e.detail);
        };
        document.addEventListener('deleteFeature', handler);
        return () => document.removeEventListener('deleteFeature', handler);
    }, [removeFeature]);

    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            className="w-full h-full relative"
            zoomControl={false} // We can add custom one or use standard at specific position
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />

            <FeatureRenderer />
            <DrawManager />
        </MapContainer>
    );
};
