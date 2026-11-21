import { TrafficLight, BlueWasteBin, StreetLamp } from '../types';

// Helper to interpolate points between two coordinates along an avenue
function generateStreetLampsAlongPath(
  streetName: string,
  district: string,
  prefix: string,
  start: [number, number],
  end: [number, number],
  count: number,
  baseWattage: number = 48
): StreetLamp[] {
  const lamps: StreetLamp[] = [];
  for (let i = 0; i < count; i++) {
    const fraction = count > 1 ? i / (count - 1) : 0;
    const lat = Number((start[0] + (end[0] - start[0]) * fraction).toFixed(5));
    const lng = Number((start[1] + (end[1] - start[1]) * fraction).toFixed(5));
    const isFault = (i === 3 && prefix === 'LUM-BEL') || (i === 5 && prefix === 'LUM-ALV');

    lamps.push({
      id: `${prefix.toLowerCase()}_${i + 1}`,
      code: `${prefix}-${(i + 1).toString().padStart(3, '0')}`,
      street_name: `${streetName} #${i + 1}`,
      district,
      lat,
      lng,
      status: isFault ? 'fault' : 'on',
      brightness: isFault ? 0 : 75,
      power_w: isFault ? 0 : Math.round(baseWattage * 0.75),
      fault_reported: isFault
    });
  }
  return lamps;
}

