import { User, IoTSensor, Incident, MaintenanceTeam, CityAlert, IncidentStatus, TrafficLight, BlueWasteBin, StreetLamp } from '../types';
import { INITIAL_TRAFFIC_LIGHTS, INITIAL_BLUE_BINS, INITIAL_STREET_LAMPS } from './cityInfrastructure';

const STORAGE_KEY_PREFIX = 'urbisflow_db_';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Eng. António Duarte',
    email: 'antonio.duarte@cm-lisboa.pt',
    role: 'admin',
    district: 'Baixa-Chiado',
    avatar: '/src/assets/images/avatar_engineer_1793905665738.jpg',
    phone: '+351 210 456 700',
    joined_at: '2025-09-01T09:00:00Z'
  },
  {
    id: 'usr_cit_01',
    name: 'Ana Silva',
    email: 'ana.silva@email.pt',
    role: 'citizen',
    district: 'Lumiar',
    avatar: '/src/assets/images/avatar_citizen_1793905665289.jpg',
    phone: '+351 912 345 678',
    joined_at: '2026-01-15T14:30:00Z'
  },
  {
    id: 'usr_tech_01',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@urbisflow.pt',
    role: 'technician',
    district: 'Parque das Nações',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+351 933 888 221',
    joined_at: '2025-11-20T10:15:00Z'
  }
];

export const INITIAL_MAINTENANCE_TEAMS: MaintenanceTeam[] = [
  {
    id: 'team_01',
    name: 'Piquete Alfa - Vias & Pavimentos',
    code: 'PIQ-ALFA',
    specialization: 'buraco_via',
    leader_name: 'Eng. Pedro Cabral',
    phone: '+351 961 112 201',
    active_tasks: 2,
    status: 'em_servico'
  },
  {
    id: 'team_02',
    name: 'Piquete Beta - Iluminação Pública & Eletricidade',
    code: 'PIQ-BETA',
    specialization: 'iluminacao',
    leader_name: 'Técnico Rui Fernandes',
    phone: '+351 961 112 202',
    active_tasks: 1,
    status: 'disponivel'
  },
  {
    id: 'team_03',
    name: 'Piquete Gama - Higiene Urbana & Resíduos',
    code: 'PIQ-GAMA',
    specialization: 'residuos',
    leader_name: 'Supervisora Marta Rodrigues',
    phone: '+351 961 112 203',
    active_tasks: 3,
    status: 'em_servico'
  },
  {
    id: 'team_04',
    name: 'Piquete Delta - Redes de Água & Saneamento',
    code: 'PIQ-DELTA',
    specialization: 'inundacao_agua',
    leader_name: 'Eng. Nuno Tavares',
    phone: '+351 961 112 204',
    active_tasks: 0,
    status: 'disponivel'
  }
];

