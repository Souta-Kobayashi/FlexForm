<script setup lang="ts">
import BaseCard from '~/components/base/BaseCard.vue'

interface FormSummary {
  id: string
  title: string
  publicPath: string
  isPublic: boolean
  updatedAt: string
  _count: {
    submissions: number
  }
}

interface Props {
  form: FormSummary
}

defineProps<Props>()

defineEmits<{
  click: []
  preview: []
  edit: []
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <BaseCard class="hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="$emit('click')">
    <h3 class="text-lg font-semibold text-gray-900 mb-2">
      {{ form.title }}
    </h3>
    
    <div class="text-sm text-gray-600 mb-4">
      公開URL: <code class="bg-gray-100 px-1 rounded">/f/{{ form.publicPath }}</code>
    </div>
    
    <div class="flex justify-between items-center text-sm text-gray-500">
      <span>{{ form._count.submissions }} 件の回答</span>
      <span>{{ formatDate(form.updatedAt) }}</span>
    </div>
    
    <div class="mt-3 flex justify-between items-center">
      <span 
        :class="form.isPublic ? 'text-green-600' : 'text-gray-400'"
        class="text-xs font-medium"
      >
        {{ form.isPublic ? '公開中' : '非公開' }}
      </span>
      
      <div class="flex space-x-2">
        <button 
          @click.stop="$emit('preview')"
          class="text-blue-600 hover:text-blue-800 text-xs"
        >
          プレビュー
        </button>
        <button 
          @click.stop="$emit('edit')"
          class="text-gray-600 hover:text-gray-800 text-xs"
        >
          編集
        </button>
      </div>
    </div>
  </BaseCard>
</template> 