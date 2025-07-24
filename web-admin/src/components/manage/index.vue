<script lang="ts" setup>
import type { VNode } from 'vue';
import { h, computed, onMounted, onUnmounted, ref, reactive, watch } from 'vue';
import type { MenuOption } from 'naive-ui';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { useRouter, useRoute } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { generateMenuOptions } from '@/utils/common/menu.ts'; // 路径按需调整
import { mainStore } from '@/stores';
import { useFullscreen } from '@/utils/common/fullscreen';
import apis from '@/api/login';

const { isFullscreen, toggleFullScreen } = useFullscreen();

const zIndex = 1;

// 图标根据状态切换
const icon = computed(() => collapsed.value ? 'line-md:menu-fold-right' : 'line-md:menu-fold-left');

// 菜单折叠
const collapsed = ref(true);
// 切换状态方法
function toggleCollapse() {
  collapsed.value = !collapsed.value;
}

// 获取路由表并生成菜单项
const router = useRouter();
const menuOptions = computed(() =>
  generateMenuOptions(router.options.routes as RouteRecordRaw[])
);

const route = useRoute();
const activeKey = ref(route.path); // 默认高亮
const pageTitle = ref(''); // 标题
// 初始化时查找当前菜单标题
const matchedItem = findMenuItemByPath(menuOptions.value, route.path);
if (matchedItem && typeof matchedItem.label === 'string') {
  pageTitle.value = matchedItem.label;
}

// 递归查找菜单项
function findMenuItemByPath(options: MenuOption[], path: string): MenuOption | null {
  for (const item of options) {
    if (item.path === path) return item;
    if (item.children?.length) {
      const found = findMenuItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

type DropdownKey = 'user-center' | 'logout';
type DropdownOption =
  | {
    key: DropdownKey;
    label: string;
    icon?: () => VNode;
  }
  | {
    type: 'divider';
    key: string;
  };
const dropdownItems = computed(() => {
  const opts: DropdownOption[] = [
    // {
    //   label: '个人中心',
    //   key: 'user-center',
    //   icon: () => h(SvgIcon, { icon: 'ph:user-circle', fontSize: 18 })
    // },
    // {
    //   type: 'divider',
    //   key: 'divider'
    // },
    {
      label: '退出登录',
      key: 'logout',
      icon: () => h(SvgIcon, { icon: 'ph:sign-out', fontSize: 18 })
    }
  ];

  return opts;
});

const authStore = reactive({
  isLogin: true,
  userName: '-'
});

const getUserInfo = () => {
  apis.getUserInfo().then(res => {
    authStore.userName = res.data.userName;
    // 跳转路由
  }).finally(() => {
  });
};

function loginOrRegister() {
};
function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    router.push('/login');
    const store = mainStore();
    store.token = '';
  } else {
  }
}

const handleUpdateValue = (key: string, item: MenuOption & { path: string, label: string }) => {
  activeKey.value = key;
  pageTitle.value = item.label;
  router.push(item.path);
};

// 判断设备
const isMobile = ref(window.innerWidth <= 768);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

window.addEventListener('resize', updateIsMobile);

// 可选：在组件卸载时移除监听器，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
});

onMounted(() => {
  getUserInfo();
});

watch(
  () => route.path,
  () => {
    activeKey.value = route.path;
  },
  { immediate: true } // 页面初始时也触发一次
);
</script>

<template>
  <header class="h-[56px] flex items-center bg-white justify-between"
    :class="isMobile ? '' : (collapsed ? 'pl-[64px]' : 'pl-[220px]')">
    <div class="flex items-center !ml-[10px]">
      <ButtonIcon :tooltip-content="collapsed ? '展开菜单' : '折叠菜单'" tooltip-placement="bottom-start" :z-index="zIndex"
        :icon="icon" :key="icon" :iconSize="18" @click="toggleCollapse">
      </ButtonIcon>
      <div class="text-lg font-semibold">{{ pageTitle }}</div>
    </div>

    <div class="flex items-center">
      <div style="margin-right: 1.5rem;" v-show="!isMobile" @click="toggleFullScreen">
        <SvgIcon :icon="isFullscreen ? 'icon-park:off-screen-one' : 'icon-park:full-screen-one'" class="text-icon-large"
          :fontSize="22" />
      </div>
      <NButton v-if="!authStore.isLogin" quaternary @click="loginOrRegister">
        登录 / 注册
      </NButton>
      <NDropdown v-else placement="bottom" trigger="click" :options="dropdownItems" @select="handleDropdown">
        <div class="flex">
          <ButtonIcon class="flex items-center">
            <SvgIcon icon="ph:user-circle" class="text-icon-large" :fontSize="24" />
            <span class="text-base !font-medium !ml-[4px]">{{ authStore.userName }}</span>
          </ButtonIcon>
        </div>
      </NDropdown>
    </div>
  </header>
  <transition name="aside-slide" appear>
    <aside v-show="!isMobile || !collapsed"
      class="h-full absolute top-0 transition duration-300 shadow-md z-6 flex flex-col"
      :class="collapsed ? 'size-[64px]' : 'size-[220px]'">
      <div class="h-[56px] flex justify-center items-center text-2xl text-[#4f69f9] bg-white">
        <div class="w-[30px] h-[30px] flex items-center justify-center">
          <SvgIcon icon="fluent-color:savings-16" :font-size="30" />
        </div>
        <Transition enter-active-class="transition duration-400" enter-from-class="opacity-0 translate-x-2 scale-95"
          enter-to-class="opacity-100 translate-x-0 scale-100" leave-active-class="transition duration-100"
          leave-from-class="opacity-100 translate-x-0 scale-100" leave-to-class="opacity-0 translate-x-2 scale-95">
          <h2 v-show="!collapsed" class="!ml-[4px] !font-black text-[#4f69f9] text-lg whitespace-nowrap">
            管理系统
          </h2>
        </Transition>
      </div>
      <NSpace vertical class="flex-1 overflow-hidden bg-white">
        <NLayout has-sider>
          <NLayout-sider bordered collapse-mode="width" :collapsed-width="64" :width="220" :collapsed="collapsed"
            @collapse="collapsed = true" @expand="collapsed = false">
            <NMenu :value="activeKey" @update:value="handleUpdateValue" :collapsed="collapsed" :collapsed-width="64"
              :collapsed-icon-size="22" :options="menuOptions" />
          </NLayout-sider>
        </NLayout>
      </NSpace>
    </aside>
  </transition>
  <!-- 移动端遮罩 -->
  <div v-if="isMobile && !collapsed"
    class="z-5 absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.2)] _layout-mobile-sider-mask_c343q_31"
    @click="toggleCollapse"></div>
  <main :class="[
    isMobile ? '' : (collapsed ? 'pl-[64px]' : 'pl-[220px]')
  ]">
    <div style="height: calc(100dvh - 56px); overflow: auto;"
      class="bg-[#f7fafc] flex flex-col gap-4 overflow-hidden lt-sm:overflow-auto p-3 flex-grow bg-layout transition duration-300">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
/* ::v-deep(.n-menu-item-content) {
  padding-left: 18px !important;
} */
.aside-slide-enter-active,
.aside-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.aside-slide-enter-from,
.aside-slide-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* 去掉菜单边框 */
::v-deep(.n-layout-sider.n-layout-sider--bordered .n-layout-sider__border) {
  display: none;
}
</style>
