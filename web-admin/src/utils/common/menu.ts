// src/utils/common
// 类型检查
import type { MenuOption } from 'naive-ui';
import type { RouteRecordRaw } from 'vue-router';
import { h } from 'vue';
import SvgIcon from '@/components/custom/svg-icon.vue';

/**
 * 将 vue-router 的路由表转换为 Naive UI 菜单所需的 MenuOption 数组
 * @param routes 路由数组（通常来自 vue-router 的 router.options.routes）
 * @param basePath 当前路径的父级路径，用于拼接完整路径，默认值为 ''
 * @returns MenuOption[] 菜单选项数组，用于 NMenu 的 options
 */
export function generateMenuOptions(routes: RouteRecordRaw[], basePath = ''): MenuOption[] {
  const menuOptions: MenuOption[] = [];

  routes.forEach((route) => {
    // 拼接完整路径：
    // 如果当前路径是以 / 开头，说明是绝对路径，直接使用；
    // 否则认为是相对路径，拼接上 basePath
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${basePath}/${route.path}`.replace(/\/+/g, '/'); // 防止出现多个 /

    // 递归处理子路由
    const children = route.children ? generateMenuOptions(route.children, fullPath) : [];

    // 如果该路由不需要在菜单中显示（例如：layout容器页），但子菜单需要显示
    if (route.meta?.showMenu === false) {
      if (children.length) {
        // 子菜单提升到当前层级
        menuOptions.push(...children);
      }
      return; // 不处理当前项
    }

    // 构建菜单项
    const option: MenuOption = {
      path: fullPath, // 自定义属性，后面路由跳转用得到
      key: fullPath, // 必填项，唯一标识
      label: route.meta?.label || (route.name as string), // 显示的标题
      icon: route.meta?.icon
        ? () => h(SvgIcon, { icon: route.meta!.icon! as string, fontSize: 20 }) // 渲染图标组件
        : undefined,
    };

    // 如果有子菜单，挂载到 children 上
    if (children.length) {
      option.children = children;
    }

    // 添加当前菜单项到结果数组中
    menuOptions.push(option);
  });

  return menuOptions;
}