// 1. All Traffic Lights across Lisbon
export const INITIAL_TRAFFIC_LIGHTS: TrafficLight[] = [
  // Baixa-Chiado & Ribeirinha
  {
    id: 'sem_bx_01',
    code: 'SEM-BX-01',
    intersection_name: 'Praça dos Restauradores com Av. da Liberdade',
    district: 'Baixa-Chiado',
    lat: 38.7158,
    lng: -9.1418,
    state: 'green',
    countdown: 14,
    cycle_green: 35,
    cycle_yellow: 4,
    cycle_red: 25,
    mode: 'adaptive',
    direction_label: 'Sentido Sul (Rossio)'
  },
  {
    id: 'sem_bx_02',
    code: 'SEM-BX-02',
    intersection_name: 'Rossio com Rua do Ouro',
    district: 'Baixa-Chiado',
    lat: 38.7138,
    lng: -9.1394,
    state: 'red',
    countdown: 9,
    cycle_green: 30,
    cycle_yellow: 4,
    cycle_red: 30,
    mode: 'adaptive',
    direction_label: 'Cruzamento Pedonal Rossio'
  },
  {
    id: 'sem_bx_03',
    code: 'SEM-BX-03',
    intersection_name: 'Rua da Prata com Rua da Conceição',
    district: 'Baixa-Chiado',
    lat: 38.7105,
    lng: -9.1368,
    state: 'green',
    countdown: 22,
    cycle_green: 28,
    cycle_yellow: 3,
    cycle_red: 25,
    mode: 'adaptive',
    direction_label: 'Eixo Elétrico Carris 28E'
  },
  {
    id: 'sem_bx_04',
    code: 'SEM-BX-04',
    intersection_name: 'Terreiro do Paço com Cais das Colunas',
    district: 'Baixa-Chiado',
    lat: 38.7072,
    lng: -9.1362,
    state: 'green',
    countdown: 18,
    cycle_green: 45,
    cycle_yellow: 5,
    cycle_red: 35,
    mode: 'adaptive',
    direction_label: 'Frente Ribeirinha Av. Ribeira das Naus'
  },
  {
    id: 'sem_bx_05',
    code: 'SEM-BX-05',
    intersection_name: 'Cais do Sodré com Av. 24 de Julho',
    district: 'Baixa-Chiado',
    lat: 38.7061,
    lng: -9.1448,
    state: 'yellow',
    countdown: 3,
    cycle_green: 32,
    cycle_yellow: 4,
    cycle_red: 30,
    mode: 'adaptive',
    direction_label: 'Terminal Fluvial Cais do Sodré'
  },

  // Eixo Central & Alvalade
  {
    id: 'sem_alv_01',
    code: 'SEM-ALV-01',
    intersection_name: 'Rotunda Marquês de Pombal (Nó Poente)',
    district: 'Baixa-Chiado',
    lat: 38.7253,
    lng: -9.1500,
    state: 'green',
    countdown: 28,
    cycle_green: 45,
    cycle_yellow: 4,
    cycle_red: 35,
    mode: 'adaptive',
    direction_label: 'Acesso Túnel Marquês'
  },
  {
    id: 'sem_alv_02',
    code: 'SEM-ALV-02',
    intersection_name: 'Av. Fontes Pereira de Melo com Picoas',
    district: 'Alvalade',
    lat: 38.7302,
    lng: -9.1482,
    state: 'red',
    countdown: 16,
    cycle_green: 35,
    cycle_yellow: 4,
    cycle_red: 30,
    mode: 'adaptive',
    direction_label: 'Sentido Saldanha'
  },
  {
    id: 'sem_alv_03',
    code: 'SEM-ALV-03',
    intersection_name: 'Praça Duque de Saldanha',
    district: 'Alvalade',
    lat: 38.7348,
    lng: -9.1452,
    state: 'green',
    countdown: 19,
    cycle_green: 40,
    cycle_yellow: 4,
    cycle_red: 30,
    mode: 'adaptive',
    direction_label: 'Cruzamento Saldanha Eixo Central'
  },
  {
    id: 'sem_alv_04',
    code: 'SEM-ALV-04',
    intersection_name: 'Av. da República com Campo Pequeno',
    district: 'Alvalade',
    lat: 38.7424,
    lng: -9.1465,
    state: 'green',
    countdown: 11,
    cycle_green: 35,
    cycle_yellow: 4,
    cycle_red: 25,
    mode: 'adaptive',
    direction_label: 'Rotunda do Campo Pequeno'
  },
  {
    id: 'sem_alv_05',
    code: 'SEM-ALV-05',
    intersection_name: 'Entrecampos com Av. das Forças Armadas',
    district: 'Alvalade',
    lat: 38.7482,
    lng: -9.1492,
    state: 'red',
    countdown: 12,
    cycle_green: 35,
    cycle_yellow: 4,
    cycle_red: 35,
    mode: 'adaptive',
    direction_label: 'Interface Ferroviária Entrecampos'
  },
  {
    id: 'sem_alv_06',
    code: 'SEM-ALV-06',
    intersection_name: 'Campo Grande com 2ª Circular (Nó Norte)',
    district: 'Alvalade',
    lat: 38.7562,
    lng: -9.1538,
    state: 'yellow',
    countdown: 2,
    cycle_green: 40,
    cycle_yellow: 4,
    cycle_red: 40,
    mode: 'adaptive',
    direction_label: 'Acesso 2ª Circular Aeroporto'
  },
  {
    id: 'sem_alv_07',
    code: 'SEM-ALV-07',
    intersection_name: 'Av. dos Estados Unidos com Av. de Roma',
    district: 'Alvalade',
    lat: 38.7521,
    lng: -9.1412,
    state: 'green',
    countdown: 25,
    cycle_green: 35,
    cycle_yellow: 4,
    cycle_red: 25,
    mode: 'adaptive',
    direction_label: 'Cruzamento Roma / EUA'
  },

  // Belém & Zona Ocidental
  {
    id: 'sem_bel_01',
    code: 'SEM-BEL-01',
    intersection_name: 'Av. da Índia com Mosteiro dos Jerónimos',
    district: 'Belém',
    lat: 38.6975,
    lng: -9.2064,
    state: 'green',
    countdown: 15,
    cycle_green: 45,
    cycle_yellow: 5,
    cycle_red: 30,
    mode: 'pedestrian_priority',
    direction_label: 'Passagem Pedonal Jerónimos'
  },
  {
    id: 'sem_bel_02',
    code: 'SEM-BEL-02',
    intersection_name: 'Av. Brasília com Torre de Belém',
    district: 'Belém',
    lat: 38.6922,
    lng: -9.2152,
    state: 'red',
    countdown: 21,
    cycle_green: 30,
    cycle_yellow: 4,
    cycle_red: 30,
    mode: 'adaptive',
    direction_label: 'Avenida Marginal Brasília'
  },
  {
    id: 'sem_bel_03',
    code: 'SEM-BEL-03',
    intersection_name: 'Rua de Belém com Calçada da Ajuda',
    district: 'Belém',
    lat: 38.6988,
    lng: -9.2012,
    state: 'green',
    countdown: 33,
    cycle_green: 40,
    cycle_yellow: 4,
    cycle_red: 25,
    mode: 'adaptive',
    direction_label: 'Zona Comercial Pastéis de Belém'
  },
  {
    id: 'sem_bel_04',
    code: 'SEM-BEL-04',
    intersection_name: 'Av. de Ceuta com Alcântara Terra',
    district: 'Belém',
    lat: 38.7065,
    lng: -9.1764,
    state: 'green',
    countdown: 10,
    cycle_green: 35,
    cycle_yellow: 4,
    cycle_red: 35,
    mode: 'adaptive',
    direction_label: 'Viaduto Alcântara / Ponte 25 de Abril'
  },

  // Parque das Nações & Oriente
  {
    id: 'sem_ori_01',
    code: 'SEM-ORI-01',
    intersection_name: 'Av. Dom João II com Gare do Oriente',
    district: 'Parque das Nações',
    lat: 38.7674,
    lng: -9.0982,
    state: 'green',
    countdown: 20,
    cycle_green: 40,
    cycle_yellow: 4,
    cycle_red: 30,
    mode: 'adaptive',
    direction_label: 'Terminal Rodoviário Gare Oriente'
  },
  {
    id: 'sem_ori_02',
    code: 'SEM-ORI-02',
    intersection_name: 'Rotunda dos Vice-Reis com Av. Ulisses',
    district: 'Parque das Nações',
    lat: 38.7725,
    lng: -9.0945,
    state: 'red',
    countdown: 14,
    cycle_green: 35,
    cycle_yellow: 4,
    cycle_red: 30,
    mode: 'adaptive',
    direction_label: 'Acesso Norte Parque Tejo'
  },
  {
    id: 'sem_ori_03',
    code: 'SEM-ORI-03',
    intersection_name: 'Alameda dos Oceanos com Pavilhão de Portugal',
    district: 'Parque das Nações',
    lat: 38.7645,
    lng: -9.0962,
    state: 'green',
    countdown: 8,
    cycle_green: 30,
    cycle_yellow: 4,
    cycle_red: 30,
    mode: 'pedestrian_priority',
    direction_label: 'Passeio Marítimo e Oceanário'
  },
  {
    id: 'sem_ori_04',
    code: 'SEM-ORI-04',
    intersection_name: 'Av. Marechal Gomes da Costa com Cabo Ruivo',
    district: 'Parque das Nações',
    lat: 38.7582,
    lng: -9.1065,
    state: 'yellow',
    countdown: 4,
    cycle_green: 45,
    cycle_yellow: 4,
    cycle_red: 35,
    mode: 'adaptive',
    direction_label: 'Acesso Eixo Oriental'
  },

  // Lumiar & Telheiras
  {
    id: 'sem_lum_01',
    code: 'SEM-LUM-01',
    intersection_name: 'Alameda das Linhas de Torres com Quinta das Conchas',
    district: 'Lumiar',
    lat: 38.7695,
    lng: -9.1575,
    state: 'green',
    countdown: 17,
    cycle_green: 35,
    cycle_yellow: 4,
    cycle_red: 25,
    mode: 'adaptive',
    direction_label: 'Lumiar Centro / Metro'
  },
  {
    id: 'sem_lum_02',
    code: 'SEM-LUM-02',
    intersection_name: 'Rua Professor Francisco Gentil (Telheiras Centro)',
    district: 'Lumiar',
    lat: 38.7618,
    lng: -9.1652,
    state: 'red',
    countdown: 8,
    cycle_green: 30,
    cycle_yellow: 3,
    cycle_red: 25,
    mode: 'adaptive',
    direction_label: 'Cruzamento Metro Telheiras'
  }
];

