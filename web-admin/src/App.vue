<script setup lang="ts">
</script>

<template>
  <AppProvider>
    <!-- h-[100dvh] 只适合现代浏览器 dvh -->
    <RouterView class="h-[100dvh]" />
    <!-- <NWatermark v-if="true" v-bind="watermarkProps" /> -->
  </AppProvider>
</template>

<style scoped></style>
