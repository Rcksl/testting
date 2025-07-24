<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Notifications</h2>
      <div class="flex space-x-3">
        <BaseButton variant="outline" @click="markAllAsRead">
          <CheckCircle class="h-4 w-4 mr-2" />
          Mark All Read
        </BaseButton>
        <BaseButton variant="ghost" @click="$router.push('/clinic')">
          <ArrowLeft class="h-4 w-4 mr-2" />
          Back to Dashboard
        </BaseButton>
      </div>
    </div>

    <!-- Notification Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <Bell class="h-6 w-6 text-blue-600" />
          </div>
          <p class="text-2xl font-bold text-blue-600">{{ stats.total }}</p>
          <p class="text-sm text-gray-600">Total Notifications</p>
        </div>
      </BaseCard>
      
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
            <AlertCircle class="h-6 w-6 text-orange-600" />
          </div>
          <p class="text-2xl font-bold text-orange-600">{{ stats.unread }}</p>
          <p class="text-sm text-gray-600">Unread</p>
        </div>
      </BaseCard>
      
      <BaseCard class="text-center">
        <div class="space-y-2">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
            <CheckCircle class="h-6 w-6 text-green-600" />
          </div>
          <p class="text-2xl font-bold text-green-600">{{ stats.read }}</p>
          <p class="text-sm text-gray-600">Read</p>
        </div>
      </BaseCard>
    </div>

    <!-- Filters -->
    <BaseCard>
      <div class="flex flex-wrap gap-4 items-center">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
          <select v-model="selectedType" class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
            <option value="">All Types</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select v-model="selectedStatus" class="rounded-lg border-gray-300 shadow-sm focus:border-primary-400 focus:ring-primary-200">
            <option value="">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <BaseButton variant="outline" @click="clearFilters">
            Clear Filters
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Notifications List -->
    <BaseCard header="Recent Notifications">
      <div class="space-y-4">
        <div v-if="filteredNotifications.length === 0" class="text-center py-8 text-gray-500">
          <Bell class="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p>No notifications found</p>
        </div>
        
        <div v-else class="space-y-3">
          <div v-for="notification in filteredNotifications" :key="notification.id" 
               :class="[
                 'p-4 rounded-lg border transition-all cursor-pointer',
                 notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
               ]"
               @click="markAsRead(notification.id)">
            <div class="flex items-start space-x-3">
              <div :class="getTypeIconClass(notification.type)" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <component :is="getTypeIcon(notification.type)" class="h-4 w-4" />
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 :class="notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'" class="text-sm">
                    {{ notification.title }}
                  </h3>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500">{{ formatDate(notification.createdAt) }}</span>
                    <div v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <p :class="notification.read ? 'text-gray-600' : 'text-gray-700'" class="text-sm mt-1">
                  {{ notification.message }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import BaseCard from '@/components/BaseCard.vue';
import BaseButton from '@/components/BaseButton.vue';
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-vue-next';
import type { Notification } from '@/types';

const authStore = useAuthStore();

const selectedType = ref('');
const selectedStatus = ref('');

// Mock notifications data
const notifications = ref<Notification[]>([
  {
    id: '1',
    userId: authStore.user?.id || '',
    title: 'New Appointment Booked',
    message: 'Patient #123 has booked an appointment for tomorrow at 10:00 AM with Dr. Johnson.',
    type: 'info',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: authStore.user?.id || '',
    title: 'Payment Received',
    message: 'Payment of $150 has been received for appointment #456.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    userId: authStore.user?.id || '',
    title: 'Appointment Cancelled',
    message: 'Patient #789 has cancelled their appointment scheduled for today at 2:00 PM.',
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    userId: authStore.user?.id || '',
    title: 'System Maintenance',
    message: 'Scheduled system maintenance will occur tonight from 11:00 PM to 1:00 AM.',
    type: 'info',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '5',
    userId: authStore.user?.id || '',
    title: 'Failed Payment',
    message: 'Payment failed for appointment #321. Please contact the patient.',
    type: 'error',
    read: false,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
]);

const filteredNotifications = computed(() => {
  let filtered = notifications.value;
  
  if (selectedType.value) {
    filtered = filtered.filter(n => n.type === selectedType.value);
  }
  
  if (selectedStatus.value) {
    if (selectedStatus.value === 'read') {
      filtered = filtered.filter(n => n.read);
    } else if (selectedStatus.value === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }
  }
  
  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const stats = computed(() => {
  const total = notifications.value.length;
  const unread = notifications.value.filter(n => !n.read).length;
  const read = total - unread;
  
  return { total, unread, read };
});

const getTypeIcon = (type: string) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle
  };
  return icons[type as keyof typeof icons] || Info;
};

const getTypeIconClass = (type: string) => {
  const classes = {
    info: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    error: 'bg-red-100 text-red-600'
  };
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-600';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

const markAsRead = (notificationId: string) => {
  const notification = notifications.value.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true);
};

const clearFilters = () => {
  selectedType.value = '';
  selectedStatus.value = '';
};
</script>