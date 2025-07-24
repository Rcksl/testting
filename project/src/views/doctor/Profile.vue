<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Manage Profile</h2>
      <BaseButton variant="ghost" @click="$router.push('/doctor')">
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Dashboard
      </BaseButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Picture Section -->
      <BaseCard header="Profile Picture">
        <div class="text-center space-y-4">
          <div class="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
            <User class="h-16 w-16 text-white" />
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ doctorInfo?.name }}</h3>
            <p class="text-sm text-gray-600">{{ doctorInfo?.specialization }}</p>
          </div>
          
          <div class="flex flex-col space-y-2">
            <BaseButton size="sm" @click="showUploadModal = true">
              <Camera class="h-4 w-4 mr-2" />
              Add Profile Picture
            </BaseButton>
            <BaseButton variant="outline" size="sm" disabled>
              <Download class="h-4 w-4 mr-2" />
              Download Photo
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Profile Information -->
      <div class="lg:col-span-2 space-y-6">
        <BaseCard header="Professional Information">
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="profileForm.name"
                label="Full Name"
                required
              />
              
              <BaseInput
                v-model="profileForm.email"
                type="email"
                label="Email Address"
                required
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseInput
                v-model="profileForm.specialization"
                label="Specialization"
                required
              />
              
              <BaseInput
                v-model.number="profileForm.experience"
                type="number"
                label="Years of Experience"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
              <textarea
                v-model="profileForm.qualifications"
                rows="3"
                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200"
                placeholder="MD, MBBS, FACC (comma separated)"
                required
              ></textarea>
            </div>
            
            <BaseInput
              v-model.number="profileForm.consultationFee"
              type="number"
              label="Consultation Fee ($)"
              required
            />
            
            <BaseButton type="submit" :loading="isSaving">
              <Save class="h-4 w-4 mr-2" />
              Update Profile
            </BaseButton>
          </form>
        </BaseCard>

        <!-- Statistics -->
        <BaseCard header="Professional Statistics">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <p class="text-2xl font-bold text-primary-600">{{ stats.totalAppointments }}</p>
              <p class="text-sm text-gray-600">Total Appointments</p>
            </div>
            
            <div class="text-center">
              <p class="text-2xl font-bold text-green-600">{{ stats.completedAppointments }}</p>
              <p class="text-sm text-gray-600">Completed</p>
            </div>
            
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600">{{ stats.uniquePatients }}</p>
              <p class="text-sm text-gray-600">Unique Patients</p>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Upload Profile Picture Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <BaseCard class="w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Add Profile Picture</h3>
          
          <div class="space-y-4">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload class="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p class="text-sm text-gray-600">
                Drag and drop your photo here, or 
                <button type="button" class="text-primary-600 hover:text-primary-700 font-medium">
                  browse files
                </button>
              </p>
              <p class="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
            
            <div class="text-center text-sm text-gray-500">
              <p>For best results, use a professional headshot photo.</p>
            </div>
          </div>
          
          <div class="flex space-x-3 mt-6">
            <BaseButton class="flex-1" disabled>
              Upload Photo
            </BaseButton>
            <BaseButton variant="outline" @click="showUploadModal = false">
              Cancel
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAppointmentsStore } from '@/stores/appointments';
import { useClinicsStore } from '@/stores/clinics';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import { ArrowLeft, User, Camera, Download, Save, Upload } from 'lucide-vue-next';
import type { Doctor } from '@/types';

const authStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();
const clinicsStore = useClinicsStore();

const showUploadModal = ref(false);
const isSaving = ref(false);

const doctorInfo = computed(() => {
  if (!authStore.user) return null;
  return clinicsStore.getDoctorById(authStore.user.id) as Doctor;
});

const profileForm = reactive({
  name: '',
  email: '',
  specialization: '',
  experience: 0,
  qualifications: '',
  consultationFee: 0
});

const doctorAppointments = computed(() => {
  if (!authStore.user) return [];
  return appointmentsStore.getAppointmentsByUser(authStore.user.id, 'doctor');
});

const stats = computed(() => {
  const totalAppointments = doctorAppointments.value.length;
  const completedAppointments = doctorAppointments.value.filter(apt => apt.status === 'completed').length;
  const uniquePatients = new Set(doctorAppointments.value.map(apt => apt.patientId)).size;
  
  return {
    totalAppointments,
    completedAppointments,
    uniquePatients
  };
});

onMounted(() => {
  if (doctorInfo.value) {
    profileForm.name = doctorInfo.value.name;
    profileForm.email = doctorInfo.value.email;
    profileForm.specialization = doctorInfo.value.specialization;
    profileForm.experience = doctorInfo.value.experience;
    profileForm.qualifications = doctorInfo.value.qualifications.join(', ');
    profileForm.consultationFee = doctorInfo.value.consultationFee;
  }
});

const updateProfile = async () => {
  isSaving.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Updating profile:', profileForm);
  
  isSaving.value = false;
  alert('Profile updated successfully!');
};
</script>