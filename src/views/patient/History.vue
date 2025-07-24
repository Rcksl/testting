<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Appointment History</h2>
      <BaseButton variant="ghost" @click="$router.push('/patient')">
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
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
            <XCircle class="h-6 w-6 text-red-600" />
          </div>
          <p class="text-2xl font-bold text-red-600">{{ stats.cancelled }}</p>
          <p class="text-sm text-gray-600">Cancelled</p>
        </div>
      </BaseCard>
      
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
            <DollarSign class="h-6 w-6 text-purple-600" />
          </div>
          <p class="text-2xl font-bold text-purple-600">${{ stats.totalSpent }}</p>
          <p class="text-sm text-gray-600">Total Spent</p>
        </div>
      </BaseCard>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Year</label>
          <select v-model="selectedYear" class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
            <option value="">All Years</option>
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select v-model="selectedStatus" class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Clinic</label>
          <select v-model="selectedClinic" class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
            <option value="">All Clinics</option>
            <option v-for="clinic in visitedClinics" :key="clinic.id" :value="clinic.id">
              {{ clinic.clinicName }}
            </option>
          </select>
        </div>
        
        <div class="flex items-end">
          <BaseButton variant="outline" @click="clearFilters">
            Clear Filters
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- History Timeline -->
    <BaseCard header="Your Medical History">
      <div class="space-y-6">
        <div v-if="filteredHistory.length === 0" class="text-center py-8 text-gray-500">
          <Clock class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p>No appointment history found</p>
        </div>
        
        <div v-else class="space-y-6">
          <div v-for="(group, year) in groupedHistory" :key="year" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">{{ year }}</h3>
            
            <div class="space-y-4">
              <div v-for="appointment in group" :key="appointment.id" 
                   class="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-0">
                <div class="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                
                <BaseCard class="ml-4">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4">
                      <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <Building2 class="h-6 w-6 text-white" />
                      </div>
                      
                      <div>
                        <h4 class="font-semibold text-gray-900">{{ getClinicName(appointment.clinicId) }}</h4>
                        <p class="text-sm text-gray-600">Dr. {{ getDoctorName(appointment.doctorId) }}</p>
                        <p class="text-sm text-gray-500">{{ appointment.reason }}</p>
                        <p class="text-sm font-medium text-primary-600">{{ formatDateTime(appointment.date, appointment.time) }}</p>
                      </div>
                    </div>
                    
                    <div class="text-right">
                      <span :class="getStatusClass(appointment.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }}
                      </span>
                      <p class="text-sm text-gray-500 mt-2">${{ appointment.paymentAmount }}</p>
                    </div>
                  </div>
                  
                  <div v-if="appointment.notes" class="mt-4 pt-4 border-t border-gray-200">
                    <h5 class="text-sm font-medium text-gray-900 mb-1">Notes</h5>
                    <p class="text-sm text-gray-700">{{ appointment.notes }}</p>
                  </div>
                  
                  <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div class="flex space-x-2">
                      <BaseButton 
                        v-if="appointment.status === 'completed'" 
                        size="sm" 
                        variant="outline"
                      >
                        <Download class="h-4 w-4 mr-1" />
                        Download Receipt
                      </BaseButton>
                      
                      <BaseButton 
                        size="sm" 
                        variant="outline"
                        @click="$router.push(`/patient/clinic/${appointment.clinicId}`)"
                      >
                        <Eye class="h-4 w-4 mr-1" />
                        View Clinic
                      </BaseButton>
                    </div>
                    
                    <BaseButton 
                      v-if="appointment.status === 'completed'" 
                      size="sm"
                      @click="$router.push(`/patient/book/${appointment.clinicId}`)"
                    >
                      <Calendar class="h-4 w-4 mr-1" />
                      Book Again
                    </BaseButton>
                  </div>
                </BaseCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Export Options -->
    <BaseCard header="Export Your History">
      <div class="flex flex-wrap gap-4">
        <BaseButton variant="outline">
          <Download class="h-4 w-4 mr-2" />
          Download PDF Report
        </BaseButton>
        
        <BaseButton variant="outline">
          <FileText class="h-4 w-4 mr-2" />
          Export to CSV
        </BaseButton>
        
        <BaseButton variant="outline">
          <Mail class="h-4 w-4 mr-2" />
          Email Summary
        </BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentsStore } from '@/stores/appointments';
import { useClinicsStore } from '@/stores/clinics';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ArrowLeft, Calendar, CheckCircle, XCircle, DollarSign, Clock, Building2, Download, Eye, FileText, Mail } from 'lucide-vue-next';

const authStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();
const clinicsStore = useClinicsStore();

const selectedYear = ref('');
const selectedStatus = ref('');
const selectedClinic = ref('');

const patientAppointments = computed(() => {
  if (!authStore.user) return [];
  return appointmentsStore.getAppointmentsByUser(authStore.user.id, 'patient')
    .filter(apt => apt.status !== 'scheduled'); // Only show past appointments
});

const filteredHistory = computed(() => {
  let appointments = patientAppointments.value;
  
  if (selectedYear.value) {
    appointments = appointments.filter(apt => 
      new Date(apt.date).getFullYear().toString() === selectedYear.value
    );
  }
  
  if (selectedStatus.value) {
    appointments = appointments.filter(apt => apt.status === selectedStatus.value);
  }
  
  if (selectedClinic.value) {
    appointments = appointments.filter(apt => apt.clinicId === selectedClinic.value);
  }
  
  return appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const groupedHistory = computed(() => {
  const groups: Record<string, typeof filteredHistory.value> = {};
  
  filteredHistory.value.forEach(appointment => {
    const year = new Date(appointment.date).getFullYear().toString();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(appointment);
  });
  
  return groups;
});

const availableYears = computed(() => {
  const years = new Set(
    patientAppointments.value.map(apt => new Date(apt.date).getFullYear())
  );
  return Array.from(years).sort((a, b) => b - a);
});

const visitedClinics = computed(() => {
  const clinicIds = new Set(patientAppointments.value.map(apt => apt.clinicId));
  return Array.from(clinicIds)
    .map(id => clinicsStore.getClinicById(id))
    .filter(clinic => clinic !== undefined);
});

const stats = computed(() => {
  const appointments = patientAppointments.value;
  
  return {
    total: appointments.length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
    totalSpent: appointments
      .filter(apt => apt.status === 'completed' && apt.paymentStatus === 'paid')
      .reduce((sum, apt) => sum + apt.paymentAmount, 0)
  };
});

const getClinicName = (clinicId: string) => {
  const clinic = clinicsStore.getClinicById(clinicId);
  return clinic?.clinicName || 'Unknown Clinic';
};

const getDoctorName = (doctorId: string) => {
  const doctor = clinicsStore.getDoctorById(doctorId);
  return doctor?.name.replace('Dr. ', '') || 'Unknown';
};

const formatDateTime = (date: string, time: string) => {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString('en-US', { 
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

const clearFilters = () => {
  selectedYear.value = '';
  selectedStatus.value = '';
  selectedClinic.value = '';
};
</script>