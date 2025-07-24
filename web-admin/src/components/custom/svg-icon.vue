<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Icon } from '@iconify/vue';

// 设置组件名称，避免在调试工具中显示匿名组件
defineOptions({ name: 'SvgIcon', inheritAttrs: false });

/**
 * 组件支持的 Props
 *
 * - 支持传入 iconify 图标（通过 icon）
 * - 支持使用本地图标（通过 localIcon），优先渲染本地图标
 */
interface Props {
  /** Iconify 图标名，例如：mdi:home */
  icon?: string;
  /** 本地图标名，最终会拼接为 symbolId，例如 #icon-home */
  localIcon?: string;
  /** 图标大小，支持 number 或 string，默认 14px */
  fontSize?: number | string;
}

// 获取 props（支持类型提示）
const props = withDefaults(defineProps<Props>(), {
  fontSize: 14
});

// 获取组件透传的 HTML 属性（如 class、style）
const attrs = useAttrs();

// 统一绑定外部 class 和 style（为了可以传 class/style 给 <Icon> 或 <svg>）

const bindAttrs = computed(() => {
  const style = (attrs.style as string) || '';
  const fontSize = typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize;

  return {
    class: (attrs.class as string) || '',
    style: `${style}; font-size: ${fontSize};`
  };
});

// 本地图标 <use xlink:href> 的 symbolId，例如：#icon-home
const symbolId = computed(() => {
  // 从环境变量中获取本地图标前缀（比如 VITE_ICON_LOCAL_PREFIX = 'icon'）
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env;

  // 如果没有传 localIcon，默认使用 no-icon
  const defaultLocalIcon = 'no-icon';

  const icon = props.localIcon || defaultLocalIcon;

  // 生成 symbol id，例如：#icon-user
  return `#${prefix}-${icon}`;
});

/**
 * 如果传入了 localIcon 或没传 icon，就渲染本地图标
 * 优先使用本地 SVG 图标，其次是远程 iconify 图标
 */
const renderLocalIcon = computed(() => props.localIcon || !props.icon);
</script>

<template>
  <!-- 渲染本地 svg 图标 -->
  <template v-if="renderLocalIcon">
    <svg aria-hidden="true" width="1em" height="1em" v-bind="bindAttrs">
      <!-- 本项目没启用 要的自己去下载 引用 <symbol> 元素，必须配合 svg-sprite-loader 或 vite-plugin-svg-icons 使用 -->
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </template>
  <!-- 渲染 iconify 图标 -->
  <template v-else>
    <!-- 动态图标，比如 mdi:home、tabler:user 等 -->
    <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" />
  </template>
</template>

<style scoped></style>
