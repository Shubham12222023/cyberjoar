import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { ShapeType } from '../../types';
import {
    Circle,
    Square,
    Hexagon,
    Activity,
    Download,
    Settings,
    MousePointer2
} from 'lucide-react';
import { cn } from '../../lib/utils';

const ToolButton: React.FC<{
    tool: ShapeType | null;
    current: ShapeType | null;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}> = ({ tool, current, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-2 w-full p-3 rounded-lg transition-all duration-200",
            current === tool
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-white text-gray-700 hover:bg-gray-100 hover:text-blue-600 border border-gray-200"
        )}
        title={label}
    >
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </button>
);

export const Sidebar: React.FC = () => {
    const { selectedTool, setSelectedTool, features, limits, updateLimits } = useStore();
    const [showConfig, setShowConfig] = useState(false);

    const handleExport = () => {
        const data = {
            type: "FeatureCollection",
            features: features.map(f => ({
                type: "Feature",
                id: f.id,
                geometry: f.geometry,
                properties: f.properties
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `map-features-${Date.now()}.geojson`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-4 w-64">
            {/* Main Toolbar */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 space-y-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                    NeoMap Draw
                </h1>

                <div className="space-y-2">
                    <ToolButton
                        tool={null}
                        current={selectedTool}
                        onClick={() => setSelectedTool(null)}
                        icon={<MousePointer2 size={18} />}
                        label="Select / Pan"
                    />
                    <ToolButton
                        tool="polygon"
                        current={selectedTool}
                        onClick={() => setSelectedTool('polygon')}
                        icon={<Hexagon size={18} />}
                        label="Polygon"
                    />
                    <ToolButton
                        tool="rectangle"
                        current={selectedTool}
                        onClick={() => setSelectedTool('rectangle')}
                        icon={<Square size={18} />}
                        label="Rectangle"
                    />
                    <ToolButton
                        tool="circle"
                        current={selectedTool}
                        onClick={() => setSelectedTool('circle')}
                        icon={<Circle size={18} />}
                        label="Circle"
                    />
                    <ToolButton
                        tool="linestring"
                        current={selectedTool}
                        onClick={() => setSelectedTool('linestring')}
                        icon={<Activity size={18} />}
                        label="Line String"
                    />
                </div>

                <div className="pt-4 border-t border-gray-100 mt-2 space-y-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center justify-center gap-2 w-full p-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium shadow-md"
                    >
                        <Download size={18} /> Export GeoJSON
                    </button>

                    <button
                        onClick={() => setShowConfig(!showConfig)}
                        className="flex items-center justify-center gap-2 w-full p-2 text-gray-500 hover:text-gray-800 text-sm"
                    >
                        <Settings size={16} /> {showConfig ? 'Hide Config' : 'Configure Limits'}
                    </button>
                </div>
            </div>

            {/* Configuration Panel */}
            {showConfig && (
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 animate-in slide-in-from-left-2 duration-200">
                    <h3 className="font-semibold text-gray-700 mb-3">Shape Limits</h3>
                    <div className="space-y-3">
                        {(Object.keys(limits) as ShapeType[]).map(type => (
                            <div key={type} className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500 uppercase font-bold">{type}</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={limits[type]}
                                    onChange={(e) => updateLimits({ ...limits, [type]: parseInt(e.target.value) || 0 })}
                                    className="p-2 border rounded text-sm bg-white/50 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats Card */}
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/50">
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Total Features:</span>
                    <span className="font-bold text-gray-900">{features.length}</span>
                </div>
            </div>
        </div>
    );
};
