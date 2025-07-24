<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">My Appointments</h2>
      <BaseButton variant="ghost" @click="$router.push('/doctor')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Dashboard
      </BaseButton>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <Calendar class="h-6 w-6 text-blue-600" />
          </div>
          <p class="text-2xl font-bold text-blue-600">{{ stats.today }}</p>
          <p class="text-sm text-gray-600">Today</p>
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
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto">
            <Clock class="h-6 w-6 text-yellow-600" />
          </div>
          <p class="text-2xl font-bold text-yellow-600">{{ stats.upcoming }}</p>
          <p class="text-sm text-gray-600">Upcoming</p>
        </div>
      </BaseCard>
      
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
            <Users class="h-6 w-6 text-purple-600" />
          </div>
          <p class="text-2xl font-bold text-purple-600">{{ stats.patients }}</p>
          <p class="text-sm text-gray-600">Patients</p>
        </div>
      </BaseCard>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
          <input 
            v-model="selectedDate" 
            type="date" 
            class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select v-model="selectedStatus" class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
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

    <!-- Appointments List -->
    <BaseCard header="Appointments">
      <div class="space-y-4">
        <div v-if="filteredAppointments.length === 0" class="text-center py-8 text-gray-500">
          <Calendar class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p>No appointments found</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="appointment in filteredAppointments" :key="appointment.id" 
               class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
            
            <div class="mt-4 flex justify-between items-center">
              <div class="flex space-x-2">
                <BaseButton 
                  v-if="appointment.status === 'scheduled'" 
                  size="sm" 
                  @click="markCompleted(appointment.id)"
                >
                  <CheckCircle class="h-4 w-4 mr-1" />
                  Mark Complete
                </BaseButton>
                
                <BaseButton 
                  v-if="appointment.status === 'scheduled'" 
                  size="sm" 
                  variant="outline"
                  @click="showNotesModal(appointment)"
                >
                  <FileText class="h-4 w-4 mr-1" />
                  Add Notes
                </BaseButton>
              </div>
              
              <BaseButton size="sm" variant="ghost" @click="showDetailsModal(appointment)">
                <Eye class="h-4 w-4 mr-1" />
                View Details
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Notes Modal -->
    <div v-if="showNotes" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <BaseCard class="w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Appointment Notes</h3>
          
          <form @submit.prevent="saveNotes" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Patient Notes</label>
              <textarea
                v-model="notesForm.notes"
                rows="4"
                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
                placeholder="Enter your notes about this appointment..."
              ></textarea>
            </div>
            
            <div class="flex space-x-3 pt-4">
              <BaseButton type="submit" class="flex-1">
                Save Notes
              </BaseButton>
              <BaseButton variant="outline" @click="closeNotesModal">
                Cancel
              </BaseButton>
            </div>
          </form>
        </div>
      </BaseCard>
    </div>

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
import { ref, computed, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentsStore } from '@/stores/appointments';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ArrowLeft, Calendar, CheckCircle, Clock, Users, User, FileText, Eye } from 'lucide-vue-next';
import type { Appointment } from '@/types';

const authStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();

const selectedDate = ref('');
const selectedStatus = ref('');
const showNotes = ref(false);
const showDetails = ref(false);
const selectedAppointment = ref<Appointment | null>(null);

const notesForm = reactive({
  notes: ''
});

const doctorAppointments = computed(() => {
  if (!authStore.user) return [];
  return appointmentsStore.getAppointmentsByUser(authStore.user.id, 'doctor');
});

const filteredAppointments = computed(() => {
  let appointments = doctorAppointments.value;
  
  if (selectedDate.value) {
    appointments = appointments.filter(apt => apt.date === selectedDate.value);
  }
  
  if (selectedStatus.value) {
    appointments = appointments.filter(apt => apt.status === selectedStatus.value);
  }
  
  return appointments.sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
});

const stats = computed(() => {
  const appointments = doctorAppointments.value;
  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  
  return {
    today: appointments.filter(apt => apt.date === today).length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    upcoming: appointments.filter(apt => new Date(apt.date) >= now && apt.status === 'scheduled').length,
    patients: new Set(appointments.map(apt => apt.patientId)).size
  };
});

const formatDateTime = (date: string, time: string) => {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
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

const markCompleted = (appointmentId: string) => {
  appointmentsStore.updateAppointment(appointmentId, { status: 'completed' });
};

const showNotesModal = (appointment: Appointment) => {
  selectedAppointment.value = appointment;
  notesForm.notes = appointment.notes || '';
  showNotes.value = true;
};

const saveNotes = () => {
  if (selectedAppointment.value) {
    appointmentsStore.updateAppointment(selectedAppointment.value.id, { 
      notes: notesForm.notes 
    });
    closeNotesModal();
  }
};

const closeNotesModal = () => {
  showNotes.value = false;
  selectedAppointment.value = null;
  notesForm.notes = '';
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
  selectedDate.value = '';
  selectedStatus.value = '';
};
</script>