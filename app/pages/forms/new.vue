<script setup lang="ts">
import type { FormField } from '~~/types/form'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import FieldEditor from '~/components/form-builder/FieldEditor.vue'

// レイアウトを指定
definePageMeta({
  layout: 'admin'
})

// フィールドタイプ定義
const fieldTypes: Array<{ type: FormField['type'], label: string }> = [
  { type: 'text', label: 'テキスト' },
  { type: 'email', label: 'メール' },
  { type: 'number', label: '数値' },
  { type: 'date', label: '日付' },
  { type: 'textarea', label: 'テキストエリア' },
  { type: 'select', label: 'セレクト' },
  { type: 'checkbox', label: 'チェックボックス' }
]

// フォーム設定
const formTitle = ref('')
const formDescription = ref('')
const publicPath = ref('')

// フィールド管理
const fields = ref<FormField[]>([])
const selectedFieldIndex = ref(-1)

// 状態管理
const saving = ref(false)
const error = ref('')

// フィールド追加
const addField = (type: FormField['type']) => {
  const newField: FormField = {
    id: `field_${Date.now()}`,
    type,
    label: `新しい${getFieldTypeLabel(type)}`,
    placeholder: '',
    required: false,
    options: ['select', 'checkbox'].includes(type) ? ['選択肢1', '選択肢2'] : undefined
  }
  
  fields.value.push(newField)
  selectedFieldIndex.value = fields.value.length - 1
}

// フィールド削除
const removeField = (index: number) => {
  fields.value.splice(index, 1)
  if (selectedFieldIndex.value === index) {
    selectedFieldIndex.value = -1
  } else if (selectedFieldIndex.value > index) {
    selectedFieldIndex.value--
  }
}

// フィールド移動
const moveField = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < fields.value.length) {
    const [field] = fields.value.splice(index, 1)
    fields.value.splice(newIndex, 0, field)
    
    if (selectedFieldIndex.value === index) {
      selectedFieldIndex.value = newIndex
    }
  }
}

// フィールドタイプラベル取得
const getFieldTypeLabel = (type: FormField['type']): string => {
  return fieldTypes.find(ft => ft.type === type)?.label ?? type
}

// タイトルから公開パスを自動生成
watch(formTitle, (newTitle) => {
  if (!publicPath.value) {
    publicPath.value = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s\-_]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50)
  }
})

// フォーム保存
const saveForm = async () => {
  try {
    error.value = ''
    saving.value = true

    if (!formTitle.value.trim()) {
      throw new Error('フォームタイトルは必須です')
    }

    if (!publicPath.value.trim()) {
      throw new Error('公開パスは必須です')
    }

    if (!/^[a-zA-Z0-9\-_]+$/.test(publicPath.value)) {
      throw new Error('公開パスは英数字、ハイフン、アンダースコアのみ使用可能です')
    }

    const formSchema = {
      title: formTitle.value,
      description: formDescription.value,
      fields: fields.value
    }

    const response = await $fetch('/api/forms', {
      method: 'POST',
      body: {
        title: formTitle.value,
        schema: formSchema,
        publicPath: publicPath.value
      }
    })

    if (response.success) {
      await navigateTo(`/forms/${response.data.id}`)
    }
  } catch (err: any) {
    console.error('保存エラー:', err)
    error.value = err.message || 'フォームの保存に失敗しました'
  } finally {
    saving.value = false
  }
}

// SEO設定
useHead({
  title: '新しいフォームを作成 - FlexForm'
})
</script>

<template>
  <AppHeader title="新しいフォームを作成" show-back-button @back="navigateTo('/')">
    <template #actions>
      <BaseButton 
        @click="saveForm"
        :disabled="saving || !formTitle.trim()"
        :loading="saving"
      >
        フォームを保存
      </BaseButton>
    </template>
  </AppHeader>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- フォーム設定パネル -->
      <div class="lg:col-span-1">
        <BaseCard class="sticky top-8">
          <template #header>
            <h2 class="text-lg font-semibold">フォーム設定</h2>
          </template>
          
          <div class="space-y-4">
            <!-- フォームタイトル -->
            <BaseInput
              v-model="formTitle"
              label="フォームタイトル *"
              placeholder="アンケートフォーム"
              required
            />

            <!-- 説明文 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                説明文
              </label>
              <textarea
                v-model="formDescription"
                placeholder="フォームの説明を入力してください"
                rows="3"
                class="input"
              />
            </div>

            <!-- 公開パス -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                公開パス *
              </label>
              <div class="flex">
                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  /f/
                </span>
                <input
                  v-model="publicPath"
                  type="text"
                  placeholder="survey-2024"
                  pattern="[a-zA-Z0-9\-_]+"
                  class="input rounded-l-none"
                  required
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">
                英数字、ハイフン、アンダースコアのみ使用可能
              </p>
            </div>

            <hr />

            <!-- フィールド追加 -->
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-3">フィールドを追加</h3>
              <div class="grid grid-cols-2 gap-2">
                <BaseButton
                  v-for="fieldType in fieldTypes"
                  :key="fieldType.type"
                  @click="addField(fieldType.type)"
                  variant="secondary"
                  size="sm"
                >
                  {{ fieldType.label }}
                </BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- フォームプレビュー -->
      <div class="lg:col-span-2">
        <BaseCard>
          <template #header>
            <h2 class="text-lg font-semibold">フォームプレビュー</h2>
          </template>
          
          <!-- フォームタイトル表示 -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ formTitle || 'フォームタイトル' }}
            </h1>
            <p v-if="formDescription" class="mt-2 text-gray-600">
              {{ formDescription }}
            </p>
          </div>

          <!-- フィールド一覧 -->
          <div v-if="fields.length === 0" class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <div class="text-gray-500">
              左のパネルからフィールドを追加してください
            </div>
          </div>

          <div v-else class="space-y-6">
            <FieldEditor
              v-for="(field, index) in fields"
              :key="field.id"
              v-model="fields[index] as FormField"
              :field-type-label="getFieldTypeLabel(field.type)"
              :is-selected="selectedFieldIndex === index"
              :can-move-up="index > 0"
              :can-move-down="index < fields.length - 1"
              @select="selectedFieldIndex = index"
              @move-up="moveField(index, -1)"
              @move-down="moveField(index, 1)"
              @remove="removeField(index)"
            />
          </div>
        </BaseCard>
      </div>
    </div>
  </main>

  <!-- エラーメッセージ -->
  <div
    v-if="error"
    class="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-md p-4 max-w-md"
  >
    <div class="text-sm text-red-600">{{ error }}</div>
  </div>
</template> 