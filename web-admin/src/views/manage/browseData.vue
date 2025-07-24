<script setup lang="ts">
import { onMounted } from 'vue';
import apis from '@/api/login';

onMounted(() => {
  getList();
});
const getList = () => {
  apis.getUserInfo().then(res => {
    console.log(res);
    // 跳转路由
  }).finally(() => {
  });
};
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1><n-button @click="getList()">刷新</n-button>
  </div>
</template>

<style scoped></style>
