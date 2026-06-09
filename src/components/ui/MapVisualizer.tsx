import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { GeoJsonObject } from 'geojson';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { JAKARTA_CITIES } from '../../types';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapVisualizerProps {
  statsData: { name: string, total: number }[];
  onRegionClick: (regionName: string) => void;
  theme: 'light' | 'dark';
  activeFilterPengadaan?: string;
  activeLokasi?: string;
}

const normalizeRegionName = (name: string) => {
  let normalized = name.toLowerCase()
    .replace(/(pemerintah|pemkab|pemkot|kab\.|kabupaten|kota|prov\.|provinsi)/g, '')
    .trim();

  // Alias corrections to match the GeoJSON polygon properties
  if (normalized === 'padang sidimpuan') return 'padang sidempuan';
  if (normalized === 'banjarbaru') return 'banjar baru';
  if (normalized === 'tanjungpinang') return 'tanjung pinang';
  if (normalized === 'pangkajene kepulauan') return 'pangkajene dan kepulauan';

  return normalized;
};

const WILAYAH_INFO: Record<string, { pusat: string; desc: string }> = {
  'wilayah i': { pusat: 'Padang', desc: 'Seluruh provinsi di Pulau Sumatera' },
  'wilayah ii': { pusat: 'Bandung', desc: 'DKI Jakarta, Banten, dan Jawa Barat' },
  'wilayah iii': { pusat: 'Yogyakarta', desc: 'Jawa Tengah, DIY, Jawa Timur, Bali, NTB, dan NTT' },
  'wilayah iv': { pusat: 'Banjarbaru', desc: 'Seluruh provinsi di Pulau Kalimantan' },
  'wilayah v': { pusat: 'Makassar', desc: 'Seluruh provinsi di Pulau Sulawesi' },
  'wilayah vi': { pusat: 'Jayapura', desc: 'Kepulauan Maluku dan Pulau Papua' },
};

const WILAYAH_COLORS: Record<string, { fill: string; border: string }> = {
  'wilayah i': { fill: '#3b82f6', border: '#93c5fd' },
  'wilayah ii': { fill: '#10b981', border: '#6ee7b7' },
  'wilayah iii': { fill: '#f59e0b', border: '#fcd34d' },
  'wilayah iv': { fill: '#8b5cf6', border: '#c4b5fd' },
  'wilayah v': { fill: '#ec4899', border: '#f9a8d4' },
  'wilayah vi': { fill: '#06b6d4', border: '#67e8f9' },
};

const DEFAULT_WILAYAH_COLOR = { fill: '#10b981', border: '#6ee7b7' };

const MapController = ({ activeLokasi, activeGeoData }: { activeLokasi?: string, activeGeoData: GeoJsonObject | null }) => {
  const map = useMap();
  
  useEffect(() => {
    const defaultZoom = window.innerWidth <= 640 ? 3 : 5;

    if (!activeLokasi || !activeGeoData) {
      map.flyTo([-2.5, 118], defaultZoom, { duration: 1.5 });
      return;
    }

    let normSearch = normalizeRegionName(activeLokasi);
    if (normSearch.includes('| wilayah')) {
       normSearch = normSearch.split('|')[1]?.trim() || normSearch;
    }

    let targetFeature = null;
    
    // Find the feature in activeGeoData that matches the location
    const features = (activeGeoData as any).features || [];
    for (const f of features) {
      const name = f.properties.NAME_2 || f.properties.kab_kota || f.properties.Propinsi || f.properties.name || f.properties.state || '';
      if (normalizeRegionName(name) === normSearch) {
        targetFeature = f;
        break;
      }
    }

    if (targetFeature) {
      try {
        const geoJsonLayer = L.geoJSON(targetFeature);
        let bestBounds = geoJsonLayer.getBounds();
        
        // Find largest polygon to focus on (fixes Gresik mainland vs Bawean island issue)
        if (targetFeature.geometry && targetFeature.geometry.type === 'MultiPolygon') {
          let maxArea = 0;
          let bestPolyBounds = null;

          for (const polygon of targetFeature.geometry.coordinates) {
            const exteriorRing = polygon[0];
            let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;

            for (const coord of exteriorRing) {
              const lng = coord[0];
              const lat = coord[1];
              if (lng < minLng) minLng = lng;
              if (lat < minLat) minLat = lat;
              if (lng > maxLng) maxLng = lng;
              if (lat > maxLat) maxLat = lat;
            }

            const area = (maxLng - minLng) * (maxLat - minLat);
            if (area > maxArea) {
              maxArea = area;
              bestPolyBounds = L.latLngBounds(L.latLng(minLat, minLng), L.latLng(maxLat, maxLng));
            }
          }

          if (bestPolyBounds) {
            bestBounds = bestPolyBounds;
          }
        }

        map.flyToBounds(bestBounds, { padding: [20, 20], maxZoom: 11, duration: 1.5 });
      } catch (e) {
        console.warn('Could not calculate bounds for', activeLokasi);
      }
    } else {
        // Fallback to center if not found
        map.flyTo([-2.5, 118], defaultZoom, { duration: 1.5 });
    }
  }, [activeLokasi, activeGeoData, map]);
  
  return null;
};

