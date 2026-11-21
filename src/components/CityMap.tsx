import React, { useState } from 'react';
import { IoTSensor, Incident, TrafficLight, BlueWasteBin, StreetLamp, TrafficLightState } from '../types';
import { 
  Radio, 
  Wind, 
  Trash2, 
  Lightbulb, 
  Sun, 
  AlertTriangle, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Layers, 
  X,
  BatteryCharging,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Zap,
  Moon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';

interface CityMapProps {
  sensors: IoTSensor[];
  incidents: Incident[];
  trafficLights: TrafficLight[];
  blueBins: BlueWasteBin[];
  streetLamps: StreetLamp[];
  onUpdateTrafficLight?: (id: string, state: TrafficLightState) => void;
  onEmptyBlueBin?: (id: string) => void;
  onToggleStreetLamp?: (id: string) => void;
  onSetAllStreetLampsMode?: (mode: 'night_full' | 'eco_dimmed' | 'day_off') => void;
  onRepairStreetLamp?: (id: string) => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  onMapClickCoordinates?: (lat: number, lng: number, addressEstimate: string) => void;
  interactiveMode?: 'view' | 'pick_location';
  highlightedIncidentId?: string;
}

// Coordinate mapping helper for Lisbon SVG ViewBox (800 x 500)
// Lisbon approx bounding box: Lat 38.685 to 38.780, Lng -9.230 to -9.080
function coordsToSvg(lat: number, lng: number) {
  const minLat = 38.685;
  const maxLat = 38.780;
  const minLng = -9.230;
  const maxLng = -9.080;

  const x = ((lng - minLng) / (maxLng - minLng)) * 800;
  // Invert Y because SVG coordinates go top-down
  const y = 500 - (((lat - minLat) / (maxLat - minLat)) * 500);

  return { 
    x: Math.max(25, Math.min(775, x)), 
    y: Math.max(25, Math.min(475, y)) 
  };
}

function svgToCoords(x: number, y: number) {
  const minLat = 38.685;
  const maxLat = 38.780;
  const minLng = -9.230;
  const maxLng = -9.080;

  const lng = minLng + (x / 800) * (maxLng - minLng);
  const lat = maxLat - (y / 500) * (maxLat - minLat);

  return {
    lat: Number(lat.toFixed(5)),
    lng: Number(lng.toFixed(5))
  };
}

export const CityMap: React.FC<CityMapProps> = ({
  sensors,
  incidents,
  trafficLights = [],
  blueBins = [],
  streetLamps = [],
  onUpdateTrafficLight,
  onEmptyBlueBin,
  onToggleStreetLamp,
  onSetAllStreetLampsMode,
  onRepairStreetLamp,
  selectedDistrict,
  onSelectDistrict,
  onMapClickCoordinates,
  interactiveMode = 'view',
  highlightedIncidentId
}) => {
  // Layer Toggles
  const [showTrafficLights, setShowTrafficLights] = useState(true);
  const [showBlueBins, setShowBlueBins] = useState(true);
  const [showStreetLamps, setShowStreetLamps] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);

  // Night Vision Mode (illuminates lamps and lights dramatically)
  const [isNightMode, setIsNightMode] = useState(true);

  // Zoom Level: 1 = normal, 1.6 = medium, 2.4 = close-up street level
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Inspection states
  const [selectedSensor, setSelectedSensor] = useState<IoTSensor | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [selectedTrafficLight, setSelectedTrafficLight] = useState<TrafficLight | null>(null);
  const [selectedBlueBin, setSelectedBlueBin] = useState<BlueWasteBin | null>(null);
  const [selectedStreetLamp, setSelectedStreetLamp] = useState<StreetLamp | null>(null);

  const [pickedPin, setPickedPin] = useState<{ lat: number; lng: number } | null>(null);

  const districts = [
    { id: 'all', name: 'Todos os Distritos', center: { x: 400, y: 250 } },
    { id: 'Baixa-Chiado', name: 'Baixa-Chiado', center: { x: 470, y: 350 } },
    { id: 'Alvalade', name: 'Alvalade / Campo Grande', center: { x: 420, y: 180 } },
    { id: 'Parque das Nações', name: 'Parque das Nações', center: { x: 670, y: 130 } },
    { id: 'Belém', name: 'Belém / Ajuda', center: { x: 130, y: 410 } },
    { id: 'Lumiar', name: 'Lumiar / Telheiras', center: { x: 380, y: 110 } }
  ];

  // District filtering
  const filterDistrict = (district: string) => {
    if (selectedDistrict === 'all') return true;
    return district === selectedDistrict;
  };

  const filteredTrafficLights = trafficLights.filter(t => filterDistrict(t.district));
  const filteredBlueBins = blueBins.filter(b => filterDistrict(b.district));
  const filteredStreetLamps = streetLamps.filter(l => filterDistrict(l.district));
  const filteredSensors = sensors.filter(s => filterDistrict(s.district));
  const filteredIncidents = incidents.filter(i => filterDistrict(i.district));

  // Counts & stats
  const greenCount = trafficLights.filter(t => t.state === 'green').length;
  const redCount = trafficLights.filter(t => t.state === 'red').length;
  const fullBlueBinsCount = blueBins.filter(b => b.is_full).length;
  const onLampsCount = streetLamps.filter(l => l.status === 'on' || l.status === 'dimmed').length;
  const faultLampsCount = streetLamps.filter(l => l.status === 'fault').length;

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.4, 2.6));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 0.4, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Center on district when clicked
  const handleSelectDistrict = (distId: string) => {
    onSelectDistrict(distId);
    const dist = districts.find(d => d.id === distId);
    if (dist && distId !== 'all') {
      setZoomLevel(1.6);
      setPanOffset({
        x: (400 - dist.center.x) * 0.7,
        y: (250 - dist.center.y) * 0.7
      });
    } else {
      handleResetZoom();
    }
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (interactiveMode !== 'pick_location' && !onMapClickCoordinates) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 800;
    const clickY = ((e.clientY - rect.top) / rect.height) * 500;

    const coords = svgToCoords(clickX, clickY);
    setPickedPin(coords);

    let estDistrict = 'Baixa-Chiado';
    if (coords.lng > -9.11) estDistrict = 'Parque das Nações';
    else if (coords.lng < -9.18) estDistrict = 'Belém';
    else if (coords.lat > 38.75) estDistrict = 'Alvalade';

    const address = `Coordenadas [${coords.lat}, ${coords.lng}], Freguesia ${estDistrict}`;
    if (onMapClickCoordinates) {
      onMapClickCoordinates(coords.lat, coords.lng, address);
    }
  };

  const clearInspectors = () => {
    setSelectedSensor(null);
    setSelectedIncident(null);
    setSelectedTrafficLight(null);
    setSelectedBlueBin(null);
    setSelectedStreetLamp(null);
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl text-slate-200">
      {/* Top Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md z-10 relative">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm font-bold text-white tracking-wide">Mapa Urbano Geoespacial em Tempo Real</span>
          <span className="text-xs text-slate-400 hidden lg:inline">
            · {trafficLights.length} Semáforos · {blueBins.length} Contentores Azuis · {streetLamps.length} Luzes da Rua
          </span>
        </div>

        {/* Global Controls & District Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* District selector buttons */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 text-xs">
            {districts.map(d => (
              <button
                key={d.id}
                onClick={() => handleSelectDistrict(d.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  selectedDistrict === d.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          {/* Night Vision Mode & Zoom */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              title="Alternar Modo Noturno da Iluminação Pública"
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                isNightMode
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              {isNightMode ? 'Visão Noturna (LEDs Acesos)' : 'Visão Diurna'}
            </button>

            <button
              onClick={handleZoomIn}
              title="Aproximar (Zoom In)"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Afastar (Zoom Out)"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={handleResetZoom}
                title="Repor Zoom"
                className="px-2 py-1 rounded-lg text-[10px] text-slate-400 hover:text-white hover:bg-slate-700/60"
              >
                1x
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Layer Toggles Strip */}
      <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Camadas:
          </span>

          {/* 1. Semáforos Toggle */}
          <button
            onClick={() => setShowTrafficLights(!showTrafficLights)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              showTrafficLights
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60'
            }`}
          >
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </span>
            <span>Semáforos ({trafficLights.length})</span>
            <span className="text-[10px] bg-emerald-500/20 px-1.5 rounded text-emerald-300 font-mono">
              {greenCount}🟢 {redCount}🔴
            </span>
          </button>

          {/* 2. Contentores Azuis Toggle */}
          <button
            onClick={() => setShowBlueBins(!showBlueBins)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              showBlueBins
                ? 'bg-blue-950 text-blue-300 border border-blue-500/50 shadow-sm'
                : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-blue-400" />
            <span>Contentores Azul ({blueBins.length})</span>
            {fullBlueBinsCount > 0 && (
              <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 rounded animate-pulse">
                {fullBlueBinsCount} Cheios!
              </span>
            )}
          </button>

          {/* 3. Luzes da Rua Toggle */}
          <button
            onClick={() => setShowStreetLamps(!showStreetLamps)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              showStreetLamps
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Todas as Luzes da Rua ({streetLamps.length})</span>
            <span className="text-[10px] bg-amber-500/20 px-1.5 rounded text-amber-300 font-mono">
              {onLampsCount} Acesas
            </span>
            {faultLampsCount > 0 && (
              <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 rounded">
                {faultLampsCount} Avarias
              </span>
            )}
          </button>

          {/* 4. Sensores Ambientais & Ocorrências */}
          <button
            onClick={() => setShowSensors(!showSensors)}
            className={`px-2 py-1 rounded-lg transition-all ${
              showSensors ? 'bg-slate-800 text-cyan-300 border border-cyan-800' : 'bg-slate-800/40 text-slate-500'
            }`}
          >
            Sensores IoT ({sensors.length})
          </button>

          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-2 py-1 rounded-lg transition-all ${
              showIncidents ? 'bg-slate-800 text-rose-300 border border-rose-800' : 'bg-slate-800/40 text-slate-500'
            }`}
          >
            Ocorrências ({incidents.filter(i => i.status !== 'resolvido').length})
          </button>
        </div>

        {/* Global Quick Action: Modo Luzes */}
        {onSetAllStreetLampsMode && (
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400">Comando Global da Iluminação:</span>
            <button
              onClick={() => onSetAllStreetLampsMode('night_full')}
              className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium"
            >
              100% Noturno
            </button>
            <button
              onClick={() => onSetAllStreetLampsMode('eco_dimmed')}
              className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-medium"
            >
              Modo Eco (-40%)
            </button>
          </div>
        )}
      </div>

      {interactiveMode === 'pick_location' && (
        <div className="bg-cyan-950/90 border-b border-cyan-800 px-4 py-2 text-xs text-cyan-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span><strong>Clique no mapa</strong> no local onde se encontra a ocorrência para definir o ponto GPS.</span>
          </div>
          {pickedPin && (
            <span className="font-mono text-cyan-300">
              GPS: {pickedPin.lat}, {pickedPin.lng}
            </span>
          )}
        </div>
      )}

      {/* SVG Canvas Map with Pan and Zoom */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-slate-950 overflow-hidden cursor-crosshair">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full select-none"
          onClick={handleSvgClick}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="gridMap" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            </pattern>

            {/* River Tejo Water Gradient */}
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#042036" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#083344" stopOpacity="0.9" />
            </linearGradient>

            {/* District Fill */}
            <linearGradient id="distGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity={isNightMode ? '0.55' : '0.75'} />
              <stop offset="100%" stopColor="#0f172a" stopOpacity={isNightMode ? '0.75' : '0.85'} />
            </linearGradient>

            {/* Glowing Lamp Halo Filter */}
            <filter id="lampGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>

            {/* Traffic Light Glow */}
            <filter id="trafficGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="500" fill="url(#gridMap)" />

          {/* Zoom and Pan container */}
          <g
            transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
            style={{ transformOrigin: '400px 250px', transition: 'transform 0.3s ease-out' }}
          >
            {/* Tagus River (Rio Tejo) Water Body */}
            <path
              d="M 0,440 Q 150,420 300,430 T 600,410 T 800,280 L 800,500 L 0,500 Z"
              fill="url(#riverGrad)"
              stroke="#0e7490"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            <text x="560" y="470" fill="#0891b2" fontSize="11" fontFamily="JetBrains Mono" opacity="0.6" letterSpacing="3">
              RIO TEJO (TAGUS ESTUARY)
            </text>

            {/* Lisbon Main Street Network (Visual Avenues) */}
            <g fill="none">
              {/* 2ª Circular Expressway */}
              <path d="M 60,190 Q 250,150 480,180 T 750,150" stroke="#38bdf8" strokeOpacity="0.3" strokeWidth="4" />
              <path d="M 60,190 Q 250,150 480,180 T 750,150" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="6 4" />

              {/* Av. da Liberdade / Eixo Central (Restauradores -> Marquês -> Saldanha -> Entrecampos -> Campo Grande) */}
              <path d="M 470,390 L 460,260 L 410,130" stroke="#f59e0b" strokeOpacity={isNightMode ? '0.45' : '0.35'} strokeWidth="5" />
              <path d="M 470,390 L 460,260 L 410,130" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="5 3" />

              {/* Av. Marginal / Av. Brasília (Belém Waterfront) */}
              <path d="M 30,420 Q 200,400 480,400 T 780,240" stroke="#06b6d4" strokeOpacity="0.3" strokeWidth="3" />

              {/* Alameda dos Oceanos (Parque das Nações) */}
              <path d="M 670,90 L 685,250" stroke="#a855f7" strokeOpacity="0.35" strokeWidth="4" />

              {/* Baixa Pombalina Grid (Rua Augusta, Prata, Ouro) */}
              <path d="M 440,320 L 440,395" stroke="#94a3b8" strokeOpacity="0.3" strokeWidth="2" />
              <path d="M 465,320 L 465,395" stroke="#94a3b8" strokeOpacity="0.4" strokeWidth="2.5" />
              <path d="M 490,320 L 490,395" stroke="#94a3b8" strokeOpacity="0.3" strokeWidth="2" />
            </g>

            {/* District Boundary Polygons */}
            {/* Belém */}
            <path
              d="M 50,380 L 190,360 L 220,420 L 70,430 Z"
              fill={selectedDistrict === 'Belém' ? 'rgba(6,182,212,0.2)' : 'url(#distGrad)'}
              stroke={selectedDistrict === 'Belém' ? '#06b6d4' : '#334155'}
              strokeWidth={selectedDistrict === 'Belém' ? '2' : '1'}
              className="transition-all duration-300"
            />
            <text x="110" y="395" fill="#94a3b8" fontSize="10" fontWeight="600">Belém</text>

            {/* Baixa-Chiado */}
            <path
              d="M 420,310 L 520,310 L 540,400 L 410,400 Z"
              fill={selectedDistrict === 'Baixa-Chiado' ? 'rgba(6,182,212,0.2)' : 'url(#distGrad)'}
              stroke={selectedDistrict === 'Baixa-Chiado' ? '#06b6d4' : '#334155'}
              strokeWidth={selectedDistrict === 'Baixa-Chiado' ? '2' : '1'}
              className="transition-all duration-300"
            />
            <text x="445" y="340" fill="#94a3b8" fontSize="10" fontWeight="600">Baixa-Chiado</text>

            {/* Alvalade / Campo Grande */}
            <path
              d="M 340,150 L 520,150 L 510,250 L 330,240 Z"
              fill={selectedDistrict === 'Alvalade' ? 'rgba(6,182,212,0.2)' : 'url(#distGrad)'}
              stroke={selectedDistrict === 'Alvalade' ? '#06b6d4' : '#334155'}
              strokeWidth={selectedDistrict === 'Alvalade' ? '2' : '1'}
              className="transition-all duration-300"
            />
            <text x="410" y="200" fill="#94a3b8" fontSize="10" fontWeight="600">Alvalade</text>

            {/* Parque das Nações */}
            <path
              d="M 620,80 L 730,100 L 720,260 L 610,240 Z"
              fill={selectedDistrict === 'Parque das Nações' ? 'rgba(6,182,212,0.2)' : 'url(#distGrad)'}
              stroke={selectedDistrict === 'Parque das Nações' ? '#06b6d4' : '#334155'}
              strokeWidth={selectedDistrict === 'Parque das Nações' ? '2' : '1'}
              className="transition-all duration-300"
            />
            <text x="635" y="160" fill="#94a3b8" fontSize="10" fontWeight="600">Parque das Nações</text>

            {/* Lumiar */}
            <path
              d="M 320,60 L 460,60 L 450,140 L 310,130 Z"
              fill={selectedDistrict === 'Lumiar' ? 'rgba(6,182,212,0.2)' : 'url(#distGrad)'}
              stroke={selectedDistrict === 'Lumiar' ? '#06b6d4' : '#334155'}
              strokeWidth={selectedDistrict === 'Lumiar' ? '2' : '1'}
              className="transition-all duration-300"
            />
            <text x="365" y="95" fill="#94a3b8" fontSize="10" fontWeight="600">Lumiar</text>

            {/* ========================================================= */}
            {/* 1. TODAS AS LUZES DA RUA (STREET LAMPS)                   */}
            {/* ========================================================= */}
            {showStreetLamps && filteredStreetLamps.map(lamp => {
              const { x, y } = coordsToSvg(lamp.lat, lamp.lng);
              const isSelected = selectedStreetLamp?.id === lamp.id;
              const isLit = lamp.status === 'on' || lamp.status === 'dimmed';
              const isFault = lamp.status === 'fault';
              const lampColor = isFault ? '#ef4444' : lamp.status === 'dimmed' ? '#f59e0b' : '#fde047';

              return (
                <g
                  key={lamp.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer transition-transform hover:scale-150"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearInspectors();
                    setSelectedStreetLamp(lamp);
                  }}
                >
                  {/* Glowing halo in Night Mode if turned on */}
                  {isNightMode && isLit && (
                    <circle
                      r={lamp.status === 'dimmed' ? 9 : 14}
                      fill={lampColor}
                      opacity={lamp.status === 'dimmed' ? '0.2' : '0.35'}
                      filter="url(#lampGlow)"
                    />
                  )}

                  {/* Red pulse if lamp has fault */}
                  {isFault && (
                    <circle
                      r="12"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      className="animate-ping opacity-80"
                    />
                  )}

                  {/* Street Lamp Post Base */}
                  <circle
                    r={isSelected ? 5 : 3.5}
                    fill={isLit ? lampColor : isFault ? '#ef4444' : '#64748b'}
                    stroke={isSelected ? '#ffffff' : '#0f172a'}
                    strokeWidth={isSelected ? 2 : 1}
                  />

                  {/* Tiny lightbulb beam icon when lit */}
                  {isLit && (
                    <circle r="1.5" fill="#ffffff" />
                  )}

                  <title>{`${lamp.code} - ${lamp.street_name} (${lamp.status === 'on' ? 'Ligado 100%' : lamp.status === 'dimmed' ? 'Dimerizado 40%' : lamp.status === 'fault' ? 'Avaria/Fundida' : 'Desligado'})`}</title>
                </g>
              );
            })}

            {/* ========================================================= */}
            {/* 2. CONTENTORES AZUIS (PAPEL & CARTÃO / ECOPONTOS AZUIS)  */}
            {/* ========================================================= */}
            {showBlueBins && filteredBlueBins.map(bin => {
              const { x, y } = coordsToSvg(bin.lat, bin.lng);
              const isSelected = selectedBlueBin?.id === bin.id;
              const isFull = bin.is_full; // >= 80%

              return (
                <g
                  key={bin.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearInspectors();
                    setSelectedBlueBin(bin);
                  }}
                >
                  {/* Warning pulse if container is full */}
                  {isFull && (
                    <circle
                      r="16"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Blue Bin Body (Square Container) */}
                  <rect
                    x="-7"
                    y="-7"
                    width="14"
                    height="14"
                    rx="3"
                    fill={isFull ? '#1d4ed8' : '#2563eb'}
                    stroke={isFull ? '#ef4444' : isSelected ? '#ffffff' : '#93c5fd'}
                    strokeWidth={isFull || isSelected ? 2.5 : 1.5}
                    className="shadow-lg"
                  />

                  {/* Iconic paper slot slit on the blue bin */}
                  <line x1="-4" y1="-3" x2="4" y2="-3" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />

                  {/* Fill Level gauge bar inside bin */}
                  <rect
                    x="-5"
                    y="1"
                    width="10"
                    height="4"
                    rx="1"
                    fill="#1e293b"
                  />
                  <rect
                    x="-5"
                    y="1"
                    width={(bin.fill_level / 100) * 10}
                    height="4"
                    rx="1"
                    fill={isFull ? '#ef4444' : bin.fill_level > 60 ? '#f59e0b' : '#38bdf8'}
                  />

                  {/* Tiny Full label if full */}
                  {isFull && (
                    <circle cx="6" cy="-6" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                  )}

                  <title>{`[Contentor Azul] ${bin.name}: ${bin.fill_level}% (${isFull ? 'CHEIO / RECOLHA URGENTE' : 'Normal'})`}</title>
                </g>
              );
            })}

            {/* ========================================================= */}
            {/* 3. TODOS OS SEMÁFOROS (TRAFFIC LIGHTS EM TEMPO REAL)      */}
            {/* ========================================================= */}
            {showTrafficLights && filteredTrafficLights.map(tl => {
              const { x, y } = coordsToSvg(tl.lat, tl.lng);
              const isSelected = selectedTrafficLight?.id === tl.id;
              const color = tl.state === 'green' ? '#10b981' : tl.state === 'yellow' ? '#f59e0b' : '#ef4444';

              return (
                <g
                  key={tl.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer transition-transform hover:scale-130"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearInspectors();
                    setSelectedTrafficLight(tl);
                  }}
                >
                  {/* Traffic Light Glow in Night Mode */}
                  {isNightMode && (
                    <circle
                      r="12"
                      fill={color}
                      opacity="0.35"
                      filter="url(#trafficGlow)"
                    />
                  )}

                  {/* Pulsating wave when on green or red */}
                  <circle
                    r="9"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.8"
                  />

                  {/* Traffic Light Housing (Pillbox shape) */}
                  <rect
                    x="-5"
                    y="-9"
                    width="10"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#475569"
                    strokeWidth="1.2"
                  />

                  {/* Three lamp slots: Red, Yellow, Green */}
                  <circle cx="0" cy="-5" r="2.2" fill={tl.state === 'red' ? '#ef4444' : '#334155'} />
                  <circle cx="0" cy="0" r="2.2" fill={tl.state === 'yellow' ? '#f59e0b' : '#334155'} />
                  <circle cx="0" cy="5" r="2.2" fill={tl.state === 'green' ? '#10b981' : '#334155'} />

                  {/* Countdown Badge hovering on side */}
                  <g transform="translate(9, -6)">
                    <rect x="0" y="0" width="16" height="11" rx="3" fill="#020617" stroke={color} strokeWidth="1" />
                    <text x="8" y="8" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
                      {tl.countdown}s
                    </text>
                  </g>

                  <title>{`[Semáforo] ${tl.intersection_name}: Sinal ${tl.state.toUpperCase()} (${tl.countdown}s)`}</title>
                </g>
              );
            })}

            {/* ========================================================= */}
            {/* 4. SENSORES AMBIENTAIS IOT (AR, TRÁFEGO GERAL)           */}
            {/* ========================================================= */}
            {showSensors && filteredSensors.map(sensor => {
              const { x, y } = coordsToSvg(sensor.lat, sensor.lng);
              const isSelected = selectedSensor?.id === sensor.id;
              const statusColor = sensor.status === 'nominal' ? '#10b981' : sensor.status === 'warning' ? '#f59e0b' : '#ef4444';

              return (
                <g
                  key={sensor.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearInspectors();
                    setSelectedSensor(sensor);
                  }}
                >
                  <circle
                    r={isSelected ? 9 : 7}
                    fill="#020617"
                    stroke={statusColor}
                    strokeWidth={isSelected ? 3 : 2}
                  />
                  <circle r="3.5" fill={statusColor} />
                  <title>{`${sensor.name}: ${sensor.current_value} ${sensor.unit}`}</title>
                </g>
              );
            })}

            {/* ========================================================= */}
            {/* 5. OCORRÊNCIAS URBANAS                                   */}
            {/* ========================================================= */}
            {showIncidents && filteredIncidents.map(inc => {
              const { x, y } = coordsToSvg(inc.lat, inc.lng);
              const isResolved = inc.status === 'resolvido';
              const color = isResolved ? '#10b981' : inc.priority === 'critica' || inc.priority === 'alta' ? '#ef4444' : '#f59e0b';

              return (
                <g
                  key={inc.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearInspectors();
                    setSelectedIncident(inc);
                  }}
                >
                  {!isResolved && (
                    <circle r="14" fill="none" stroke={color} strokeWidth="1" className="animate-ping opacity-60" />
                  )}
                  <polygon points="0,-9 8,0 0,9 -8,0" fill={color} stroke="#ffffff" strokeWidth="1.5" />
                  <circle r="2" fill="#ffffff" />
                  <title>{`[${inc.code}] ${inc.title}`}</title>
                </g>
              );
            })}

            {/* User Picked Pin (when placing an incident) */}
            {pickedPin && (
              <g transform={`translate(${coordsToSvg(pickedPin.lat, pickedPin.lng).x}, ${coordsToSvg(pickedPin.lat, pickedPin.lng).y})`}>
                <circle r="18" fill="none" stroke="#22d3ee" strokeWidth="2" className="animate-ping" />
                <circle r="8" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                <text y="-14" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold">Local Escolhido</text>
              </g>
            )}
          </g>
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-2 shadow-2xl hidden md:block">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Infraestrutura Urbana em Tempo Real
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Semáforo Verde
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Semáforo Vermelho
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600 border border-blue-400" /> Contentor Azul
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-sm" /> Luz da Rua Acesa
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> Contentor Cheio!
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Candeeiro c/ Avaria
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INSPECTORS DRAWERS: TRAFFIC LIGHT, BLUE BIN, STREET LAMP, SENSOR, INCIDENT */}
      {/* ========================================================================= */}

      {/* 1. Traffic Light Inspector */}
      {selectedTrafficLight && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full ${
                selectedTrafficLight.state === 'green' ? 'bg-emerald-400 animate-pulse' :
                selectedTrafficLight.state === 'yellow' ? 'bg-amber-400' : 'bg-rose-500'
              }`} />
              <span className="font-bold text-white text-base">{selectedTrafficLight.intersection_name}</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                {selectedTrafficLight.code}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direção: <strong className="text-slate-300">{selectedTrafficLight.direction_label}</strong> · Freguesia: <strong className="text-slate-300">{selectedTrafficLight.district}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Estado da Fase</div>
              <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
                <span className={`capitalize ${
                  selectedTrafficLight.state === 'green' ? 'text-emerald-400' :
                  selectedTrafficLight.state === 'yellow' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  Sinal {selectedTrafficLight.state === 'green' ? 'Verde' : selectedTrafficLight.state === 'yellow' ? 'Amarelo' : 'Vermelho'}
                </span>
                <span className="text-sm text-slate-400 font-normal font-mono">
                  ({selectedTrafficLight.countdown}s restantes)
                </span>
              </div>
            </div>

            {/* Quick Action: Force Green Priority */}
            {onUpdateTrafficLight && (
              <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                <button
                  onClick={() => onUpdateTrafficLight(selectedTrafficLight.id, 'green')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Prioridade Verde
                </button>
                <button
                  onClick={() => onUpdateTrafficLight(selectedTrafficLight.id, 'red')}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
                >
                  Sinal Vermelho
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedTrafficLight(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Blue Bin (Contentor Azul) Inspector */}
      {selectedBlueBin && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600 text-white shadow-md">
                <Package className="w-4 h-4" />
              </span>
              <span className="font-bold text-white text-base">{selectedBlueBin.name}</span>
              <span className="text-xs font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                {selectedBlueBin.code}
              </span>
              {selectedBlueBin.is_full && (
                <span className="text-xs font-bold text-white bg-rose-600 px-2 py-0.5 rounded animate-pulse">
                  ALERTA: CONTENTOR CHEIO
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {selectedBlueBin.address} · Freguesia: <strong className="text-slate-300">{selectedBlueBin.district}</strong> · Esvaziado: {selectedBlueBin.last_emptied}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Nível de Enchimento</div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums flex items-center justify-end gap-2">
                <span className={selectedBlueBin.is_full ? 'text-rose-400 font-extrabold' : 'text-blue-400'}>
                  {selectedBlueBin.fill_level}%
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  ({selectedBlueBin.is_full ? 'Cheio' : 'Capacidade Normal'})
                </span>
              </div>
            </div>

            {/* Quick action to empty bin */}
            {onEmptyBlueBin && (
              <div className="border-l border-slate-800 pl-4">
                <button
                  onClick={() => onEmptyBlueBin(selectedBlueBin.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Esvaziar Contentor Azul
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedBlueBin(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Street Lamp (Luz da Rua) Inspector */}
      {selectedStreetLamp && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${
                selectedStreetLamp.status === 'fault' ? 'bg-rose-600 text-white' :
                selectedStreetLamp.status === 'on' ? 'bg-yellow-400 text-slate-950 font-bold' :
                selectedStreetLamp.status === 'dimmed' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}>
                <Lightbulb className="w-4 h-4" />
              </span>
              <span className="font-bold text-white text-base">Luminária Inteligente {selectedStreetLamp.street_name}</span>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                {selectedStreetLamp.code}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Freguesia: <strong className="text-slate-300">{selectedStreetLamp.district}</strong> · Potência: <strong className="text-slate-300">{selectedStreetLamp.power_w} W</strong> · Tecnologia LED Adaptativa
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Brilho da Luminária</div>
              <div className="text-xl font-bold font-mono text-white tabular-nums">
                {selectedStreetLamp.brightness}%{' '}
                <span className="text-xs font-normal text-slate-400">
                  ({selectedStreetLamp.status === 'on' ? '100% Noturno' : selectedStreetLamp.status === 'dimmed' ? 'Dimerizado Eco' : selectedStreetLamp.status === 'fault' ? 'Com Avaria' : 'Desligado'})
                </span>
              </div>
            </div>

            {/* Quick Actions: Toggle & Repair */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              {onToggleStreetLamp && selectedStreetLamp.status !== 'fault' && (
                <button
                  onClick={() => onToggleStreetLamp(selectedStreetLamp.id)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Alternar Intensidade
                </button>
              )}

              {selectedStreetLamp.status === 'fault' && onRepairStreetLamp && (
                <button
                  onClick={() => onRepairStreetLamp(selectedStreetLamp.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Reparar Lâmpada Fundida
                </button>
              )}
            </div>

            <button
              onClick={() => setSelectedStreetLamp(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Sensor Inspector */}
      {selectedSensor && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">{selectedSensor.name}</span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                {selectedSensor.code}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {selectedSensor.address} · Freguesia: <strong className="text-slate-300">{selectedSensor.district}</strong>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider">Leitura Atual</div>
              <div className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
                {selectedSensor.current_value} <span className="text-xs text-slate-400">{selectedSensor.unit}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSensor(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. Incident Inspector */}
      {selectedIncident && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-rose-500/20 text-rose-400 font-mono text-xs font-bold border border-rose-500/40">
                {selectedIncident.code}
              </span>
              <span className="font-bold text-white text-base">{selectedIncident.title}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl line-clamp-1">{selectedIncident.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-cyan-400 font-bold">
              ▲ {selectedIncident.upvotes} Apoios
            </div>
            <button
              onClick={() => setSelectedIncident(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
