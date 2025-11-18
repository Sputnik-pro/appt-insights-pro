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
    console.log('Dados recebidos da API:', data);

    // Mapear dados da API para o formato esperado
    const mappedData = Array.isArray(data) ? data.map(item => {
      return {
        id: item.appointment_id || '',
        opportunity_id: item.opportunity_id || item.appointment_id || '-',
        patient_name: item.patient_name || 'Não informado',
        doctor: item.doctor || item.doctor_name || 'Não informado',
        city: item.city || item.patient_city || 'Não informada',
        procedure: item.procedure || 'Não informado',
        insurance: item.insurance || 'Não informado',
        appointment_status: item.appointment_status || 'Não Confirmada',
        appointment_date: item.appointment_date || item.start_time || new Date().toISOString(),
        created_at: item.created_at || item.start_time || new Date().toISOString(),
        updated_at: item.updated_at || item.start_time || new Date().toISOString(),
        phone: item.phone || '',
        notes: ''
      };
    }) : [];

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
    const mappedData = Array.isArray(data) ? data.map(item => {
      return {
        id: item.appointment_id || '',
        opportunity_id: item.opportunity_id || item.appointment_id || '-',
        patient_name: item.patient_name || 'Não informado',
        doctor: item.doctor || item.doctor_name || 'Não informado',
        city: item.city || item.patient_city || 'Não informada',
        procedure: item.procedure || 'Não informado',
        insurance: item.insurance || 'Não informado',
        appointment_status: item.appointment_status || 'Não Confirmada',
        appointment_date: item.appointment_date || item.start_time || new Date().toISOString(),
        created_at: item.created_at || item.start_time || new Date().toISOString(),
        updated_at: item.updated_at || item.start_time || new Date().toISOString(),
        phone: item.phone || '',
        notes: ''
      };
    }) : [];

    return mappedData;

  } catch (error) {
    console.error('Erro ao buscar agendamentos com filtros:', error);
    return [];
  }
};
