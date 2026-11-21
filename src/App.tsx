import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { iotSimulator } from './services/iotSimulator';
import { User, IoTSensor, Incident, CityAlert, MaintenanceTeam, TrafficLight, BlueWasteBin, StreetLamp, TrafficLightState } from './types';
import { Header } from './components/Header';
import { CityMap } from './components/CityMap';
import { TelemetryCharts } from './components/TelemetryCharts';
import { CitizenPortal } from './components/CitizenPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { IoTSimulatorPanel } from './components/IoTSimulatorPanel';
import { PapReportView } from './components/PapReportView';
import { AuthModal } from './components/AuthModal';
import { 
  AlertTriangle, 
  X, 
  MapPin, 
  Activity, 
  TrendingUp, 
  Wind, 
  Zap, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert, 
  SlidersHorizontal,
  ArrowRight,
  BookOpen,
  Package,
  Lightbulb
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(db.getCurrentUser());
  const [sensors, setSensors] = useState<IoTSensor[]>(db.getSensors());
  const [incidents, setIncidents] = useState<Incident[]>(db.getIncidents());
  const [alerts, setAlerts] = useState<CityAlert[]>(db.getAlerts());
  const [teams, setTeams] = useState<MaintenanceTeam[]>(db.getTeams());
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>(db.getTrafficLights());
  const [blueBins, setBlueBins] = useState<BlueWasteBin[]>(db.getBlueBins());
  const [streetLamps, setStreetLamps] = useState<StreetLamp[]>(db.getStreetLamps());
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [activeView, setActiveView] = useState<'dashboard' | 'citizen' | 'admin' | 'simulator' | 'report'>('dashboard');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mapPickerCoords, setMapPickerCoords] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [interactiveMapMode, setInteractiveMapMode] = useState<'view' | 'pick_location'>('view');

  // Initialize theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Subscribe to IoT simulation updates
  useEffect(() => {
    const unsub = iotSimulator.subscribe(() => {
      setSensors(db.getSensors());
      setAlerts(db.getAlerts());
      setTrafficLights(db.getTrafficLights());
      setBlueBins(db.getBlueBins());
      setStreetLamps(db.getStreetLamps());
    });
    return () => unsub();
  }, []);

  const refreshAllData = () => {
    setCurrentUser(db.getCurrentUser());
    setSensors(db.getSensors());
    setIncidents(db.getIncidents());
    setAlerts(db.getAlerts());
    setTeams(db.getTeams());
    setTrafficLights(db.getTrafficLights());
    setBlueBins(db.getBlueBins());
    setStreetLamps(db.getStreetLamps());
  };

  const handleUpdateTrafficLight = (id: string, state: TrafficLightState) => {
    db.setTrafficLightState(id, state);
    refreshAllData();
    showToast(`Semáforo atualizado para sinal ${state.toUpperCase()}!`);
  };

  const handleEmptyBlueBin = (id: string) => {
    db.emptyBlueBin(id);
    refreshAllData();
    showToast(`Contentor Azul de Papelão esvaziado com sucesso (0%)!`);
  };

  const handleToggleStreetLamp = (id: string) => {
    db.toggleStreetLamp(id);
    refreshAllData();
    showToast(`Intensidade da luminária ajustada!`);
  };

  const handleSetAllStreetLampsMode = (mode: 'night_full' | 'eco_dimmed' | 'day_off') => {
    db.setAllStreetLampsMode(mode);
    refreshAllData();
    const label = mode === 'night_full' ? 'Modo Noturno (100% Brilho)' : mode === 'eco_dimmed' ? 'Modo Eco (-40% Consumo)' : 'Modo Diurno';
    showToast(`Rede de iluminação pública configurada para: ${label}`);
  };

  const handleRepairStreetLamp = (id: string) => {
    db.repairStreetLamp(id);
    refreshAllData();
    showToast(`Avaria reparada! Candeeiro restaurado à operação nominal.`);
  };

  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResetDb = () => {
    db.resetToDefaults();
    refreshAllData();
    setShowResetConfirm(false);
    showToast('Base de dados restaurada com sucesso para os dados de demonstração!');
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleMapLocationPicked = (lat: number, lng: number, address: string) => {
    setMapPickerCoords({ lat, lng, address });
    setInteractiveMapMode('view');
    setActiveView('citizen');
  };

  // Unresolved critical alerts
  const criticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Navigation */}
      <Header
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAuth={() => setShowAuthModal(true)}
        onResetDb={() => setShowResetConfirm(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Critical Alert Bar if any anomaly active */}
      {criticalAlerts.length > 0 && (
        <div className="bg-rose-600 text-white px-4 py-2.5 text-xs font-medium shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
              <span>
                <strong>Alerta Crítico Municipal:</strong> {criticalAlerts[0].title} — {criticalAlerts[0].message}
              </span>
            </div>
            <button
              onClick={() => db.resolveAlert(criticalAlerts[0].id)}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded transition-colors whitespace-nowrap"
            >
              Reconhecer Alerta
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* VIEW 1: DASHBOARD PRINCIPAL */}
        {activeView === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Hero Section with High-Fidelity Asset */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900 min-h-[300px] flex flex-col justify-end">
              <img
                src="/src/assets/images/smart_city_hero_1793905665542.jpg"
                alt="Vista aérea de Lisboa Smart City"
                className="absolute inset-0 w-full h-full object-cover opacity-35 dark:opacity-45"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              <div className="relative z-10 p-6 sm:p-10 space-y-4 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-semibold tracking-wider text-cyan-300 uppercase">
                    Lisboa Smart City · Centro de Operações Urbanas
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Monitorização Inteligente e Sustentabilidade Urbana
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Centralização em tempo real de sensores de mobilidade, qualidade do ar, iluminação eficiente e gestão de resíduos. Capacitando cidadãos e gestores autárquicos para uma cidade resiliente.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveView('citizen')}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
                  >
                    Reportar Ocorrência Urbana
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveView('simulator')}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-cyan-300" />
                    Simular Telemetria IoT
                  </button>

                  <button
                    onClick={() => setActiveView('report')}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    Ver Relatório PAP (20 Val.)
                  </button>
                </div>
              </div>
            </div>

            {/* Quick KPI Cards Strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-1">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-emerald-500" /> Qualidade do Ar
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  36 AQI
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">● Excelente (OMS)</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-1">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-500" /> Tráfego Médio
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  840 <span className="text-xs font-normal text-slate-400">v/h</span>
                </div>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">Fluidez 88%</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-1">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  </span>
                  Semáforos Cidade
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {trafficLights.length} <span className="text-xs font-normal text-slate-400">nós</span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {trafficLights.filter(t => t.state === 'green').length} Verdes · {trafficLights.filter(t => t.state === 'red').length} Vermelhos
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-1">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-500" /> Contentores Azuis
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {blueBins.length} <span className="text-xs font-normal text-slate-400">ecopontos</span>
                </div>
                <span className={`text-[10px] font-bold ${
                  blueBins.filter(b => b.is_full).length > 0 ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {blueBins.filter(b => b.is_full).length > 0
                    ? `${blueBins.filter(b => b.is_full).length} Cheios (Recolha!)`
                    : 'Todos com capacidade'}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-1">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Luzes da Rua
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {streetLamps.length} <span className="text-xs font-normal text-slate-400">LED</span>
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  {streetLamps.filter(l => l.status === 'on' || l.status === 'dimmed').length} Acesas · 98% Funcional
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-1">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Poupança Rede
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  37.2%
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Dimerização IoT</span>
              </div>
            </div>

            {/* Geospatial Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Cartografia Municipal em Tempo Real
                  </h2>
                  <p className="text-xs text-slate-500">
                    Semáforos com contagem decrescente, contentores azuis de papelão com nível de enchimento e todas as luzes da rua mapeadas
                  </p>
                </div>
              </div>

              <CityMap
                sensors={sensors}
                incidents={incidents}
                trafficLights={trafficLights}
                blueBins={blueBins}
                streetLamps={streetLamps}
                onUpdateTrafficLight={handleUpdateTrafficLight}
                onEmptyBlueBin={handleEmptyBlueBin}
                onToggleStreetLamp={handleToggleStreetLamp}
                onSetAllStreetLampsMode={handleSetAllStreetLampsMode}
                onRepairStreetLamp={handleRepairStreetLamp}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                interactiveMode="view"
              />
            </div>

            {/* Dynamic Telemetry SVG Charts */}
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Análise e Séries Temporais Urbanas
                </h2>
                <p className="text-xs text-slate-500">
                  Monitorização contínua dos indicadores de mobilidade, qualidade ambiental e redes de energia
                </p>
              </div>

              <TelemetryCharts sensors={sensors} />
            </div>
          </div>
        )}

        {/* VIEW 2: PORTAL DO CIDADÃO */}
        {activeView === 'citizen' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {interactiveMapMode === 'pick_location' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-cyan-950 text-cyan-200 p-4 rounded-2xl border border-cyan-800">
                  <div>
                    <h3 className="font-bold text-base text-white">Selecione o Local no Mapa</h3>
                    <p className="text-xs text-cyan-300">
                      Clique no ponto exato da cidade onde se localiza o problema para capturar as coordenadas GPS.
                    </p>
                  </div>
                  <button
                    onClick={() => setInteractiveMapMode('view')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                  >
                    Voltar ao Formulário
                  </button>
                </div>

                <CityMap
                  sensors={sensors}
                  incidents={incidents}
                  trafficLights={trafficLights}
                  blueBins={blueBins}
                  streetLamps={streetLamps}
                  onUpdateTrafficLight={handleUpdateTrafficLight}
                  onEmptyBlueBin={handleEmptyBlueBin}
                  onToggleStreetLamp={handleToggleStreetLamp}
                  onSetAllStreetLampsMode={handleSetAllStreetLampsMode}
                  onRepairStreetLamp={handleRepairStreetLamp}
                  selectedDistrict={selectedDistrict}
                  onSelectDistrict={setSelectedDistrict}
                  interactiveMode="pick_location"
                  onMapClickCoordinates={handleMapLocationPicked}
                />
              </div>
            ) : (
              <CitizenPortal
                currentUser={currentUser}
                incidents={incidents}
                onIncidentCreated={refreshAllData}
                onOpenMapLocationPicker={() => setInteractiveMapMode('pick_location')}
                selectedLocationFromMap={mapPickerCoords}
              />
            )}
          </div>
        )}

        {/* VIEW 3: ADMINISTRAÇÃO MUNICIPAL */}
        {activeView === 'admin' && (
          <div className="animate-in fade-in duration-200">
            <AdminDashboard
              incidents={incidents}
              sensors={sensors}
              alerts={alerts}
              teams={teams}
              onDataChanged={refreshAllData}
            />
          </div>
        )}

        {/* VIEW 4: SIMULADOR IOT */}
        {activeView === 'simulator' && (
          <div className="animate-in fade-in duration-200">
            <IoTSimulatorPanel
              sensors={sensors}
              onSensorUpdated={refreshAllData}
            />
          </div>
        )}

        {/* VIEW 5: RELATÓRIO E DEFESA PAP */}
        {activeView === 'report' && (
          <div className="animate-in fade-in duration-200">
            <PapReportView />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">UrbisFlow</span>
            <span>·</span>
            <span>Projeto de Prova de Aptidão Profissional (PAP) 2025/2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Stack: React 19 + TypeScript + Tailwind v4 + PostgreSQL/MySQL</span>
            <span>·</span>
            <button
              onClick={() => setActiveView('report')}
              className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              Documentação do Trabalho (20 Valores)
            </button>
          </div>
        </div>
      </footer>

      {/* Auth & Role Switch Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onUserChanged={(user) => {
          setCurrentUser(user);
          refreshAllData();
        }}
      />

      {/* In-App Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Restaurar Dados Originais?
            </h3>
            <p className="text-xs text-slate-500">
              Esta ação irá repor os sensores, ocorrências e perfis originais pré-definidos para a demonstração da PAP.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetDb}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Confirmar Reposição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
