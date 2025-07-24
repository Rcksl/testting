<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Clinic Dashboard</h2>
      <p class="text-gray-600">Manage your clinic operations and appointments</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <User class="h-6 w-6 text-purple-600" />
          </div>
          <p class="text-2xl font-bold text-purple-600">{{ stats.totalDoctors }}</p>
          <p class="text-sm text-gray-600">Doctors</p>
        </div>
      </BaseCard>
      
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
            <Bell class="h-6 w-6 text-orange-600" />
          </div>
          <p class="text-2xl font-bold text-orange-600">{{ stats.pendingNotifications }}</p>
          <p class="text-sm text-gray-600">Notifications</p>
        </div>
      </BaseCard>
    </div>

    <!-- Quick Actions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Notifications -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/clinic/notifications')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
            <Bell class="h-6 w-6 text-orange-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
          <p class="text-gray-600">View and manage clinic notifications</p>
        </div>
      </BaseCard>

      <!-- Appointments -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/clinic/appointments')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <Calendar class="h-6 w-6 text-blue-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Appointments</h3>
          <p class="text-gray-600">Manage patient appointments</p>
        </div>
      </BaseCard>

      <!-- Doctors -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/clinic/doctors')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <Users class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Doctors</h3>
          <p class="text-gray-600">Add, edit, and manage doctors</p>
        </div>
      </BaseCard>

      <!-- Manage Clinic -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/clinic/manage')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
            <Settings class="h-6 w-6 text-purple-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage Clinic</h3>
          <p class="text-gray-600">Update clinic information and policies</p>
        </div>
      </BaseCard>
    </div>

    <!-- Recent Appointments -->
    <BaseCard header="Recent Appointments">
      <div class="space-y-4">
        <div v-if="recentAppointments.length === 0" class="text-center py-8 text-gray-500">
          No recent appointments
        </div>
        <div v-else>
          <div v-for="appointment in recentAppointments" :key="appointment.id" 
               class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p class="font-medium text-gray-900">Patient #{{ appointment.patientId }}</p>
                <p class="text-sm text-gray-500">Dr. {{ getDoctorName(appointment.doctorId) }}</p>
                <p class="text-sm text-gray-500">{{ formatDateTime(appointment.date, appointment.time) }}</p>
              </div>
            </div>
            <div class="text-right">
              <span :class="getStatusClass(appointment.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }}
              </span>
              <p class="text-sm text-gray-500 mt-1">${{ appointment.paymentAmount }}</p>
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
import { useClinicsStore } from '@/stores/clinics';
import BaseCard from '@/components/BaseCard.vue';
import { Calendar, Users, User, Bell, Settings } from 'lucide-vue-next';

const authStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();
const clinicsStore = useClinicsStore();

const clinicAppointments = computed(() => {
  if (!authStore.user) return [];
  return appointmentsStore.getAppointmentsByUser(authStore.user.id, 'clinic');
});

const recentAppointments = computed(() => {
  return clinicAppointments.value
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
});

const stats = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = clinicAppointments.value.filter(apt => apt.date === today).length;
  const totalPatients = new Set(clinicAppointments.value.map(apt => apt.patientId)).size;
  const totalDoctors = authStore.user ? clinicsStore.getDoctorsByClinic(authStore.user.id).length : 0;
  const pendingNotifications = 3; // Mock data
  
  return {
    todayAppointments,
    totalPatients,
    totalDoctors,
    pendingNotifications
  };
});

const getDoctorName = (doctorId: string) => {
  const doctor = clinicsStore.getDoctorById(doctorId);
  return doctor?.name.replace('Dr. ', '') || 'Unknown';
};

const formatDateTime = (date: string, time: string) => {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${time}`;
};

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