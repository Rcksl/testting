import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Appointment } from '@/types';

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref<Appointment[]>([
    {
      id: '1',
      patientId: '1',
      clinicId: '2',
      doctorId: '3',
      date: '2025-01-15',
      time: '10:00',
      status: 'scheduled',
      reason: 'Regular checkup',
      paymentStatus: 'paid',
      paymentAmount: 150
    },
    {
      id: '2',
      patientId: '1',
      clinicId: '2',
      doctorId: '3',
      date: '2025-01-10',
      time: '14:00',
      status: 'completed',
      reason: 'Follow-up consultation',
      paymentStatus: 'paid',
      paymentAmount: 150
    }
  ]);

  const getAppointmentsByUser = (userId: string, role: string) => {
    if (role === 'patient') {
      return appointments.value.filter(apt => apt.patientId === userId);
    } else if (role === 'doctor') {
      return appointments.value.filter(apt => apt.doctorId === userId);
    } else if (role === 'clinic') {
      return appointments.value.filter(apt => apt.clinicId === userId);
    }
    return [];
  };

  const bookAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString()
    };
    appointments.value.push(newAppointment);
    return newAppointment;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const index = appointments.value.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments.value[index] = { ...appointments.value[index], ...updates };
    }
  };

  const cancelAppointment = (id: string) => {
    updateAppointment(id, { status: 'cancelled' });
  };

  const rescheduleAppointment = (id: string, date: string, time: string) => {
    updateAppointment(id, { date, time, status: 'rescheduled' });
  };

  return {
    appointments,
    getAppointmentsByUser,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment
  };
});