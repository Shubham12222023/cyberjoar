import React from 'react';
import { GeoJSON, Popup } from 'react-leaflet';
import { useStore } from '../../store/useStore';
import { Trash2 } from 'lucide-react';

export const FeatureRenderer: React.FC = () => {
    const { features, removeFeature } = useStore();

    return (
        <>
            {features.map((feature) => (
                <GeoJSON
                    key={feature.id}
                    data={feature.geometry}
                    style={() => ({
                        color: feature.type === 'linestring' ? '#FF5722' : '#3B82F6',
                        weight: 3,
                        fillOpacity: 0.4
                    })}
                >
                    <Popup>
                        <div className="p-1 min-w-[150px]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-700 uppercase text-xs">{feature.type}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                                ID: {feature.id.slice(0, 8)}...
                            </div>
                            {feature.properties.radius && (
                                <div className="text-xs text-gray-500 mb-2">
                                    Radius: {(feature.properties.radius as number).toFixed(2)}m
                                </div>
                            )}
                            <button
                                onClick={() => removeFeature(feature.id)}
                                className="flex items-center gap-1 w-full justify-center bg-red-50 text-red-600 hover:bg-red-100 p-1.5 rounded transition-colors text-xs font-semibold"
                            >
                                <Trash2 size={12} /> Delete Feature
                            </button>
                        </div>
                    </Popup>
                </GeoJSON>
            ))}
        </>
    );
};
