<script setup lang="ts">
import type { FormField } from '~~/types/form'

interface Props {
  field: FormField
}

defineProps<Props>()
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>
    
    <!-- プレビュー表示 -->
    <input
      v-if="['text', 'email', 'number'].includes(field.type)"
      :type="field.type"
      :placeholder="field.placeholder"
      disabled
      class="input opacity-75"
    />
    
    <input
      v-else-if="field.type === 'date'"
      type="date"
      disabled
      class="input opacity-75"
    />
    
    <textarea
      v-else-if="field.type === 'textarea'"
      :placeholder="field.placeholder"
      disabled
      rows="3"
      class="input opacity-75"
    />
    
    <select
      v-else-if="field.type === 'select'"
      disabled
      class="input opacity-75"
    >
      <option>選択してください</option>
      <option v-for="option in field.options" :key="option">
        {{ option }}
      </option>
    </select>
    
    <div v-else-if="field.type === 'checkbox'" class="space-y-2">
      <div
        v-for="option in field.options"
        :key="option"
        class="flex items-center"
      >
        <input type="checkbox" disabled class="mr-2" />
        <span class="text-sm text-gray-700">{{ option }}</span>
      </div>
    </div>
  </div>
</template>
