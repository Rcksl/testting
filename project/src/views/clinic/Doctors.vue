<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Manage Doctors</h2>
      <div class="flex space-x-3">
        <BaseButton @click="showAddModal = true">
          <Plus class="h-4 w-4 mr-2" />
          Add Doctor
        </BaseButton>
        <BaseButton variant="ghost" @click="$router.push('/clinic')">
          <ArrowLeft class="h-4 w-4 mr-2" />
          Back to Dashboard
        </BaseButton>
      </div>
    </div>

    <!-- Doctors List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseCard 
        v-for="doctor in clinicDoctors" 
        :key="doctor.id"
        class="hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <User class="h-8 w-8 text-white" />
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ doctor.name }}</h3>
              <p class="text-sm text-gray-600">{{ doctor.specialization }}</p>
              <p class="text-sm text-gray-500">{{ doctor.experience }} years experience</p>
              <p class="text-sm font-medium text-primary-600">${{ doctor.consultationFee }} consultation</p>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <BaseButton size="sm" variant="outline" @click="showEditModal(doctor)">
              <Edit class="h-4 w-4" />
            </BaseButton>
            <BaseButton size="sm" variant="danger" @click="showRemoveModal(doctor)">
              <Trash2 class="h-4 w-4" />
            </BaseButton>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="mb-2">
            <h4 class="text-sm font-medium text-gray-900">Qualifications</h4>
            <div class="flex flex-wrap gap-1 mt-1">
              <span 
                v-for="qualification in doctor.qualifications" 
                :key="qualification"
                class="px-2 py-1 text-xs bg-secondary-100 text-secondary-700 rounded-full"
              >
                {{ qualification }}
              </span>
            </div>
          </div>
        </div>
      </BaseCard>
      
      <!-- Empty state -->
      <div v-if="clinicDoctors.length === 0" class="col-span-full text-center py-12">
        <User class="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 mb-4">No doctors added yet</p>
        <BaseButton @click="showAddModal = true">
          Add Your First Doctor
        </BaseButton>
      </div>
    </div>

    <!-- Add/Edit Doctor Modal -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <BaseCard class="w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ isEditing ? 'Edit Doctor' : 'Add New Doctor' }}
          </h3>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <BaseInput
              v-model="doctorForm.name"
              label="Full Name"
              placeholder="Dr. John Smith"
              required
            />
            
            <BaseInput
              v-model="doctorForm.email"
              type="email"
              label="Email Address"
              placeholder="doctor@clinic.com"
              required
            />
            
            <BaseInput
              v-model="doctorForm.specialization"
              label="Specialization"
              placeholder="Cardiology, General Medicine, etc."
              required
            />
            
            <BaseInput
              v-model.number="doctorForm.experience"
              type="number"
              label="Years of Experience"
              placeholder="5"
              required
            />
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
              <textarea
                v-model="doctorForm.qualifications"
                placeholder="MD, MBBS, FACC (comma separated)"
                rows="2"
                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
                required
              ></textarea>
            </div>
            
            <BaseInput
              v-model.number="doctorForm.consultationFee"
              type="number"
              label="Consultation Fee ($)"
              placeholder="150"
              required
            />
            
            <div class="flex space-x-3 pt-4">
              <BaseButton type="submit" class="flex-1">
                {{ isEditing ? 'Update Doctor' : 'Add Doctor' }}
              </BaseButton>
              <BaseButton variant="outline" @click="closeModal">
                Cancel
              </BaseButton>
            </div>
          </form>
        </div>
      </BaseCard>
    </div>

    <!-- Remove Doctor Modal -->
    <div v-if="showRemove" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <BaseCard class="w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Remove Doctor</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to remove {{ selectedDoctor?.name }}? This action cannot be undone.
          </p>
          
          <div class="flex space-x-3">
            <BaseButton variant="danger" @click="handleRemove" class="flex-1">
              Yes, Remove Doctor
            </BaseButton>
            <BaseButton variant="outline" @click="showRemove = false">
              Cancel
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
import { useClinicsStore } from '@/stores/clinics';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import { ArrowLeft, Plus, User, Edit, Trash2 } from 'lucide-vue-next';
import type { Doctor } from '@/types';

const authStore = useAuthStore();
const clinicsStore = useClinicsStore();

const showAddModal = ref(false);
const showEditModal = ref(false);
const showRemove = ref(false);
const selectedDoctor = ref<Doctor | null>(null);

const doctorForm = reactive({
  name: '',
  email: '',
  specialization: '',
  experience: 0,
  qualifications: '',
  consultationFee: 0
});

const isEditing = computed(() => showEditModal.value);

const clinicDoctors = computed(() => {
  if (!authStore.user) return [];
  return clinicsStore.getDoctorsByClinic(authStore.user.id);
});

const showEditModal = (doctor: Doctor) => {
  selectedDoctor.value = doctor;
  doctorForm.name = doctor.name;
  doctorForm.email = doctor.email;
  doctorForm.specialization = doctor.specialization;
  doctorForm.experience = doctor.experience;
  doctorForm.qualifications = doctor.qualifications.join(', ');
  doctorForm.consultationFee = doctor.consultationFee;
  showEditModal.value = true;
};

const showRemoveModal = (doctor: Doctor) => {
  selectedDoctor.value = doctor;
  showRemove.value = true;
};

const handleSubmit = () => {
  // In a real app, this would save to the database
  const qualifications = doctorForm.qualifications.split(',').map(q => q.trim());
  
  console.log('Saving doctor:', {
    ...doctorForm,
    qualifications,
    clinicId: authStore.user?.id
  });
  
  closeModal();
};

const handleRemove = () => {
  if (!selectedDoctor.value) return;
  
  // In a real app, this would remove from the database
  console.log('Removing doctor:', selectedDoctor.value.id);
  
  showRemove.value = false;
  selectedDoctor.value = null;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  selectedDoctor.value = null;
  
  // Reset form
  doctorForm.name = '';
  doctorForm.email = '';
  doctorForm.specialization = '';
  doctorForm.experience = 0;
  doctorForm.qualifications = '';
  doctorForm.consultationFee = 0;
};
</script>