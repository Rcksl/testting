<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Appointment History</h2>
      <BaseButton variant="ghost" @click="$router.push('/doctor')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Dashboard
      </BaseButton>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <Calendar class="h-6 w-6 text-blue-600" />
          </div>
          <p class="text-2xl font-bold text-blue-600">{{ stats.total }}</p>
          <p class="text-sm text-gray-600">Total Appointments</p>
        </div>
      </BaseCard>
      
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
            <CheckCircle class="h-6 w-6 text-green-600" />
          </div>
          <p class="text-2xl font-bold text-green-600">{{ stats.completed }}</p>
          <p class="text-sm text-gray-600">Completed</p>
        </div>
      </BaseCard>
      
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
            <Users class="h-6 w-6 text-purple-600" />
          </div>
          <p class="text-2xl font-bold text-purple-600">{{ stats.patients }}</p>
          <p class="text-sm text-gray-600">Unique Patients</p>
        </div>
      </BaseCard>
      
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
            <DollarSign class="h-6 w-6 text-orange-600" />
          </div>
          <p class="text-2xl font-bold text-orange-600">${{ stats.totalEarnings }}</p>
          <p class="text-sm text-gray-600">Total Earnings</p>
        </div>
      </BaseCard>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Month</label>
          <input 
            v-model="selectedMonth" 
            type="month" 
            class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select v-model="selectedStatus" class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <BaseButton variant="outline" @click="clearFilters">
            Clear Filters
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- History List -->
    <BaseCard header="Appointment History">
      <div class="space-y-4">
        <div v-if="filteredHistory.length === 0" class="text-center py-8 text-gray-500">
          <Clock class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p>No appointment history found</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="appointment in filteredHistory" :key="appointment.id" 
               class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                  <User class="h-6 w-6 text-secondary-600" />
                </div>
                
                <div>
                  <h3 class="font-semibold text-gray-900">Patient #{{ appointment.patientId }}</h3>
                  <p class="text-sm text-gray-600">{{ appointment.reason }}</p>
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
            
            <div v-if="appointment.notes" class="mt-4 pt-4 border-t border-gray-200">
              <h4 class="text-sm font-medium text-gray-900 mb-2">Notes</h4>
              <p class="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{{ appointment.notes }}</p>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <div class="flex space-x-2">
                <BaseButton 
                  v-if="appointment.status === 'completed'" 
                  size="sm" 
                  variant="outline"
                >
                  <Download class="h-4 w-4 mr-1" />
                  Download Report
                </BaseButton>
                
                <BaseButton 
                  size="sm" 
                  variant="outline"
                  @click="showDetailsModal(appointment)"
                >
                  <Eye class="h-4 w-4 mr-1" />
                  View Details
                </BaseButton>
              </div>
              
              <div class="text-sm text-gray-500">
                Duration: {{ calculateDuration(appointment.time) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Monthly Summary -->
    <BaseCard header="Monthly Summary" v-if="selectedMonth">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <p class="text-2xl font-bold text-primary-600">{{ monthlyStats.appointments }}</p>
          <p class="text-sm text-gray-600">Appointments</p>
        </div>
        
        <div class="text-center">
          <p class="text-2xl font-bold text-green-600">{{ monthlyStats.patients }}</p>
          <p class="text-sm text-gray-600">Patients Seen</p>
        </div>
        
        <div class="text-center">
          <p class="text-2xl font-bold text-orange-600">${{ monthlyStats.earnings }}</p>
          <p class="text-sm text-gray-600">Earnings</p>
        </div>
      </div>
    </BaseCard>

    <!-- Details Modal -->
    <div v-if="showDetails && selectedAppointment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <BaseCard class="w-full max-w-lg mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700">Patient ID</label>
                <p class="text-gray-900">{{ selectedAppointment.patientId }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Date & Time</label>
                <p class="text-gray-900">{{ formatDateTime(selectedAppointment.date, selectedAppointment.time) }}</p>
              </div>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-700">Reason for Visit</label>
              <p class="text-gray-900">{{ selectedAppointment.reason }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-700">Status</label>
                <span :class="getStatusClass(selectedAppointment.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1) }}
                </span>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Fee</label>
                <p class="text-gray-900">${{ selectedAppointment.paymentAmount }}</p>
              </div>
            </div>
            
            <div v-if="selectedAppointment.notes">
              <label class="text-sm font-medium text-gray-700">Notes</label>
              <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">{{ selectedAppointment.notes }}</p>
            </div>
          </div>
          
          <div class="flex justify-end pt-4">
            <BaseButton variant="outline" @click="closeDetailsModal">
              Close
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentsStore } from '@/stores/appointments';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ArrowLeft, Calendar, CheckCircle, Users, DollarSign, Clock, User, Download, Eye } from 'lucide-vue-next';
import type { Appointment } from '@/types';

const authStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();

const selectedMonth = ref('');
const selectedStatus = ref('');
const showDetails = ref(false);
const selectedAppointment = ref<Appointment | null>(null);

const doctorAppointments = computed(() => {
  if (!authStore.user) return [];
  return appointmentsStore.getAppointmentsByUser(authStore.user.id, 'doctor')
    .filter(apt => apt.status !== 'scheduled'); // Only show past appointments
});

const filteredHistory = computed(() => {
  let appointments = doctorAppointments.value;
  
  if (selectedMonth.value) {
    const [year, month] = selectedMonth.value.split('-');
    appointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getFullYear().toString() === year && 
             (aptDate.getMonth() + 1).toString().padStart(2, '0') === month;
    });
  }
  
  if (selectedStatus.value) {
    appointments = appointments.filter(apt => apt.status === selectedStatus.value);
  }
  
  return appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const stats = computed(() => {
  const appointments = doctorAppointments.value;
  
  return {
    total: appointments.length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    patients: new Set(appointments.map(apt => apt.patientId)).size,
    totalEarnings: appointments
      .filter(apt => apt.status === 'completed' && apt.paymentStatus === 'paid')
      .reduce((sum, apt) => sum + apt.paymentAmount, 0)
  };
});

const monthlyStats = computed(() => {
  if (!selectedMonth.value) return { appointments: 0, patients: 0, earnings: 0 };
  
  const monthlyAppointments = filteredHistory.value;
  
  return {
    appointments: monthlyAppointments.length,
    patients: new Set(monthlyAppointments.map(apt => apt.patientId)).size,
    earnings: monthlyAppointments
      .filter(apt => apt.status === 'completed' && apt.paymentStatus === 'paid')
      .reduce((sum, apt) => sum + apt.paymentAmount, 0)
  };
});

const formatDateTime = (date: string, time: string) => {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })} at ${time}`;
};

const getStatusClass = (status: string) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rescheduled: 'bg-yellow-100 text-yellow-800'
  };
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const calculateDuration = (time: string) => {
  // Assume 30-minute appointments
  return '30 min';
};

const showDetailsModal = (appointment: Appointment) => {
  selectedAppointment.value = appointment;
  showDetails.value = true;
};

const closeDetailsModal = () => {
  showDetails.value = false;
  selectedAppointment.value = null;
};

const clearFilters = () => {
  selectedMonth.value = '';
  selectedStatus.value = '';
};
</script>