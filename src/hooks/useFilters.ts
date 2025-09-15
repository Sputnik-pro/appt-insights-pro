import { useState, useMemo } from 'react';
import { Appointment } from '@/types/appointment';

export interface Filters {
  startDate: string;
  endDate: string;
  doctor: string;
  city: string;
  status: string;
  procedure: string;
  insurance: string;
}

export interface FilterOptions {
  doctors: string[];
  cities: string[];
  statuses: string[];
  procedures: string[];
  insurances: string[];
}

const getDefaultFilters = (): Filters => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return {
    startDate: oneYearAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
    doctor: '',
    city: '',
    status: '',
    procedure: '',
    insurance: ''
  };
};

export function useFilters(appointments: Appointment[]) {
  const [filters, setFilters] = useState<Filters>(getDefaultFilters());

  // Gerar opções únicas para os filtros baseadas nos dados
  const filterOptions = useMemo((): FilterOptions => {
    const doctors = [...new Set(appointments
      .map(apt => apt.doctor)
      .filter(Boolean)
      .sort()
    )];

    const cities = [...new Set(appointments
      .map(apt => apt.city)
      .filter(Boolean)
      .sort()
    )];

    const statuses = [...new Set(appointments
      .map(apt => apt.appointment_status)
      .filter(Boolean)
      .sort()
    )];

    const procedures = [...new Set(appointments
      .map(apt => apt.procedure)
      .filter(Boolean)
      .sort()
    )];

    const insurances = [...new Set(appointments
      .map(apt => apt.insurance)
      .filter(Boolean)
      .sort()
    )];

    return {
      doctors,
      cities,
      statuses,
      procedures,
      insurances
    };
  }, [appointments]);

  // Filtrar agendamentos baseado nos filtros ativos
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // Filtro de data
      if (appointment.appointment_date) {
        const appointmentDate = new Date(appointment.appointment_date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        
        if (appointmentDate < startDate || appointmentDate > endDate) {
          return false;
        }
      }

      // Filtro de médico
      if (filters.doctor && appointment.doctor !== filters.doctor) {
        return false;
      }

      // Filtro de cidade
      if (filters.city && appointment.city !== filters.city) {
        return false;
      }

      // Filtro de status
      if (filters.status && appointment.appointment_status !== filters.status) {
        return false;
      }

      // Filtro de procedimento
      if (filters.procedure && appointment.procedure !== filters.procedure) {
        return false;
      }

      // Filtro de convênio
      if (filters.insurance && appointment.insurance !== filters.insurance) {
        return false;
      }

      return true;
    });
  }, [appointments, filters]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters(getDefaultFilters());
  };

  return {
    filters,
    filterOptions,
    filteredAppointments,
    handleFilterChange,
    clearFilters
  };
}
