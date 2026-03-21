import { useState, useMemo, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Navigation, Check, X, Star, List, ChevronDown
} from 'lucide-react';
import type { MapLocation } from '../data/mapData';
import { MAP_LOCATIONS, CATEGORIES, KRASNODAR_BOUNDS } from '../data/mapData';

interface MapExplorerProps {
  onBuildRoute: (locations: MapLocation[]) => void;
  onBack: () => void;
}

function MapBoundsController() {
  const map = useMap();
  
  useEffect(() => {
    map.setMaxBounds([
      [KRASNODAR_BOUNDS.minLat - 1, KRASNODAR_BOUNDS.minLng - 1],
      [KRASNODAR_BOUNDS.maxLat + 1, KRASNODAR_BOUNDS.maxLng + 1],
    ]);
    map.setView([44.9, 38.7], 8);
  }, [map]);
  
  return null;
}

function FullHeatMap({ selectedIds, allLocs }: { selectedIds: number[]; allLocs: MapLocation[] }) {
  const map = useMap();
  const [bounds, setBounds] = useState(map.getBounds());
  
  useMapEvents({
    moveend: () => setBounds(map.getBounds()),
    zoomend: () => setBounds(map.getBounds()),
  });
  
  useEffect(() => {
    const update = () => setBounds(map.getBounds());
    map.on('moveend', update);
    map.on('zoomend', update);
    update();
    return () => {
      map.off('moveend', update);
      map.off('zoomend', update);
    };
  }, [map]);
  
  const gridPoints = useMemo(() => {
    if (selectedIds.length === 0) return [];
    
    const selectedLocs = selectedIds
      .map(id => allLocs.find(l => l.id === id))
      .filter(Boolean) as MapLocation[];
    
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    
    const latStep = Math.max(0.02, (ne.lat - sw.lat) / 40);
    const lngStep = Math.max(0.02, (ne.lng - sw.lng) / 40);
    
    const points: Array<{ lat: number; lng: number; dist: number }> = [];
    
    for (let lat = sw.lat; lat <= ne.lat; lat += latStep) {
      for (let lng = sw.lng; lng <= ne.lng; lng += lngStep) {
        let minDist = Infinity;
        selectedLocs.forEach(sel => {
          const dist = Math.sqrt(
            Math.pow((lat - sel.lat) * 111, 2) + 
            Math.pow((lng - sel.lng) * 85, 2)
          );
          minDist = Math.min(minDist, dist);
        });
        points.push({ lat, lng, dist: minDist });
      }
    }
    
    return points;
  }, [selectedIds, allLocs, bounds]);
  
  if (selectedIds.length === 0) return null;
  
  return (
    <>
      {gridPoints.map((point, i) => {
        let color = '#ef4444';
        let opacity = 0.08;
        
        if (point.dist < 15) {
          color = '#15803d';
          opacity = 0.35;
        } else if (point.dist < 30) {
          color = '#16a34a';
          opacity = 0.30;
        } else if (point.dist < 50) {
          color = '#22c55e';
          opacity = 0.25;
        } else if (point.dist < 80) {
          color = '#84cc16';
          opacity = 0.20;
        } else if (point.dist < 120) {
          color = '#eab308';
          opacity = 0.15;
        } else if (point.dist < 180) {
          color = '#f97316';
          opacity = 0.10;
        } else {
          color = '#dc2626';
          opacity = 0.06;
        }
        
        return (
          <CircleMarker
            key={`heat-${i}`}
            center={[point.lat, point.lng]}
            radius={8}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: opacity,
              weight: 0,
            }}
            interactive={false}
          />
        );
      })}
    </>
  );
}

function SelectedPointGlow({ selectedIds, allLocs }: { selectedIds: number[]; allLocs: MapLocation[] }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  
  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });
  
  if (selectedIds.length === 0) return null;
  
  const baseRadius = Math.max(20, 50 - zoom * 2);
  
  return (
    <>
      {selectedIds.map(id => {
        const loc = allLocs.find(l => l.id === id);
        if (!loc) return null;
        
        return (
          <CircleMarker
            key={`glow-${loc.id}`}
            center={[loc.lat, loc.lng]}
            radius={baseRadius * 5}
            pathOptions={{
              color: '#16a34a',
              fillColor: '#16a34a',
              fillOpacity: 0.12,
              weight: 0,
            }}
            interactive={false}
          />
        );
      })}
    </>
  );
}

