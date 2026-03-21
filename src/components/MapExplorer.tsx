import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, ArrowLeft, Navigation, 
  Check, X, Star, Wine, Mountain, Building, 
  Waves, TreePine, Utensils, Zap, Route
} from 'lucide-react';
import type { Location } from '../types';
import { LOCATIONS } from '../data';

interface MapExplorerProps {
  onBuildRoute: (locations: Location[]) => void;
  onBack: () => void;
}

type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  activeColor: string;
};

const CATEGORIES: Category[] = [
  { id: 'all', label: 'Все', icon: <MapIcon className="w-4 h-4" />, color: '#667eea', activeColor: '#667eea' },
  { id: 'wine', label: 'Винодельни', icon: <Wine className="w-4 h-4" />, color: '#8b5cf6', activeColor: '#8b5cf6' },
  { id: 'mountain', label: 'Горы', icon: <Mountain className="w-4 h-4" />, color: '#10b981', activeColor: '#10b981' },
  { id: 'sea', label: 'Море/Пляж', icon: <Waves className="w-4 h-4" />, color: '#0ea5e9', activeColor: '#0ea5e9' },
  { id: 'nature', label: 'Природа', icon: <TreePine className="w-4 h-4" />, color: '#22c55e', activeColor: '#22c55e' },
  { id: 'culture', label: 'Культура', icon: <Building className="w-4 h-4" />, color: '#f59e0b', activeColor: '#f59e0b' },
  { id: 'family', label: 'Семья', icon: <Star className="w-4 h-4" />, color: '#f43f5e', activeColor: '#f43f5e' },
  { id: 'food', label: 'Гастро', icon: <Utensils className="w-4 h-4" />, color: '#f97316', activeColor: '#f97316' },
  { id: 'extreme', label: 'Экстрим', icon: <Zap className="w-4 h-4" />, color: '#ef4444', activeColor: '#ef4444' },
];

function getCategoryForLocation(loc: Location): string[] {
  const cats: string[] = [];
  const title = loc.title.toLowerCase();
  const desc = loc.desc.toLowerCase();
  
  if (title.includes('винодельн') || desc.includes('вин')) cats.push('wine');
  if (title.includes('гора') || title.includes('полян') || title.includes('ущель') || title.includes('красн')) cats.push('mountain');
  if (desc.includes('море') || desc.includes('пляж') || title.includes('анап') || title.includes('ейск') || title.includes('коса')) cats.push('sea');
  if (desc.includes('природ') || title.includes('заповед') || title.includes('долина') || title.includes('ущель') || title.includes('дольмен') || title.includes('пещер') || title.includes('гуам')) cats.push('nature');
  if (desc.includes('этнограф') || title.includes('атамань') || title.includes('музей') || title.includes('парк')) cats.push('culture');
  if (loc.tags.includes('Дети') || loc.tags.includes('Мама') || loc.tags.includes('Бабушка')) cats.push('family');
  if (desc.includes('ферм') || desc.includes('гастро') || title.includes('сырн') || desc.includes('функц')) cats.push('food');
  if (desc.includes('экстрим') || desc.includes('драйв') || title.includes('гуам') || desc.includes('скалолаз')) cats.push('extreme');
  
  return cats.length > 0 ? cats : ['nature'];
}

function getCategoryColor(loc: Location, selected: number[]): 'green' | 'yellow' | 'orange' | 'red' | 'default' {
  if (selected.length === 0) return 'default';
  
  const selectedLocs = selected.map(id => LOCATIONS.find(l => l.id === id)!);
  
  let minDist = Infinity;
  selectedLocs.forEach(sel => {
    const dist = Math.sqrt(
      Math.pow((loc.lat - sel.lat) * 111, 2) + 
      Math.pow((loc.lng - sel.lng) * 85, 2)
    );
    minDist = Math.min(minDist, dist);
  });
  
  if (minDist < 30) return 'green';
  if (minDist < 80) return 'yellow';
  if (minDist < 150) return 'orange';
  return 'red';
}

function MapBoundsUpdater({ locations }: { locations: Location[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length === 0) return;
    const bounds = locations.map(l => [l.lat, l.lng] as [number, number]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }, [locations, map]);
  
  return null;
}

