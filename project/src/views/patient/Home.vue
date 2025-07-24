<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Patient Dashboard</h2>
      <p class="text-gray-600">Find and book appointments with healthcare providers</p>
    </div>

    <!-- Quick Actions Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Search Clinics -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/patient/search')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
            <Search class="h-6 w-6 text-primary-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Search Clinics</h3>
          <p class="text-gray-600">Find clinics by name, specialty, or services</p>
        </div>
      </BaseCard>

      <!-- View Nearby Clinics -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/patient/nearby')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-secondary-100 rounded-lg mb-4">
            <MapPin class="h-6 w-6 text-secondary-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">View Nearby Clinics</h3>
          <p class="text-gray-600">Discover healthcare providers in your area</p>
        </div>
      </BaseCard>

      <!-- Browse Clinics -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/patient/browse')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
            <Building2 class="h-6 w-6 text-purple-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Browse Clinics</h3>
          <p class="text-gray-600">Explore all available healthcare facilities</p>
        </div>
      </BaseCard>

      <!-- My Appointments -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/patient/appointments')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <Calendar class="h-6 w-6 text-blue-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">My Appointments</h3>
          <p class="text-gray-600">View and manage your scheduled appointments</p>
        </div>
      </BaseCard>

      <!-- View History -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/patient/history')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <Clock class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">View History</h3>
          <p class="text-gray-600">Review your past appointments and treatments</p>
        </div>
      </BaseCard>

      <!-- AI Chatbot -->
      <BaseCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/patient/chatbot')">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
            <MessageCircle class="h-6 w-6 text-orange-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Ask ICABay (AI Chatbot)</h3>
          <p class="text-gray-600">Get instant answers to your health questions</p>
        </div>
      </BaseCard>
    </div>

    <!-- Recent Activity -->
    <BaseCard header="Recent Activity">
      <div class="space-y-4">
        <div v-if="recentAppointments.length === 0" class="text-center py-8 text-gray-500">
          No recent activity
        </div>
        <div v-else>
          <div v-for="appointment in recentAppointments" :key="appointment.id" 
               class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p class="font-medium text-gray-900">{{ getClinicName(appointment.clinicId) }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(appointment.date) }} at {{ appointment.time }}</p>
              </div>
            </div>
            <span :class="getStatusClass(appointment.status)" class="px-2 py-1 text-xs font-medium rounded-full">
              {{ appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }}
            </span>
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
import { Search, MapPin, Building2, Calendar, Clock, MessageCircle } from 'lucide-vue-next';

const authStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();
const clinicsStore = useClinicsStore();

const recentAppointments = computed(() => {
  if (!authStore.user) return [];
  return appointmentsStore.getAppointmentsByUser(authStore.user.id, 'patient')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
});

const getClinicName = (clinicId: string) => {
  const clinic = clinicsStore.getClinicById(clinicId);
  return clinic?.clinicName || 'Unknown Clinic';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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