<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  errors?: string | string[]
}

withDefaults(defineProps<Props>(), {
  title: 'エラーが発生しました'
})
</script>

<template>
  <div class="bg-red-50 border border-red-200 rounded-md p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <div class="text-red-600 text-xl">⚠️</div>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-red-800">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm text-red-700">
          <div v-if="Array.isArray(errors)">
            <ul class="list-disc list-inside">
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </div>
          <div v-else>{{ errors || message }}</div>
        </div>
      </div>
    </div>
  </div>
</template> 