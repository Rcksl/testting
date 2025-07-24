<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">My Appointments</h2>
      <BaseButton variant="ghost" @click="$router.push('/patient')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Dashboard
      </BaseButton>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <Calendar class="h-6 w-6 text-blue-600" />
          </div>
          <p class="text-2xl font-bold text-blue-600">{{ stats.upcoming }}</p>
          <p class="text-sm text-gray-600">Upcoming</p>
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
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select v-model="selectedStatus" class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
          <select v-model="selectedPeriod" class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
            <option value="">All Time</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <BaseButton variant="outline" @click="clearFilters">
            Clear Filters
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Appointments List -->
    <div class="space-y-4">
      <div v-if="filteredAppointments.length === 0" class="text-center py-12">
        <Calendar class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 mb-4">No appointments found</p>
        <BaseButton @click="$router.push('/patient/search')">
          Book Your First Appointment
        </BaseButton>
      </div>
      
      <BaseCard 
        v-for="appointment in filteredAppointments" 
        :key="appointment.id"
        class="hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <Building2 class="h-8 w-8 text-white" />
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ getClinicName(appointment.clinicId) }}</h3>
              <p class="text-sm text-gray-600">Dr. {{ getDoctorName(appointment.doctorId) }}</p>
              <p class="text-sm text-gray-500">{{ appointment.reason }}</p>
              <p class="text-sm font-medium text-primary-600">{{ formatDateTime(appointment.date, appointment.time) }}</p>
            </div>
          </div>
          
          <div class="text-right">
            <span :class="getStatusClass(appointment.status)" class="px-3 py-1 text-sm font-medium rounded-full">
              {{ appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }}
            </span>
            <p class="text-sm text-gray-500 mt-2">
              Payment: 
              <span :class="appointment.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'" class="font-medium">
                {{ appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1) }}
              </span>
            </p>
            <p class="text-sm font-medium text-gray-900">${{ appointment.paymentAmount }}</p>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div class="flex space-x-2">
            <BaseButton 
              v-if="appointment.status === 'scheduled' && isUpcoming(appointment.date)" 
              size="sm" 
              variant="outline"
              @click="showRescheduleModal(appointment)"
            >
              <Clock class="h-4 w-4 mr-1" />
              Reschedule
            </BaseButton>
            
            <BaseButton 
              v-if="appointment.status === 'scheduled' && isUpcoming(appointment.date)" 
              size="sm" 
              variant="danger"
              @click="cancelAppointment(appointment.id)"
            >
              <XCircle class="h-4 w-4 mr-1" />
              Cancel
            </BaseButton>
            
            <BaseButton 
              v-if="appointment.status === 'completed'" 
              size="sm" 
              variant="outline"
            >
              <Download class="h-4 w-4 mr-1" />
              Download Receipt
            </BaseButton>
          </div>
          
          <BaseButton size="sm" variant="ghost" @click="$router.push(`/patient/clinic/${appointment.clinicId}`)">
            <Eye class="h-4 w-4 mr-1" />
            View Clinic
          </BaseButton>
        </div>
      </BaseCard>
    </div>

    <!-- Reschedule Modal -->
    <div v-if="showReschedule" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <BaseCard class="w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Reschedule Appointment</h3>
          
          <form @submit.prevent="handleReschedule" class="space-y-4">
            <BaseInput
              v-model="rescheduleForm.date"
              type="date"
              label="New Date"
              :min="new Date().toISOString().split('T')[0]"
              required
            />
            
            <BaseInput
              v-model="rescheduleForm.time"
              type="time"
              label="New Time"
              required
            />
            
            <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-sm text-yellow-800">
                <strong>Note:</strong> Rescheduling may be subject to availability and clinic policies.
              </p>
            </div>
            
            <div class="flex space-x-3 pt-4">
              <BaseButton type="submit" class="flex-1">
                Reschedule Appointment
              </BaseButton>
              <BaseButton variant="outline" @click="closeRescheduleModal">
                Cancel
              </BaseButton>
            </div>
          </form>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentsStore } from '@/stores/appointments';
import { useClinicsStore } from '@/stores/clinics';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import { ArrowLeft, Calendar, CheckCircle, XCircle, Building2, Clock, Download, Eye } from 'lucide-vue-next';
import type { Appointment } from '@/types';

const authStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();
const clinicsStore = useClinicsStore();

const selectedStatus = ref('');
const selectedPeriod = ref('');
const showReschedule = ref(false);
const selectedAppointment = ref<Appointment | null>(null);

const rescheduleForm = reactive({
  date: '',
  time: ''
});

const patientAppointments = computed(() => {
  if (!authStore.user) return [];
  return appointmentsStore.getAppointmentsByUser(authStore.user.id, 'patient');
});

const filteredAppointments = computed(() => {
  let appointments = patientAppointments.value;
  
  if (selectedStatus.value) {
    appointments = appointments.filter(apt => apt.status === selectedStatus.value);
  }
  
  if (selectedPeriod.value) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    appointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      
      switch (selectedPeriod.value) {
        case 'upcoming':
          return aptDate >= now && apt.status === 'scheduled';
        case 'past':
          return aptDate < now;
        case 'thisMonth':
          return aptDate.getMonth() === currentMonth && aptDate.getFullYear() === currentYear;
        default:
          return true;
      }
    });
  }
  
  return appointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

const stats = computed(() => {
  const appointments = patientAppointments.value;
  const now = new Date();
  
  return {
    upcoming: appointments.filter(apt => new Date(apt.date) >= now && apt.status === 'scheduled').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
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
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  })} at ${time}`;
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

const isUpcoming = (date: string) => {
  return new Date(date) >= new Date();
};

const showRescheduleModal = (appointment: Appointment) => {
  selectedAppointment.value = appointment;
  rescheduleForm.date = appointment.date;
  rescheduleForm.time = appointment.time;
  showReschedule.value = true;
};

const handleReschedule = () => {
  if (selectedAppointment.value) {
    appointmentsStore.rescheduleAppointment(
      selectedAppointment.value.id,
      rescheduleForm.date,
      rescheduleForm.time
    );
    closeRescheduleModal();
    alert('Appointment rescheduled successfully!');
  }
};

const closeRescheduleModal = () => {
  showReschedule.value = false;
  selectedAppointment.value = null;
};

const cancelAppointment = (appointmentId: string) => {
  if (confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
    appointmentsStore.cancelAppointment(appointmentId);
    alert('Appointment cancelled successfully.');
  }
};

const clearFilters = () => {
  selectedStatus.value = '';
  selectedPeriod.value = '';
};
</script>