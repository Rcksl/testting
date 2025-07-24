<template>
  <div v-if="clinic" class="space-y-6">
    <div class="flex items-center justify-between">
      <BaseButton variant="ghost" @click="$router.go(-1)">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back
      </BaseButton>
      <div class="text-right">
        <h1 class="text-xl font-semibold text-gray-900">{{ clinic.clinicName }}</h1>
        <p class="text-sm text-gray-600">Book an appointment</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Booking Form -->
      <div class="lg:col-span-2">
        <BaseCard header="Book Your Appointment">
          <form @submit.prevent="handleBooking" class="space-y-6">
            <!-- Doctor Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
              <div class="space-y-3">
                <div v-for="doctor in clinicDoctors" :key="doctor.id" 
                     :class="[
                       'p-4 border rounded-lg cursor-pointer transition-all',
                       selectedDoctor?.id === doctor.id 
                         ? 'border-primary-500 bg-primary-50' 
                         : 'border-gray-200 hover:border-gray-300'
                     ]"
                     @click="selectedDoctor = doctor">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center">
                        <User class="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 class="font-semibold text-gray-900">{{ doctor.name }}</h3>
                        <p class="text-sm text-gray-600">{{ doctor.specialization }}</p>
                        <p class="text-xs text-gray-500">{{ doctor.experience }} years experience</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900">${{ doctor.consultationFee }}</p>
                      <p class="text-xs text-gray-500">consultation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Date Selection -->
            <BaseInput
              v-model="bookingForm.date"
              type="date"
              label="Preferred Date"
              :min="new Date().toISOString().split('T')[0]"
              required
            />

            <!-- Time Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <div class="grid grid-cols-3 md:grid-cols-4 gap-2">
                <button
                  v-for="time in availableTimes"
                  :key="time"
                  type="button"
                  :class="[
                    'p-2 text-sm border rounded-lg transition-all',
                    bookingForm.time === time
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                  @click="bookingForm.time = time"
                >
                  {{ time }}
                </button>
              </div>
            </div>

            <!-- Reason for Visit -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
              <textarea
                v-model="bookingForm.reason"
                rows="3"
                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
                placeholder="Please describe your symptoms or reason for the visit"
                required
              ></textarea>
            </div>

            <!-- Additional Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
              <textarea
                v-model="bookingForm.notes"
                rows="2"
                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
                placeholder="Any additional information you'd like to share"
              ></textarea>
            </div>

            <!-- Payment Information -->
            <div v-if="clinic.paymentRequired" class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div class="flex items-start space-x-3">
                <CreditCard class="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 class="text-sm font-medium text-orange-800">Payment Required</h4>
                  <p class="text-sm text-orange-700 mt-1">
                    This clinic requires payment before booking. You will be charged ${{ selectedDoctor?.consultationFee || 0 }} for this appointment.
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start space-x-3">
                <CheckCircle class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 class="text-sm font-medium text-green-800">Free Consultation</h4>
                  <p class="text-sm text-green-700 mt-1">
                    This clinic offers free consultations. No payment required to book.
                  </p>
                </div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start space-x-3">
              <input
                id="terms"
                v-model="bookingForm.acceptTerms"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                required
              />
              <label for="terms" class="text-sm text-gray-700">
                I agree to the clinic's booking policy and terms of service. I understand that cancellations must be made at least 24 hours in advance.
              </label>
            </div>

            <!-- Submit Button -->
            <BaseButton 
              type="submit" 
              :loading="isBooking"
              :disabled="!selectedDoctor || !bookingForm.time || !bookingForm.acceptTerms"
              full-width
              size="lg"
            >
              <Calendar class="h-5 w-5 mr-2" />
              {{ clinic.paymentRequired ? `Book & Pay $${selectedDoctor?.consultationFee || 0}` : 'Book Appointment' }}
            </BaseButton>
          </form>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Booking Summary -->
        <BaseCard header="Booking Summary">
          <div class="space-y-4">
            <div v-if="selectedDoctor">
              <h4 class="text-sm font-medium text-gray-900">Doctor</h4>
              <p class="text-sm text-gray-600">{{ selectedDoctor.name }}</p>
              <p class="text-xs text-gray-500">{{ selectedDoctor.specialization }}</p>
            </div>
            
            <div v-if="bookingForm.date">
              <h4 class="text-sm font-medium text-gray-900">Date</h4>
              <p class="text-sm text-gray-600">{{ formatDate(bookingForm.date) }}</p>
            </div>
            
            <div v-if="bookingForm.time">
              <h4 class="text-sm font-medium text-gray-900">Time</h4>
              <p class="text-sm text-gray-600">{{ bookingForm.time }}</p>
            </div>
            
            <div v-if="selectedDoctor" class="pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-900">Consultation Fee</span>
                <span class="text-lg font-bold text-gray-900">${{ selectedDoctor.consultationFee }}</span>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Clinic Information -->
        <BaseCard header="Clinic Information">
          <div class="space-y-3">
            <div class="flex items-center">
              <MapPin class="h-4 w-4 text-gray-400 mr-2" />
              <span class="text-sm text-gray-600">{{ clinic.address }}</span>
            </div>
            
            <div class="flex items-center">
              <Phone class="h-4 w-4 text-gray-400 mr-2" />
              <span class="text-sm text-gray-600">{{ clinic.phone }}</span>
            </div>
            
            <div class="flex items-center">
              <Clock class="h-4 w-4 text-gray-400 mr-2" />
              <span class="text-sm text-gray-600">{{ clinic.operatingHours }}</span>
            </div>
          </div>
        </BaseCard>

        <!-- Booking Policy -->
        <BaseCard header="Booking Policy">
          <p class="text-sm text-gray-700">{{ clinic.bookingPolicy }}</p>
        </BaseCard>
      </div>
    </div>
  </div>
  
  <div v-else class="text-center py-12">
    <p class="text-gray-500">Clinic not found</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentsStore } from '@/stores/appointments';