function HeatCircles({ selectedIds }: { selectedIds: number[] }) {
  const map = useMap();
  const [bounds, setBounds] = useState(map.getBounds());
  
  useEffect(() => {
    const update = () => setBounds(map.getBounds());
    map.on('moveend', update);
    const interval = setInterval(update, 5000);
    return () => {
      map.off('moveend', update);
      clearInterval(interval);
    };
  }, [map]);
  
  const selectedLocs = selectedIds.map(id => LOCATIONS.find(l => l.id === id)!);
  
  const allOtherLocs = LOCATIONS.filter(l => !selectedIds.includes(l.id));
  
  const heatMapData = allOtherLocs.map(loc => {
    let minDist = Infinity;
    selectedLocs.forEach(sel => {
      const dist = Math.sqrt(
        Math.pow((loc.lat - sel.lat) * 111, 2) + 
        Math.pow((loc.lng - sel.lng) * 85, 2)
      );
      minDist = Math.min(minDist, dist);
    });
    return { loc, dist: minDist };
  }).sort((a, b) => a.dist - b.dist);
  
  const visibleLocs = heatMapData.filter(d => {
    return bounds.contains([d.loc.lat, d.loc.lng]);
  });
  
  return (
    <>
      {visibleLocs.map(({ loc, dist }) => {
        let color: string;
        let opacity: number;
        let radius: number;
        
        if (dist < 30) {
          color = '#22c55e';
          opacity = 0.25;
          radius = 60000;
        } else if (dist < 80) {
          color = '#eab308';
          opacity = 0.15;
          radius = 80000;
        } else if (dist < 150) {
          color = '#f97316';
          opacity = 0.10;
          radius = 100000;
        } else {
          color = '#ef4444';
          opacity = 0.06;
          radius = 120000;
        }
        
        return (
          <CircleMarker
            key={`heat-${loc.id}`}
            center={[loc.lat, loc.lng]}
            radius={radius / 1000}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: opacity,
              weight: 0,
              opacity: 0,
            }}
          />
        );
      })}
    </>
  );
}

