import { useState, useMemo, useEffect } from 'react';
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

function HeatZones({ selectedIds, allLocs }: { selectedIds: number[]; allLocs: MapLocation[] }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  
  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });
  
  if (selectedIds.length === 0) return null;
  
  const selectedLocs = selectedIds.map(id => allLocs.find(l => l.id === id)!);
  
  const allOtherLocs = allLocs.filter(l => !selectedIds.includes(l.id));
  
  const zones: Array<{ loc: MapLocation; dist: number }> = allOtherLocs.map(loc => {
    let minDist = Infinity;
    selectedLocs.forEach(sel => {
      if (!sel) return;
      const dist = Math.sqrt(
        Math.pow((loc.lat - sel.lat) * 111, 2) + 
        Math.pow((loc.lng - sel.lng) * 85, 2)
      );
      minDist = Math.min(minDist, dist);
    });
    return { loc, dist: minDist };
  });
  
  const baseRadius = Math.max(8, 18 - zoom * 0.8);
  
  return (
    <>
      {zones.map(({ loc, dist }) => {
        let color = '#ef4444';
        let opacity = 0.12;
        
        if (dist < 20) {
          color = '#16a34a';
          opacity = 0.4;
        } else if (dist < 40) {
          color = '#22c55e';
          opacity = 0.32;
        } else if (dist < 70) {
          color = '#84cc16';
          opacity = 0.28;
        } else if (dist < 110) {
          color = '#eab308';
          opacity = 0.22;
        } else if (dist < 160) {
          color = '#f97316';
          opacity = 0.18;
        } else if (dist < 220) {
          color = '#ef4444';
          opacity = 0.14;
        }
        
        const radius = baseRadius * (1 + (220 - Math.min(dist, 220)) / 220 * 0.5);
        
        return (
          <CircleMarker
            key={`heat-${loc.id}`}
            center={[loc.lat, loc.lng]}
            radius={radius}
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

function SelectedPointRings({ selectedIds, allLocs }: { selectedIds: number[]; allLocs: MapLocation[] }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  
  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });
  
  if (selectedIds.length === 0) return null;
  
  const baseRadius = Math.max(15, 30 - zoom * 1.2);
  
  return (
    <>
      {selectedIds.map(id => {
        const loc = allLocs.find(l => l.id === id);
        if (!loc) return null;
        
        return (
          <CircleMarker
            key={`ring-${loc.id}`}
            center={[loc.lat, loc.lng]}
            radius={baseRadius * 4}
            pathOptions={{
              color: '#22c55e',
              fillColor: '#22c55e',
              fillOpacity: 0.08,
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

  const toggleLocation = (id: number) => {
    setSelectedLocations(prev =>
      prev.includes(id)
        ? prev.filter(l => l !== id)
        : [...prev, id]
    );
  };

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
    <div className="fixed inset-0 bg-black">
      <MapContainer
        center={[44.9, 38.7]}
        zoom={8}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        maxZoom={12}
        minZoom={7}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapBoundsController />
        
        <SelectedPointRings selectedIds={selectedLocations} allLocs={MAP_LOCATIONS} />
        <HeatZones selectedIds={selectedLocations} allLocs={MAP_LOCATIONS} />

        {filteredLocations.map((loc) => {
          const isSelected = selectedLocations.includes(loc.id);
          const isHovered = hoveredId === loc.id;
          
          return (
            <CircleMarker
              key={loc.id}
              center={[loc.lat, loc.lng]}
              radius={isSelected ? 12 : isHovered ? 11 : 9}
              pathOptions={{
                color: isSelected ? '#22c55e' : '#ffffff',
                fillColor: isSelected ? '#22c55e' : getCategoryColor(loc),
                fillOpacity: isSelected ? 0.95 : isHovered ? 0.85 : 0.7,
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

      {/* Top UI Panel */}
      <div className="absolute top-0 left-0 right-0 z-[1000]">
        {/* Header */}
        <div className="bg-gradient-to-b from-black/90 via-black/70 to-transparent p-4 pb-16">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-black text-white">Карта края</h1>
              <p className="text-white/60 text-xs font-bold">
                {MAP_LOCATIONS.length} мест • Выбрано: {selectedLocations.length}
              </p>
            </div>
            <button
              onClick={() => setShowList(!showList)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                showList ? 'bg-green-500' : 'bg-white/20 backdrop-blur-xl'
              }`}
            >
              <List className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'text-white shadow-lg'
                    : 'bg-white/20 text-white/80 hover:bg-white/30'
                }`}
                style={
                  activeCategory === cat.id
                    ? { background: cat.color + 'dd' }
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
            <div className="bg-gray-900/95 backdrop-blur-2xl border border-white/20 h-full flex flex-col">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-white text-lg">
                    Маршрут ({selectedLocations.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedLocations([])}
                      className="text-white/60 text-sm font-bold hover:text-white px-3 py-1 rounded-full bg-white/10"
                    >
                      Очистить
                    </button>
                    <button
                      onClick={() => setShowList(false)}
                      className="text-white/60 hover:text-white"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {selectedLocObjects.length === 0 ? (
                  <p className="text-white/40 text-center py-8 font-bold">
                    Нажмите на точку на карте
                  </p>
                ) : (
                  selectedLocObjects.map((loc, i) => (
                    <motion.div
                      key={loc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-white/10 rounded-2xl p-3"
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm"
                        style={{ background: '#22c55e' }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm truncate">{loc.title}</p>
                        <p className="text-white/50 text-xs">{loc.description}</p>
                      </div>
                      <button
                        onClick={() => toggleLocation(loc.id)}
                        className="p-1.5 hover:bg-white/20 rounded-full"
                      >
                        <X className="w-4 h-4 text-white/60" />
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
          className="absolute bottom-24 right-4 z-[900] bg-black/70 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/10 hidden md:block"
        >
          <p className="text-white/60 text-xs font-bold mb-2">Близость:</p>
          <div className="space-y-1.5">
            {[
              { color: '#16a34a', label: '< 20 км' },
              { color: '#22c55e', label: '20-40 км' },
              { color: '#84cc16', label: '40-70 км' },
              { color: '#eab308', label: '70-110 км' },
              { color: '#f97316', label: '110-160 км' },
              { color: '#ef4444', label: '> 160 км' },
            ].map(item => (
              <div key={item.color} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-white/80 text-xs font-bold">{item.label}</span>
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
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-bold rounded-2xl border-2 border-white/30 shadow-2xl transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Построить маршрут ({selectedLocations.length})
          </button>
        </motion.div>
      )}

      {/* Hint when nothing selected */}
      {selectedLocations.length === 0 && (
        <div className="absolute bottom-6 left-4 right-4 z-[900]">
          <div className="bg-black/70 backdrop-blur-xl rounded-2xl px-6 py-3 text-center border border-white/10">
            <p className="text-white/80 font-bold text-sm">
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
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-popup .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
    </div>
  );
}