import { useClinicsStore } from '@/stores/clinics';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import { ArrowLeft, User, Calendar, CreditCard, CheckCircle, MapPin, Phone, Clock } from 'lucide-vue-next';
import type { Doctor } from '@/types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();
const clinicsStore = useClinicsStore();

const selectedDoctor = ref<Doctor | null>(null);
const isBooking = ref(false);

const bookingForm = reactive({
  date: '',
  time: '',
  reason: '',
  notes: '',
  acceptTerms: false
});

const clinic = computed(() => {
  return clinicsStore.getClinicById(route.params.clinicId as string);
});

const clinicDoctors = computed(() => {
  if (!clinic.value) return [];
  return clinicsStore.getDoctorsByClinic(clinic.value.id);
});

const availableTimes = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

onMounted(() => {
  // Auto-select first doctor if only one available
  if (clinicDoctors.value.length === 1) {
    selectedDoctor.value = clinicDoctors.value[0];
  }
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleBooking = async () => {
  if (!selectedDoctor.value || !authStore.user || !clinic.value) return;
  
  isBooking.value = true;
  
  try {
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAppointment = {
      patientId: authStore.user.id,
      clinicId: clinic.value.id,
      doctorId: selectedDoctor.value.id,
      date: bookingForm.date,
      time: bookingForm.time,
      status: 'scheduled' as const,
      reason: bookingForm.reason,
      notes: bookingForm.notes,
      paymentStatus: clinic.value.paymentRequired ? 'paid' : 'pending' as const,
      paymentAmount: selectedDoctor.value.consultationFee
    };
    
    appointmentsStore.bookAppointment(newAppointment);
    
    alert('Appointment booked successfully!');
    router.push('/patient/appointments');
  } catch (error) {
    alert('Failed to book appointment. Please try again.');
  } finally {
    isBooking.value = false;
  }
};
</script>