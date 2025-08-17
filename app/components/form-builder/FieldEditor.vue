<script setup lang="ts">
import type { FormField } from '~~/types/form'
import FieldPreview from './FieldPreview.vue'

interface Props {
  fieldTypeLabel: string
  isSelected: boolean
  canMoveUp: boolean
  canMoveDown: boolean
}

defineProps<Props>()

defineEmits<{
  select: []
  'move-up': []
  'move-down': []
  remove: []
}>()

const editableField = defineModel<FormField>({ required: true })

const hasOptions = computed(() => 
  ['select', 'checkbox'].includes(editableField.value.type)
)

const optionsText = computed(() => 
  editableField.value.options?.join('\n') || ''
)

const updateOptions = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const options = target.value.split('\n').filter(option => option.trim())
  
  editableField.value = { ...editableField.value, options }
}
</script> 

<template>
  <div
    class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
    :class="{ 'border-blue-500': isSelected }"
    @click="$emit('select')"
  >
    <!-- フィールド編集ヘッダー -->
    <div class="flex justify-between items-center mb-3">
      <span class="text-sm font-medium text-gray-500">
        {{ fieldTypeLabel }}
      </span>
      <div class="flex space-x-2">
        <button
          @click.stop="$emit('move-up')"
          :disabled="!canMoveUp"
          class="text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          ↑
        </button>
        <button
          @click.stop="$emit('move-down')"
          :disabled="!canMoveDown"
          class="text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          ↓
        </button>
        <button
          @click.stop="$emit('remove')"
          class="text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    </div>

    <!-- フィールド設定 -->
    <div v-if="isSelected" class="mb-4 p-3 bg-gray-50 rounded border">
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model="editableField.label"
          label="ラベル"
          class="text-sm"
        />
        <BaseInput
          v-model="editableField.placeholder"
          label="プレースホルダー"
          class="text-sm"
        />
        
        <div class="col-span-2">
          <label class="flex items-center">
            <input
              v-model="editableField.required"
              type="checkbox"
              class="mr-2"
            />
            <span class="text-xs text-gray-700">必須項目</span>
          </label>
        </div>
        
        <!-- 選択肢設定（select, checkbox用） -->
        <div v-if="hasOptions" class="col-span-2">
          <label class="block text-xs font-medium text-gray-700 mb-1">
            選択肢（1行に1つずつ）
          </label>
          <textarea
            :value="optionsText"
            @input="updateOptions"
            rows="3"
            class="input text-sm"
            placeholder="選択肢1&#10;選択肢2&#10;選択肢3"
          />
        </div>
      </div>
    </div>

    <!-- フィールドプレビュー -->
    <FieldPreview :field="editableField" />
  </div>
</template>
