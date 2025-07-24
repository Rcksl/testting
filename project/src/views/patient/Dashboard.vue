<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-primary-600">ClinicConnect</h1>
            <span class="ml-4 text-sm text-gray-500">Patient Portal</span>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">Welcome, {{ authStore.user?.name }}</span>
            <BaseButton variant="ghost" size="sm" @click="handleLogout">
              <LogOut class="h-4 w-4 mr-2" />
              Logout
            </BaseButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseButton from '@/components/BaseButton.vue';
import { LogOut } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>