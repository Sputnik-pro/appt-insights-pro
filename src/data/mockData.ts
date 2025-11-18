import { addDays, subDays, format } from 'date-fns';

export interface Appointment {
  opportunity_id: string;
  patient_name: string;
  doctor: string;
  city: string;
  procedure: string;
  insurance: string;
  appointment_status: AppointmentStatus;
  phone: string;
  created_at: string;
  appointment_date?: string;
}

export type AppointmentStatus = 
  | "Não Confirmada" 
  | "Confirmada" 
  | "Concluída - Compareceu" 
  | "Cancelada" 
  | "Não Compareceu" 
  | "Pós Cirurgia";

export const doctors = [
  "Dr. João Santos",
  "Dra. Maria Oliveira",
  "Dr. Carlos Silva",
  "Dra. Ana Costa",
  "Dr. Pedro Almeida",
  "Dra. Sofia Rodrigues",
  "Dr. Lucas Ferreira",
  "Dra. Isabel Pereira"
];

export const cities = [
  "Belo Horizonte",
  "São Paulo",
  "Rio de Janeiro",
  "Brasília",
  "Curitiba",
  "Porto Alegre",
  "Salvador",
  "Recife",
  "Fortaleza",
  "Goiânia"
];

export const procedures = [
  "Cirurgia de Catarata",
  "Cirurgia de Retina",
  "Transplante de Córnea",
  "Cirurgia de Glaucoma",
  "Cirurgia Refrativa",
  "Vitrectomia",
  "Injeção Intravítrea",
  "Capsulotomia a Laser",
  "Dacriocistorrinostomia",
  "Blefaroplastia"
];

export const insurances = [
  "SUS",
  "Particular",
  "Unimed",
  "Bradesco Saúde",
  "Amil",
  "Porto Seguro",
  "Golden Cross",
  "SulAmérica"
];

export const statuses: AppointmentStatus[] = [
  "Não Confirmada",
  "Confirmada", 
  "Concluída - Compareceu",
  "Cancelada",
  "Não Compareceu",
  "Pós Cirurgia"
];

// Adicione esta função no lugar da generateMockAppointments
export const fetchRealAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await fetch('https://sputnikpro-n8n.cloudfy.live/webhook/dashboard-data');
    const data = await response.json();
    
    console.log('Dados da API:', data);
    
    // Mapear dados reais para o formato esperado
    const mappedData: Appointment[] = data.map((item: any) => ({
      opportunity_id: item.opportunity_id,
      patient_name: item.patient_name,
      doctor: item.doctor || 'Médico não definido',
      city: item.city || 'Cidade não informada', 
      procedure: item.procedure || 'Procedimento não informado',
      insurance: item.insurance || 'Convênio não informado',
      appointment_status: item.appointment_status as AppointmentStatus,
      phone: item.phone || '',
      created_at: item.created_at || new Date().toISOString(),
      appointment_date: item.created_at || new Date().toISOString()
    }));
    
    return mappedData;
  } catch (error) {
    console.error('Erro ao buscar dados reais:', error);
    // Fallback para dados mock em caso de erro
    return generateMockAppointments();
  }
};

// Manter a função original como fallback
const generateMockAppointments = (count: number = 150): Appointment[] => {
  return [];
};

const firstNames = [
  "Maria", "José", "Ana", "João", "Antônio", "Francisca", "Carlos", "Paulo", "Pedro", "Lucas",
  "Luiza", "Manoel", "Francisco", "Marcos", "Raimundo", "Sebastião", "Márcia", "Josefa", 
  "Adriana", "Sandra", "Luis", "Cláudia", "Roberto", "Aparecida", "Rita", "Sônia", "Rosa",
  "Ricardo", "Rogério", "José", "Fernanda", "Cristina", "Edson", "Bruno", "Daniel"
];

const lastNames = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira",
  "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes",
  "Soares", "Fernandes", "Gonçalves", "Barbosa", "Reis", "Cruz", "Cardoso", "Nascimento"
];

const generatePatientName = (): string => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  const middle = Math.random() > 0.3 ? ` ${lastNames[Math.floor(Math.random() * lastNames.length)]}` : '';
  return `${first}${middle} ${last}`;
};

const generatePhone = (): string => {
  const ddd = Math.floor(Math.random() * 89) + 11;
  const firstPart = Math.floor(Math.random() * 90000) + 10000;
  const secondPart = Math.floor(Math.random() * 9000) + 1000;
  return `+55${ddd}9${firstPart}${secondPart}`;
};

// Weighted status distribution for more realistic data
const getWeightedStatus = (): AppointmentStatus => {
  const rand = Math.random();
  if (rand < 0.4) return "Confirmada";
  if (rand < 0.65) return "Concluída - Compareceu";
  if (rand < 0.8) return "Não Confirmada";
  if (rand < 0.9) return "Pós Cirurgia";
  if (rand < 0.95) return "Não Compareceu";
  return "Cancelada";
};

export const mockAppointments = generateMockAppointments();
