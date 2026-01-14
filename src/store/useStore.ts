import { create } from 'zustand';
import type { AppState, DrawnFeature, ShapeType } from '../types';

export const useStore = create<AppState>((set) => ({
    features: [],
    selectedTool: null,
    limits: {
        polygon: 10,
        rectangle: 10,
        circle: 10,
        linestring: 10,
    },
    addFeature: (feature: DrawnFeature) =>
        set((state) => ({ features: [...state.features, feature] })),
    removeFeature: (id: string) =>
        set((state) => ({ features: state.features.filter((f) => f.id !== id) })),
    setSelectedTool: (tool: ShapeType | null) => set({ selectedTool: tool }),
    updateLimits: (limits: Record<ShapeType, number>) => set({ limits }),
}));
