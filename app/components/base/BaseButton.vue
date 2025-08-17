<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'btn',
  `btn-${props.variant}`,
  {
    'w-full': props.fullWidth,
    'text-xs py-2': props.size === 'sm',
    'text-base py-3': props.size === 'lg'
  }
])
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2">
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block"></div>
    </span>
    <slot />
  </button>
</template> 