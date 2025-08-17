<script setup lang="ts">
interface Props {
  title: string
  showBackButton?: boolean
}

withDefaults(defineProps<Props>(), {
  showBackButton: false
})

defineEmits<{
  back: []
}>()
</script>

<template>
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-4">
          <button 
            v-if="showBackButton"
            @click="$emit('back')"
            class="text-gray-600 hover:text-gray-800"
          >
            ← 戻る
          </button>
          <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
        </div>
        
        <div class="flex items-center space-x-2">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template> 