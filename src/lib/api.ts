// src/lib/api.ts
import { Appointment } from '@/types/appointment';

// URL da sua API do n8n
const API_BASE_URL = 'https://sputnikpro-n8n.cloudfy.live/webhook';

// Helper para limpar espaços extras de strings
const cleanString = (v: unknown, fallback: string): string => {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
};

// Função para buscar agendamentos da API real
export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    console.log('Buscando dados da API...');

    // Adiciona timestamp para evitar cache do navegador
    const response = await fetch(`${API_BASE_URL}/dashboard-data?t=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dados recebidos da API (itens):', Array.isArray(data) ? data.length : 0);

    // Mapear dados da API para o formato esperado (suporta formatos antigo e novo)
    const mappedData = Array.isArray(data)
      ? data.map((item) => {
          // n8n pode retornar [{ json: {...}, pairedItem: {...}}]
          const actualItem = item?.json ?? item;

          const id = cleanString(actualItem.appointment_id ?? actualItem.opportunity_id, '');
          const opportunityId = cleanString(actualItem.opportunity_id ?? actualItem.contact_id ?? actualItem.appointment_id, '-');

          const appointmentDate = cleanString(actualItem.start_time ?? actualItem.appointment_date, new Date().toISOString());
          const doctor = cleanString(actualItem.doctor_name ?? actualItem.doctor, 'Não informado');

          const cityPart = cleanString(actualItem.patient_city ?? actualItem.city, '');
          const statePart = cleanString(actualItem.patient_state, '');
          const city = cityPart && statePart ? `${cityPart} - ${statePart}` : (cityPart || 'Não informada');

          return {
            id,
            opportunity_id: opportunityId,
            patient_name: cleanString(actualItem.patient_name, 'Não informado'),
            doctor,
            city,
            procedure: cleanString(actualItem.procedure, 'Não informado'),
            insurance: cleanString(actualItem.insurance, 'Não informado'),
            appointment_status: cleanString(actualItem.appointment_status, 'Não Confirmada') as Appointment['appointment_status'],
            appointment_date: appointmentDate,
            created_at: cleanString(actualItem.created_at, appointmentDate),
            updated_at: cleanString(actualItem.updated_at ?? actualItem.created_at, appointmentDate),
            phone: cleanString(actualItem.patient_phone ?? actualItem.phone, ''),
            notes: '',
          };
        })
      : [];

    return mappedData;

  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return generateFallbackData();
  }
};

// Dados de fallback em caso de erro na API
const generateFallbackData = (): Appointment[] => {
  return [
    {
      id: '1',
      opportunity_id: 'opp_001',
      patient_name: 'Paciente Exemplo',
      doctor: 'Dr. Exemplo',
      city: 'Cidade Exemplo',
      procedure: 'Consulta Geral',
      insurance: 'Particular',
      appointment_status: 'Confirmada',
      appointment_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: 'Dados de exemplo - Verifique conexão com API',
    }
  ];
};

// Função para buscar agendamentos com filtros
export const fetchAppointmentsWithFilters = async (filters: {
  cidade?: string;
  medico?: string;
  status?: string;
  procedimento?: string;
  convenio?: string;
}): Promise<Appointment[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.cidade) queryParams.append('cidade', filters.cidade);
    if (filters.medico) queryParams.append('medico', filters.medico);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.procedimento) queryParams.append('procedimento', filters.procedimento);
    if (filters.convenio) queryParams.append('convenio', filters.convenio);

    const url = `${API_BASE_URL}/dashboard-data?t=${Date.now()}${queryParams.toString() ? '&' + queryParams.toString() : ''}`;
    
    console.log('URL com filtros:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    // Mapear dados filtrados (usa cleanString global)
    const mappedData = Array.isArray(data)
      ? data.map((item) => {
          const actualItem = item?.json ?? item;

          const id = cleanString(actualItem.appointment_id ?? actualItem.opportunity_id, '');
          const opportunityId = cleanString(actualItem.opportunity_id ?? actualItem.contact_id ?? actualItem.appointment_id, '-');

          const appointmentDate = cleanString(actualItem.start_time ?? actualItem.appointment_date, new Date().toISOString());
          const doctor = cleanString(actualItem.doctor_name ?? actualItem.doctor, 'Não informado');

          const cityPart = cleanString(actualItem.patient_city ?? actualItem.city, '');
          const statePart = cleanString(actualItem.patient_state, '');
          const city = cityPart && statePart ? `${cityPart} - ${statePart}` : (cityPart || 'Não informada');

          return {
            id,
            opportunity_id: opportunityId,
            patient_name: cleanString(actualItem.patient_name, 'Não informado'),
            doctor,
            city,
            procedure: cleanString(actualItem.procedure, 'Não informado'),
            insurance: cleanString(actualItem.insurance, 'Não informado'),
            appointment_status: cleanString(actualItem.appointment_status, 'Não Confirmada') as Appointment['appointment_status'],
            appointment_date: appointmentDate,
            created_at: cleanString(actualItem.created_at, appointmentDate),
            updated_at: cleanString(actualItem.updated_at ?? actualItem.created_at, appointmentDate),
            phone: cleanString(actualItem.patient_phone ?? actualItem.phone, ''),
            notes: '',
          };
        })
      : [];

    return mappedData;

  } catch (error) {
    console.error('Erro ao buscar agendamentos com filtros:', error);
    return [];
  }
};
