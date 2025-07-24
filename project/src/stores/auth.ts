import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, Patient, Clinic, Doctor } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => user.value !== null);
  const userRole = computed(() => user.value?.role || null);

  // Mock users for demo
  const mockUsers = [
    {
      id: '1',
      email: 'patient@demo.com',
      password: 'password',
      role: 'patient' as const,
      name: 'John Doe',
      phone: '+1234567890',
      dateOfBirth: '1990-01-01',
      address: '123 Main St, City'
    },
    {
      id: '2',
      email: 'clinic@demo.com',
      password: 'password',
      role: 'clinic' as const,
      name: 'Admin User',
      clinicName: 'City Medical Center',
      address: '456 Health Ave, City',
      phone: '+1234567891',
      description: 'Leading healthcare provider in the city',
      services: ['General Medicine', 'Cardiology', 'Dermatology'],
      operatingHours: '8:00 AM - 6:00 PM',
      bookingPolicy: 'Advance booking required',
      paymentRequired: true
    },
    {
      id: '3',
      email: 'doctor@demo.com',
      password: 'password',
      role: 'doctor' as const,
      name: 'Dr. Sarah Johnson',
      clinicId: '2',
      specialization: 'Cardiology',
      experience: 10,
      qualifications: ['MD', 'FACC'],
      consultationFee: 150
    }
  ];

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      user.value = userWithoutPassword as User;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      isLoading.value = false;
      return true;
    }
    
    isLoading.value = false;
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  const initAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    userRole,
    login,
    logout,
    initAuth
  };
});