// 2. All Blue Waste Bins (Contentores Azuis - Papel e Cartão)
export const INITIAL_BLUE_BINS: BlueWasteBin[] = [
  // Baixa-Chiado
  {
    id: 'bin_azul_01',
    code: 'ECO-AZUL-01',
    name: 'Ecoponto Azul Rua Augusta / Santa Justa',
    district: 'Baixa-Chiado',
    address: 'Rua Augusta com Rua de Santa Justa',
    lat: 38.7118,
    lng: -9.1388,
    fill_level: 94, // FULL! (Alerta de recolha)
    is_full: true,
    lid_status: 'fechado',
    temperature_c: 21.4,
    last_emptied: 'Ontem às 22:30',
    battery: 88
  },
  {
    id: 'bin_azul_02',
    code: 'ECO-AZUL-02',
    name: 'Ecoponto Azul Praça da Figueira',
    district: 'Baixa-Chiado',
    address: 'Praça da Figueira, Frente Confeitaria Nacional',
    lat: 38.7135,
    lng: -9.1375,
    fill_level: 86, // FULL!
    is_full: true,
    lid_status: 'fechado',
    temperature_c: 22.0,
    last_emptied: 'Ontem às 22:45',
    battery: 92
  },
  {
    id: 'bin_azul_03',
    code: 'ECO-AZUL-03',
    name: 'Ecoponto Azul Largo do Chiado',
    district: 'Baixa-Chiado',
    address: 'Largo do Chiado, Junto ao Café A Brasileira',
    lat: 38.7108,
    lng: -9.1422,
    fill_level: 52,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 20.8,
    last_emptied: 'Hoje às 06:15',
    battery: 95
  },
  {
    id: 'bin_azul_04',
    code: 'ECO-AZUL-04',
    name: 'Ecoponto Azul Praça do Comércio Poente',
    district: 'Baixa-Chiado',
    address: 'Praça do Comércio, Ala Poente',
    lat: 38.7082,
    lng: -9.1385,
    fill_level: 38,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 19.5,
    last_emptied: 'Hoje às 06:40',
    battery: 97
  },

  // Alvalade & Campo Grande
  {
    id: 'bin_azul_05',
    code: 'ECO-AZUL-05',
    name: 'Ecoponto Azul Av. da Igreja',
    district: 'Alvalade',
    address: 'Av. da Igreja, 42 (Mercado de Alvalade)',
    lat: 38.7518,
    lng: -9.1465,
    fill_level: 42,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 20.2,
    last_emptied: 'Hoje às 05:30',
    battery: 94
  },
  {
    id: 'bin_azul_06',
    code: 'ECO-AZUL-06',
    name: 'Ecoponto Azul Cidade Universitária',
    district: 'Alvalade',
    address: 'Alameda da Universidade, Faculdade de Letras',
    lat: 38.7538,
    lng: -9.1565,
    fill_level: 89, // FULL! (Paper from university)
    is_full: true,
    lid_status: 'fechado',
    temperature_c: 21.0,
    last_emptied: 'Há 2 dias',
    battery: 84
  },
  {
    id: 'bin_azul_07',
    code: 'ECO-AZUL-07',
    name: 'Ecoponto Azul Campo Pequeno Norte',
    district: 'Alvalade',
    address: 'Av. da República, 90',
    lat: 38.7442,
    lng: -9.1468,
    fill_level: 68,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 20.6,
    last_emptied: 'Hoje às 06:00',
    battery: 90
  },
  {
    id: 'bin_azul_08',
    code: 'ECO-AZUL-08',
    name: 'Ecoponto Azul Av. de Roma Metro',
    district: 'Alvalade',
    address: 'Av. de Roma, Saída Sul do Metro',
    lat: 38.7485,
    lng: -9.1415,
    fill_level: 59,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 19.8,
    last_emptied: 'Hoje às 07:10',
    battery: 91
  },

  // Parque das Nações
  {
    id: 'bin_azul_09',
    code: 'ECO-AZUL-09',
    name: 'Ecoponto Azul Alameda dos Oceanos',
    district: 'Parque das Nações',
    address: 'Alameda dos Oceanos, 65 (Junto à Marina)',
    lat: 38.7625,
    lng: -9.0952,
    fill_level: 34,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 18.9,
    last_emptied: 'Hoje às 08:00',
    battery: 98
  },
  {
    id: 'bin_azul_10',
    code: 'ECO-AZUL-10',
    name: 'Ecoponto Azul Gare do Oriente',
    district: 'Parque das Nações',
    address: 'Av. Dom João II, Acesso Centro Comercial Vasco da Gama',
    lat: 38.7682,
    lng: -9.0978,
    fill_level: 91, // FULL!
    is_full: true,
    lid_status: 'fechado',
    temperature_c: 22.3,
    last_emptied: 'Ontem às 21:00',
    battery: 89
  },
  {
    id: 'bin_azul_11',
    code: 'ECO-AZUL-11',
    name: 'Ecoponto Azul Pavilhão do Conhecimento',
    district: 'Parque das Nações',
    address: 'Largo José Mariano Gago',
    lat: 38.7634,
    lng: -9.0942,
    fill_level: 45,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 19.2,
    last_emptied: 'Hoje às 08:30',
    battery: 93
  },

  // Belém
  {
    id: 'bin_azul_12',
    code: 'ECO-AZUL-12',
    name: 'Ecoponto Azul Praça do Império',
    district: 'Belém',
    address: 'Praça do Império, Jardim dos Jerónimos',
    lat: 38.6965,
    lng: -9.2078,
    fill_level: 78,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 20.1,
    last_emptied: 'Ontem às 19:40',
    battery: 92
  },
  {
    id: 'bin_azul_13',
    code: 'ECO-AZUL-13',
    name: 'Ecoponto Azul CCB / Belém',
    district: 'Belém',
    address: 'Praça Bartolomeu Dias (Centro Cultural de Belém)',
    lat: 38.6955,
    lng: -9.2098,
    fill_level: 28,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 19.0,
    last_emptied: 'Hoje às 07:45',
    battery: 96
  },
  {
    id: 'bin_azul_14',
    code: 'ECO-AZUL-14',
    name: 'Ecoponto Azul Doca de Belém',
    district: 'Belém',
    address: 'Av. Brasília, Junto ao Padrão dos Descobrimentos',
    lat: 38.6934,
    lng: -9.2055,
    fill_level: 82, // FULL!
    is_full: true,
    lid_status: 'fechado',
    temperature_c: 21.6,
    last_emptied: 'Há 1 dia',
    battery: 87
  },

  // Lumiar
  {
    id: 'bin_azul_15',
    code: 'ECO-AZUL-15',
    name: 'Ecoponto Azul Quinta das Conchas',
    district: 'Lumiar',
    address: 'Alameda das Linhas de Torres, Entrada do Parque',
    lat: 38.7682,
    lng: -9.1565,
    fill_level: 61,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 19.9,
    last_emptied: 'Hoje às 06:10',
    battery: 94
  },
  {
    id: 'bin_azul_16',
    code: 'ECO-AZUL-16',
    name: 'Ecoponto Azul Telheiras Sul',
    district: 'Lumiar',
    address: 'Rua Professor Vieira de Almeida',
    lat: 38.7635,
    lng: -9.1625,
    fill_level: 48,
    is_full: false,
    lid_status: 'fechado',
    temperature_c: 20.0,
    last_emptied: 'Hoje às 06:50',
    battery: 95
  }
];

