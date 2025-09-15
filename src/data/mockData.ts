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

// Generate realistic mock data
export const generateMockAppointments = (count: number = 150): Appointment[] => {
  const appointments: Appointment[] = [];
  
  for (let i = 0; i < count; i++) {
    const createdDate = subDays(new Date(), Math.floor(Math.random() * 365));
    const appointmentDate = addDays(createdDate, Math.floor(Math.random() * 30) + 1);
    
    appointments.push({
      opportunity_id: `HJGP${String(i + 1000).slice(-3)}`,
      patient_name: generatePatientName(),
      doctor: doctors[Math.floor(Math.random() * doctors.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      procedure: procedures[Math.floor(Math.random() * procedures.length)],
      insurance: insurances[Math.floor(Math.random() * insurances.length)],
      appointment_status: getWeightedStatus(),
      phone: generatePhone(),
      created_at: createdDate.toISOString(),
      appointment_date: appointmentDate.toISOString()
    });
  }
  
  return appointments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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