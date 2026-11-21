export type UserRole = 'admin' | 'citizen' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district: string;
  avatar: string;
  phone?: string;
  joined_at: string;
}

export type SensorType = 'traffic' | 'air_quality' | 'waste' | 'lighting' | 'energy' | 'water';

export interface IoTSensor {
  id: string;
  code: string;
  name: string;
  type: SensorType;
  district: string;
  address: string;
  lat: number;
  lng: number;
  status: 'nominal' | 'warning' | 'critical' | 'offline';
  battery: number; // percentage
  current_value: number;
  unit: string;
  threshold_warning: number;
  threshold_critical: number;
  last_updated: string;
  history: { timestamp: string; value: number }[];
}

export type IncidentCategory = 
  | 'buraco_via' 
  | 'iluminacao' 
  | 'residuos' 
  | 'inundacao_agua' 
  | 'sinalizacao' 
  | 'espacos_verdes';

export type IncidentPriority = 'baixa' | 'media' | 'alta' | 'critica';

export type IncidentStatus = 'submetido' | 'triagem' | 'em_resolucao' | 'resolvido';

export interface IncidentUpdate {
  id: string;
  incident_id: string;
  user_name: string;
  user_role: UserRole;
  previous_status: IncidentStatus;
  new_status: IncidentStatus;
  comment: string;
  created_at: string;
}

export interface Incident {
  id: string;
  code: string; // e.g. OCO-2026-084
  title: string;
  description: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  status: IncidentStatus;
  district: string;
  address: string;
  lat: number;
  lng: number;
  image_url?: string;
  citizen_id: string;
  citizen_name: string;
  assigned_team_id?: string;
  assigned_team_name?: string;
  upvotes: number;
  upvoted_by: string[]; // user IDs
  updates: IncidentUpdate[];
  created_at: string;
  resolved_at?: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  code: string;
  specialization: IncidentCategory;
  leader_name: string;
  phone: string;
  active_tasks: number;
  status: 'disponivel' | 'em_servico' | 'indisponivel';
}

export interface CityDistrictStats {
  district: string;
  traffic_flow: number; // vehicles / hour
  air_quality_aqi: number; // AQI index 0-300
  waste_fill_avg: number; // %
  energy_savings_kwh: number;
  active_incidents: number;
}

export interface CityAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  category: SensorType | 'system';
  timestamp: string;
  district?: string;
  resolved: boolean;
}

export type TrafficLightState = 'green' | 'yellow' | 'red';

export interface TrafficLight {
  id: string;
  code: string;
  intersection_name: string;
  district: string;
  lat: number;
  lng: number;
  state: TrafficLightState;
  countdown: number; // seconds left in current color
  cycle_green: number; // duration of green in seconds
  cycle_yellow: number;
  cycle_red: number;
  mode: 'adaptive' | 'manual' | 'pedestrian_priority' | 'emergency';
  direction_label: string;
}

export interface BlueWasteBin {
  id: string;
  code: string;
  name: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  fill_level: number; // 0 to 100%
  is_full: boolean; // >= 80%
  lid_status: 'fechado' | 'aberto';
  temperature_c: number; // anti-fire sensor
  last_emptied: string;
  battery: number;
}

export interface StreetLamp {
  id: string;
  code: string;
  street_name: string;
  district: string;
  lat: number;
  lng: number;
  status: 'on' | 'dimmed' | 'off' | 'fault';
  brightness: number; // 0 to 100%
  power_w: number; // energy consumption in Watts
  fault_reported?: boolean;
}