// 3. Complete Network of Street Lamps (Todas as luzes da rua mapeadas ao longo das vias)
export const INITIAL_STREET_LAMPS: StreetLamp[] = [
  // Av. da Liberdade Axis (14 lamps from Restauradores to Marquês)
  ...generateStreetLampsAlongPath(
    'Av. da Liberdade',
    'Baixa-Chiado',
    'LUM-LIB',
    [38.7160, -9.1420],
    [38.7250, -9.1498],
    14,
    55
  ),

  // Baixa Pombalina Pedestrian Streets (Rua Augusta - 10 lamps)
  ...generateStreetLampsAlongPath(
    'Rua Augusta Pedonal',
    'Baixa-Chiado',
    'LUM-AUG',
    [38.7088, -9.1370],
    [38.7142, -9.1388],
    10,
    40
  ),

  // Terreiro do Paço Waterfront Arcade (8 lamps)
  ...generateStreetLampsAlongPath(
    'Praça do Comércio Colunata',
    'Baixa-Chiado',
    'LUM-COM',
    [38.7070, -9.1390],
    [38.7074, -9.1345],
    8,
    60
  ),

  // Av. da República & Campo Pequeno (12 lamps)
  ...generateStreetLampsAlongPath(
    'Av. da República',
    'Alvalade',
    'LUM-REP',
    [38.7350, -9.1450],
    [38.7480, -9.1490],
    12,
    50
  ),

  // Campo Grande Boulevard (10 lamps)
  ...generateStreetLampsAlongPath(
    'Alameda do Campo Grande',
    'Alvalade',
    'LUM-ALV',
    [38.7510, -9.1510],
    [38.7610, -9.1580],
    10,
    50
  ),

  // 2ª Circular Expressway High-Efficiency LEDs (12 lamps)
  ...generateStreetLampsAlongPath(
    '2ª Circular Eixo Rápido',
    'Alvalade',
    'LUM-CIR',
    [38.7540, -9.1720],
    [38.7590, -9.1320],
    12,
    90
  ),

  // Belém Riverside Promenade (12 lamps along Av. Brasília and Waterfront)
  ...generateStreetLampsAlongPath(
    'Passeio Marítimo de Belém',
    'Belém',
    'LUM-BEL',
    [38.6920, -9.2170],
    [38.6970, -9.1980],
    12,
    45
  ),

  // Parque das Nações (Alameda dos Oceanos - 14 lamps)
  ...generateStreetLampsAlongPath(
    'Alameda dos Oceanos',
    'Parque das Nações',
    'LUM-OCE',
    [38.7590, -9.0980],
    [38.7740, -9.0930],
    14,
    48
  ),

  // Lumiar / Telheiras Central Avenue (8 lamps)
  ...generateStreetLampsAlongPath(
    'Alameda Linhas de Torres',
    'Lumiar',
    'LUM-TOR',
    [38.7640, -9.1590],
    [38.7730, -9.1560],
    8,
    45
  )
];
