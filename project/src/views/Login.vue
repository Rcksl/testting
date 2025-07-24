<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Welcome to ClinicConnect
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>
      
      <BaseCard class="mt-8" :padding="false">
        <form @submit.prevent="handleLogin" class="p-6 space-y-6">
          <BaseInput
            id="email"
            type="email"
            label="Email Address"
            v-model="form.email"
            placeholder="Enter your email"
            required
            :error="errors.email"
          />
          
          <BaseInput
            id="password"
            type="password"
            label="Password"
            v-model="form.password"
            placeholder="Enter your password"
            required
            :error="errors.password"
          />
          
          <div class="text-sm">
            <p class="text-gray-600 mb-2">Demo credentials:</p>
            <div class="space-y-1 text-xs">
              <p><strong>Patient:</strong> patient@demo.com / password</p>
              <p><strong>Clinic:</strong> clinic@demo.com / password</p>
              <p><strong>Doctor:</strong> doctor@demo.com / password</p>
            </div>
          </div>
          
          <BaseButton 
            type="submit" 
            :loading="authStore.isLoading"
            full-width
            size="lg"
          >
            Sign In
          </BaseButton>
          
          <div v-if="errors.general" class="text-sm text-red-600 text-center">
            {{ errors.general }}
          </div>
        </form>
      </BaseCard>
      
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Need help? Contact support at 
          <a href="mailto:support@clinicconnect.com" class="text-primary-600 hover:text-primary-500">
            support@clinicconnect.com
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseCard from '@/components/BaseCard.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: '',
  general: ''
});

const handleLogin = async () => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = '';
  });
  
  try {
    await authStore.login(form.email, form.password);
    
    // Redirect based on user role
    const role = authStore.userRole;
    if (role === 'patient') {
      router.push('/patient');
    } else if (role === 'clinic') {
      router.push('/clinic');
    } else if (role === 'doctor') {
      router.push('/doctor');
    }
  } catch (error) {
    errors.general = 'Invalid email or password';
  }
};
</script>