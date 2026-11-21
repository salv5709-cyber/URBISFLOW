import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wind, 
  Zap, 
  Trash2, 
  Activity, 
  Info,
  Calendar
} from 'lucide-react';
import { IoTSensor } from '../types';

interface TelemetryChartsProps {
  sensors: IoTSensor[];
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ sensors }) => {
  const [timeframe, setTimeframe] = useState<'today' | 'week'>('today');

  // 24-hour Traffic Volume Simulation Data
  const trafficData = [
    { hour: '00h', val: 180 },
    { hour: '02h', val: 110 },
    { hour: '04h', val: 140 },
    { hour: '06h', val: 490 },
    { hour: '08h', val: 1240 },
    { hour: '09h', val: 1420 }, // Morning rush
    { hour: '11h', val: 840 },
    { hour: '13h', val: 780 },
    { hour: '15h', val: 890 },
    { hour: '18h', val: 1380 }, // Evening rush
    { hour: '20h', val: 920 },
    { hour: '22h', val: 420 },
  ];

  // Air Pollutants data in ug/m3
  const pollutants = [
    { name: 'PM2.5 (Partículas Finas)', value: 16.4, limit: 25, unit: 'µg/m³', status: 'Bom' },
    { name: 'PM10 (Partículas Inaláveis)', value: 28.1, limit: 50, unit: 'µg/m³', status: 'Bom' },
    { name: 'NO2 (Dióxido de Azoto)', value: 34.2, limit: 40, unit: 'µg/m³', status: 'Moderado' },
    { name: 'O3 (Ozono Troposférico)', value: 42.0, limit: 100, unit: 'µg/m³', status: 'Excelente' },
  ];

  // Energy & Lighting Savings Data (kWh over 5 months)
  const energyData = [
    { month: 'Jun', traditional: 4800, smart: 3100 },
    { month: 'Jul', traditional: 4600, smart: 2950 },
    { month: 'Ago', traditional: 4700, smart: 2900 },
    { month: 'Set', traditional: 5100, smart: 3250 },
    { month: 'Out', traditional: 5400, smart: 3390 },
  ];

  // Waste Bins Status by District
  const wasteBintStats = [
    { district: 'Baixa-Chiado', fill: 86, bins: 14, alert: true },
    { district: 'Alvalade', fill: 62, bins: 22, alert: false },
    { district: 'Parque das Nações', fill: 48, bins: 18, alert: false },
    { district: 'Belém', fill: 35, bins: 12, alert: false },
    { district: 'Lumiar', fill: 58, bins: 26, alert: false },
  ];

  // Max value for traffic normalization
  const maxTraffic = 1600;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Traffic Flow Velocity & Volume */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Fluxo de Tráfego Automóvel (24 Horas)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Veículos por hora em eixos radiais com limiar de saturação urbana
            </p>
          </div>

          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800">
            Fluidez 88%
          </span>
        </div>

        {/* Custom SVG Area & Line Chart */}
        <div className="pt-6">
          <div className="h-48 w-full relative">
            <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />

              {/* Saturation Threshold Red Line */}
              <line x1="0" y1="45" x2="500" y2="45" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.75" />
              <text x="495" y="40" textAnchor="end" fill="#ef4444" fontSize="9" fontWeight="bold">
                Capacidade Crítica (1.200 veíc/h)
              </text>

              {/* Path generation */}
              {(() => {
                const points = trafficData.map((d, i) => {
                  const x = (i / (trafficData.length - 1)) * 500;
                  const y = 170 - (d.val / maxTraffic) * 140;
                  return { x, y };
                });

                const dPath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`, '');
                const dArea = `${dPath} L 500,170 L 0,170 Z`;

                return (
                  <>
                    <path d={dArea} fill="url(#trafficGradient)" />
                    <path d={dPath} fill="none" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" className="transition-all hover:r-6" />
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
            {trafficData.map(d => (
              <span key={d.hour}>{d.hour}</span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Pico Matinal: 09h00 (1.420 v/h)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span> Pico Tarde: 18h00 (1.380 v/h)
            </span>
          </div>
        </div>
      </div>

      {/* Chart 2: Air Quality Index & Pollutants */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Índice de Qualidade do Ar (Monitorização IoT)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Níveis de concentração de poluentes vs. Limiares da OMS
            </p>
          </div>

          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-2 py-1 rounded border border-cyan-200 dark:border-cyan-800">
            AQI Médio: 38 (Bom)
          </span>
        </div>

        <div className="pt-4 space-y-4">
          {pollutants.map((p, idx) => {
            const percentage = Math.min(100, Math.round((p.value / p.limit) * 100));
            const isNearLimit = percentage > 80;

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{p.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      {p.value} {p.unit}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      (Limiar: {p.limit})
                    </span>
                  </div>
                </div>

                {/* Progress Bar with safety cap */}
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isNearLimit 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
            <span>
              Qualidade do ar atualmente dentro dos padrões saudáveis da Agência Portuguesa do Ambiente (APA). Sem restrições de tráfego ativas.
            </span>
          </div>
        </div>
      </div>

      {/* Chart 3: Energy Efficiency in Public Lighting */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Eficiência Energética da Iluminação Pública
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Consumo tradicional vs. Dimerização adaptativa LED inteligente (kWh)
            </p>
          </div>

          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800">
            -37.2% Poupança
          </span>
        </div>

        {/* Grouped Bar Chart */}
        <div className="pt-6">
          <div className="h-44 flex items-end justify-between gap-4 px-2">
            {energyData.map((d, i) => {
              const maxVal = 6000;
              const heightTrad = (d.traditional / maxVal) * 100;
              const heightSmart = (d.smart / maxVal) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    {/* Traditional Bar */}
                    <div
                      className="w-1/2 max-w-[20px] bg-slate-300 dark:bg-slate-700 rounded-t-sm transition-all"
                      style={{ height: `${heightTrad}%` }}
                      title={`Consumo Anterior: ${d.traditional} kWh`}
                    />
                    {/* Smart IoT Bar */}
                    <div
                      className="w-1/2 max-w-[20px] bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm transition-all shadow-sm"
                      style={{ height: `${heightSmart}%` }}
                      title={`Consumo UrbisFlow IoT: ${d.smart} kWh`}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-700"></span> Lâmpadas de Vapor de Sódio (Referência)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500"></span> Luminárias LED IoT com Dimerização
            </span>
          </div>
        </div>
      </div>

      {/* Chart 4: Smart Waste Fill Levels by District */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Ocupação dos Ecopontos e Contentores IoT
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Nível médio de enchimento por freguesia e rotas de recolha
            </p>
          </div>

          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            92 Sensores Ativos
          </span>
        </div>

        <div className="pt-4 space-y-3.5">
          {wasteBintStats.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  {item.district}
                  {item.alert && (
                    <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                      Recolha Urgente
                    </span>
                  )}
                </span>
                <span className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                  {item.fill}% ocupado · {item.bins} ecopontos
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.fill >= 80 
                      ? 'bg-rose-500' 
                      : item.fill >= 60 
                      ? 'bg-amber-500' 
                      : 'bg-cyan-500'
                  }`}
                  style={{ width: `${item.fill}%` }}
                />
              </div>
            </div>
          ))}

          <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Otimização dinâmica de rotas reduz emissões dos camiões em <strong>24%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
