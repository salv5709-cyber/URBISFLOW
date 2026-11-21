import React, { useState, useEffect } from 'react';
import { IoTSensor, SensorType } from '../types';
import { iotSimulator } from '../services/iotSimulator';
import { db } from '../services/db';
import { 
  Play, 
  Pause, 
  Zap, 
  Flame, 
  Trash2, 
  Wind, 
  Car, 
  Activity, 
  Radio, 
  Plus, 
  Terminal, 
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface IoTSimulatorPanelProps {
  sensors: IoTSensor[];
  onSensorUpdated: () => void;
}

export const IoTSimulatorPanel: React.FC<IoTSimulatorPanelProps> = ({
  sensors,
  onSensorUpdated
}) => {
  const [status, setStatus] = useState(iotSimulator.getStatus());
  const [selectedSpeed, setSelectedSpeed] = useState<number>(status.intervalMs);
  const [activeTab, setActiveTab] = useState<'control' | 'add_sensor' | 'mqtt_logs'>('control');
  const [lastEventMsg, setLastEventMsg] = useState<string | null>(null);

  // New Sensor form state
  const [sensorCode, setSensorCode] = useState(`IOT-SENS-${sensors.length + 1}`);
  const [sensorName, setSensorName] = useState('');
  const [sensorType, setSensorType] = useState<SensorType>('air_quality');
  const [sensorDistrict, setSensorDistrict] = useState('Baixa-Chiado');
  const [sensorAddress, setSensorAddress] = useState('');
  const [sensorLat, setSensorLat] = useState('38.7150');
  const [sensorLng, setSensorLng] = useState('-9.1400');
  const [sensorInitVal, setSensorInitVal] = useState('45');
  const [sensorUnit, setSensorUnit] = useState('AQI');

  useEffect(() => {
    const unsub = iotSimulator.subscribe(() => {
      setStatus(iotSimulator.getStatus());
    });
    return () => unsub();
  }, []);

  const handleToggleRunning = () => {
    if (status.isRunning) {
      iotSimulator.pause();
    } else {
      iotSimulator.resume();
    }
    setStatus(iotSimulator.getStatus());
  };

  const handleChangeSpeed = (ms: number) => {
    setSelectedSpeed(ms);
    iotSimulator.setIntervalTime(ms);
  };

  const handleTriggerAnomaly = (type: 'traffic_jam' | 'pollution_spike' | 'waste_overflow' | 'lighting_blackout') => {
    iotSimulator.triggerAnomaly(type);
    let desc = '';
    if (type === 'traffic_jam') desc = 'Pico de tráfego de 1.680 veíc/h injetado na Baixa!';
    if (type === 'pollution_spike') desc = 'Inversão térmica injetada: AQI 138 na estação de ar!';
    if (type === 'waste_overflow') desc = 'Contentor #402 colocado a 96% de capacidade!';
    if (type === 'lighting_blackout') desc = 'Curto-circuito simulado na rede de luminárias LED!';
    
    setLastEventMsg(desc);
    setTimeout(() => setLastEventMsg(null), 4000);
    onSensorUpdated();
  };

  const handleTriggerGreenWave = () => {
    const tls = db.getTrafficLights();
    tls.forEach(t => db.setTrafficLightState(t.id, 'green'));
    setLastEventMsg('Onda Verde Acionada! Todos os semáforos da cidade foram comutados para Verde.');
    setTimeout(() => setLastEventMsg(null), 4000);
    onSensorUpdated();
  };

  const handleTriggerBlueBinsFull = () => {
    const bins = db.getBlueBins();
    bins.forEach(b => db.updateBlueBinFill(b.id, Math.floor(88 + Math.random() * 11)));
    setLastEventMsg('Simulação de Fim de Semana: Contentores Azuis de Papelão saturados (>85%)!');
    setTimeout(() => setLastEventMsg(null), 4000);
    onSensorUpdated();
  };

  const handleAddSensor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sensorName) return;

    db.addSensor({
      code: sensorCode,
      name: sensorName,
      type: sensorType,
      district: sensorDistrict,
      address: sensorAddress || `Instalação em poste municipal, ${sensorDistrict}`,
      lat: parseFloat(sensorLat) || 38.7188,
      lng: parseFloat(sensorLng) || -9.1445,
      status: 'nominal',
      battery: 100,
      current_value: parseFloat(sensorInitVal) || 50,
      unit: sensorUnit,
      threshold_warning: sensorType === 'waste' ? 75 : 100,
      threshold_critical: sensorType === 'waste' ? 90 : 150
    });

    setLastEventMsg(`Novo sensor ${sensorCode} provisionado no mapa!`);
    setTimeout(() => setLastEventMsg(null), 3000);

    setSensorName('');
    setSensorCode(`IOT-SENS-${sensors.length + 2}`);
    onSensorUpdated();
    setActiveTab('control');
  };

  return (
    <div className="space-y-6">
      {/* Simulation Engine Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${status.isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                Simulador e Injetor de Telemetria IoT
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">
              Motor autônomo que simula leituras contínuas de sensores de hardware em campo via protocolo MQTT/HTTP.
              Ideal para demonstrações ao vivo ao Júri da PAP sem depender de dispositivos físicos exteriores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleRunning}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all ${
                status.isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold'
              }`}
            >
              {status.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {status.isRunning ? 'Pausar Simulação' : 'Retomar Simulação'}
            </button>

            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              <span className="text-[11px] text-slate-400 px-2">Taxa:</span>
              {[
                { ms: 1000, label: '1s' },
                { ms: 3000, label: '3s' },
                { ms: 6000, label: '6s' }
              ].map(s => (
                <button
                  key={s.ms}
                  onClick={() => handleChangeSpeed(s.ms)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono transition-colors ${
                    selectedSpeed === s.ms
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {lastEventMsg && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span><strong>Evento Injetado:</strong> {lastEventMsg}</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('control')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'control'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Cenários de Demonstração (Júri)
        </button>

        <button
          onClick={() => setActiveTab('add_sensor')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'add_sensor'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Provisionar Novo Sensor IoT
        </button>

        <button
          onClick={() => setActiveTab('mqtt_logs')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'mqtt_logs'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Consola MQTT / Telemetria em Tempo Real
        </button>
      </div>

      {/* Tab 1: Anomaly Trigger Scenarios */}
      {activeTab === 'control' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="max-w-2xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Injeção de Anomalias Urbanas em Tempo Real
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Clique nos botões abaixo para disparar incidentes no ecossistema e verificar como o mapa, gráficos e alertas reagem instantaneamente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <button
                onClick={() => handleTriggerAnomaly('traffic_jam')}
                className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 text-left hover:scale-[1.02] transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                  <Car className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                  Congestionamento Severo
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Eleva tráfego na Baixa para 1.680 veículos/h. Aciona plano de semaforização adaptativa.
                </p>
                <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 pt-1">
                  Disparar Anomalia →
                </div>
              </button>

              <button
                onClick={() => handleTriggerAnomaly('pollution_spike')}
                className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 text-left hover:scale-[1.02] transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Wind className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  Pico de Poluição (AQI 138)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Simula inversão térmica. AQI sobe para nível prejudicial e emite alerta ambiental.
                </p>
                <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 pt-1">
                  Disparar Anomalia →
                </div>
              </button>

              <button
                onClick={() => handleTriggerAnomaly('waste_overflow')}
                className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20 text-left hover:scale-[1.02] transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-md">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  Contentor a Transbordar
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Lotação atinge 96%. Dispara ordem direta de recolha para o Piquete Gama.
                </p>
                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
                  Disparar Anomalia →
                </div>
              </button>

              <button
                onClick={() => handleTriggerAnomaly('lighting_blackout')}
                className="p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-left hover:scale-[1.02] transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-500">
                  Apagão em Iluminação LED
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Falha de fase no quadro de Belém. 14 luminárias desligadas e chamada urgente para eletricista.
                </p>
                <div className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 pt-1">
                  Disparar Anomalia →
                </div>
              </button>

              {/* Injetor Onda Verde */}
              <button
                onClick={handleTriggerGreenWave}
                className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 text-left hover:scale-[1.02] transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md font-bold text-sm">
                  🟢
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-500">
                  Onda Verde Semafórica
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Força todos os semáforos da cidade para Sinal Verde para passagem de comboio de emergência.
                </p>
                <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 pt-1">
                  Ativar Onda Verde →
                </div>
              </button>

              {/* Injetor Contentores Azuis Cheios */}
              <button
                onClick={handleTriggerBlueBinsFull}
                className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 text-left hover:scale-[1.02] transition-all space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md font-bold text-sm">
                  📦
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500">
                  Saturar Contentores Azuis
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Eleva a ocupação dos contentores de papel/cartão para &gt;88%, acionando alerta de recolha.
                </p>
                <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 pt-1">
                  Simular Saturação →
                </div>
              </button>
            </div>
          </div>

          {/* Current Sensor States Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Sensores Ativos na Cidade ({sensors.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sensors.map(s => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">{s.code}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      s.status === 'nominal' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                      s.status === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>

                  <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{s.name}</div>
                  <div className="text-xs text-slate-500 truncate">{s.address}</div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Valor Atual:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {s.current_value} {s.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Provision New Sensor */}
      {activeTab === 'add_sensor' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Provisionamento de Novo Dispositivo IoT
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Adicione um novo nó sensor à malha municipal. Ele integrará o mapa, o motor de simulação e os alertas.
          </p>

          <form onSubmit={handleAddSensor} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Código de Hardware (EUI)
                </label>
                <input
                  type="text"
                  required
                  value={sensorCode}
                  onChange={(e) => setSensorCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome do Sensor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sensor Acústico Ruído Urbano"
                  value={sensorName}
                  onChange={(e) => setSensorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Telemetria
                </label>
                <select
                  value={sensorType}
                  onChange={(e) => {
                    const t = e.target.value as SensorType;
                    setSensorType(t);
                    if (t === 'traffic') setSensorUnit('veículos/h');
                    if (t === 'air_quality') setSensorUnit('AQI');
                    if (t === 'waste') setSensorUnit('% capacidade');
                    if (t === 'lighting') setSensorUnit('% intensidade');
                    if (t === 'energy') setSensorUnit('kW');
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="traffic">Tráfego</option>
                  <option value="air_quality">Qualidade do Ar</option>
                  <option value="waste">Resíduos</option>
                  <option value="lighting">Iluminação</option>
                  <option value="energy">Energia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Freguesia
                </label>
                <select
                  value={sensorDistrict}
                  onChange={(e) => setSensorDistrict(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Baixa-Chiado">Baixa-Chiado</option>
                  <option value="Alvalade">Alvalade</option>
                  <option value="Parque das Nações">Parque das Nações</option>
                  <option value="Belém">Belém</option>
                  <option value="Lumiar">Lumiar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Valor Inicial
                </label>
                <input
                  type="number"
                  value={sensorInitVal}
                  onChange={(e) => setSensorInitVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Latitude</label>
                <input
                  type="text"
                  value={sensorLat}
                  onChange={(e) => setSensorLat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
                <input
                  type="text"
                  value={sensorLng}
                  onChange={(e) => setSensorLng(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Registar Sensor no Sistema
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: MQTT / CoAP Packets Terminal */}
      {activeTab === 'mqtt_logs' && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-2xl text-slate-200 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-300">Broker MQTT: tls://broker.urbisflow.pt:8883/v1/telemetry</span>
            </div>
            <span className="text-[11px] text-emerald-400">● Conectado (QoS 1)</span>
          </div>

          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-2">
            {sensors.map((s, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-4">
                <span className="text-cyan-400 shrink-0">TOPIC: /urbis/telemetry/{s.type}/{s.code}</span>
                <span className="text-slate-300 text-right truncate">
                  &#123; "sensor": "{s.code}", "value": {s.current_value}, "unit": "{s.unit}", "batt": {s.battery}%, "status": "{s.status}" &#125;
                </span>
                <span className="text-slate-500 shrink-0 text-[10px]">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
