<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h2>
      <p class="text-gray-600">Manage your appointments and patient care</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <Calendar class="h-6 w-6 text-blue-600" />
          </div>
          <p class="text-2xl font-bold text-blue-600">{{ stats.todayAppointments }}</p>
          <p class="text-sm text-gray-600">Today's Appointments</p>
        </div>
      </BaseCard>
      
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
            <Users class="h-6 w-6 text-green-600" />
          </div>
          <p class="text-2xl font-bold text-green-600">{{ stats.totalPatients }}</p>
          <p class="text-sm text-gray-600">Total Patients</p>
        </div>
      </BaseCard>
      
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
            <CheckCircle class="h-6 w-6 text-purple-600" />
          </div>
          <p class="text-2xl font-bold text-purple-600">{{ stats.completedToday }}</p>
          <p class="text-sm text-gray-600">Completed Today</p>
        </div>
      </BaseCard>
    </div>

    <!-- Quick Actions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- View Appointments -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/doctor/appointments')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <Calendar class="h-6 w-6 text-blue-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">View Appointments</h3>
          <p class="text-gray-600">See your scheduled appointments and patient details</p>
        </div>
      </BaseCard>

      <!-- View History -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/doctor/history')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <Clock class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">View Appointment History</h3>
          <p class="text-gray-600">Review past appointments and patient interactions</p>
        </div>
      </BaseCard>

      <!-- Manage Profile -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/doctor/profile')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
            <User class="h-6 w-6 text-purple-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage Profile</h3>
          <p class="text-gray-600">Update your professional information and photo</p>
        </div>
      </BaseCard>
    </div>

    <!-- Today's Schedule -->
    <BaseCard header="Today's Schedule">
      <div class="space-y-4">
        <div v-if="todayAppointments.length === 0" class="text-center py-8 text-gray-500">
          <Calendar class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p>No appointments scheduled for today</p>
        </div>
        
        <div v-else>
          <div v-for="appointment in todayAppointments" :key="appointment.id" 
               class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p class="font-medium text-gray-900">Patient #{{ appointment.patientId }}</p>
                <p class="text-sm text-gray-600">{{ appointment.reason }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-medium text-gray-900">{{ appointment.time }}</p>
              <span :class="getStatusClass(appointment.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentsStore } from '@/stores/appointments';
import BaseCard from '@/components/BaseCard.vue';
import { Calendar, Users, CheckCircle, Clock, User } from 'lucide-vue-next';

const authStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();

const doctorAppointments = computed(() => {
  if (!authStore.user) return [];
  return appointmentsStore.getAppointmentsByUser(authStore.user.id, 'doctor');
});

const todayAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return doctorAppointments.value.filter(apt => apt.date === today);
});

const stats = computed(() => {
  const todayAppointments = todayAppointments.value.length;
  const totalPatients = new Set(doctorAppointments.value.map(apt => apt.patientId)).size;
  const completedToday = todayAppointments.value.filter(apt => apt.status === 'completed').length;
  
  return {
    todayAppointments,
    totalPatients,
    completedToday
  };
});

const getStatusClass = (status: string) => {
  const classes = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rescheduled: 'bg-yellow-100 text-yellow-800'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};
</script>