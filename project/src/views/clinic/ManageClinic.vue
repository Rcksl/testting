<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Manage Clinic</h2>
      <BaseButton variant="ghost" @click="$router.push('/clinic')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Dashboard
      </BaseButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Clinic Information -->
      <BaseCard header="Clinic Information">
        <form @submit.prevent="saveChanges" class="space-y-4">
          <BaseInput
            v-model="clinicForm.clinicName"
            label="Clinic Name"
            required
          />
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="clinicForm.description"
              rows="3"
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
              placeholder="Brief description of your clinic"
            ></textarea>
          </div>
          
          <BaseInput
            v-model="clinicForm.address"
            label="Address"
            required
          />
          
          <BaseInput
            v-model="clinicForm.phone"
            label="Phone Number"
            type="tel"
            required
          />
          
          <BaseInput
            v-model="clinicForm.operatingHours"
            label="Operating Hours"
            placeholder="e.g., 8:00 AM - 6:00 PM"
            required
          />
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
            <textarea
              v-model="clinicForm.services"
              rows="3"
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
              placeholder="General Medicine, Cardiology, Dermatology (comma separated)"
            ></textarea>
          </div>
          
          <BaseButton type="submit" :loading="isSaving">
            <Save class="h-4 w-4 mr-2" />
            Save Changes
          </BaseButton>
        </form>
      </BaseCard>

      <!-- Booking Policy -->
      <BaseCard header="Booking Policy">
        <form @submit.prevent="savePolicyChanges" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Booking Policy</label>
            <textarea
              v-model="policyForm.bookingPolicy"
              rows="4"
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
              placeholder="Describe your booking requirements and policies"
            ></textarea>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                id="paymentRequired"
                v-model="policyForm.paymentRequired"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="paymentRequired" class="ml-2 block text-sm text-gray-900">
                Payment required before booking
              </label>
            </div>
            
            <div class="flex items-center">
              <input
                id="paymentBefore"
                v-model="policyForm.turnOffPaymentBefore"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="paymentBefore" class="ml-2 block text-sm text-gray-900">
                Turn off payment before booking
              </label>
            </div>
          </div>
          
          <div v-if="policyForm.turnOffPaymentBefore" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-start space-x-3">
              <AlertTriangle class="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-sm text-yellow-800 font-medium">Are you sure?</p>
                <p class="text-sm text-yellow-700 mt-1">
                  Turning off payment requirements will allow patients to book appointments without upfront payment.
                </p>
                <div class="mt-3">
                  <BaseButton 
                    v-if="!confirmChanges" 
                    size="sm" 
                    variant="outline"
                    @click="confirmChanges = true"
                  >
                    Yes, Apply Changes
                  </BaseButton>
                  <div v-else class="flex space-x-2">
                    <BaseButton size="sm" @click="applyChanges">
                      Confirm Changes
                    </BaseButton>
                    <BaseButton size="sm" variant="outline" @click="confirmChanges = false">
                      Cancel
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <BaseButton 
            v-if="!policyForm.turnOffPaymentBefore" 
            type="submit" 
            :loading="isSavingPolicy"
          >
            <Save class="h-4 w-4 mr-2" />
            Update Policy
          </BaseButton>
        </form>
      </BaseCard>
    </div>

    <!-- Current Settings Overview -->
    <BaseCard header="Current Settings Overview" v-if="clinic">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Clinic Details</h4>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-600">Name:</dt>
              <dd class="font-medium text-gray-900">{{ clinic.clinicName }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600">Address:</dt>
              <dd class="font-medium text-gray-900">{{ clinic.address }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600">Phone:</dt>
              <dd class="font-medium text-gray-900">{{ clinic.phone }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600">Hours:</dt>
              <dd class="font-medium text-gray-900">{{ clinic.operatingHours }}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-gray-900 mb-3">Booking Settings</h4>
          <dl class="space-y-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-600">Payment Required:</dt>
              <dd :class="clinic.paymentRequired ? 'text-orange-600' : 'text-green-600'" class="font-medium">
                {{ clinic.paymentRequired ? 'Yes' : 'No' }}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600">Services:</dt>
              <dd class="font-medium text-gray-900">{{ clinic.services.length }} offered</dd>
            </div>
          </dl>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useClinicsStore } from '@/stores/clinics';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-vue-next';
import type { Clinic } from '@/types';

const authStore = useAuthStore();
const clinicsStore = useClinicsStore();

const isSaving = ref(false);
const isSavingPolicy = ref(false);
const confirmChanges = ref(false);

const clinic = computed(() => {
  if (!authStore.user) return null;
  return clinicsStore.getClinicById(authStore.user.id) as Clinic;
});

const clinicForm = reactive({
  clinicName: '',
  description: '',
  address: '',
  phone: '',
  operatingHours: '',
  services: ''
});

const policyForm = reactive({
  bookingPolicy: '',
  paymentRequired: false,
  turnOffPaymentBefore: false
});

onMounted(() => {
  if (clinic.value) {
    clinicForm.clinicName = clinic.value.clinicName;
    clinicForm.description = clinic.value.description;
    clinicForm.address = clinic.value.address;
    clinicForm.phone = clinic.value.phone;
    clinicForm.operatingHours = clinic.value.operatingHours;
    clinicForm.services = clinic.value.services.join(', ');
    
    policyForm.bookingPolicy = clinic.value.bookingPolicy;
    policyForm.paymentRequired = clinic.value.paymentRequired;
  }
});

const saveChanges = async () => {
  isSaving.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Saving clinic changes:', clinicForm);
  
  isSaving.value = false;
  alert('Clinic information updated successfully!');
};

const savePolicyChanges = async () => {
  isSavingPolicy.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Saving policy changes:', policyForm);
  
  isSavingPolicy.value = false;
  alert('Booking policy updated successfully!');
};

const applyChanges = async () => {
  isSavingPolicy.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Applying payment policy changes:', policyForm);
  
  isSavingPolicy.value = false;
  confirmChanges.value = false;
  alert('Payment policy changes applied successfully!');
};
</script>