<script setup lang="ts">
import FormCard from '~/components/form/FormCard.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import UiLoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import UiErrorMessage from '~/components/ui/ErrorMessage.vue'
import AppHeader from '~/components/layout/AppHeader.vue'

// レイアウトを指定
definePageMeta({
  layout: 'admin'
})

// フォーム一覧を取得
const { data: response, pending, error } = await useFetch('/api/forms')

const forms = computed(() => response.value?.data || [])

// SEO設定
useHead({
  title: 'フォーム一覧 - FlexForm'
})
</script> 

<template>
  <AppHeader title="FlexForm">
    <template #actions>
      <BaseButton @click="navigateTo('/forms/new')">
        <span class="mr-2">+</span>
        新しいフォーム
      </BaseButton>
    </template>
  </AppHeader>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- ローディング状態 -->
    <UiLoadingSpinner v-if="pending" />

    <!-- エラー状態 -->
    <UiErrorMessage v-else-if="error" :message="error.message" />

    <!-- フォーム一覧 -->
    <div v-else>
      <div v-if="forms && forms.length === 0" class="text-center py-12">
        <div class="text-gray-500 text-lg mb-4">
          まだフォームが作成されていません
        </div>
        <BaseButton @click="navigateTo('/forms/new')">
          最初のフォームを作成
        </BaseButton>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FormCard
          v-for="form in forms"
          :key="form.id"
          :form="form"
          @click="navigateTo(`/forms/${form.id}`)"
          @preview="navigateTo(`/f/${form.publicPath}`)"
          @edit="navigateTo(`/forms/${form.id}/edit`)"
        />
      </div>
    </div>
  </main>
</template>