export const INITIAL_SENSORS: IoTSensor[] = [
  {
    id: 'sen_trf_01',
    code: 'IOT-TRF-01',
    name: 'Radar de Tráfego Av. da Liberdade',
    type: 'traffic',
    district: 'Baixa-Chiado',
    address: 'Av. da Liberdade, Cruzamento Restauradores',
    lat: 38.7188,
    lng: -9.1445,
    status: 'nominal',
    battery: 98,
    current_value: 840,
    unit: 'veículos/h',
    threshold_warning: 1200,
    threshold_critical: 1600,
    last_updated: new Date().toISOString(),
    history: [
      { timestamp: '08:00', value: 720 },
      { timestamp: '09:00', value: 1150 },
      { timestamp: '10:00', value: 920 },
      { timestamp: '11:00', value: 840 }
    ]
  },
  {
    id: 'sen_trf_02',
    code: 'IOT-TRF-02',
    name: 'Câmara Fluxo Circular 2ª Circular',
    type: 'traffic',
    district: 'Alvalade',
    address: '2ª Circular, Saída Campo Grande Norte',
    lat: 38.7554,
    lng: -9.1508,
    status: 'warning',
    battery: 89,
    current_value: 1390,
    unit: 'veículos/h',
    threshold_warning: 1200,
    threshold_critical: 1600,
    last_updated: new Date().toISOString(),
    history: [
      { timestamp: '08:00', value: 980 },
      { timestamp: '09:00', value: 1420 },
      { timestamp: '10:00', value: 1350 },
      { timestamp: '11:00', value: 1390 }
    ]
  },
  {
    id: 'sen_air_01',
    code: 'IOT-AIR-01',
    name: 'Estação Ambiental Terreiro do Paço',
    type: 'air_quality',
    district: 'Baixa-Chiado',
    address: 'Praça do Comércio, Frente Ribeirinha',
    lat: 38.7075,
    lng: -9.1364,
    status: 'nominal',
    battery: 94,
    current_value: 36,
    unit: 'AQI (Excelente)',
    threshold_warning: 75,
    threshold_critical: 120,
    last_updated: new Date().toISOString(),
    history: [
      { timestamp: '08:00', value: 42 },
      { timestamp: '09:00', value: 48 },
      { timestamp: '10:00', value: 39 },
      { timestamp: '11:00', value: 36 }
    ]
  },
  {
    id: 'sen_air_02',
    code: 'IOT-AIR-02',
    name: 'Sonda Atmosférica Entrecampos',
    type: 'air_quality',
    district: 'Alvalade',
    address: 'Av. da República, Estação Ferroviária',
    lat: 38.7479,
    lng: -9.1481,
    status: 'nominal',
    battery: 91,
    current_value: 58,
    unit: 'AQI (Moderado)',
    threshold_warning: 75,
    threshold_critical: 120,
    last_updated: new Date().toISOString(),
    history: [
      { timestamp: '08:00', value: 52 },
      { timestamp: '09:00', value: 71 },
      { timestamp: '10:00', value: 64 },
      { timestamp: '11:00', value: 58 }
    ]
  },
  {
    id: 'sen_wst_01',
    code: 'IOT-WST-01',
    name: 'Ecoponto Subterrâneo Oriente #14',
    type: 'waste',
    district: 'Parque das Nações',
    address: 'Alameda dos Oceanos, Junto ao Pavilhão Rosa Mota',
    lat: 38.7678,
    lng: -9.0975,
    status: 'nominal',
    battery: 95,
    current_value: 48,
    unit: '% capacidade',
    threshold_warning: 75,
    threshold_critical: 90,
    last_updated: new Date().toISOString(),
    history: [
      { timestamp: '08:00', value: 32 },
      { timestamp: '09:00', value: 38 },
      { timestamp: '10:00', value: 44 },
      { timestamp: '11:00', value: 48 }
    ]
  },
  {
    id: 'sen_wst_02',
    code: 'IOT-WST-02',
    name: 'Contentor Inteligente Rua Augusta #402',
    type: 'waste',
    district: 'Baixa-Chiado',
    address: 'Rua Augusta com Rua de Santa Justa',
    lat: 38.7118,
    lng: -9.1388,
    status: 'warning',
    battery: 82,
    current_value: 86,
    unit: '% capacidade',
    threshold_warning: 75,
    threshold_critical: 90,
    last_updated: new Date().toISOString(),
    history: [
      { timestamp: '08:00', value: 65 },
      { timestamp: '09:00', value: 74 },
      { timestamp: '10:00', value: 81 },
      { timestamp: '11:00', value: 86 }
    ]
  },
  {
    id: 'sen_lit_01',
    code: 'IOT-LIT-01',
    name: 'Luminária Adaptativa Belém Riverside',
    type: 'lighting',
    district: 'Belém',
    address: 'Av. Brasília, Torre de Belém',
    lat: 38.6916,
    lng: -9.2159,
    status: 'nominal',
    battery: 100, // grid connected
    current_value: 35, // 35% dimming daytime
    unit: '% intensidade',
    threshold_warning: 95,
    threshold_critical: 100,
    last_updated: new Date().toISOString(),
    history: [
      { timestamp: '08:00', value: 70 },
      { timestamp: '09:00', value: 40 },
      { timestamp: '10:00', value: 35 },
      { timestamp: '11:00', value: 35 }
    ]
  },
  {
    id: 'sen_nrg_01',
    code: 'IOT-NRG-01',
    name: 'Micro-Rede Fotovoltaica Parque das Nações',
    type: 'energy',
    district: 'Parque das Nações',
    address: 'Edifício Gare do Oriente',
    lat: 38.7679,
    lng: -9.0991,
    status: 'nominal',
    battery: 97,
    current_value: 142.5,
    unit: 'kW gerados',
    threshold_warning: 50,
    threshold_critical: 20,
    last_updated: new Date().toISOString(),
    history: [
      { timestamp: '08:00', value: 45 },
      { timestamp: '09:00', value: 92 },
      { timestamp: '10:00', value: 128 },
      { timestamp: '11:00', value: 142.5 }
    ]
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc_01',
    code: 'OCO-2026-001',
    title: 'Buraco profundo na faixa direita com risco para motociclistas',
    description: 'Após as chuvas de ontem abriu-se um abatimento de pavimento de cerca de 40cm de diâmetro na faixa de rodagem em direção ao Campo Grande.',
    category: 'buraco_via',
    priority: 'alta',
    status: 'em_resolucao',
    district: 'Alvalade',
    address: 'Av. dos Estados Unidos da América, 84',
    lat: 38.7512,
    lng: -9.1432,
    citizen_id: 'usr_cit_01',
    citizen_name: 'Ana Silva',
    assigned_team_id: 'team_01',
    assigned_team_name: 'Piquete Alfa - Vias & Pavimentos',
    upvotes: 14,
    upvoted_by: ['usr_cit_01', 'usr_tech_01'],
    updates: [
      {
        id: 'upd_01',
        incident_id: 'inc_01',
        user_name: 'Ana Silva',
        user_role: 'citizen',
        previous_status: 'submetido',
        new_status: 'submetido',
        comment: 'Ocorrência submetida com coordenadas GPS exatas.',
        created_at: '2026-11-04T15:20:00Z'
      },
      {
        id: 'upd_02',
        incident_id: 'inc_01',
        user_name: 'Eng. António Duarte',
        user_role: 'admin',
        previous_status: 'submetido',
        new_status: 'triagem',
        comment: 'Validado pelos serviços municipais. Risco elevado para trânsito de duas rodas.',
        created_at: '2026-11-04T16:05:00Z'
      },
      {
        id: 'upd_03',
        incident_id: 'inc_01',
        user_name: 'Eng. António Duarte',
        user_role: 'admin',
        previous_status: 'triagem',
        new_status: 'em_resolucao',
        comment: 'Atribuído ao Piquete Alfa com ordem de reparação de asfalto a frio.',
        created_at: '2026-11-05T08:30:00Z'
      }
    ],
    created_at: '2026-11-04T15:20:00Z'
  },
  {
    id: 'inc_02',
    code: 'OCO-2026-002',
    title: 'Conjunto de 3 candeeiros LED apagados na passagem de peões',
    description: 'A zona pedonal da Rua das Janelas Verdes encontra-se totalmente às escuras desde o início da semana, criando sensação de insegurança.',
    category: 'iluminacao',
    priority: 'media',
    status: 'triagem',
    district: 'Belém',
    address: 'Rua das Janelas Verdes, junto ao Chafariz',
    lat: 38.7052,
    lng: -9.1624,
    citizen_id: 'usr_cit_01',
    citizen_name: 'Ana Silva',
    upvotes: 8,
    upvoted_by: ['usr_cit_01'],
    updates: [
      {
        id: 'upd_04',
        incident_id: 'inc_02',
        user_name: 'Ana Silva',
        user_role: 'citizen',
        previous_status: 'submetido',
        new_status: 'submetido',
        comment: 'Reportado por vizinhos da rua.',
        created_at: '2026-11-03T21:10:00Z'
      },
      {
        id: 'upd_05',
        incident_id: 'inc_02',
        user_name: 'Eng. António Duarte',
        user_role: 'admin',
        previous_status: 'submetido',
        new_status: 'triagem',
        comment: 'Encaminhado para verificação do disjuntor diferencial no quadro de distribuição Q-04.',
        created_at: '2026-11-04T09:15:00Z'
      }
    ],
    created_at: '2026-11-03T21:10:00Z'
  },
  {
    id: 'inc_03',
    code: 'OCO-2026-003',
    title: 'Ecoponto verde a transbordar com vidros partidos no passeio',
    description: 'O contentor para vidro está completamente saturado há dois dias com garrafas acumuladas no chão e risco de corte para pedestres e animais de estimação.',
    category: 'residuos',
    priority: 'alta',
    status: 'submetido',
    district: 'Baixa-Chiado',
    address: 'Largo de São Domingos, Rossio',
    lat: 38.7145,
    lng: -9.1382,
    citizen_id: 'usr_cit_01',
    citizen_name: 'Ana Silva',
    upvotes: 21,
    upvoted_by: ['usr_cit_01', 'usr_admin_01'],
    updates: [
      {
        id: 'upd_06',
        incident_id: 'inc_03',
        user_name: 'Ana Silva',
        user_role: 'citizen',
        previous_status: 'submetido',
        new_status: 'submetido',
        comment: 'Foto enviada. Ecoponto a 100% de ocupação.',
        created_at: '2026-11-05T09:40:00Z'
      }
    ],
    created_at: '2026-11-05T09:40:00Z'
  },
  {
    id: 'inc_04',
    code: 'OCO-2026-004',
    title: 'Fuga contínua na conduta de água para rega de jardim',
    description: 'Água limpa a jorrar continuamente no canteiro central em frente ao metro, provocando poça de grande dimensão e desperdício hídrico.',
    category: 'inundacao_agua',
    priority: 'alta',
    status: 'resolvido',
    district: 'Parque das Nações',
    address: 'Passeio do Neptuno, 12',
    lat: 38.7645,
    lng: -9.0954,
    citizen_id: 'usr_tech_01',
    citizen_name: 'Carlos Mendes',
    assigned_team_id: 'team_04',
    assigned_team_name: 'Piquete Delta - Redes de Água',
    upvotes: 6,
    upvoted_by: ['usr_tech_01'],
    updates: [
      {
        id: 'upd_07',
        incident_id: 'inc_04',
        user_name: 'Carlos Mendes',
        user_role: 'technician',
        previous_status: 'submetido',
        new_status: 'submetido',
        comment: 'Deteção em ronda de rotina matinal.',
        created_at: '2026-11-02T08:00:00Z'
      },
      {
        id: 'upd_08',
        incident_id: 'inc_04',
        user_name: 'Eng. António Duarte',
        user_role: 'admin',
        previous_status: 'submetido',
        new_status: 'em_resolucao',
        comment: 'Válvula de corte acionada remotamente e equipa despachada.',
        created_at: '2026-11-02T08:25:00Z'
      },
      {
        id: 'upd_09',
        incident_id: 'inc_04',
        user_name: 'Carlos Mendes',
        user_role: 'technician',
        previous_status: 'em_resolucao',
        new_status: 'resolvido',
        comment: 'Tubo de polietileno substituído e teste de pressão com sucesso.',
        created_at: '2026-11-02T11:45:00Z'
      }
    ],
    created_at: '2026-11-02T08:00:00Z',
    resolved_at: '2026-11-02T11:45:00Z'
  }
];

