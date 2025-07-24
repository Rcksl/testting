<template>
  <div v-if="clinic" class="space-y-6">
    <div class="flex items-center justify-between">
      <BaseButton variant="ghost" @click="$router.go(-1)">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back
      </BaseButton>
      <BaseButton @click="$router.push(`/patient/book/${clinic.id}`)">
        <Calendar class="h-4 w-4 mr-2" />
        Book Appointment
      </BaseButton>
    </div>

    <!-- Clinic Header -->
    <BaseCard>
      <div class="text-center space-y-4">
        <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
          <Building2 class="h-12 w-12 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ clinic.clinicName }}</h1>
          <p class="text-lg text-gray-600 mt-2">{{ clinic.description }}</p>
        </div>
        
        <div class="flex items-center justify-center space-x-6 text-sm">
          <div class="flex items-center">
            <Star class="h-5 w-5 text-yellow-400 mr-1" />
            <span class="font-medium">4.8</span>
            <span class="text-gray-500 ml-1">(124 reviews)</span>
          </div>
          <div class="flex items-center">
            <MapPin class="h-5 w-5 text-gray-400 mr-1" />
            <span class="text-gray-600">2.3 miles away</span>
          </div>
        </div>
      </div>
    </BaseCard>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Services -->
        <BaseCard header="Services Offered">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="service in clinic.services" :key="service" 
                 class="flex items-center p-3 bg-secondary-50 rounded-lg">
              <div class="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center mr-3">
                <Heart class="h-4 w-4 text-secondary-600" />
              </div>
              <span class="font-medium text-gray-900">{{ service }}</span>
            </div>
          </div>
        </BaseCard>

        <!-- Doctors -->
        <BaseCard header="Our Doctors">
          <div class="space-y-4">
            <div v-for="doctor in clinicDoctors" :key="doctor.id" 
                 class="flex items-center p-4 bg-gray-50 rounded-lg">
              <div class="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mr-4">
                <User class="h-6 w-6 text-primary-600" />
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900">{{ doctor.name }}</h3>
                <p class="text-sm text-gray-600">{{ doctor.specialization }}</p>
                <p class="text-xs text-gray-500">{{ doctor.experience }} years experience</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">${{ doctor.consultationFee }}</p>
                <p class="text-xs text-gray-500">consultation</p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Reviews -->
        <BaseCard header="Patient Reviews">
          <div class="space-y-4">
            <div v-for="review in mockReviews" :key="review.id" class="border-b border-gray-200 pb-4 last:border-b-0">
              <div class="flex items-start justify-between">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <User class="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ review.name }}</p>
                    <div class="flex items-center">
                      <div class="flex">
                        <Star v-for="i in 5" :key="i" 
                              :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" 
                              class="h-4 w-4" />
                      </div>
                      <span class="text-sm text-gray-500 ml-2">{{ review.date }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-gray-700 mt-2">{{ review.comment }}</p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Contact Info -->
        <BaseCard header="Contact Information">
          <div class="space-y-4">
            <div class="flex items-center">
              <MapPin class="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p class="font-medium text-gray-900">Address</p>
                <p class="text-sm text-gray-600">{{ clinic.address }}</p>
              </div>
            </div>
            
            <div class="flex items-center">
              <Phone class="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p class="font-medium text-gray-900">Phone</p>
                <p class="text-sm text-gray-600">{{ clinic.phone }}</p>
              </div>
            </div>
            
            <div class="flex items-center">
              <Clock class="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p class="font-medium text-gray-900">Hours</p>
                <p class="text-sm text-gray-600">{{ clinic.operatingHours }}</p>
              </div>
            </div>
            
            <div class="flex items-center">
              <CreditCard class="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p class="font-medium text-gray-900">Payment</p>
                <p :class="clinic.paymentRequired ? 'text-orange-600' : 'text-green-600'" class="text-sm font-medium">
                  {{ clinic.paymentRequired ? 'Payment Required' : 'Free Consultation' }}
                </p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Booking Policy -->
        <BaseCard header="Booking Policy">
          <p class="text-gray-700">{{ clinic.bookingPolicy }}</p>
        </BaseCard>

        <!-- Quick Actions -->
        <BaseCard>
          <div class="space-y-3">
            <BaseButton full-width @click="$router.push(`/patient/book/${clinic.id}`)">
              <Calendar class="h-4 w-4 mr-2" />
              Book Appointment
            </BaseButton>
            <BaseButton variant="outline" full-width>
              <Phone class="h-4 w-4 mr-2" />
              Call Clinic
            </BaseButton>
            <BaseButton variant="ghost" full-width>
              <MapPin class="h-4 w-4 mr-2" />
              Get Directions
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
  
  <div v-else class="text-center py-12">
    <p class="text-gray-500">Clinic not found</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useClinicsStore } from '@/stores/clinics';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ArrowLeft, Calendar, Building2, Star, MapPin, Heart, User, Phone, Clock, CreditCard } from 'lucide-vue-next';

const route = useRoute();
const clinicsStore = useClinicsStore();

const clinic = computed(() => {
  return clinicsStore.getClinicById(route.params.id as string);
});

const clinicDoctors = computed(() => {
  if (!clinic.value) return [];
  return clinicsStore.getDoctorsByClinic(clinic.value.id);
});

const mockReviews = [
  {
    id: 1,
    name: 'Sarah M.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Excellent care and very professional staff. Dr. Johnson was thorough and explained everything clearly.'
  },
  {
    id: 2,
    name: 'Mike R.',
    rating: 4,
    date: '1 month ago',
    comment: 'Good experience overall. The facility is clean and modern. Wait time was reasonable.'
  },
  {
    id: 3,
    name: 'Lisa K.',
    rating: 5,
    date: '2 months ago',
    comment: 'Amazing service! The entire team is friendly and competent. Highly recommend.'
  }
];
</script>