<template>
  <div :class="cardClasses">
    <div v-if="header" class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">{{ header }}</h3>
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  header?: string;
  padding?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  padding: true,
  shadow: 'md',
  rounded: true
});

const cardClasses = computed(() => {
  const base = 'bg-white border border-gray-200';
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  const rounded = props.rounded ? 'rounded-lg' : '';
  
  return `${base} ${shadows[props.shadow]} ${rounded}`;
});

const bodyClasses = computed(() => {
  return props.padding ? 'p-6' : '';
});
</script>