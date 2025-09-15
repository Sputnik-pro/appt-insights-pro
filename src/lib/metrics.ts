import { Appointment, AppointmentMetrics, AppointmentStatus } from '@/types/appointment';

export function calculateMetrics(appointments: Appointment[]): AppointmentMetrics {
  const total = appointments.length;
  
  if (total === 0) {
    return {
      total: 0,
      confirmed: 0,
      completed: 0,
      canceled: 0,
      noShow: 0,
      pending: 0,
      realizationRate: 0,
      noShowRate: 0,
      confirmationRate: 0,
      cancellationRate: 0,
    };
  }

  // Contar por status (CORRIGIDO para os status reais da API)
  const statusCounts = appointments.reduce((acc, appointment) => {
    const status = appointment.appointment_status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Mapear para os status corretos da sua API
  const confirmed = statusCounts['Confirmada'] || 0;  // ← CORRIGIDO
  const completed = statusCounts['Realizada'] || 0;   // ← CORRIGIDO  
  const canceled = statusCounts['Cancelada'] || 0;    // ← CORRIGIDO
  const noShow = statusCounts['No-show'] || 0;
  const pending = statusCounts['Não Confirmada'] || 0; // ← CORRIGIDO

  // Calcular taxas
  const realizationRate = total > 0 ? (completed / total) * 100 : 0;
  const noShowRate = total > 0 ? (noShow / total) * 100 : 0;
  const confirmationRate = total > 0 ? (confirmed / total) * 100 : 0;
  const cancellationRate = total > 0 ? (canceled / total) * 100 : 0;

  return {
    total,
    confirmed,
    completed,
    canceled,
    noShow,
    pending,
    realizationRate: Number(realizationRate.toFixed(1)),
    noShowRate: Number(noShowRate.toFixed(1)),
    confirmationRate: Number(confirmationRate.toFixed(1)),
    cancellationRate: Number(cancellationRate.toFixed(1)),
  };
}

// Função para exportar dados para CSV
export function exportToCSV(appointments: Appointment[], filename?: string) {
  const headers = [
    "ID Oportunidade",
    "Paciente", 
    "Cidade",
    "Procedimento",
    "Médico",
    "Convênio",
    "Status",
    "Telefone",
    "Email"
  ];
  
  const csvData = appointments.map(appointment => [
    appointment.opportunity_id || '',
    appointment.patient_name || '',
    appointment.city || '',
    appointment.procedure || '',
    appointment.doctor || '',
    appointment.insurance || '',
    appointment.appointment_status || '',
    appointment.phone || '',
    appointment.email || ''
  ]);

  const csvContent = [
    headers.join(","),
    ...csvData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  const finalFilename = filename || `agendamentos_${new Date().toISOString().split('T')[0]}.csv`;
  
  link.setAttribute("href", url);
  link.setAttribute("download", finalFilename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
