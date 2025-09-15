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

  // Contar por status
  const statusCounts = appointments.reduce((acc, appointment) => {
    const status = appointment.appointment_status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const confirmed = statusCounts['Confirmado'] || 0;
  const completed = statusCounts['Realizado'] || 0;
  const canceled = statusCounts['Cancelado'] || 0;
  const noShow = statusCounts['No-show'] || 0;
  const pending = statusCounts['Agendado'] || 0;

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

export function exportToCSV(appointments: Appointment[], filename?: string) {
  const headers = [
    "ID Oportunidade",
    "Paciente", 
    "Cidade",
    "Data/Hora",
    "Procedimento",
    "Médico",
    "Convênio",
    "Status",
    "Telefone",
    "Email",
    "Observações"
  ];
  
  const csvData = appointments.map(appointment => [
    appointment.opportunity_id || '',
    appointment.patient_name || '',
    appointment.city || '',
    appointment.appointment_date 
      ? new Date(appointment.appointment_date).toLocaleString('pt-BR')
      : "N/A",
    appointment.procedure || '',
    appointment.doctor || '',
    appointment.insurance || '',
    appointment.appointment_status || '',
    appointment.phone || '',
    appointment.email || '',
    appointment.notes || ''
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
