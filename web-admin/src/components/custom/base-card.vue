<!-- 卡片 -->
<template>
  <div class="shadow-md !p-2.5 rounded-xl bg-white" :class="customClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  customClass?: string
}>();
</script>
