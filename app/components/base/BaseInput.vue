<script setup lang="ts">
interface Props {
  id?: string
  label?: string
  type?: 'text' | 'email' | 'number' | 'date' | 'password'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false
})

const model = defineModel<string | number>()

const inputClasses = computed(() => [
  'input',
  {
    'border-red-300 focus:ring-red-500 focus:border-red-500': props.error
  }
])
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <input
      :id="id"
      :type="type"
      v-model="model"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="inputClasses"
    />
    
    <p v-if="helpText" class="mt-1 text-xs text-gray-500">
      {{ helpText }}
    </p>
    
    <p v-if="error" class="mt-1 text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template> 