const MapVisualizer: React.FC<MapVisualizerProps> = ({ statsData, theme, onRegionClick, activeFilterPengadaan, activeLokasi }) => {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const [wilayahGeoData, setWilayahGeoData] = useState<GeoJsonObject | null>(null);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    const loadKabData = async () => {
      try {
        const res = await fetch('/data/indonesia-kab-full.geojson');
        if (!res.ok) throw new Error("GeoJSON not found locally");
        const data = await res.json();
        setGeoData(data);
      } catch (err) {
        console.warn("Failed to load local geojson, trying fallback CDN...", err);
        try {
          const fallbackRes = await fetch('https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province-simple.json');
          if (!fallbackRes.ok) throw new Error('Failed to fetch fallback geojson');
          const fallbackData = await fallbackRes.json();
          setGeoData(fallbackData);
        } catch (e) {
          console.error("Complete failure loading geojson", e);
          setLoadingError(true);
        }
      }
    };

    const loadWilayahData = async () => {
      try {
        const res = await fetch('/data/wilayah-pusdiklatkesos.geojson');
        if (res.ok) {
          setWilayahGeoData(await res.json());
        }
      } catch (e) {
        console.warn('Failed to load wilayah geojson', e);
      }
    };

    loadKabData();
    loadWilayahData();
  }, []);

  const statsMap = useMemo(() => {
    const map = new Map<string, number>();
    let max = 0;
    statsData.forEach(s => {
      const norm = normalizeRegionName(s.name);
      map.set(norm, s.total);
      if (s.total > max) max = s.total;
    });
    return { map, max };
  }, [statsData]);

  const getColor = useCallback((d: number) => {
    if (d === 0) return '#1e293b';
    const max = statsMap.max;
    if (max === 0) return '#1e293b';
    const ratio = d / max;
    if (ratio > 0.8) return '#1e3a8a';
    if (ratio > 0.6) return '#1d4ed8';
    if (ratio > 0.4) return '#2563eb';
    if (ratio > 0.2) return '#3b82f6';
    if (ratio > 0.1) return '#60a5fa';
    return '#93c5fd';
  }, [statsMap.max]);

  const style = useCallback((feature: any) => {
    if (feature.properties.isWilayah) {
      const wilId = feature.properties.name;
      const lookupKey = `pusat pendidikan, pelatihan dan pengembangan profesi kesejahteraan sosial | ${wilId}`;
      const wValue = statsMap.map.get(lookupKey) || 0;
      
      if (wValue > 0) {
        const c = WILAYAH_COLORS[wilId] || DEFAULT_WILAYAH_COLOR;
        return {
          fillColor: c.fill,
          weight: 2,
          opacity: 1,
          color: c.border,
          fillOpacity: 0.9
        };
      }
      return {
        fillColor: '#1e293b',
        weight: 1,
        opacity: 1,
        color: 'rgba(59, 130, 246, 0.3)',
        fillOpacity: 0.4
      };
    }

    // Handling multiple property variations in different geojson files
    const rawName = feature.properties.NAME_2 || feature.properties.name || feature.properties.state || '';
    const norm = normalizeRegionName(rawName);
    let value = statsMap.map.get(norm) || 0;

    // Special logic for Prov. DKI Jakarta (mapping province to all its cities)
    let isDkiProv = false;
    if (JAKARTA_CITIES.includes(norm as typeof JAKARTA_CITIES[number])) {
      const dkiValue = statsMap.map.get('dki jakarta') || statsMap.map.get('prov. dki jakarta');
      if (dkiValue) {
        if (value === 0) value = dkiValue;
        isDkiProv = true;
      }
    }

    const hasValue = value > 0;

    return {
      fillColor: (isDkiProv && hasValue) ? '#ef4444' : getColor(value),
      weight: (isDkiProv && hasValue) ? 2 : 1,
      opacity: 1,
      color: (isDkiProv && hasValue) ? '#fca5a5' : 'rgba(59, 130, 246, 0.3)',
      fillOpacity: (isDkiProv && hasValue) ? 0.9 : (hasValue ? 0.8 : 0.4)
    };
  }, [statsMap.map, getColor]);

  const onEachFeature = useCallback((feature: any, layer: L.Layer) => {
    if (feature.properties.isWilayah) {
      const wilId = feature.properties.name;
      const lookupKey = `pusat pendidikan, pelatihan dan pengembangan profesi kesejahteraan sosial | ${wilId}`;
      const wValue = statsMap.map.get(lookupKey) || 0;
      
      const info = WILAYAH_INFO[wilId] || { pusat: '', desc: '' };
      const displayTitle = `Pusat Pendidikan, Pelatihan dan Pengembangan Profesi Kesejahteraan Sosial | ${wilId.toUpperCase()}`;
      
      layer.bindTooltip(`
        <strong>${displayTitle} (Pusat: ${info.pusat})</strong>
        <div style="font-size:0.8rem; color:#94a3b8; margin:6px 0 8px 0; max-width:280px; white-space:normal; line-height:1.4;">
          Melayani: ${info.desc}
        </div>
        <div>Kebutuhan: <strong>${wValue} Orang</strong></div>
      `, {
        sticky: true,
        className: 'custom-tooltip'
      });
      
      if (wValue > 0) {
        layer.on({
          click: () => {
            const original = statsData.find(s => normalizeRegionName(s.name) === lookupKey);
            if (original) onRegionClick(original.name);
          }
        });
      }
      return;
    }

    const name = feature.properties.NAME_2 || feature.properties.kab_kota || feature.properties.Propinsi || feature.properties.name || feature.properties.state || 'Unknown';
    const norm = normalizeRegionName(name);
    let value = statsMap.map.get(norm) || 0;
    
    let displayTitle = name;
    if (JAKARTA_CITIES.includes(norm as typeof JAKARTA_CITIES[number])) {
      const dkiValue = statsMap.map.get('dki jakarta') || statsMap.map.get('prov. dki jakarta');
      if (dkiValue && value === 0) {
        value = dkiValue;
        displayTitle = 'Prov. DKI Jakarta (' + name + ')';
      }
    }

    layer.bindTooltip(`<strong>${displayTitle}</strong><br/>Kebutuhan: ${value} Orang`, {
      sticky: true,
      className: 'custom-tooltip'
    });

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ weight: 2, color: '#60a5fa', fillOpacity: 0.9 });
        l.bringToFront();
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(style(feature));
      }
    });

    if (value > 0) {
      layer.on({
        click: () => {
          const original = statsData.find(s => normalizeRegionName(s.name) === norm);
          if (original) {
            onRegionClick(original.name);
          }
        }
      });
    }
  }, [statsMap.map, statsData, onRegionClick, style]);

  const activeGeoData = (activeFilterPengadaan === 'PPPK Teknis' && wilayahGeoData) ? wilayahGeoData : geoData;

  const dataHash = useMemo(() => {
    return statsData.reduce((acc, curr) => acc + curr.total, 0) + '_' + statsData.length;
  }, [statsData]);

  if (loadingError) {
    return <div className="map-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ef4444' }}>Gagal memuat data peta Indonesia.</div>;
  }

  if (!activeGeoData) {
    return <div className="map-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>Memuat Peta Indonesia...</div>;
  }

  return (
    <div className="map-wrapper">
      <MapContainer center={[-2.5, 118]} zoom={typeof window !== 'undefined' && window.innerWidth <= 640 ? 3 : 5} style={{ height: '100%', width: '100%', background: 'var(--bg-map)' }}>
        <TileLayer
          key={theme} // force re-render when theme changes to reload tiles instantly
          url={`https://{s}.basemaps.cartocdn.com/${theme === 'dark' ? 'dark_nolabels' : 'light_nolabels'}/{z}/{x}/{y}{r}.png`}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapController activeLokasi={activeLokasi} activeGeoData={activeGeoData} />
        <GeoJSON key={`${activeFilterPengadaan === 'PPPK Teknis' ? 'wilayah' : 'kabkota'}-${dataHash}`} data={activeGeoData} style={style} onEachFeature={onEachFeature} />
      </MapContainer>
    </div>
  );
};

export default MapVisualizer;
