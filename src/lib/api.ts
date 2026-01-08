// src/lib/api.ts
import { Appointment } from '@/types/appointment';

// URL da sua API do n8n
const API_BASE_URL = 'https://sputnikpro-n8n.cloudfy.live/webhook';

// Função para buscar agendamentos da API real
export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    console.log('Buscando dados da API...');

    const response = await fetch(`${API_BASE_URL}/dashboard-data`, {
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

    // Mapear dados da API para o formato esperado
    const mappedData = Array.isArray(data)
      ? data.map((item) => {
          // n8n pode retornar [{ json: {...}, pairedItem: {...}}]
          const actualItem = item?.json ?? item;

          const id = actualItem.appointment_id || '';
          const appointmentDate = actualItem.start_time || new Date().toISOString();
          const doctor = actualItem.doctor_name || 'Não informado';
          const cityPart = actualItem.patient_city || '';
          const statePart = actualItem.patient_state || '';
          const city = cityPart && statePart ? `${cityPart.trim()} - ${statePart}` : (cityPart || statePart || 'Não informada');

          return {
            id,
            opportunity_id: actualItem.contact_id || actualItem.appointment_id || '-',
            patient_name: actualItem.patient_name || 'Não informado',
            doctor,
            city,
            procedure: actualItem.procedure || 'Não informado',
            insurance: actualItem.insurance || 'Não informado',
            appointment_status: actualItem.appointment_status || 'Não Confirmada',
            appointment_date: appointmentDate,
            created_at: actualItem.created_at || appointmentDate,
            updated_at: actualItem.created_at || appointmentDate,
            phone: actualItem.patient_phone || '',
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

    const url = `${API_BASE_URL}/dashboard-data${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
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
    
    // Mapear dados filtrados
    const mappedData = Array.isArray(data)
      ? data.map((item) => {
          const actualItem = item?.json ?? item;

          const id = actualItem.appointment_id || '';
          const appointmentDate = actualItem.start_time || new Date().toISOString();
          const doctor = actualItem.doctor_name || 'Não informado';
          const cityPart = actualItem.patient_city || '';
          const statePart = actualItem.patient_state || '';
          const city = cityPart && statePart ? `${cityPart.trim()} - ${statePart}` : (cityPart || statePart || 'Não informada');

          return {
            id,
            opportunity_id: actualItem.contact_id || actualItem.appointment_id || '-',
            patient_name: actualItem.patient_name || 'Não informado',
            doctor,
            city,
            procedure: actualItem.procedure || 'Não informado',
            insurance: actualItem.insurance || 'Não informado',
            appointment_status: actualItem.appointment_status || 'Não Confirmada',
            appointment_date: appointmentDate,
            created_at: actualItem.created_at || appointmentDate,
            updated_at: actualItem.created_at || appointmentDate,
            phone: actualItem.patient_phone || '',
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
