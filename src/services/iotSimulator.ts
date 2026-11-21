import { db } from './db';
import { IoTSensor } from '../types';

type Listener = () => void;

class IoTSimulationService {
  private timer: NodeJS.Timeout | null = null;
  private intervalMs: number = 4000;
  private isRunning: boolean = true;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.start();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (err) {
        console.error('Error in simulation listener', err);
      }
    });
  }

  public start() {
    if (this.timer) clearInterval(this.timer);
    this.isRunning = true;
    this.timer = setInterval(() => {
      this.tick();
    }, this.intervalMs);
  }

  public pause() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    this.notify();
  }

  public resume() {
    this.start();
    this.notify();
  }

  public setIntervalTime(ms: number) {
    this.intervalMs = ms;
    if (this.isRunning) {
      this.start();
    }
    this.notify();
  }

  public getStatus() {
    return {
      isRunning: this.isRunning,
      intervalMs: this.intervalMs
    };
  }

  private tick() {
    const sensors = db.getSensors();
    sensors.forEach(sensor => {
      let delta = (Math.random() - 0.48); // slight drift

      switch (sensor.type) {
        case 'traffic': {
          // fluctuates by +/- 20 to 50 vehicles
          const change = Math.round(delta * 40);
          const nextVal = Math.max(300, Math.min(1800, sensor.current_value + change));
          db.updateSensorValue(sensor.id, nextVal);
          break;
        }
        case 'air_quality': {
          // AQI fluctuates by +/- 2 to 5
          const change = Math.round(delta * 5);
          const nextVal = Math.max(15, Math.min(160, sensor.current_value + change));
          db.updateSensorValue(sensor.id, nextVal);
          break;
        }
        case 'waste': {
          // waste fill slowly tends to increase
          const change = Math.random() > 0.3 ? 1 : 0;
          const nextVal = Math.min(100, sensor.current_value + change);
          db.updateSensorValue(sensor.id, nextVal);
          break;
        }
        case 'energy': {
          // solar/grid generation fluctuation
          const change = Number((delta * 3).toFixed(1));
          const nextVal = Math.max(20, Math.min(250, Number((sensor.current_value + change).toFixed(1))));
          db.updateSensorValue(sensor.id, nextVal);
          break;
        }
        case 'lighting': {
          // automated dimming based on ambient light
          break;
        }
      }
    });

    // Cycle all traffic lights in real time (decrement countdown and transition green -> yellow -> red)
    db.cycleTrafficLights();

    // Natural fill evolution for Blue Waste Bins (Paper / Cardboard)
    const blueBins = db.getBlueBins();
    blueBins.forEach(bin => {
      if (Math.random() > 0.65 && bin.fill_level < 98) {
        db.updateBlueBinFill(bin.id, bin.fill_level + 1);
      }
    });

    this.notify();
  }

  // Pre-configured simulation scenarios for PAP presentation
  public triggerAnomaly(type: 'traffic_jam' | 'pollution_spike' | 'waste_overflow' | 'lighting_blackout') {
    const sensors = db.getSensors();

    switch (type) {
      case 'traffic_jam': {
        const trafficSensor = sensors.find(s => s.type === 'traffic' && s.district === 'Baixa-Chiado') || sensors[0];
        if (trafficSensor) {
          db.updateSensorValue(trafficSensor.id, 1680, 'critical');
          db.addAlert({
            title: 'Anomalia Crítica: Congestionamento Severo na Baixa',
            message: 'Fluxo automóvel atingiu 1.680 veículos/h (Capacidade 105%). Sistema ativou prioridade semafórica verde no eixo paralelo.',
            severity: 'critical',
            category: 'traffic',
            district: 'Baixa-Chiado'
          });
        }
        break;
      }
      case 'pollution_spike': {
        const airSensor = sensors.find(s => s.type === 'air_quality') || sensors[0];
        if (airSensor) {
          db.updateSensorValue(airSensor.id, 138, 'critical');
          db.addAlert({
            title: 'Alerta Ambiental: Pico de Partículas PM2.5',
            message: 'Estação ambiental registou AQI de 138 (Inversão térmica matinal). Alerta emitido para escolas e centros desportivos da área.',
            severity: 'critical',
            category: 'air_quality',
            district: airSensor.district
          });
        }
        break;
      }
      case 'waste_overflow': {
        const wasteSensor = sensors.find(s => s.type === 'waste' && s.current_value < 90) || sensors[0];
        if (wasteSensor) {
          db.updateSensorValue(wasteSensor.id, 96, 'critical');
          db.addAlert({
            title: 'Alerta Operacional: Contentor #402 em Sobrelotação (96%)',
            message: 'Sensor de ultrassons reportou saturação física. Rota de recolha municipal recalculada e atribuída automaticamente ao Piquete Gama.',
            severity: 'critical',
            category: 'waste',
            district: wasteSensor.district
          });
        }
        break;
      }
      case 'lighting_blackout': {
        const lightSensor = sensors.find(s => s.type === 'lighting') || sensors[0];
        if (lightSensor) {
          db.updateSensorValue(lightSensor.id, 0, 'critical');
          db.addAlert({
            title: 'Falha no Circuito de Iluminação Pública',
            message: 'Disparo de disjuntor diferencial no circuito de Belém. 14 luminárias inteligentes em modo de emergência por bateria.',
            severity: 'critical',
            category: 'lighting',
            district: lightSensor.district
          });
        }
        break;
      }
    }

    this.notify();
  }
}

export const iotSimulator = new IoTSimulationService();
