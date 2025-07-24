import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/patient',
      name: 'PatientDashboard',
      component: () => import('@/views/patient/Dashboard.vue'),
      meta: { requiresAuth: true, role: 'patient' },
      children: [
        {
          path: '',
          name: 'PatientHome',
          component: () => import('@/views/patient/Home.vue')
        },
        {
          path: 'search',
          name: 'SearchClinics',
          component: () => import('@/views/patient/SearchClinics.vue')
        },
        {
          path: 'nearby',
          name: 'NearbyClinics',
          component: () => import('@/views/patient/NearbyClinics.vue')
        },
        {
          path: 'browse',
          name: 'BrowseClinics',  
          component: () => import('@/views/patient/BrowseClinics.vue')
        },
        {
          path: 'appointments',
          name: 'MyAppointments',
          component: () => import('@/views/patient/MyAppointments.vue')
        },
        {
          path: 'history',
          name: 'AppointmentHistory',
          component: () => import('@/views/patient/History.vue')
        },
        {
          path: 'chatbot',
          name: 'Chatbot',
          component: () => import('@/views/patient/Chatbot.vue')
        },
        {
          path: 'clinic/:id',
          name: 'ClinicDetails',
          component: () => import('@/views/patient/ClinicDetails.vue')
        },
        {
          path: 'book/:clinicId',
          name: 'BookAppointment',
          component: () => import('@/views/patient/BookAppointment.vue')
        }
      ]
    },
    {
      path: '/clinic',
      name: 'ClinicDashboard',
      component: () => import('@/views/clinic/Dashboard.vue'),
      meta: { requiresAuth: true, role: 'clinic' },
      children: [
        {
          path: '',
          name: 'ClinicHome',
          component: () => import('@/views/clinic/Home.vue')
        },
        {
          path: 'appointments',
          name: 'ClinicAppointments',
          component: () => import('@/views/clinic/Appointments.vue')
        },
        {
          path: 'doctors',
          name: 'ManageDoctors',
          component: () => import('@/views/clinic/Doctors.vue')
        },
        {
          path: 'manage',
          name: 'ManageClinic',
          component: () => import('@/views/clinic/ManageClinic.vue')
        },
        {
          path: 'notifications',
          name: 'ClinicNotifications',
          component: () => import('@/views/clinic/Notifications.vue')
        }
      ]
    },
    {
      path: '/doctor',
      name: 'DoctorDashboard',
      component: () => import('@/views/doctor/Dashboard.vue'),
      meta: { requiresAuth: true, role: 'doctor' },
      children: [
        {
          path: '',
          name: 'DoctorHome',
          component: () => import('@/views/doctor/Home.vue')
        },
        {
          path: 'appointments',
          name: 'DoctorAppointments',
          component: () => import('@/views/doctor/Appointments.vue')
        },
        {
          path: 'history',
          name: 'DoctorHistory',
          component: () => import('@/views/doctor/History.vue')
        },
        {
          path: 'profile',
          name: 'DoctorProfile',
          component: () => import('@/views/doctor/Profile.vue')
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.role && authStore.userRole !== to.meta.role) {
    // Redirect to appropriate dashboard based on user role
    if (authStore.userRole === 'patient') {
      next('/patient');
    } else if (authStore.userRole === 'clinic') {
      next('/clinic');
    } else if (authStore.userRole === 'doctor') {
      next('/doctor');
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;