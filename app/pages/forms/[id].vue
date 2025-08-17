<script setup lang="ts">
import type { FormSchema } from '~~/types/form'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import UiLoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import UiErrorMessage from '~/components/ui/ErrorMessage.vue'

// レイアウトを指定
definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const formId = route.params.id as string

// フォーム詳細を取得
const { data: response, pending, error } = await useFetch(`/api/forms/${formId}`)
const form = computed(() => response.value?.data)
const formSchema = computed(() => (form.value?.schema as unknown as FormSchema) || { fields: [] })

// 日付フォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 公開URLをコピー
const copyPublicUrl = async () => {
  if (!form.value) return
  
  const publicUrl = `${window.location.origin}/f/${form.value.publicPath}`
  try {
    await navigator.clipboard.writeText(publicUrl)
    alert('公開URLをコピーしました！')
  } catch (err) {
    console.error('コピーに失敗しました:', err)
  }
}

// SEO設定
useHead({
  title: computed(() => form.value ? `${form.value.title} - フォーム詳細` : 'フォーム詳細'),
})
</script>

<template>
  <AppHeader 
    :title="form?.title || 'フォーム詳細'" 
    show-back-button 
    @back="navigateTo('/')"
  >
    <template #actions>
      <div class="flex space-x-2">
        <BaseButton 
          v-if="form"
          @click="navigateTo(`/f/${form.publicPath}`)"
          variant="secondary"
        >
          プレビュー
        </BaseButton>
        <BaseButton 
          v-if="form"
          @click="copyPublicUrl"
          variant="secondary"
        >
          URLコピー
        </BaseButton>
        <BaseButton 
          v-if="form"
          @click="navigateTo(`/forms/${form.id}/edit`)"
        >
          編集
        </BaseButton>
      </div>
    </template>
  </AppHeader>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- ローディング状態 -->
    <UiLoadingSpinner v-if="pending" />

    <!-- エラー状態 -->
    <UiErrorMessage v-else-if="error" :message="error.message" />

    <!-- フォーム詳細 -->
    <div v-else-if="form" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- フォーム情報 -->
      <div class="space-y-6">
        <!-- 基本情報 -->
        <BaseCard>
          <template #header>
            <h2 class="text-lg font-semibold">フォーム情報</h2>
          </template>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">タイトル</label>
              <p class="mt-1 text-sm text-gray-900">{{ form.title }}</p>
            </div>
            
            <div v-if="formSchema.description">
              <label class="block text-sm font-medium text-gray-700">説明</label>
              <p class="mt-1 text-sm text-gray-900">{{ formSchema.description }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">公開URL</label>
              <div class="mt-1 flex">
                <code class="flex-1 text-xs bg-gray-100 px-2 py-1 rounded-l border">
                  /f/{{ form.publicPath }}
                </code>
                <button
                  @click="copyPublicUrl"
                  class="px-2 py-1 bg-blue-500 text-white text-xs rounded-r hover:bg-blue-600"
                >
                  コピー
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">ステータス</label>
              <span 
                :class="form.isPublic ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'"
                class="mt-1 inline-block text-xs px-2 py-1 rounded-full"
              >
                {{ form.isPublic ? '公開中' : '非公開' }}
              </span>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">作成日時</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(form.createdAt) }}</p>
            </div>
          </div>
        </BaseCard>

        <!-- 統計情報 -->
        <BaseCard>
          <template #header>
            <h2 class="text-lg font-semibold">統計</h2>
          </template>
          
          <div class="text-center py-6">
            <div class="text-3xl font-bold text-blue-600">{{ form._count?.submissions || 0 }}</div>
            <div class="text-sm text-gray-500 mt-1">件の回答</div>
            
            <div class="mt-4">
              <div class="text-lg font-semibold text-gray-900">{{ formSchema.fields?.length || 0 }}</div>
              <div class="text-sm text-gray-500">個のフィールド</div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- フォームフィールド一覧 -->
      <div>
        <BaseCard>
          <template #header>
            <h2 class="text-lg font-semibold">フォームフィールド</h2>
          </template>
          
          <div v-if="formSchema.fields && formSchema.fields.length > 0" class="space-y-4">
            <div 
              v-for="(field, index) in formSchema.fields" 
              :key="field.id"
              class="p-3 border rounded-lg"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900">{{ field.label }}</h4>
                  <p class="text-sm text-gray-500 capitalize">{{ field.type }}</p>
                  <p v-if="field.placeholder" class="text-xs text-gray-400 mt-1">
                    プレースホルダー: {{ field.placeholder }}
                  </p>
                </div>
                <div class="flex items-center space-x-2">
                  <span v-if="field.required" class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                    必須
                  </span>
                  <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    #{{ index + 1 }}
                  </span>
                </div>
              </div>
              
              <!-- 選択肢がある場合 -->
              <div v-if="field.options && field.options.length > 0" class="mt-2">
                <p class="text-xs text-gray-500 mb-1">選択肢:</p>
                <ul class="text-xs text-gray-600 ml-4 space-y-1">
                  <li v-for="option in field.options" :key="option" class="list-disc">
                    {{ option }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            フィールドが設定されていません
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- フォームが見つからない場合 -->
    <div v-else class="text-center py-12">
      <div class="text-gray-500 text-lg mb-4">
        フォームが見つかりません
      </div>
      <BaseButton @click="navigateTo('/')">
        フォーム一覧に戻る
      </BaseButton>
    </div>
  </main>
</template> 