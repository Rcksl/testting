<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Search Clinics</h2>
      <BaseButton variant="ghost" @click="$router.push('/patient')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Dashboard
      </BaseButton>
    </div>

    <!-- Search Form -->
    <BaseCard>
      <div class="space-y-4">
        <BaseInput
          v-model="searchQuery"
          placeholder="Search by clinic name, specialty, or services..."
          :icon="Search"
          @input="handleSearch"
        />
        
        <div class="flex flex-wrap gap-2">
          <span class="text-sm text-gray-500">Popular searches:</span>
          <button 
            v-for="tag in popularTags" 
            :key="tag"
            @click="searchQuery = tag; handleSearch()"
            class="px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </BaseCard>

    <!-- Search Results -->
    <div v-if="searchQuery">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Search Results ({{ searchResults.length }})
      </h3>
      
      <div v-if="searchResults.length === 0" class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search class="h-8 w-8 text-gray-400" />
        </div>
        <p class="text-gray-500">No clinics found matching your search.</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseCard 
          v-for="clinic in searchResults" 
          :key="clinic.id"
          class="hover:shadow-lg transition-shadow cursor-pointer"
          @click="$router.push(`/patient/clinic/${clinic.id}`)"
        >
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ clinic.clinicName }}</h3>
                <p class="text-sm text-gray-600">{{ clinic.address }}</p>
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
              <div class="flex items-center">
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
import { Search, ArrowLeft, ArrowRight } from 'lucide-vue-next';

const clinicsStore = useClinicsStore();

const searchQuery = ref('');
const popularTags = ['Cardiology', 'General Medicine', 'Dermatology', 'Pediatrics', 'Women\'s Health'];

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return [];
  return clinicsStore.searchClinics(searchQuery.value);
});

const handleSearch = () => {
  // Search is reactive, so this is just for any additional logic if needed
  console.log('Searching for:', searchQuery.value);
};
</script>