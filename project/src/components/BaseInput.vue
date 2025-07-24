<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <div v-if="icon" class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <component :is="icon" class="h-5 w-5 text-gray-400" />
      </div>
    </div>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  id?: string;
  type?: string;
  label?: string;
  modelValue?: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  icon?: any;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: ''
});

defineEmits(['update:modelValue', 'blur', 'focus']);

const inputClasses = computed(() => {
  const base = 'block w-full rounded-lg border shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0';
  const padding = props.icon ? 'pl-10 pr-3 py-2' : 'px-3 py-2';
  const state = props.error 
    ? 'border-red-300 focus:border-red-400 focus:ring-red-200' 
    : 'border-gray-300 focus:border-primary-400 focus:ring-primary-200';
  const disabled = props.disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white';
  
  return `${base} ${padding} ${state} ${disabled}`;
});
</script>