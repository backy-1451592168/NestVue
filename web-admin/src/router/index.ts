import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/index.vue'),
      meta: { showMenu: false }, // 不显示菜单
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
      meta: { showMenu: false }, // 不显示菜单
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('../views/manage/index.vue'),
      meta: { label: '', showMenu: false, showMainMenu: true },
      children: [
        {
          path: 'browseData',
          name: 'manage_browseData',
          component: () => import('../views/manage/browseData.vue'),
          meta: {
            label: '首页',
            icon: 'material-symbols-light:date-range-outline',
            showMenu: true,
          },
        },
        {
          path: 'management',
          name: 'management',
          meta: { label: '编辑内容', icon: 'basil:edit-outline', showMenu: true },
          children: [
            {
              path: 'editHolidays',
              name: 'management_editHolidays',
              component: () => import('../views/manage/management/editHolidays.vue'),
              meta: {
                label: '编辑',
                icon: 'material-symbols-light:date-range-outline',
                showMenu: true,
              },
            },
          ],
        },
      ],
    },
    // ✅ 通配符路由，未匹配重定向到首页
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

// ✅ 添加全局前置守卫
router.beforeEach((to, from, next) => {
  const normalizedPath = to.path.replace(/\/{2,}/g, '/');
  if (to.path !== normalizedPath) {
    next({ path: normalizedPath, replace: true });
  } else {
    next();
  }
});

export default router;
