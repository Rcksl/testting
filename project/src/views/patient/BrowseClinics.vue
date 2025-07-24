<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Browse Clinics</h2>
      <BaseButton variant="ghost" @click="$router.push('/patient')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Dashboard
      </BaseButton>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900">Filter Clinics</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
            <select v-model="filters.specialty" class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
              <option value="">All Specialties</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Women's Health">Women's Health</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Payment</label>
            <select v-model="filters.payment" class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
              <option value="">All Options</option>
              <option value="free">Free Consultation</option>
              <option value="paid">Payment Required</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Availability</label>
            <select v-model="filters.availability" class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
              <option value="">Any Time</option>
              <option value="today">Available Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">{{ filteredClinics.length }} clinics found</span>
          <BaseButton variant="ghost" size="sm" @click="clearFilters">
            Clear Filters
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Clinics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard 
        v-for="clinic in filteredClinics" 
        :key="clinic.id"
        class="hover:shadow-lg transition-shadow cursor-pointer"
        @click="$router.push(`/patient/clinic/${clinic.id}`)"
      >
        <div class="space-y-4">
          <!-- Clinic Header -->
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building2 class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">{{ clinic.clinicName }}</h3>
            <p class="text-sm text-gray-600">{{ clinic.address }}</p>
          </div>
          
          <!-- Services -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 mb-2">Services</h4>
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="service in clinic.services.slice(0, 3)" 
                :key="service"
                class="px-2 py-1 text-xs bg-secondary-100 text-secondary-700 rounded-full"
              >
                {{ service }}
              </span>
              <span v-if="clinic.services.length > 3" class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{{ clinic.services.length - 3 }} more
              </span>
            </div>
          </div>
          
          <!-- Clinic Info -->
          <div class="space-y-2 text-sm">
            <div class="flex items-center">
              <Clock class="h-4 w-4 text-gray-400 mr-2" />
              <span class="text-gray-600">{{ clinic.operatingHours }}</span>
            </div>
            <div class="flex items-center">
              <Phone class="h-4 w-4 text-gray-400 mr-2" />
              <span class="text-gray-600">{{ clinic.phone }}</span>
            </div>
            <div class="flex items-center">
              <CreditCard class="h-4 w-4 text-gray-400 mr-2" />
              <span :class="clinic.paymentRequired ? 'text-orange-600' : 'text-green-600'">
                {{ clinic.paymentRequired ? 'Payment Required' : 'Free Consultation' }}
              </span>
            </div>
          </div>
          
          <!-- Rating -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-200">
            <div class="flex items-center">
              <div class="flex items-center">
                <Star class="h-4 w-4 text-yellow-400 mr-1" />
                <span class="text-sm text-gray-600">4.8</span>
              </div>
              <span class="text-xs text-gray-500 ml-2">(124 reviews)</span>
            </div>
            <BaseButton size="sm">
              View Details
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useClinicsStore } from '@/stores/clinics';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ArrowLeft, Building2, Clock, Phone, CreditCard, Star } from 'lucide-vue-next';

const clinicsStore = useClinicsStore();

const filters = reactive({
  specialty: '',
  payment: '',
  availability: ''
});

const filteredClinics = computed(() => {
  let clinics = clinicsStore.clinics;
  
  if (filters.specialty) {
    clinics = clinics.filter(clinic => 
      clinic.services.some(service => 
        service.toLowerCase().includes(filters.specialty.toLowerCase())
      )
    );
  }
  
  if (filters.payment) {
    if (filters.payment === 'free') {
      clinics = clinics.filter(clinic => !clinic.paymentRequired);
    } else if (filters.payment === 'paid') {
      clinics = clinics.filter(clinic => clinic.paymentRequired);
    }
  }
  
  return clinics;
});

const clearFilters = () => {
  filters.specialty = '';
  filters.payment = '';
  filters.availability = '';
};
</script>