export const INITIAL_ALERTS: CityAlert[] = [
  {
    id: 'alt_01',
    title: 'Alerta de Lotação Crítica: Ecoponto #402',
    message: 'Sensor ultrassónico registou 86% de capacidade na Rua Augusta. Sugere-se adiantar a rota de recolha.',
    severity: 'warning',
    category: 'waste',
    timestamp: 'Há 12 min',
    district: 'Baixa-Chiado',
    resolved: false
  },
  {
    id: 'alt_02',
    title: 'Densidade de Trânsito Elevada na 2ª Circular',
    message: 'Radar IOT-TRF-02 detetou 1.390 veículos/h no nó do Campo Grande. Recomenda-se ajuste de tempos semafóricos.',
    severity: 'info',
    category: 'traffic',
    timestamp: 'Há 25 min',
    district: 'Alvalade',
    resolved: false
  }
];

// In-browser Relational DB Engine
class UrbisFlowDatabase {
  private users: User[] = [];
  private sensors: IoTSensor[] = [];
  private incidents: Incident[] = [];
  private teams: MaintenanceTeam[] = [];
  private alerts: CityAlert[] = [];
  private trafficLights: TrafficLight[] = [];
  private blueBins: BlueWasteBin[] = [];
  private streetLamps: StreetLamp[] = [];
  private currentUser: User = INITIAL_USERS[0]; // Admin by default

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_PREFIX + 'users');
      const storedSensors = localStorage.getItem(STORAGE_KEY_PREFIX + 'sensors');
      const storedIncidents = localStorage.getItem(STORAGE_KEY_PREFIX + 'incidents');
      const storedTeams = localStorage.getItem(STORAGE_KEY_PREFIX + 'teams');
      const storedAlerts = localStorage.getItem(STORAGE_KEY_PREFIX + 'alerts');
      const storedCurrentUser = localStorage.getItem(STORAGE_KEY_PREFIX + 'current_user');
      const storedTrafficLights = localStorage.getItem(STORAGE_KEY_PREFIX + 'traffic_lights');
      const storedBlueBins = localStorage.getItem(STORAGE_KEY_PREFIX + 'blue_bins');
      const storedStreetLamps = localStorage.getItem(STORAGE_KEY_PREFIX + 'street_lamps');

      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
      this.sensors = storedSensors ? JSON.parse(storedSensors) : INITIAL_SENSORS;
      this.incidents = storedIncidents ? JSON.parse(storedIncidents) : INITIAL_INCIDENTS;
      this.teams = storedTeams ? JSON.parse(storedTeams) : INITIAL_MAINTENANCE_TEAMS;
      this.alerts = storedAlerts ? JSON.parse(storedAlerts) : INITIAL_ALERTS;
      this.trafficLights = storedTrafficLights ? JSON.parse(storedTrafficLights) : INITIAL_TRAFFIC_LIGHTS;
      this.blueBins = storedBlueBins ? JSON.parse(storedBlueBins) : INITIAL_BLUE_BINS;
      this.streetLamps = storedStreetLamps ? JSON.parse(storedStreetLamps) : INITIAL_STREET_LAMPS;

      if (storedCurrentUser) {
        this.currentUser = JSON.parse(storedCurrentUser);
      } else {
        this.currentUser = this.users[0];
      }

      this.persist();
    } catch {
      this.resetToDefaults();
    }
  }

  public persist() {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'sensors', JSON.stringify(this.sensors));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'incidents', JSON.stringify(this.incidents));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'teams', JSON.stringify(this.teams));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'alerts', JSON.stringify(this.alerts));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'traffic_lights', JSON.stringify(this.trafficLights));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'blue_bins', JSON.stringify(this.blueBins));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'street_lamps', JSON.stringify(this.streetLamps));
      localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user', JSON.stringify(this.currentUser));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
  }

  public resetToDefaults() {
    this.users = [...INITIAL_USERS];
    this.sensors = [...INITIAL_SENSORS];
    this.incidents = [...INITIAL_INCIDENTS];
    this.teams = [...INITIAL_MAINTENANCE_TEAMS];
    this.alerts = [...INITIAL_ALERTS];
    this.trafficLights = [...INITIAL_TRAFFIC_LIGHTS];
    this.blueBins = [...INITIAL_BLUE_BINS];
    this.streetLamps = [...INITIAL_STREET_LAMPS];
    this.currentUser = this.users[0];
    this.persist();
  }

  // Traffic Lights Management
  public getTrafficLights(): TrafficLight[] {
    return [...this.trafficLights];
  }

  public cycleTrafficLights() {
    this.trafficLights.forEach(tl => {
      tl.countdown -= 1;
      if (tl.countdown <= 0) {
        if (tl.state === 'green') {
          tl.state = 'yellow';
          tl.countdown = tl.cycle_yellow;
        } else if (tl.state === 'yellow') {
          tl.state = 'red';
          tl.countdown = tl.cycle_red;
        } else {
          tl.state = 'green';
          tl.countdown = tl.cycle_green;
        }
      }
    });
    this.persist();
  }

  public setTrafficLightState(id: string, state: TrafficLight['state']) {
    const tl = this.trafficLights.find(t => t.id === id);
    if (tl) {
      tl.state = state;
      tl.countdown = state === 'green' ? tl.cycle_green : state === 'yellow' ? tl.cycle_yellow : tl.cycle_red;
      this.persist();
    }
  }

  // Blue Waste Bins Management
  public getBlueBins(): BlueWasteBin[] {
    return [...this.blueBins];
  }

  public emptyBlueBin(id: string) {
    const bin = this.blueBins.find(b => b.id === id);
    if (bin) {
      bin.fill_level = 0;
      bin.is_full = false;
      bin.last_emptied = 'Agora mesmo';
      this.persist();
    }
  }

  public updateBlueBinFill(id: string, level: number) {
    const bin = this.blueBins.find(b => b.id === id);
    if (bin) {
      bin.fill_level = Math.max(0, Math.min(100, level));
      bin.is_full = bin.fill_level >= 80;
      if (bin.is_full) {
        this.addAlert({
          title: `Contentor Azul Cheio: ${bin.code}`,
          message: `${bin.name} atingiu ${bin.fill_level}% de capacidade. Recolha urgente de papelão necessária.`,
          severity: 'warning',
          category: 'waste',
          district: bin.district
        });
      }
      this.persist();
    }
  }

  // Street Lamps Management
  public getStreetLamps(): StreetLamp[] {
    return [...this.streetLamps];
  }

  public toggleStreetLamp(id: string) {
    const lamp = this.streetLamps.find(l => l.id === id);
    if (lamp) {
      if (lamp.status === 'on') {
        lamp.status = 'dimmed';
        lamp.brightness = 35;
        lamp.power_w = 18;
      } else if (lamp.status === 'dimmed') {
        lamp.status = 'off';
        lamp.brightness = 0;
        lamp.power_w = 0;
      } else {
        lamp.status = 'on';
        lamp.brightness = 100;
        lamp.power_w = 55;
      }
      this.persist();
    }
  }

  public setAllStreetLampsMode(mode: 'night_full' | 'eco_dimmed' | 'day_off') {
    this.streetLamps.forEach(lamp => {
      if (lamp.status === 'fault') return;
      if (mode === 'night_full') {
        lamp.status = 'on';
        lamp.brightness = 100;
        lamp.power_w = 55;
      } else if (mode === 'eco_dimmed') {
        lamp.status = 'dimmed';
        lamp.brightness = 40;
        lamp.power_w = 20;
      } else {
        lamp.status = 'off';
        lamp.brightness = 0;
        lamp.power_w = 0;
      }
    });
    this.persist();
  }

  public repairStreetLamp(id: string) {
    const lamp = this.streetLamps.find(l => l.id === id);
    if (lamp) {
      lamp.status = 'on';
      lamp.brightness = 80;
      lamp.power_w = 45;
      lamp.fault_reported = false;
      this.persist();
    }
  }

  // User Management & Roles
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public setCurrentUser(user: User) {
    this.currentUser = user;
    this.persist();
  }

  public switchRole(role: 'admin' | 'citizen' | 'technician') {
    const user = this.users.find(u => u.role === role) || this.users[0];
    this.setCurrentUser(user);
    return user;
  }

  public getUsers(): User[] {
    return [...this.users];
  }

  public registerUser(name: string, email: string, role: 'admin' | 'citizen' | 'technician', district: string, phone?: string): User {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role,
      district,
      avatar: role === 'citizen' ? '/src/assets/images/avatar_citizen_1793905665289.jpg' : '/src/assets/images/avatar_engineer_1793905665738.jpg',
      phone: phone || '+351 910 000 000',
      joined_at: new Date().toISOString()
    };
    this.users.push(newUser);
    this.setCurrentUser(newUser);
    this.persist();
    return newUser;
  }

  // Incidents CRUD & State Management
  public getIncidents(): Incident[] {
    return [...this.incidents].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getIncidentById(id: string): Incident | undefined {
    return this.incidents.find(inc => inc.id === id);
  }

  public createIncident(data: {
    title: string;
    description: string;
    category: Incident['category'];
    priority: Incident['priority'];
    district: string;
    address: string;
    lat: number;
    lng: number;
    image_url?: string;
  }): Incident {
    const count = this.incidents.length + 1;
    const code = `OCO-2026-${count.toString().padStart(3, '0')}`;
    const newIncident: Incident = {
      id: `inc_${Date.now()}`,
      code,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'submetido',
      district: data.district,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      image_url: data.image_url,
      citizen_id: this.currentUser.id,
      citizen_name: this.currentUser.name,
      upvotes: 1,
      upvoted_by: [this.currentUser.id],
      updates: [
        {
          id: `upd_${Date.now()}`,
          incident_id: `inc_${Date.now()}`,
          user_name: this.currentUser.name,
          user_role: this.currentUser.role,
          previous_status: 'submetido',
          new_status: 'submetido',
          comment: 'Ocorrência submetida com sucesso.',
          created_at: new Date().toISOString()
        }
      ],
      created_at: new Date().toISOString()
    };

    this.incidents.unshift(newIncident);
    this.persist();
    return newIncident;
  }

  public updateIncidentStatus(
    incidentId: string, 
    newStatus: IncidentStatus, 
    comment: string, 
    teamId?: string
  ): Incident | null {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) return null;

    const previousStatus = incident.status;
    incident.status = newStatus;
    
    if (teamId) {
      const team = this.teams.find(t => t.id === teamId);
      if (team) {
        incident.assigned_team_id = team.id;
        incident.assigned_team_name = team.name;
        team.active_tasks += 1;
      }
    }

    if (newStatus === 'resolvido' && !incident.resolved_at) {
      incident.resolved_at = new Date().toISOString();
      if (incident.assigned_team_id) {
        const team = this.teams.find(t => t.id === incident.assigned_team_id);
        if (team && team.active_tasks > 0) team.active_tasks -= 1;
      }
    }

    incident.updates.push({
      id: `upd_${Date.now()}`,
      incident_id: incident.id,
      user_name: this.currentUser.name,
      user_role: this.currentUser.role,
      previous_status: previousStatus,
      new_status: newStatus,
      comment: comment || `Estado atualizado para ${newStatus}.`,
      created_at: new Date().toISOString()
    });

    this.persist();
    return incident;
  }

  public toggleUpvote(incidentId: string): { upvotes: number; userHasUpvoted: boolean } {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) return { upvotes: 0, userHasUpvoted: false };

    const userId = this.currentUser.id;
    const index = incident.upvoted_by.indexOf(userId);

    if (index === -1) {
      incident.upvoted_by.push(userId);
      incident.upvotes += 1;
    } else {
      incident.upvoted_by.splice(index, 1);
      incident.upvotes = Math.max(0, incident.upvotes - 1);
    }

    this.persist();
    return {
      upvotes: incident.upvotes,
      userHasUpvoted: index === -1
    };
  }

  // IoT Sensors
  public getSensors(): IoTSensor[] {
    return [...this.sensors];
  }

  public updateSensorValue(sensorId: string, newValue: number, newStatus?: IoTSensor['status']) {
    const sensor = this.sensors.find(s => s.id === sensorId);
    if (!sensor) return;

    sensor.current_value = newValue;
    if (newStatus) {
      sensor.status = newStatus;
    } else {
      if (newValue >= sensor.threshold_critical) sensor.status = 'critical';
      else if (newValue >= sensor.threshold_warning) sensor.status = 'warning';
      else sensor.status = 'nominal';
    }

    const timeStr = new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    sensor.history.push({ timestamp: timeStr, value: newValue });
    if (sensor.history.length > 10) sensor.history.shift();
    sensor.last_updated = new Date().toISOString();

    // Check if alert needed
    if (sensor.status === 'critical' || sensor.status === 'warning') {
      this.addAlert({
        title: `Alerta: ${sensor.name}`,
        message: `Valor medido: ${newValue} ${sensor.unit} (Limiar de atenção: ${sensor.threshold_warning})`,
        severity: sensor.status === 'critical' ? 'critical' : 'warning',
        category: sensor.type,
        district: sensor.district
      });
    }

    this.persist();
  }

  public addSensor(sensorData: Omit<IoTSensor, 'id' | 'history' | 'last_updated'>): IoTSensor {
    const newSensor: IoTSensor = {
      ...sensorData,
      id: `sen_${Date.now()}`,
      last_updated: new Date().toISOString(),
      history: [
        { timestamp: '10:00', value: sensorData.current_value },
        { timestamp: '11:00', value: sensorData.current_value }
      ]
    };
    this.sensors.push(newSensor);
    this.persist();
    return newSensor;
  }

  // Alerts
  public getAlerts(): CityAlert[] {
    return [...this.alerts];
  }

  public addAlert(alertData: Omit<CityAlert, 'id' | 'timestamp' | 'resolved'>): CityAlert {
    const alert: CityAlert = {
      ...alertData,
      id: `alt_${Date.now()}`,
      timestamp: 'Agora mesmo',
      resolved: false
    };
    this.alerts.unshift(alert);
    if (this.alerts.length > 20) this.alerts.pop();
    this.persist();
    return alert;
  }

  public resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.persist();
    }
  }

  // Maintenance Teams
  public getTeams(): MaintenanceTeam[] {
    return [...this.teams];
  }

  // Relational SQL Export Generator for PAP Jury
  public generateSqlSchemaAndSeed(): string {
    return `-- ========================================================
-- UrbisFlow - Smart City Operating System
-- Script SQL DDL & DML para Base de Dados Relacional
-- Desenvolvido para PAP (Prova de Aptidão Profissional)
-- Compatível com PostgreSQL / MySQL 8.0
-- ========================================================

-- 1. Criação das Tabelas Principais (DDL)
CREATE TABLE utilizadores (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    papel_role VARCHAR(20) NOT NULL CHECK (papel_role IN ('admin', 'citizen', 'technician')),
    freguesia_distrito VARCHAR(80) NOT NULL,
    telefone VARCHAR(30),
    data_registo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE piquetes_manutencao (
    id VARCHAR(36) PRIMARY KEY,
    codigo_equipa VARCHAR(20) UNIQUE NOT NULL,
    nome_equipa VARCHAR(100) NOT NULL,
    especialidade VARCHAR(50) NOT NULL,
    responsavel_nome VARCHAR(100) NOT NULL,
    contacto_emergencia VARCHAR(30) NOT NULL,
    estado_disponibilidade VARCHAR(20) DEFAULT 'disponivel' CHECK (estado_disponibilidade IN ('disponivel', 'em_servico', 'indisponivel'))
);

CREATE TABLE sensores_iot (
    id VARCHAR(36) PRIMARY KEY,
    codigo_hardware VARCHAR(30) UNIQUE NOT NULL,
    nome_estacao VARCHAR(120) NOT NULL,
    tipo_sensor VARCHAR(30) NOT NULL CHECK (tipo_sensor IN ('traffic', 'air_quality', 'waste', 'lighting', 'energy', 'water')),
    freguesia VARCHAR(80) NOT NULL,
    morada_instalacao VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    estado_operacional VARCHAR(20) DEFAULT 'nominal' CHECK (estado_operacional IN ('nominal', 'warning', 'critical', 'offline')),
    nivel_bateria INT CHECK (nivel_bateria BETWEEN 0 AND 100),
    valor_atual DECIMAL(10, 2) NOT NULL,
    unidade_medida VARCHAR(30) NOT NULL,
    limiar_alerta DECIMAL(10, 2) NOT NULL,
    limiar_critico DECIMAL(10, 2) NOT NULL,
    ultima_comunicacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ocorrencias_cidadao (
    id VARCHAR(36) PRIMARY KEY,
    codigo_ocorrencia VARCHAR(20) UNIQUE NOT NULL,
    titulo VARCHAR(160) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(40) NOT NULL CHECK (categoria IN ('buraco_via', 'iluminacao', 'residuos', 'inundacao_agua', 'sinalizacao', 'espacos_verdes')),
    prioridade VARCHAR(20) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')),
    estado VARCHAR(20) DEFAULT 'submetido' CHECK (estado IN ('submetido', 'triagem', 'em_resolucao', 'resolvido')),
    freguesia VARCHAR(80) NOT NULL,
    morada_completa VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    cidadao_id VARCHAR(36) NOT NULL,
    piquete_id VARCHAR(36),
    total_apoios INT DEFAULT 1,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_resolucao TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_ocorrencia_cidadao FOREIGN KEY (cidadao_id) REFERENCES utilizadores(id) ON DELETE RESTRICT,
    CONSTRAINT fk_ocorrencia_piquete FOREIGN KEY (piquete_id) REFERENCES piquetes_manutencao(id) ON DELETE SET NULL
);

CREATE TABLE historico_estados_ocorrencia (
    id VARCHAR(36) PRIMARY KEY,
    ocorrencia_id VARCHAR(36) NOT NULL,
    utilizador_nome VARCHAR(120) NOT NULL,
    utilizador_papel VARCHAR(30) NOT NULL,
    estado_anterior VARCHAR(20) NOT NULL,
    novo_estado VARCHAR(20) NOT NULL,
    nota_auditoria TEXT,
    data_registo TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historico_ocorrencia FOREIGN KEY (ocorrencia_id) REFERENCES ocorrencias_cidadao(id) ON DELETE CASCADE
);

-- Índices de Desempenho e Pesquisa
CREATE INDEX idx_sensores_tipo ON sensores_iot(tipo_sensor);
CREATE INDEX idx_sensores_freguesia ON sensores_iot(freguesia);
CREATE INDEX idx_ocorrencias_estado ON ocorrencias_cidadao(estado);
CREATE INDEX idx_ocorrencias_categoria ON ocorrencias_cidadao(categoria);

-- 2. Povoamento Inicial de Dados (DML Seed)
INSERT INTO utilizadores (id, nome, email, papel_role, freguesia_distrito, telefone) VALUES
('usr_admin_01', 'Eng. António Duarte', 'antonio.duarte@cm-lisboa.pt', 'admin', 'Baixa-Chiado', '+351 210 456 700'),
('usr_cit_01', 'Ana Silva', 'ana.silva@email.pt', 'citizen', 'Lumiar', '+351 912 345 678'),
('usr_tech_01', 'Carlos Mendes', 'carlos.mendes@urbisflow.pt', 'technician', 'Parque das Nações', '+351 933 888 221');

INSERT INTO piquetes_manutencao (id, codigo_equipa, nome_equipa, especialidade, responsavel_nome, contacto_emergencia, estado_disponibilidade) VALUES
('team_01', 'PIQ-ALFA', 'Piquete Alfa - Vias & Pavimentos', 'buraco_via', 'Eng. Pedro Cabral', '+351 961 112 201', 'em_servico'),
('team_02', 'PIQ-BETA', 'Piquete Beta - Iluminação Pública', 'iluminacao', 'Técnico Rui Fernandes', '+351 961 112 202', 'disponivel'),
('team_03', 'PIQ-GAMA', 'Piquete Gama - Higiene Urbana', 'residuos', 'Supervisora Marta Rodrigues', '+351 961 112 203', 'em_servico'),
('team_04', 'PIQ-DELTA', 'Piquete Delta - Redes de Água', 'inundacao_agua', 'Eng. Nuno Tavares', '+351 961 112 204', 'disponivel');

-- Dados prontos para verificação e integridade referencial garantida!
`;
  }
}

export const db = new UrbisFlowDatabase();
