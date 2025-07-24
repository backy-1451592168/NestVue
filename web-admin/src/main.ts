// src/main.ts
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// 动态设置 html font-size
function setRemUnit() {
  const html = document.documentElement;
  const width = html.clientWidth;

  if (width >= 768) {
    // 假设设计稿宽度是1920px
    // 例如屏幕宽1920时，font-size = 16px
    const fontSize = Math.max((width / 1920) * 16, 16); // 最小限制为 16px
    html.style.fontSize = fontSize + 'px';
  } else {
    // 移动端，基于设计稿375宽度
    html.style.fontSize = (width / 375) * 16 + 'px';
    // 这样375宽是16px，320宽是 ~13.65px
  }
}
window.addEventListener('resize', setRemUnit);
setRemUnit();

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