export function MapExplorer({ onBuildRoute, onBack }: MapExplorerProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [showList, setShowList] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredLocations = useMemo(() => {
    if (activeCategory === 'all') return MAP_LOCATIONS;
    return MAP_LOCATIONS.filter(loc => loc.category === activeCategory);
  }, [activeCategory]);

  const toggleLocation = useCallback((id: number) => {
    setSelectedLocations(prev =>
      prev.includes(id)
        ? prev.filter(l => l !== id)
        : [...prev, id]
    );
  }, []);

  const selectedLocObjects = useMemo(() =>
    selectedLocations.map(id => MAP_LOCATIONS.find(l => l.id === id)!).filter(Boolean),
    [selectedLocations]
  );

  const handleBuildRoute = () => {
    const route = selectedLocations
      .map(id => MAP_LOCATIONS.find(l => l.id === id)!)
      .filter(Boolean);
    onBuildRoute(route);
  };

  const getCategoryColor = (loc: MapLocation): string => {
    const cat = CATEGORIES.find(c => c.id === loc.category);
    return cat?.color || '#667eea';
  };

  return (
    <div className="fixed inset-0 bg-gray-100">
      <MapContainer
        center={[44.9, 38.7]}
        zoom={8}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        maxZoom={12}
        minZoom={7}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapBoundsController />
        
        <SelectedPointGlow selectedIds={selectedLocations} allLocs={MAP_LOCATIONS} />
        <FullHeatMap selectedIds={selectedLocations} allLocs={MAP_LOCATIONS} />

        {filteredLocations.map((loc) => {
          const isSelected = selectedLocations.includes(loc.id);
          const isHovered = hoveredId === loc.id;
          
          return (
            <CircleMarker
              key={loc.id}
              center={[loc.lat, loc.lng]}
              radius={isSelected ? 14 : isHovered ? 12 : 10}
              pathOptions={{
                color: '#ffffff',
                fillColor: isSelected ? '#16a34a' : getCategoryColor(loc),
                fillOpacity: isSelected ? 1 : isHovered ? 0.95 : 0.85,
                weight: isSelected || isHovered ? 3 : 2,
              }}
              eventHandlers={{
                mouseover: () => setHoveredId(loc.id),
                mouseout: () => setHoveredId(null),
                click: () => toggleLocation(loc.id),
              }}
            >
              <Popup className="custom-popup">
                <div className="min-w-[220px] p-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {CATEGORIES.find(c => c.id === loc.category)?.icon || '📍'}
                    </span>
                    <div>
                      <h3 className="font-black text-sm text-gray-900">{loc.title}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-gray-600 font-bold">{loc.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{loc.description}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLocation(loc.id); }}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isSelected ? (
                      <><X className="w-4 h-4" /> Убрать</>
                    ) : (
                      <><Check className="w-4 h-4" /> В маршрут</>
                    )}
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Top UI Panel - Light theme */}
      <div className="absolute top-0 left-0 right-0 z-[1000]">
        <div className="bg-gradient-to-b from-black/80 via-black/60 to-transparent p-4 pb-16">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-xl flex items-center justify-center shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-800" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-black text-white">Карта края</h1>
              <p className="text-white/70 text-xs font-bold">
                {MAP_LOCATIONS.length} мест • Выбрано: {selectedLocations.length}
              </p>
            </div>
            <button
              onClick={() => setShowList(!showList)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                showList ? 'bg-green-500' : 'bg-white/90 backdrop-blur-xl'
              }`}
            >
              <List className={`w-5 h-5 ${showList ? 'text-white' : 'text-gray-800'}`} />
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap shadow-md ${
                  activeCategory === cat.id
                    ? 'text-white shadow-lg'
                    : 'bg-white/90 text-gray-700 hover:bg-white'
                }`}
                style={
                  activeCategory === cat.id
                    ? { background: cat.color }
                    : undefined
                }
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected List Panel */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-24 left-4 right-4 z-[1000] max-h-[45vh] rounded-3xl overflow-hidden"
          >
            <div className="bg-white/95 backdrop-blur-2xl border border-gray-200 shadow-2xl h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-gray-900 text-lg">
                    Маршрут ({selectedLocations.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedLocations([])}
                      className="text-gray-500 text-sm font-bold hover:text-gray-700 px-3 py-1 rounded-full bg-gray-100"
                    >
                      Очистить
                    </button>
                    <button
                      onClick={() => setShowList(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {selectedLocObjects.length === 0 ? (
                  <p className="text-gray-400 text-center py-8 font-bold">
                    Нажмите на точку на карте
                  </p>
                ) : (
                  selectedLocObjects.map((loc, i) => (
                    <motion.div
                      key={loc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100"
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm"
                        style={{ background: '#16a34a' }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{loc.title}</p>
                        <p className="text-gray-500 text-xs">{loc.description}</p>
                      </div>
                      <button
                        onClick={() => toggleLocation(loc.id)}
                        className="p-1.5 hover:bg-gray-200 rounded-full"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heat Map Legend */}
      {selectedLocations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-24 right-4 z-[900] bg-white/95 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg border border-gray-200 hidden md:block"
        >
          <p className="text-gray-600 text-xs font-bold mb-2">Близость к выбранным:</p>
          <div className="space-y-1.5">
            {[
              { color: '#15803d', label: '< 15 км' },
              { color: '#16a34a', label: '15-30 км' },
              { color: '#22c55e', label: '30-50 км' },
              { color: '#84cc16', label: '50-80 км' },
              { color: '#eab308', label: '80-120 км' },
              { color: '#f97316', label: '120-180 км' },
              { color: '#dc2626', label: '> 180 км' },
            ].map(item => (
              <div key={item.color} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ background: item.color }}
                />
                <span className="text-gray-700 text-xs font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bottom Action Button */}
      {selectedLocations.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 left-4 right-4 z-[1000]"
        >
          <button
            onClick={handleBuildRoute}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Построить маршрут ({selectedLocations.length})
          </button>
        </motion.div>
      )}

      {/* Hint when nothing selected */}
      {selectedLocations.length === 0 && (
        <div className="absolute bottom-6 left-4 right-4 z-[900]">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl px-6 py-3 text-center shadow-lg border border-gray-200">
            <p className="text-gray-700 font-bold text-sm">
              Нажмите на точку на карте, чтобы добавить в маршрут
            </p>
          </div>
        </div>
      )}

      {/* Custom Popup Styles */}
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px;
        }
        .leaflet-control-attribution {
          background: rgba(255,255,255,0.8) !important;
          border-radius: 8px !important;
          padding: 2px 6px !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: #666 !important;
        }
      `}</style>
    </div>
  );
}
