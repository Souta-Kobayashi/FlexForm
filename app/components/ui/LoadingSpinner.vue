<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullScreen: false
})

const containerClasses = computed(() => [
  'flex flex-col justify-center items-center',
  {
    'min-h-screen': props.fullScreen,
    'py-12': !props.fullScreen
  }
])

const spinnerClasses = computed(() => [
  'animate-spin rounded-full border-b-2 border-blue-600',
  {
    'h-4 w-4': props.size === 'sm',
    'h-8 w-8': props.size === 'md',
    'h-12 w-12': props.size === 'lg'
  }
])
</script>

<template>
  <div :class="containerClasses">
    <div :class="spinnerClasses"></div>
    <p v-if="message" class="mt-2 text-gray-600">{{ message }}</p>
  </div>
</template> 