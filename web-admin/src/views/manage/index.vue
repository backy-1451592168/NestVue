<!-- 后台入口 -->
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const showMenu = computed(() => {
  // 默认显示菜单，除非明确标记不显示
  // 遍历所有匹配到的路由（从父到子）
  return route.matched.some(
    (r) => r.meta.showMenu !== false || r.meta.showMainMenu !== false
  );
});

</script>

<template>
  <div class="h-[100%] w-[100%]">
    <Manage v-if="showMenu" />
    <RouterView v-else />
  </div>
</template>
