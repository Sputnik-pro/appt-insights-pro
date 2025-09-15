import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, AppointmentStatus } from '@/data/mockData';

interface ChartsProps {
  appointments: Appointment[];
}

const COLORS = {
  "Confirmada": "#10b981",
  "Concluída - Compareceu": "#059669", 
  "Não Confirmada": "#f59e0b",
  "Cancelada": "#ef4444",
  "Não Compareceu": "#f97316",
  "Pós Cirurgia": "#8b5cf6"
};

export function Charts({ appointments }: ChartsProps) {
  // Daily evolution data
  const dailyData = getDailyEvolutionData(appointments);
  
  // Status distribution data
  const statusData = getStatusDistribution(appointments);
  
  // Doctor performance data
  const doctorData = getDoctorPerformance(appointments);
  
  // Top procedures data
  const procedureData = getTopProcedures(appointments);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Daily Evolution Chart */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Evolução Diária de Agendamentos</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="appointments" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution Chart */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Distribuição por Status</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as AppointmentStatus]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Doctor Performance Chart */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Performance por Médico</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={doctorData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis 
                dataKey="doctor" 
                type="category" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                width={120}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="appointments" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Procedures Chart */}
      <div className="chart-card">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Top Procedimentos</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={procedureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="procedure" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function getDailyEvolutionData(appointments: Appointment[]) {
  const endDate = new Date();
  const startDate = subDays(endDate, 30);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  
  return dateRange.map(date => {
    const dayAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.created_at);
      return format(appointmentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
    
    return {
      date: format(date, 'dd/MM', { locale: ptBR }),
      appointments: dayAppointments.length
    };
  });
}

function getStatusDistribution(appointments: Appointment[]) {
  const statusCounts: Record<string, number> = {};
  
  appointments.forEach(appointment => {
    statusCounts[appointment.appointment_status] = (statusCounts[appointment.appointment_status] || 0) + 1;
  });
  
  return Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value
  }));
}

function getDoctorPerformance(appointments: Appointment[]) {
  const doctorCounts: Record<string, number> = {};
  
  appointments.forEach(appointment => {
    doctorCounts[appointment.doctor] = (doctorCounts[appointment.doctor] || 0) + 1;
  });
  
  return Object.entries(doctorCounts)
    .map(([doctor, appointments]) => ({
      doctor: doctor.replace('Dr. ', '').replace('Dra. ', ''),
      appointments
    }))
    .sort((a, b) => b.appointments - a.appointments)
    .slice(0, 8);
}

function getTopProcedures(appointments: Appointment[]) {
  const procedureCounts: Record<string, number> = {};
  
  appointments.forEach(appointment => {
    procedureCounts[appointment.procedure] = (procedureCounts[appointment.procedure] || 0) + 1;
  });
  
  return Object.entries(procedureCounts)
    .map(([procedure, count]) => ({
      procedure: procedure.length > 20 ? procedure.substring(0, 20) + '...' : procedure,
      count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}