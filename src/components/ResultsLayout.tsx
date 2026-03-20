import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RouteTinderCards } from './RouteTinderCards';
import type { Location } from '../types';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ResultsLayoutProps {
  locations: Location[];
  onFinish: () => void;
}

export function ResultsLayout({ locations, onFinish }: ResultsLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
        <div className="lg:w-1/2 h-[40vh] lg:h-screen bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Загрузка карты...</span>
        </div>
        <div className="lg:w-1/2 p-4 lg:p-8 h-[60vh] lg:h-screen overflow-y-auto">
          <RouteTinderCards locations={locations} onFinish={onFinish} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      <div className="lg:w-1/2 h-[40vh] lg:h-screen sticky top-0 z-10 border-b-4 lg:border-b-0 lg:border-r-4 border-zelda-dark">
        <MapContainer
          center={[44.7, 38.5]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>{loc.title}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="lg:w-1/2 p-2 sm:p-4 lg:h-screen overflow-hidden flex flex-col">
        <RouteTinderCards locations={locations} onFinish={onFinish} />
      </div>
    </div>
  );
}
