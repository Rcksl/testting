<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Nearby Clinics</h2>
      <BaseButton variant="ghost" @click="$router.push('/patient')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Dashboard
      </BaseButton>
    </div>

    <!-- Map Interface Placeholder -->
    <BaseCard header="Find Clinics Near You">
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <BaseInput
            v-model="locationQuery"
            placeholder="Enter your location or ZIP code"
            :icon="MapPin"
            class="flex-1"
          />
          <BaseButton @click="searchNearby">
            <Search class="h-4 w-4 mr-2" />
            Search
          </BaseButton>
        </div>
        
        <!-- Map Placeholder -->
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div class="text-center">
            <MapPin class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">Interactive map will be displayed here</p>
            <p class="text-sm text-gray-400">Showing clinics within 10 miles of your location</p>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Nearby Clinics List -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900">Clinics in Your Area</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseCard 
          v-for="clinic in nearbyClinics" 
          :key="clinic.id"
          class="hover:shadow-lg transition-shadow cursor-pointer"
          @click="$router.push(`/patient/clinic/${clinic.id}`)"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ clinic.clinicName }}</h3>
                <p class="text-sm text-gray-600 flex items-center">
                  <MapPin class="h-4 w-4 mr-1" />
                  {{ clinic.address }}
                </p>
                <p class="text-sm text-primary-600 font-medium">
                  {{ calculateDistance(clinic.id) }} miles away
                </p>
              </div>
              <div class="text-right">
                <span class="text-sm text-green-600 font-medium">{{ clinic.operatingHours }}</span>
                <p class="text-xs text-gray-500 mt-1">{{ clinic.phone }}</p>
              </div>
            </div>
            
            <p class="text-gray-700">{{ clinic.description }}</p>
            
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="service in clinic.services" 
                :key="service"
                class="px-2 py-1 text-xs bg-secondary-100 text-secondary-700 rounded-full"
              >
                {{ service }}
              </span>
            </div>
            
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <Star class="h-4 w-4 text-yellow-400 mr-1" />
                  <span class="text-sm text-gray-600">4.8 (124 reviews)</span>
                </div>
                <div :class="clinic.paymentRequired ? 'text-orange-600' : 'text-green-600'">
                  {{ clinic.paymentRequired ? 'Payment Required' : 'Free Consultation' }}
                </div>
              </div>
              <BaseButton size="sm">
                View Details
                <ArrowRight class="h-4 w-4 ml-2" />
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useClinicsStore } from '@/stores/clinics';
import BaseCard from '@/components/BaseCard.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import { Search, ArrowLeft, ArrowRight, MapPin, Star } from 'lucide-vue-next';

const clinicsStore = useClinicsStore();

const locationQuery = ref('New York, NY');

const nearbyClinics = computed(() => {
  // For demo purposes, return all clinics as "nearby"
  return clinicsStore.clinics;
});

const calculateDistance = (clinicId: string) => {
  // Mock distance calculation
  const distances = { '2': 2.3, '4': 4.7 };
  return distances[clinicId as keyof typeof distances] || Math.random() * 10 + 1;
};

const searchNearby = () => {
  console.log('Searching near:', locationQuery.value);
  // In a real app, this would integrate with a maps API
};
</script>