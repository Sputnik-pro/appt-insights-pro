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
    // A API retorna um array de objetos com os dados dentro da propriedade "json"
    const mappedData = Array.isArray(data) ? data.map(item => {
      const jsonData = item.json || item; // Extrai os dados do campo "json"
      
      return {
        id: jsonData.opportunity_id || jsonData.id || '',
        opportunity_id: jsonData.opportunity_id || '-',
        patient_name: jsonData.patient_name || 'Não informado',
        doctor: jsonData.doctor || 'Não informado',
        city: jsonData.city || 'Não informada',
        procedure: jsonData.procedure || 'Não informado',
        insurance: jsonData.insurance || 'Não informado',
        appointment_status: jsonData.appointment_status || 'Não Confirmada',
        appointment_date: jsonData.appointment_date || new Date().toISOString(),
        created_at: jsonData.created_at || jsonData.appointment_date || new Date().toISOString(),
        updated_at: jsonData.updated_at || jsonData.created_at || jsonData.appointment_date || new Date().toISOString(),
        phone: jsonData.phone || '',
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
      const jsonData = item.json || item; // Extrai os dados do campo "json"
      
      return {
        id: jsonData.opportunity_id || jsonData.id || '',
        opportunity_id: jsonData.opportunity_id || '-',
        patient_name: jsonData.patient_name || 'Não informado',
        doctor: jsonData.doctor || 'Não informado',
        city: jsonData.city || 'Não informada',
        procedure: jsonData.procedure || 'Não informado',
        insurance: jsonData.insurance || 'Não informado',
        appointment_status: jsonData.appointment_status || 'Não Confirmada',
        appointment_date: jsonData.appointment_date || new Date().toISOString(),
        created_at: jsonData.created_at || jsonData.appointment_date || new Date().toISOString(),
        updated_at: jsonData.updated_at || jsonData.created_at || jsonData.appointment_date || new Date().toISOString(),
        phone: jsonData.phone || '',
        notes: ''
      };
    }) : [];

    return mappedData;

  } catch (error) {
    console.error('Erro ao buscar agendamentos com filtros:', error);
    return [];
  }
};
