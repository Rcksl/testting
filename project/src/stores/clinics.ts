import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Clinic, Doctor } from '@/types';

export const useClinicsStore = defineStore('clinics', () => {
  const clinics = ref<Clinic[]>([
    {
      id: '2',
      email: 'clinic@demo.com',
      role: 'clinic',
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
      id: '4',
      email: 'wellness@demo.com',
      role: 'clinic',
      name: 'Wellness Center',
      clinicName: 'Wellness Medical Hub',
      address: '789 Wellness Blvd, City',
      phone: '+1234567892',
      description: 'Comprehensive wellness and preventive care',
      services: ['Family Medicine', 'Pediatrics', 'Women\'s Health'],
      operatingHours: '7:00 AM - 8:00 PM',
      bookingPolicy: 'Same day booking available',
      paymentRequired: false
    }
  ]);

  const doctors = ref<Doctor[]>([
    {
      id: '3',
      email: 'doctor@demo.com',
      role: 'doctor',
      name: 'Dr. Sarah Johnson',
      clinicId: '2',
      specialization: 'Cardiology',
      experience: 10,
      qualifications: ['MD', 'FACC'],
      consultationFee: 150
    },
    {
      id: '5',
      email: 'dr.smith@demo.com',
      role: 'doctor',
      name: 'Dr. Michael Smith',
      clinicId: '2',
      specialization: 'General Medicine',
      experience: 8,
      qualifications: ['MD', 'MBBS'],
      consultationFee: 120
    }
  ]);

  const searchClinics = (query: string) => {
    return clinics.value.filter(clinic => 
      clinic.clinicName.toLowerCase().includes(query.toLowerCase()) ||
      clinic.services.some(service => 
        service.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const getClinicById = (id: string) => {
    return clinics.value.find(clinic => clinic.id === id);
  };

  const getDoctorsByClinic = (clinicId: string) => {
    return doctors.value.filter(doctor => doctor.clinicId === clinicId);
  };

  const getDoctorById = (id: string) => {
    return doctors.value.find(doctor => doctor.id === id);
  };

  return {
    clinics,
    doctors,
    searchClinics,
    getClinicById,
    getDoctorsByClinic,
    getDoctorById
  };
});