export function MapExplorer({ onBuildRoute, onBack }: MapExplorerProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredLocations = useMemo(() => {
    if (activeCategory === 'all') return LOCATIONS;
    return LOCATIONS.filter(loc => {
      const cats = getCategoryForLocation(loc);
      return cats.includes(activeCategory);
    });
  }, [activeCategory]);

  const toggleLocation = (id: number) => {
    setSelectedLocations(prev =>
      prev.includes(id)
        ? prev.filter(l => l !== id)
        : [...prev, id]
    );
  };

  const selectedLocObjects = useMemo(() =>
    selectedLocations.map(id => LOCATIONS.find(l => l.id === id)!).filter(Boolean),
    [selectedLocations]
  );

  const heatLegend = useMemo(() => {
    if (selectedLocations.length === 0) return null;
    return [
      { color: '#22c55e', label: '0-30 км', desc: 'Рядом' },
      { color: '#eab308', label: '30-80 км', desc: 'В течение дня' },
      { color: '#f97316', label: '80-150 км', desc: 'Два дня' },
      { color: '#ef4444', label: '150+ км', desc: 'Дальше' },
    ];
  }, [selectedLocations]);

  const handleBuildRoute = () => {
    const allSelected = [...new Set([...selectedLocations])];
    const route = allSelected
      .map(id => LOCATIONS.find(l => l.id === id)!)
      .filter(Boolean);
    onBuildRoute(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] bg-black/90"
    >
      <div className="absolute top-0 left-0 right-0 z-[70] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="glass-btn p-3 rounded-full flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white truncate">Карта путешествий</h1>
            <p className="text-white/60 text-xs font-bold">
              {filteredLocations.length} мест • Выбрано: {selectedLocations.length}
            </p>
          </div>
          <button
            onClick={() => setShowPanel(!showPanel)}
            className={`glass-btn p-3 rounded-full flex-shrink-0 ${showPanel ? 'bg-glass-primary' : ''}`}
          >
            <Route className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'text-white shadow-lg'
                  : 'bg-white/15 text-white/70 hover:bg-white/25'
              }`}
              style={
                activeCategory === cat.id
                  ? { background: `linear-gradient(135deg, ${cat.color}cc, ${cat.color}88)` }
                  : undefined
              }
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {selectedLocations.length > 0 && heatLegend && (
          <div className="glass-card p-3 flex flex-wrap gap-3 items-center justify-center">
            <span className="text-white/60 text-xs font-bold">Тепловая карта:</span>
            {heatLegend.map(item => (
              <div key={item.color} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-white/80 text-xs font-bold">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <MapContainer
        center={[44.7, 38.5]}
        zoom={8}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapBoundsUpdater locations={filteredLocations} />
        
        {selectedLocations.length > 0 && <HeatCircles selectedIds={selectedLocations} />}

        {filteredLocations.map((loc) => {
          const isSelected = selectedLocations.includes(loc.id);
          const isHovered = hoveredId === loc.id;
          const heatColor = getCategoryColor(loc, selectedLocations);
          
          let markerColor = '#667eea';
          if (isSelected) markerColor = '#22c55e';
          else if (heatColor === 'green') markerColor = '#22c55e';
          else if (heatColor === 'yellow') markerColor = '#eab308';
          else if (heatColor === 'orange') markerColor = '#f97316';
          else if (heatColor === 'red') markerColor = '#ef4444';
          
          return (
            <CircleMarker
              key={loc.id}
              center={[loc.lat, loc.lng]}
              radius={isSelected ? 14 : isHovered ? 12 : 10}
              pathOptions={{
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: isSelected ? 0.9 : isHovered ? 0.8 : 0.6,
                weight: isSelected || isHovered ? 3 : 2,
                opacity: 1,
              }}
              eventHandlers={{
                mouseover: () => setHoveredId(loc.id),
                mouseout: () => setHoveredId(null),
                click: () => toggleLocation(loc.id),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <img
                    src={loc.img}
                    alt={loc.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-black text-sm mb-1">{loc.title}</h3>
                  <p className="text-xs opacity-80 mb-2">{loc.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {getCategoryForLocation(loc).slice(0, 3).map(catId => {
                      const cat = CATEGORIES.find(c => c.id === catId);
                      return cat ? (
                        <span
                          key={catId}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: cat.color + '44', color: cat.color }}
                        >
                          {cat.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLocation(loc.id); }}
                    className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-red-500/30 text-red-300'
                        : 'bg-green-500/30 text-green-300'
                    }`}
                  >
                    {isSelected ? (
                      <><X className="w-3 h-3" /> Убрать</>
                    ) : (
                      <><Check className="w-3 h-3" /> Добавить</>
                    )}
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <AnimatePresence>
        {showPanel && selectedLocations.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-[80] p-4"
          >
            <div className="glass-modal max-h-[50vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-white">
                    Выбрано: {selectedLocations.length}
                  </h3>
                  <button
                    onClick={() => setSelectedLocations([])}
                    className="text-white/60 text-sm font-bold hover:text-white"
                  >
                    Очистить
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedLocObjects.map((loc, i) => (
                    <motion.div
                      key={loc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 bg-white/10 rounded-xl p-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center text-white font-black text-sm">
                        {i + 1}
                      </div>
                      <img
                        src={loc.img}
                        alt={loc.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm truncate">{loc.title}</p>
                      </div>
                      <button
                        onClick={() => toggleLocation(loc.id)}
                        className="p-1 hover:bg-white/20 rounded-full"
                      >
                        <X className="w-4 h-4 text-white/60" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedLocations.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[85] w-full max-w-md px-4"
          style={{ bottom: showPanel && selectedLocations.length > 0 ? 'calc(50vh + 16px)' : '16px' }}
        >
          <button
            onClick={handleBuildRoute}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg font-bold rounded-2xl border border-white/30 shadow-2xl transition-all flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Построить маршрут ({selectedLocations.length})
          </button>
        </motion.div>
      )}

      {selectedLocations.length === 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[70] glass-card px-6 py-3 text-center">
          <p className="text-white/80 font-bold text-sm">
            Нажмите на точку на карте, чтобы добавить в маршрут
          </p>
        </div>
      )}
    </motion.div>
  );
}
