<script setup lang="ts">
import type { FormField as FormFieldType } from '~~/types/form'

interface Props {
  field: FormFieldType
}

defineProps<Props>()

const model = defineModel<any>()
</script>

<template>
  <div class="mb-6">
    <label 
      :for="field.id"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ field.label }}
      <span v-if="field.required" class="text-red-500">*</span>
    </label>

    <!-- テキスト入力 -->
    <BaseInput
      v-if="field.type === 'text'"
      :id="field.id"
      v-model="model"
      type="text"
      :placeholder="field.placeholder"
      :required="field.required"
    />

    <!-- メール入力 -->
    <BaseInput
      v-else-if="field.type === 'email'"
      :id="field.id"
      v-model="model"
      type="email"
      :placeholder="field.placeholder"
      :required="field.required"
    />

    <!-- 数値入力 -->
    <BaseInput
      v-else-if="field.type === 'number'"
      :id="field.id"
      v-model="model"
      type="number"
      :placeholder="field.placeholder"
      :required="field.required"
    />

    <!-- 日付入力 -->
    <BaseInput
      v-else-if="field.type === 'date'"
      :id="field.id"
      v-model="model"
      type="date"
      :required="field.required"
    />

    <!-- テキストエリア -->
    <textarea
      v-else-if="field.type === 'textarea'"
      :id="field.id"
      v-model="model"
      :placeholder="field.placeholder"
      :required="field.required"
      rows="4"
      class="input"
    />

    <!-- セレクト -->
    <select
      v-else-if="field.type === 'select'"
      :id="field.id"
      v-model="model"
      :required="field.required"
      class="input"
    >
      <option value="">選択してください</option>
      <option
        v-for="option in field.options"
        :key="option"
        :value="option"
      >
        {{ option }}
      </option>
    </select>

    <!-- チェックボックス -->
    <div v-else-if="field.type === 'checkbox'" class="space-y-2">
      <div
        v-for="option in field.options"
        :key="option"
        class="flex items-center"
      >
        <input
          :id="`${field.id}_${option}`"
          v-model="model"
          type="checkbox"
          :value="option"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          :for="`${field.id}_${option}`"
          class="ml-2 text-sm text-gray-700"
        >
          {{ option }}
        </label>
      </div>
    </div>
  </div>
</template> 