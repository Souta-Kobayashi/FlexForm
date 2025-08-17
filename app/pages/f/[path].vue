<script setup lang="ts">
import type { FormSchema } from '~~/types/form'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import FormField from '~/components/form/FormField.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import ErrorMessage from '~/components/ui/ErrorMessage.vue'

// レイアウトを指定
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const publicPath = route.params.path

// フォーム情報を取得
const { data: response, pending, error } = await useFetch(`/api/public/forms/${publicPath}`)

const form = computed(() => response.value?.data)
const formSchema = computed(() => (form.value?.schema as unknown as FormSchema) || { fields: [] })

// フォームデータの初期化
const formData = ref<Record<string, any>>({})
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref<string | string[] | null>(null)

// フォーム送信処理
const submitForm = async () => {
  try {
    submitting.value = true
    submitError.value = null

    const response = await $fetch(`/api/public/forms/${publicPath}/submit`, {
      method: 'POST',
      body: formData.value
    })

    if (response.success) {
      submitted.value = true
    }
  } catch (err: any) {
    console.error('送信エラー:', err)
    if (err.data?.errors) {
      submitError.value = err.data.errors
    } else {
      submitError.value = err.message || '送信に失敗しました'
    }
  } finally {
    submitting.value = false
  }
}

// SEO設定
useHead({
  title: computed(() => form.value ? `${form.value.title} - FlexForm` : 'フォーム - FlexForm')
})
</script> 

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- ローディング状態 -->
    <LoadingSpinner v-if="pending" full-screen />

    <!-- エラー状態 -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <BaseCard class="max-w-md w-full">
        <div class="text-center">
          <div class="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            フォームが見つかりません
          </h1>
          <p class="text-gray-600">
            指定されたフォームは存在しないか、公開されていません。
          </p>
        </div>
      </BaseCard>
    </div>

    <!-- 送信完了状態 -->
    <div v-else-if="submitted" class="min-h-screen flex items-center justify-center">
      <BaseCard class="max-w-md w-full">
        <div class="text-center">
          <div class="text-green-600 text-6xl mb-4">✅</div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">
            送信完了
          </h1>
          <p class="text-gray-600">
            ご回答ありがとうございました。<br>
            フォームの送信が完了いたしました。
          </p>
        </div>
      </BaseCard>
    </div>

    <!-- フォーム表示 -->
    <div v-else class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <BaseCard>
        <template #header>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ form?.title }}
          </h1>
          <p v-if="formSchema?.description" class="mt-2 text-gray-600">
            {{ formSchema.description }}
          </p>
        </template>

        <form @submit.prevent="submitForm">
          <!-- フィールド動的レンダリング -->
          <FormField
            v-for="field in formSchema?.fields || []"
            :key="field.id"
            :field="field"
            v-model="formData[field.id]"
          />

          <!-- エラーメッセージ -->
          <ErrorMessage v-if="submitError" :errors="submitError" class="mb-4" />

          <!-- 送信ボタン -->
          <BaseButton
            type="submit"
            :disabled="submitting"
            :loading="submitting"
            full-width
          >
            {{ submitting ? '送信中...' : '送信する' }}
          </BaseButton>
        </form>
      </BaseCard>
    </div>
  </div>
</template>